'use client';

/* eslint-disable @next/next/no-img-element */

import { MapPin, Phone } from 'lucide-react';
import type { Tables } from '@/lib/database.types';

// WhatsApp SVG Icon
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// Instagram SVG Icon
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.445.595-1.445 1.329 0 .734.65 1.33 1.445 1.33.795 0 1.446-.596 1.446-1.33 0-.734-.65-1.329-1.446-1.329z"/>
    </svg>
  );
}

interface TemplateCProps {
  umkm: Tables<'umkm'>;
  products: Tables<'umkm_products'>[];
}

export function TemplateC({ umkm, products }: TemplateCProps) {
  const accentColor = '#6B7280'; // Gray as default

  return (
    <article className="min-h-screen bg-white pb-16">
      {/* Thin Banner */}
      {umkm.cover_url && (
        <div className="h-20 overflow-hidden sm:h-32 md:h-40">
          <img
            src={umkm.cover_url}
            alt={umkm.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Centered Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        <header className="text-center">
          <h1
            className="text-2xl font-extrabold text-zinc-900 sm:text-3xl lg:text-4xl"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            {umkm.name}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:mt-4 sm:text-base lg:text-lg">
            {umkm.description}
          </p>

          {/* Owner */}
          <p className="mt-2 text-xs text-zinc-500 sm:mt-4 sm:text-sm">
            Oleh {umkm.owner_name}
          </p>

          {/* Social Links */}
          <div className="mt-6 flex justify-center gap-2 sm:mt-8 sm:gap-4">
            {umkm.whatsapp && (
              <a
                href={`https://wa.me/${umkm.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-white transition-transform hover:scale-105 active:scale-95 sm:px-6 sm:py-3 sm:text-sm"
                style={{ backgroundColor: '#25D366' }}
              >
                <WhatsAppIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>WhatsApp</span>
              </a>
            )}

            {umkm.instagram && (
              <a
                href={`https://instagram.com/${umkm.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-2 text-xs font-medium transition-colors hover:bg-zinc-50 active:scale-95 sm:px-6 sm:py-3 sm:text-sm"
                style={{ borderColor: '#E1306C', color: '#E1306C' }}
              >
                <InstagramIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Instagram</span>
              </a>
            )}
          </div>
        </header>

        {/* Divider */}
        <div className="my-8 flex items-center justify-center gap-3 sm:my-12 sm:gap-4">
          <div className="h-px w-12 bg-zinc-200 sm:w-16" />
          <div className="h-1.5 w-1.5 rotate-45 bg-zinc-300 sm:h-2 sm:w-2" />
          <div className="h-px w-12 bg-zinc-200 sm:w-16" />
        </div>

        {/* Products */}
        {products.length > 0 && (
          <section>
            <h2
              className="mb-6 text-center text-lg font-bold text-zinc-900 sm:mb-8 sm:text-xl lg:text-2xl"
              style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            >
              Produk & Layanan
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="flex gap-4 rounded-xl border border-zinc-200 p-4 transition-shadow hover:shadow-md sm:gap-6 sm:p-6"
                >
                  {product.image_url && (
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <h3 className="text-sm font-semibold text-zinc-900 sm:text-base">
                        {product.name}
                      </h3>
                      {product.price && (
                        <span
                          className="shrink-0 text-sm font-bold sm:text-base lg:text-lg"
                          style={{ color: accentColor }}
                        >
                          {product.price}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-600 sm:mt-2 sm:text-sm">
                      {product.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Divider */}
        {products.length > 0 && (
          <div className="my-8 flex items-center justify-center gap-3 sm:my-12 sm:gap-4">
            <div className="h-px w-12 bg-zinc-200 sm:w-16" />
            <div className="h-1.5 w-1.5 rotate-45 bg-zinc-300 sm:h-2 sm:w-2" />
            <div className="h-px w-12 bg-zinc-200 sm:w-16" />
          </div>
        )}

        {/* Contact */}
        <section className="text-center">
          <h2
            className="mb-4 text-base font-bold text-zinc-900 sm:mb-6 sm:text-lg lg:text-xl"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            Hubungi Kami
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {umkm.address && (
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-600 sm:gap-3 sm:text-sm">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: accentColor }} />
                <span>{umkm.address}</span>
              </div>
            )}

            {umkm.whatsapp && (
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-600 sm:gap-3 sm:text-sm">
                <WhatsAppIcon className="h-4 w-4 text-[#25D366] sm:h-5 sm:w-5" />
                <span>{umkm.whatsapp}</span>
              </div>
            )}

            {umkm.instagram && (
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-600 sm:gap-3 sm:text-sm">
                <InstagramIcon className="h-4 w-4 text-[#E1306C] sm:h-5 sm:w-5" />
                <span>@{umkm.instagram.replace('@', '')}</span>
              </div>
            )}
          </div>

          {/* Map */}
          {umkm.maps_url && (
            <div className="mt-6 overflow-hidden rounded-xl shadow-sm sm:mt-8">
              <iframe
                src={umkm.maps_url}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi UMKM"
                className="grayscale"
              />
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
