import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";
import { supabaseStorageBucket } from "@/lib/supabase/config";

export async function uploadPublicImage(
  supabase: SupabaseClient<Database>,
  file: File | null,
  folder: string,
) {
  if (!file || file.size === 0) return null;

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(supabaseStorageBucket)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(supabaseStorageBucket)
    .getPublicUrl(path);

  return data.publicUrl;
}
