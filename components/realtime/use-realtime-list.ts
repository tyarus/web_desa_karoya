"use client";

import { useEffect, useState } from "react";

import { createOptionalClient } from "@/lib/supabase/client";

export function useRealtimeList<T extends { id: string }>(
  table: string,
  initialData: T[] | null | undefined,
  options?: {
    predicate?: (row: T) => boolean;
    sort?: (a: T, b: T) => number;
  }
) {
  const [rows, setRows] = useState<T[]>(() => {
    const data = Array.isArray(initialData) ? initialData : [];
    let result = [...data];
    if (options?.predicate) {
      result = result.filter(options.predicate);
    }
    if (options?.sort) {
      result.sort(options.sort);
    }
    return result;
  });

  useEffect(() => {
    const supabase = createOptionalClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`list:${table}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload: { eventType: string; old?: { id: string }; new: T }
      ) => {
        setRows((current) => {
          if (payload.eventType === "DELETE" && payload.old) {
            return current.filter((row) => row.id !== payload.old!.id);
          }

          const nextRow = payload.new as T;
          const exists = current.some((row) => row.id === nextRow.id);

          let nextRows: T[];
          if (exists) {
            nextRows = current.map((row) => (row.id === nextRow.id ? nextRow : row));
          } else {
            nextRows = [nextRow, ...current];
          }

          // Apply filter
          if (options?.predicate) {
            nextRows = nextRows.filter(options.predicate);
          }
          // Apply sort
          if (options?.sort) {
            nextRows.sort(options.sort);
          }

          return nextRows;
        });
      }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [table]);

  return rows;
}
