import {
  defaultGallery,
  defaultHome,
  defaultMessages,
  defaultPosts,
  defaultProfile,
  defaultServiceRequests,
  defaultServices,
  defaultSettings,
} from "@/lib/content/default-data";
import type { Tables } from "@/lib/database.types";
import { createOptionalClient } from "@/lib/supabase/server";

export async function getVillageSettings() {
  const supabase = await createOptionalClient();
  if (!supabase) return defaultSettings;

  const { data } = await supabase
    .from("village_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  return data ?? defaultSettings;
}

export async function getHomeContent() {
  const supabase = await createOptionalClient();
  if (!supabase) return defaultHome;

  const { data } = await supabase
    .from("home_sections")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  return data ?? defaultHome;
}

export async function getProfileContent() {
  const supabase = await createOptionalClient();
  if (!supabase) return defaultProfile;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  return data ?? defaultProfile;
}

export async function getPublishedPosts() {
  const supabase = await createOptionalClient();
  if (!supabase) return defaultPosts;

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return data?.length ? data : defaultPosts;
}

export async function getAllPosts() {
  const supabase = await createOptionalClient();
  if (!supabase) return defaultPosts;

  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? defaultPosts;
}

export async function getPostBySlug(slug: string) {
  const supabase = await createOptionalClient();
  if (!supabase) {
    return defaultPosts.find((post) => post.slug === slug) ?? null;
  }

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return data ?? defaultPosts.find((post) => post.slug === slug) ?? null;
}

export async function getServices() {
  const supabase = await createOptionalClient();
  if (!supabase) return defaultServices;

  const { data } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true });

  return data?.length ? data : defaultServices;
}

export async function getGallery() {
  const supabase = await createOptionalClient();
  if (!supabase) return defaultGallery;

  const { data } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  return data?.length ? data : defaultGallery;
}

export async function getServiceRequests() {
  const supabase = await createOptionalClient();
  if (!supabase) return defaultServiceRequests;

  const { data } = await supabase
    .from("service_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? defaultServiceRequests;
}

export async function getContactMessages() {
  const supabase = await createOptionalClient();
  if (!supabase) return defaultMessages;

  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? defaultMessages;
}

export type SiteData = {
  settings: Tables<"village_settings">;
  home: Tables<"home_sections">;
  posts: Tables<"posts">[];
  services: Tables<"services">[];
  gallery: Tables<"gallery">[];
};

export async function getSiteData(): Promise<SiteData> {
  const [settings, home, posts, services, gallery] = await Promise.all([
    getVillageSettings(),
    getHomeContent(),
    getPublishedPosts(),
    getServices(),
    getGallery(),
  ]);

  return {
    settings,
    home,
    posts,
    services,
    gallery,
  };
}
