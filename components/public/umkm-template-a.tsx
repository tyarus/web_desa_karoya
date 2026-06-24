'use client';

/* eslint-disable @next/next/no-img-element */

import { MapPin, Phone } from 'lucide-react';
import type { Tables } from '@/lib/database.types';

interface TemplateAProps {
  umkm: Tables<'umkm'>;
  products: Tables<'umkm_products'>[];
}

export function TemplateA({ umkm, products }: TemplateAProps) {
  const accentColor = '#D4AF37'; // Gold

  return (
    <article className="min-h-screen bg-white pb-16">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-8 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          {/* Text Content */}
          <div className="flex-1">
            <h1
              className="font-serif text-3xl font-bold text-zinc-900 sm:text-4xl lg:text-5xl"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              {umkm.name}
            </h1>
            <p className="mt-2 text-base text-zinc-600 sm:mt-3 sm:text-lg">
              Oleh: <span className="font-medium">{umkm.owner_name}</span>
            </p>
            <p className="mt-4 leading-relaxed text-zinc-700 sm:mt-6 sm:text-lg">
              {umkm.description}
            </p>

            {/* Contact CTA */}
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              {umkm.whatsapp && (
                <a
                  href={`https://wa.me/${umkm.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95 sm:px-6 sm:py-3 sm:text-base"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              )}

              {umkm.instagram && (
                <a
                  href={`https://instagram.com/${umkm.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border-2 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 active:scale-95 sm:px-6 sm:py-3 sm:text-base"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.445.595-1.445 1.329 0 .734.65 1.33 1.445 1.33.795 0 1.446-.596 1.446-1.33 0-.734-.65-1.329-1.446-1.329z"/>
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          </div>

          {/* Hero Image */}
          {umkm.cover_url && (
            <div className="lg:w-[400px]">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={umkm.cover_url}
                  alt={umkm.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      {products.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Produk Kami
            </h2>
            <p className="mt-2 text-center text-sm text-zinc-600 sm:mt-3 sm:text-base">
              Pilihan produk berkualitas tinggi
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:mt-12">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  {product.image_url && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-zinc-900 sm:text-lg" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                      {product.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600 sm:mt-3">
                      {product.description}
                    </p>
                    {product.price && (
                      <p
                        className="mt-3 text-lg font-bold sm:mt-4 sm:text-xl"
                        style={{ color: accentColor }}
                      >
                        {product.price}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Info */}
      {(umkm.address || umkm.maps_url) && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2
              className="text-center text-2xl font-bold text-zinc-900 sm:text-3xl"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Lokasi & Kontak
            </h2>

            <div className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:gap-8">
              {umkm.address && (
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: accentColor }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">Alamat</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600 sm:text-base">{umkm.address}</p>
                  </div>
                </div>
              )}

              {umkm.whatsapp && (
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12"
                    style={{ backgroundColor: '#25D36620' }}
                  >
                    <Phone className="h-5 w-5 text-[#25D366] sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">WhatsApp</h3>
                    <p className="mt-1 text-sm text-zinc-600 sm:text-base">{umkm.whatsapp}</p>
                  </div>
                </div>
              )}
            </div>

            {umkm.maps_url && (
              <div className="mt-8 overflow-hidden rounded-xl shadow-md sm:mt-12">
                <iframe
                  src={umkm.maps_url}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi UMKM"
                  className="grayscale"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </article>
  );
}
