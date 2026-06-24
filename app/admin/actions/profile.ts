// @ts-nocheck
"use server";

import { revalidatePath } from "next/cache";

import { actionError, actionSuccess } from "@/lib/action-state";
import { flattenFieldErrors } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth-admin";
import type { Json } from "@/lib/database.types";
import { getErrorMessage, splitLines } from "@/lib/utils";
import { profileSchema, type ProfileInput } from "@/lib/validations";

export async function saveProfileContent(values: ProfileInput) {
  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return actionError("Periksa kembali konten profil.", {
      ...flattenFieldErrors(parsed.error),
    });
  }

  try {
    const { supabase } = await requireAdmin();
    const input = parsed.data;

    const { error } = await supabase.from("profiles").upsert(
      {
        id: "default",
        history: input.history,
        vision: input.vision,
        missions: splitLines(input.missions_text),
        government_structure: JSON.parse(
          input.government_structure_json,
        ) as Json,
      },
      { onConflict: "id" },
    );

    if (error) throw error;

    revalidatePath("/profil");
    revalidatePath("/admin/profil");

    return actionSuccess("Profil desa berhasil disimpan.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}
