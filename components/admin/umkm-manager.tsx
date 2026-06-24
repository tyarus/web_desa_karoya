// @ts-nocheck
'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useMemo, useRef, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit3, ChevronLeft, ChevronRight, X, Save } from 'lucide-react';

import { deleteUMKM, saveUMKM, saveUMKMProduct } from '@/app/admin/actions/umkm';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { DataTable } from '@/components/admin/data-table';
import { UMKMStepper, UMKMStepperProgress, Step } from '@/components/admin/umkm-stepper';
import { UMKMStepIdentity } from '@/components/admin/umkm-step-identity';
import { UMKMStepTemplate, TEMPLATES } from '@/components/admin/umkm-step-template';
import { UMKMStepProducts, Product } from '@/components/admin/umkm-step-products';
import { UMKMStepContact } from '@/components/admin/umkm-step-contact';
import { UMKMPreview, PreviewData } from '@/components/admin/umkm-preview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRealtimeList } from '@/components/realtime/use-realtime-list';
import type { Tables } from '@/lib/database.types';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Steps definition
const STEPS: Step[] = [
  { id: 1, label: 'Identitas', description: 'Info dasar' },
  { id: 2, label: 'Template', description: 'Pilih tampilan' },
  { id: 3, label: 'Produk', description: 'Tambah produk' },
  { id: 4, label: 'Kontak', description: 'Info kontak' },
];

// Main form schema with validation rules
const umkmFormSchema = z.object({
  // Step 1 - Identity
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter').max(500, 'Maksimal 500 karakter'),
  owner_name: z.string().min(3, 'Nama pemilik minimal 3 karakter'),
  cover_url: z.string().optional(),
  // Step 2 - Template
  template_id: z.string().default('A'),
  accent_color: z.string().optional(),
  // Step 4 - Contact
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  address: z.string().optional(),
  maps_url: z.string().optional(),
  // Meta
  status: z.enum(['draft', 'published']).default('draft'),
});

type UmkmFormData = z.infer<typeof umkmFormSchema>;

interface UMKMManagerProps {
  initialUMKMs: Tables<'umkm'>[];
  initialProducts: Tables<'umkm_products'>[];
}

const defaultFormData: UmkmFormData = {
  name: '',
  description: '',
  owner_name: '',
  cover_url: '',
  template_id: 'A',
  accent_color: '#1B4332',
  whatsapp: '',
  instagram: '',
  facebook: '',
  address: '',
  maps_url: '',
  status: 'draft',
};

export function UMKMManager({ initialUMKMs, initialProducts }: UMKMManagerProps) {
  const [pending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const liveUMKMs = useRealtimeList('umkm', initialUMKMs, {
    sort: (a, b) =>
      new Date(b.created_at ?? '').getTime() - new Date(a.created_at ?? '').getTime(),
  });

  const liveProducts = useRealtimeList('umkm_products', initialProducts);

  const form = useForm<UmkmFormData>({
    resolver: zodResolver(umkmFormSchema),
    defaultValues: defaultFormData,
    mode: 'onBlur', // Validate on blur to avoid blocking typing
  });

  const { watch, reset, setValue, trigger } = form;
  const formData = watch();

  // Build preview data from form
  const previewData: PreviewData = {
    name: formData.name,
    owner_name: formData.owner_name,
    description: formData.description,
    cover_url: formData.cover_url || '',
    template_id: formData.template_id,
    accent_color: formData.accent_color,
    products: products.map(p => ({
      name: p.name,
      price: p.price,
      image_url: p.image_url,
    })),
    whatsapp: formData.whatsapp,
    instagram: formData.instagram,
    facebook: formData.facebook,
    address: formData.address,
    maps_url: formData.maps_url,
  };

  // Step navigation with validation
  async function nextStep() {
    // Validate current step's fields
    let fieldsToValidate: (keyof UmkmFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['name', 'description', 'owner_name'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['template_id'];
    }
    // Steps 3 and 4 don't have required fields to validate

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) {
        toast.error('Mohon lengkapi field yang wajib diisi');
        return;
      }
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function goToStep(step: number) {
    // Only allow going to completed steps or the next step
    if (step <= currentStep || step === currentStep + 1) {
      setCurrentStep(step);
    }
  }

  // Load existing UMKM for editing
  function loadForEdit(umkm: Tables<'umkm'>) {
    setEditingId(umkm.id);
    const umkmProducts = liveProducts.filter(p => p.umkm_id === umkm.id);
    setProducts(umkmProducts.map(p => ({
      id: p.id,
      name: p.name || '',
      description: p.description,
      price: p.price || '',
      image_url: p.image_url || '',
    })));

    reset({
      name: umkm.name,
      description: umkm.description,
      owner_name: umkm.owner_name,
      cover_url: umkm.cover_url || '',
      template_id: (umkm.template_id as 'A' | 'B' | 'C') || 'A',
      accent_color: '#1B4332',
      whatsapp: umkm.whatsapp || '',
      instagram: umkm.instagram || '',
      facebook: umkm.facebook || '',
      address: umkm.address || '',
      maps_url: umkm.maps_url || '',
      status: (umkm.status as 'draft' | 'published') || 'draft',
    });
    setCurrentStep(1);
  }

  // Reset form
  function resetForm() {
    setEditingId(null);
    setProducts([]);
    setCoverFile(null);
    reset(defaultFormData);
    setCurrentStep(1);
  }

  // Submit handler with validation
  async function onSubmit(data: UmkmFormData) {
    console.log('=== onSubmit called ===');
    console.log('Form data:', JSON.stringify(data, null, 2));

    startTransition(async () => {
      const formDataObj = new FormData();
      formDataObj.set('id', editingId || '');
      formDataObj.set('name', data.name || '');
      formDataObj.set('description', data.description || '');
      formDataObj.set('owner_name', data.owner_name || '');
      // Use file if selected, otherwise use URL
      if (coverFile) {
        formDataObj.set('cover_url', '');
      } else {
        formDataObj.set('cover_url', data.cover_url || '');
      }
      formDataObj.set('template_id', data.template_id || 'A');
      formDataObj.set('accent_color', data.accent_color || '#1B4332');
      formDataObj.set('whatsapp', data.whatsapp || '');
      formDataObj.set('instagram', data.instagram || '');
      formDataObj.set('facebook', data.facebook || '');
      formDataObj.set('address', data.address || '');
      formDataObj.set('maps_url', data.maps_url || '');
      formDataObj.set('status', data.status || 'draft');

      // Add file if selected
      if (coverFile) {
        formDataObj.set('cover', coverFile);
      }

      console.log('Sending to server...');
      const result = await saveUMKM(formDataObj);
      console.log('Server result:', result);
      if (result.ok && result.data) {
        // Save products
        const umkmId = result.data.id;
        console.log('UMKM saved with ID:', umkmId);
        console.log('Products to save:', products.length, 'products');

        if (products.length > 0) {
          for (const product of products) {
            console.log('Saving product:', product.name);
            const productFormData = new FormData();
            productFormData.set('umkm_id', umkmId);
            productFormData.set('product_name', product.name);
            productFormData.set('description', product.description);
            productFormData.set('price', product.price || '');
            productFormData.set('image_url', product.image_url || '');
            const productResult = await saveUMKMProduct(productFormData);
            console.log('Product save result:', productResult);
            if (!productResult.ok) {
              console.error('Failed to save product:', productResult.message);
            }
          }
        }

        toast.success(result.message);
        resetForm();
      } else {
        toast.error(result.message || 'Gagal menyimpan');
      }
    });
  }

  // Handle form submission with manual validation
  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate all required fields
    const isValid = await trigger(['name', 'description', 'owner_name']);

    if (!isValid) {
      toast.error('Mohon lengkapi field yang wajib diisi');
      setCurrentStep(1); // Go back to first step to show errors
      return;
    }

    // Get current form values and submit
    const currentData = form.getValues();
    onSubmit(currentData);
  }

  // Data table columns
  const columns = useMemo<ColumnDef<Tables<'umkm'>>[]>(
    () => [
      {
        header: 'UMKM',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-zinc-900">{row.original.name}</p>
            <p className="text-xs text-zinc-500">{row.original.owner_name}</p>
          </div>
        ),
      },
      {
        header: 'Template',
        cell: ({ row }) => {
          const template = TEMPLATES.find(t => t.id === row.original.template_id);
          return <span>{template ? `${template.id} - ${template.name}` : '-'}</span>;
        },
      },
      {
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.original.status === 'published' ? 'default' : 'muted'}>
            {row.original.status === 'published' ? 'Terbit' : 'Draft'}
          </Badge>
        ),
      },
      {
        header: 'Produk',
        cell: ({ row }) => {
          const count = liveProducts.filter(p => p.umkm_id === row.original.id).length;
          return <span>{count}</span>;
        },
      },
      {
        header: 'Tanggal',
        cell: ({ row }) => <span className="text-sm">{formatDate(row.original.created_at ?? '')}</span>,
      },
      {
        header: 'Aksi',
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => loadForEdit(row.original)}>
              <Edit3 className="size-4" />
            </Button>
            <ConfirmDeleteDialog
              title="Hapus UMKM?"
              description={`"${row.original.name}" akan dihapus.`}
              onConfirm={() => {
                startTransition(async () => {
                  const result = await deleteUMKM(row.original.id);
                  if (result.ok) {
                    toast.success(result.message);
                  } else {
                    toast.error(result.message);
                  }
                });
              }}
            />
          </div>
        ),
      },
    ],
    [liveProducts]
  );

  // Max images based on template
  const maxImages = formData.template_id === 'A' ? 4 : formData.template_id === 'B' ? 8 : 5;

  return (
    <div className="space-y-6">
      {/* Multi-Step Form */}
      <form onSubmit={handleFormSubmit} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        {/* Hidden inputs for fields that might not be in current step */}
        {/* These ensure all form values are included in FormData submission */}
        <input type="hidden" name="template_id" value={formData.template_id} onChange={() => {}} />
        <input type="hidden" name="accent_color" value={formData.accent_color || ''} onChange={() => {}} />
        <input type="hidden" name="whatsapp" value={formData.whatsapp || ''} onChange={() => {}} />
        <input type="hidden" name="instagram" value={formData.instagram || ''} onChange={() => {}} />
        <input type="hidden" name="facebook" value={formData.facebook || ''} onChange={() => {}} />
        <input type="hidden" name="address" value={formData.address || ''} onChange={() => {}} />
        <input type="hidden" name="maps_url" value={formData.maps_url || ''} onChange={() => {}} />
        <input type="hidden" name="status" value={formData.status} onChange={() => {}} />

        {/* Stepper - Desktop */}
        <div className="hidden border-b border-zinc-200 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] p-4 sm:block">
          <UMKMStepper steps={STEPS} currentStep={currentStep} onStepClick={goToStep} />
        </div>

        {/* Stepper - Mobile */}
        <div className="border-b border-zinc-200 bg-zinc-50 p-4 sm:hidden">
          <UMKMStepperProgress steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-[#1B4332]">
                {currentStep === 1 && 'Identitas UMKM'}
                {currentStep === 2 && 'Pilih Template'}
                {currentStep === 3 && 'Tambah Produk'}
                {currentStep === 4 && 'Informasi Kontak'}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                {editingId ? 'Edit informasi UMKM' : 'Lengkapi informasi UMKM baru'}
              </p>
            </div>
            {editingId && (
              <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                <X className="mr-2 size-4" />
                Batal Edit
              </Button>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* Step Content - All fields always rendered but only current step visible */}
            <div className="min-h-[400px]">
              {/* Step 1: Identity */}
              <div className={currentStep === 1 ? 'block' : 'hidden'}>
                <UMKMStepIdentity
                  form={{
                    ...form,
                    register: form.register,
                    watch: form.watch,
                    formState: form.formState,
                  }}
                  onFileSelect={setCoverFile}
                />
              </div>

              {/* Step 2: Template */}
              <div className={currentStep === 2 ? 'block' : 'hidden'}>
                <UMKMStepTemplate
                  form={{
                    ...form,
                    register: form.register,
                    watch: form.watch,
                    setValue: form.setValue,
                    formState: form.formState,
                  }}
                />
              </div>

              {/* Step 3: Products */}
              <div className={currentStep === 3 ? 'block' : 'hidden'}>
                <UMKMStepProducts
                  products={products}
                  onProductsChange={setProducts}
                  maxImages={maxImages}
                />
              </div>

              {/* Step 4: Contact */}
              <div className={currentStep === 4 ? 'block' : 'hidden'}>
                <UMKMStepContact
                  form={{
                    ...form,
                    register: form.register,
                    watch: form.watch,
                    formState: form.formState,
                  }}
                />
              </div>
            </div>

            {/* Preview Panel - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-zinc-200"></div>
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">Preview</span>
                  <div className="h-px flex-1 bg-zinc-200"></div>
                </div>
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 shadow-inner">
                  <UMKMPreview data={previewData} className="h-[500px]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-gradient-to-r from-zinc-50 to-white p-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 size-4" />
            Sebelumnya
          </Button>

          <div className="flex items-center gap-2">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  currentStep >= step.id ? 'bg-[#1B4332]' : 'bg-zinc-300'
                )}
              />
            ))}
          </div>

          {currentStep < STEPS.length ? (
            <Button type="button" onClick={(e) => { e.preventDefault(); nextStep(); }}>
              Selanjutnya
              <ChevronRight className="ml-2 size-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={pending}>
              <Save className="mr-2 size-4" />
              {pending ? 'Menyimpan...' : editingId ? 'Update UMKM' : 'Simpan UMKM'}
            </Button>
          )}
        </div>

        {/* Mobile Preview Toggle */}
        <div className="border-t border-zinc-200 p-4 lg:hidden">
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-zinc-600">
              <span>Lihat Preview</span>
              <ChevronRight className="size-4 transition-transform group-open:rotate-90" />
            </summary>
            <div className="mt-4">
              <UMKMPreview data={previewData} />
            </div>
          </details>
        </div>
      </form>

      {/* UMKM List */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="border-b border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-[#1B4332]">
              Daftar UMKM ({liveUMKMs.length})
            </h3>
          </div>
        </div>
        <DataTable columns={columns} data={liveUMKMs} emptyText="Belum ada UMKM." />
      </div>
    </div>
  );
}
