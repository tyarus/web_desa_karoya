"use server";

import { redirect } from "next/navigation";

import { actionError, actionSuccess } from "@/lib/action-state";
import { flattenFieldErrors } from "@/lib/action-utils";
import { createClient, createOptionalClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";
import { loginSchema, type LoginInput } from "@/lib/validations";

export async function loginAdmin(values: LoginInput) {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return actionError("Periksa kembali email dan password.", {
      ...flattenFieldErrors(parsed.error),
    });
  }

  const supabase = await createOptionalClient();
  if (!supabase) {
    return actionError("Isi kredensial Supabase di .env.local lebih dulu.");
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return actionError("Email atau password admin tidak cocok.");
  }

  return actionSuccess("Berhasil masuk ke panel admin.");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function getLoginSetupState() {
  try {
    const supabase = await createOptionalClient();
    return actionSuccess("Konfigurasi tersedia.", Boolean(supabase));
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}
