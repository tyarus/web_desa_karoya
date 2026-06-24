'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface UMKMStepIdentityProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  onFileSelect?: (file: File | null) => void;
}

export function UMKMStepIdentity({ form, onFileSelect }: UMKMStepIdentityProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const coverUrl = watch('cover_url');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setValue('cover_url', url);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('cover_url', url);
    if (url) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const displayUrl = previewUrl || coverUrl;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg font-semibold text-[#1B4332]">
          Identitas UMKM
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Lengkapi informasi dasar tentang UMKM Anda
        </p>
      </div>

      <div className="space-y-5">
        <FormField
          label="Nama UMKM"
          required
          error={errors.name?.message}
          hint="Nama ini akan ditampilkan sebagai judul dan di menu publik"
        >
          <Input
            {...register('name')}
            placeholder="Contoh: Kerajinan Bambu Desa Karoya"
          />
        </FormField>

        <FormField
          label="Nama Pemilik"
          required
          error={errors.owner_name?.message}
        >
          <Input
            {...register('owner_name')}
            placeholder="Nama lengkap pemilik UMKM"
          />
        </FormField>

        <FormField
          label="Deskripsi Singkat"
          required
          error={errors.description?.message}
          hint="Minimal 10 karakter, maksimum 500 karakter"
        >
          <div className="relative">
            <Textarea
              {...register('description')}
              placeholder="Jelaskan singkat tentang produk atau jasa yang ditawarkan..."
              rows={4}
              maxLength={500}
              className="resize-none pr-12"
            />
            <span className={cn(
              "absolute bottom-3 right-3 text-xs",
              (watch('description')?.length || 0) > 450 ? "text-red-500" : "text-zinc-400"
            )}>
              {watch('description')?.length || 0}/500
            </span>
          </div>
        </FormField>

        <FormField
          label="Foto/Logo UMKM"
          error={errors.cover_url?.message}
          hint="Upload file atau paste URL gambar"
        >
          {displayUrl && (
            <div className="mb-3 overflow-hidden rounded-lg border border-zinc-200">
              <img
                src={displayUrl}
                alt="Preview"
                className="h-40 w-full object-cover"
              />
            </div>
          )}

          {/* File Upload */}
          <div className="mb-3">
            <label className="block w-full cursor-pointer text-sm text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-[#E9F5EE] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#1B4332] hover:file:bg-[#d4ebe1]">
              <span className="sr-only">Pilih file gambar</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              📁 Klik untuk pilih file dari komputer
            </label>
          </div>

          {/* OR Divider */}
          <div className="relative mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500">atau</span>
            </div>
          </div>

          {/* URL Input */}
          <Input
            type="url"
            value={coverUrl || ''}
            onChange={handleUrlInput}
            placeholder="Paste URL gambar (https://...)"
          />
          <p className="mt-2 text-xs text-zinc-500">
            Pilih file dari komputer atau paste URL gambar
          </p>
        </FormField>
      </div>
    </div>
  );
}
