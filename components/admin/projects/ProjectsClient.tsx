"use client";

import { useState, useTransition, useMemo } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { ProjectForm, BLANK_FORM, validateForm, formDataToPayload } from "./ProjectForm";
import { ProjectDrawer } from "./ProjectDrawer";
import type { ProjectFormData, ProjectFormErrors } from "./ProjectForm";
import type { AdminProject } from "./ProjectDrawer";
import type { Column } from "@/components/admin/DataTable";

/* ── Constants ──────────────────────────────────────────────────── */

const CATEGORY_TABS = [
  { value: "all",         label: "All"         },
  { value: "hydropower",  label: "Hydropower"  },
  { value: "solar",       label: "Solar"       },
  { value: "agriculture", label: "Agriculture" },
  { value: "agri-solar",  label: "Agri-Solar"  },
  { value: "tourism",     label: "Tourism"     },
];

const STATUS_OPTIONS = [
  { value: "",                 label: "All Statuses"       },
  { value: "operational",      label: "Operational"        },
  { value: "under_construction", label: "Under Construction" },
  { value: "commissioning",    label: "Commissioning"      },
  { value: "under_development", label: "Under Development"  },
  { value: "licensed",         label: "Licensed"           },
  { value: "on_hold",          label: "On Hold"            },
];

const CATEGORY_DOTS: Record<string, string> = {
  hydropower:   "bg-blue-400",
  solar:        "bg-gold",
  agriculture:  "bg-primary",
  "agri-solar": "bg-teal",
  tourism:      "bg-earth",
};

const PAGE_SIZE = 10;

/* ── Helpers ────────────────────────────────────────────────────── */

function projectToFormData(p: AdminProject): ProjectFormData {
  return {
    name:             p.name,
    category:         p.category,
    status:           p.status,
    isActive:         p.isActive ?? true,
    description:      p.description,
    objectives:       p.objectives ?? "",
    bannerImage:      p.bannerImage ?? "",
    logoImage:        p.logoImage ?? "",
    isFeatured:       p.isFeatured,
    location: {
      district:  p.location.district,
      province:  p.location.province,
      river:     p.location.river ?? "",
      elevation: p.location.elevation != null ? String(p.location.elevation) : "",
    },
    capacity: {
      value: p.capacity?.value != null ? String(p.capacity.value) : "",
      unit:  p.capacity?.unit ?? "MW",
    },
    investmentValue:   p.investmentValue != null ? String(p.investmentValue) : "",
    codDate:           p.codDate ? p.codDate.slice(0, 10) : "",
    constructionStart: p.constructionStart ? p.constructionStart.slice(0, 10) : "",
    ppa: {
      authority: p.ppa?.authority ?? "",
      term:      p.ppa?.term != null ? String(p.ppa.term) : "",
      tariff:    p.ppa?.tariff != null ? String(p.ppa.tariff) : "",
    },
    highlights:     p.highlights ?? [],
    images:         p.images ?? [],
    documents:      (p.documents ?? []).map((d) => ({ url: d.url, name: d.name, type: d.type, size: d.size })),
    timeline:       (p.timeline ?? []).map((m) => ({
      title:       m.title,
      date:        m.date ? m.date.slice(0, 10) : "",
      completed:   m.completed,
      description: m.description ?? "",
    })),
    order:          String(p.order ?? 0),
    seoTitle:       p.seoTitle ?? "",
    seoDescription: p.seoDescription ?? "",
  };
}

/* ── Component ──────────────────────────────────────────────────── */

export default function ProjectsClient({ initialData, initialOpen = false }: { initialData: AdminProject[]; initialOpen?: boolean }) {
  const { success, error } = useToast();

  /* Data */
  const [projects, setProjects] = useState(initialData);

  /* Filters */
  const [tab,    setTab]    = useState("all");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

  /* Modal / drawer */
  const [modalOpen,     setModalOpen]     = useState(initialOpen);
  const [editing,       setEditing]       = useState<AdminProject | null>(null);
  const [detailProject, setDetailProject] = useState<AdminProject | null>(null);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [deleteTarget,  setDeleteTarget]  = useState<AdminProject | null>(null);

  /* Form */
  const [formData, setFormData] = useState<ProjectFormData>(BLANK_FORM);
  const [formErrors, setFormErrors] = useState<ProjectFormErrors>({});
  const [isPending, startTransition] = useTransition();

  /* ── Derived data ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (tab !== "all" && p.category !== tab)   return false;
      if (status && p.status !== status)          return false;
      if (q && !p.name.toLowerCase().includes(q) &&
               !p.description.toLowerCase().includes(q) &&
               !p.location.district.toLowerCase().includes(q) &&
               !p.location.province.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [projects, tab, status, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset page when filters change
  function updateFilter<T>(setter: (v: T) => void, val: T) {
    setter(val);
    setPage(1);
  }

  /* ── Modal helpers ── */
  function openCreate() {
    setEditing(null);
    setFormData(BLANK_FORM);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(p: AdminProject) {
    setEditing(p);
    setFormData(projectToFormData(p));
    setFormErrors({});
    setModalOpen(true);
  }

  function openDetail(p: AdminProject) {
    setDetailProject(p);
    setDrawerOpen(true);
  }

  /* ── Save handler ── */
  function handleSave() {
    const errs = validateForm(formData);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setFormErrors({});

    startTransition(async () => {
      const url    = editing ? `/api/admin/projects/${editing._id}` : "/api/admin/projects";
      const method = editing ? "PUT" : "POST";
      const payload = formDataToPayload(formData);

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        error("Save failed", json.error ?? "Unknown error");
        return;
      }

      if (editing) {
        setProjects((prev) => prev.map((p) => p._id === editing._id ? json.data : p));
        success("Project updated");
      } else {
        setProjects((prev) => [json.data, ...prev]);
        success("Project created");
      }
      setModalOpen(false);
    });
  }

  /* ── Delete handler ── */
  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/projects/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) { error("Delete failed"); return; }
      setProjects((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      success("Project deleted");
      setDeleteTarget(null);
    });
  }

  /* ── Table columns ── */
  const columns: Column<AdminProject>[] = [
    {
      header: "Project", key: "name",
      render: (p) => (
        <div className="flex items-center gap-3 max-w-72">
          <div className={cn("h-2 w-2 shrink-0 rounded-full", CATEGORY_DOTS[p.category] ?? "bg-border")} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-medium text-foreground text-sm truncate">{p.name}</p>
              {p.isFeatured && <Star className="h-3 w-3 shrink-0 text-gold" fill="currentColor" />}
            </div>
            <p className="text-xs text-foreground-subtle truncate">
              {p.location.district}, {p.location.province}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Category", key: "category",
      render: (p) => <span className="capitalize text-xs text-foreground-muted">{p.category}</span>,
    },
    {
      header: "Status", key: "status",
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      header: "Capacity", key: "capacity",
      render: (p) => p.capacity
        ? <span className="text-xs font-medium text-foreground">{p.capacity.value} {p.capacity.unit}</span>
        : <span className="text-xs text-foreground-subtle">—</span>,
    },
    {
      header: "Investment", key: "investmentValue",
      render: (p) => p.investmentValue
        ? <span className="text-xs text-foreground">NPR {p.investmentValue.toLocaleString()} Cr</span>
        : <span className="text-xs text-foreground-subtle">—</span>,
    },
    {
      header: "Images", key: "images",
      render: (p) => (
        <span className="text-xs text-foreground-subtle">{(p.images ?? []).length}</span>
      ),
    },
    {
      header: "", key: "actions", className: "w-8",
      render: (p) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(p); }}
            className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary/10 transition-colors"
            title="Edit"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
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

  /* ── Render ── */
  return (
    <div className="max-w-6xl space-y-5">
      <PageHeader
        title="Projects"
        description={`${projects.length} total · ${projects.filter(p => p.status === "operational").length} operational`}
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Project
          </button>
        }
      />

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search projects…"
            className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Status filter */}
        <Select
          value={status}
          onChange={(e) => updateFilter(setStatus, e.target.value)}
          className="h-9 w-44 text-xs"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>

      {/* Category tabs */}
      <Tabs
        tabs={CATEGORY_TABS.map((t) => ({
          ...t,
          count: t.value === "all"
            ? projects.length
            : projects.filter((p) => p.category === t.value).length,
        }))}
        active={tab}
        onChange={(v) => updateFilter(setTab, v)}
      />

      {/* Results count */}
      {(search || status) && (
        <p className="text-xs text-foreground-subtle">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {search ? ` for "${search}"` : ""}
          {status ? ` · ${STATUS_OPTIONS.find((o) => o.value === status)?.label}` : ""}
          {" "}
          <button
            onClick={() => { setSearch(""); setStatus(""); setPage(1); }}
            className="text-primary hover:underline"
          >
            Clear
          </button>
        </p>
      )}

      {/* Table */}
      <div className="[&_tr]:group">
        <DataTable
          columns={columns}
          data={paginated}
          keyExtractor={(p) => p._id}
          onRowClick={openDetail}
          emptyTitle="No projects found"
          emptyDescription={
            search || status || tab !== "all"
              ? "Try adjusting your filters."
              : "Add your first project to get started."
          }
        />
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-foreground-subtle">
            {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
              .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("…");
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === "…"
                  ? <span key={`ellipsis-${i}`} className="px-1 text-xs text-foreground-subtle">…</span>
                  : (
                    <button
                      key={n}
                      onClick={() => setPage(n as number)}
                      className={cn(
                        "h-7 w-7 rounded-lg text-xs font-medium transition-colors",
                        safePage === n
                          ? "bg-primary text-white"
                          : "text-foreground-muted hover:text-foreground hover:bg-surface"
                      )}
                    >
                      {n}
                    </button>
                  )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit: ${editing.name}` : "Add New Project"}
        size="xl"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground rounded-lg hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isPending && (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              )}
              {editing ? "Save Changes" : "Create Project"}
            </button>
          </>
        }
      >
        <ProjectForm
          data={formData}
          onChange={setFormData}
          errors={formErrors}
        />
      </Dialog>

      {/* Detail drawer */}
      <ProjectDrawer
        project={detailProject}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={openEdit}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isPending}
        title="Delete project?"
        description={`"${deleteTarget?.name}" and all its data will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete Project"
      />
    </div>
  );
}
