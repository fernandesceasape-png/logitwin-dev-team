/**
 * useOrders.ts
 *
 * Hook responsável por buscar e gerenciar os dados de pedidos.
 * Implementa polling automático com intervalo configurável.
 * Encapsula estados de loading, error e data.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Order, DashboardStats } from "@/types";
import { computeDashboardStats } from "@/lib/stats";

const POLLING_INTERVAL_MS = 15_000; // 15 segundos

interface UseOrdersReturn {
  orders: Order[];
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
}

export function useOrders(): UseOrdersReturn {
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [stats,       setStats]       = useState<DashboardStats | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Ref para evitar re-criação do interval a cada render
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Erro HTTP ${res.status}`);
      }

      const data: Order[] = await res.json();
      setOrders(data);
      setStats(computeDashboardStats(data));
      setLastUpdated(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      console.error("[useOrders]", message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Fetch inicial + setup de polling
  useEffect(() => {
    fetchOrders(false);

    intervalRef.current = setInterval(() => {
      fetchOrders(true); // silent: não mostra spinner nos refreshes automáticos
    }, POLLING_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchOrders]);

  return {
    orders,
    stats,
    loading,
    error,
    lastUpdated,
    refetch: () => fetchOrders(false),
  };
}