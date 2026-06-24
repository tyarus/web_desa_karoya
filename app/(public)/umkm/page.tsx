import { createClient } from '@/lib/supabase/server';
import { UMKMPageClient } from '@/components/public/umkm-page-client';

export const dynamic = 'force-dynamic';

export default async function UMKMPage() {
  const supabase = await createClient();

  const { data: umkms = [] } = await supabase
    .from('umkm')
    .select('*')
    .order('created_at', { ascending: false });

  return <UMKMPageClient umkms={umkms} />;
}
