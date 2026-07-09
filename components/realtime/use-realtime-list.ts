"use client";

import { useEffect, useRef, useState } from "react";

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

  // Track if component is mounted to avoid state updates after unmount
  const isMounted = useRef(true);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);

  // Keep track of the latest initialData to avoid stale closures
  const initialDataRef = useRef(initialData);
  const optionsRef = useRef(options);

  // Update refs when props change
  useEffect(() => {
    initialDataRef.current = initialData;
    optionsRef.current = options;
  }, [initialData, options]);

  // Sync with initialData when it changes (e.g., after navigation)
  useEffect(() => {
    const data = Array.isArray(initialData) ? initialData : [];
    let result = [...data];
    if (optionsRef.current?.predicate) {
      result = result.filter(optionsRef.current.predicate);
    }
    if (optionsRef.current?.sort) {
      result = result.slice().sort(optionsRef.current.sort);
    }
    if (isMounted.current) {
      setRows(result);
    }
  }, [initialData]);

  // Enable realtime after initial mount
  useEffect(() => {
    isMounted.current = true;
    setRealtimeEnabled(true);

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Don't setup realtime until component is fully mounted
    if (!realtimeEnabled) return;

    let channel: ReturnType<ReturnType<typeof createOptionalClient>['channel']> | null = null;

    try {
      const supabase = createOptionalClient();
      if (!supabase) {
        console.warn('Supabase not configured, realtime disabled for', table);
        return;
      }

      const channelName = `list:${table}:${Math.random().toString(36).slice(2)}`;

      channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload: { eventType: string; old?: { id: string }; new: T }) => {
            if (!isMounted.current) return;

            setRows((current) => {
              const predicate = optionsRef.current?.predicate;
              const sort = optionsRef.current?.sort;

              if (payload.eventType === "DELETE" && payload.old) {
                return current.filter((row) => row.id !== payload.old!.id);
              }

              const nextRow = payload.new as T;
              const exists = current.some((row) => row.id === nextRow.id);

              let nextRows: T[];
              if (exists) {
                nextRows = current.map((row) =>
                  row.id === nextRow.id ? nextRow : row
                );
              } else {
                nextRows = [nextRow, ...current];
              }

              // Apply filter
              if (predicate) {
                nextRows = nextRows.filter(predicate);
              }
              // Apply sort
              if (sort) {
                nextRows = nextRows.slice().sort(sort);
              }

              return nextRows;
            });
          }
        )
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            console.log('Realtime subscribed to', table);
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Realtime channel error for', table);
          } else if (status === 'TIMED_OUT') {
            console.warn('Realtime connection timed out for', table);
          }
        });
    } catch (error) {
      console.error('Failed to setup realtime for', table, error);
    }

    return () => {
      if (channel) {
        try {
          channel.unsubscribe();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [table, realtimeEnabled]);

  return rows;
}
