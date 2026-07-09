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
import type { Json } from "@/lib/database.types";
import { getErrorMessage } from "@/lib/utils";
import { homeSchema, type HomeInput } from "@/lib/validations";

export async function saveHomeContent(formData: FormData | HomeInput) {
  console.log('=== saveHomeContent called ===');

  // Handle both FormData and plain object for compatibility
  let input: HomeInput;

  if (formData instanceof FormData) {
    // Log FormData entries for debugging
    console.log('FormData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size})` : value);
    }

    input = {
      hero_title: formString(formData.get("hero_title")),
      hero_subtitle: formString(formData.get("hero_subtitle")),
      hero_image_url: formOptionalString(formData.get("hero_image_url")),
      hero_cta_label: formOptionalString(formData.get("hero_cta_label")),
      hero_cta_href: formString(formData.get("hero_cta_href")),
      stats_json: formString(formData.get("stats_json")),
      featured_services_json: formString(formData.get("featured_services_json")),
    };
    console.log('Parsed input:', input);
  } else {
    input = formData;
  }

  const parsed = homeSchema.safeParse(input);

  if (!parsed.success) {
    console.log('Validation failed:', parsed.error);
    return actionError("Periksa kembali konten beranda.", {
      ...flattenFieldErrors(parsed.error),
    });
  }

  try {
    const { supabase } = await requireAdmin();
    const data = parsed.data;

    // Handle file upload if FormData
    let heroImageUrl = data.hero_image_url || null;
    if (formData instanceof FormData) {
      const file = formFile(formData.get("hero_image"));
      if (file) {
        console.log('Uploading hero image...');
        const uploadedUrl = await uploadPublicImage(
          supabase,
          file,
          "home"
        );
        heroImageUrl = uploadedUrl ?? data.hero_image_url ?? null;
        console.log('Upload result:', uploadedUrl);
      }
    }

    const payload = {
      id: "default",
      hero_title: data.hero_title,
      hero_subtitle: data.hero_subtitle,
      hero_image_url: heroImageUrl,
      hero_cta_label: data.hero_cta_label || null,
      hero_cta_href: data.hero_cta_href,
      stats: JSON.parse(data.stats_json) as Json,
      featured_services: JSON.parse(data.featured_services_json) as Json,
    };
    console.log('Upsert payload:', payload);

    const { error } = await supabase
      .from("home_sections")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    revalidatePath("/");
    revalidatePath("/admin/beranda");

    console.log('Save successful!');
    return actionSuccess("Konten beranda berhasil disimpan.");
  } catch (error) {
    console.error('Save error:', error);
    return actionError(getErrorMessage(error));
  }
}
