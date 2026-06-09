"use client";

import { useState } from "react";
import { Plus, Trash2, AlertCircle, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/admin/FileUpload";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────── */

export interface SubsidiaryFormData {
  name:             string;
  industry:         string;
  shortDescription: string;
  description:      string;
  location:         string;
  ownership:        string;
  establishedYear:  string;
  logoImage:        string;
  bannerImage:      string;
  gallery:          Array<{ url: string; alt: string }>;
  activities:       Array<{ title: string; description: string; order: number }>;
  products:         Array<{ name: string; description: string; image: string; order: number }>;
  contact:          { phone: string; email: string; website: string };
  isActive:         boolean;
  isFeatured:       boolean;
  order:            string;
  seoTitle:         string;
  seoDescription:   string;
  ogImage:          string;
}

export interface SubsidiaryFormErrors {
  name?:     string;
  industry?: string;
}

export const BLANK_FORM: SubsidiaryFormData = {
  name: "", industry: "", shortDescription: "", description: "",
  location: "", ownership: "", establishedYear: "",
  logoImage: "", bannerImage: "",
  gallery: [], activities: [], products: [],
  contact: { phone: "", email: "", website: "" },
  isActive: true, isFeatured: false,
  order: "0", seoTitle: "", seoDescription: "", ogImage: "",
};

export function formDataToPayload(d: SubsidiaryFormData) {
  return {
    name:             d.name.trim(),
    industry:         d.industry.trim(),
    shortDescription: d.shortDescription.trim(),
    description:      d.description.trim(),
    location:         d.location.trim(),
    ownership:        d.ownership.trim(),
    ...(d.establishedYear ? { establishedYear: Number(d.establishedYear) } : {}),
    ...(d.logoImage    ? { logoImage:    d.logoImage    } : { logoImage:    null }),
    ...(d.bannerImage  ? { bannerImage:  d.bannerImage  } : { bannerImage:  null }),
    gallery:    d.gallery.filter((g) => g.url),
    activities: d.activities.filter((a) => a.title.trim()).map((a, i) => ({ ...a, order: i })),
    products:   d.products.filter((p) => p.name.trim()).map((p, i) => ({ ...p, order: i })),
    contact: {
      ...(d.contact.phone   ? { phone:   d.contact.phone.trim()   } : {}),
      ...(d.contact.email   ? { email:   d.contact.email.trim()   } : {}),
      ...(d.contact.website ? { website: d.contact.website.trim() } : {}),
    },
    isActive:   d.isActive,
    isFeatured: d.isFeatured,
    order:      Number(d.order) || 0,
    ...(d.seoTitle       ? { seoTitle:       d.seoTitle.trim()       } : {}),
    ...(d.seoDescription ? { seoDescription: d.seoDescription.trim() } : {}),
    ...(d.ogImage        ? { ogImage:        d.ogImage               } : {}),
  };
}

export function validateForm(d: SubsidiaryFormData): SubsidiaryFormErrors {
  const e: SubsidiaryFormErrors = {};
  if (!d.name.trim())     e.name     = "Company name is required";
  if (!d.industry.trim()) e.industry = "Industry is required";
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

/* ── Tabs ────────────────────────────────────────────────────────── */

const TABS = [
  { id: "basics",     label: "Basics",     errorKeys: ["name", "industry"] },
  { id: "contact",    label: "Contact",    errorKeys: [] },
  { id: "media",      label: "Media",      errorKeys: [] },
  { id: "activities", label: "Activities", errorKeys: [] },
  { id: "products",   label: "Products",   errorKeys: [] },
  { id: "seo",        label: "SEO",        errorKeys: [] },
] as const;

type TabId = typeof TABS[number]["id"];

/* ── Main ────────────────────────────────────────────────────────── */

interface SubsidiaryFormProps {
  data:     SubsidiaryFormData;
  onChange: (data: SubsidiaryFormData) => void;
  errors:   SubsidiaryFormErrors;
}

export function SubsidiaryForm({ data, onChange, errors }: SubsidiaryFormProps) {
  const [tab, setTab] = useState<TabId>("basics");
  const set = (patch: Partial<SubsidiaryFormData>) => onChange({ ...data, ...patch });

  function tabHasError(t: typeof TABS[number]) {
    return t.errorKeys.some((k) => !!(errors as Record<string, string | undefined>)[k]);
  }

  /* Gallery */
  const addGallery    = () => set({ gallery: [...data.gallery, { url: "", alt: "" }] });
  const removeGallery = (i: number) => set({ gallery: data.gallery.filter((_, idx) => idx !== i) });
  const setGalleryUrl = (i: number, url: string) =>
    set({ gallery: data.gallery.map((g, idx) => idx === i ? { ...g, url } : g) });
  const setGalleryAlt = (i: number, alt: string) =>
    set({ gallery: data.gallery.map((g, idx) => idx === i ? { ...g, alt } : g) });

  /* Activities */
  const addActivity    = () => set({ activities: [...data.activities, { title: "", description: "", order: data.activities.length }] });
  const removeActivity = (i: number) => set({ activities: data.activities.filter((_, idx) => idx !== i) });
  const setActivity    = (i: number, field: "title" | "description", v: string) =>
    set({ activities: data.activities.map((a, idx) => idx === i ? { ...a, [field]: v } : a) });

  /* Products */
  const addProduct    = () => set({ products: [...data.products, { name: "", description: "", image: "", order: data.products.length }] });
  const removeProduct = (i: number) => set({ products: data.products.filter((_, idx) => idx !== i) });
  const setProduct    = (i: number, field: string, v: string) =>
    set({ products: data.products.map((p, idx) => idx === i ? { ...p, [field]: v } : p) });

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-0.5 border-b border-border px-1 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative px-3 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
              tab === t.id ? "border-primary text-primary" : "border-transparent text-foreground-muted hover:text-foreground"
            )}
          >
            {t.label}
            {tabHasError(t) && <span className="absolute top-1.5 right-0.5 h-1.5 w-1.5 rounded-full bg-red-400" />}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4">

        {/* ── Basics ── */}
        {tab === "basics" && (
          <>
            <div>
              <Label required>Company Name</Label>
              <Input
                value={data.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Shree Suryodaya Khadya Udhyog Limited"
                className={cn(errors.name && "border-red-500/60")}
              />
              <FieldError msg={errors.name} />
            </div>

            <div>
              <Label required>Industry</Label>
              <Input
                value={data.industry}
                onChange={(e) => set({ industry: e.target.value })}
                placeholder="Rice Milling & Food Processing"
                className={cn(errors.industry && "border-red-500/60")}
              />
              <FieldError msg={errors.industry} />
            </div>

            <div>
              <Label>Short Description <span className="text-foreground-subtle font-normal">(shown on listing cards)</span></Label>
              <Textarea
                rows={2}
                value={data.shortDescription}
                onChange={(e) => set({ shortDescription: e.target.value })}
                placeholder="Brief one-liner about the subsidiary..."
                maxLength={300}
              />
              <p className="mt-1 text-right text-[10px] text-foreground-subtle">{data.shortDescription.length}/300</p>
            </div>

            <div>
              <Label>Full Description</Label>
              <Textarea
                rows={5}
                value={data.description}
                onChange={(e) => set({ description: e.target.value })}
                placeholder="Detailed company overview..."
                maxLength={3000}
              />
              <p className="mt-1 text-right text-[10px] text-foreground-subtle">{data.description.length}/3000</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Location</Label>
                <Input
                  value={data.location}
                  onChange={(e) => set({ location: e.target.value })}
                  placeholder="Gaindakot, Nawalpur, Nepal"
                />
              </div>
              <div>
                <Label>Established Year</Label>
                <Input
                  type="number"
                  value={data.establishedYear}
                  onChange={(e) => set({ establishedYear: e.target.value })}
                  placeholder="2020"
                />
              </div>
            </div>

            <div>
              <Label>Ownership</Label>
              <Input
                value={data.ownership}
                onChange={(e) => set({ ownership: e.target.value })}
                placeholder="100% Owned by Ghamkheti Guru Company Limited"
              />
            </div>

            <div className="flex gap-6 pt-1">
              <Switch checked={data.isActive}   onChange={(v) => set({ isActive: v })}   label="Show in navbar & listing" />
              <Switch checked={data.isFeatured} onChange={(v) => set({ isFeatured: v })} label="Featured"                 />
            </div>

            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={data.order}
                onChange={(e) => set({ order: e.target.value })}
                placeholder="0"
                className="w-24"
              />
            </div>
          </>
        )}

        {/* ── Contact ── */}
        {tab === "contact" && (
          <>
            <div>
              <Label>Phone Number</Label>
              <Input
                value={data.contact.phone}
                onChange={(e) => set({ contact: { ...data.contact, phone: e.target.value } })}
                placeholder="+977-78-540000"
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={data.contact.email}
                onChange={(e) => set({ contact: { ...data.contact, email: e.target.value } })}
                placeholder="info@subsidiary.com"
              />
            </div>
            <div>
              <Label>Website URL</Label>
              <Input
                value={data.contact.website}
                onChange={(e) => set({ contact: { ...data.contact, website: e.target.value } })}
                placeholder="https://www.subsidiary.com"
              />
            </div>
          </>
        )}

        {/* ── Media ── */}
        {tab === "media" && (
          <div className="space-y-5">
            <div>
              <Label>Company Logo</Label>
              <p className="text-[11px] text-foreground-subtle mb-2">Square logo shown on cards and navbar (1:1 recommended).</p>
              <FileUpload kind="image" value={data.logoImage} onChange={(url) => set({ logoImage: url })} />
            </div>

            <div>
              <Label>Banner / Hero Image</Label>
              <p className="text-[11px] text-foreground-subtle mb-2">Wide image for the detail page hero (16:9 recommended).</p>
              <FileUpload kind="image" value={data.bannerImage} onChange={(url) => set({ bannerImage: url })} />
            </div>

            <div className="pt-2 border-t border-border">
              <Label>Gallery</Label>
              <p className="text-[11px] text-foreground-subtle mb-3">Upload photos for the gallery section.</p>

              {data.gallery.length === 0 && (
                <div className="rounded-lg border border-dashed border-border py-6 text-center mb-3">
                  <p className="text-xs text-foreground-subtle">No gallery images yet</p>
                </div>
              )}

              <div className="space-y-3">
                {data.gallery.map((g, i) => (
                  <div key={i} className="rounded-lg border border-border bg-surface p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <FileUpload kind="image" value={g.url} onChange={(url) => setGalleryUrl(i, url)} label={`Image ${i + 1}`} />
                        <Input value={g.alt} onChange={(e) => setGalleryAlt(i, e.target.value)} placeholder="Caption / alt text" className="mt-2" />
                      </div>
                      <button onClick={() => removeGallery(i)} className="mt-6 p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addGallery}
                className="w-full mt-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-xs text-foreground-muted hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Gallery Image
              </button>
            </div>
          </div>
        )}

        {/* ── Activities ── */}
        {tab === "activities" && (
          <div className="space-y-3">
            <p className="text-xs text-foreground-subtle">Business activities shown on the subsidiary detail page.</p>

            {data.activities.length === 0 && (
              <div className="rounded-lg border border-dashed border-border py-8 text-center">
                <p className="text-xs text-foreground-subtle">No activities added yet</p>
              </div>
            )}

            {data.activities.map((a, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <GripVertical className="h-4 w-4 mt-2 shrink-0 text-foreground-subtle/40" />
                  <div className="flex-1 space-y-2">
                    <Input value={a.title} onChange={(e) => setActivity(i, "title", e.target.value)} placeholder="Activity title (e.g. Rice Milling)" />
                    <Textarea rows={2} value={a.description} onChange={(e) => setActivity(i, "description", e.target.value)} placeholder="Brief description of this activity..." />
                  </div>
                  <button onClick={() => removeActivity(i)} className="mt-1 p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addActivity}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-xs text-foreground-muted hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Activity
            </button>
          </div>
        )}

        {/* ── Products ── */}
        {tab === "products" && (
          <div className="space-y-3">
            <p className="text-xs text-foreground-subtle">Products sold or produced by this subsidiary.</p>

            {data.products.length === 0 && (
              <div className="rounded-lg border border-dashed border-border py-8 text-center">
                <p className="text-xs text-foreground-subtle">No products added yet</p>
              </div>
            )}

            {data.products.map((p, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Input value={p.name} onChange={(e) => setProduct(i, "name", e.target.value)} placeholder="Product name (e.g. Sona Mansuli Rice)" />
                    <Textarea rows={2} value={p.description} onChange={(e) => setProduct(i, "description", e.target.value)} placeholder="Product description..." />
                    <FileUpload kind="image" value={p.image} onChange={(url) => setProduct(i, "image", url)} label="Product Image (optional)" />
                  </div>
                  <button onClick={() => removeProduct(i)} className="mt-1 p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addProduct}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-xs text-foreground-muted hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Product
            </button>
          </div>
        )}

        {/* ── SEO ── */}
        {tab === "seo" && (
          <div className="space-y-4">
            <div>
              <Label>SEO Title <span className="text-foreground-subtle font-normal">(max 70 chars)</span></Label>
              <Input value={data.seoTitle} onChange={(e) => set({ seoTitle: e.target.value })} maxLength={70} placeholder="Company Name — Industry | Ghamkheti Guru" />
              <p className="mt-1 text-right text-[10px] text-foreground-subtle">{data.seoTitle.length}/70</p>
            </div>
            <div>
              <Label>SEO Description <span className="text-foreground-subtle font-normal">(max 160 chars)</span></Label>
              <Textarea rows={2} value={data.seoDescription} onChange={(e) => set({ seoDescription: e.target.value })} maxLength={160} placeholder="Short description for search engines..." />
              <p className="mt-1 text-right text-[10px] text-foreground-subtle">{data.seoDescription.length}/160</p>
            </div>
            <div>
              <Label>Open Graph Image</Label>
              <p className="text-[11px] text-foreground-subtle mb-2">Image shown when shared on social media.</p>
              <FileUpload kind="image" value={data.ogImage} onChange={(url) => set({ ogImage: url })} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
