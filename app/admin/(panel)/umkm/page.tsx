// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { UMKMManager } from '@/components/admin/umkm-manager';

export default async function UMKMAdminPage() {
  const supabase = await createClient();

  const { data: umkmsData } = await supabase.from('umkm').select('*');
  const { data: productsData } = await supabase.from('umkm_products').select('*');

  const umkms = Array.isArray(umkmsData) ? umkmsData : [];
  const products = Array.isArray(productsData) ? productsData : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Kelola UMKM</h1>
        <p className="mt-1 text-gray-600">
          Kelola daftar UMKM dan produk-produk mereka
        </p>
      </div>

      <UMKMManager initialUMKMs={umkms} initialProducts={products} />
    </div>
  );
}
