"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, FolderOpen, Newspaper, Images, FileText,
  Home, MessageSquare, Users, UserRound, Settings, LogOut, Zap, ChevronRight,
} from "lucide-react";
import { ROLE_LABELS, ROLE_COLORS, canManageUsers, canAccessSettings, canDelete } from "@/lib/role-utils";
import type { UserRole } from "@/lib/role-utils";

interface NavItem {
  label:    string;
  href:     string;
  icon:     React.ElementType;
  roles?:   UserRole[];   // undefined = all roles allowed
}

const NAV_GROUPS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    heading: "Content",
    items: [
      { label: "Projects",   href: "/admin/projects",   icon: FolderOpen   },
      { label: "News",       href: "/admin/news",        icon: Newspaper    },
      { label: "Gallery",    href: "/admin/gallery",     icon: Images       },
      { label: "Documents",  href: "/admin/documents",   icon: FileText     },
    ],
  },
  {
    heading: "Management",
    items: [
      { label: "Homepage",  href: "/admin/homepage",  icon: Home,           roles: ["admin", "super_admin"] },
      { label: "About Us",  href: "/admin/about",     icon: FileText,       roles: ["admin", "super_admin"] },
      { label: "Services",  href: "/admin/services",  icon: Zap,            roles: ["admin", "super_admin"] },
      { label: "Team",      href: "/admin/team",      icon: UserRound,      roles: ["admin", "super_admin"] },
      { label: "Contacts",  href: "/admin/contacts",  icon: MessageSquare,  roles: ["admin", "super_admin"] },
      { label: "Users",     href: "/admin/users",     icon: Users,          roles: ["super_admin"]          },
      { label: "Settings",  href: "/admin/settings",  icon: Settings,       roles: ["admin", "super_admin"] },
    ],
  },
];

interface Props {
  userName: string;
  userRole: UserRole;
}

export function AdminSidebar({ userName, userRole }: Props) {
  const pathname = usePathname();

  const isVisible = (item: NavItem) =>
    !item.roles || item.roles.includes(userRole);

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/30">
          <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground truncate leading-tight">Ghamkheti Guru</p>
          <p className="text-[10px] text-foreground-subtle leading-tight">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(isVisible);
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.heading}>
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-foreground-subtle">
                {group.heading}
              </p>
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors group ${
                          active
                            ? "bg-primary/12 text-primary"
                            : "text-foreground-muted hover:bg-surface hover:text-foreground"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-foreground-subtle group-hover:text-foreground"}`} strokeWidth={1.8} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {active && <ChevronRight className="h-3 w-3 text-primary" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* User info + sign out */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-surface mb-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 border border-primary/20">
            <span className="text-xs font-bold text-primary">
              {userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate leading-tight">{userName}</p>
            <span className={`inline-block mt-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded border leading-none ${ROLE_COLORS[userRole]}`}>
              {ROLE_LABELS[userRole]}
            </span>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground-muted hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <LogOut className="h-4 w-4 shrink-0 text-foreground-subtle group-hover:text-red-400 transition-colors" strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
