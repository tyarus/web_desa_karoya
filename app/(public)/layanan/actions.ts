"use server";

import { revalidatePath } from "next/cache";

import { actionError, actionSuccess } from "@/lib/action-state";
import { flattenFieldErrors } from "@/lib/action-utils";
import { createOptionalClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";
import {
  serviceRequestSchema,
  type ServiceRequestInput,
} from "@/lib/validations";

export async function submitServiceRequest(values: ServiceRequestInput) {
  const parsed = serviceRequestSchema.safeParse(values);

  if (!parsed.success) {
    return actionError("Periksa kembali pengajuan layanan.", {
      ...flattenFieldErrors(parsed.error),
    });
  }

  try {
    const supabase = await createOptionalClient();
    if (!supabase) {
      return actionError("Form layanan belum tersambung ke Supabase.");
    }

    const { error } = await supabase.from("service_requests").insert({
      service_type: parsed.data.service_type,
      resident_name: parsed.data.resident_name,
      nik: parsed.data.nik,
      phone: parsed.data.phone,
      address: parsed.data.address,
      notes: parsed.data.notes || null,
    });

    if (error) throw error;

    revalidatePath("/admin/layanan");

    return actionSuccess("Pengajuan berhasil dikirim.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}
