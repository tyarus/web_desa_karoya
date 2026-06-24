export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const supabaseStorageBucket =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "desa-karoya";

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}
