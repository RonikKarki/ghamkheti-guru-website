import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth-utils";

export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
};
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Toaster } from "@/components/admin/Toaster";
import { ToastProvider } from "@/lib/toast";
import type { UserRole } from "@/models/User";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar
          userName={user.name ?? "Admin"}
          userRole={user.role as UserRole}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader
            userName={user.name ?? "Admin"}
            userRole={user.role as UserRole}
          />
          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </ToastProvider>
  );
}
