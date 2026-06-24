"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { useRealtimeList } from "@/components/realtime/use-realtime-list";
import { Input } from "@/components/ui/input";
import type { Tables } from "@/lib/database.types";
import { formatDate } from "@/lib/utils";

export function ContactHistory({
  messages,
}: {
  messages: Tables<"contact_messages">[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Only show messages with replies
  const repliedMessages = useRealtimeList("contact_messages", messages, {
    predicate: (msg) => msg.status !== "baru",
    sort: (a, b) =>
      new Date(b.replied_at ?? b.created_at).getTime() -
      new Date(a.replied_at ?? a.created_at).getTime(),
  });

  // Filter by search query
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return repliedMessages;

    const query = searchQuery.toLowerCase();
    return repliedMessages.filter(
      (msg) =>
        msg.name.toLowerCase().includes(query) ||
        msg.email?.toLowerCase().includes(query) ||
        msg.phone?.toLowerCase().includes(query)
    );
  }, [repliedMessages, searchQuery]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-xl font-bold text-[#1B4332]">
          Riwayat Pertanyaan
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Lihat jawaban dari admin desa terhadap pertanyaan Anda
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 size-5 text-zinc-400" />
        <Input
          placeholder="Cari berdasarkan nama, email, atau nomor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredMessages.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center">
          <p className="text-sm text-zinc-600">
            {searchQuery
              ? "Tidak ada pertanyaan yang sesuai dengan pencarian."
              : "Belum ada pertanyaan yang dijawab."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <p className="font-semibold text-zinc-900">{message.name}</p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">
                    {message.email}
                    {message.phone && ` • ${message.phone}`}
                  </p>
                </div>
                <div className="shrink-0">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      message.status === "dibalas"
                        ? "bg-green-100 text-green-700"
                        : message.status === "diarsipkan"
                          ? "bg-zinc-100 text-zinc-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {message.status === "dibalas"
                      ? "Dijawab"
                      : message.status === "diarsipkan"
                        ? "Diarsipkan"
                        : "Diproses"}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Pertanyaan
                  </p>
                  <p className="mt-1 text-sm text-zinc-700">{message.message}</p>
                </div>

                {message.reply && (
                  <div className="rounded-lg border-l-4 border-[#40916C] bg-[#f0fdf4] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#166534]">
                      Jawaban Admin
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm text-[#15803d]">
                      {message.reply}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
