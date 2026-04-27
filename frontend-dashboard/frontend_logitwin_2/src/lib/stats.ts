/**
 * stats.ts
 *
 * Calcula os KPIs e métricas agregadas a partir da lista de pedidos.
 */

import type { Order, DashboardStats } from "@/types";

export function computeDashboardStats(orders: Order[]): DashboardStats {
  const totalDeliveries = orders.reduce(
    (s, o) => s + o.deliveries.length,
    0
  );

  // 🔥 Agora está em TONELADAS (igual ao backend)
  const totalWeight = orders.reduce(
    (s, o) => s + o.totalWeight,
    0
  );

  const containerSet = new Set(
    orders
      .flatMap((o) => o.deliveries.map((d) => d.container))
      .filter((c): c is string => c !== null && c !== "")
  );

  const locationSet = new Set(
    orders
      .flatMap((o) => o.deliveries.map((d) => d.location))
      .filter((l) => l && l !== "—")
  );

  const ordersInTransit = orders.filter(
    (o) => o.status === "in-transit"
  ).length;

  const ordersDelivered = orders.filter(
    (o) => o.status === "delivered"
  ).length;

  const ordersPending = orders.filter(
    (o) => o.status === "pending"
  ).length;

  return {
    totalOrders: orders.length,
    totalDeliveries,
    totalWeight, // 🔥 agora sem "Kg"
    activeContainers: containerSet.size,
    uniqueLocations: locationSet.size,
    avgWeightPerOrder:
      orders.length > 0 ? totalWeight / orders.length : 0,
    ordersInTransit,
    ordersDelivered,
    ordersPending,
  };
}

// ─── Formatadores ─────────────────────────────────────────────

/** Formata peso em TONELADAS (padrão do backend) */
export function formatWeight(weight: number, decimals = 1): string {
  return `${weight.toFixed(decimals)} t`;
}

/** Formata data SEM BUG de timezone */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";

  // 🔥 evita bug de fuso horário
  const [year, month, day] = dateStr.split("-");

  const months = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez"
  ];

  return `${day} de ${months[Number(month) - 1]}. de ${year}`;
}

/** Agrupa peso por localização */
export function groupWeightByLocation(
  orders: Order[]
): Array<{ location: string; weight: number }> {
  const map: Record<string, number> = {};

  orders.forEach((o) =>
    o.deliveries.forEach((d) => {
      if (d.location && d.location !== "—") {
        map[d.location] = (map[d.location] ?? 0) + d.weight;
      }
    })
  );

  return Object.entries(map)
    .map(([location, weight]) => ({ location, weight }))
    .sort((a, b) => b.weight - a.weight);
}

// ─── Inteligência de Pendentes ────────────────────────────────

/** Calcula quantos dias um pedido está pendente desde sua criação */
export function getPendingDays(order: Order): number {
  if (order.status !== "pending" || !order.createdAt) return 0;
  const created = new Date(order.createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Retorna o nível de alerta para um pedido pendente baseado em sua idade:
 * - "none"     → pedido não é pendente ou tem < 7 dias
 * - "warning"  → pendente há 7–29 dias (atenção)
 * - "critical" → pendente há 30+ dias (ação imediata)
 */
export function getPendingAlertLevel(order: Order): "none" | "warning" | "critical" {
  const days = getPendingDays(order);
  if (days === 0) return "none";
  if (days >= 30) return "critical";
  if (days >= 7) return "warning";
  return "none";
}

/** Top pedidos por peso */
export function topOrdersByWeight(
  orders: Order[],
  limit = 8
): Array<{ label: string; weight: number }> {
  return [...orders]
    .sort((a, b) => b.totalWeight - a.totalWeight)
    .slice(0, limit)
    .map((o) => ({
      label: `#${o.orderNumber?.replace(/^0+/, "") ?? "N/A"}`,
      weight: Number(o.totalWeight.toFixed(1)),
    }));
}