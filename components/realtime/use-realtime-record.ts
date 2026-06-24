"use client";

import { useEffect, useState } from "react";

import type { Database, Tables } from "@/lib/database.types";
import { createOptionalClient } from "@/lib/supabase/client";

type TableName = keyof Database["public"]["Tables"];

export function useRealtimeRecord<TName extends TableName>(
  table: TName,
  initialData: Tables<TName>,
  id = "default",
) {
  const [record, setRecord] = useState(initialData);

  useEffect(() => {
    const supabase = createOptionalClient();
    if (!supabase) return;

    const channelId = `record:${String(table)}:${id}:${crypto.randomUUID()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: String(table),
          filter: `id=eq.${id}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") return;
          setRecord(payload.new as Tables<TName>);
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [id, table]);

  return record;
}
