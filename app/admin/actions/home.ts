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
  // Handle both FormData and plain object for compatibility
  let input: HomeInput;
  
  if (formData instanceof FormData) {
    input = {
      hero_title: formString(formData.get("hero_title")),
      hero_subtitle: formString(formData.get("hero_subtitle")),
      hero_image_url: formOptionalString(formData.get("hero_image_url")),
      hero_cta_label: formOptionalString(formData.get("hero_cta_label")),
      hero_cta_href: formString(formData.get("hero_cta_href")),
      stats_json: formString(formData.get("stats_json")),
      featured_services_json: formString(formData.get("featured_services_json")),
    };
  } else {
    input = formData;
  }

  const parsed = homeSchema.safeParse(input);

  if (!parsed.success) {
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
        const uploadedUrl = await uploadPublicImage(
          supabase,
          file,
          "home"
        );
        heroImageUrl = uploadedUrl ?? data.hero_image_url ?? null;
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

    const { error } = await supabase
      .from("home_sections")
      .upsert(payload, { onConflict: "id" });

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/beranda");

    return actionSuccess("Konten beranda berhasil disimpan.");
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}
