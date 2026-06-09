"use client";

import { useState, useTransition, useMemo } from "react";
import { Plus, Search, Star, Eye, EyeOff } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { SubsidiaryForm, BLANK_FORM, validateForm, formDataToPayload } from "./SubsidiaryForm";
import { SubsidiaryDrawer } from "./SubsidiaryDrawer";
import type { SubsidiaryFormData, SubsidiaryFormErrors } from "./SubsidiaryForm";
import type { AdminSubsidiary } from "./SubsidiaryDrawer";
import type { Column } from "@/components/admin/DataTable";

/* ── helpers ───────────────────────────────────────────────────── */

function subsidiaryToFormData(s: AdminSubsidiary): SubsidiaryFormData {
  return {
    name:             s.name,
    industry:         s.industry,
    shortDescription: s.shortDescription,
    description:      s.description,
    location:         s.location,
    ownership:        s.ownership,
    establishedYear:  s.establishedYear != null ? String(s.establishedYear) : "",
    logoImage:        s.logoImage  ?? "",
    bannerImage:      s.bannerImage ?? "",
    gallery:          s.gallery    ?? [],
    activities:       (s.activities ?? []).map((a) => ({ ...a })),
    products:         (s.products  ?? []).map((p) => ({ ...p, image: p.image ?? "" })),
    contact: {
      phone:   s.contact?.phone   ?? "",
      email:   s.contact?.email   ?? "",
      website: s.contact?.website ?? "",
    },
    isActive:         s.isActive,
    isFeatured:       s.isFeatured,
    order:            String(s.order ?? 0),
    seoTitle:         s.seoTitle        ?? "",
    seoDescription:   s.seoDescription  ?? "",
    ogImage:          s.ogImage         ?? "",
  };
}

/* ── component ─────────────────────────────────────────────────── */

export default function SubsidiariesClient({
  initialData,
  initialOpen = false,
}: {
  initialData: AdminSubsidiary[];
  initialOpen?: boolean;
}) {
  const { success, error } = useToast();
  const [subsidiaries, setSubsidiaries] = useState(initialData);
  const [search, setSearch] = useState("");
  const [modalOpen,     setModalOpen]     = useState(initialOpen);
  const [editing,       setEditing]       = useState<AdminSubsidiary | null>(null);
  const [drawerItem,    setDrawerItem]    = useState<AdminSubsidiary | null>(null);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState<AdminSubsidiary | null>(null);
  const [formData,      setFormData]      = useState<SubsidiaryFormData>(BLANK_FORM);
  const [formErrors,    setFormErrors]    = useState<SubsidiaryFormErrors>({});
  const [isPending,     startTransition]  = useTransition();
  const [seeding,       setSeeding]       = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subsidiaries;
    return subsidiaries.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.industry.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    );
  }, [subsidiaries, search]);

  function openCreate() {
    setEditing(null);
    setFormData(BLANK_FORM);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(s: AdminSubsidiary) {
    setEditing(s);
    setFormData(subsidiaryToFormData(s));
    setFormErrors({});
    setModalOpen(true);
  }

  function openDetail(s: AdminSubsidiary) {
    setDrawerItem(s);
    setDrawerOpen(true);
  }

  /* toggle active */
  async function toggleActive(s: AdminSubsidiary) {
    const res  = await fetch(`/api/admin/subsidiaries/${s._id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ isActive: !s.isActive }),
    });
    const json = await res.json();
    if (!res.ok) { error("Update failed"); return; }
    setSubsidiaries((prev) => prev.map((x) => x._id === s._id ? json.data : x));
    success(json.data.isActive ? "Subsidiary activated" : "Subsidiary deactivated");
  }

  function handleSave() {
    const errs = validateForm(formData);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});

    startTransition(async () => {
      const url    = editing ? `/api/admin/subsidiaries/${editing._id}` : "/api/admin/subsidiaries";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(formDataToPayload(formData)),
      });
      const json = await res.json();
      if (!res.ok) { error("Save failed", json.error ?? "Unknown error"); return; }

      if (editing) {
        setSubsidiaries((prev) => prev.map((s) => s._id === editing._id ? json.data : s));
        success("Subsidiary updated");
      } else {
        setSubsidiaries((prev) => [json.data, ...prev]);
        success("Subsidiary created");
      }
      setModalOpen(false);
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/subsidiaries/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) { error("Delete failed"); return; }
      setSubsidiaries((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      success("Subsidiary deleted");
      setDeleteTarget(null);
    });
  }

  async function handleSeed() {
    setSeeding(true);
    const res  = await fetch("/api/admin/subsidiaries/seed", { method: "POST" });
    const json = await res.json();
    setSeeding(false);
    if (!res.ok) { error("Seed failed"); return; }
    if (!json.data.seeded) { success("Already seeded — no changes made"); return; }
    // Reload data
    const r2 = await fetch("/api/admin/subsidiaries");
    const j2 = await r2.json();
    if (r2.ok) setSubsidiaries(j2.data ?? []);
    success("Initial subsidiary seeded!");
  }

  /* columns */
  const columns: Column<AdminSubsidiary>[] = [
    {
      header: "Subsidiary", key: "name",
      render: (s) => (
        <div className="flex items-center gap-3 max-w-72">
          {s.logoImage
            ? <img src={s.logoImage} alt="" className="h-8 w-8 rounded-lg object-contain bg-surface border border-border p-0.5 shrink-0" />
            : <div className="h-8 w-8 rounded-lg bg-surface-raised border border-border shrink-0 flex items-center justify-center text-[10px] font-bold text-foreground-subtle">{s.name.charAt(0)}</div>
          }
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-medium text-sm text-foreground truncate">{s.name}</p>
              {s.isFeatured && <Star className="h-3 w-3 shrink-0 text-gold" fill="currentColor" />}
            </div>
            <p className="text-xs text-foreground-subtle truncate">{s.industry}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Location", key: "location",
      render: (s) => <span className="text-xs text-foreground-muted">{s.location || "—"}</span>,
    },
    {
      header: "Status", key: "isActive",
      render: (s) => (
        <span className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
          s.isActive
            ? "bg-primary/10 text-primary border-primary/25"
            : "bg-surface-raised text-foreground-subtle border-border"
        )}>
          {s.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Products", key: "products",
      render: (s) => <span className="text-xs text-foreground-subtle">{s.products?.length ?? 0}</span>,
    },
    {
      header: "", key: "actions", className: "w-8",
      render: (s) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); toggleActive(s); }}
            className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary/10 transition-colors"
            title={s.isActive ? "Deactivate" : "Activate"}
          >
            {s.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(s); }}
            className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary/10 transition-colors"
            title="Edit"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(s); }}
            className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl space-y-5">
      <PageHeader
        title="Subsidiaries"
        description={`${subsidiaries.length} total · ${subsidiaries.filter((s) => s.isActive).length} active`}
        actions={
          <div className="flex items-center gap-2">
            {subsidiaries.length === 0 && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-border text-foreground-muted hover:text-foreground hover:bg-surface transition-colors disabled:opacity-50"
              >
                {seeding ? "Seeding…" : "Seed Initial Data"}
              </button>
            )}
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Subsidiary
            </button>
          </div>
        }
      />

      {/* Search */}
      <div className="relative max-w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subsidiaries…"
          className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="[&_tr]:group">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(s) => s._id}
          onRowClick={openDetail}
          emptyTitle="No subsidiaries found"
          emptyDescription={search ? "Try a different search." : "Add your first subsidiary or seed initial data."}
        />
      </div>

      {/* Create / Edit modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit: ${editing.name}` : "Add New Subsidiary"}
        size="xl"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground rounded-lg hover:bg-surface transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isPending && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              {editing ? "Save Changes" : "Create Subsidiary"}
            </button>
          </>
        }
      >
        <SubsidiaryForm data={formData} onChange={setFormData} errors={formErrors} />
      </Dialog>

      {/* Detail drawer */}
      <SubsidiaryDrawer subsidiary={drawerItem} open={drawerOpen} onClose={() => setDrawerOpen(false)} onEdit={openEdit} />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isPending}
        title="Delete subsidiary?"
        description={`"${deleteTarget?.name}" and all its data will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete Subsidiary"
      />
    </div>
  );
}
