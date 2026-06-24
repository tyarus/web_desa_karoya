import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const envPath = resolve(process.cwd(), ".env.local");

function readEnvFile(path) {
  if (!existsSync(path)) return {};

  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^"|"$/g, "");
        return [key, value];
      }),
  );
}

const fileEnv = readEnvFile(envPath);
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || fileEnv.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  fileEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  fileEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bucket =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
  fileEnv.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
  "desa-karoya";

const checks = [
  "village_settings",
  "home_sections",
  "profiles",
  "posts",
  "services",
  "service_requests",
  "gallery",
  "contact_messages",
];

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase belum dikonfigurasi.");
  console.error("Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di .env.local.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

let hasError = false;

console.log("Memeriksa koneksi Supabase...");
console.log(`Project: ${supabaseUrl}`);
console.log(`Bucket: ${bucket}`);

for (const table of checks) {
  const { error } = await supabase.from(table).select("*").limit(1);

  if (error) {
    hasError = true;
    console.error(`x ${table}: ${error.message}`);
  } else {
    console.log(`✓ ${table}`);
  }
}

const { data: bucketData, error: bucketError } =
  await supabase.storage.getBucket(bucket);

if (bucketError) {
  hasError = true;
  console.error(`x storage bucket "${bucket}": ${bucketError.message}`);
} else {
  console.log(`✓ storage bucket "${bucket}" (${bucketData.public ? "public" : "private"})`);
}

if (hasError) {
  console.error("Setup belum lengkap. Jalankan supabase/schema.sql di SQL Editor lalu coba lagi.");
  process.exit(1);
}

console.log("Supabase siap dipakai oleh website Desa Karoya.");
