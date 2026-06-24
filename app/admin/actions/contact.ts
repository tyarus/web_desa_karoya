"use server";

import { revalidatePath } from "next/cache";

import { actionError, actionSuccess } from "@/lib/action-state";
import { flattenFieldErrors } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth-admin";
import { getErrorMessage } from "@/lib/utils";
import {
  contactReplySchema,
  type ContactReplyInput,
} from "@/lib/validations";

export async function replyContactMessage(values: ContactReplyInput) {
  const parsed = contactReplySchema.safeParse(values);

  if (!parsed.success) {
    return actionError("Periksa kembali balasan pesan.", {
      ...flattenFieldErrors(parsed.error),
    });
  }

  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("contact_messages")
      .update({
        reply: parsed.data.reply,
        status: parsed.data.status,
        replied_at: parsed.data.status === "dibalas" ? new Date().toISOString() : null,
      })
      .eq("id", parsed.data.id);

    if (error) throw error;

    revalidatePath("/admin/kontak");

    return actionSuccess("Pesan berhasil diperbarui.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}

export async function deleteContactMessage(id: string) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/kontak");

    return actionSuccess("Pesan berhasil dihapus.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}
