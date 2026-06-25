'use client';

import { useState } from 'react';
import { Search, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ServiceRequest {
  id: string;
  resident_name: string;
  service_type: string;
  status: 'masuk' | 'diproses' | 'selesai' | 'ditolak';
  created_at: string;
}

interface ServiceTrackerProps {
  initialRequests?: ServiceRequest[];
}

export function ServiceTracker({ initialRequests = [] }: ServiceTrackerProps) {
  const [searchName, setSearchName] = useState('');
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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
    <div className="space-y-6">
      {/* Search Section */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder="Masukkan nama Anda untuk melacak pengajuan..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading || !searchName.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Cari'
          )}
        </Button>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center">
              <Search className="mx-auto h-12 w-12 text-zinc-300" />
              <h3 className="mt-4 font-semibold text-zinc-700">
                Tidak ditemukan
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Tidak ada pengajuan surat dengan nama "{searchName}"
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-zinc-500">
                Ditemukan {requests.length} pengajuan atas nama "{searchName}"
              </p>
              {requests.map((request) => {
                const config = statusConfig[request.status];
                const StatusIcon = config.icon;

                return (
                  <div
                    key={request.id}
                    className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-zinc-900">
                          {request.service_type}
                        </h4>
                        <p className="mt-1 text-sm text-zinc-500">
                          Diajukan: {new Date(request.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${config.color} gap-1 border px-3 py-1`}
                      >
                        <StatusIcon className={`h-3.5 w-3.5 ${request.status === 'diproses' ? 'animate-spin' : ''}`} />
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center">
          <Search className="mx-auto h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-500">
            Masukkan nama Anda untuk melacak status pengajuan surat
          </p>
        </div>
      )}
    </div>
  );
}
