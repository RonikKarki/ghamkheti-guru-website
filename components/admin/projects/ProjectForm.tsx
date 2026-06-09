"use client";

import { useState } from "react";
import { Plus, Trash2, Star, AlertCircle, CheckCircle, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/admin/FileUpload";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────── */

export interface ProjectFormData {
  name:             string;
  category:         string;
  status:           string;
  isActive:         boolean;
  description:      string;
  objectives:       string;
  bannerImage:      string;
  logoImage:        string;
  isFeatured:       boolean;
  location:         { district: string; province: string; river: string; elevation: string };
  capacity:         { value: string; unit: string };
  investmentValue:  string;
  codDate:          string;
  constructionStart: string;
  ppa:              { authority: string; term: string; tariff: string };
  highlights:       Array<{ label: string; value: string }>;
  images:           Array<{ url: string; alt: string; isCover: boolean }>;
  documents:        Array<{ url: string; name: string; type: string; size?: number }>;
  timeline:         Array<{ title: string; date: string; completed: boolean; description: string }>;
  order:            string;
  seoTitle:         string;
  seoDescription:   string;
}

export interface ProjectFormErrors {
  name?:        string;
  category?:    string;
  status?:      string;
  description?: string;
  district?:    string;
  province?:    string;
}

export const BLANK_FORM: ProjectFormData = {
  name: "", category: "hydropower", status: "under_development",
  isActive: true, description: "", objectives: "",
  bannerImage: "", logoImage: "",
  isFeatured: false,
  location: { district: "", province: "", river: "", elevation: "" },
  capacity: { value: "", unit: "MW" },
  investmentValue: "", codDate: "", constructionStart: "",
  ppa: { authority: "", term: "", tariff: "" },
  highlights: [], images: [], documents: [], timeline: [],
  order: "0", seoTitle: "", seoDescription: "",
};

export function formDataToPayload(d: ProjectFormData) {
  return {
    name:        d.name.trim(),
    category:    d.category,
    status:      d.status,
    isActive:    d.isActive,
    description: d.description.trim(),
    ...(d.objectives   ? { objectives:   d.objectives.trim()   } : {}),
    ...(d.bannerImage  ? { bannerImage:  d.bannerImage         } : {}),
    ...(d.logoImage    ? { logoImage:    d.logoImage           } : {}),
    isFeatured:  d.isFeatured,
    location: {
      district:  d.location.district.trim(),
      province:  d.location.province.trim(),
      ...(d.location.river     ? { river:     d.location.river.trim()     } : {}),
      ...(d.location.elevation ? { elevation: Number(d.location.elevation) } : {}),
    },
    ...(d.capacity.value ? { capacity: { value: Number(d.capacity.value), unit: d.capacity.unit } } : {}),
    ...(d.investmentValue ? { investmentValue: Number(d.investmentValue) } : {}),
    ...(d.codDate         ? { codDate:         d.codDate         } : {}),
    ...(d.constructionStart ? { constructionStart: d.constructionStart } : {}),
    ...(d.ppa.authority ? { ppa: {
      authority: d.ppa.authority.trim(),
      ...(d.ppa.term   ? { term:   Number(d.ppa.term)   } : {}),
      ...(d.ppa.tariff ? { tariff: Number(d.ppa.tariff) } : {}),
    }} : {}),
    highlights: d.highlights.filter((h) => h.label && h.value),
    images:     d.images.filter((i) => i.url),
    documents:  d.documents.filter((doc) => doc.url && doc.name),
    timeline:   d.timeline.filter((m) => m.title).map((m) => ({
      title:       m.title.trim(),
      completed:   m.completed,
      ...(m.date        ? { date:        m.date        } : {}),
      ...(m.description ? { description: m.description.trim() } : {}),
    })),
    order:      Number(d.order) || 0,
    ...(d.seoTitle       ? { seoTitle:       d.seoTitle.trim()       } : {}),
    ...(d.seoDescription ? { seoDescription: d.seoDescription.trim() } : {}),
  };
}

export function validateForm(d: ProjectFormData): ProjectFormErrors {
  const e: ProjectFormErrors = {};
  if (!d.name.trim())               e.name        = "Project name is required";
  if (!d.category)                  e.category    = "Category is required";
  if (!d.status)                    e.status      = "Status is required";
  if (!d.description.trim())        e.description = "Description is required";
  if (!d.location.district.trim())  e.district    = "District is required";
  if (!d.location.province.trim())  e.province    = "Province is required";
  return e;
}

/* ── Sub-components ─────────────────────────────────────────────── */

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 flex items-center gap-1 text-[11px] text-red-400"><AlertCircle className="h-3 w-3 shrink-0" />{msg}</p>;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-foreground mb-1.5">
      {children}{required && <span className="ml-0.5 text-red-400">*</span>}
    </label>
  );
}

/* ── Tab definitions ────────────────────────────────────────────── */

const TABS = [
  { id: "basics",    label: "Basics",     errorKeys: ["name", "category", "status", "description"] },
  { id: "location",  label: "Location",   errorKeys: ["district", "province"] },
  { id: "technical", label: "Technical",  errorKeys: [] },
  { id: "media",     label: "Media",      errorKeys: [] },
  { id: "documents", label: "Documents",  errorKeys: [] },
  { id: "timeline",  label: "Timeline",   errorKeys: [] },
  { id: "advanced",  label: "Advanced",   errorKeys: [] },
] as const;

type TabId = typeof TABS[number]["id"];

/* ── Main component ─────────────────────────────────────────────── */

interface ProjectFormProps {
  data:      ProjectFormData;
  onChange:  (data: ProjectFormData) => void;
  errors:    ProjectFormErrors;
}

export function ProjectForm({ data, onChange, errors }: ProjectFormProps) {
  const [tab, setTab] = useState<TabId>("basics");

  const set = (patch: Partial<ProjectFormData>) => onChange({ ...data, ...patch });

  function tabHasError(t: typeof TABS[number]) {
    return t.errorKeys.some((k) => !!(errors as Record<string, string | undefined>)[k]);
  }

  /* Highlights */
  function addHighlight()  { set({ highlights: [...data.highlights, { label: "", value: "" }] }); }
  function removeHighlight(i: number) { set({ highlights: data.highlights.filter((_, idx) => idx !== i) }); }
  function setHighlight(i: number, field: "label" | "value", v: string) {
    set({ highlights: data.highlights.map((h, idx) => idx === i ? { ...h, [field]: v } : h) });
  }

  /* Gallery images */
  function addImage()  { set({ images: [...data.images, { url: "", alt: "", isCover: false }] }); }
  function removeImage(i: number) { set({ images: data.images.filter((_, idx) => idx !== i) }); }
  function setImage(i: number, field: keyof typeof data.images[0], v: string | boolean) {
    const imgs = data.images.map((img, idx) => {
      if (idx !== i) return field === "isCover" && v === true ? { ...img, isCover: false } : img;
      return { ...img, [field]: v };
    });
    set({ images: imgs });
  }
  function setImageUrl(i: number, url: string) {
    set({ images: data.images.map((img, idx) => idx === i ? { ...img, url } : img) });
  }

  /* Documents */
  function addDocument() { set({ documents: [...data.documents, { url: "", name: "", type: "pdf" }] }); }
  function removeDocument(i: number) { set({ documents: data.documents.filter((_, idx) => idx !== i) }); }
  function setDocument(i: number, field: string, v: string | number) {
    set({ documents: data.documents.map((d, idx) => idx === i ? { ...d, [field]: v } : d) });
  }
  function setDocumentUpload(i: number, url: string, meta?: { size: number; mimeType: string; filename: string }) {
    const docs = data.documents.map((d, idx) => {
      if (idx !== i) return d;
      const ext = url.split(".").pop()?.toLowerCase() ?? "pdf";
      return {
        ...d,
        url,
        ...(meta?.filename && !d.name ? { name: meta.filename } : {}),
        type: ext,
        ...(meta?.size ? { size: meta.size } : {}),
      };
    });
    set({ documents: docs });
  }

  /* Timeline */
  function addMilestone() { set({ timeline: [...data.timeline, { title: "", date: "", completed: false, description: "" }] }); }
  function removeMilestone(i: number) { set({ timeline: data.timeline.filter((_, idx) => idx !== i) }); }
  function setMilestone(i: number, field: string, v: string | boolean) {
    set({ timeline: data.timeline.map((m, idx) => idx === i ? { ...m, [field]: v } : m) });
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-border px-1 flex-wrap">
        {TABS.map((t) => {
          const hasErr = tabHasError(t);
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative px-3 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              )}
            >
              {t.label}
              {hasErr && <span className="absolute top-1.5 right-0.5 h-1.5 w-1.5 rounded-full bg-red-400" />}
            </button>
          );
        })}
      </div>

      {/* Tab bodies */}
      <div className="p-5 space-y-4">

        {/* ── Basics ── */}
        {tab === "basics" && (
          <>
            <div>
              <Label required>Project Name</Label>
              <Input
                value={data.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Sisakhola Hydropower Project"
                className={cn(errors.name && "border-red-500/60 focus:ring-red-500/30")}
              />
              <FieldError msg={errors.name} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>Category</Label>
                <Select
                  value={data.category}
                  onChange={(e) => set({ category: e.target.value })}
                  className={cn(errors.category && "border-red-500/60")}
                >
                  <option value="hydropower">Hydropower</option>
                  <option value="solar">Solar</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="agri-solar">Agri-Solar</option>
                  <option value="tourism">Tourism</option>
                </Select>
                <FieldError msg={errors.category} />
              </div>
              <div>
                <Label required>Status</Label>
                <Select
                  value={data.status}
                  onChange={(e) => set({ status: e.target.value })}
                  className={cn(errors.status && "border-red-500/60")}
                >
                  <option value="under_development">Under Development</option>
                  <option value="licensed">Licensed</option>
                  <option value="under_construction">Under Construction</option>
                  <option value="commissioning">Commissioning</option>
                  <option value="operational">Operational</option>
                  <option value="on_hold">On Hold</option>
                </Select>
                <FieldError msg={errors.status} />
              </div>
            </div>

            <div>
              <Label required>Description</Label>
              <Textarea
                rows={5}
                value={data.description}
                onChange={(e) => set({ description: e.target.value })}
                placeholder="Comprehensive project overview — location, significance, expected output..."
                className={cn(errors.description && "border-red-500/60 focus:ring-red-500/30")}
              />
              <div className="mt-1 flex items-center justify-between">
                <FieldError msg={errors.description} />
                <span className={cn("text-[10px] ml-auto", data.description.length > 2800 ? "text-red-400" : "text-foreground-subtle")}>
                  {data.description.length}/3000
                </span>
              </div>
            </div>

            <div>
              <Label>Objectives</Label>
              <Textarea
                rows={3}
                value={data.objectives}
                onChange={(e) => set({ objectives: e.target.value })}
                placeholder="Key goals and objectives of this project..."
              />
            </div>

            <div className="flex gap-6">
              <Switch
                checked={data.isFeatured}
                onChange={(v) => set({ isFeatured: v })}
                label="Feature on homepage"
              />
              <Switch
                checked={data.isActive}
                onChange={(v) => set({ isActive: v })}
                label="Show in navbar & listings"
              />
            </div>
          </>
        )}

        {/* ── Location ── */}
        {tab === "location" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>District</Label>
                <Input
                  value={data.location.district}
                  onChange={(e) => set({ location: { ...data.location, district: e.target.value } })}
                  placeholder="Surkhet"
                  className={cn(errors.district && "border-red-500/60")}
                />
                <FieldError msg={errors.district} />
              </div>
              <div>
                <Label required>Province</Label>
                <Input
                  value={data.location.province}
                  onChange={(e) => set({ location: { ...data.location, province: e.target.value } })}
                  placeholder="Karnali Province"
                  className={cn(errors.province && "border-red-500/60")}
                />
                <FieldError msg={errors.province} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>River</Label>
                <Input
                  value={data.location.river}
                  onChange={(e) => set({ location: { ...data.location, river: e.target.value } })}
                  placeholder="Karnali River"
                />
              </div>
              <div>
                <Label>Elevation (metres)</Label>
                <Input
                  type="number"
                  value={data.location.elevation}
                  onChange={(e) => set({ location: { ...data.location, elevation: e.target.value } })}
                  placeholder="1240"
                />
              </div>
            </div>
          </>
        )}

        {/* ── Technical ── */}
        {tab === "technical" && (
          <>
            <div>
              <Label>Capacity</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={data.capacity.value}
                  onChange={(e) => set({ capacity: { ...data.capacity, value: e.target.value } })}
                  placeholder="4.9"
                  className="flex-1"
                />
                <Select
                  value={data.capacity.unit}
                  onChange={(e) => set({ capacity: { ...data.capacity, unit: e.target.value } })}
                  className="w-24"
                >
                  <option>MW</option>
                  <option>kW</option>
                  <option>MT/yr</option>
                  <option>Ha</option>
                </Select>
              </div>
            </div>

            <div>
              <Label>Investment Value (NPR Crore)</Label>
              <Input
                type="number"
                value={data.investmentValue}
                onChange={(e) => set({ investmentValue: e.target.value })}
                placeholder="2800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>COD Date</Label>
                <Input
                  type="date"
                  value={data.codDate}
                  onChange={(e) => set({ codDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Construction Start</Label>
                <Input
                  type="date"
                  value={data.constructionStart}
                  onChange={(e) => set({ constructionStart: e.target.value })}
                />
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">Power Purchase Agreement (PPA)</p>
              <div>
                <Label>PPA Authority</Label>
                <Input
                  value={data.ppa.authority}
                  onChange={(e) => set({ ppa: { ...data.ppa, authority: e.target.value } })}
                  placeholder="Nepal Electricity Authority"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Term (years)</Label>
                  <Input
                    type="number"
                    value={data.ppa.term}
                    onChange={(e) => set({ ppa: { ...data.ppa, term: e.target.value } })}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label>Tariff (NPR/kWh)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.ppa.tariff}
                    onChange={(e) => set({ ppa: { ...data.ppa, tariff: e.target.value } })}
                    placeholder="8.40"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Media ── */}
        {tab === "media" && (
          <div className="space-y-5">
            <div>
              <Label>Banner / Hero Image</Label>
              <p className="text-[11px] text-foreground-subtle mb-2">Wide image shown at the top of the project detail page (16:9 recommended).</p>
              <FileUpload
                kind="image"
                value={data.bannerImage}
                onChange={(url) => set({ bannerImage: url })}
              />
            </div>

            <div>
              <Label>Project Logo / Icon</Label>
              <p className="text-[11px] text-foreground-subtle mb-2">Square logo shown on cards and navbar dropdown (1:1 recommended).</p>
              <FileUpload
                kind="image"
                value={data.logoImage}
                onChange={(url) => set({ logoImage: url })}
              />
            </div>

            <div className="pt-2 border-t border-border">
              <Label>Gallery Images</Label>
              <p className="text-[11px] text-foreground-subtle mb-3">Upload photos for the gallery section. Star = cover image.</p>

              {data.images.length === 0 && (
                <div className="rounded-lg border border-dashed border-border py-6 text-center mb-3">
                  <p className="text-xs text-foreground-subtle">No gallery images yet</p>
                </div>
              )}

              <div className="space-y-3">
                {data.images.map((img, i) => (
                  <div key={i} className="rounded-lg border border-border bg-surface p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <FileUpload
                          kind="image"
                          value={img.url}
                          onChange={(url) => setImageUrl(i, url)}
                          label={`Image ${i + 1}`}
                        />
                        <Input
                          value={img.alt}
                          onChange={(e) => setImage(i, "alt", e.target.value)}
                          placeholder="Alt text / caption"
                          className="mt-2"
                        />
                      </div>
                      <div className="flex flex-col items-center gap-2 shrink-0 mt-6">
                        <button
                          title="Set as cover image"
                          onClick={() => setImage(i, "isCover", !img.isCover)}
                          className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            img.isCover
                              ? "text-gold bg-gold/10 border border-gold/30"
                              : "text-foreground-subtle hover:text-gold hover:bg-gold/10"
                          )}
                        >
                          <Star className="h-4 w-4" fill={img.isCover ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => removeImage(i)}
                          className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addImage}
                className="w-full mt-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-xs text-foreground-muted hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Gallery Image
              </button>
            </div>
          </div>
        )}

        {/* ── Documents ── */}
        {tab === "documents" && (
          <div className="space-y-3">
            <p className="text-xs text-foreground-subtle">Upload PDFs, reports, licenses, or presentations.</p>

            {data.documents.length === 0 && (
              <div className="rounded-lg border border-dashed border-border py-8 text-center">
                <p className="text-xs text-foreground-subtle">No documents uploaded yet</p>
              </div>
            )}

            {data.documents.map((doc, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <FileUpload
                      kind="document"
                      value={doc.url}
                      onChange={(url, meta) => setDocumentUpload(i, url, meta)}
                      label={`Document ${i + 1}`}
                    />
                    <Input
                      value={doc.name}
                      onChange={(e) => setDocument(i, "name", e.target.value)}
                      placeholder="Document title (e.g. Project Survey Report)"
                    />
                    <Select
                      value={doc.type}
                      onChange={(e) => setDocument(i, "type", e.target.value)}
                    >
                      <option value="pdf">PDF</option>
                      <option value="doc">Word Document</option>
                      <option value="xls">Excel</option>
                      <option value="ppt">PowerPoint</option>
                      <option value="other">Other</option>
                    </Select>
                  </div>
                  <button
                    onClick={() => removeDocument(i)}
                    className="mt-6 p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addDocument}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-xs text-foreground-muted hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Document
            </button>
          </div>
        )}

        {/* ── Timeline ── */}
        {tab === "timeline" && (
          <div className="space-y-3">
            <p className="text-xs text-foreground-subtle">Add project milestones in order. Toggle checkmark when completed.</p>

            {data.timeline.length === 0 && (
              <div className="rounded-lg border border-dashed border-border py-8 text-center">
                <p className="text-xs text-foreground-subtle">No milestones added yet</p>
              </div>
            )}

            {data.timeline.map((m, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => setMilestone(i, "completed", !m.completed)}
                    className={cn(
                      "mt-1 shrink-0 transition-colors",
                      m.completed ? "text-primary" : "text-foreground-subtle hover:text-primary"
                    )}
                    title="Toggle completed"
                  >
                    {m.completed
                      ? <CheckCircle className="h-4.5 w-4.5" />
                      : <Circle className="h-4.5 w-4.5" />
                    }
                  </button>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={m.title}
                      onChange={(e) => setMilestone(i, "title", e.target.value)}
                      placeholder="Milestone title (e.g. Survey Completed)"
                    />
                    <Input
                      type="date"
                      value={m.date}
                      onChange={(e) => setMilestone(i, "date", e.target.value)}
                    />
                    <Input
                      value={m.description}
                      onChange={(e) => setMilestone(i, "description", e.target.value)}
                      placeholder="Optional description..."
                    />
                  </div>
                  <button
                    onClick={() => removeMilestone(i)}
                    className="mt-1 p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addMilestone}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-xs text-foreground-muted hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Milestone
            </button>
          </div>
        )}

        {/* ── Advanced ── */}
        {tab === "advanced" && (
          <>
            <div>
              <Label>Key Highlights</Label>
              <p className="text-[11px] text-foreground-subtle mb-2">Shown as specs on the project detail page.</p>

              {data.highlights.length === 0 && (
                <div className="rounded-lg border border-dashed border-border py-6 text-center mb-3">
                  <p className="text-xs text-foreground-subtle">No highlights added</p>
                </div>
              )}

              <div className="space-y-2 mb-3">
                {data.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={h.label}
                      onChange={(e) => setHighlight(i, "label", e.target.value)}
                      placeholder="Installed Capacity"
                      className="flex-1"
                    />
                    <Input
                      value={h.value}
                      onChange={(e) => setHighlight(i, "value", e.target.value)}
                      placeholder="4.9 MW"
                      className="flex-1"
                    />
                    <button
                      onClick={() => removeHighlight(i)}
                      className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addHighlight}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-xs text-foreground-muted hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Highlight
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <div className="col-span-2">
                <Label>SEO Title <span className="text-foreground-subtle font-normal">(max 70 chars)</span></Label>
                <Input
                  value={data.seoTitle}
                  onChange={(e) => set({ seoTitle: e.target.value })}
                  maxLength={70}
                  placeholder="Sisakhola Hydropower Project — 4.9 MW Run-of-River"
                />
                <p className="mt-1 text-right text-[10px] text-foreground-subtle">{data.seoTitle.length}/70</p>
              </div>
              <div className="col-span-2">
                <Label>SEO Description <span className="text-foreground-subtle font-normal">(max 160 chars)</span></Label>
                <Textarea
                  rows={2}
                  value={data.seoDescription}
                  onChange={(e) => set({ seoDescription: e.target.value })}
                  maxLength={160}
                  placeholder="Run-of-river hydropower project in Karnali Province..."
                />
                <p className="mt-1 text-right text-[10px] text-foreground-subtle">{data.seoDescription.length}/160</p>
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={data.order}
                  onChange={(e) => set({ order: e.target.value })}
                  placeholder="0"
                />
                <p className="mt-1 text-[10px] text-foreground-subtle">Lower = shown first</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
