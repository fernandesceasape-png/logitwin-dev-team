"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SapSyncStatus } from "@/types";

const POLLING_INTERVAL_MS = 30_000;

interface UseSapSyncReturn {
  status: SapSyncStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSapSync(): UseSapSyncReturn {
  const [status,  setStatus]  = useState<SapSyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/sap/sync-status", {
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Erro HTTP ${res.status}`);
      }

      setStatus(await res.json());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      console.error("[useSapSync]", message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus(false);
    intervalRef.current = setInterval(() => fetchStatus(true), POLLING_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchStatus]);

  return { status, loading, error, refetch: () => fetchStatus(false) };
}
