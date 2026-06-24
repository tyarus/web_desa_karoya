"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Save } from "lucide-react";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteServiceRequest,
  updateServiceRequestStatus,
} from "@/app/admin/actions/requests";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { DataTable } from "@/components/admin/data-table";
import { RealtimePreview } from "@/components/admin/realtime-preview";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useRealtimeList } from "@/components/realtime/use-realtime-list";
import type { Database, Tables } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";

type RequestStatus = Database["public"]["Enums"]["request_status"];

const statusVariant: Record<RequestStatus, "default" | "accent" | "muted" | "danger"> = {
  masuk: "accent",
  diproses: "default",
  selesai: "muted",
  ditolak: "danger",
};

export function RequestManager({
  requests,
}: {
  requests: Tables<"service_requests">[];
}) {
  const [pending, startTransition] = useTransition();
  const liveRequests = useRealtimeList("service_requests", requests, {
    sort: (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  });

  function updateStatus(id: string, status: RequestStatus) {
    startTransition(async () => {
      const result = await updateServiceRequestStatus({ id, status });

      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  const columns = useMemo<ColumnDef<Tables<"service_requests">>[]>(
    () => [
      {
        header: "Pemohon",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-zinc-900">
              {row.original.resident_name}
            </p>
            <p className="text-xs text-zinc-500">{row.original.phone}</p>
          </div>
        ),
      },
      {
        header: "Layanan",
        cell: ({ row }) => row.original.service_type,
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
            <Select
              defaultValue={row.original.status}
              className="h-9 w-32"
              onChange={(event) =>
                updateStatus(row.original.id, event.target.value as RequestStatus)
              }
              disabled={pending}
            >
              <option value="masuk">Masuk</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </Select>
            <ConfirmDeleteDialog
              title="Hapus pengajuan?"
              description={`Pengajuan ${row.original.resident_name} akan dihapus.`}
              onConfirm={() => deleteServiceRequest(row.original.id)}
            />
          </div>
        ),
      },
    ],
    [pending],
  );

  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_360px]">
      <DataTable
        data={liveRequests}
        columns={columns}
        emptyText="Belum ada pengajuan surat."
      />
      <RealtimePreview
        title="Pengajuan masuk"
        description="Daftar ini berubah saat warga mengirim formulir layanan."
      >
        <div className="space-y-3">
          {liveRequests.slice(0, 6).map((request) => (
            <div
              key={request.id}
              className="rounded-lg border border-zinc-200 p-3 text-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-900">
                    {request.resident_name}
                  </p>
                  <p className="text-zinc-500">{request.service_type}</p>
                </div>
                <Badge variant={statusVariant[request.status]}>
                  {request.status}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {formatDate(request.created_at)}
              </p>
            </div>
          ))}
          {!liveRequests.length ? (
            <p className="text-sm text-zinc-500">Belum ada data pengajuan.</p>
          ) : null}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Save className="size-3.5" />
            Status tersimpan melalui Server Action.
          </div>
        </div>
      </RealtimePreview>
    </div>
  );
}
