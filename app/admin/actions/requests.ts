// @ts-nocheck
"use server";

import { revalidatePath } from "next/cache";

import { actionError, actionSuccess } from "@/lib/action-state";
import { flattenFieldErrors } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth-admin";
import { getErrorMessage } from "@/lib/utils";
import {
  requestStatusSchema,
  type RequestStatusInput,
} from "@/lib/validations";

export async function updateServiceRequestStatus(values: RequestStatusInput) {
  const parsed = requestStatusSchema.safeParse(values);

  if (!parsed.success) {
    return actionError("Status pengajuan tidak valid.", {
      ...flattenFieldErrors(parsed.error),
    });
  }

  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("service_requests")
      .update({ status: parsed.data.status })
      .eq("id", parsed.data.id);

    if (error) throw error;

    revalidatePath("/admin/layanan");

    return actionSuccess("Status pengajuan berhasil diperbarui.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}

export async function deleteServiceRequest(id: string) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("service_requests")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/layanan");

    return actionSuccess("Pengajuan berhasil dihapus.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}
