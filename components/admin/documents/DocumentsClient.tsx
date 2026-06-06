"use client";

import { useState, useMemo, useTransition } from "react";
import {
  Plus, Search, Download, Lock, Pencil, Trash2,
  BookOpen, BarChart3, Shield, Bell, FileText, Scale,
  Leaf, Briefcase, TrendingUp, ExternalLink, ChevronLeft, ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────── */

type DocumentType =
  | "annual_report" | "quarterly_results" | "prospectus"
  | "agm_notice" | "agm_minutes" | "board_resolution"
  | "governance_policy" | "sustainability_report" | "project_brief" | "other";

interface AdminDoc {
  _id: string;
  title: string;
  type: DocumentType;
  fiscalYear?: string;
  description?: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  isRestricted: boolean;
  allowedRoles: string[];
  downloadCount: number;
  publishedAt?: string;
  order: number;
  showOnHomepage: boolean;
  homepageLabel?: string;
  createdAt: string;
}

interface FormData {
  title: string; type: DocumentType; fiscalYear: string;
  description: string; fileUrl: string; fileSize: string;
  fileType: string; isRestricted: boolean; publishedAt: string; order: string;
  showOnHomepage: boolean; homepageLabel: string;
}

const BLANK: FormData = {
  title: "", type: "annual_report", fiscalYear: "", description: "",
  fileUrl: "", fileSize: "", fileType: "pdf",
  isRestricted: false, publishedAt: "", order: "0",
  showOnHomepage: false, homepageLabel: "",
};

/* ── Document type config ───────────────────────────────────────── */

interface TypeConfig { label: string; icon: React.ElementType; pill: string; tab: string }

const TYPE_CONFIG: Record<string, TypeConfig> = {
  annual_report:        { label: "Annual Report",     icon: BookOpen,    pill: "bg-primary/10 text-primary border-primary/20",      tab: "reports"    },
  quarterly_results:    { label: "Quarterly Results", icon: BarChart3,   pill: "bg-gold/10 text-gold border-gold/20",                tab: "financials" },
  prospectus:           { label: "Prospectus",        icon: TrendingUp,  pill: "bg-teal/10 text-teal border-teal/20",                tab: "financials" },
  agm_notice:           { label: "AGM Notice",        icon: Bell,        pill: "bg-amber-500/10 text-amber-400 border-amber-500/20", tab: "agm"        },
  agm_minutes:          { label: "AGM Minutes",       icon: FileText,    pill: "bg-amber-500/10 text-amber-400 border-amber-500/20", tab: "agm"        },
  board_resolution:     { label: "Board Resolution",  icon: Scale,       pill: "bg-purple-500/10 text-purple-400 border-purple-500/20", tab: "governance" },
  governance_policy:    { label: "Gov. Policy",       icon: Shield,      pill: "bg-purple-500/10 text-purple-400 border-purple-500/20", tab: "governance" },
  sustainability_report:{ label: "Sustainability",    icon: Leaf,        pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", tab: "reports" },
  project_brief:        { label: "Project Brief",     icon: Briefcase,   pill: "bg-blue-500/10 text-blue-400 border-blue-500/20",    tab: "other"      },
  other:                { label: "Other",             icon: FileText,    pill: "bg-foreground-subtle/10 text-foreground-muted border-border", tab: "other" },
};

const TABS = [
  { id: "all",        label: "All",          types: null                                                            },
  { id: "reports",    label: "Reports",      types: ["annual_report", "sustainability_report"]                     },
  { id: "financials", label: "Financials",   types: ["quarterly_results", "prospectus"]                           },
  { id: "governance", label: "Governance",   types: ["governance_policy", "board_resolution"]                     },
  { id: "agm",        label: "AGM & Notices",types: ["agm_notice", "agm_minutes"]                                 },
  { id: "other",      label: "Other",        types: ["project_brief", "other"]                                    },
] as const;

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: "annual_report",         label: "Annual Report"       },
  { value: "quarterly_results",     label: "Quarterly Results"   },
  { value: "prospectus",            label: "Prospectus"          },
  { value: "agm_notice",            label: "AGM Notice"          },
  { value: "agm_minutes",           label: "AGM Minutes"         },
  { value: "board_resolution",      label: "Board Resolution"    },
  { value: "governance_policy",     label: "Governance Policy"   },
  { value: "sustainability_report", label: "Sustainability Report"},
  { value: "project_brief",         label: "Project Brief"       },
  { value: "other",                 label: "Other"               },
];

/* ── Helpers ────────────────────────────────────────────────────── */

function fmtSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1_048_576)   return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function fmtDate(d?: string): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
}

const PAGE_SIZE = 12;

/* ── Stat card ──────────────────────────────────────────────────── */

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number; icon: React.ElementType; accent: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className={cn("h-9 w-9 shrink-0 rounded-lg flex items-center justify-center", accent)}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-lg font-bold text-foreground leading-none">{value.toLocaleString()}</p>
        <p className="text-[11px] text-foreground-subtle mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */

export default function DocumentsClient({ initialData }: { initialData: AdminDoc[] }) {
  const { success, error } = useToast();
  const [docs, setDocs]   = useState(initialData);
  const [tab, setTab]     = useState<string>("all");
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [page, setPage]   = useState(1);
  const [form, setForm]   = useState<FormData>(BLANK);
  const [editing, setEditing] = useState<AdminDoc | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminDoc | null>(null);
  const [isPending, startTransition] = useTransition();

  /* ── Derived ── */
  const years = useMemo(() => {
    const s = new Set(docs.map((d) => d.fiscalYear).filter(Boolean) as string[]);
    return Array.from(s).sort((a, b) => b.localeCompare(a));
  }, [docs]);

  const filtered = useMemo(() => {
    const q    = search.trim().toLowerCase();
    const tabCfg = TABS.find((t) => t.id === tab);
    return docs.filter((d) => {
      if (tabCfg?.types && !tabCfg.types.includes(d.type as never)) return false;
      if (yearFilter && d.fiscalYear !== yearFilter) return false;
      if (accessFilter === "public" && d.isRestricted) return false;
      if (accessFilter === "restricted" && !d.isRestricted) return false;
      if (q && !d.title.toLowerCase().includes(q) && !(d.description ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [docs, tab, yearFilter, accessFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const stats = useMemo(() => ({
    total:      docs.length,
    downloads:  docs.reduce((s, d) => s + d.downloadCount, 0),
    restricted: docs.filter((d) => d.isRestricted).length,
    public:     docs.filter((d) => !d.isRestricted).length,
  }), [docs]);

  /* ── Handlers ── */
  function openCreate() { setEditing(null); setForm(BLANK); setModalOpen(true); }
  function openEdit(d: AdminDoc) {
    setEditing(d);
    setForm({
      title: d.title, type: d.type, fiscalYear: d.fiscalYear ?? "",
      description: d.description ?? "", fileUrl: d.fileUrl,
      fileSize: d.fileSize ? String(d.fileSize) : "", fileType: d.fileType ?? "pdf",
      isRestricted: d.isRestricted,
      publishedAt: d.publishedAt ? d.publishedAt.slice(0, 10) : "",
      order: String(d.order ?? 0),
      showOnHomepage: d.showOnHomepage ?? false,
      homepageLabel: d.homepageLabel ?? "",
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.title.trim() || !form.type || !form.fileUrl.trim()) {
      error("Validation", "Title, type, and file URL are required");
      return;
    }
    startTransition(async () => {
      const url    = editing ? `/api/admin/documents/${editing._id}` : "/api/admin/documents";
      const method = editing ? "PUT" : "POST";
      const payload = {
        title:          form.title.trim(),
        type:           form.type,
        fiscalYear:     form.fiscalYear || undefined,
        description:    form.description || undefined,
        fileUrl:        form.fileUrl.trim(),
        fileSize:       form.fileSize ? Number(form.fileSize) : undefined,
        fileType:       form.fileType,
        isRestricted:   form.isRestricted,
        publishedAt:    form.publishedAt || undefined,
        order:          Number(form.order) || 0,
        showOnHomepage: form.showOnHomepage,
        homepageLabel:  form.homepageLabel.trim() || undefined,
      };
      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) { error("Save failed", json.error); return; }
      if (editing) {
        setDocs((prev) => prev.map((d) => d._id === editing._id ? json.data : d));
        success("Document updated");
      } else {
        setDocs((prev) => [json.data, ...prev]);
        success("Document added");
      }
      setModalOpen(false);
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/documents/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) { error("Delete failed"); return; }
      setDocs((prev) => prev.filter((d) => d._id !== deleteTarget._id));
      success("Document removed");
      setDeleteTarget(null);
    });
  }

  function updateFilter<T>(setter: (v: T) => void, v: T) { setter(v); setPage(1); }

  /* ── Render ── */
  return (
    <div className="max-w-6xl space-y-5">
      <PageHeader
        title="Investor Documents"
        description={`${docs.length} document${docs.length !== 1 ? "s" : ""} · ${stats.downloads.toLocaleString()} total downloads`}
        actions={
          <button onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add Document
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Documents"  value={stats.total}      icon={FileText}   accent="bg-primary/10 text-primary" />
        <StatCard label="Total Downloads"  value={stats.downloads}  icon={Download}   accent="bg-teal/10 text-teal" />
        <StatCard label="Public Access"    value={stats.public}     icon={BookOpen}   accent="bg-gold/10 text-gold" />
        <StatCard label="Restricted"       value={stats.restricted} icon={Lock}       accent="bg-purple-500/10 text-purple-400" />
      </div>

      {/* Category tabs */}
      <div className="flex gap-0.5 border-b border-border overflow-x-auto">
        {TABS.map((t) => {
          const count = t.types
            ? docs.filter((d) => t.types!.includes(d.type as never)).length
            : docs.length;
          return (
            <button key={t.id} onClick={() => updateFilter(setTab, t.id)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === t.id ? "border-primary text-primary" : "border-transparent text-foreground-muted hover:text-foreground"
              )}>
              {t.label}
              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                tab === t.id ? "bg-primary/20 text-primary" : "bg-surface text-foreground-muted")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle pointer-events-none" />
          <input type="text" value={search} onChange={(e) => updateFilter(setSearch, e.target.value)}
            placeholder="Search documents…"
            className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <Select value={yearFilter} onChange={(e) => updateFilter(setYearFilter, e.target.value)} className="h-9 w-36 text-xs">
          <option value="">All Years</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </Select>
        <Select value={accessFilter} onChange={(e) => updateFilter(setAccessFilter, e.target.value)} className="h-9 w-36 text-xs">
          <option value="">All Access</option>
          <option value="public">Public</option>
          <option value="restricted">Restricted</option>
        </Select>
      </div>

      {/* Results info */}
      {(search || yearFilter || accessFilter) && (
        <p className="text-xs text-foreground-subtle">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          <button onClick={() => { setSearch(""); setYearFilter(""); setAccessFilter(""); setPage(1); }}
            className="ml-2 text-primary hover:underline">Clear</button>
        </p>
      )}

      {/* Documents table */}
      {paged.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-16 text-center">
          <FileText className="h-8 w-8 text-foreground-subtle/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground-muted">No documents found</p>
          <p className="text-xs text-foreground-subtle mt-1">Try adjusting filters or add a new document.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                {["Document", "Type", "Fiscal Year", "Access", "Homepage", "File", "Downloads", "Published", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-foreground-subtle whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {paged.map((doc) => {
                const cfg  = TYPE_CONFIG[doc.type] ?? TYPE_CONFIG.other;
                const Icon = cfg.icon;
                return (
                  <tr key={doc._id} className="hover:bg-surface transition-colors group">
                    {/* Document */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className={cn("h-8 w-8 shrink-0 rounded-lg flex items-center justify-center border", cfg.pill)}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate leading-tight">{doc.title}</p>
                          {doc.description && (
                            <p className="text-[11px] text-foreground-subtle truncate">{doc.description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border", cfg.pill)}>
                        {cfg.label}
                      </span>
                    </td>

                    {/* Fiscal Year */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-foreground-muted">{doc.fiscalYear || "—"}</span>
                    </td>

                    {/* Access */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {doc.isRestricted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/20">
                          <Lock className="h-2.5 w-2.5" /> Restricted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/20">
                          Public
                        </span>
                      )}
                    </td>

                    {/* Homepage */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {doc.showOnHomepage ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-gold/10 text-gold border-gold/20">
                          Popup On
                        </span>
                      ) : (
                        <span className="text-[10px] text-foreground-subtle">—</span>
                      )}
                    </td>

                    {/* File */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-surface border border-border text-foreground-muted">
                          {doc.fileType ?? "PDF"}
                        </span>
                        <span className="text-xs text-foreground-subtle">{fmtSize(doc.fileSize)}</span>
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground-subtle hover:text-primary">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>

                    {/* Downloads */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-xs text-foreground-muted">
                        <Download className="h-3 w-3" />
                        {doc.downloadCount.toLocaleString()}
                      </span>
                    </td>

                    {/* Published */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-foreground-subtle">{fmtDate(doc.publishedAt ?? doc.createdAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(doc)}
                          className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary/10 transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(doc)}
                          className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-foreground-subtle">
            {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
              className="p-1.5 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={cn("h-7 w-7 rounded-lg text-xs font-medium transition-colors",
                  safePage === n ? "bg-primary text-white" : "text-foreground-muted hover:text-foreground hover:bg-surface")}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              className="p-1.5 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Edit Document" : "Add Investor Document"} size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground rounded-lg hover:bg-surface transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              {editing ? "Save Changes" : "Add Document"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Title <span className="text-red-400">*</span></label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Annual Report FY 2081/82" />
          </div>

          {/* Type + Fiscal Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Document Type <span className="text-red-400">*</span></label>
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DocumentType })}>
                {DOC_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Fiscal Year</label>
              <Input value={form.fiscalYear} onChange={(e) => setForm({ ...form, fiscalYear: e.target.value })}
                placeholder="FY 2081/82" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Description <span className="text-foreground-subtle font-normal">(shown to investors)</span>
            </label>
            <Textarea rows={2} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Comprehensive annual review including financial statements, project updates, and ESG performance…"
              maxLength={500} />
            <p className="mt-1 text-right text-[10px] text-foreground-subtle">{form.description.length}/500</p>
          </div>

          {/* File URL */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">File URL <span className="text-red-400">*</span></label>
            <Input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              placeholder="https://cdn.ghamkhetiguru.com/reports/annual-2082.pdf" />
            <p className="mt-1 text-[11px] text-foreground-subtle">Upload the file to your CDN first, then paste the public URL here.</p>
          </div>

          {/* File Size + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">File Size (bytes)</label>
              <Input type="number" value={form.fileSize}
                onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                placeholder="8847360" />
              {form.fileSize && (
                <p className="mt-1 text-[10px] text-foreground-subtle">
                  ≈ {Number(form.fileSize) < 1_048_576
                    ? `${(Number(form.fileSize) / 1024).toFixed(0)} KB`
                    : `${(Number(form.fileSize) / 1_048_576).toFixed(1)} MB`}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">File Format</label>
              <Select value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })}>
                <option value="pdf">PDF</option>
                <option value="xlsx">Excel (XLSX)</option>
                <option value="docx">Word (DOCX)</option>
                <option value="pptx">PowerPoint (PPTX)</option>
                <option value="zip">ZIP Archive</option>
                <option value="other">Other</option>
              </Select>
            </div>
          </div>

          {/* Published + Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Publish Date</label>
              <Input type="date" value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Display Order</label>
              <Input type="number" value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                placeholder="0" />
            </div>
          </div>

          {/* Access control */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <Switch checked={form.isRestricted}
              onChange={(v) => setForm({ ...form, isRestricted: v })}
              label={form.isRestricted
                ? "Restricted — contact required for access"
                : "Public — available to all visitors"} />
            {form.isRestricted && (
              <p className="mt-2 text-[11px] text-foreground-subtle">
                Restricted documents are listed on the public page with a lock icon but have no download link. Visitors are directed to contact the IR team.
              </p>
            )}
          </div>

          {/* Homepage popup */}
          <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
            <Switch checked={form.showOnHomepage}
              onChange={(v) => setForm({ ...form, showOnHomepage: v })}
              label={form.showOnHomepage
                ? "Show announcement popup on homepage"
                : "Do not show on homepage"} />
            {form.showOnHomepage && (
              <>
                <p className="text-[11px] text-foreground-subtle">
                  A dismissable popup will appear on the homepage when visitors land on the site, announcing this document.
                </p>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Popup CTA Label <span className="text-foreground-subtle font-normal">(optional)</span></label>
                  <Input
                    value={form.homepageLabel}
                    onChange={(e) => setForm({ ...form, homepageLabel: e.target.value })}
                    placeholder="Download Annual Report 2081/82"
                  />
                  <p className="mt-1 text-[10px] text-foreground-subtle">Leave blank to use the document title as the button label.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} isLoading={isPending}
        title="Remove document?"
        description={`"${deleteTarget?.title}" will be permanently removed and no longer accessible to investors.`}
        confirmLabel="Remove Document"
      />
    </div>
  );
}
