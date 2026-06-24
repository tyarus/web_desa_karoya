// @ts-nocheck
"use server";

import { revalidatePath } from "next/cache";

import { actionError, actionSuccess } from "@/lib/action-state";
import { flattenFieldErrors } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth-admin";
import { getErrorMessage, slugify, splitLines } from "@/lib/utils";
import { serviceSchema, type ServiceInput } from "@/lib/validations";

export async function saveService(values: ServiceInput) {
  const parsed = serviceSchema.safeParse(values);

  if (!parsed.success) {
    return actionError("Periksa kembali data layanan.", {
      ...flattenFieldErrors(parsed.error),
    });
  }

  try {
    const { supabase } = await requireAdmin();
    const input = parsed.data;
    const slug = slugify(input.slug || input.title);
    const payload = {
      title: input.title,
      slug,
      description: input.description,
      requirements: splitLines(input.requirements_text),
      flow: splitLines(input.flow_text),
      contact: input.contact || null,
      is_featured: input.is_featured,
    };

    const { error } = input.id
      ? await supabase.from("services").update(payload).eq("id", input.id)
      : await supabase.from("services").insert(payload);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/layanan");
    revalidatePath("/admin/layanan");

    return actionSuccess("Layanan berhasil disimpan.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}

export async function deleteService(id: string) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/layanan");
    revalidatePath("/admin/layanan");

    return actionSuccess("Layanan berhasil dihapus.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}
