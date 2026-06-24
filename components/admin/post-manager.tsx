"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/incompatible-library */

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, Plus, Save, Upload } from "lucide-react";
import { useMemo, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { deletePost, savePost } from "@/app/admin/actions/posts";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { DataTable } from "@/components/admin/data-table";
import { RealtimePreview } from "@/components/admin/realtime-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeList } from "@/components/realtime/use-realtime-list";
import type { Tables } from "@/lib/database.types";
import { formatDate, slugify } from "@/lib/utils";
import { postSchema, type PostInput } from "@/lib/validations";

const emptyPost: PostInput = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "berita",
  status: "draft",
  cover_url: "",
};

export function PostManager({ posts }: { posts: Tables<"posts">[] }) {
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const livePosts = useRealtimeList("posts", posts, {
    sort: (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  });
  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: emptyPost,
  });
  const values = form.watch();

  const columns = useMemo<ColumnDef<Tables<"posts">>[]>(
    () => [
      {
        header: "Judul",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-zinc-900">{row.original.title}</p>
            <p className="text-xs text-zinc-500">/{row.original.slug}</p>
          </div>
        ),
      },
      {
        header: "Kategori",
        cell: ({ row }) => (
          <Badge variant={row.original.category === "pengumuman" ? "accent" : "default"}>
            {row.original.category}
          </Badge>
        ),
      },
      {
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.status === "published" ? "default" : "muted"}>
            {row.original.status === "published" ? "Terbit" : "Draft"}
          </Badge>
        ),
      },
      {
        header: "Tanggal",
        cell: ({ row }) => formatDate(row.original.published_at ?? row.original.created_at),
      },
      {
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                form.reset({
                  id: row.original.id,
                  title: row.original.title,
                  slug: row.original.slug,
                  excerpt: row.original.excerpt,
                  content: row.original.content,
                  category: row.original.category,
                  status: row.original.status,
                  cover_url: row.original.cover_url ?? "",
                });
              }}
            >
              <Edit3 className="size-4" />
              Edit
            </Button>
            <ConfirmDeleteDialog
              title="Hapus berita?"
              description={`Berita "${row.original.title}" akan dihapus dari website.`}
              onConfirm={() => deletePost(row.original.id)}
            />
          </div>
        ),
      },
    ],
    [form],
  );

  function onSubmit(input: PostInput) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", input.id ?? "");
      formData.set("title", input.title);
      formData.set("slug", input.slug || slugify(input.title));
      formData.set("excerpt", input.excerpt);
      formData.set("content", input.content);
      formData.set("category", input.category);
      formData.set("status", input.status);
      formData.set("cover_url", input.cover_url ?? "");

      if (fileRef.current?.files?.[0]) {
        formData.set("cover", fileRef.current.files[0]);
      }

      const result = await savePost(formData);

      if (result.ok) {
        toast.success(result.message);
        form.reset(emptyPost);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-xl border border-zinc-200 bg-white p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-[#1B4332]">
              {values.id ? "Edit Berita" : "Tambah Berita"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => form.reset(emptyPost)}
            >
              <Plus className="size-4" />
              Baru
            </Button>
          </div>
          <div className="mt-5 grid gap-5">
            <FormField label="Judul" error={form.formState.errors.title?.message}>
              <Input {...form.register("title")} />
            </FormField>
            <FormField
              label="Slug"
              helper="Kosongkan untuk membuat slug otomatis dari judul."
              error={form.formState.errors.slug?.message}
            >
              <Input {...form.register("slug")} />
            </FormField>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Kategori" error={form.formState.errors.category?.message}>
                <Select {...form.register("category")}>
                  <option value="berita">Berita</option>
                  <option value="pengumuman">Pengumuman</option>
                </Select>
              </FormField>
              <FormField label="Status" error={form.formState.errors.status?.message}>
                <Select {...form.register("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Terbit</option>
                </Select>
              </FormField>
            </div>
            <FormField
              label="Ringkasan"
              error={form.formState.errors.excerpt?.message}
            >
              <Textarea rows={3} {...form.register("excerpt")} />
            </FormField>
            <FormField
              label="Konten"
              helper="Paragraf maksimal 3 kalimat. Pisahkan paragraf dengan baris kosong."
              error={form.formState.errors.content?.message}
            >
              <Textarea rows={9} {...form.register("content")} />
            </FormField>
            <FormField
              label="Gambar sampul"
              helper="Opsional jika mengunggah file baru."
              error={form.formState.errors.cover_url?.message}
            >
              <Input {...form.register("cover_url")} />
            </FormField>
            <FormField label="Upload gambar sampul" helper="Gambar disimpan ke Supabase Storage.">
              <Input ref={fileRef} type="file" accept="image/*" />
            </FormField>
          </div>
          <Button type="submit" disabled={pending} className="mt-6">
            <Save className="size-4" />
            {pending ? "Menyimpan..." : "Simpan Berita"}
          </Button>
        </form>

        <DataTable data={livePosts} columns={columns} emptyText="Belum ada berita." />
      </div>

      <RealtimePreview
        title="Preview artikel"
        description="Menampilkan artikel yang sedang ditulis atau dipilih."
      >
        <article className="overflow-hidden rounded-xl border border-zinc-200">
          <div className="aspect-[16/10] bg-zinc-100">
            {values.cover_url ? (
              <img
                src={values.cover_url}
                alt={values.title}
                className="size-full object-cover"
              />
            ) : null}
          </div>
          <div className="p-4">
            <Badge variant={values.category === "pengumuman" ? "accent" : "default"}>
              {values.category}
            </Badge>
            <h3 className="mt-3 font-heading text-xl font-bold text-[#1B4332]">
              {values.title || "Judul berita"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {values.excerpt || "Ringkasan berita akan tampil di sini."}
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">
              {(values.content || "Konten berita akan tampil di sini.")
                .split("\n\n")
                .slice(0, 3)
                .map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
          </div>
        </article>
      </RealtimePreview>
    </div>
  );
}
