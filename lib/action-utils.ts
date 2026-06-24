import type { ZodError } from "zod";

export function flattenFieldErrors(error: ZodError) {
  const flattened = error.flatten().fieldErrors;
  const result: Record<string, string[]> = {};

  Object.entries(flattened).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) result[key] = value;
  });

  return result;
}

export function formString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export function formOptionalString(value: FormDataEntryValue | null) {
  const text = formString(value).trim();
  return text.length > 0 ? text : undefined;
}

export function formFile(value: FormDataEntryValue | null) {
  if (value instanceof File && value.size > 0) return value;
  return null;
}
