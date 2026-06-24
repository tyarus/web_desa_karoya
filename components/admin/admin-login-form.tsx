"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { loginAdmin } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/lib/validations";

export function AdminLoginForm({ setupMissing }: { setupMissing: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await loginAdmin(values);

      if (result.ok) {
        toast.success(result.message);
        router.replace(searchParams.get("next") ?? "/admin");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div>
        <p className="font-heading text-2xl font-bold text-[#1B4332]">
          Masuk Admin
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Gunakan email dan password Supabase Auth yang terdaftar sebagai admin.
        </p>
      </div>
      {setupMissing ? (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
          Kredensial Supabase belum diisi. Salin `.env.example` menjadi
          `.env.local`, lalu isi URL dan publishable key.
        </div>
      ) : null}
      <div className="mt-6 grid gap-4">
        <FormField label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" {...form.register("email")} />
        </FormField>
        <FormField
          label="Password"
          error={form.formState.errors.password?.message}
        >
          <Input type="password" {...form.register("password")} />
        </FormField>
      </div>
      <Button type="submit" disabled={pending || setupMissing} className="mt-6 w-full">
        <LogIn className="size-4" />
        {pending ? "Memeriksa..." : "Masuk"}
      </Button>
    </form>
  );
}
