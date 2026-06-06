import { Bell } from "lucide-react";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/role-utils";
import type { UserRole } from "@/lib/role-utils";

interface Props {
  title?:    string;
  userName:  string;
  userRole:  UserRole;
}

export function AdminHeader({ title, userName, userRole }: Props) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      {/* Page title */}
      <h1 className="text-sm font-semibold text-foreground">
        {title ?? "Admin"}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification bell — placeholder */}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" strokeWidth={1.8} />
        </button>

        {/* Role badge */}
        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${ROLE_COLORS[userRole]}`}>
          {ROLE_LABELS[userRole]}
        </span>

        {/* User monogram */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 border border-primary/20">
          <span className="text-xs font-bold text-primary">
            {userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
}
