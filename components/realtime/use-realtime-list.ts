// @ts-nocheck
"use client";

import { useEffect, useState } from "react";

import { createOptionalClient } from "@/lib/supabase/client";

export function useRealtimeList<T>(
  table: string,
  initialData: T[] | null | undefined,
  options?: {
    predicate?: (row: T) => boolean;
    sort?: (a: T, b: T) => number;
  }
) {
  const [rows, setRows] = useState<T[]>(() => {
    // Apply options to initial data immediately
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

    const applyOptions = (items: T[]) => {
      let result = items;
      if (options?.predicate) {
        result = result.filter(options.predicate);
      }
      if (options?.sort) {
        result = [...result].sort(options.sort);
      }
      return result;
    };

    const channel = supabase
      .channel(`list:${table}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload: { eventType: string; old?: { id: string }; new: T }) => {
          setRows((current) => {
            if (payload.eventType === "DELETE" && payload.old) {
              return applyOptions(current.filter((row: T & { id: string }) => row.id !== payload.old!.id));
            }

            const nextRow = payload.new as T;
            const rowWithId = nextRow as T & { id: string };
            const exists = current.some((row: T & { id: string }) => row.id === rowWithId.id);
            const nextRows = exists
              ? current.map((row: T & { id: string }) => (row.id === rowWithId.id ? nextRow : row))
              : [nextRow, ...current];

            return applyOptions(nextRows);
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [table, options]);

  return rows;
}
