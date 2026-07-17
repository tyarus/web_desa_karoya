import { redirect } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getAdminUser } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();

  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Desktop Sidebar - Hidden on mobile */}
      <AdminSidebar />

      {/* Main Content Wrapper */}
      <div className="lg:pl-60">
        {/* Header */}
        <AdminHeader email={admin.email} />

        {/* Mobile Bottom Navigation */}
        <AdminMobileNav />

        {/* Page Content - Adjusted padding for bottom nav on mobile */}
        <main className="px-4 py-4 sm:px-6 sm:py-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
