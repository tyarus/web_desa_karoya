import {
  defaultFeaturedServices,
  defaultGovernment,
  defaultStats,
  type FeaturedServiceItem,
  type GovernmentMember,
  type StatItem,
} from "@/lib/content/default-data";
import type { Json } from "@/lib/database.types";

function isJsonObject(value: unknown): value is Record<string, Json | undefined> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseStats(value: Json | null): StatItem[] {
  if (!Array.isArray(value)) return defaultStats;

  const items = value.filter(isJsonObject).map((item) => ({
    label: String(item.label ?? ""),
    value: String(item.value ?? ""),
    helper: String(item.helper ?? ""),
  }));

  return items.length > 0 ? items : defaultStats;
}

export function parseFeaturedServices(
  value: Json | null,
): FeaturedServiceItem[] {
  if (!Array.isArray(value)) return defaultFeaturedServices;

  const items = value.filter(isJsonObject).map((item) => ({
    title: String(item.title ?? ""),
    description: String(item.description ?? ""),
    href: String(item.href ?? "/layanan"),
  }));

  return items.length > 0 ? items : defaultFeaturedServices;
}

export function parseGovernment(value: Json | null): GovernmentMember[] {
  if (!Array.isArray(value)) return defaultGovernment;

  const items = value.filter(isJsonObject).map((item) => ({
    name: String(item.name ?? ""),
    role: String(item.role ?? ""),
    area: String(item.area ?? ""),
  }));

  return items.length > 0 ? items : defaultGovernment;
}
