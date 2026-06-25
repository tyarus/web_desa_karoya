// @ts-nocheck
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteServiceRequest,
  updateServiceRequestStatus,
} from "@/app/admin/actions/requests";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { DataTable } from "@/components/admin/data-table";
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

const statusLabels: Record<RequestStatus, string> = {
  masuk: "Masuk",
  diproses: "Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
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
        header: "Nama Pemohon",
        cell: ({ row }) => (
          <p className="font-medium text-zinc-900">
            {row.original.resident_name}
          </p>
        ),
      },
      {
        header: "Jenis Layanan",
        cell: ({ row }) => (
          <span className="text-zinc-700">
            {row.original.service_type}
          </span>
        ),
      },
      {
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusVariant[row.original.status]}>
            {statusLabels[row.original.status]}
          </Badge>
        ),
      },
      {
        header: "Tanggal",
        cell: ({ row }) => (
          <span className="text-sm text-zinc-500">
            {formatDate(row.original.created_at)}
          </span>
        ),
      },
      {
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
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
    <div>
      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-2xl font-bold text-yellow-700">
            {liveRequests.filter(r => r.status === 'masuk').length}
          </p>
          <p className="text-sm text-yellow-600">Menunggu</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-2xl font-bold text-blue-700">
            {liveRequests.filter(r => r.status === 'diproses').length}
          </p>
          <p className="text-sm text-blue-600">Diproses</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-2xl font-bold text-green-700">
            {liveRequests.filter(r => r.status === 'selesai').length}
          </p>
          <p className="text-sm text-green-600">Selesai</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-2xl font-bold text-red-700">
            {liveRequests.filter(r => r.status === 'ditolak').length}
          </p>
          <p className="text-sm text-red-600">Ditolak</p>
        </div>
      </div>

      <DataTable
        data={liveRequests}
        columns={columns}
        emptyText="Belum ada pengajuan surat."
      />
    </div>
  );
}
