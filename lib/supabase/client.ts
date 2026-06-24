"use client";

import { createBrowserClient, type Database } from "@supabase/ssr";

import {
  isSupabaseConfigured,
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/supabase/config";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Konfigurasi Supabase belum diisi.");
  }

  browserClient ??= createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);

  return browserClient;
}

export function createOptionalClient(): ReturnType<typeof createClient> | null {
  if (!isSupabaseConfigured()) return null;
  return createClient();
}
