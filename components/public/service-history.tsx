// @ts-nocheck
'use client';

import { useState } from 'react';
import { Search, CheckCircle, Clock, XCircle, Loader2, History, ChevronDown, ChevronUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ServiceRequest {
  id: string;
  resident_name: string;
  service_type: string;
  status: 'masuk' | 'diproses' | 'selesai' | 'ditolak';
  created_at: string;
  notes?: string;
}

interface ServiceHistoryProps {
  initialRequests?: ServiceRequest[];
}

export function ServiceHistory({ initialRequests = [] }: ServiceHistoryProps) {
  const [searchName, setSearchName] = useState('');
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  async function handleSearch() {
    if (!searchName.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/service-track?name=${encodeURIComponent(searchName)}`);
      const data = await response.json();

      if (data.ok) {
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const statusConfig = {
    masuk: { icon: Clock, color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Menunggu' },
    diproses: { icon: Loader2, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Diproses' },
    selesai: { icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200', label: 'Selesai' },
    ditolak: { icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200', label: 'Ditolak' },
  };

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
            <h3 className="font-semibold text-[#1B4332]">Riwayat Pengajuan</h3>
            <p className="text-sm text-zinc-500">Cek status pengajuan surat Anda</p>
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
            <Button onClick={handleSearch} disabled={isLoading || !searchName.trim()} size="sm">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Cari'
              )}
            </Button>
          </div>

          {/* Results */}
          {hasSearched && (
            <div className="mt-4 space-y-3">
              {requests.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center">
                  <Search className="mx-auto h-8 w-8 text-zinc-300" />
                  <h4 className="mt-2 font-medium text-zinc-700">
                    Tidak ditemukan
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500">
                    Tidak ada pengajuan surat dengan nama "{searchName}"
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-zinc-500">
                    Ditemukan {requests.length} pengajuan
                  </p>
                  {requests.map((request) => {
                    const config = statusConfig[request.status];
                    const StatusIcon = config.icon;

                    return (
                      <div
                        key={request.id}
                        className="rounded-lg border border-zinc-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-zinc-900">
                              {request.service_type}
                            </h4>
                            <p className="mt-1 text-xs text-zinc-500">
                              Diajukan: {new Date(request.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                            {request.notes && (
                              <p className="mt-2 text-xs text-zinc-600 bg-zinc-50 p-2 rounded">
                                Catatan: {request.notes}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={`${config.color} gap-1 border px-2 py-0.5 text-xs whitespace-nowrap`}
                          >
                            <StatusIcon className={`h-3 w-3 ${request.status === 'diproses' ? 'animate-spin' : ''}`} />
                            {config.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {!hasSearched && (
            <div className="mt-4 rounded-lg border border-dashed border-zinc-300 p-4 text-center">
              <p className="text-xs text-zinc-500">
                Masukkan nama Anda untuk melihat riwayat pengajuan
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
