"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, Save, GripVertical, Globe, Mail, Phone, MapPin, Check } from "lucide-react";

interface FooterLink { label: string; href: string; }
interface SocialLink { platform: string; href: string; enabled: boolean; }

interface FooterData {
  _id?: string;
  email: string;
  phone: string;
  address: string;
  companyLinks: FooterLink[];
  sectorLinks: FooterLink[];
  legalLinks: FooterLink[];
  socialLinks: SocialLink[];
  newsletterEnabled: boolean;
  copyrightText: string;
}

const SOCIAL_PLATFORMS = ["twitter", "linkedin", "facebook", "instagram", "youtube"];

const TABS = ["Contact", "Company Links", "Sector Links", "Social & Legal"] as const;
type Tab = typeof TABS[number];

function LinkListEditor({
  links,
  onChange,
}: {
  links: FooterLink[];
  onChange: (links: FooterLink[]) => void;
}) {
  const add = () => onChange([...links, { label: "", href: "" }]);
  const remove = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof FooterLink, val: string) => {
    const next = [...links];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-foreground-subtle shrink-0" />
          <input
            value={link.label}
            onChange={(e) => update(i, "label", e.target.value)}
            placeholder="Label"
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary/50"
          />
          <input
            value={link.href}
            onChange={(e) => update(i, "href", e.target.value)}
            placeholder="/path or https://..."
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary/50"
          />
          <button
            onClick={() => remove(i)}
            className="p-1.5 rounded-md text-foreground-subtle hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors mt-1"
      >
        <Plus className="h-4 w-4" /> Add link
      </button>
    </div>
  );
}

export default function FooterSettingsClient({ initialData }: { initialData: FooterData }) {
  const [data, setData] = useState<FooterData>(initialData);
  const [tab, setTab] = useState<Tab>("Contact");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = useCallback(<K extends keyof FooterData>(key: K, val: FooterData[K]) => {
    setData((d) => ({ ...d, [key]: val }));
    setSaved(false);
  }, []);

  const updateSocial = (i: number, field: keyof SocialLink, val: string | boolean) => {
    const next = [...data.socialLinks];
    next[i] = { ...next[i], [field]: val };
    set("socialLinks", next);
  };

  const addSocial = () => {
    set("socialLinks", [...data.socialLinks, { platform: "facebook", href: "", enabled: true }]);
  };

  const removeSocial = (i: number) => {
    set("socialLinks", data.socialLinks.filter((_, idx) => idx !== i));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Footer Settings</h1>
          <p className="text-sm text-foreground-muted mt-0.5">Manage all footer content visible on every page</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-foreground-muted hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Contact */}
      {tab === "Contact" && (
        <div className="space-y-4">
          <Field icon={<Mail className="h-4 w-4" />} label="Email Address">
            <input
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
              type="email"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            />
          </Field>
          <Field icon={<Phone className="h-4 w-4" />} label="Phone Number">
            <input
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            />
          </Field>
          <Field icon={<MapPin className="h-4 w-4" />} label="Office Address">
            <textarea
              value={data.address}
              onChange={(e) => set("address", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
          </Field>
          <Field icon={null} label="Copyright Text (optional — leave blank to use default)">
            <input
              value={data.copyrightText}
              onChange={(e) => set("copyrightText", e.target.value)}
              placeholder={`© ${new Date().getFullYear()} Ghamkheti Guru Company Limited. All rights reserved.`}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary/50"
            />
          </Field>
          <Field icon={null} label="Newsletter Signup">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set("newsletterEnabled", !data.newsletterEnabled)}
                className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${data.newsletterEnabled ? "bg-primary" : "bg-border"}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${data.newsletterEnabled ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-sm text-foreground-muted">{data.newsletterEnabled ? "Visible in footer" : "Hidden"}</span>
            </label>
          </Field>
        </div>
      )}

      {/* Company Links */}
      {tab === "Company Links" && (
        <div className="space-y-3">
          <p className="text-sm text-foreground-muted">These appear in the "Company" column of the footer.</p>
          <LinkListEditor links={data.companyLinks} onChange={(v) => set("companyLinks", v)} />
        </div>
      )}

      {/* Sector Links */}
      {tab === "Sector Links" && (
        <div className="space-y-3">
          <p className="text-sm text-foreground-muted">These appear in the "Sectors" column of the footer.</p>
          <LinkListEditor links={data.sectorLinks} onChange={(v) => set("sectorLinks", v)} />
        </div>
      )}

      {/* Social & Legal */}
      {tab === "Social & Legal" && (
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Social Media Links</p>
            <p className="text-sm text-foreground-muted">Icons appear in the bottom bar of the footer.</p>
            <div className="space-y-2">
              {data.socialLinks.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={s.platform}
                    onChange={(e) => updateSocial(i, "platform", e.target.value)}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 w-36"
                  >
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                  <input
                    value={s.href}
                    onChange={(e) => updateSocial(i, "href", e.target.value)}
                    placeholder="https://..."
                    className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder-foreground-subtle focus:outline-none focus:border-primary/50"
                  />
                  <button
                    onClick={() => updateSocial(i, "enabled", !s.enabled)}
                    className={`text-xs px-2.5 py-1.5 rounded-md border font-medium transition-colors ${
                      s.enabled
                        ? "border-primary/30 text-primary bg-primary/5"
                        : "border-border text-foreground-subtle"
                    }`}
                  >
                    {s.enabled ? "On" : "Off"}
                  </button>
                  <button onClick={() => removeSocial(i)} className="p-1.5 rounded-md text-foreground-subtle hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button onClick={addSocial} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors mt-1">
                <Plus className="h-4 w-4" /> Add social link
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Legal Links</p>
            <p className="text-sm text-foreground-muted">These appear in the bottom copyright bar.</p>
            <LinkListEditor links={data.legalLinks} onChange={(v) => set("legalLinks", v)} />
          </div>
        </div>
      )}

      {/* Bottom save */}
      <div className="pt-4 border-t border-border flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
