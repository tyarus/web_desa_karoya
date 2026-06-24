'use client';

import { UseFormReturn, FieldValues } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface TemplateFormData {
  template_id: string;
  accent_color?: string;
}

export interface TemplateOption {
  id: string;
  name: string;
  description: string;
  preview: string; // SVG or description
  features: string[];
  accentColor: string;
}

export const TEMPLATES: TemplateOption[] = [
  {
    id: 'A',
    name: 'Klasik Elegan',
    description: 'Desain klasik dengan sentuhan premium, cocok untuk produk craft dan tradisional',
    preview: 'single-column',
    features: ['Layout single column', 'Hero section besar', 'Font serif premium', 'Max 4 gambar produk'],
    accentColor: '#D4AF37', // Gold
  },
  {
    id: 'B',
    name: 'Modern Grid',
    description: 'Tampilan modern dengan galeri foto dominan, cocok untuk produk visual',
    preview: 'masonry-grid',
    features: ['Layout masonry/grid', 'Galeri foto dominan', 'Font modern Plus Jakarta Sans', 'Max 8 gambar'],
    accentColor: '#1B4332', // Green
  },
  {
    id: 'C',
    name: 'Minimalis Clean',
    description: 'Desain minimalis dengan fokus pada konten, cocok untuk jasa dan produk simple',
    preview: 'centered-minimal',
    features: ['Layout centered', 'Banner tipis full-width', 'Font Inter ExtraBold', 'Max 5 gambar'],
    accentColor: '#6B7280', // Gray
  },
];

interface UMKMStepTemplateProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function UMKMStepTemplate({ form }: UMKMStepTemplateProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const selectedTemplate = watch('template_id');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg font-semibold text-[#1B4332]">
          Pilih Template
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Pilih tampilan yang paling sesuai dengan karakter UMKM Anda
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {TEMPLATES.map((template) => (
          <label
            key={template.id}
            className={cn(
              'relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200',
              selectedTemplate === template.id
                ? 'border-[#1B4332] bg-[#E9F5EE] shadow-md'
                : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
            )}
          >
            <input
              type="radio"
              {...register('template_id')}
              value={template.id}
              className="sr-only"
            />

            {/* Template Preview Illustration */}
            <div className="mb-3 flex h-24 items-center justify-center rounded-lg bg-zinc-100">
              <TemplatePreviewIcon template={template.preview} accentColor={template.accentColor} />
            </div>

            {/* Template Name */}
            <div className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: template.accentColor }}
              >
                {template.id}
              </div>
              <span className="font-semibold text-zinc-900">{template.name}</span>
            </div>

            {/* Description */}
            <p className="mt-2 text-xs text-zinc-600">
              {template.description}
            </p>

            {/* Features */}
            <ul className="mt-3 space-y-1">
              {template.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <span className="h-1 w-1 rounded-full bg-zinc-400" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Selected Indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1B4332] text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>

      {errors.template_id && (
        <p className="text-sm text-red-500">{errors.template_id.message}</p>
      )}

      {/* Custom Accent Color (optional) */}
      {selectedTemplate && (
        <FormField
          label="Warna Aksen (Opsional)"
          hint="Kustomisasi warna aksen template sesuai preferensi"
        >
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={watch('accent_color') || TEMPLATES.find(t => t.id === selectedTemplate)?.accentColor}
              onChange={(e) => setValue('accent_color', e.target.value)}
              className="h-10 w-20 cursor-pointer rounded-lg border border-zinc-200"
            />
            <Input
              type="text"
              value={watch('accent_color') || TEMPLATES.find(t => t.id === selectedTemplate)?.accentColor}
              onChange={(e) => setValue('accent_color', e.target.value)}
              placeholder="#D4AF37"
              className="flex-1"
            />
          </div>
        </FormField>
      )}
    </div>
  );
}

// Template preview icons
function TemplatePreviewIcon({ template, accentColor }: { template: string; accentColor: string }) {
  if (template === 'single-column') {
    return (
      <svg className="h-20 w-20" viewBox="0 0 80 80" fill="none">
        <rect x="10" y="10" width="60" height="20" rx="2" fill={accentColor} opacity="0.3" />
        <rect x="10" y="35" width="35" height="4" rx="1" fill="#1B4332" />
        <rect x="10" y="43" width="60" height="2" rx="1" fill="#E5E7EB" />
        <rect x="10" y="48" width="55" height="2" rx="1" fill="#E5E7EB" />
        <rect x="10" y="53" width="40" height="2" rx="1" fill="#E5E7EB" />
        <rect x="50" y="35" width="20" height="20" rx="2" fill={accentColor} opacity="0.5" />
      </svg>
    );
  }

  if (template === 'masonry-grid') {
    return (
      <svg className="h-20 w-20" viewBox="0 0 80 80" fill="none">
        <rect x="10" y="10" width="18" height="18" rx="2" fill={accentColor} opacity="0.4" />
        <rect x="31" y="10" width="18" height="25" rx="2" fill={accentColor} opacity="0.6" />
        <rect x="52" y="10" width="18" height="12" rx="2" fill={accentColor} opacity="0.3" />
        <rect x="10" y="31" width="18" height="20" rx="2" fill={accentColor} opacity="0.5" />
        <rect x="31" y="38" width="18" height="13" rx="2" fill={accentColor} opacity="0.4" />
        <rect x="52" y="25" width="18" height="26" rx="2" fill={accentColor} opacity="0.6" />
        <rect x="10" y="54" width="18" height="16" rx="2" fill={accentColor} opacity="0.3" />
        <rect x="31" y="54" width="18" height="10" rx="2" fill={accentColor} opacity="0.5" />
      </svg>
    );
  }

  // centered-minimal
  return (
    <svg className="h-20 w-20" viewBox="0 0 80 80" fill="none">
      <rect x="5" y="15" width="70" height="3" rx="1" fill={accentColor} opacity="0.5" />
      <rect x="20" y="25" width="40" height="8" rx="2" fill="#1B4332" />
      <rect x="25" y="37" width="30" height="3" rx="1" fill="#9CA3AF" />
      <rect x="15" y="50" width="22" height="16" rx="2" fill={accentColor} opacity="0.3" />
      <rect x="40" y="50" width="22" height="16" rx="2" fill={accentColor} opacity="0.3" />
    </svg>
  );
}

export { TemplatePreviewIcon };
