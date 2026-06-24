'use client';

/* eslint-disable @next/next/no-img-element */

import type { Tables } from '@/lib/database.types';

interface TemplatePreviewProps {
  umkm: {
    name: string;
    owner_name: string;
    description: string;
    cover_url: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  template: {
    id: string;
    name: string;
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
    accent_color?: string;
    layout?: string;
  };
  productCount: number;
  sampleProducts: Array<{ name: string; price: string; description: string }>;
}

const templateConfigs = {
  modern: {
    primaryColor: '#1B4332',
    secondaryColor: '#B7E4C7',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    accentColor: '#40916C',
  },
  vibrant: {
    primaryColor: '#FF6B35',
    secondaryColor: '#F7931E',
    fontFamily: '"Segoe UI", Tahoma, Geneva, sans-serif',
    accentColor: '#FFA500',
  },
  elegant: {
    primaryColor: '#2C3E50',
    secondaryColor: '#34495E',
    fontFamily: '"Georgia", serif',
    accentColor: '#3498DB',
  },
  market: {
    primaryColor: '#D63031',
    secondaryColor: '#E17055',
    fontFamily: 'Trebuchet MS, sans-serif',
    accentColor: '#FF7675',
  },
};

export function TemplatePreview({
  umkm,
  template,
  productCount,
  sampleProducts,
}: TemplatePreviewProps) {
  const config =
    templateConfigs[template.id as keyof typeof templateConfigs] ||
    templateConfigs.modern;

  const styles = {
    container: {
      fontFamily: config.fontFamily,
      color: config.primaryColor,
    },
    header: {
      background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)`,
    },
    heading: {
      color: config.primaryColor,
      fontSize: '28px',
      fontWeight: 'bold',
    },
    accent: {
      color: config.accentColor,
    },
    button: {
      background: config.primaryColor,
      color: 'white',
    },
    productCard: {
      borderColor: config.secondaryColor,
      borderLeftColor: config.accentColor,
    },
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 overflow-hidden bg-white shadow-sm">
        {/* Header */}
        <div style={styles.header} className="relative p-6 text-white">
          {umkm.cover_url && (
            <img
              src={umkm.cover_url}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          )}
          <div className="relative z-10">
            <div style={styles.accent} className="text-sm font-semibold mb-2 uppercase tracking-wide">
              {template.name}
            </div>
            <h1 style={styles.heading} className="text-white mb-2">
              {umkm.name || 'UMKM Name'}
            </h1>
            <p className="text-white/90 text-sm">Pemilik: {umkm.owner_name || 'Owner Name'}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h2 style={styles.heading} className="text-lg mb-3">
              Tentang UMKM
            </h2>
            <p className="text-zinc-700 leading-relaxed text-sm">
              {umkm.description || 'Deskripsi UMKM akan ditampilkan di sini...'}
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-200">
            {umkm.phone && (
              <div className="text-center">
                <div style={styles.accent} className="text-2xl mb-2">
                  ☎️
                </div>
                <p className="text-xs text-zinc-600 mb-1">Telepon</p>
                <p style={styles.accent} className="font-semibold text-sm">
                  {umkm.phone}
                </p>
              </div>
            )}
            {umkm.whatsapp && (
              <div className="text-center">
                <div style={styles.accent} className="text-2xl mb-2">
                  💬
                </div>
                <p className="text-xs text-zinc-600 mb-1">WhatsApp</p>
                <p style={styles.accent} className="font-semibold text-sm">
                  {umkm.whatsapp}
                </p>
              </div>
            )}
            {umkm.email && (
              <div className="text-center">
                <div style={styles.accent} className="text-2xl mb-2">
                  ✉️
                </div>
                <p className="text-xs text-zinc-600 mb-1">Email</p>
                <p style={styles.accent} className="font-semibold text-sm break-all text-xs">
                  {umkm.email}
                </p>
              </div>
            )}
          </div>

          {/* Products Section */}
          {productCount > 0 && (
            <div className="pt-4 border-t border-zinc-200">
              <h2 style={styles.heading} className="text-lg mb-4">
                Produk & Layanan ({productCount})
              </h2>
              <div
                className={`grid gap-4 ${
                  template.layout === 'grid' ? 'md:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {sampleProducts.map((product, idx) => (
                  <div
                    key={idx}
                    style={styles.productCard}
                    className="border-l-4 rounded-lg bg-zinc-50 p-4 hover:shadow-md transition-shadow"
                  >
                    <div
                      style={styles.heading}
                      className="font-semibold mb-1 text-sm"
                    >
                      {product.name}
                    </div>
                    <p className="text-xs text-zinc-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    {product.price && (
                      <div style={styles.accent} className="font-bold text-sm">
                        {product.price}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {productCount > 3 && (
                <p className="text-xs text-zinc-500 mt-3 text-center">
                  ... dan {productCount - 3} produk lainnya
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{ background: config.primaryColor }}
          className="text-white p-4 text-center text-xs"
        >
          <p>Preview Tampilan Website UMKM</p>
        </div>
      </div>
    </div>
  );
}
