// @ts-nocheck
"use client";

import { useEffect, useState } from "react";

import { createOptionalClient } from "@/lib/supabase/client";

export function useRealtimeRecord<T extends object>(
  table: string,
  initialData: T,
  idKey = "id"
) {
  const [record, setRecord] = useState<T>(initialData);

  useEffect(() => {
    const supabase = createOptionalClient();
    if (!supabase) return;

    const rowId = (initialData as Record<string, unknown>)[idKey];
    if (!rowId) return;

    const channel = supabase
      .channel(`record:${table}:${rowId}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: `${idKey}=eq.${rowId}`,
        },
        (payload: { eventType: string; new: T }) => {
          if (payload.eventType === "DELETE") return;
          setRecord(payload.new);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [table, idKey]);

  return record;
}
