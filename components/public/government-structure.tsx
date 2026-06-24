'use client';

/* eslint-disable @next/next/no-img-element */

import type { GovernmentMember } from '@/lib/content/default-data';

interface GovernmentStructureProps {
  government: GovernmentMember[];
}

// Types
interface LeaderPosition {
  name: string;
  role: string;
  photo?: string;
}

interface StaffCategory {
  name: string;
  direction: 'horizontal' | 'vertical';
  members: { name: string; role: string }[];
}

interface GovernmentStructure {
  kades?: LeaderPosition;
  wakades?: LeaderPosition;
  categories: StaffCategory[];
}

export function GovernmentStructure({ government }: GovernmentStructureProps) {
  // Parse government data
  const parseGovernment = (members: GovernmentMember[]): GovernmentStructure => {
    const kades = members.find(m =>
      m.role.toLowerCase().includes('kepala desa') ||
      m.role.toLowerCase().includes('kades')
    );

    const wakades = members.find(m =>
      m.role.toLowerCase().includes('wakil kepala desa') ||
      m.role.toLowerCase().includes('wakades') ||
      m.role.toLowerCase().includes('sekretaris')
    );

    const staff = members.filter(m =>
      !m.role.toLowerCase().includes('kepala desa') &&
      !m.role.toLowerCase().includes('kades') &&
      !m.role.toLowerCase().includes('wakil kepala desa') &&
      !m.role.toLowerCase().includes('wakades') &&
      !m.role.toLowerCase().includes('sekretaris')
    );

    const categoryMap = new Map<string, { name: string; role: string }[]>();
    staff.forEach(s => {
      const catName = s.area || 'Lainnya';
      if (!categoryMap.has(catName)) {
        categoryMap.set(catName, []);
      }
      categoryMap.get(catName)!.push({ name: s.name, role: s.role });
    });

    const categories: StaffCategory[] = Array.from(categoryMap.entries()).map(([name, members]) => ({
      name,
      direction: 'horizontal',
      members,
    }));

    return {
      kades: kades ? { name: kades.name, role: kades.role, photo: kades.area } : undefined,
      wakades: wakades ? { name: wakades.name, role: wakades.role, photo: wakades.area } : undefined,
      categories,
    };
  };

  const structure = parseGovernment(government);

  return (
    <div className="space-y-8">
      {/* Leader Section - KADES & WAKADES */}
      {(structure.kades || structure.wakades) && (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          {/* KADES */}
          {structure.kades && (
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-[#1B4332] bg-[#E9F5EE] shadow-lg">
                  {structure.kades.photo && !structure.kades.photo.startsWith('blob:') ? (
                    <img src={structure.kades.photo} alt={structure.kades.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg className="h-14 w-14 text-[#1B4332]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#1B4332] px-3 py-1 text-xs font-bold text-white shadow">
                  KADES
                </div>
              </div>
              <div className="mt-6">
                <p className="font-heading text-base font-bold text-[#1B4332]">{structure.kades.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{structure.kades.role}</p>
              </div>
            </div>
          )}

          {/* Connector */}
          {structure.kades && structure.wakades && (
            <div className="hidden h-px w-12 bg-zinc-300 sm:block" />
          )}

          {/* WAKADES */}
          {structure.wakades && (
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#40916C] bg-[#E9F5EE] shadow-lg">
                  {structure.wakades.photo && !structure.wakades.photo.startsWith('blob:') ? (
                    <img src={structure.wakades.photo} alt={structure.wakades.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg className="h-12 w-12 text-[#40916C]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#40916C] px-3 py-1 text-xs font-bold text-white shadow">
                  WAKADES
                </div>
              </div>
              <div className="mt-5">
                <p className="font-heading text-sm font-bold text-[#40916C]">{structure.wakades.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{structure.wakades.role}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connector to staff */}
      {(structure.kades || structure.wakades) && structure.categories.length > 0 && (
        <div className="flex justify-center">
          <div className="h-6 w-0.5 rounded-full bg-gradient-to-b from-[#40916C] to-[#40916C]/50" />
        </div>
      )}

      {/* Staff Categories - Improved Layout */}
      {structure.categories.length > 0 && (
        <div className="space-y-8">
          {structure.categories.map((category, catIndex) => (
            <CategorySection key={catIndex} category={category} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {structure.categories.length === 0 && !structure.kades && !structure.wakades && (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-12 text-center">
          <svg className="mx-auto h-12 w-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          <p className="mt-3 text-sm text-zinc-500">Belum ada data struktur pemerintahan</p>
        </div>
      )}
    </div>
  );
}

// Improved Category Section
interface CategorySectionProps {
  category: StaffCategory;
}

function CategorySection({ category }: CategorySectionProps) {
  return (
    <div className="w-full">
      {/* Category Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex flex-col items-center gap-3">
          {/* Top connector */}
          <div className="h-6 w-0.5 rounded-full bg-[#40916C]/40" />

          {/* Logo Circle */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#40916C] bg-white shadow-md">
            <span className="text-xl font-bold text-[#40916C]">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Category Name Badge */}
          <div className="rounded-full bg-[#40916C]/10 px-5 py-2">
            <span className="text-sm font-semibold text-[#40916C]">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="flex flex-wrap justify-center gap-4">
        {category.members.map((member, index) => (
          <StaffCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
}

// Improved Staff Card
interface StaffCardProps {
  member: { name: string; role: string };
}

function StaffCard({ member }: StaffCardProps) {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-[#40916C] hover:shadow-md sm:w-auto sm:min-w-[200px]">
      {/* Avatar */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E9F5EE]">
        <span className="text-sm font-bold text-[#1B4332]">
          {member.role.split(' ').map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[#1B4332]">{member.role}</p>
        <p className="truncate text-sm text-zinc-500">{member.name}</p>
      </div>
    </div>
  );
}
