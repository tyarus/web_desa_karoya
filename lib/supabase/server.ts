import { createServerClient, type Database } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  isSupabaseConfigured,
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/supabase/config";

export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Konfigurasi Supabase belum diisi.");
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. Proxy refreshes sessions.
        }
      },
    },
  });
}

export async function createOptionalClient(): Promise<ReturnType<typeof createClient> | null> {
  if (!isSupabaseConfigured()) return null;
  return createClient();
}
