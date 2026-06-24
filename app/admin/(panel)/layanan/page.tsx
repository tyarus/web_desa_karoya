import { RequestManager } from "@/components/admin/request-manager";
import { ServiceManager } from "@/components/admin/service-manager";
import { getServiceRequests, getServices } from "@/lib/data/public";

export default async function AdminServicesPage() {
  const [services, requests] = await Promise.all([
    getServices(),
    getServiceRequests(),
  ]);

  return (
    <div className="space-y-8">
      <ServiceManager services={services} />
      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-[#40916C]">Pengajuan</p>
          <h2 className="font-heading text-xl font-bold text-[#1B4332]">
            Surat Masuk Warga
          </h2>
        </div>
        <RequestManager requests={requests} />
      </section>
    </div>
  );
}
