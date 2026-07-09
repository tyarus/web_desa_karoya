// @ts-nocheck
"use client";

/* eslint-disable react-hooks/incompatible-library */

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react";
import { useRef, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveHomeContent } from "@/app/admin/actions/home";
import { RealtimePreview } from "@/components/admin/realtime-preview";
import { HeroSection } from "@/components/public/hero-section";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeRecord } from "@/components/realtime/use-realtime-record";
import { defaultStats } from "@/lib/content/default-data";
import type { Tables } from "@/lib/database.types";
import { parseJsonOr, stringifyJson } from "@/lib/json-utils";
import { homeSchema, type HomeInput } from "@/lib/validations";

interface StatItem {
  label: string;
  value: string;
}

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

  // Initialize stats from home data
  const initialStats: StatItem[] = home.stats && home.stats.length > 0
    ? home.stats.map(s => ({ label: s.label, value: s.value }))
    : defaultStats.map(s => ({ label: s.label, value: s.value }));

  const form = useForm<HomeInput & { stats_array: StatItem[] }>({
    resolver: zodResolver(homeSchema),
    defaultValues: {
      hero_title: home.hero_title,
      hero_subtitle: home.hero_subtitle,
      hero_image_url: home.hero_image_url ?? "",
      hero_cta_label: home.hero_cta_label ?? "Lihat Layanan",
      hero_cta_href: home.hero_cta_href ?? "/layanan",
      stats_json: stringifyJson(home.stats, defaultStats),
      stats_array: initialStats,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stats_array",
  });

  const values = form.watch();
  const previewHome: Tables<"home_sections"> = {
    ...liveHome,
    hero_title: values.hero_title || liveHome.hero_title,
    hero_subtitle: values.hero_subtitle || liveHome.hero_subtitle,
    hero_image_url: values.hero_image_url || liveHome.hero_image_url,
    hero_cta_label: values.hero_cta_label || liveHome.hero_cta_label,
    hero_cta_href: values.hero_cta_href || liveHome.hero_cta_href,
    stats: values.stats_array.map((s, i) => ({
      ...s,
      helper: home.stats?.[i]?.helper ?? "",
    })) || liveHome.stats,
    featured_services: liveHome.featured_services,
  };

  // Sync stats_array changes to stats_json for submission
  const handleSubmit = form.handleSubmit((input) => {
    console.log('=== handleSubmit callback called ===');
    console.log('Validated input:', JSON.stringify(input, null, 2));

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("hero_title", input.hero_title);
        formData.set("hero_subtitle", input.hero_subtitle);
        formData.set("hero_image_url", input.hero_image_url ?? "");
        formData.set("hero_cta_label", input.hero_cta_label ?? "");
        formData.set("hero_cta_href", input.hero_cta_href);
        // Convert stats_array back to JSON for storage
        formData.set("stats_json", JSON.stringify(input.stats_array));
        // Set empty featured services (can be expanded later)
        formData.set("featured_services_json", JSON.stringify([]));

        if (fileRef.current?.files?.[0]) {
          formData.set("hero_image", fileRef.current.files[0]);
        }

        console.log('Calling saveHomeContent...');
        const result = await saveHomeContent(formData);
        console.log('Save result:', JSON.stringify(result, null, 2));

        if (result.ok) {
          toast.success(result.message);
          if (fileRef.current) fileRef.current.value = "";
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Submit error:', error);
        toast.error('Terjadi kesalahan saat menyimpan');
      }
    });
  }, (errors) => {
    console.log('=== Form validation failed ===');
    console.log('Validation errors:', JSON.stringify(errors, null, 2));
    // Show errors as toast
    const errorMessages = Object.values(errors).map((e: any) => e?.message).filter(Boolean);
    if (errorMessages.length > 0) {
      toast.error(errorMessages[0]);
    }
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
      <form
        onSubmit={handleSubmit}
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

          {/* Statistik Section - Column-based Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FormField label="Statistik" error={form.formState.errors.stats_json?.message} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ label: "", value: "" })}
                className="h-8 gap-1 text-xs"
              >
                <Plus className="size-3" />
                Tambah
              </Button>
            </div>

            {/* Hidden textarea for validation */}
            <Input type="hidden" {...form.register("stats_json")} />

            {/* Stats Table Header */}
            <div className="grid grid-cols-[1fr_120px_40px] gap-2 px-1">
              <p className="text-xs font-semibold text-zinc-500">Label</p>
              <p className="text-xs font-semibold text-zinc-500">Nilai</p>
              <span></span>
            </div>

            {/* Stats Rows */}
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_120px_40px] gap-2 items-start"
                >
                  <Input
                    {...form.register(`stats_array.${index}.label`)}
                    placeholder="Contoh: Jumlah RT"
                    className="h-9 text-sm"
                  />
                  <Input
                    {...form.register(`stats_array.${index}.value`)}
                    placeholder="20"
                    className="h-9 text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (fields.length > 1) {
                        remove(index);
                      } else {
                        toast.warning("Minimal harus ada 1 statistik");
                      }
                    }}
                    className="h-9 w-10 shrink-0 text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            {fields.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-2">
                Tidak ada statistik. Klik "Tambah" untuk menambahkan.
              </p>
            )}
          </div>
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
