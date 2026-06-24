import { cache } from "react";

import { createClient, createOptionalClient } from "@/lib/supabase/server";

export const getAdminUser = cache(async () => {
  const supabase = await createOptionalClient();
  if (!supabase) return null;

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return null;

  return {
    id: String(data.claims.sub ?? ""),
    email: String(data.claims.email ?? "admin@desa-karoya.id"),
  };
});

export async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    throw new Error("Sesi admin tidak valid.");
  }

  return {
    supabase,
    admin: {
      id: String(data.claims.sub ?? ""),
      email: String(data.claims.email ?? "admin@desa-karoya.id"),
    },
  };
}
