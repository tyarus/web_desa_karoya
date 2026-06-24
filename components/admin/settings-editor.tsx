"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/incompatible-library */

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Save, Upload } from "lucide-react";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveVillageSettings } from "@/app/admin/actions/settings";
import { RealtimePreview } from "@/components/admin/realtime-preview";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeRecord } from "@/components/realtime/use-realtime-record";
import type { Tables } from "@/lib/database.types";
import { settingsSchema, type SettingsInput } from "@/lib/validations";

export function SettingsEditor({
  settings,
}: {
  settings: Tables<"village_settings">;
}) {
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const liveSettings = useRealtimeRecord("village_settings", settings);
  const form = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      village_name: settings.village_name,
      district: settings.district,
      regency: settings.regency ?? "",
      province: settings.province ?? "",
      address: settings.address ?? "",
      phone: settings.phone ?? "",
      email: settings.email ?? "",
      whatsapp: settings.whatsapp ?? "",
      map_url: settings.map_url ?? "",
      logo_url: settings.logo_url ?? "",
    },
  });
  const values = form.watch();

  function onSubmit(input: SettingsInput) {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(input).forEach(([key, value]) => {
        formData.set(key, value ?? "");
      });

      if (fileRef.current?.files?.[0]) {
        formData.set("logo", fileRef.current.files[0]);
      }

      const result = await saveVillageSettings(formData);

      if (result.ok) {
        toast.success(result.message);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        toast.error(result.message);
      }
    });
  }

  const previewLogo = values.logo_url || liveSettings.logo_url;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-xl border border-zinc-200 bg-white p-6"
      >
        <div className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Nama desa"
              error={form.formState.errors.village_name?.message}
            >
              <Input {...form.register("village_name")} />
            </FormField>
            <FormField
              label="Kecamatan"
              error={form.formState.errors.district?.message}
            >
              <Input {...form.register("district")} />
            </FormField>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Kabupaten" error={form.formState.errors.regency?.message}>
              <Input {...form.register("regency")} />
            </FormField>
            <FormField label="Provinsi" error={form.formState.errors.province?.message}>
              <Input {...form.register("province")} />
            </FormField>
          </div>
          <FormField label="Alamat" error={form.formState.errors.address?.message}>
            <Textarea rows={3} {...form.register("address")} />
          </FormField>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Telepon" error={form.formState.errors.phone?.message}>
              <Input {...form.register("phone")} />
            </FormField>
            <FormField label="Email" error={form.formState.errors.email?.message}>
              <Input type="email" {...form.register("email")} />
            </FormField>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="WhatsApp" error={form.formState.errors.whatsapp?.message}>
              <Input {...form.register("whatsapp")} />
            </FormField>
            <FormField label="URL Peta" error={form.formState.errors.map_url?.message}>
              <Input {...form.register("map_url")} />
            </FormField>
          </div>
          <FormField
            label="URL logo"
            helper="Opsional jika mengunggah logo baru."
            error={form.formState.errors.logo_url?.message}
          >
            <Input {...form.register("logo_url")} />
          </FormField>
          <FormField label="Upload logo" helper="Logo disimpan ke Supabase Storage.">
            <Input ref={fileRef} type="file" accept="image/*" />
          </FormField>
        </div>
        <Button type="submit" disabled={pending} className="mt-6">
          <Save className="size-4" />
          {pending ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </form>

      <RealtimePreview
        title="Identitas desa"
        description="Preview header dan kontak resmi."
      >
        <div className="rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center overflow-hidden rounded-xl bg-[#1B4332] text-white">
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt={values.village_name}
                  className="size-full object-cover"
                />
              ) : (
                <Building2 className="size-6" />
              )}
            </div>
            <div>
              <p className="font-heading text-lg font-bold text-[#1B4332]">
                {values.village_name || liveSettings.village_name}
              </p>
              <p className="text-sm text-zinc-500">
                Kecamatan {values.district || liveSettings.district}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm text-zinc-600">
            <p>{values.address || liveSettings.address}</p>
            <p>{values.phone || liveSettings.phone}</p>
            <p>{values.email || liveSettings.email}</p>
          </div>
          <Button type="button" variant="upload" className="mt-5 w-full">
            <Upload className="size-4" />
            Preview Upload
          </Button>
        </div>
      </RealtimePreview>
    </div>
  );
}
