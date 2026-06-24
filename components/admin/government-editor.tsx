// @ts-nocheck
'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, Trash2, LayoutGrid, LayoutList } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import type { GovernmentMember } from '@/lib/content/default-data';

interface GovernmentEditorProps {
  value: GovernmentMember[];
  onChange: (value: GovernmentMember[]) => void;
}

// Types
interface LeaderData {
  name: string;
  role: string;
  photoUrl?: string;
}

interface StaffCategory {
  id: string;
  categoryName: string;
  direction: 'horizontal' | 'vertical';
  staff: StaffMember[];
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
}

export function GovernmentEditor({ value, onChange }: GovernmentEditorProps) {
  const [kades, setKades] = useState<LeaderData>(() => {
    const found = value.find(v =>
      v.role.toLowerCase().includes('kepala desa') ||
      v.role.toLowerCase().includes('kades')
    );
    return found ? { name: found.name, role: found.role, photoUrl: found.area } : { name: '', role: 'Kepala Desa' };
  });

  const [wakades, setWakades] = useState<LeaderData>(() => {
    const found = value.find(v =>
      v.role.toLowerCase().includes('wakil kepala desa') ||
      v.role.toLowerCase().includes('wakades') ||
      v.role.toLowerCase().includes('sekretaris')
    );
    return found
      ? { name: found.name, role: found.role, photoUrl: found.area }
      : { name: '', role: 'Sekretaris Desa' };
  });

  const [staffCategories, setStaffCategories] = useState<StaffCategory[]>(() => {
    const staff = value.filter(v =>
      !v.role.toLowerCase().includes('kepala desa') &&
      !v.role.toLowerCase().includes('kades') &&
      !v.role.toLowerCase().includes('wakil kepala desa') &&
      !v.role.toLowerCase().includes('wakades') &&
      !v.role.toLowerCase().includes('sekretaris')
    );

    const categoryMap = new Map<string, StaffMember[]>();
    staff.forEach(s => {
      const catName = s.area || 'Lainnya';
      if (!categoryMap.has(catName)) {
        categoryMap.set(catName, []);
      }
      categoryMap.get(catName)!.push({
        id: crypto.randomUUID(),
        name: s.name,
        role: s.role,
      });
    });

    if (categoryMap.size === 0) {
      categoryMap.set('Kaur', []);
      categoryMap.set('Kasi', []);
      categoryMap.set('Staf', []);
    }

    return Array.from(categoryMap.entries()).map(([name, members]) => ({
      id: crypto.randomUUID(),
      categoryName: name,
      direction: 'horizontal' as const,
      staff: members,
    }));
  });

  const kadesFileRef = useRef<HTMLInputElement>(null);
  const wakadesFileRef = useRef<HTMLInputElement>(null);
  const [kadesPreview, setKadesPreview] = useState<string | null>(null);
  const [wakadesPreview, setWakadesPreview] = useState<string | null>(null);

  // Track pending uploads
  const [isKadesUploading, setIsKadesUploading] = useState(false);
  const [isWakadesUploading, setIsWakadesUploading] = useState(false);

  // Upload photo to server and get URL
  async function uploadPhoto(file: File, prefix: string): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prefix', prefix);

    try {
      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }

  // Sync state to parent - this ensures the parent always has the latest data
  const syncToParent = useCallback(() => {
    const result: GovernmentMember[] = [];

    if (kades.name) {
      result.push({ name: kades.name, role: kades.role, area: kades.photoUrl || '' });
    }
    if (wakades.name || wakades.photoUrl) {
      result.push({ name: wakades.name, role: wakades.role, area: wakades.photoUrl || '' });
    }
    staffCategories.forEach(cat => {
      cat.staff.forEach(s => {
        if (s.name) {
          result.push({ name: s.name, role: s.role, area: cat.categoryName });
        }
      });
    });

    onChange(result);
  }, [kades, wakades, staffCategories, onChange]);

  // Update parent when state changes
  const updateValue = useCallback(() => {
    syncToParent();
  }, [syncToParent]);

  // Sync to parent whenever kades/wakades/staff changes
  useEffect(() => {
    const timer = setTimeout(() => syncToParent(), 0);
    return () => clearTimeout(timer);
  }, [syncToParent]);

  const handleKadesFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setKadesPreview(previewUrl);
    setIsKadesUploading(true);

    // Upload to server
    const uploadedUrl = await uploadPhoto(file, 'kades');

    if (uploadedUrl) {
      setKades(prev => ({ ...prev, photoUrl: uploadedUrl }));
      setKadesPreview(null); // Clear preview, use the actual uploaded URL
      toast.success('Foto KADES berhasil diupload');
    } else {
      toast.error('Gagal upload foto KADES');
      setKadesPreview(null); // Clear failed preview
    }

    setIsKadesUploading(false);
    updateValue();
  };

  const handleWakadesFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setWakadesPreview(previewUrl);
    setIsWakadesUploading(true);

    // Upload to server
    const uploadedUrl = await uploadPhoto(file, 'wakades');

    if (uploadedUrl) {
      setWakades(prev => ({ ...prev, photoUrl: uploadedUrl }));
      setWakadesPreview(null); // Clear preview, use the actual uploaded URL
      toast.success('Foto WAKADES berhasil diupload');
    } else {
      toast.error('Gagal upload foto WAKADES');
      setWakadesPreview(null); // Clear failed preview
    }

    setIsWakadesUploading(false);
    updateValue();
  };

  const addCategory = () => {
    setStaffCategories([...staffCategories, {
      id: crypto.randomUUID(),
      categoryName: '',
      direction: 'horizontal',
      staff: [],
    }]);
  };

  const removeCategory = (categoryId: string) => {
    setStaffCategories(staffCategories.filter(c => c.id !== categoryId));
    setTimeout(updateValue, 0);
  };

  const updateCategoryName = (categoryId: string, name: string) => {
    setStaffCategories(staffCategories.map(c =>
      c.id === categoryId ? { ...c, categoryName: name } : c
    ));
    setTimeout(updateValue, 0);
  };

  const updateCategoryDirection = (categoryId: string, direction: 'horizontal' | 'vertical') => {
    setStaffCategories(staffCategories.map(c =>
      c.id === categoryId ? { ...c, direction } : c
    ));
  };

  const addStaffToCategory = (categoryId: string) => {
    setStaffCategories(staffCategories.map(c =>
      c.id === categoryId
        ? { ...c, staff: [...c.staff, { id: crypto.randomUUID(), name: '', role: '' }] }
        : c
    ));
  };

  const removeStaffFromCategory = (categoryId: string, staffId: string) => {
    setStaffCategories(staffCategories.map(c =>
      c.id === categoryId
        ? { ...c, staff: c.staff.filter(s => s.id !== staffId) }
        : c
    ));
    setTimeout(updateValue, 0);
  };

  const updateStaffInCategory = (categoryId: string, staffId: string, field: 'name' | 'role', val: string) => {
    setStaffCategories(staffCategories.map(c =>
      c.id === categoryId
        ? {
            ...c,
            staff: c.staff.map(s =>
              s.id === staffId ? { ...s, [field]: val } : s
            ),
          }
        : c
    ));
    setTimeout(updateValue, 0);
  };

  return (
    <div className="space-y-8">
      {/* KADES Section */}
      <div className="rounded-xl border-2 border-[#1B4332]/30 bg-[#1B4332]/5 p-5">
        <h4 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-[#1B4332]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B4332] text-sm font-bold text-white">K</div>
          Kepala Desa (KADES)
        </h4>
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#1B4332] bg-white shadow-lg">
              {kadesPreview || kades.photoUrl ? (
                <img
                  src={kadesPreview || kades.photoUrl}
                  alt="KADES"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#1B4332]/30">
                  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              )}
            </div>
            <input
              ref={kadesFileRef}
              type="file"
              accept="image/*"
              onChange={handleKadesFileChange}
              className="hidden"
              aria-label="Upload foto KADES"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isKadesUploading}
              onClick={() => kadesFileRef.current?.click()}
            >
              {isKadesUploading ? 'Mengupload...' : kadesPreview || kades.photoUrl ? 'Ganti Foto' : 'Pilih Foto'}
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Nama Lengkap">
                <Input
                  value={kades.name}
                  onChange={(e) => {
                    setKades({ ...kades, name: e.target.value });
                    setTimeout(updateValue, 0);
                  }}
                  placeholder="Nama KADES"
                />
              </FormField>
              <FormField label="Jabatan">
                <Input
                  value={kades.role}
                  onChange={(e) => {
                    setKades({ ...kades, role: e.target.value });
                    setTimeout(updateValue, 0);
                  }}
                  placeholder="Kepala Desa"
                />
              </FormField>
            </div>
          </div>
        </div>
      </div>

      {/* WAKADES Section */}
      <div className="rounded-xl border-2 border-[#40916C]/30 bg-[#40916C]/5 p-5">
        <h4 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-[#40916C]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#40916C] text-sm font-bold text-white">W</div>
          Wakil Kepala Desa (WAKADES)
        </h4>
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-[#40916C] bg-white shadow-lg">
              {wakadesPreview || wakades.photoUrl ? (
                <img
                  src={wakadesPreview || wakades.photoUrl}
                  alt="WAKADES"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#40916C]/30">
                  <svg className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              )}
            </div>
            <input
              ref={wakadesFileRef}
              type="file"
              accept="image/*"
              onChange={handleWakadesFileChange}
              className="hidden"
              aria-label="Upload foto WAKADES"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isWakadesUploading}
              onClick={() => wakadesFileRef.current?.click()}
            >
              {isWakadesUploading ? 'Mengupload...' : wakadesPreview || wakades.photoUrl ? 'Ganti Foto' : 'Pilih Foto'}
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Nama Lengkap">
                <Input
                  value={wakades.name}
                  onChange={(e) => {
                    setWakades({ ...wakades, name: e.target.value });
                    setTimeout(updateValue, 0);
                  }}
                  placeholder="Nama WAKADES"
                />
              </FormField>
              <FormField label="Jabatan">
                <Input
                  value={wakades.role}
                  onChange={(e) => {
                    setWakades({ ...wakades, role: e.target.value });
                    setTimeout(updateValue, 0);
                  }}
                  placeholder="Sekretaris Desa"
                />
              </FormField>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Categories */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-heading text-lg font-bold text-zinc-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            Perangkat Desa
          </h4>
          <Button type="button" variant="outline" size="sm" onClick={addCategory}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah Kategori
          </Button>
        </div>

        {staffCategories.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-zinc-200 py-8 text-center">
            <p className="text-sm text-zinc-500">Belum ada kategori.</p>
          </div>
        )}

        <div className="mt-4 space-y-6">
          {staffCategories.map((category) => (
            <div key={category.id} className="rounded-lg border border-zinc-200 bg-zinc-50">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B4332] text-sm font-bold text-white">
                    {category.categoryName.charAt(0).toUpperCase() || '?'}
                  </div>
                  <input
                    type="text"
                    value={category.categoryName}
                    onChange={(e) => updateCategoryName(category.id, e.target.value)}
                    placeholder="Nama Kategori (cth: Kaur)"
                    aria-label="Nama Kategori"
                    className="rounded-md border border-transparent bg-transparent px-2 py-1 font-semibold text-[#1B4332] hover:border-zinc-300 hover:bg-white focus:border-[#40916C] focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-zinc-200 bg-white">
                    <button
                      type="button"
                      onClick={() => updateCategoryDirection(category.id, 'horizontal')}
                      className={`flex items-center gap-1 rounded-l-lg px-3 py-1.5 text-xs transition-colors ${
                        category.direction === 'horizontal'
                          ? 'bg-[#40916C] text-white'
                          : 'text-zinc-500 hover:bg-zinc-100'
                      }`}
                    >
                      <LayoutGrid className="h-3 w-3" />
                      <span className="hidden sm:inline">Mendatar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCategoryDirection(category.id, 'vertical')}
                      className={`flex items-center gap-1 rounded-r-lg px-3 py-1.5 text-xs transition-colors ${
                        category.direction === 'vertical'
                          ? 'bg-[#40916C] text-white'
                          : 'text-zinc-500 hover:bg-zinc-100'
                      }`}
                    >
                      <LayoutList className="h-3 w-3" />
                      <span className="hidden sm:inline">Menurun</span>
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCategory(category.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t border-zinc-200 bg-white p-4">
                <div className="mb-4 flex justify-center">
                  <div className="h-4 w-0.5 bg-[#40916C]" />
                </div>

                <div
                  className={category.direction === 'horizontal'
                    ? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3'
                    : 'space-y-3'
                  }
                >
                  {category.staff.map((staff) => (
                    <div key={staff.id} className="group relative flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 hover:border-[#40916C]">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-500">
                        {staff.role.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          value={staff.name}
                          onChange={(e) => updateStaffInCategory(category.id, staff.id, 'name', e.target.value)}
                          placeholder="Nama Staff"
                          className="font-medium"
                        />
                        <Input
                          value={staff.role}
                          onChange={(e) => updateStaffInCategory(category.id, staff.id, 'role', e.target.value)}
                          placeholder="Jabatan (cth: Kaur Keuangan)"
                          className="text-sm text-zinc-600"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStaffFromCategory(category.id, staff.id)}
                        className="mt-1 text-red-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addStaffToCategory(category.id)}
                  className="mt-4 w-full border-2 border-dashed border-zinc-200 text-zinc-500 hover:border-[#40916C] hover:text-[#40916C]"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Tambah {category.categoryName || 'Staff'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
