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
  embedUrl?: string;
  items:     Record<string, unknown>[];
}

const SECTION_TABS = [
  { value: "page_header", label: "Page Header" },
  { value: "intro",       label: "Intro Text"  },
  { value: "offices",     label: "Offices"     },
  { value: "map",         label: "Map"         },
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

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors">
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-surface text-sm text-foreground-subtle hover:text-foreground transition-colors">
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ContactPageClient({ initialData }: { initialData: any[] }) {
  const { success, error } = useToast();
  const [tab, setTab] = useState("page_header");
  const [sections, setSections] = useState<Record<string, SectionDoc>>(
    Object.fromEntries(initialData.map((s) => [s.section, { ...s, items: (s.items ?? []) as Record<string, unknown>[] }]))
  );
  const [isPending, startTransition] = useTransition();

  const doc: SectionDoc = sections[tab] ?? { section: tab, items: [] };

  function patch(delta: Partial<SectionDoc>) {
    setSections((prev) => ({ ...prev, [tab]: { ...(prev[tab] ?? { section: tab, items: [] }), ...delta } }));
  }

  function save() {
    startTransition(async () => {
      const { items, title, subtitle, body, embedUrl } = doc;
      const payload: Record<string, unknown> = { items };
      if (title    !== undefined) payload.title    = title;
      if (subtitle !== undefined) payload.subtitle = subtitle;
      if (body     !== undefined) payload.body     = body;
      if (embedUrl !== undefined) payload.embedUrl = embedUrl;

      const res = await fetch(`/api/admin/contact-page/${tab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { error("Save failed", json.error); return; }
      success("Section saved");
    });
  }

  function renderPageHeader() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">Controls the banner at the top of the Contact Us page.</p>
        <F label="Page Title"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="We'd Love to Hear From You" /></F>
        <F label="Description"><Textarea rows={3} value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="Our team is ready to engage with investors, government bodies…" /></F>
      </div>
    );
  }

  function renderIntro() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">Controls the left-side heading and paragraph text next to the contact form.</p>
        <F label="Heading"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Let's Start a Conversation" /></F>
        <F label="Body Text"><Textarea rows={4} value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="Whether you're a potential investor, government counterpart…" /></F>
      </div>
    );
  }

  function renderOffices() {
    type Office = { name?: string; city?: string; address?: string };
    const offices = (doc.items ?? []) as Office[];

    function updateOffice(i: number, field: keyof Office, val: string) {
      const next = [...offices] as Record<string, unknown>[];
      next[i] = { ...next[i], [field]: val };
      patch({ items: next });
    }
    function removeOffice(i: number) { patch({ items: offices.filter((_, idx) => idx !== i) as Record<string, unknown>[] }); }
    function addOffice() { patch({ items: [...offices, { name: "", city: "", address: "" }] as Record<string, unknown>[] }); }

    return (
      <div className="space-y-5">
        <F label="Section Title"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Find Our Offices" /></F>
        <F label="Section Description"><Textarea rows={2} value={doc.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="Four offices across Nepal…" /></F>
        <div>
          <p className="text-xs font-medium text-foreground mb-3">Office Locations</p>
          <div className="space-y-3">
            {offices.map((o, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">Office {i + 1}</p>
                  <RemoveBtn onClick={() => removeOffice(i)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Name"><Input value={o.name ?? ""} onChange={(e) => updateOffice(i, "name", e.target.value)} placeholder="Headquarters" /></F>
                  <F label="City"><Input value={o.city ?? ""} onChange={(e) => updateOffice(i, "city", e.target.value)} placeholder="Kathmandu" /></F>
                </div>
                <F label="Address"><Input value={o.address ?? ""} onChange={(e) => updateOffice(i, "address", e.target.value)} placeholder="Trade Tower, Thapathali, Kathmandu 44600" /></F>
              </div>
            ))}
          </div>
          <div className="mt-3"><AddBtn onClick={addOffice} label="Add Office" /></div>
        </div>
      </div>
    );
  }

  function renderMap() {
    return (
      <div className="space-y-5">
        <p className="text-xs text-foreground-muted">Controls the map section shown below the office cards.</p>
        <F label="Location Name"><Input value={doc.title ?? ""} onChange={(e) => patch({ title: e.target.value })} placeholder="Trade Tower, Thapathali, Kathmandu" /></F>
        <F label="Location Label" hint="shown below the name"><Input value={doc.subtitle ?? ""} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="Ghamkheti Guru Company Limited HQ" /></F>
        <F label="Google Maps URL" hint="opens when user clicks 'Open in Google Maps'"><Input value={doc.body ?? ""} onChange={(e) => patch({ body: e.target.value })} placeholder="https://maps.google.com/?q=Trade+Tower+Thapathali+Kathmandu" /></F>
        <F label="Google Maps Embed URL" hint="from Google Maps → Share → Embed a map → copy the src= URL">
          <Input
            value={doc.embedUrl ?? ""}
            onChange={(e) => patch({ embedUrl: e.target.value })}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <p className="text-[10px] text-foreground-subtle mt-1.5">
            In Google Maps: click Share → Embed a map → copy only the URL inside <code>src="..."</code>
          </p>
        </F>
      </div>
    );
  }

  const editors: Record<string, () => React.ReactNode> = {
    page_header: renderPageHeader,
    intro:       renderIntro,
    offices:     renderOffices,
    map:         renderMap,
  };

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="Contact Page CMS"
        description="Edit content for the Contact Us page"
        actions={
          <button onClick={save} disabled={isPending} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Section
          </button>
        }
      />
      <Tabs tabs={SECTION_TABS} active={tab} onChange={setTab} />
      <div key={tab} className="rounded-xl bg-surface border border-border p-6">
        {(editors[tab] ?? (() => null))()}
      </div>
    </div>
  );
}
