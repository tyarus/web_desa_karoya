// @ts-nocheck
"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle,
  Clock,
  Archive,
  Loader2,
  History,
  ChevronDown,
  ChevronUp,
  Mail,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  reply: string | null;
  status: "baru" | "dibalas" | "diarsipkan";
  created_at: string;
  replied_at: string | null;
}

interface ContactHistoryProps {
  initialMessages?: ContactMessage[];
}

const statusConfig = {
  baru: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    label: "Menunggu",
  },
  dibalas: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-200",
    label: "Dijawab",
  },
  diarsipkan: {
    icon: Archive,
    color: "bg-zinc-100 text-zinc-700 border-zinc-200",
    label: "Diarsipkan",
  },
};

export function ContactHistory({ initialMessages = [] }: ContactHistoryProps) {
  const [searchName, setSearchName] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  async function handleSearch() {
    if (!searchName.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/contact-track?name=${encodeURIComponent(searchName)}`
      );
      const data = await response.json();

      if (data.ok) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      {/* Header - Clickable to expand/collapse */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-zinc-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#E9F5EE]">
            <History className="size-5 text-[#40916C]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1B4332]">
              Riwayat Pertanyaan
            </h3>
            <p className="text-sm text-zinc-500">
              Cek status pertanyaan Anda
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="size-5 text-zinc-400" />
        ) : (
          <ChevronDown className="size-5 text-zinc-400" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-zinc-200 p-4">
          {/* Search Section */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                type="text"
                placeholder="Masukkan nama Anda..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchName.trim()}
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Cari"
              )}
            </Button>
          </div>

          {/* Results */}
          {hasSearched && (
            <div className="mt-4 space-y-3">
              {messages.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center">
                  <Search className="mx-auto h-8 w-8 text-zinc-300" />
                  <h4 className="mt-2 font-medium text-zinc-700">
                    Tidak ditemukan
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500">
                    Tidak ada pertanyaan dengan nama "{searchName}"
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-zinc-500">
                    Ditemukan {messages.length} pertanyaan
                  </p>
                  {messages.map((msg) => {
                    const config = statusConfig[msg.status];
                    const StatusIcon = config.icon;

                    return (
                      <div
                        key={msg.id}
                        className="rounded-lg border border-zinc-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-zinc-900">
                                {msg.name}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`${config.color} gap-1 border px-2 py-0.5 text-xs whitespace-nowrap`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {config.label}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs text-zinc-500">
                              {msg.email}
                              {msg.phone && ` • ${msg.phone}`}
                            </p>
                            <p className="mt-2 text-xs text-zinc-600">
                              Ditanyakan:{" "}
                              {new Date(msg.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Question */}
                        <div className="mt-4 rounded-lg border-l-4 border-blue-200 bg-blue-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                            Pertanyaan
                          </p>
                          <p className="mt-1 whitespace-pre-line text-sm text-blue-800">
                            {msg.message}
                          </p>
                        </div>

                        {/* Reply */}
                        {msg.reply && (
                          <div className="mt-3 rounded-lg border-l-4 border-green-200 bg-green-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                              Jawaban Admin
                            </p>
                            <p className="mt-1 whitespace-pre-line text-sm text-green-800">
                              {msg.reply}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {!hasSearched && (
            <div className="mt-4 rounded-lg border border-dashed border-zinc-300 p-4 text-center">
              <Mail className="mx-auto h-8 w-8 text-zinc-300" />
              <p className="mt-2 text-xs text-zinc-500">
                Masukkan nama Anda untuk melihat riwayat pertanyaan
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
