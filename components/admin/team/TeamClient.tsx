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
      const res = await fetch(`/api/admin/team/${tab}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) { error("Save failed", json.error); return; }
      success("Section saved");
    });
  }

  function renderBanner() {
    return (
      <div className="space-y-5">
        <F label="Page Title"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="The People Behind the Impact" /></F>
        <F label="Description" hint="shown below the title in the hero banner">
          <Textarea rows={3} value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="Specialists across energy, technology, agriculture, and consulting…" />
        </F>
      </div>
    );
  }

  function renderDepartments() {
    type Dept = { name?: string; count?: number | string };
    const depts = (doc.items ?? []) as Dept[];
    function updateDept(i: number, field: keyof Dept, val: string) {
      const next = [...depts] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: field === "count" ? (isNaN(Number(val)) ? val : Number(val)) : val };
      patch({ items: next });
    }
    function removeDept(i: number) { patch({ items: depts.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addDept() { patch({ items: [...depts, { name: "", count: 0 }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-4">
        <p className="text-xs text-foreground-muted">Department stat boxes shown at the top of the Team page.</p>
        {depts.map((d, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Department {i + 1}</p>
              <RemoveBtn onClick={() => removeDept(i)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Name"><Input value={d.name ?? ""} onChange={(e) => updateDept(i, "name", e.target.value)} placeholder="Energy" /></F>
              <F label="Count"><Input type="number" value={String(d.count ?? "")} onChange={(e) => updateDept(i, "count", e.target.value)} placeholder="28" /></F>
            </div>
          </div>
        ))}
        <AddBtn onClick={addDept} label="Add Department" />
      </div>
    );
  }

  function renderLeadership() {
    type Leader = { name?: string; role?: string; department?: string; bio?: string; linkedin?: string };
    const leaders = (doc.items ?? []) as Leader[];
    function updateLeader(i: number, field: keyof Leader, val: string) {
      const next = [...leaders] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: val };
      patch({ items: next });
    }
    function removeLeader(i: number) { patch({ items: leaders.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addLeader() { patch({ items: [...leaders, { name: "", role: "", department: "", bio: "", linkedin: "" }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-4">
        <p className="text-xs text-foreground-muted">Executive leadership — shown as large cards on the Team page.</p>
        {leaders.map((l, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Leader {i + 1}</p>
              <RemoveBtn onClick={() => removeLeader(i)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Full Name"><Input value={l.name ?? ""} onChange={(e) => updateLeader(i, "name", e.target.value)} placeholder="Full Name" /></F>
              <F label="Role"><Input value={l.role ?? ""} onChange={(e) => updateLeader(i, "role", e.target.value)} placeholder="Chief Executive Officer" /></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Department"><Input value={l.department ?? ""} onChange={(e) => updateLeader(i, "department", e.target.value)} placeholder="Leadership" /></F>
              <F label="LinkedIn URL" hint="optional"><Input value={l.linkedin ?? ""} onChange={(e) => updateLeader(i, "linkedin", e.target.value)} placeholder="https://linkedin.com/in/…" /></F>
            </div>
            <F label="Bio"><Textarea rows={3} value={l.bio ?? ""} onChange={(e) => updateLeader(i, "bio", e.target.value)} placeholder="20+ years in energy…" /></F>
          </div>
        ))}
        <AddBtn onClick={addLeader} label="Add Leader" />
      </div>
    );
  }

  function renderTeamMembers() {
    type Member = { name?: string; role?: string; department?: string; linkedin?: string };
    const members = (doc.items ?? []) as Member[];
    function updateMember(i: number, field: keyof Member, val: string) {
      const next = [...members] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: val };
      patch({ items: next });
    }
    function removeMember(i: number) { patch({ items: members.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addMember() { patch({ items: [...members, { name: "", role: "", department: "", linkedin: "" }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-4">
        <p className="text-xs text-foreground-muted">Regular team members shown in the grid.</p>
        {members.map((m, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Member {i + 1}</p>
              <RemoveBtn onClick={() => removeMember(i)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Full Name"><Input value={m.name ?? ""} onChange={(e) => updateMember(i, "name", e.target.value)} placeholder="Full Name" /></F>
              <F label="Role"><Input value={m.role ?? ""} onChange={(e) => updateMember(i, "role", e.target.value)} placeholder="Head of Renewable Energy" /></F>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <F label="Department"><Input value={m.department ?? ""} onChange={(e) => updateMember(i, "department", e.target.value)} placeholder="Energy" /></F>
              <F label="LinkedIn URL" hint="optional"><Input value={m.linkedin ?? ""} onChange={(e) => updateMember(i, "linkedin", e.target.value)} placeholder="https://linkedin.com/in/…" /></F>
            </div>
          </div>
        ))}
        <AddBtn onClick={addMember} label="Add Team Member" />
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
