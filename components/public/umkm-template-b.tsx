'use client';

/* eslint-disable @next/next/no-img-element */

import { MapPin } from 'lucide-react';
import type { Tables } from '@/lib/database.types';

interface TemplateBProps {
  umkm: Tables<'umkm'>;
  products: Tables<'umkm_products'>[];
}

export function TemplateB({ umkm, products }: TemplateBProps) {
  const primaryColor = '#1B4332'; // Green

  return (
    <article className="min-h-screen bg-zinc-50 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1
                className="text-2xl font-bold text-zinc-900 sm:text-3xl lg:text-4xl"
                style={{ fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif' }}
              >
                {umkm.name}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:mt-2 sm:text-base">
                {umkm.description}
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3">
              {umkm.whatsapp && (
                <a
                  href={`https://wa.me/${umkm.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-white transition-transform hover:scale-105 active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              )}

              {umkm.instagram && (
                <a
                  href={`https://instagram.com/${umkm.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 text-xs font-medium text-white transition-transform hover:scale-105 active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.445.595-1.445 1.329 0 .734.65 1.33 1.445 1.33.795 0 1.446-.596 1.446-1.33 0-.734-.65-1.329-1.446-1.329z"/>
                  </svg>
                  <span className="hidden sm:inline">Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Gallery */}
      {umkm.cover_url && (
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <div className="col-span-2 row-span-2 overflow-hidden rounded-xl sm:rounded-2xl">
              <img
                src={umkm.cover_url}
                alt={umkm.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            {products.slice(0, 4).map((product) => (
              product.image_url && (
                <div
                  key={product.id}
                  className="aspect-square overflow-hidden rounded-xl"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              )
            ))}
          </div>
        </section>
      )}

      {/* Products Grid */}
      {products.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-6 flex flex-col gap-1 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                className="text-xl font-bold text-zinc-900 sm:text-2xl"
                style={{ fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif' }}
              >
                Produk
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500 sm:mt-1">{products.length} produk tersedia</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {product.image_url && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900 sm:text-base">
                    {product.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-600 sm:mt-2 sm:text-sm">
                    {product.description}
                  </p>
                  {product.price && (
                    <p
                      className="mt-2 text-base font-bold sm:mt-3 sm:text-lg"
                      style={{ color: primaryColor }}
                    >
                      {product.price}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {umkm.address && (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-zinc-100 p-4 sm:gap-3 sm:p-4">
              <MapPin className="h-4 w-4 text-[#1B4332] sm:h-5 sm:w-5" />
              <span className="text-sm font-semibold text-zinc-900 sm:text-base">Lokasi</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-zinc-600 sm:text-base">{umkm.address}</p>
            </div>
            {umkm.maps_url && (
              <div className="h-48 overflow-hidden sm:h-64">
                <iframe
                  src={umkm.maps_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi UMKM"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </article>
  );
}
