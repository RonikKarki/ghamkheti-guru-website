"use client";

import { useState, useTransition } from "react";
import { Save, RefreshCw, Info, Plus, Trash2 } from "lucide-react";
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
  { value: "hero",             label: "Hero" },
  { value: "hero_images",      label: "Hero Images" },
  { value: "stats",            label: "Statistics" },
  { value: "company_overview", label: "About" },
  { value: "chairman_message", label: "Chairman" },
  { value: "sustainability",   label: "Sustainability" },
  { value: "investor_cta",     label: "CTA" },
];

const EMPTY_CTA: Cta = { label: "", href: "" };

// ── Shared micro-components ───────────────────────────────────────────────────

function F({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
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

function CtaRow({
  heading,
  value = EMPTY_CTA,
  onChange,
}: {
  heading: string;
  value?: Cta;
  onChange: (v: Cta) => void;
}) {
  return (
    <div className="rounded-lg border border-border p-3 space-y-3">
      <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-widest">
        {heading}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <F label="Label">
          <Input
            value={value.label}
            onChange={(e) => onChange({ ...value, label: e.target.value })}
            placeholder="Button text"
          />
        </F>
        <F label="URL">
          <Input
            value={value.href}
            onChange={(e) => onChange({ ...value, href: e.target.value })}
            placeholder="/path"
          />
        </F>
      </div>
    </div>
  );
}

function JsonEditor({
  value,
  onChange,
  hint,
}: {
  value: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
  hint: string;
}) {
  const [raw, setRaw] = useState(() => JSON.stringify(value, null, 2));
  const [err, setErr] = useState("");

  function handleChange(text: string) {
    setRaw(text);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        onChange(parsed);
        setErr("");
      } else {
        setErr("Must be a JSON array [ … ]");
      }
    } catch {
      setErr("Invalid JSON");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5 text-foreground-subtle">
        <Info className="h-3 w-3 shrink-0" />
        <span className="text-[10px] leading-relaxed">{hint}</span>
      </div>
      <Textarea
        rows={12}
        value={raw}
        onChange={(e) => handleChange(e.target.value)}
        className="font-mono text-xs"
      />
      {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HomepageClient({
  initialData,
}: {
  // DB-serialised docs — fields beyond SectionDoc are ignored at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any[];
}) {
  const { success, error } = useToast();
  const [tab, setTab] = useState("hero");
  const [sections, setSections] = useState<Record<string, SectionDoc>>(
    Object.fromEntries(
      initialData.map((s) => [
        s.section,
        { ...s, items: (s.items ?? []) as Record<string, unknown>[] } as SectionDoc,
      ])
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

  function getParaText(i: number) {
    return (doc.items[i]?.text as string) ?? "";
  }
  function setParaText(i: number, text: string) {
    const items = [...doc.items];
    while (items.length <= i) items.push({});
    items[i] = { text };
    patch({ items });
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
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { error("Save failed", json.error); return; }
      success("Section saved");
    });
  }

  // ── Section editors ───────────────────────────────────────────────────────

  function renderHero() {
    return (
      <div className="space-y-5">
        <F label="Headline">
          <Input
            value={doc.title ?? ""}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Powering Nepal's Sustainable Future"
          />
        </F>
        <F label="Subheadline">
          <Input
            value={doc.subtitle ?? ""}
            onChange={(e) => patch({ subtitle: e.target.value })}
            placeholder="From the Himalayan rivers to the Terai plains…"
          />
        </F>
        <F label="Body Text">
          <Textarea
            rows={3}
            value={doc.body ?? ""}
            onChange={(e) => patch({ body: e.target.value })}
            placeholder="Supporting paragraph below the headline…"
          />
        </F>
        <CtaRow
          heading="Primary CTA"
          value={doc.primaryCta}
          onChange={(v) => patch({ primaryCta: v })}
        />
        <CtaRow
          heading="Secondary CTA"
          value={doc.secondaryCta}
          onChange={(v) => patch({ secondaryCta: v })}
        />
        <F label="Hero Statistics" hint="displayed at the bottom of the hero banner">
          <JsonEditor
            value={doc.items}
            onChange={(v) => patch({ items: v })}
            hint='[{"value":"4.9 MW","label":"Hydropower Pipeline"},{"value":"10 MW","label":"Solar Energy Pipeline"},…]'
          />
        </F>
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

    function removeSlide(i: number) {
      patch({ items: slides.filter((_, idx) => idx !== i) as Record<string, unknown>[] });
    }

    function addSlide() {
      patch({ items: [...slides, { url: "", alt: "", isVisible: true, overlay: 55 }] as Record<string, unknown>[] });
    }

    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">
          Upload photos for the hero slideshow. Use the overlay slider to control how dark the image appears — higher = darker, which makes the text easier to read.
        </p>

        {slides.map((slide, i) => {
          const overlayVal = slide.overlay ?? 55;
          return (
            <div
              key={i}
              className={`rounded-xl border p-4 space-y-4 transition-colors ${
                slide.isVisible === false ? "border-border bg-surface/40 opacity-60" : "border-border"
              }`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-semibold text-foreground">Slide {i + 1}</p>
                  <button
                    type="button"
                    onClick={() => updateSlide(i, "isVisible", !(slide.isVisible ?? true))}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors ${
                      slide.isVisible === false
                        ? "border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                        : "border-primary/40 text-primary bg-primary/10 hover:bg-primary/20"
                    }`}
                  >
                    {slide.isVisible === false ? "Hidden" : "Visible"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeSlide(i)}
                  className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <FileUpload
                kind="image"
                value={slide.url}
                onChange={(url) => updateSlide(i, "url", url)}
              />

              <F label="Alt text (for accessibility)">
                <Input
                  value={slide.alt}
                  onChange={(e) => updateSlide(i, "alt", e.target.value)}
                  placeholder="Sisakhola River hydropower project site"
                />
              </F>

              {/* Overlay darkness control */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">Image Darkness</span>
                  <span className="text-xs font-semibold text-primary tabular-nums">{overlayVal}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-foreground-subtle w-10">Light</span>
                  <input
                    type="range"
                    min={0}
                    max={90}
                    step={5}
                    value={overlayVal}
                    onChange={(e) => updateSlide(i, "overlay", Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-full accent-primary cursor-pointer"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="text-[10px] text-foreground-subtle w-10 text-right">Dark</span>
                </div>
                {/* Preview swatch */}
                <div className="mt-2 h-6 rounded-lg overflow-hidden relative border border-border">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right,
                        hsl(200 60% 40%), hsl(200 60% 40%))`,
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-black transition-opacity"
                    style={{ opacity: overlayVal / 100 }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-white drop-shadow">
                    Preview overlay at {overlayVal}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addSlide}
          className="flex items-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-surface text-sm text-foreground-subtle hover:text-foreground transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Slide
        </button>
      </div>
    );
  }

  function renderStats() {
    return (
      <JsonEditor
        value={doc.items}
        onChange={(v) => patch({ items: v })}
        hint='[{"value":4.9,"suffix":" MW","label":"Hydropower Pipeline","description":"Sisakhola, Solukhumbu"},…]'
      />
    );
  }

  function renderAbout() {
    return (
      <div className="space-y-5">
        <F label="Section Title">
          <Input
            value={doc.title ?? ""}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="An Integrated Force in Nepal's Growth Story"
          />
        </F>
        <F label="Paragraph 1">
          <Textarea
            rows={4}
            value={doc.body ?? ""}
            onChange={(e) => patch({ body: e.target.value })}
            placeholder="First paragraph…"
          />
        </F>
        <F label="Paragraph 2">
          <Textarea
            rows={4}
            value={doc.subtitle ?? ""}
            onChange={(e) => patch({ subtitle: e.target.value })}
            placeholder="Second paragraph…"
          />
        </F>
      </div>
    );
  }

  function renderChairman() {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <F label="Chairman's Name">
            <Input
              value={doc.badge ?? ""}
              onChange={(e) => patch({ badge: e.target.value })}
              placeholder="Hon. [Full Name]"
            />
          </F>
          <F label="Title / Role">
            <Input
              value={doc.subtitle ?? ""}
              onChange={(e) => patch({ subtitle: e.target.value })}
              placeholder="Chairman & Managing Director"
            />
          </F>
        </div>
        <F label="Section Headline" hint="bold heading above the quote">
          <Input
            value={doc.title ?? ""}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Built on Vision, Driven by Purpose"
          />
        </F>
        <F label="Message — Paragraph 1">
          <Textarea
            rows={4}
            value={getParaText(0)}
            onChange={(e) => setParaText(0, e.target.value)}
            placeholder="Opening paragraph of the chairman's message…"
          />
        </F>
        <F label="Message — Paragraph 2">
          <Textarea
            rows={4}
            value={getParaText(1)}
            onChange={(e) => setParaText(1, e.target.value)}
            placeholder="Second paragraph…"
          />
        </F>
        <F label="Message — Paragraph 3">
          <Textarea
            rows={4}
            value={getParaText(2)}
            onChange={(e) => setParaText(2, e.target.value)}
            placeholder="Closing paragraph / call to action…"
          />
        </F>
      </div>
    );
  }

  function renderSustainability() {
    return (
      <div className="space-y-5">
        <F label="Section Title">
          <Input
            value={doc.title ?? ""}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Prosperity That Endures"
          />
        </F>
        <F label="Section Description">
          <Textarea
            rows={3}
            value={doc.body ?? ""}
            onChange={(e) => patch({ body: e.target.value })}
            placeholder="Our growth is inseparable from Nepal's ecological and social health…"
          />
        </F>
        <F label="Sustainability Goals" hint="icons are auto-assigned by position (6 slots)">
          <JsonEditor
            value={doc.items}
            onChange={(v) => patch({ items: v })}
            hint='[{"title":"Net-Zero by 2045","description":"All operations achieve carbon neutrality…"},…]'
          />
        </F>
      </div>
    );
  }

  function renderCta() {
    return (
      <div className="space-y-5">
        <F label="Heading">
          <Input
            value={doc.title ?? ""}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Invest in Nepal's Energy Future"
          />
        </F>
        <F label="Body / Subtext">
          <Textarea
            rows={3}
            value={doc.subtitle ?? ""}
            onChange={(e) => patch({ subtitle: e.target.value })}
            placeholder="Supporting text below the heading…"
          />
        </F>
        <CtaRow
          heading="Primary CTA"
          value={doc.primaryCta}
          onChange={(v) => patch({ primaryCta: v })}
        />
        <CtaRow
          heading="Secondary CTA"
          value={doc.secondaryCta}
          onChange={(v) => patch({ secondaryCta: v })}
        />
      </div>
    );
  }

  const editors: Record<string, () => React.ReactNode> = {
    hero:             renderHero,
    hero_images:      renderHeroImages,
    stats:            renderStats,
    company_overview: renderAbout,
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
          <button
            onClick={save}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isPending ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save Section
          </button>
        }
      />

      <Tabs tabs={SECTION_TABS} active={tab} onChange={setTab} />

      {/* key={tab} forces remount of JsonEditor (and its internal raw state) when switching tabs */}
      <div key={tab} className="rounded-xl bg-surface border border-border p-6">
        {(
          editors[tab] ??
          (() => <p className="text-sm text-foreground-muted">No editor for this section.</p>)
        )()}
      </div>
    </div>
  );
}
