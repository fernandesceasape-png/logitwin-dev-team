"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ContainerSuggestionsResponse } from "@/types";

const POLLING_INTERVAL_MS = 60_000;

interface UseContainerSuggestionsReturn {
  data: ContainerSuggestionsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContainerSuggestions(): UseContainerSuggestionsReturn {
  const [data,    setData]    = useState<ContainerSuggestionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/containers/suggestions", {
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Erro HTTP ${res.status}`);
      }

      setData(await res.json());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      console.error("[useContainerSuggestions]", message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(false);
    intervalRef.current = setInterval(() => fetchData(true), POLLING_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  return { data, loading, error, refetch: () => fetchData(false) };
}
