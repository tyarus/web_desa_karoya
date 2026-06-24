"use client";

/* eslint-disable react-hooks/incompatible-library */

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Upload } from "lucide-react";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveHomeContent } from "@/app/admin/actions/home";
import { RealtimePreview } from "@/components/admin/realtime-preview";
import { HeroSection } from "@/components/public/hero-section";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeRecord } from "@/components/realtime/use-realtime-record";
import { defaultFeaturedServices, defaultStats } from "@/lib/content/default-data";
import type { Tables } from "@/lib/database.types";
import { parseJsonOr, stringifyJson } from "@/lib/json-utils";
import { homeSchema, type HomeInput } from "@/lib/validations";

export function HomeEditor({
  home,
  settings,
}: {
  home: Tables<"home_sections">;
  settings: Tables<"village_settings">;
}) {
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const liveHome = useRealtimeRecord("home_sections", home);
  const liveSettings = useRealtimeRecord("village_settings", settings);
  const form = useForm<HomeInput>({
    resolver: zodResolver(homeSchema),
    defaultValues: {
      hero_title: home.hero_title,
      hero_subtitle: home.hero_subtitle,
      hero_image_url: home.hero_image_url ?? "",
      hero_cta_label: home.hero_cta_label ?? "Lihat Layanan",
      hero_cta_href: home.hero_cta_href ?? "/layanan",
      stats_json: stringifyJson(home.stats, defaultStats),
      featured_services_json: stringifyJson(
        home.featured_services,
        defaultFeaturedServices,
      ),
    },
  });
  const values = form.watch();
  const previewHome: Tables<"home_sections"> = {
    ...liveHome,
    hero_title: values.hero_title || liveHome.hero_title,
    hero_subtitle: values.hero_subtitle || liveHome.hero_subtitle,
    hero_image_url: values.hero_image_url || liveHome.hero_image_url,
    hero_cta_label: values.hero_cta_label || liveHome.hero_cta_label,
    hero_cta_href: values.hero_cta_href || liveHome.hero_cta_href,
    stats: parseJsonOr(values.stats_json, liveHome.stats),
    featured_services: parseJsonOr(
      values.featured_services_json,
      liveHome.featured_services,
    ),
  };

  function onSubmit(input: HomeInput) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("hero_title", input.hero_title);
      formData.set("hero_subtitle", input.hero_subtitle);
      formData.set("hero_image_url", input.hero_image_url ?? "");
      formData.set("hero_cta_label", input.hero_cta_label ?? "");
      formData.set("hero_cta_href", input.hero_cta_href);
      formData.set("stats_json", input.stats_json);
      formData.set("featured_services_json", input.featured_services_json);

      if (fileRef.current?.files?.[0]) {
        formData.set("hero_image", fileRef.current.files[0]);
      }

      const result = await saveHomeContent(formData);

      if (result.ok) {
        toast.success(result.message);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-xl border border-zinc-200 bg-white p-6"
      >
        <div className="grid gap-5">
          <FormField
            label="Judul hero"
            error={form.formState.errors.hero_title?.message}
          >
            <Input {...form.register("hero_title")} />
          </FormField>
          <FormField
            label="Deskripsi hero"
            helper="Gunakan bahasa singkat dan natural."
            error={form.formState.errors.hero_subtitle?.message}
          >
            <Textarea rows={4} {...form.register("hero_subtitle")} />
          </FormField>
          <FormField
            label="Gambar hero"
            helper="Opsional. Gunakan file baru atau URL gambar publik."
            error={form.formState.errors.hero_image_url?.message}
          >
            <Input {...form.register("hero_image_url")} />
          </FormField>
          <FormField label="Upload gambar hero" helper="Gambar disimpan ke Supabase Storage.">
            <Input ref={fileRef} type="file" accept="image/*" />
          </FormField>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Label tombol"
              error={form.formState.errors.hero_cta_label?.message}
            >
              <Input {...form.register("hero_cta_label")} />
            </FormField>
            <FormField
              label="Link tombol"
              error={form.formState.errors.hero_cta_href?.message}
            >
              <Input {...form.register("hero_cta_href")} />
            </FormField>
          </div>
          <FormField
            label="Statistik"
            helper="Format JSON array: label, value, helper."
            error={form.formState.errors.stats_json?.message}
          >
            <Textarea rows={9} className="font-mono" {...form.register("stats_json")} />
          </FormField>
          <FormField
            label="Layanan unggulan"
            helper="Format JSON array: title, description, href."
            error={form.formState.errors.featured_services_json?.message}
          >
            <Textarea
              rows={9}
              className="font-mono"
              {...form.register("featured_services_json")}
            />
          </FormField>
        </div>
        <Button type="submit" disabled={pending} className="mt-6">
          <Save className="size-4" />
          {pending ? "Menyimpan..." : "Simpan Beranda"}
        </Button>
      </form>

      <RealtimePreview
        title="Tampilan beranda"
        description="Preview mengikuti perubahan database dan isian form."
      >
        <div className="overflow-hidden rounded-xl border border-zinc-200">
          <div className="origin-top-left scale-[0.42] sm:scale-[0.56] xl:scale-[0.42]">
            <div className="w-[920px] bg-white">
              <HeroSection home={previewHome} settings={liveSettings} />
            </div>
          </div>
        </div>
      </RealtimePreview>
    </div>
  );
}
