"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/lib/toast";
import type { Column } from "@/components/admin/DataTable";

interface Article {
  _id: string; slug: string; title: string; excerpt: string; content: string;
  category: string; status: string; author: string; isFeatured: boolean;
  views: number; publishedAt?: string; createdAt: string;
}

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft",     label: "Drafts" },
  { value: "archived",  label: "Archived" },
];

const BLANK = {
  title: "", excerpt: "", content: "", category: "corporate",
  status: "draft", author: "Ghamkheti Guru", isFeatured: false,
};

export default function NewsClient({ initialData, initialOpen = false }: { initialData: Article[]; initialOpen?: boolean }) {
  const { success, error } = useToast();
  const [articles, setArticles] = useState(initialData);
  const [tab, setTab]   = useState("all");
  const [form, setForm] = useState(BLANK);
  const [editing, setEditing]   = useState<Article | null>(null);
  const [modalOpen, setModalOpen] = useState(initialOpen);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = articles.filter((a) => tab === "all" || a.status === tab);

  function openCreate() { setEditing(null); setForm(BLANK); setModalOpen(true); }
  function openEdit(a: Article) {
    setEditing(a);
    setForm({ title: a.title, excerpt: a.excerpt, content: a.content,
      category: a.category, status: a.status, author: a.author, isFeatured: a.isFeatured });
    setModalOpen(true);
  }

  function handleSave() {
    startTransition(async () => {
      const url    = editing ? `/api/admin/news/${editing._id}` : "/api/admin/news";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json   = await res.json();
      if (!res.ok) { error("Save failed", json.error); return; }
      if (editing) {
        setArticles((prev) => prev.map((a) => a._id === editing._id ? json.data : a));
        success("Article updated");
      } else {
        setArticles((prev) => [json.data, ...prev]);
        success("Article created");
      }
      setModalOpen(false);
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/news/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) { error("Delete failed"); return; }
      setArticles((prev) => prev.filter((a) => a._id !== deleteTarget._id));
      success("Article deleted");
      setDeleteTarget(null);
    });
  }

  const columns: Column<Article>[] = [
    { header: "Title", key: "title", render: (a) => (
      <div className="max-w-72">
        <p className="font-medium text-foreground text-sm truncate">{a.title}</p>
        <p className="text-xs text-foreground-subtle truncate">{a.excerpt}</p>
      </div>
    )},
    { header: "Category", key: "category", render: (a) => <span className="capitalize text-xs text-foreground-muted">{a.category}</span> },
    { header: "Status", key: "status", render: (a) => <StatusBadge status={a.status} /> },
    { header: "Author", key: "author", render: (a) => <span className="text-xs text-foreground-muted">{a.author}</span> },
    { header: "Views", key: "views", render: (a) => (
      <span className="flex items-center gap-1 text-xs text-foreground-muted">
        <Eye className="h-3 w-3" /> {a.views}
      </span>
    )},
    { header: "Published", key: "publishedAt", render: (a) =>
      <span className="text-xs text-foreground-subtle">{a.publishedAt ? fmtDate(a.publishedAt) : "—"}</span>
    },
    { header: "", key: "actions", className: "w-20", render: (a) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); openEdit(a); }}
          className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary/10 transition-colors">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(a); }}
          className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="max-w-6xl space-y-5">
      <PageHeader
        title="News & Articles"
        description={`${articles.length} total articles`}
        actions={
          <button onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> New Article
          </button>
        }
      />

      <Tabs tabs={STATUS_TABS.map(t => ({ ...t, count: t.value === "all" ? articles.length : articles.filter(a => a.status === t.value).length }))}
        active={tab} onChange={setTab} />

      <DataTable columns={columns} data={filtered} keyExtractor={(a) => a._id}
        emptyTitle="No articles found" emptyDescription="Create your first news article." />

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Edit Article" : "New Article"} size="xl"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground rounded-lg hover:bg-surface transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              {editing ? "Save Changes" : "Publish / Save Draft"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Title *</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sisakhola Hydropower Project Advances to PPA Stage" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Category *</label>
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="hydropower">Hydropower</option>
                <option value="solar">Solar</option>
                <option value="agriculture">Agriculture</option>
                <option value="corporate">Corporate</option>
                <option value="sustainability">Sustainability</option>
                <option value="investor">Investor</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Status</label>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Author</label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Ghamkheti Guru" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Excerpt *</label>
            <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="A short summary shown in listing pages (max 500 chars)..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Content *</label>
            <Textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Full article body (Markdown supported)..." className="font-mono text-xs" />
          </div>
          <Switch checked={form.isFeatured} onChange={(v) => setForm({ ...form, isFeatured: v })} label="Feature this article on the media page" />
        </div>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} isLoading={isPending}
        title="Delete article?" description={`"${deleteTarget?.title}" will be permanently removed.`}
      />
    </div>
  );
}

function fmtDate(d: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
}
