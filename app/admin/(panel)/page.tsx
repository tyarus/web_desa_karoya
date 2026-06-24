import { DashboardSummary } from "@/components/admin/dashboard-summary";
import {
  getAllPosts,
  getContactMessages,
  getGallery,
  getServiceRequests,
  getServices,
} from "@/lib/data/public";

export default async function AdminDashboardPage() {
  const [posts, services, gallery, requests, messages] = await Promise.all([
    getAllPosts(),
    getServices(),
    getGallery(),
    getServiceRequests(),
    getContactMessages(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#40916C]">Ringkasan</p>
        <h2 className="font-heading text-2xl font-bold text-[#1B4332]">
          Aktivitas Website Desa
        </h2>
      </div>
      <DashboardSummary
        posts={posts}
        services={services}
        gallery={gallery}
        requests={requests}
        messages={messages}
      />
    </div>
  );
}
