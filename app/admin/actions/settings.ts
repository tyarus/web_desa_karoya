// @ts-nocheck
"use server";

import { revalidatePath } from "next/cache";

import { actionError, actionSuccess } from "@/lib/action-state";
import {
  flattenFieldErrors,
  formFile,
  formOptionalString,
  formString,
} from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth-admin";
import { uploadPublicImage } from "@/lib/supabase/storage";
import { getErrorMessage } from "@/lib/utils";
import { settingsSchema } from "@/lib/validations";

export async function saveVillageSettings(formData: FormData) {
  const parsed = settingsSchema.safeParse({
    village_name: formString(formData.get("village_name")),
    district: formString(formData.get("district")),
    regency: formOptionalString(formData.get("regency")),
    province: formOptionalString(formData.get("province")),
    address: formOptionalString(formData.get("address")),
    phone: formOptionalString(formData.get("phone")),
    email: formString(formData.get("email")),
    whatsapp: formOptionalString(formData.get("whatsapp")),
    map_url: formOptionalString(formData.get("map_url")),
    logo_url: formOptionalString(formData.get("logo_url")),
  });

  if (!parsed.success) {
    return actionError("Periksa kembali pengaturan desa.", {
      ...flattenFieldErrors(parsed.error),
    });
  }

  try {
    const { supabase } = await requireAdmin();
    const uploadedLogoUrl = await uploadPublicImage(
      supabase,
      formFile(formData.get("logo")),
      "logo",
    );

    const { error } = await supabase.from("village_settings").upsert(
      {
        id: "default",
        village_name: parsed.data.village_name,
        district: parsed.data.district,
        regency: parsed.data.regency || null,
        province: parsed.data.province || null,
        address: parsed.data.address || null,
        phone: parsed.data.phone || null,
        email: parsed.data.email || null,
        whatsapp: parsed.data.whatsapp || null,
        map_url: parsed.data.map_url || null,
        logo_url: uploadedLogoUrl ?? parsed.data.logo_url ?? null,
      },
      { onConflict: "id" },
    );

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/kontak");
    revalidatePath("/admin/pengaturan");

    return actionSuccess("Pengaturan desa berhasil disimpan.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}
