'use client';

/* eslint-disable react-hooks/incompatible-library */

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveProfileContent } from "@/app/admin/actions/profile";
import { RealtimePreview } from "@/components/admin/realtime-preview";
import { GovernmentEditor } from "@/components/admin/government-editor";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeRecord } from "@/components/realtime/use-realtime-record";
import { defaultGovernment } from "@/lib/content/default-data";
import { parseGovernment } from "@/lib/content/parsers";
import type { Tables } from "@/lib/database.types";
import { parseJsonOr, stringifyJson } from "@/lib/json-utils";
import { toTextareaValue } from "@/lib/utils";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import type { GovernmentMember } from '@/lib/content/default-data';

export function ProfileEditor({ profile }: { profile: Tables<"profiles"> }) {
  const [pending, startTransition] = useTransition();
  const liveProfile = useRealtimeRecord("profiles", profile);
  const [government, setGovernment] = useState<GovernmentMember[]>(() =>
    parseGovernment(profile.government_structure)
  );

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      history: profile.history,
      vision: profile.vision,
      missions_text: toTextareaValue(profile.missions),
      government_structure_json: stringifyJson(
        profile.government_structure,
        defaultGovernment,
      ),
    },
  });
  const values = form.watch();

  // Update JSON field when government changes
  useEffect(() => {
    const jsonString = stringifyJson(government, []);
    form.setValue('government_structure_json', jsonString);
  }, [government, form]);

  function onSubmit(input: ProfileInput) {
    startTransition(async () => {
      // Use the government state for submission
      const result = await saveProfileContent({
        ...input,
        government_structure_json: stringifyJson(government, []),
      });

      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_430px]">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-xl border border-zinc-200 bg-white p-6"
      >
        <div className="grid gap-5">
          <FormField
            label="Sejarah desa"
            helper="Pisahkan paragraf dengan baris kosong."
            error={form.formState.errors.history?.message}
          >
            <Textarea rows={6} {...form.register("history")} />
          </FormField>
          <FormField label="Visi" error={form.formState.errors.vision?.message}>
            <Textarea rows={3} {...form.register("vision")} />
          </FormField>
          <FormField
            label="Misi"
            helper="Satu misi per baris."
            error={form.formState.errors.missions_text?.message}
          >
            <Textarea rows={5} {...form.register("missions_text")} />
          </FormField>

          {/* Government Structure Editor */}
          <FormField
            label="Struktur Pemerintahan"
            helper="Edit data KADES, WAKADES, dan perangkat desa lainnya."
          >
            <GovernmentEditor value={government} onChange={setGovernment} />
          </FormField>

          {/* Hidden JSON field for submission */}
          <input type="hidden" {...form.register("government_structure_json")} />
        </div>
        <Button type="submit" disabled={pending} className="mt-6">
          <Save className="size-4" />
          {pending ? "Menyimpan..." : "Simpan Profil"}
        </Button>
      </form>

      <RealtimePreview
        title="Profil desa"
        description="Preview ringkas sejarah, visi misi, dan struktur."
      >
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Sejarah
            </p>
            <p className="mt-2 line-clamp-6 text-sm leading-6 text-zinc-700">
              {values.history || liveProfile.history}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Visi
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              {values.vision || liveProfile.vision}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Struktur ({government.length} orang)
            </p>
            <div className="mt-2 grid gap-2">
              {government.slice(0, 6).map((member, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-zinc-200 p-2"
                >
                  <p className="text-sm font-semibold text-[#1B4332]">{member.role}</p>
                  <p className="text-xs text-zinc-600">{member.name}</p>
                </div>
              ))}
              {government.length > 6 && (
                <p className="text-xs text-zinc-500">+{government.length - 6} lagi...</p>
              )}
            </div>
          </div>
        </div>
      </RealtimePreview>
    </div>
  );
}
