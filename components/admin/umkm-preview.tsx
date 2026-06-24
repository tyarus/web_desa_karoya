'use client';

/* eslint-disable @next/next/no-img-element */

import { cn } from '@/lib/utils';
import { TEMPLATES } from './umkm-step-template';

export interface PreviewData {
  name: string;
  owner_name: string;
  description: string;
  cover_url: string;
  template_id: string;
  accent_color?: string;
  products?: {
    name: string;
    price?: string;
    image_url?: string;
  }[];
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  address?: string;
  maps_url?: string;
}

interface UMKMPreviewProps {
  data: PreviewData;
  className?: string;
}

export function UMKMPreview({ data, className }: UMKMPreviewProps) {
  if (!data.name) {
    return (
      <div className={cn("flex items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-8", className)}>
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
            <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-500">
            Preview akan muncul di sini
          </p>
        </div>
      </div>
    );
  }

  const template = TEMPLATES.find(t => t.id === data.template_id);
  const accentColor = data.accent_color || template?.accentColor || '#1B4332';

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm",
        className
      )}
    >
      {/* Mini Preview Header */}
      <div className="border-b border-zinc-100 bg-zinc-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-zinc-400">Preview</span>
        </div>
      </div>

      {/* Template Content - Scaled down */}
      <div
        className="scale-[0.4] origin-top-left p-4"
        style={{ width: '250%' }}
      >
        {data.template_id === 'A' && (
          <TemplateAPreview data={data} accentColor={accentColor} />
        )}
        {data.template_id === 'B' && (
          <TemplateBPreview data={data} accentColor={accentColor} />
        )}
        {data.template_id === 'C' && (
          <TemplateCPreview data={data} accentColor={accentColor} />
        )}
      </div>
    </div>
  );
}

// Template A Preview - Klasik Elegan
function TemplateAPreview({ data, accentColor }: { data: PreviewData; accentColor: string }) {
  return (
    <div className="bg-white" style={{ fontFamily: 'serif' }}>
      {/* Hero Section */}
      <div className="flex gap-6 p-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-zinc-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {data.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Oleh: {data.owner_name}</p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700">
            {data.description}
          </p>
          <button
            className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: accentColor }}
          >
            Hubungi via WhatsApp
          </button>
        </div>
        {data.cover_url && (
          <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
            <img src={data.cover_url} alt={data.name} className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      {/* Products */}
      {data.products && data.products.length > 0 && (
        <div className="border-t border-zinc-100 p-6">
          <h2 className="text-lg font-semibold text-zinc-900" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Produk Kami
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {data.products.slice(0, 2).map((product, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-zinc-200">
                {product.image_url && (
                  <div className="h-20 overflow-hidden">
                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-2">
                  <p className="text-xs font-medium text-zinc-900">{product.name}</p>
                  {product.price && (
                    <p className="text-xs font-semibold" style={{ color: accentColor }}>{product.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Template B Preview - Modern Grid
function TemplateBPreview({ data, accentColor }: { data: PreviewData; accentColor: string }) {
  return (
    <div className="bg-zinc-50" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold text-zinc-900">{data.name}</h1>
        <p className="text-sm text-zinc-500">{data.description}</p>
      </div>

      {/* Gallery Grid */}
      {data.cover_url && (
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 row-span-2 overflow-hidden rounded-lg">
              <img src={data.cover_url} alt={data.name} className="h-full w-full object-cover" />
            </div>
            {data.products?.slice(0, 2).map((product, i) => (
              product.image_url && (
                <div key={i} className="overflow-hidden rounded-lg">
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {data.products && data.products.length > 0 && (
        <div className="grid grid-cols-3 gap-2 p-4 pt-0">
          {data.products.slice(0, 3).map((product, i) => (
            <div key={i} className="overflow-hidden rounded-lg bg-white shadow-sm">
              {product.image_url && (
                <div className="h-16 overflow-hidden">
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-2">
                <p className="text-xs font-medium text-zinc-900 truncate">{product.name}</p>
                {product.price && (
                  <p className="text-xs font-semibold" style={{ color: accentColor }}>{product.price}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Template C Preview - Minimalis Clean
function TemplateCPreview({ data, accentColor }: { data: PreviewData; accentColor: string }) {
  return (
    <div className="bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Thin Banner */}
      {data.cover_url && (
        <div className="h-16 overflow-hidden">
          <img src={data.cover_url} alt={data.name} className="h-full w-full object-cover" />
        </div>
      )}

      {/* Centered Content */}
      <div className="p-6 text-center">
        <h1 className="text-2xl font-extrabold text-zinc-900">
          {data.name}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {data.description}
        </p>

        {/* Contact Buttons */}
        <div className="mt-4 flex justify-center gap-2">
          {data.whatsapp && (
            <button
              className="rounded-full px-3 py-1.5 text-xs font-medium text-white"
              style={{ backgroundColor: '#25D366' }}
            >
              WhatsApp
            </button>
          )}
          {data.instagram && (
            <button
              className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-xs font-medium text-white"
            >
              Instagram
            </button>
          )}
        </div>
      </div>

      {/* Products */}
      {data.products && data.products.length > 0 && (
        <div className="flex justify-center gap-3 p-4 pt-0">
          {data.products.slice(0, 3).map((product, i) => (
            <div key={i} className="w-24 overflow-hidden rounded-lg border border-zinc-200">
              {product.image_url && (
                <div className="h-16 overflow-hidden">
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-2 text-center">
                <p className="text-xs font-medium text-zinc-900 truncate">{product.name}</p>
                {product.price && (
                  <p className="text-xs font-semibold" style={{ color: accentColor }}>{product.price}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
