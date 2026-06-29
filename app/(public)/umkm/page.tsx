// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { UMKMPageClient } from '@/components/public/umkm-page-client';

export const dynamic = 'force-dynamic';

export default async function UMKMPage() {
  const supabase = await createClient();

  const { data: umkmsData } = await supabase
    .from('umkm')
    .select('*')
    .order('created_at', { ascending: false });

  const umkms = Array.isArray(umkmsData) ? umkmsData : [];

  return <UMKMPageClient umkms={umkms} />;
}
