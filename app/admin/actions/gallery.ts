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
import { gallerySchema } from "@/lib/validations";

export async function saveGalleryItem(formData: FormData) {
  const parsed = gallerySchema.safeParse({
    id: formOptionalString(formData.get("id")),
    title: formString(formData.get("title")),
    description: formOptionalString(formData.get("description")),
    image_url: formOptionalString(formData.get("image_url")),
  });

  if (!parsed.success) {
    return actionError("Periksa kembali data galeri.", {
      ...flattenFieldErrors(parsed.error),
    });
  }

  try {
    const { supabase } = await requireAdmin();
      const file = formFile(formData.get("image"));
      const uploadedUrl = await uploadPublicImage(supabase, file, "gallery");
    const imageUrl = uploadedUrl ?? parsed.data.image_url ?? null;

    if (!imageUrl) {
      return actionError("Unggah gambar atau isi URL gambar.");
    }

    const payload = {
      title: parsed.data.title,
      description: parsed.data.description || null,
      image_url: imageUrl,
    };

    const { error } = parsed.data.id
      ? await supabase.from("gallery").update(payload).eq("id", parsed.data.id)
      : await supabase.from("gallery").insert(payload);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/galeri");
    revalidatePath("/admin/galeri");

    return actionSuccess("Foto galeri berhasil disimpan.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/galeri");
    revalidatePath("/admin/galeri");

    return actionSuccess("Foto galeri berhasil dihapus.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}
