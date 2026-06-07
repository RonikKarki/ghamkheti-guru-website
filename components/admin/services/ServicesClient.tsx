"use client";

import { useState, useTransition } from "react";
import { Save, RefreshCw, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/toast";

interface SectionDoc {
  section:   string;
  title?:    string;
  subtitle?: string;
  body?:     string;
  items:     Record<string, unknown>[];
}

const SECTION_TABS = [
  { value: "banner",     label: "Banner"     },
  { value: "services",   label: "Services"   },
  { value: "process",    label: "Process"    },
  { value: "cta_banner", label: "CTA Banner" },
];

const ICON_OPTIONS = ["Sun","Sprout","Code2","BarChart3","Cpu","ShieldCheck","Globe","Users","Droplets","Mountain","Zap","Leaf","Building","Truck"];
const ACCENT_OPTIONS = ["green","gold","teal","earth"];

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

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-surface text-sm text-foreground-subtle hover:text-foreground transition-colors"
    >
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
export default function ServicesClient({ initialData }: { initialData: any[] }) {
  const { success, error } = useToast();
  const [tab, setTab] = useState("banner");
  const [sections, setSections] = useState<Record<string, SectionDoc>>(
    Object.fromEntries(
      initialData.map((s) => [s.section, { ...s, items: (s.items ?? []) as Record<string, unknown>[] }])
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
      const { items, title, subtitle, body } = doc;
      const payload: Record<string, unknown> = { items };
      if (title    !== undefined) payload.title    = title;
      if (subtitle !== undefined) payload.subtitle = subtitle;
      if (body     !== undefined) payload.body     = body;
      const res = await fetch(`/api/admin/services/${tab}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) { error("Save failed", json.error); return; }
      success("Section saved");
    });
  }

  function renderBanner() {
    return (
      <div className="space-y-5">
        <F label="Page Title"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="End-to-End Solutions Built for Scale" /></F>
        <F label="Description" hint="shown below the title in the hero banner">
          <Textarea rows={3} value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="From renewable energy infrastructure to enterprise software…" />
        </F>
      </div>
    );
  }

  function renderServices() {
    type Service = { icon?: string; title?: string; description?: string; accent?: string; details?: string[] };
    const services = (doc.items ?? []) as Service[];

    function updateService(i: number, field: keyof Service, val: string | string[]) {
      const next = [...services] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: val };
      patch({ items: next });
    }
    function removeService(i: number) { patch({ items: services.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addService() { patch({ items: [...services, { icon: "Sun", title: "", description: "", accent: "green", details: [] }] as Record<string, unknown>[] }); }

    function updateDetail(si: number, di: number, val: string) {
      const details = [...(services[si].details ?? [])];
      details[di] = val;
      updateService(si, "details", details);
    }
    function removeDetail(si: number, di: number) {
      const details = (services[si].details ?? []).filter((_, idx) => idx !== di);
      updateService(si, "details", details);
    }
    function addDetail(si: number) {
      const details = [...(services[si].details ?? []), ""];
      updateService(si, "details", details);
    }

    return (
      <div className="space-y-4">
        {services.map((s, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Service {i + 1}</p>
              <RemoveBtn onClick={() => removeService(i)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Title"><Input value={s.title ?? ""} onChange={(e) => updateService(i, "title", e.target.value)} placeholder="Renewable Energy" /></F>
              <F label="Description"><Input value={s.description ?? ""} onChange={(e) => updateService(i, "description", e.target.value)} placeholder="Short intro…" /></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Icon">
                <select
                  value={s.icon ?? "Sun"}
                  onChange={(e) => updateService(i, "icon", e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </F>
              <F label="Accent colour">
                <select
                  value={s.accent ?? "green"}
                  onChange={(e) => updateService(i, "accent", e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {ACCENT_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </F>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-2">Details <span className="text-foreground-subtle font-normal">(bullet points shown in the service card)</span></p>
              <div className="space-y-2">
                {(s.details ?? []).map((d, di) => (
                  <div key={di} className="flex items-center gap-2">
                    <Input value={d} onChange={(e) => updateDetail(i, di, e.target.value)} placeholder="Detail item…" className="flex-1" />
                    <RemoveBtn onClick={() => removeDetail(i, di)} />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addDetail(i)}
                className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add detail
              </button>
            </div>
          </div>
        ))}
        <AddBtn onClick={addService} label="Add Service" />
      </div>
    );
  }

  function renderProcess() {
    type Step = { step?: string; title?: string; description?: string };
    const steps = (doc.items ?? []) as Step[];
    function updateStep(i: number, field: keyof Step, val: string) {
      const next = [...steps] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: val };
      patch({ items: next });
    }
    function removeStep(i: number) { patch({ items: steps.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addStep() {
      const num = String(steps.length + 1).padStart(2, "0");
      patch({ items: [...steps, { step: num, title: "", description: "" }] as Record<string, unknown>[] });
    }

    return (
      <div className="space-y-4">
        <p className="text-xs text-foreground-muted">Up to 6 process steps. The step number is displayed large (e.g. "01", "02").</p>
        {steps.map((s, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Step {i + 1}</p>
              <RemoveBtn onClick={() => removeStep(i)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <F label="Number" hint='e.g. "01"'><Input value={s.step ?? ""} onChange={(e) => updateStep(i, "step", e.target.value)} placeholder="01" /></F>
              <div className="col-span-2">
                <F label="Title"><Input value={s.title ?? ""} onChange={(e) => updateStep(i, "title", e.target.value)} placeholder="Discovery" /></F>
              </div>
            </div>
            <F label="Description"><Textarea rows={2} value={s.description ?? ""} onChange={(e) => updateStep(i, "description", e.target.value)} placeholder="We start with a thorough discovery…" /></F>
          </div>
        ))}
        {steps.length < 6 && <AddBtn onClick={addStep} label="Add Step" />}
      </div>
    );
  }

  function renderCta() {
    return (
      <div className="space-y-5">
        <F label="Heading"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Ready to Explore What We Can Build Together?" /></F>
        <F label="Body / Subtext"><Textarea rows={3} value={doc.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="Tell us about your project and our specialist team will respond…" /></F>
      </div>
    );
  }

  const editors: Record<string, () => React.ReactNode> = {
    banner:     renderBanner,
    services:   renderServices,
    process:    renderProcess,
    cta_banner: renderCta,
  };

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="Services CMS"
        description="Edit content for each section of the Services page"
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
