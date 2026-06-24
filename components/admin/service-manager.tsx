"use client";

/* eslint-disable react-hooks/incompatible-library */

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, Plus, Save } from "lucide-react";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { deleteService, saveService } from "@/app/admin/actions/services";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { DataTable } from "@/components/admin/data-table";
import { RealtimePreview } from "@/components/admin/realtime-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeList } from "@/components/realtime/use-realtime-list";
import type { Tables } from "@/lib/database.types";
import { slugify, toTextareaValue } from "@/lib/utils";
import { serviceSchema, type ServiceInput } from "@/lib/validations";

const emptyService: ServiceInput = {
  id: "",
  title: "",
  slug: "",
  description: "",
  requirements_text: "",
  flow_text: "",
  contact: "",
  is_featured: false,
};

export function ServiceManager({
  services,
}: {
  services: Tables<"services">[];
}) {
  const [pending, startTransition] = useTransition();
  const liveServices = useRealtimeList("services", services);
  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: emptyService,
  });
  const values = form.watch();

  const columns = useMemo<ColumnDef<Tables<"services">>[]>(
    () => [
      {
        header: "Layanan",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-zinc-900">{row.original.title}</p>
            <p className="text-xs text-zinc-500">/{row.original.slug}</p>
          </div>
        ),
      },
      {
        header: "Unggulan",
        cell: ({ row }) =>
          row.original.is_featured ? <Badge>Ya</Badge> : <Badge variant="muted">Tidak</Badge>,
      },
      {
        header: "Kontak",
        cell: ({ row }) => row.original.contact ?? "Kantor Desa",
      },
      {
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                form.reset({
                  id: row.original.id,
                  title: row.original.title,
                  slug: row.original.slug,
                  description: row.original.description,
                  requirements_text: toTextareaValue(row.original.requirements),
                  flow_text: toTextareaValue(row.original.flow),
                  contact: row.original.contact ?? "",
                  is_featured: row.original.is_featured,
                })
              }
            >
              <Edit3 className="size-4" />
              Edit
            </Button>
            <ConfirmDeleteDialog
              title="Hapus layanan?"
              description={`Layanan "${row.original.title}" akan dihapus dari website.`}
              onConfirm={() => deleteService(row.original.id)}
            />
          </div>
        ),
      },
    ],
    [form],
  );

  function onSubmit(input: ServiceInput) {
    startTransition(async () => {
      const result = await saveService({
        ...input,
        slug: input.slug || slugify(input.title),
      });

      if (result.ok) {
        toast.success(result.message);
        form.reset(emptyService);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_390px]">
      <div className="space-y-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-xl border border-zinc-200 bg-white p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-[#1B4332]">
              {values.id ? "Edit Layanan" : "Tambah Layanan"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => form.reset(emptyService)}
            >
              <Plus className="size-4" />
              Baru
            </Button>
          </div>
          <div className="mt-5 grid gap-5">
            <FormField label="Nama layanan" error={form.formState.errors.title?.message}>
              <Input {...form.register("title")} />
            </FormField>
            <FormField
              label="Slug"
              helper="Kosongkan untuk membuat slug otomatis dari nama layanan."
              error={form.formState.errors.slug?.message}
            >
              <Input {...form.register("slug")} />
            </FormField>
            <FormField
              label="Deskripsi"
              error={form.formState.errors.description?.message}
            >
              <Textarea rows={4} {...form.register("description")} />
            </FormField>
            <FormField
              label="Syarat"
              helper="Satu syarat per baris."
              error={form.formState.errors.requirements_text?.message}
            >
              <Textarea rows={5} {...form.register("requirements_text")} />
            </FormField>
            <FormField
              label="Alur"
              helper="Satu langkah per baris."
              error={form.formState.errors.flow_text?.message}
            >
              <Textarea rows={5} {...form.register("flow_text")} />
            </FormField>
            <FormField label="Kontak" error={form.formState.errors.contact?.message}>
              <Input {...form.register("contact")} />
            </FormField>
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <input
                type="checkbox"
                className="size-4 rounded border-zinc-300 accent-[#1B4332]"
                {...form.register("is_featured")}
              />
              Tampilkan sebagai layanan unggulan
            </label>
          </div>
          <Button type="submit" disabled={pending} className="mt-6">
            <Save className="size-4" />
            {pending ? "Menyimpan..." : "Simpan Layanan"}
          </Button>
        </form>

        <DataTable
          data={liveServices}
          columns={columns}
          emptyText="Belum ada layanan."
        />
      </div>

      <RealtimePreview
        title="Preview layanan"
        description="Ringkasan layanan yang sedang diedit."
      >
        <div className="rounded-xl border border-zinc-200 p-4">
          {values.is_featured ? <Badge>Unggulan</Badge> : null}
          <h3 className="mt-3 font-heading text-xl font-bold text-[#1B4332]">
            {values.title || "Nama layanan"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {values.description || "Deskripsi layanan akan tampil di sini."}
          </p>
          <div className="mt-4 grid gap-4 text-sm">
            <div>
              <p className="font-semibold text-zinc-800">Syarat</p>
              <ul className="mt-2 list-inside list-disc text-zinc-600">
                {(values.requirements_text || "Syarat layanan")
                  .split("\n")
                  .filter(Boolean)
                  .map((item) => (
                    <li key={item}>{item}</li>
                  ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-zinc-800">Alur</p>
              <ol className="mt-2 list-inside list-decimal text-zinc-600">
                {(values.flow_text || "Alur layanan")
                  .split("\n")
                  .filter(Boolean)
                  .map((item) => (
                    <li key={item}>{item}</li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
      </RealtimePreview>
    </div>
  );
}
