"use client";

import { useState, useTransition } from "react";
import { Save, RefreshCw, Info } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/lib/toast";

interface SectionDoc {
  section:  string;
  title?:   string;
  subtitle?: string;
  body?:    string;
  items:    Record<string, unknown>[];
}

const SECTION_TABS = [
  { value: "banner",          label: "Banner"      },
  { value: "intro",           label: "Our Story"   },
  { value: "mission_vision",  label: "Mission & Vision" },
  { value: "values",          label: "Core Values" },
  { value: "leadership",      label: "Leadership"  },
  { value: "timeline",        label: "Timeline"    },
];

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

function JsonEditor({
  value,
  onChange,
  hint,
  rows = 12,
}: {
  value: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
  hint: string;
  rows?: number;
}) {
  const [raw, setRaw] = useState(() => JSON.stringify(value, null, 2));
  const [err, setErr] = useState("");

  function handleChange(text: string) {
    setRaw(text);
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) { onChange(parsed); setErr(""); }
      else setErr("Must be a JSON array [ … ]");
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
      <Textarea rows={rows} value={raw} onChange={(e) => handleChange(e.target.value)} className="font-mono text-xs" />
      {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AboutClient({ initialData }: { initialData: any[] }) {
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

      const res = await fetch(`/api/admin/about/${tab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { error("Save failed", json.error); return; }
      success("Section saved");
    });
  }

  // ── Section editors ──────────────────────────────────────────────────────────

  function renderBanner() {
    return (
      <div className="space-y-5">
        <F label="Page Title">
          <Input
            value={doc.title ?? ""}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Building Nepal's Sustainable Future"
          />
        </F>
        <F label="Description" hint="shown below the title in the hero banner">
          <Textarea
            rows={3}
            value={doc.body ?? ""}
            onChange={(e) => patch({ body: e.target.value })}
            placeholder="An integrated Energy, Agriculture, and Tourism company…"
          />
        </F>
      </div>
    );
  }

  function renderIntro() {
    return (
      <div className="space-y-5">
        <F label="Paragraph 1">
          <Textarea
            rows={4}
            value={doc.body ?? ""}
            onChange={(e) => patch({ body: e.target.value })}
            placeholder="Ghamkheti Guru Company Limited was established with a clear mandate…"
          />
        </F>
        <F label="Paragraph 2">
          <Textarea
            rows={4}
            value={doc.subtitle ?? ""}
            onChange={(e) => patch({ subtitle: e.target.value })}
            placeholder="We are an integrated company spanning Energy, Agriculture, and Tourism…"
          />
        </F>
        <F label="Paragraph 3" hint="optional third paragraph">
          <Textarea
            rows={4}
            value={doc.title ?? ""}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="We work with the Government of Nepal and the Nepal Electricity Authority…"
          />
        </F>
        <F label="Company Facts" hint="key–value pairs shown in the right column">
          <JsonEditor
            value={doc.items}
            onChange={(v) => patch({ items: v })}
            hint='[{"label":"Headquarters","value":"Kathmandu, Nepal"},{"label":"Sectors","value":"Energy · Agriculture · Tourism"},…]'
            rows={8}
          />
        </F>
      </div>
    );
  }

  function renderMissionVision() {
    return (
      <div className="space-y-5">
        <F label="Mission Statement">
          <Textarea
            rows={4}
            value={doc.body ?? ""}
            onChange={(e) => patch({ body: e.target.value })}
            placeholder="To develop Nepal's natural wealth into world-class energy and agro-industrial infrastructure…"
          />
        </F>
        <F label="Vision Statement">
          <Textarea
            rows={4}
            value={doc.subtitle ?? ""}
            onChange={(e) => patch({ subtitle: e.target.value })}
            placeholder="To be Nepal's defining integrated infrastructure company…"
          />
        </F>
      </div>
    );
  }

  function renderValues() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">Up to 6 values. Icons are auto-assigned by position.</p>
        <JsonEditor
          value={doc.items}
          onChange={(v) => patch({ items: v })}
          hint='[{"title":"Excellence","description":"We hold our projects to the highest standards…"},…]'
          rows={16}
        />
      </div>
    );
  }

  function renderLeadership() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">Each entry shows a title/role and a short bio. Up to 8 members.</p>
        <JsonEditor
          value={doc.items}
          onChange={(v) => patch({ items: v })}
          hint='[{"title":"Chairman & Managing Director","bio":"Visionary entrepreneur with 25+ years…"},…]'
          rows={14}
        />
      </div>
    );
  }

  function renderTimeline() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">Milestones displayed in order. Use short labels for &quot;year&quot; (e.g. &quot;Foundation&quot;, &quot;2077 BS&quot;).</p>
        <JsonEditor
          value={doc.items}
          onChange={(v) => patch({ items: v })}
          hint='[{"year":"Foundation","event":"Ghamkheti Guru Company Limited established…"},…]'
          rows={14}
        />
      </div>
    );
  }

  const editors: Record<string, () => React.ReactNode> = {
    banner:         renderBanner,
    intro:          renderIntro,
    mission_vision: renderMissionVision,
    values:         renderValues,
    leadership:     renderLeadership,
    timeline:       renderTimeline,
  };

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="About Us CMS"
        description="Edit content for each section of the About Us page"
        actions={
          <button
            onClick={save}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
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
