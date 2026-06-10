"use client";

import { useState, useTransition } from "react";
import { Save, RefreshCw, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/admin/FileUpload";
import { useToast } from "@/lib/toast";

interface Cta { label: string; href: string }

interface SectionDoc {
  section:       string;
  title?:        string;
  subtitle?:     string;
  badge?:        string;
  body?:         string;
  items:         Record<string, unknown>[];
  primaryCta?:   Cta;
  secondaryCta?: Cta;
}

const SECTION_TABS = [
  { value: "hero",             label: "Hero"         },
  { value: "hero_images",      label: "Hero Images"  },
  { value: "company_overview", label: "About"        },
  { value: "portfolio",        label: "Portfolio"    },
  { value: "stats",            label: "Statistics"   },
  { value: "chairman_message", label: "Chairman"     },
  { value: "sustainability",   label: "Sustainability"},
  { value: "investor_cta",     label: "CTA"          },
];

const EMPTY_CTA: Cta = { label: "", href: "" };

function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-xs font-medium text-foreground">{label}</span>
        {hint && <span className="text-[10px] text-foreground-subtle">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function CtaRow({ heading, value = EMPTY_CTA, onChange }: { heading: string; value?: Cta; onChange: (v: Cta) => void }) {
  return (
    <div className="rounded-lg border border-border p-3 space-y-3">
      <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-widest">{heading}</p>
      <div className="grid grid-cols-2 gap-3">
        <F label="Label"><Input value={value.label} onChange={(e) => onChange({ ...value, label: e.target.value })} placeholder="Button text" /></F>
        <F label="URL"><Input value={value.href} onChange={(e) => onChange({ ...value, href: e.target.value })} placeholder="/path" /></F>
      </div>
    </div>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-surface text-sm text-foreground-subtle hover:text-foreground transition-colors">
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors">
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HomepageClient({ initialData }: { initialData: any[] }) {
  const { success, error } = useToast();
  const [tab, setTab] = useState("hero");
  const [sections, setSections] = useState<Record<string, SectionDoc>>(
    Object.fromEntries(
      initialData.map((s) => [s.section, { ...s, items: (s.items ?? []) as Record<string, unknown>[] } as SectionDoc])
    )
  );
  const [isPending, startTransition] = useTransition();

  const doc: SectionDoc = sections[tab] ?? { section: tab, items: [] };

  function patch(delta: Partial<SectionDoc>) {
    setSections((prev) => ({
      ...prev,
      [tab]: { ...(prev[tab] ?? { section: tab, items: [] }), ...delta },
    }));
  }

  function save() {
    startTransition(async () => {
      const { items, title, subtitle, badge, body, primaryCta, secondaryCta } = doc;
      const payload: Record<string, unknown> = { items };
      if (title     !== undefined) payload.title     = title;
      if (subtitle  !== undefined) payload.subtitle  = subtitle;
      if (badge     !== undefined) payload.badge     = badge;
      if (body      !== undefined) payload.body      = body;
      if (primaryCta)   payload.primaryCta   = primaryCta;
      if (secondaryCta) payload.secondaryCta = secondaryCta;

      const res = await fetch(`/api/admin/homepage/${tab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { error("Save failed", json.error); return; }
      success("Section saved");
    });
  }

  // ── Section editors ───────────────────────────────────────────────────────

  function renderHero() {
    type Stat = { value?: string; label?: string };
    const stats = (doc.items ?? []) as Stat[];
    function updateStat(i: number, field: keyof Stat, val: string) {
      const next = [...stats] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: val };
      patch({ items: next });
    }
    function removeStat(i: number) { patch({ items: stats.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addStat() { patch({ items: [...stats, { value: "", label: "" }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-5">
        <F label="Headline"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Powering Nepal's Sustainable Future" /></F>
        <F label="Subheadline"><Input value={doc.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="From the Himalayan rivers to the Terai plains…" /></F>
        <F label="Body Text"><Textarea rows={3} value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="Supporting paragraph below the headline…" /></F>
        <CtaRow heading="Primary CTA" value={doc.primaryCta} onChange={(v) => patch({ primaryCta: v })} />
        <CtaRow heading="Secondary CTA" value={doc.secondaryCta} onChange={(v) => patch({ secondaryCta: v })} />
        <div>
          <p className="text-xs font-medium text-foreground mb-3">Hero Statistics</p>
          <div className="space-y-3">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Stat {i + 1}</p>
                  <RemoveBtn onClick={() => removeStat(i)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Value"><Input value={s.value ?? ""} onChange={(e) => updateStat(i, "value", e.target.value)} placeholder="4.9 MW" /></F>
                  <F label="Label"><Input value={s.label ?? ""} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Hydropower Pipeline" /></F>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3"><AddBtn onClick={addStat} label="Add Statistic" /></div>
        </div>
      </div>
    );
  }

  function renderHeroImages() {
    type Slide = { url: string; alt: string; isVisible?: boolean; overlay?: number };
    const slides = (doc.items ?? []) as Slide[];
    function updateSlide(i: number, field: keyof Slide, value: string | boolean | number) {
      const next = [...slides];
      next[i] = { ...next[i], [field]: value };
      patch({ items: next as Record<string, unknown>[] });
    }
    function removeSlide(i: number) { patch({ items: slides.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addSlide() { patch({ items: [...slides, { url: "", alt: "", isVisible: true, overlay: 55 }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">Upload photos for the hero slideshow. Higher overlay = darker image (easier to read text over).</p>
        {slides.map((slide, i) => {
          const overlayVal = slide.overlay ?? 55;
          return (
            <div key={i} className={`rounded-xl border p-4 space-y-4 transition-colors ${slide.isVisible === false ? "border-border bg-surface/40 opacity-60" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-semibold text-foreground">Slide {i + 1}</p>
                  <button type="button" onClick={() => updateSlide(i, "isVisible", !(slide.isVisible ?? true))} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors ${slide.isVisible === false ? "border-amber-500/40 text-amber-400 bg-amber-500/10" : "border-primary/40 text-primary bg-primary/10"}`}>
                    {slide.isVisible === false ? "Hidden" : "Visible"}
                  </button>
                </div>
                <RemoveBtn onClick={() => removeSlide(i)} />
              </div>
              <FileUpload kind="image" value={slide.url} onChange={(url) => updateSlide(i, "url", url)} />
              <F label="Alt text"><Input value={slide.alt} onChange={(e) => updateSlide(i, "alt", e.target.value)} placeholder="Sisakhola River hydropower project site" /></F>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">Image Darkness</span>
                  <span className="text-xs font-semibold text-primary tabular-nums">{overlayVal}%</span>
                </div>
                <input type="range" min={0} max={90} step={5} value={overlayVal} onChange={(e) => updateSlide(i, "overlay", Number(e.target.value))} className="w-full h-1.5 rounded-full accent-primary cursor-pointer" style={{ accentColor: "var(--primary)" }} />
              </div>
            </div>
          );
        })}
        <AddBtn onClick={addSlide} label="Add Slide" />
      </div>
    );
  }

  function renderAbout() {
    type Pillar = { label?: string; detail?: string; type?: string; text?: string; attribution?: string };
    const allItems  = (doc.items ?? []) as Pillar[];
    const pillars   = allItems.filter((i) => !i.type || i.type === "pillar");
    const quoteItem = allItems.find((i) => i.type === "quote") ?? { type: "quote", text: "", attribution: "" };

    function updatePillar(i: number, field: "label" | "detail", val: string) {
      const pillarIndices = allItems.reduce<number[]>((acc, item, idx) => (!item.type || item.type === "pillar" ? [...acc, idx] : acc), []);
      const next = [...allItems] as Record<string, unknown>[];
      next[pillarIndices[i]] = { ...next[pillarIndices[i]], [field]: val };
      patch({ items: next });
    }
    function removePillar(i: number) {
      const pillarIndices = allItems.reduce<number[]>((acc, item, idx) => (!item.type || item.type === "pillar" ? [...acc, idx] : acc), []);
      patch({ items: allItems.filter((_, idx) => idx !== pillarIndices[i]) as Record<string, unknown>[] });
    }
    function addPillar() {
      const nonQuote = allItems.filter((i) => i.type !== "quote");
      const quote    = allItems.filter((i) => i.type === "quote");
      patch({ items: [...nonQuote, { type: "pillar", label: "", detail: "" }, ...quote] as Record<string, unknown>[] });
    }
    function updateQuote(field: "text" | "attribution", val: string) {
      const withoutQuote = allItems.filter((i) => i.type !== "quote");
      patch({ items: [...withoutQuote, { ...quoteItem, [field]: val }] as Record<string, unknown>[] });
    }

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <F label="Section Title" hint="optional — defaults to gradient heading"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="An Integrated Force in Nepal's Growth Story" /></F>
          <F label="Paragraph 1"><Textarea rows={3} value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="First paragraph…" /></F>
          <F label="Paragraph 2"><Textarea rows={3} value={doc.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="Second paragraph…" /></F>
        </div>

        <div>
          <p className="text-xs font-medium text-foreground mb-3">Sector Cards <span className="text-foreground-subtle font-normal">(3 cards shown on the right side)</span></p>
          <div className="space-y-3">
            {pillars.map((p, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Card {i + 1}</p>
                  <RemoveBtn onClick={() => removePillar(i)} />
                </div>
                <F label="Title"><Input value={p.label ?? ""} onChange={(e) => updatePillar(i, "label", e.target.value)} placeholder="Hydropower" /></F>
                <F label="Description"><Textarea rows={2} value={p.detail ?? ""} onChange={(e) => updatePillar(i, "detail", e.target.value)} placeholder="Run-of-river & storage hydroelectric projects…" /></F>
              </div>
            ))}
          </div>
          {pillars.length < 3 && <div className="mt-3"><AddBtn onClick={addPillar} label="Add Card" /></div>}
        </div>

        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-xs font-semibold text-foreground">Quote Card <span className="text-foreground-subtle font-normal">(green card at the bottom)</span></p>
          <F label="Quote Text"><Textarea rows={3} value={quoteItem.text ?? ""} onChange={(e) => updateQuote("text", e.target.value)} placeholder="Our mandate is not just commercial success…" /></F>
          <F label="Attribution"><Input value={quoteItem.attribution ?? ""} onChange={(e) => updateQuote("attribution", e.target.value)} placeholder="Chairman, Ghamkheti Guru Co. Ltd." /></F>
        </div>
      </div>
    );
  }

  function renderPortfolio() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">Controls the heading and description of the "Our Portfolio" section. Sector card content is managed via <strong>Admin → Projects</strong>.</p>
        <F label="Section Title"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Three Sectors, One Mission" /></F>
        <F label="Description"><Textarea rows={3} value={doc.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="Integrated development across clean energy and agro-industry…" /></F>
      </div>
    );
  }

  function renderStats() {
    type Stat = { value?: number | string; suffix?: string; label?: string; description?: string };
    const stats = (doc.items ?? []) as Stat[];
    function updateStat(i: number, field: keyof Stat, val: string) {
      const next = [...stats] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: field === "value" ? (isNaN(Number(val)) ? val : Number(val)) : val };
      patch({ items: next });
    }
    function removeStat(i: number) { patch({ items: stats.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addStat() { patch({ items: [...stats, { value: 0, suffix: "", label: "", description: "" }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-4">
        <p className="text-xs text-foreground-muted">Statistics shown in the gradient strip between Portfolio and Chairman sections. Value + suffix combine (e.g. "4.9" + " MW").</p>
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Stat {i + 1}</p>
              <RemoveBtn onClick={() => removeStat(i)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Value"><Input value={String(s.value ?? "")} onChange={(e) => updateStat(i, "value", e.target.value)} placeholder="4.9" /></F>
              <F label="Suffix" hint="e.g.  MW"><Input value={s.suffix ?? ""} onChange={(e) => updateStat(i, "suffix", e.target.value)} placeholder=" MW" /></F>
            </div>
            <F label="Label"><Input value={s.label ?? ""} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Hydropower Pipeline" /></F>
            <F label="Description" hint="optional"><Input value={s.description ?? ""} onChange={(e) => updateStat(i, "description", e.target.value)} placeholder="Sisakhola, Solukhumbu" /></F>
          </div>
        ))}
        <AddBtn onClick={addStat} label="Add Statistic" />
      </div>
    );
  }

  function renderChairman() {
    type MetaItem = { type?: string; photo?: string; estYear?: string; estLocation?: string };
    type ParaItem = { type?: string; text?: string };
    const allItems = (doc.items ?? []) as (MetaItem & ParaItem)[];
    const metaItem = allItems.find((i) => i.type === "meta") ?? { type: "meta", photo: "", estYear: "", estLocation: "" };
    const paras    = allItems.filter((i) => i.type !== "meta" && i.text !== undefined);

    function updateMeta(field: keyof MetaItem, val: string) {
      const withoutMeta = allItems.filter((i) => i.type !== "meta");
      patch({ items: [{ ...metaItem, [field]: val }, ...withoutMeta] as Record<string, unknown>[] });
    }
    function getParaText(i: number) { return paras[i]?.text ?? ""; }
    function setParaText(i: number, text: string) {
      const withoutMeta = allItems.filter((i) => i.type !== "meta");
      const next = [...withoutMeta];
      while (next.length <= i) next.push({ text: "" });
      next[i] = { text };
      const meta = allItems.find((i) => i.type === "meta") ?? metaItem;
      patch({ items: [meta, ...next] as Record<string, unknown>[] });
    }

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <F label="Name"><Input value={doc.badge ?? ""} onChange={(e) => patch({ badge: e.target.value })} placeholder="Sanjeev Neupane" /></F>
          <F label="Title / Role"><Input value={doc.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="Chairman" /></F>
        </div>
        <F label="Section Headline"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Built on Vision, Driven by Purpose" /></F>
        <F label="Photo">
          <FileUpload kind="image" value={metaItem.photo ?? ""} onChange={(url) => updateMeta("photo", url)} label="Portrait photo (recommended: square, min 600×600px)" />
        </F>
        <div className="grid grid-cols-2 gap-4">
          <F label="Established Year"><Input value={metaItem.estYear ?? ""} onChange={(e) => updateMeta("estYear", e.target.value)} placeholder="2009" /></F>
          <F label="Location"><Input value={metaItem.estLocation ?? ""} onChange={(e) => updateMeta("estLocation", e.target.value)} placeholder="Kathmandu, Nepal" /></F>
        </div>
        <F label="Message — Paragraph 1"><Textarea rows={4} value={getParaText(0)} onChange={(e) => setParaText(0, e.target.value)} placeholder="Opening paragraph of the message…" /></F>
        <F label="Message — Paragraph 2"><Textarea rows={4} value={getParaText(1)} onChange={(e) => setParaText(1, e.target.value)} placeholder="Second paragraph…" /></F>
        <F label="Message — Paragraph 3"><Textarea rows={4} value={getParaText(2)} onChange={(e) => setParaText(2, e.target.value)} placeholder="Closing paragraph…" /></F>
      </div>
    );
  }

  function renderSustainability() {
    type Goal = { title?: string; description?: string };
    const goals = (doc.items ?? []) as Goal[];
    function updateGoal(i: number, field: keyof Goal, val: string) {
      const next = [...goals] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: val };
      patch({ items: next });
    }
    function removeGoal(i: number) { patch({ items: goals.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addGoal() { patch({ items: [...goals, { title: "", description: "" }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-5">
        <F label="Section Title"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Prosperity That Endures" /></F>
        <F label="Description"><Textarea rows={3} value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="Our growth is inseparable from Nepal's ecological and social health…" /></F>
        <div>
          <p className="text-xs font-medium text-foreground mb-3">Sustainability Goals <span className="text-foreground-subtle font-normal">(up to 6)</span></p>
          <div className="space-y-3">
            {goals.map((g, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Goal {i + 1}</p>
                  <RemoveBtn onClick={() => removeGoal(i)} />
                </div>
                <F label="Title"><Input value={g.title ?? ""} onChange={(e) => updateGoal(i, "title", e.target.value)} placeholder="Net-Zero by 2045" /></F>
                <F label="Description"><Textarea rows={2} value={g.description ?? ""} onChange={(e) => updateGoal(i, "description", e.target.value)} placeholder="All operations achieve carbon neutrality…" /></F>
              </div>
            ))}
          </div>
          <div className="mt-3"><AddBtn onClick={addGoal} label="Add Goal" /></div>
        </div>
      </div>
    );
  }

  function renderCta() {
    type CtaItem = { type?: string; v?: string; l?: string; text?: string };
    const allItems  = (doc.items ?? []) as CtaItem[];
    const metrics   = allItems.filter((i) => i.type === "metric" || i.v);
    const highlights = allItems.filter((i) => i.type === "highlight" || (i.text && i.type !== "metric"));

    function updateMetric(i: number, field: "v" | "l", val: string) {
      const metricIndices = allItems.reduce<number[]>((acc, item, idx) => (item.type === "metric" || item.v ? [...acc, idx] : acc), []);
      const next = [...allItems] as Record<string, unknown>[];
      next[metricIndices[i]] = { ...next[metricIndices[i]], type: "metric", [field]: val };
      patch({ items: next });
    }
    function removeMetric(i: number) {
      const metricIndices = allItems.reduce<number[]>((acc, item, idx) => (item.type === "metric" || item.v ? [...acc, idx] : acc), []);
      patch({ items: allItems.filter((_, idx) => idx !== metricIndices[i]) as Record<string, unknown>[] });
    }
    function addMetric() { patch({ items: [...allItems, { type: "metric", v: "", l: "" }] as Record<string, unknown>[] }); }

    function updateHighlight(i: number, val: string) {
      const hlIndices = allItems.reduce<number[]>((acc, item, idx) => (item.type === "highlight" || (item.text && item.type !== "metric") ? [...acc, idx] : acc), []);
      const next = [...allItems] as Record<string, unknown>[];
      next[hlIndices[i]] = { type: "highlight", text: val };
      patch({ items: next });
    }
    function removeHighlight(i: number) {
      const hlIndices = allItems.reduce<number[]>((acc, item, idx) => (item.type === "highlight" || (item.text && item.type !== "metric") ? [...acc, idx] : acc), []);
      patch({ items: allItems.filter((_, idx) => idx !== hlIndices[i]) as Record<string, unknown>[] });
    }
    function addHighlight() { patch({ items: [...allItems, { type: "highlight", text: "" }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <F label="Heading"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Partner With Us for Sustainable Growth" /></F>
          <F label="Body Text"><Textarea rows={3} value={doc.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="Supporting text below the heading…" /></F>
          <CtaRow heading="Primary Button" value={doc.primaryCta} onChange={(v) => patch({ primaryCta: v })} />
          <CtaRow heading="Secondary Button" value={doc.secondaryCta} onChange={(v) => patch({ secondaryCta: v })} />
        </div>

        <div>
          <p className="text-xs font-medium text-foreground mb-3">Bullet Points <span className="text-foreground-subtle font-normal">(left side, below body text)</span></p>
          <div className="space-y-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={h.text ?? ""} onChange={(e) => updateHighlight(i, e.target.value)} placeholder="Key investor highlight…" />
                <RemoveBtn onClick={() => removeHighlight(i)} />
              </div>
            ))}
          </div>
          <div className="mt-3"><AddBtn onClick={addHighlight} label="Add Bullet Point" /></div>
        </div>

        <div>
          <p className="text-xs font-medium text-foreground mb-3">Metric Boxes <span className="text-foreground-subtle font-normal">(right side, 4 boxes max)</span></p>
          <div className="space-y-3">
            {metrics.slice(0, 4).map((m, i) => (
              <div key={i} className="rounded-xl border border-border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Box {i + 1}</p>
                  <RemoveBtn onClick={() => removeMetric(i)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Value"><Input value={m.v ?? ""} onChange={(e) => updateMetric(i, "v", e.target.value)} placeholder="4.9 MW" /></F>
                  <F label="Label"><Input value={m.l ?? ""} onChange={(e) => updateMetric(i, "l", e.target.value)} placeholder="Hydropower Pipeline" /></F>
                </div>
              </div>
            ))}
          </div>
          {metrics.length < 4 && <div className="mt-3"><AddBtn onClick={addMetric} label="Add Metric Box" /></div>}
        </div>
      </div>
    );
  }

  const editors: Record<string, () => React.ReactNode> = {
    hero:             renderHero,
    hero_images:      renderHeroImages,
    company_overview: renderAbout,
    portfolio:        renderPortfolio,
    stats:            renderStats,
    chairman_message: renderChairman,
    sustainability:   renderSustainability,
    investor_cta:     renderCta,
  };

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="Homepage CMS"
        description="Edit and publish content for each homepage section"
        actions={
          <button onClick={save} disabled={isPending} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Section
          </button>
        }
      />
      <Tabs tabs={SECTION_TABS} active={tab} onChange={setTab} />
      <div key={tab} className="rounded-xl bg-surface border border-border p-6">
        {(editors[tab] ?? (() => <p className="text-sm text-foreground-muted">No editor for this section.</p>))()}
      </div>
    </div>
  );
}
