"use client";

import { createBrowserClient } from "@supabase/ssr";

import {
  isSupabaseConfigured,
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/supabase/config";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Konfigurasi Supabase belum diisi.");
  }

  browserClient ??= createBrowserClient(supabaseUrl, supabasePublishableKey);

  return browserClient;
}

export function createOptionalClient(): ReturnType<typeof createClient> | null {
  if (!isSupabaseConfigured()) return null;
  return createClient();
}
