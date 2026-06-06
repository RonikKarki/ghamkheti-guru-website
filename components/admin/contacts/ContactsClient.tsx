"use client";

import { useState, useTransition, useMemo } from "react";
import { MessageSquare, Mail, Phone, Building2, ChevronRight, Trash2, Search } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/lib/toast";
import type { Column } from "@/components/admin/DataTable";

interface Contact {
  _id: string; name: string; email: string; phone?: string;
  organisation?: string; enquiryType: string; subject: string;
  message: string; status: string; priority: string;
  internalNotes: string; createdAt: string;
}

const STATUS_TABS = [
  { value: "all",         label: "All" },
  { value: "new",         label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "replied",     label: "Replied" },
  { value: "closed",      label: "Closed" },
];

export default function ContactsClient({ initialData }: { initialData: Contact[] }) {
  const { success, error } = useToast();
  const [contacts, setContacts] = useState(initialData);
  const [tab, setTab]                 = useState("all");
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [notes, setNotes]             = useState("");
  const [isPending, startTransition]  = useTransition();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return contacts.filter((c) => {
      if (tab !== "all" && c.status !== tab) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        (c.organisation ?? "").toLowerCase().includes(q)
      );
    });
  }, [contacts, tab, search]);

  function openDetail(c: Contact) { setSelected(c); setNotes(c.internalNotes ?? ""); }

  function updateContact(id: string, patch: Partial<Pick<Contact, "status" | "priority" | "internalNotes">>) {
    startTransition(async () => {
      const res  = await fetch(`/api/admin/contacts/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!res.ok) { error("Update failed", json.error); return; }
      setContacts((prev) => prev.map((c) => c._id === id ? { ...c, ...patch } : c));
      if (selected?._id === id) setSelected((prev) => prev ? { ...prev, ...patch } : prev);
      success("Contact updated");
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/contacts/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        error("Delete failed", json.error);
        return;
      }
      setContacts((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      if (selected?._id === deleteTarget._id) setSelected(null);
      success("Submission deleted");
      setDeleteTarget(null);
    });
  }

  const columns: Column<Contact>[] = [
    { header: "From", key: "name", render: (c) => (
      <div>
        <p className="font-medium text-foreground text-sm">{c.name}</p>
        <p className="text-xs text-foreground-subtle">{c.email}</p>
      </div>
    )},
    { header: "Organisation", key: "organisation", render: (c) =>
      <span className="text-xs text-foreground-muted">{c.organisation || "—"}</span>
    },
    { header: "Enquiry", key: "enquiryType", render: (c) =>
      <span className="capitalize text-xs text-foreground-muted">{c.enquiryType.replace(/_/g, " ")}</span>
    },
    { header: "Status",   key: "status",   render: (c) => <StatusBadge status={c.status} /> },
    { header: "Priority", key: "priority", render: (c) => <StatusBadge status={c.priority} /> },
    { header: "Received", key: "createdAt", render: (c) =>
      <span className="text-xs text-foreground-subtle">{fmtDate(c.createdAt)}</span>
    },
    { header: "", key: "actions", className: "w-16", render: (c) => (
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); setDeleteTarget(c); }}
          className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
          aria-label="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-foreground-subtle" />
      </div>
    )},
  ];

  return (
    <div className="max-w-6xl space-y-5">
      <PageHeader
        title="Contact Submissions"
        description={`${contacts.filter(c => c.status === "new").length} unread · ${contacts.length} total`}
      />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, subject…"
            className="pl-9 text-sm"
          />
        </div>
      </div>

      <Tabs
        tabs={STATUS_TABS.map(t => ({
          ...t,
          count: t.value === "all"
            ? contacts.length
            : contacts.filter(c => c.status === t.value).length,
        }))}
        active={tab}
        onChange={setTab}
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(c) => c._id}
        onRowClick={openDetail}
        emptyTitle="No submissions"
        emptyDescription="Contact form submissions will appear here."
      />

      {/* Detail modal */}
      {selected && (
        <Dialog
          open={!!selected}
          onClose={() => setSelected(null)}
          title="Contact Submission"
          size="lg"
          footer={
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setDeleteTarget(selected); setSelected(null); }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" /> Reply via Email
              </a>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Contact info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 rounded-lg bg-surface border border-border p-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-foreground-subtle">Email</p>
                  <p className="text-xs font-medium text-foreground truncate">{selected.email}</p>
                </div>
              </div>
              {selected.phone && (
                <div className="flex items-center gap-2.5 rounded-lg bg-surface border border-border p-3">
                  <Phone className="h-4 w-4 text-teal shrink-0" />
                  <div>
                    <p className="text-[10px] text-foreground-subtle">Phone</p>
                    <p className="text-xs font-medium text-foreground">{selected.phone}</p>
                  </div>
                </div>
              )}
              {selected.organisation && (
                <div className="flex items-center gap-2.5 rounded-lg bg-surface border border-border p-3">
                  <Building2 className="h-4 w-4 text-gold shrink-0" />
                  <div>
                    <p className="text-[10px] text-foreground-subtle">Organisation</p>
                    <p className="text-xs font-medium text-foreground">{selected.organisation}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2.5 rounded-lg bg-surface border border-border p-3">
                <MessageSquare className="h-4 w-4 text-foreground-subtle shrink-0" />
                <div>
                  <p className="text-[10px] text-foreground-subtle">Enquiry Type</p>
                  <p className="text-xs font-medium text-foreground capitalize">{selected.enquiryType.replace(/_/g, " ")}</p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">{selected.subject}</p>
              <p className="text-sm text-foreground-muted leading-relaxed whitespace-pre-wrap bg-surface border border-border rounded-lg p-3">{selected.message}</p>
            </div>

            {/* Status controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Status</label>
                <Select value={selected.status} onChange={(e) => updateContact(selected._id, { status: e.target.value })}>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="in_progress">In Progress</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Priority</label>
                <Select value={selected.priority} onChange={(e) => updateContact(selected._id, { priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Internal Notes</label>
              <Textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => notes !== selected.internalNotes && updateContact(selected._id, { internalNotes: notes })}
                placeholder="Private notes visible only to admin team..."
              />
            </div>
          </div>
        </Dialog>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isPending}
        title="Delete submission?"
        description={`This will permanently remove the message from ${deleteTarget?.name}. This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

function fmtDate(d: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
}
