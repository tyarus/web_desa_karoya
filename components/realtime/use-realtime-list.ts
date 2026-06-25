"use client";

import { useEffect, useState, useMemo } from "react";

import type { Database, Tables } from "@/lib/database.types";
import { createOptionalClient } from "@/lib/supabase/client";

type TableName = keyof Database["public"]["Tables"];

function applyOptions<T extends Tables<TableName>>(
  items: T[],
  options?: {
    predicate?: (row: T) => boolean;
    sort?: (a: T, b: T) => number;
  }
): T[] {
  const filtered = options?.predicate ? items.filter(options.predicate) : items;
  return options?.sort ? [...filtered].sort(options.sort) : filtered;
}

export function useRealtimeList<TName extends TableName>(
  table: TName,
  initialData: Tables<TName>[],
  options?: {
    predicate?: (row: Tables<TName>) => boolean;
    sort?: (a: Tables<TName>, b: Tables<TName>) => number;
  }
) {
  // Apply options immediately on initial data
  const [rows, setRows] = useState(() => applyOptions(initialData, options));

  // Memoize options for dependency comparison
  const optionsKey = useMemo(
    () => JSON.stringify(options),
    [options?.predicate, options?.sort]
  );

  useEffect(() => {
    const supabase = createOptionalClient();
    if (!supabase) return;

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
                options
              );
            }

            const nextRow = payload.new as Tables<TName>;
            const exists = current.some((row) => row.id === nextRow.id);
            const nextRows = exists
              ? current.map((row) => (row.id === nextRow.id ? nextRow : row))
              : [nextRow, ...current];

            return applyOptions(nextRows, options);
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [table, optionsKey]);

  return rows;
}
