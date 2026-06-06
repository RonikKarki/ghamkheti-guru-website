"use client";

import { useState, useTransition, useMemo } from "react";
import { Plus, Pencil, Trash2, ShieldCheck, Search } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/lib/toast";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/role-utils";
import type { Column } from "@/components/admin/DataTable";
import type { UserRole } from "@/lib/role-utils";

interface AdminUser {
  _id: string; name: string; email: string; role: UserRole;
  isActive: boolean; loginCount: number; lastLoginAt?: string; createdAt: string;
}

const BLANK_CREATE = { name: "", email: "", password: "", role: "editor" as UserRole };
const BLANK_EDIT   = { name: "", role: "editor" as UserRole, isActive: true };

export default function UsersClient({
  initialData, currentUserId,
}: { initialData: AdminUser[]; currentUserId: string }) {
  const { success, error } = useToast();
  const [users, setUsers]   = useState(initialData);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [createOpen, setCreateOpen]   = useState(false);
  const [editTarget, setEditTarget]   = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [createForm, setCreateForm]   = useState(BLANK_CREATE);
  const [editForm, setEditForm]       = useState(BLANK_EDIT);
  const [isPending, startTransition]  = useTransition();

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q) return true;
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, search, roleFilter]);

  function openEdit(u: AdminUser) {
    setEditTarget(u);
    setEditForm({ name: u.name, role: u.role, isActive: u.isActive });
  }

  function handleCreate() {
    startTransition(async () => {
      const res  = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(createForm) });
      const json = await res.json();
      if (!res.ok) { error("Create failed", json.error); return; }
      setUsers((prev) => [json.data, ...prev]);
      success("User created");
      setCreateOpen(false);
      setCreateForm(BLANK_CREATE);
    });
  }

  function handleEdit() {
    if (!editTarget) return;
    startTransition(async () => {
      const res  = await fetch(`/api/admin/users/${editTarget._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) });
      const json = await res.json();
      if (!res.ok) { error("Update failed", json.error); return; }
      setUsers((prev) => prev.map((u) => u._id === editTarget._id ? { ...u, ...editForm } : u));
      success("User updated");
      setEditTarget(null);
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${deleteTarget._id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { error("Delete failed", json.error); return; }
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      success("User removed");
      setDeleteTarget(null);
    });
  }

  const columns: Column<AdminUser>[] = [
    { header: "User", key: "name", render: (u) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <span className="text-xs font-bold text-primary">
            {u.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{u.name} {u._id === currentUserId && <span className="text-[10px] text-foreground-subtle">(you)</span>}</p>
          <p className="text-xs text-foreground-subtle">{u.email}</p>
        </div>
      </div>
    )},
    { header: "Role", key: "role", render: (u) => (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${ROLE_COLORS[u.role]}`}>
        <ShieldCheck className="h-3 w-3" /> {ROLE_LABELS[u.role]}
      </span>
    )},
    { header: "Status", key: "isActive", render: (u) => <StatusBadge status={u.isActive ? "active" : "inactive"} /> },
    { header: "Logins", key: "loginCount", render: (u) => <span className="text-xs text-foreground-muted">{u.loginCount}</span> },
    { header: "Last Login", key: "lastLoginAt", render: (u) =>
      <span className="text-xs text-foreground-subtle">{u.lastLoginAt ? fmtDate(u.lastLoginAt) : "Never"}</span>
    },
    { header: "", key: "actions", className: "w-20", render: (u) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); openEdit(u); }}
          className="p-1.5 rounded-lg text-foreground-subtle hover:text-primary hover:bg-primary/10 transition-colors">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        {u._id !== currentUserId && (
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(u); }}
            className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader
        title="Users & Access"
        description={`${filteredUsers.length} of ${users.length} staff account${users.length !== 1 ? "s" : ""}`}
        actions={
          <button onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add User
          </button>
        }
      />

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-subtle pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="pl-9 text-sm"
          />
        </div>
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-44 text-sm">
          <option value="all">All roles</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredUsers} keyExtractor={(u) => u._id}
        emptyTitle="No users found" emptyDescription="Add staff accounts to grant portal access." />

      {/* Create user modal */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title="Add Staff User" size="sm"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground rounded-lg hover:bg-surface transition-colors">Cancel</button>
            <button onClick={handleCreate} disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              Create User
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Full Name *</label>
            <Input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="Raj Kumar Sharma" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Email *</label>
            <Input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} placeholder="raj@ghamkhetiguru.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Password *</label>
            <Input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} placeholder="Min. 8 characters" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Role</label>
            <Select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })}>
              <option value="editor">Editor — Create & edit content</option>
              <option value="admin">Admin — Full content management</option>
              <option value="super_admin">Super Admin — Full access</option>
            </Select>
          </div>
        </div>
      </Dialog>

      {/* Edit user modal */}
      <Dialog open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit User" size="sm"
        footer={
          <>
            <button onClick={() => setEditTarget(null)} className="px-4 py-2 text-sm text-foreground-muted hover:text-foreground rounded-lg hover:bg-surface transition-colors">Cancel</button>
            <button onClick={handleEdit} disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {isPending && <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              Save Changes
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Full Name</label>
            <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Role</label>
            <Select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </Select>
          </div>
          <Switch checked={editForm.isActive} onChange={(v) => setEditForm({ ...editForm, isActive: v })}
            label={editForm.isActive ? "Account active" : "Account suspended"} />
        </div>
      </Dialog>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} isLoading={isPending}
        title="Remove user?" description={`${deleteTarget?.name} will lose all access immediately.`}
        confirmLabel="Remove User"
      />
    </div>
  );
}

function fmtDate(d: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
}
