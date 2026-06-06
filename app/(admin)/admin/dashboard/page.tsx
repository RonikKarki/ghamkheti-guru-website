import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth-utils";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import News from "@/models/News";
import Contact from "@/models/Contact";
import User from "@/models/User";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  FolderOpen, Newspaper, MessageSquare, Users,
  TrendingUp, CheckCircle, AlertCircle, Plus,
  Eye, Zap, Activity,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

async function fetchStats() {
  await connectToDatabase();
  const [projects, publishedNews, newContacts, totalUsers, recentContacts, recentNews] =
    await Promise.all([
      Project.countDocuments(),
      News.countDocuments({ status: "published" }),
      Contact.countDocuments({ status: "new" }),
      User.countDocuments({ isActive: true }),
      Contact.find({ status: "new" }).sort({ createdAt: -1 }).limit(5).lean(),
      News.find({ status: "published" }).sort({ publishedAt: -1 }).limit(4).lean(),
    ]);
  return { projects, publishedNews, newContacts, totalUsers, recentContacts, recentNews };
}

export default async function DashboardPage() {
  const user  = await requireAuth();
  const stats = await fetchStats();

  const statCards = [
    { label: "Total Projects",    value: stats.projects,     icon: FolderOpen,    href: "/admin/projects",  accent: "text-teal bg-teal/10 border-teal/20",       delta: "+2 this month" },
    { label: "Published Articles", value: stats.publishedNews, icon: Newspaper,    href: "/admin/news",      accent: "text-primary bg-primary/10 border-primary/20", delta: "Latest today" },
    { label: "New Contacts",      value: stats.newContacts,  icon: MessageSquare, href: "/admin/contacts",  accent: stats.newContacts > 0 ? "text-gold bg-gold/10 border-gold/20" : "text-foreground-muted bg-surface border-border", delta: "Awaiting reply" },
    { label: "Active Users",      value: stats.totalUsers,   icon: Users,         href: "/admin/users",     accent: "text-primary bg-primary/10 border-primary/20", delta: "Staff portal" },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground">
            Good {getGreeting()}, {user.name?.split(" ")[0] ?? "Admin"}
          </h2>
          <p className="text-sm text-foreground-muted mt-0.5">
            Here&apos;s what&apos;s happening with Ghamkheti Guru today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/projects?new=1" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> New Project
          </Link>
          <Link href="/admin/news?new=1" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-border text-foreground-muted hover:text-foreground hover:bg-surface transition-colors">
            <Plus className="h-3.5 w-3.5" /> New Article
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${card.accent}`}>
                <card.icon className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <TrendingUp className="h-3.5 w-3.5 text-foreground-subtle group-hover:text-primary transition-colors" />
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs font-medium text-foreground-muted mt-0.5">{card.label}</p>
            <p className="text-[10px] text-foreground-subtle mt-1">{card.delta}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent contacts */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gold" strokeWidth={1.8} />
              <span className="text-sm font-semibold text-foreground">Recent Contacts</span>
              {stats.newContacts > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gold/15 text-gold">{stats.newContacts} new</span>
              )}
            </div>
            <Link href="/admin/contacts" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {stats.recentContacts.length === 0 ? (
            <div className="py-10 text-center text-sm text-foreground-muted">No new contact submissions</div>
          ) : (
            <ul className="divide-y divide-border">
              {(stats.recentContacts as Array<{ _id: { toString(): string }; name: string; email: string; enquiryType: string; status: string; createdAt: Date }>).map((c) => (
                <li key={c._id.toString()} className="flex items-center justify-between px-5 py-3 hover:bg-surface transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-foreground-subtle truncate">{c.email} · {c.enquiryType}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <StatusBadge status={c.status} size="sm" />
                    <span className="text-[10px] text-foreground-subtle">{fmtDate(c.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Recent news */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-primary" strokeWidth={1.8} />
                <span className="text-sm font-semibold text-foreground">Latest Articles</span>
              </div>
              <Link href="/admin/news" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {stats.recentNews.length === 0 ? (
              <div className="py-8 text-center text-sm text-foreground-muted">No published articles</div>
            ) : (
              <ul className="divide-y divide-border">
                {(stats.recentNews as Array<{ _id: { toString(): string }; title: string; category: string; views?: number }>).map((n) => (
                  <li key={n._id.toString()} className="px-5 py-3 hover:bg-surface transition-colors">
                    <p className="text-xs font-medium text-foreground truncate">{n.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={n.category} size="sm" label={n.category} />
                      <span className="text-[10px] text-foreground-subtle flex items-center gap-1">
                        <Eye className="h-2.5 w-2.5" /> {n.views ?? 0}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* System status */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-primary" strokeWidth={1.8} />
              <span className="text-sm font-semibold text-foreground">System Status</span>
            </div>
            <ul className="space-y-2">
              {[
                { label: "Database",       ok: true  },
                { label: "Auth service",   ok: true  },
                { label: "File storage",   ok: false, note: "Not configured" },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-xs">
                  {item.ok
                    ? <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={2} />
                    : <AlertCircle className="h-3.5 w-3.5 text-gold shrink-0" strokeWidth={2} />}
                  <span className="text-foreground flex-1">{item.label}</span>
                  <span className={item.ok ? "text-primary" : "text-gold"}>{item.ok ? "OK" : item.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function fmtDate(d: Date | string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(d));
}
