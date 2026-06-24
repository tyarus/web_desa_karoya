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
import { getErrorMessage, slugify } from "@/lib/utils";
import { postSchema, type PostInput } from "@/lib/validations";

export async function savePost(formData: FormData | PostInput) {
  // Handle both FormData and plain object for compatibility
  let input: PostInput;
  
  if (formData instanceof FormData) {
    input = {
      id: formOptionalString(formData.get("id")),
      title: formString(formData.get("title")),
      slug: formOptionalString(formData.get("slug")),
      excerpt: formString(formData.get("excerpt")),
      content: formString(formData.get("content")),
      category: formString(formData.get("category")) as "berita" | "pengumuman",
      status: formString(formData.get("status")) as "draft" | "published",
      cover_url: formOptionalString(formData.get("cover_url")),
    };
  } else {
    input = formData;
  }

  const parsed = postSchema.safeParse(input);

  if (!parsed.success) {
    return actionError("Periksa kembali data berita.", {
      ...flattenFieldErrors(parsed.error),
    });
  }

  try {
    const { supabase } = await requireAdmin();
    const data = parsed.data;
    const slug = slugify(data.slug || data.title);
    const now = new Date().toISOString();

    // Handle file upload if FormData
    let coverUrl = data.cover_url || null;
    if (formData instanceof FormData) {
      const file = formFile(formData.get("cover"));
      if (file) {
        const uploadedUrl = await uploadPublicImage(supabase, file, "posts");
        coverUrl = uploadedUrl ?? data.cover_url ?? null;
      }
    }

    const payload = {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      status: data.status,
      cover_url: coverUrl,
      published_at: data.status === "published" ? now : null,
    };

    const { error } = data.id
      ? await supabase.from("posts").update(payload).eq("id", data.id)
      : await supabase.from("posts").insert(payload);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath(`/berita/${slug}`);
    revalidatePath("/admin/berita");

    return actionSuccess("Berita berhasil disimpan.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}

export async function deletePost(id: string) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath("/admin/berita");

    return actionSuccess("Berita berhasil dihapus.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}
