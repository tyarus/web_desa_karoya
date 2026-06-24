"use server";

import { revalidatePath } from "next/cache";

import { actionError, actionSuccess } from "@/lib/action-state";
import { flattenFieldErrors } from "@/lib/action-utils";
import { createOptionalClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";
import { contactSchema, type ContactInput } from "@/lib/validations";

export async function sendContactMessage(values: ContactInput) {
  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    return actionError("Periksa kembali pesan Anda.", {
      ...flattenFieldErrors(parsed.error),
    });
  }

  try {
    const supabase = await createOptionalClient();
    if (!supabase) {
      return actionError("Form kontak belum tersambung ke Supabase.");
    }

    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });

    if (error) throw error;

    revalidatePath("/admin/kontak");

    return actionSuccess("Pesan berhasil dikirim.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}
