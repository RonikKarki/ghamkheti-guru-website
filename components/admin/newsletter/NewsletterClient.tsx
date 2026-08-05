"use client";

import { useState, useTransition, useMemo } from "react";
import { Search, Trash2, Download, Mail } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/toast";
import type { Column } from "@/components/admin/DataTable";

interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function NewsletterClient({ initialData }: { initialData: Subscriber[] }) {
  const { success, error } = useToast();
  const [subscribers, setSubscribers] = useState(initialData);
  const [search, setSearch]           = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null);
  const [isPending, startTransition]  = useTransition();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, search]);

  function toggleActive(s: Subscriber) {
    startTransition(async () => {
      const res = await fetch(`/api/admin/newsletter/${s._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !s.isActive }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { error("Update failed", json.error); return; }
      setSubscribers((prev) => prev.map((x) => x._id === s._id ? { ...x, isActive: !s.isActive } : x));
      success(s.isActive ? "Marked inactive" : "Marked active");
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/newsletter/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        error("Delete failed", json.error);
        return;
      }
      setSubscribers((prev) => prev.filter((x) => x._id !== deleteTarget._id));
      success("Subscriber removed");
      setDeleteTarget(null);
    });
  }

  function exportCsv() {
    const rows = [["Email", "Status", "Subscribed At"], ...filtered.map((s) => [s.email, s.isActive ? "Active" : "Inactive", fmtDate(s.createdAt)])];
    const csv  = rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const columns: Column<Subscriber>[] = [
    { header: "Email", key: "email", render: (s) => (
      <div className="flex items-center gap-2.5">
        <Mail className="h-3.5 w-3.5 text-foreground-subtle shrink-0" />
        <span className="text-sm text-foreground">{s.email}</span>
      </div>
    )},
    { header: "Status", key: "isActive", render: (s) => (
      <button
        onClick={() => toggleActive(s)}
        disabled={isPending}
        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors ${
          s.isActive
            ? "border-primary/30 text-primary bg-primary/10"
            : "border-border text-foreground-subtle bg-surface"
        }`}
      >
        {s.isActive ? "Active" : "Inactive"}
      </button>
    )},
    { header: "Subscribed", key: "createdAt", render: (s) =>
      <span className="text-xs text-foreground-subtle">{fmtDate(s.createdAt)}</span>
    },
    { header: "", key: "actions", className: "w-12", render: (s) => (
      <button
        onClick={() => setDeleteTarget(s)}
        className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
        aria-label="Remove subscriber"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    )},
  ];

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader
        title="Newsletter Subscribers"
        description={`${subscribers.filter((s) => s.isActive).length} active · ${subscribers.length} total`}
        actions={
          <button
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-border text-foreground-muted hover:text-foreground hover:border-foreground-subtle disabled:opacity-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        }
      />

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search email…"
          className="pl-9 text-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(s) => s._id}
        emptyTitle="No subscribers yet"
        emptyDescription="Emails collected from the footer newsletter form will appear here."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isPending}
        title="Remove subscriber?"
        description={`This will permanently remove ${deleteTarget?.email} from the subscriber list. This cannot be undone.`}
        confirmLabel="Remove"
      />
    </div>
  );
}

function fmtDate(d: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
}
