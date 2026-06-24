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
      <AdminSidebar />
      <div className="lg:pl-60">
        <AdminHeader email={admin.email} />
        <AdminMobileNav />
        <main className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
