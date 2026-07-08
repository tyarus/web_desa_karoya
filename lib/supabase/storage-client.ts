import { createClient } from '@/lib/supabase/client';
import { supabaseStorageBucket } from '@/lib/supabase/config';

export async function uploadProductImage(file: File | null) {
  if (!file || file.size === 0) return null;

  const supabase = createClient();
  if (!supabase) return null;

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `umkm/products/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data } = supabase.storage
    .from(supabaseStorageBucket)
    .getPublicUrl(path);

  return data.publicUrl;
}
