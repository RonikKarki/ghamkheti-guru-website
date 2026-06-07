"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon, LayoutGrid, List, Star } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { FileUpload } from "@/components/admin/FileUpload";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { Column } from "@/components/admin/DataTable";

interface GalleryItem {
  _id: string;
  title: string;
  alt: string;
  category: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileType: string;
  dimensions?: { width: number; height: number };
  fileSize?: number;
  isFeatured: boolean;
  order: number;
  takenAt?: string;
  createdAt: string;
}

interface FormState {
  title: string;
  alt: string;
  category: string;
  fileUrl: string;
  thumbnailUrl: string;
  fileType: string;
  isFeatured: boolean;
  order: number;
  fileSize: string;
  takenAt: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  hydropower:  { label: "Hydropower",  color: "bg-teal/10 text-teal border-teal/20" },
  solar:       { label: "Solar",       color: "bg-gold/10 text-gold border-gold/20" },
  agriculture: { label: "Agriculture", color: "bg-primary/10 text-primary border-primary/20" },
  corporate:   { label: "Corporate",   color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  community:   { label: "Community",   color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  events:      { label: "Events",      color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

const CATEGORY_TABS = [
  { value: "all", label: "All" },
  ...Object.entries(CATEGORY_CONFIG).map(([value, { label }]) => ({ value, label })),
];

const BLANK: FormState = {
  title: "", alt: "", category: "hydropower",
  fileUrl: "", thumbnailUrl: "", fileType: "image",
  isFeatured: false, order: 0, fileSize: "", takenAt: "",
};

function fmtDate(d: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
}

function CategoryBadge({ category }: { category: string }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-[10px] font-semibold border capitalize",
      cfg?.color ?? "bg-surface text-foreground-muted border-border"
    )}>
      {cfg?.label ?? category}
    </span>
  );
}

function Thumb({ item }: { item: GalleryItem }) {
  const src = item.thumbnailUrl || item.fileUrl;
  return src ? (
    <img src={src} alt={item.alt || item.title} className="h-10 w-16 object-cover rounded-lg border border-border" />
  ) : (
    <div className="h-10 w-16 flex items-center justify-center rounded-lg bg-surface border border-border">
      <ImageIcon className="h-4 w-4 text-foreground-subtle" />
    </div>
  );
}

export default function GalleryClient({ initialData }: { initialData: GalleryItem[] }) {
  const { success, error } = useToast();
  const [items, setItems]   = useState(initialData);
  const [tab, setTab]       = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [form, setForm]     = useState<FormState>({ ...BLANK });
  const [editing, setEditing]     = useState<GalleryItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = items.filter((i) => tab === "all" || i.category === tab);

  function openCreate() {
    setEditing(null);
    setForm({ ...BLANK });
    setModalOpen(true);
  }

  function openEdit(item: GalleryItem) {
    setEditing(item);
    setForm({
      title:        item.title,
      alt:          item.alt ?? "",
      category:     item.category,
      fileUrl:      item.fileUrl,
      thumbnailUrl: item.thumbnailUrl ?? "",
      fileType:     item.fileType,
      isFeatured:   item.isFeatured ?? false,
      order:        item.order ?? 0,
      fileSize:     item.fileSize?.toString() ?? "",
      takenAt:      item.takenAt ? item.takenAt.slice(0, 10) : "",
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.title) {
      error("Validation error", "Title is required");
      return;
    }
    if (!form.fileUrl) {
      error("Validation error", "Please upload an image file");
      return;
    }
    startTransition(async () => {
      const url    = editing ? `/api/admin/gallery/${editing._id}` : "/api/admin/gallery";
      const method = editing ? "PUT" : "POST";
      const payload = {
        ...form,
        fileSize: form.fileSize ? Number(form.fileSize) : undefined,
        takenAt:  form.takenAt || undefined,
        order:    Number(form.order) || 0,
      };
      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { error("Save failed", json.error); return; }
      if (editing) {
        setItems((prev) => prev.map((i) => i._id === editing._id ? json.data : i));
        success("Item updated");
      } else {
        setItems((prev) => [json.data, ...prev]);
        success("Item added");
      }
      setModalOpen(false);
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/gallery/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) { error("Delete failed"); return; }
      setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      success("Item removed");
      setDeleteTarget(null);
    });
  }

  function handleClearAll() {
    startTransition(async () => {
      const res = await fetch("/api/admin/gallery", { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) { error("Clear failed", json.error); return; }
      setItems([]);
      success(`Cleared ${json.data?.deleted ?? "all"} gallery items`);
      setClearConfirmOpen(false);
    });
  }

  const columns: Column<GalleryItem>[] = [
    {
      header: "Image", key: "fileUrl", className: "w-20",
      render: (item) => <Thumb item={item} />,
    },
    {
      header: "Title", key: "title",
      render: (item) => (
        <div className="max-w-56">
          <p className="font-medium text-foreground text-sm truncate">{item.title}</p>
          {item.alt && <p className="text-xs text-foreground-subtle truncate">{item.alt}</p>}
        </div>
      ),
    },
    {
      header: "Category", key: "category",
      render: (item) => <CategoryBadge category={item.category} />,
    },
    {
      header: "Type", key: "fileType",
      render: (item) => <span className="capitalize text-xs text-foreground-muted">{item.fileType}</span>,
    },
    {
      header: "★", key: "isFeatured", className: "w-10",
      render: (item) => item.isFeatured
        ? <Star className="h-3.5 w-3.5 text-gold fill-gold" />
        : <span className="text-foreground-subtle/30 text-sm">—</span>,
    },
    {
      header: "Dimensions", key: "dimensions",
      render: (item) => (
        <span className="text-xs text-foreground-subtle">
          {item.dimensions ? `${item.dimensions.width}×${item.dimensions.height}` : "—"}
        </span>
      ),
    },
    {
      header: "Added", key: "createdAt",
      render: (item) => <span className="text-xs text-foreground-subtle">{fmtDate(item.createdAt)}</span>,
    },
    {
      header: "", key: "actions", className: "w-20",
      render: (item) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(item); }}
            className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); }}
            className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl space-y-5">
      <PageHeader
        title="Gallery"
        description={`${items.length} item${items.length !== 1 ? "s" : ""}`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "table" ? "bg-primary/10 text-primary" : "text-foreground-subtle hover:text-foreground"
                )}
                title="Table view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid" ? "bg-primary/10 text-primary" : "text-foreground-subtle hover:text-foreground"
                )}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
            {items.length > 0 && (
              <button
                onClick={() => setClearConfirmOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear All
              </button>
            )}
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Media
            </button>
          </div>
        }
      />

      <Tabs
        tabs={CATEGORY_TABS.map((t) => ({
          ...t,
          count: t.value === "all"
            ? items.length
            : items.filter((i) => i.category === t.value).length,
        }))}
        active={tab}
        onChange={setTab}
      />

      {viewMode === "table" ? (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(i) => i._id}
          emptyTitle="No media found"
          emptyDescription="Upload images and videos to your gallery."
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-sm text-foreground-muted">
              No items in this category
            </div>
          ) : (
            filtered.map((item) => {
              const src = item.thumbnailUrl || item.fileUrl;
              return (
                <div
                  key={item._id}
                  className="group relative rounded-2xl border border-border overflow-hidden aspect-square bg-surface"
                >
                  {src ? (
                    <img
                      src={src}
                      alt={item.alt || item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-foreground-subtle/30" strokeWidth={1.5} />
                    </div>
                  )}
                  {item.isFeatured && (
                    <div className="absolute top-2 left-2">
                      <Star className="h-4 w-4 text-gold fill-gold drop-shadow" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <p className="text-xs font-semibold text-white truncate mb-1">{item.title}</p>
                    <CategoryBadge category={item.category} />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg bg-card/90 backdrop-blur-sm text-foreground-muted hover:text-primary transition-colors"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg bg-card/90 backdrop-blur-sm text-foreground-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Media Item" : "Add Media Item"}
        size="lg"
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
              {editing ? "Save Changes" : "Add Item"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Sisakhola Hydropower Site"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Alt Text</label>
              <Input
                value={form.alt}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
                placeholder="Aerial view of Sisakhola hydropower site"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Category</label>
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {Object.entries(CATEGORY_CONFIG).map(([value, { label }]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">File Type</label>
              <Select
                value={form.fileType}
                onChange={(e) => setForm({ ...form, fileType: e.target.value })}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </Select>
            </div>
          </div>

          <FileUpload
            label="Image File *"
            kind="image"
            value={form.fileUrl}
            onChange={(url, meta) => setForm({
              ...form,
              fileUrl: url,
              fileSize: meta ? String(meta.size) : form.fileSize,
            })}
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Display Order</label>
              <Input
                type="number"
                value={form.order.toString()}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">File Size (bytes)</label>
              <Input
                type="number"
                value={form.fileSize}
                onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                placeholder="2097152"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Date Taken</label>
              <Input
                type="date"
                value={form.takenAt}
                onChange={(e) => setForm({ ...form, takenAt: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
              className={cn(
                "flex h-5 w-9 shrink-0 rounded-full transition-colors",
                form.isFeatured ? "bg-gold" : "bg-border"
              )}
            >
              <span
                className={cn(
                  "self-center h-4 w-4 rounded-full bg-white shadow transition-transform mx-0.5",
                  form.isFeatured ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
            <div>
              <p className="text-xs font-medium text-foreground">Featured</p>
              <p className="text-[10px] text-foreground-subtle">
                Display this item prominently across gallery sections
              </p>
            </div>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isPending}
        title="Remove media item?"
        description={`"${deleteTarget?.title}" will be permanently removed from the gallery.`}
        confirmLabel="Remove"
      />
      <ConfirmDialog
        open={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={handleClearAll}
        isLoading={isPending}
        title="Clear entire gallery?"
        description={`This will permanently delete all ${items.length} gallery items. This cannot be undone.`}
        confirmLabel="Clear All"
      />
    </div>
  );
}
