"use client";

/* eslint-disable react-hooks/incompatible-library */

import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, MailCheck, Save } from "lucide-react";
import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  deleteContactMessage,
  replyContactMessage,
} from "@/app/admin/actions/contact";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { DataTable } from "@/components/admin/data-table";
import { RealtimePreview } from "@/components/admin/realtime-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeList } from "@/components/realtime/use-realtime-list";
import type { Database, Tables } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";
import { contactReplySchema, type ContactReplyInput } from "@/lib/validations";

type MessageStatus = Database["public"]["Enums"]["message_status"];

const statusVariant: Record<MessageStatus, "default" | "accent" | "muted"> = {
  baru: "accent",
  dibalas: "default",
  diarsipkan: "muted",
};

export function ContactManager({
  messages,
}: {
  messages: Tables<"contact_messages">[];
}) {
  const [pending, startTransition] = useTransition();
  const liveMessages = useRealtimeList("contact_messages", messages, {
    sort: (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  });
  const form = useForm<ContactReplyInput>({
    resolver: zodResolver(contactReplySchema),
    defaultValues: {
      id: "",
      reply: "",
      status: "dibalas",
    },
  });
  const selected = liveMessages.find((message) => message.id === form.watch("id"));

  const columns = useMemo<ColumnDef<Tables<"contact_messages">>[]>(
    () => [
      {
        header: "Pengirim",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-zinc-900">{row.original.name}</p>
            <p className="text-xs text-zinc-500">
              {row.original.email ?? row.original.phone ?? "-"}
            </p>
          </div>
        ),
      },
      {
        header: "Pesan",
        cell: ({ row }) => (
          <p className="line-clamp-2 max-w-md text-zinc-600">
            {row.original.message}
          </p>
        ),
      },
      {
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusVariant[row.original.status]}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        header: "Tanggal",
        cell: ({ row }) => formatDate(row.original.created_at),
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
                  reply: row.original.reply ?? "",
                  status:
                    row.original.status === "diarsipkan"
                      ? "diarsipkan"
                      : "dibalas",
                })
              }
            >
              <Edit3 className="size-4" />
              Balas
            </Button>
            <ConfirmDeleteDialog
              title="Hapus pesan?"
              description={`Pesan dari ${row.original.name} akan dihapus.`}
              onConfirm={() => deleteContactMessage(row.original.id)}
            />
          </div>
        ),
      },
    ],
    [form],
  );

  function onSubmit(input: ContactReplyInput) {
    startTransition(async () => {
      const result = await replyContactMessage(input);

      if (result.ok) {
        toast.success(result.message);
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
          <h2 className="font-heading text-lg font-bold text-[#1B4332]">
            Balas Pesan
          </h2>
          {selected ? (
            <div className="mt-4 rounded-lg bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
              <p className="font-semibold text-zinc-900">{selected.name}</p>
              <p>{selected.message}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              Pilih pesan dari tabel untuk menulis balasan.
            </p>
          )}
          <div className="mt-5 grid gap-5">
            <FormField label="Status" error={form.formState.errors.status?.message}>
              <Select {...form.register("status")}>
                <option value="baru">Baru</option>
                <option value="dibalas">Dibalas</option>
                <option value="diarsipkan">Diarsipkan</option>
              </Select>
            </FormField>
            <FormField label="Balasan" error={form.formState.errors.reply?.message}>
              <Textarea rows={5} {...form.register("reply")} />
            </FormField>
          </div>
          <Button type="submit" disabled={pending || !selected} className="mt-6">
            <Save className="size-4" />
            {pending ? "Menyimpan..." : "Simpan Balasan"}
          </Button>
        </form>

        <DataTable data={liveMessages} columns={columns} emptyText="Belum ada pesan." />
      </div>

      <RealtimePreview
        title="Pesan masuk"
        description="Pesan baru dari halaman kontak muncul secara realtime."
      >
        <div className="space-y-3">
          {liveMessages.slice(0, 6).map((message) => (
            <div
              key={message.id}
              className="rounded-lg border border-zinc-200 p-3 text-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-900">{message.name}</p>
                  <p className="line-clamp-2 text-zinc-600">{message.message}</p>
                </div>
                <Badge variant={statusVariant[message.status]}>
                  {message.status}
                </Badge>
              </div>
            </div>
          ))}
          {!liveMessages.length ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <MailCheck className="size-4" />
              Belum ada pesan masuk.
            </div>
          ) : null}
        </div>
      </RealtimePreview>
    </div>
  );
}
