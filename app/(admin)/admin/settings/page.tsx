"use client";

import { useState, useTransition } from "react";
import { Save, Eye, EyeOff, Shield, User, Server, Globe } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/toast";
import { useSession } from "next-auth/react";

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-surface border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-background">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs text-foreground-subtle">{label}</span>
      <span className="text-xs font-medium text-foreground font-mono">{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { success, error } = useToast();

  const [profileForm, setProfileForm] = useState({ name: session?.user?.name ?? "" });
  const [pwForm, setPwForm]     = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw]     = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleProfileSave() {
    if (!profileForm.name.trim()) { error("Name is required"); return; }
    startTransition(async () => {
      const id  = (session?.user as { id?: string })?.id;
      if (!id) { error("Session error"); return; }
      const res  = await fetch(`/api/admin/users/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileForm.name }),
      });
      const json = await res.json();
      if (!res.ok) { error("Update failed", json.error); return; }
      success("Profile updated");
    });
  }

  function handlePasswordSave() {
    if (!pwForm.current) { error("Current password required"); return; }
    if (pwForm.next.length < 8) { error("New password must be at least 8 characters"); return; }
    if (pwForm.next !== pwForm.confirm) { error("Passwords do not match"); return; }
    startTransition(async () => {
      const id  = (session?.user as { id?: string })?.id;
      if (!id) { error("Session error"); return; }
      const res  = await fetch(`/api/admin/users/${id}/password`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const json = await res.json();
      if (!res.ok) { error("Password change failed", json.error); return; }
      success("Password updated");
      setPwForm({ current: "", next: "", confirm: "" });
    });
  }

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader title="Settings" description="Manage your account and system preferences" />

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Full Name</label>
            <Input value={profileForm.name} onChange={(e) => setProfileForm({ name: e.target.value })} placeholder="Your name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
            <Input value={session?.user?.email ?? ""} disabled className="opacity-50 cursor-not-allowed" />
            <p className="mt-1 text-[10px] text-foreground-subtle">Email cannot be changed. Contact a Super Admin if needed.</p>
          </div>
          <div className="flex justify-end">
            <button onClick={handleProfileSave} disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              <Save className="h-3.5 w-3.5" /> Save Profile
            </button>
          </div>
        </div>
      </Section>

      {/* Password */}
      <Section title="Change Password" icon={Shield}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Current Password</label>
            <div className="relative">
              <Input type={showPw ? "text" : "password"} value={pwForm.current}
                onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground">
                {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">New Password</label>
            <Input type={showPw ? "text" : "password"} value={pwForm.next}
              onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} placeholder="Min. 8 characters" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Confirm New Password</label>
            <Input type={showPw ? "text" : "password"} value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} placeholder="Repeat new password" />
          </div>
          <div className="flex justify-end">
            <button onClick={handlePasswordSave} disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              <Shield className="h-3.5 w-3.5" /> Update Password
            </button>
          </div>
        </div>
      </Section>

      {/* Session info */}
      <Section title="Your Session" icon={Globe}>
        <div>
          <InfoRow label="Name"  value={session?.user?.name  ?? "—"} />
          <InfoRow label="Email" value={session?.user?.email ?? "—"} />
          <InfoRow label="Role"  value={(session?.user as { role?: string })?.role ?? "—"} />
        </div>
      </Section>

      {/* System info */}
      <Section title="System" icon={Server}>
        <div>
          <InfoRow label="Application" value="Ghamkheti Guru Portal" />
          <InfoRow label="Framework"   value="Next.js 16 (App Router)" />
          <InfoRow label="Database"    value="MongoDB Atlas" />
          <InfoRow label="Environment" value={process.env.NODE_ENV ?? "production"} />
        </div>
      </Section>
    </div>
  );
}
