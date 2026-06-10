"use client";

import { useState, useTransition } from "react";
import { Save, RefreshCw, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/admin/FileUpload";
import { useToast } from "@/lib/toast";

interface SectionDoc {
  section:   string;
  title?:    string;
  subtitle?: string;
  body?:     string;
  items:     Record<string, unknown>[];
}

const SECTION_TABS = [
  { value: "banner",         label: "Banner"            },
  { value: "intro",          label: "Our Story"         },
  { value: "mission_vision", label: "Mission & Vision"  },
  { value: "values",         label: "Core Values"       },
  { value: "leadership",     label: "Leadership Message"},
  { value: "board",          label: "Board of Directors"},
  { value: "timeline",       label: "Timeline"          },
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
    <button
      type="button"
      onClick={onClick}
      className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
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
          <Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Building Nepal's Sustainable Future" />
        </F>
        <F label="Description" hint="shown below the title in the hero banner">
          <Textarea rows={3} value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="An integrated Energy, Agriculture, and Tourism company…" />
        </F>
      </div>
    );
  }

  function renderIntro() {
    type Fact = { label?: string; value?: string };
    const facts = (doc.items ?? []) as Fact[];
    function updateFact(i: number, field: keyof Fact, val: string) {
      const next = [...facts] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: val };
      patch({ items: next });
    }
    function removeFact(i: number) { patch({ items: facts.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addFact() { patch({ items: [...facts, { label: "", value: "" }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-5">
        <F label="Paragraph 1">
          <Textarea rows={4} value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="Ghamkheti Guru Company Limited was established with a clear mandate…" />
        </F>
        <F label="Paragraph 2">
          <Textarea rows={4} value={doc.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="We are an integrated company spanning Energy, Agriculture, and Tourism…" />
        </F>
        <F label="Paragraph 3" hint="optional">
          <Textarea rows={4} value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="We work with the Government of Nepal and the Nepal Electricity Authority…" />
        </F>

        <div>
          <p className="text-xs font-medium text-foreground mb-3">Company Facts <span className="text-foreground-subtle font-normal">(key–value pairs shown in the right column)</span></p>
          <div className="space-y-3">
            {facts.map((f, i) => (
              <div key={i} className="rounded-xl border border-border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Fact {i + 1}</p>
                  <RemoveBtn onClick={() => removeFact(i)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Label"><Input value={f.label ?? ""} onChange={(e) => updateFact(i, "label", e.target.value)} placeholder="Headquarters" /></F>
                  <F label="Value"><Input value={f.value ?? ""} onChange={(e) => updateFact(i, "value", e.target.value)} placeholder="Kathmandu, Nepal" /></F>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3"><AddBtn onClick={addFact} label="Add Fact" /></div>
        </div>
      </div>
    );
  }

  function renderMissionVision() {
    return (
      <div className="space-y-5">
        <F label="Mission Statement">
          <Textarea rows={4} value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="To develop Nepal's natural wealth into world-class energy and agro-industrial infrastructure…" />
        </F>
        <F label="Vision Statement">
          <Textarea rows={4} value={doc.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="To be Nepal's defining integrated infrastructure company…" />
        </F>
      </div>
    );
  }

  function renderValues() {
    type Value = { title?: string; description?: string };
    const values = (doc.items ?? []) as Value[];
    function updateValue(i: number, field: keyof Value, val: string) {
      const next = [...values] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: val };
      patch({ items: next });
    }
    function removeValue(i: number) { patch({ items: values.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addValue() { patch({ items: [...values, { title: "", description: "" }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-4">
        <p className="text-xs text-foreground-muted">Up to 6 values. Icons are auto-assigned by position.</p>
        {values.map((v, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Value {i + 1}</p>
              <RemoveBtn onClick={() => removeValue(i)} />
            </div>
            <F label="Title"><Input value={v.title ?? ""} onChange={(e) => updateValue(i, "title", e.target.value)} placeholder="Excellence" /></F>
            <F label="Description"><Textarea rows={2} value={v.description ?? ""} onChange={(e) => updateValue(i, "description", e.target.value)} placeholder="We hold our projects to the highest standards…" /></F>
          </div>
        ))}
        {values.length < 6 && <AddBtn onClick={addValue} label="Add Value" />}
      </div>
    );
  }

  function renderBoard() {
    const members = (doc.items ?? []) as { name: string; title: string; bio?: string; photo?: string }[];

    function updateMember(i: number, field: keyof typeof members[0], value: string) {
      const next = [...members] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: value };
      patch({ items: next });
    }
    function removeMember(i: number) { patch({ items: members.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addMember() { patch({ items: [...members, { name: "", title: "", bio: "", photo: "" }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">
          Board members are displayed in a grid on the About page. Upload a portrait photo for each person.
        </p>
        {members.map((m, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Member {i + 1}</p>
              <RemoveBtn onClick={() => removeMember(i)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Full Name"><Input value={m.name} onChange={(e) => updateMember(i, "name", e.target.value)} placeholder="Hon. [Full Name]" /></F>
              <F label="Title / Position"><Input value={m.title} onChange={(e) => updateMember(i, "title", e.target.value)} placeholder="Chairman & Managing Director" /></F>
            </div>
            <F label="Short Bio" hint="optional">
              <Textarea rows={2} value={m.bio ?? ""} onChange={(e) => updateMember(i, "bio", e.target.value)} placeholder="Brief background (1–2 sentences)…" />
            </F>
            <F label="Photo">
              <FileUpload kind="image" value={m.photo ?? ""} onChange={(url) => updateMember(i, "photo", url)} label="Portrait photo (recommended: square, 400×400 minimum)" />
            </F>
          </div>
        ))}
        <AddBtn onClick={addMember} label="Add Board Member" />
      </div>
    );
  }

  function renderTimeline() {
    type Milestone = { year?: string; event?: string };
    const milestones = (doc.items ?? []) as Milestone[];
    function updateMilestone(i: number, field: keyof Milestone, val: string) {
      const next = [...milestones] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: val };
      patch({ items: next });
    }
    function removeMilestone(i: number) { patch({ items: milestones.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addMilestone() { patch({ items: [...milestones, { year: "", event: "" }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-4">
        <p className="text-xs text-foreground-muted">Milestones displayed in order. Use short labels for the year (e.g. "2009", "2077 BS", "Foundation").</p>
        {milestones.map((m, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Milestone {i + 1}</p>
              <RemoveBtn onClick={() => removeMilestone(i)} />
            </div>
            <F label="Year / Label"><Input value={m.year ?? ""} onChange={(e) => updateMilestone(i, "year", e.target.value)} placeholder="2009" /></F>
            <F label="Event"><Textarea rows={2} value={m.event ?? ""} onChange={(e) => updateMilestone(i, "event", e.target.value)} placeholder="Ghamkheti Guru Company Limited established…" /></F>
          </div>
        ))}
        <AddBtn onClick={addMilestone} label="Add Milestone" />
      </div>
    );
  }

  function renderLeadership() {
    type LeaderInfo = { photo?: string; quote?: string };
    const info = ((doc.items ?? [])[0] ?? {}) as LeaderInfo;
    function patchInfo(field: keyof LeaderInfo, val: string) {
      const next = [{ ...info, [field]: val }] as Record<string, unknown>[];
      patch({ items: next });
    }
    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">
          This message appears on the About Us page. It can be from the Chairman, MD, or any leader — just update the name and title fields.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <F label="Name">
            <Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Hon. [Full Name]" />
          </F>
          <F label="Title / Role">
            <Input value={doc.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="Chairman & Managing Director" />
          </F>
        </div>
        <F label="Photo">
          <FileUpload kind="image" value={info.photo ?? ""} onChange={(url) => patchInfo("photo", url)} label="Portrait photo (recommended: square, minimum 400×400px)" />
        </F>
        <F label="Featured Quote" hint="displayed as a highlighted pull-quote">
          <Textarea rows={2} value={info.quote ?? ""} onChange={(e) => patchInfo("quote", e.target.value)} placeholder="We are committed to building a sustainable Nepal through clean energy and agriculture." />
        </F>
        <F label="Full Message" hint="the complete message text — use line breaks for paragraphs">
          <Textarea rows={10} value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder={"Dear Stakeholders,\n\nAt Ghamkheti Guru Company Limited, our mission is…\n\nWe remain committed to…"} />
        </F>
      </div>
    );
  }

  const editors: Record<string, () => React.ReactNode> = {
    banner:         renderBanner,
    intro:          renderIntro,
    mission_vision: renderMissionVision,
    values:         renderValues,
    leadership:     renderLeadership,
    board:          renderBoard,
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
