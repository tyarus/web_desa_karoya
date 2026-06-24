// @ts-nocheck
'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface ContactFormData {
  whatsapp: string;
  instagram: string;
  facebook: string;
  address: string;
  maps_url: string;
}

interface UMKMStepContactProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function UMKMStepContact({ form }: UMKMStepContactProps) {
  const { register, formState: { errors } } = form;

  // WhatsApp validation - more lenient
  const validateWhatsApp = (value: string) => {
    if (!value) return true;
    // Accept various formats: +62, 62, 0, with dashes/spaces
    const cleaned = value.replace(/[\s\-]/g, '');
    const isValid = /^(\+?62|0)\d{8,13}$/.test(cleaned);
    return isValid || 'Format nomor WhatsApp tidak valid (cth: 081234567890)';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg font-semibold text-[#1B4332]">
          Informasi Kontak
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Lengkapi informasi kontak agar pelanggan dapat menghubungi Anda
        </p>
      </div>

      <div className="space-y-5">
        <FormField
          label="Nomor WhatsApp"
          error={errors.whatsapp?.message}
          hint="Contoh: 081234567890 atau +6281234567890"
        >
          <Input
            {...register('whatsapp', {
              validate: validateWhatsApp
            })}
            type="tel"
            placeholder="081234567890"
          />
        </FormField>

        <FormField
          label="Instagram"
          error={errors.instagram?.message}
          hint="Contoh: nama_instagram (tanpa @)"
        >
          <Input
            {...register('instagram')}
            placeholder="nama_instagram"
          />
        </FormField>

        <FormField
          label="Facebook"
          error={errors.facebook?.message}
          hint="Contoh: https://facebook.com/nama-halaman"
        >
          <Input
            {...register('facebook')}
            type="url"
            placeholder="https://facebook.com/nama-halaman"
          />
        </FormField>

        <FormField
          label="Alamat Lengkap"
          error={errors.address?.message}
          hint="Masukkan alamat lengkap untuk ditampilkan di halaman"
        >
          <Textarea
            {...register('address')}
            placeholder="Jl. Desa Karoya No. 1, RT 01 RW 02, Desa Karoya, Kecamatan Karangpawitan, Kabupaten Karawang, Jawa Barat 12345"
            rows={3}
          />
        </FormField>

        <FormField
          label="Google Maps Embed URL"
          error={errors.maps_url?.message}
          hint="Tempelkan URL Google Maps untuk menampilkan lokasi (opsional)"
        >
          <Input
            {...register('maps_url')}
            type="url"
            placeholder="https://maps.google.com/...?output=embed"
          />
        </FormField>
      </div>

      {/* Quick Preview */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <h4 className="mb-3 font-medium text-zinc-700">Preview Tampilan Kontak</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-zinc-600">WhatsApp akan menampilkan tombol chat langsung</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-500" />
            <span className="text-zinc-600">Instagram akan menampilkan link ke profil</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-zinc-600">Facebook akan menampilkan link ke halaman</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-zinc-600">Maps akan menampilkan embed lokasi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
