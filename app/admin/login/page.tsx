import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const params = await searchParams;
  const setupMissing = params.setup === "supabase" || !isSupabaseConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-4 py-10">
      <AdminLoginForm setupMissing={setupMissing} />
    </main>
  );
}
