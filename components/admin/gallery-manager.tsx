"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/incompatible-library */

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, ImagePlus, Plus, Upload } from "lucide-react";
import { useMemo, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  deleteGalleryItem,
  saveGalleryItem,
} from "@/app/admin/actions/gallery";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { DataTable } from "@/components/admin/data-table";
import { RealtimePreview } from "@/components/admin/realtime-preview";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeList } from "@/components/realtime/use-realtime-list";
import type { Tables } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";
import { gallerySchema, type GalleryInput } from "@/lib/validations";

const emptyGallery: GalleryInput = {
  id: "",
  title: "",
  description: "",
  image_url: "",
};

export function GalleryManager({
  gallery,
}: {
  gallery: Tables<"gallery">[];
}) {
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const liveGallery = useRealtimeList("gallery", gallery, {
    sort: (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  });
  const form = useForm<GalleryInput>({
    resolver: zodResolver(gallerySchema),
    defaultValues: emptyGallery,
  });
  const values = form.watch();

  const columns = useMemo<ColumnDef<Tables<"gallery">>[]>(
    () => [
      {
        header: "Foto",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.image_url}
              alt={row.original.title}
              className="size-14 rounded-lg object-cover"
            />
            <div>
              <p className="font-semibold text-zinc-900">{row.original.title}</p>
              <p className="text-xs text-zinc-500">
                {formatDate(row.original.created_at)}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "Deskripsi",
        cell: ({ row }) => row.original.description ?? "-",
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
                  description: row.original.description ?? "",
                  image_url: row.original.image_url,
                })
              }
            >
              <Edit3 className="size-4" />
              Edit
            </Button>
            <ConfirmDeleteDialog
              title="Hapus foto?"
              description={`Foto "${row.original.title}" akan dihapus dari galeri.`}
              onConfirm={() => deleteGalleryItem(row.original.id)}
            />
          </div>
        ),
      },
    ],
    [form],
  );

  function onSubmit(input: GalleryInput) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", input.id ?? "");
      formData.set("title", input.title);
      formData.set("description", input.description ?? "");
      formData.set("image_url", input.image_url ?? "");

      if (fileRef.current?.files?.[0]) {
        formData.set("image", fileRef.current.files[0]);
      }

      const result = await saveGalleryItem(formData);

      if (result.ok) {
        toast.success(result.message);
        form.reset(emptyGallery);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-xl border border-zinc-200 bg-white p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-[#1B4332]">
              {values.id ? "Edit Foto" : "Upload Foto"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => form.reset(emptyGallery)}
            >
              <Plus className="size-4" />
              Baru
            </Button>
          </div>
          <div className="mt-5 grid gap-5">
            <FormField label="Judul foto" error={form.formState.errors.title?.message}>
              <Input {...form.register("title")} />
            </FormField>
            <FormField
              label="Deskripsi"
              error={form.formState.errors.description?.message}
            >
              <Textarea rows={3} {...form.register("description")} />
            </FormField>
            <FormField
              label="URL gambar"
              helper="Opsional jika mengunggah file baru."
              error={form.formState.errors.image_url?.message}
            >
              <Input {...form.register("image_url")} />
            </FormField>
            <FormField label="Upload gambar" helper="Gambar disimpan ke Supabase Storage.">
              <Input ref={fileRef} type="file" accept="image/*" />
            </FormField>
          </div>
          <Button type="submit" disabled={pending} variant="upload" className="mt-6">
            <Upload className="size-4" />
            {pending ? "Mengunggah..." : "Simpan Foto"}
          </Button>
        </form>

        <DataTable data={liveGallery} columns={columns} emptyText="Belum ada foto." />
      </div>

      <RealtimePreview
        title="Preview galeri"
        description="Foto baru akan muncul di sini setelah upload selesai."
      >
        <div className="grid gap-3">
          <div className="overflow-hidden rounded-xl border border-zinc-200">
            {values.image_url ? (
              <img
                src={values.image_url}
                alt={values.title}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-zinc-100 text-zinc-400">
                <ImagePlus className="size-10" />
              </div>
            )}
            <div className="p-4">
              <p className="font-heading font-bold text-[#1B4332]">
                {values.title || "Judul foto"}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {values.description || "Deskripsi foto akan tampil di sini."}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {liveGallery.slice(0, 6).map((item) => (
              <img
                key={item.id}
                src={item.image_url}
                alt={item.title}
                className="aspect-square rounded-lg object-cover"
              />
            ))}
          </div>
        </div>
      </RealtimePreview>
    </div>
  );
}
