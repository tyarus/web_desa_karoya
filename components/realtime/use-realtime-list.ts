"use client";

import { useEffect, useState } from "react";

import type { Database, Tables } from "@/lib/database.types";
import { createOptionalClient } from "@/lib/supabase/client";

type TableName = keyof Database["public"]["Tables"];

export function useRealtimeList<TName extends TableName>(
  table: TName,
  initialData: Tables<TName>[],
  options?: {
    predicate?: (row: Tables<TName>) => boolean;
    sort?: (a: Tables<TName>, b: Tables<TName>) => number;
  },
) {
  const [rows, setRows] = useState(initialData);

  useEffect(() => {
    const supabase = createOptionalClient();
    if (!supabase) return;

    const applyOptions = (items: Tables<TName>[]) => {
      const filtered = options?.predicate
        ? items.filter(options.predicate)
        : items;
      return options?.sort ? [...filtered].sort(options.sort) : filtered;
    };

    const channel = supabase
      .channel(`list:${String(table)}:${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: String(table) },
        (payload) => {
          setRows((current) => {
            if (payload.eventType === "DELETE") {
              return applyOptions(
                current.filter((row) => row.id !== payload.old.id),
              );
            }

            const nextRow = payload.new as Tables<TName>;
            const exists = current.some((row) => row.id === nextRow.id);
            const nextRows = exists
              ? current.map((row) => (row.id === nextRow.id ? nextRow : row))
              : [nextRow, ...current];

            return applyOptions(nextRows);
          });
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [options, table]);

  return rows;
}
