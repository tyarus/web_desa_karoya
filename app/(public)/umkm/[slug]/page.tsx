// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TemplateA } from '@/components/public/umkm-template-a';
import { TemplateB } from '@/components/public/umkm-template-b';
import { TemplateC } from '@/components/public/umkm-template-c';

export const dynamic = 'force-dynamic';

interface UMKMDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function UMKMDetailPage({ params }: UMKMDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: umkm } = await supabase
    .from('umkm')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!umkm) {
    notFound();
  }

  const { data: productsData } = await supabase
    .from('umkm_products')
    .select('*')
    .eq('umkm_id', umkm.id)
    .order('created_at', { ascending: false });

  const products = Array.isArray(productsData) ? productsData : [];

  const templateId = umkm.template_id || 'A';

  return (
    <div className="relative">
      {/* Back Button - Fixed position, better mobile support */}
      <div className="fixed left-4 top-[72px] z-20 sm:top-20">
        <Link
          href="/umkm"
          className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-sm font-medium text-zinc-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-[#1B4332] hover:shadow-xl active:scale-95 sm:rounded-lg"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Kembali</span>
        </Link>
      </div>

      {/* Render Template Based on Selection */}
      {templateId === 'A' && <TemplateA umkm={umkm} products={products} />}
      {templateId === 'B' && <TemplateB umkm={umkm} products={products} />}
      {templateId === 'C' && <TemplateC umkm={umkm} products={products} />}

      {/* Fallback if template not found */}
      {!['A', 'B', 'C'].includes(templateId) && (
        <TemplateA umkm={umkm} products={products} />
      )}
    </div>
  );
}
