import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import {
  supabaseUrl,
  supabaseStorageBucket,
} from "@/lib/supabase/config";

/**
 * Create a Supabase client with service role key.
 * This client bypasses RLS policies and should only be used in server-side code.
 */
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    console.warn(
      'SUPABASE_SERVICE_ROLE_KEY is not defined. Storage uploads may fail due to RLS policies.'
    );
  }

  return createSupabaseClient(supabaseUrl, serviceKey || '', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Upload a public image using service role key (bypasses RLS).
 */
export async function uploadPublicImageService(
  file: File | null,
  folder: string,
) {
  if (!file || file.size === 0) {
    console.log('uploadPublicImageService: No file or empty file');
    return null;
  }

  const supabase = createServiceClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  console.log('uploadPublicImageService: Uploading to', path);

  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('uploadPublicImageService error:', error);
    throw error;
  }

  const { data } = supabase.storage
    .from(supabaseStorageBucket)
    .getPublicUrl(path);

  console.log('uploadPublicImageService: Upload successful, URL:', data.publicUrl);
  return data.publicUrl;
}
