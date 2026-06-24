"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitServiceRequest } from "@/app/(public)/layanan/actions";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/lib/database.types";
import {
  serviceRequestSchema,
  type ServiceRequestInput,
} from "@/lib/validations";

export function ServiceRequestForm({
  services,
}: {
  services: Tables<"services">[];
}) {
  const [pending, startTransition] = useTransition();
  const form = useForm<ServiceRequestInput>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      service_type: services[0]?.title ?? "",
      resident_name: "",
      nik: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  function onSubmit(values: ServiceRequestInput) {
    startTransition(async () => {
      const result = await submitServiceRequest(values);

      if (result.ok) {
        toast.success(result.message);
        form.reset({
          service_type: services[0]?.title ?? "",
          resident_name: "",
          nik: "",
          phone: "",
          address: "",
          notes: "",
        });
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-xl border border-zinc-200 bg-white p-6"
    >
      <h2 className="font-heading text-xl font-bold text-[#1B4332]">
        Form Pengajuan Surat
      </h2>
      <div className="mt-5 grid gap-4">
        <FormField
          label="Jenis layanan"
          error={form.formState.errors.service_type?.message}
        >
          <Select {...form.register("service_type")}>
            {services.map((service) => (
              <option key={service.id} value={service.title}>
                {service.title}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField
          label="Nama lengkap"
          error={form.formState.errors.resident_name?.message}
        >
          <Input {...form.register("resident_name")} />
        </FormField>
        <FormField label="NIK" error={form.formState.errors.nik?.message}>
          <Input inputMode="numeric" maxLength={16} {...form.register("nik")} />
        </FormField>
        <FormField
          label="Nomor kontak"
          error={form.formState.errors.phone?.message}
        >
          <Input {...form.register("phone")} />
        </FormField>
        <FormField
          label="Alamat"
          error={form.formState.errors.address?.message}
        >
          <Textarea rows={3} {...form.register("address")} />
        </FormField>
        <FormField label="Catatan" error={form.formState.errors.notes?.message}>
          <Textarea rows={3} {...form.register("notes")} />
        </FormField>
      </div>
      <Button type="submit" disabled={pending} className="mt-5 w-full">
        <Send className="size-4" />
        {pending ? "Mengirim..." : "Kirim Pengajuan"}
      </Button>
    </form>
  );
}
