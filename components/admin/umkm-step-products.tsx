// @ts-nocheck
'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
}

export interface ProductsFormData {
  products: Product[];
}

interface UMKMStepProductsProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  maxImages?: number;
}

export function UMKMStepProducts({
  products,
  onProductsChange,
  maxImages = 8
}: UMKMStepProductsProps) {
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });

  function addProduct() {
    if (!newProduct.name.trim() || !newProduct.description.trim()) return;

    onProductsChange([
      ...products,
      { ...newProduct, id: crypto.randomUUID() }
    ]);
    setNewProduct({ name: '', description: '', price: '', image_url: '' });
  }

  function removeProduct(id: string) {
    onProductsChange(products.filter(p => p.id !== id));
  }

  const totalImages = products.filter(p => p.image_url).length;
  const canAddMoreImages = totalImages < maxImages;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg font-semibold text-[#1B4332]">
          Produk UMKM
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Tambahkan produk atau jasa yang ditawarkan ({products.length}/{maxImages} produk)
        </p>
      </div>

      {/* Add Product Form */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <h4 className="mb-4 font-medium text-zinc-700">Tambah Produk Baru</h4>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nama Produk" required>
              <Input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Nama produk atau jasa"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            </FormField>

            <FormField label="Harga (Opsional)">
              <Input
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="Contoh: Rp 50.000"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            </FormField>
          </div>

          <FormField label="Deskripsi">
            <Textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Jelaskan detail produk atau jasa..."
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                }
              }}
            />
          </FormField>

          <FormField
            label="URL Gambar Produk (Opsional)"
            hint={!canAddMoreImages ? `Batas maksimal ${maxImages} gambar tercapai` : undefined}
          >
            <Input
              type="url"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
              placeholder="https://example.com/gambar.jpg"
              disabled={!canAddMoreImages && !newProduct.image_url}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            />
            <p className="mt-1 text-xs text-zinc-500">
              Paste URL gambar produk (maks {maxImages} gambar)
            </p>
          </FormField>

          <Button
            type="button"
            onClick={addProduct}
            disabled={!newProduct.name.trim() || !newProduct.description.trim()}
            className="w-full"
            variant="outline"
          >
            <Plus className="mr-2 size-4" />
            Tambah ke Daftar
          </Button>
        </div>
      </div>

      {/* Products List */}
      {products.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-zinc-700">
            Daftar Produk ({products.length})
          </h4>

          <div className="space-y-3">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-500">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900 truncate">{product.name}</p>
                      {product.price && (
                        <p className="text-sm font-semibold text-[#1B4332]">{product.price}</p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <p className="line-clamp-2 text-sm text-zinc-600">
                    {product.description}
                  </p>

                  {product.image_url && (
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-zinc-200 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
            <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            Belum ada produk. Tambahkan produk di form di atas.
          </p>
        </div>
      )}
    </div>
  );
}
