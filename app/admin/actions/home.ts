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

    const hero_title = formString(formData.get("hero_title"));
    const hero_subtitle = formString(formData.get("hero_subtitle"));
    const hero_image_url = formOptionalString(formData.get("hero_image_url"));
    const hero_cta_label = formOptionalString(formData.get("hero_cta_label"));
    const hero_cta_href = formString(formData.get("hero_cta_href"));
    let stats_json = formString(formData.get("stats_json"));
    const featured_services_json = formString(formData.get("featured_services_json")) || "[]";

    // Ensure stats_json is valid JSON
    if (!stats_json || stats_json.trim() === '') {
      stats_json = "[]";
    }
    // Try to parse and re-stringify to normalize
    try {
      const parsed = JSON.parse(stats_json);
      stats_json = JSON.stringify(parsed);
    } catch {
      console.log('stats_json parse failed, using empty array');
      stats_json = "[]";
    }

    input = {
      hero_title,
      hero_subtitle,
      hero_image_url,
      hero_cta_label,
      hero_cta_href,
      stats_json,
      featured_services_json,
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

    // Parse JSON fields safely
    let stats: Json = [];
    let featuredServices: Json = [];
    console.log('Parsing stats_json:', data.stats_json);
    try {
      stats = JSON.parse(data.stats_json || "[]");
      console.log('Parsed stats:', JSON.stringify(stats));
    } catch {
      console.log('Failed to parse stats_json');
    }
    try {
      featuredServices = JSON.parse(data.featured_services_json || "[]");
      console.log('Parsed featuredServices:', JSON.stringify(featuredServices));
    } catch {
      console.log('Failed to parse featured_services_json');
    }

    const payload = {
      id: "default",
      hero_title: data.hero_title,
      hero_subtitle: data.hero_subtitle,
      hero_image_url: heroImageUrl,
      hero_cta_label: data.hero_cta_label || null,
      hero_cta_href: data.hero_cta_href,
      stats,
      featured_services: featuredServices,
    };
    console.log('Upsert payload:', JSON.stringify(payload, null, 2));

    const { error, status } = await supabase
      .from("home_sections")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    console.log('Upsert result:', { error, status });
    console.log('Upserted data:', status === 200 || status === 201 ? 'Success' : 'Failed');

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
