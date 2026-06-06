"use client";

import { useState } from "react";
import { Plus, Trash2, Star, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────── */

export interface ProjectFormData {
  name:             string;
  category:         string;
  status:           string;
  description:      string;
  isFeatured:       boolean;
  location:         { district: string; province: string; river: string; elevation: string };
  capacity:         { value: string; unit: string };
  investmentValue:  string;
  codDate:          string;
  constructionStart: string;
  ppa:              { authority: string; term: string; tariff: string };
  highlights:       Array<{ label: string; value: string }>;
  images:           Array<{ url: string; alt: string; isCover: boolean }>;
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
  description: "", isFeatured: false,
  location: { district: "", province: "", river: "", elevation: "" },
  capacity: { value: "", unit: "MW" },
  investmentValue: "", codDate: "", constructionStart: "",
  ppa: { authority: "", term: "", tariff: "" },
  highlights: [], images: [],
  order: "0", seoTitle: "", seoDescription: "",
};

export function formDataToPayload(d: ProjectFormData) {
  return {
    name:        d.name.trim(),
    category:    d.category,
    status:      d.status,
    description: d.description.trim(),
    isFeatured:  d.isFeatured,
    location: {
      district:  d.location.district.trim(),
      province:  d.location.province.trim(),
      ...(d.location.river     ? { river:     d.location.river.trim()         } : {}),
      ...(d.location.elevation ? { elevation: Number(d.location.elevation)    } : {}),
    },
    ...(d.capacity.value  ? { capacity:       { value: Number(d.capacity.value), unit: d.capacity.unit } } : {}),
    ...(d.investmentValue ? { investmentValue: Number(d.investmentValue)       } : {}),
    ...(d.codDate         ? { codDate:         d.codDate                       } : {}),
    ...(d.constructionStart ? { constructionStart: d.constructionStart         } : {}),
    ...(d.ppa.authority   ? { ppa: {
      authority: d.ppa.authority.trim(),
      ...(d.ppa.term   ? { term:   Number(d.ppa.term)   } : {}),
      ...(d.ppa.tariff ? { tariff: Number(d.ppa.tariff) } : {}),
    }} : {}),
    highlights: d.highlights.filter((h) => h.label && h.value),
    images:     d.images.filter((i) => i.url),
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
  { id: "images",    label: "Images",     errorKeys: [] },
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

  /* Highlights helpers */
  function addHighlight()  { set({ highlights: [...data.highlights, { label: "", value: "" }] }); }
  function removeHighlight(i: number) {
    set({ highlights: data.highlights.filter((_, idx) => idx !== i) });
  }
  function setHighlight(i: number, field: "label" | "value", v: string) {
    const hl = data.highlights.map((h, idx) => idx === i ? { ...h, [field]: v } : h);
    set({ highlights: hl });
  }

  /* Image helpers */
  function addImage()  { set({ images: [...data.images, { url: "", alt: "", isCover: false }] }); }
  function removeImage(i: number) { set({ images: data.images.filter((_, idx) => idx !== i) }); }
  function setImage(i: number, field: keyof typeof data.images[0], v: string | boolean) {
    const imgs = data.images.map((img, idx) => {
      if (idx !== i) return field === "isCover" && v === true ? { ...img, isCover: false } : img;
      return { ...img, [field]: v };
    });
    set({ images: imgs });
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-border px-1">
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
              {hasErr && (
                <span className="absolute top-1.5 right-0.5 h-1.5 w-1.5 rounded-full bg-red-400" />
              )}
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
                <span className={cn("text-[10px] ml-auto", data.description.length > 1900 ? "text-red-400" : "text-foreground-subtle")}>
                  {data.description.length}/2000
                </span>
              </div>
            </div>

            <Switch
              checked={data.isFeatured}
              onChange={(v) => set({ isFeatured: v })}
              label="Feature on homepage and project listings"
            />
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
                  placeholder="900"
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

        {/* ── Images ── */}
        {tab === "images" && (
          <div className="space-y-3">
            <p className="text-xs text-foreground-subtle">Add image URLs. Toggle the star to set the cover image.</p>

            {data.images.length === 0 && (
              <div className="rounded-lg border border-dashed border-border py-8 text-center">
                <p className="text-xs text-foreground-subtle">No images added yet</p>
              </div>
            )}

            {data.images.map((img, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={img.url}
                      onChange={(e) => setImage(i, "url", e.target.value)}
                      placeholder="https://cdn.ghamkhetiguru.com/projects/dam.jpg"
                    />
                    <Input
                      value={img.alt}
                      onChange={(e) => setImage(i, "alt", e.target.value)}
                      placeholder="Alt text / caption"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 shrink-0">
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
                {img.url && (
                  <img
                    src={img.url}
                    alt={img.alt || "preview"}
                    className="h-20 w-full object-cover rounded-md border border-border"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>
            ))}

            <button
              onClick={addImage}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-xs text-foreground-muted hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Image
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
                      placeholder="900 MW"
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
                  placeholder="Nepal's largest run-of-river hydropower project..."
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
                <p className="mt-1 text-[10px] text-foreground-subtle">Lower = shown first within category</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
