"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { sendContactMessage } from "@/app/(public)/kontak/actions";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactInput } from "@/lib/validations";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: ContactInput) {
    startTransition(async () => {
      const result = await sendContactMessage(values);

      if (result.ok) {
        toast.success(result.message);
        form.reset();
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
        Kirim Pesan
      </h2>
      <div className="mt-5 grid gap-4">
        <FormField label="Nama" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} />
        </FormField>
        <FormField label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" {...form.register("email")} />
        </FormField>
        <FormField label="Nomor kontak" error={form.formState.errors.phone?.message}>
          <Input {...form.register("phone")} />
        </FormField>
        <FormField label="Pesan" error={form.formState.errors.message?.message}>
          <Textarea rows={5} {...form.register("message")} />
        </FormField>
      </div>
      <Button type="submit" disabled={pending} className="mt-5 w-full">
        <Send className="size-4" />
        {pending ? "Mengirim..." : "Kirim Pesan"}
      </Button>
    </form>
  );
}
