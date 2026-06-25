import { ServiceTracker } from '@/components/public/service-tracker';
import { SectionHeading } from '@/components/public/section-heading';

export default function LacakPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <SectionHeading
        title="Lacak Pengajuan"
        description="Cek status pengajuan surat Anda dengan memasukkan nama lengkap."
      />
      <div className="mt-8">
        <ServiceTracker />
      </div>
    </main>
  );
}
