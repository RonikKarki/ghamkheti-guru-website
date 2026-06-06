"use client";

import { useState, useTransition } from "react";
import { Save, RefreshCw, Info } from "lucide-react";
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
  { value: "banner",       label: "Banner"       },
  { value: "departments",  label: "Departments"  },
  { value: "leadership",   label: "Leadership"   },
  { value: "team_members", label: "Team Members" },
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
  rows = 14,
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
export default function TeamClient({ initialData }: { initialData: any[] }) {
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

      const res = await fetch(`/api/admin/team/${tab}`, {
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
            placeholder="The People Behind the Impact"
          />
        </F>
        <F label="Description" hint="shown below the title in the hero banner">
          <Textarea
            rows={3}
            value={doc.body ?? ""}
            onChange={(e) => patch({ body: e.target.value })}
            placeholder="Specialists across energy, technology, agriculture, and consulting…"
          />
        </F>
      </div>
    );
  }

  function renderDepartments() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">Department stat boxes shown at the top of the Team page.</p>
        <JsonEditor
          value={doc.items}
          onChange={(v) => patch({ items: v })}
          hint='[{"name":"Energy","count":28},{"name":"Technology","count":42},…]'
          rows={10}
        />
      </div>
    );
  }

  function renderLeadership() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">Executive leadership cards (large cards). Include name, role, department, bio, and optional linkedin URL.</p>
        <JsonEditor
          value={doc.items}
          onChange={(v) => patch({ items: v })}
          hint='[{"name":"Kwame Asante","role":"Chief Executive Officer","department":"Leadership","bio":"20+ years in energy…","linkedin":"https://linkedin.com/in/…"},…]'
          rows={16}
        />
      </div>
    );
  }

  function renderTeamMembers() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">Regular team members grid. Include name, role, department, and optional linkedin URL.</p>
        <JsonEditor
          value={doc.items}
          onChange={(v) => patch({ items: v })}
          hint='[{"name":"Abena Sarfo","role":"Head of Renewable Energy","department":"Energy","linkedin":"#"},…]'
          rows={18}
        />
      </div>
    );
  }

  const editors: Record<string, () => React.ReactNode> = {
    banner:       renderBanner,
    departments:  renderDepartments,
    leadership:   renderLeadership,
    team_members: renderTeamMembers,
  };

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="Team CMS"
        description="Edit content for each section of the Our Team page"
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
