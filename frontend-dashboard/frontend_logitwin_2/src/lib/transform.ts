/**
 * transform.ts
 *
 * Camada de transformação do backend → domínio LogiTwin.
 * Adaptado para o formato REAL da API.
 */

import type {
  Order,
  Delivery,
  OrderStatus,
  BackendOrder,
  BackendDelivery,
} from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cleanLocation(location: string): string {
  return location?.trim() || "—";
}

function deriveOrderStatus(deliveries: Delivery[]): OrderStatus {
  if (deliveries.length === 0) return "pending";

  const hasContainer = deliveries.some(
    (d) => d.container && d.container.trim() !== ""
  );

  return hasContainer ? "in-transit" : "pending";
}

function resolvePrimaryLocation(deliveries: Delivery[]): string {
  const counts: Record<string, number> = {};

  for (const d of deliveries) {
    if (d.location && d.location !== "—") {
      counts[d.location] = (counts[d.location] ?? 0) + 1;
    }
  }

  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  return sorted[0]?.[0] ?? "—";
}

// ─── Transformadores ─────────────────────────────────────────────────────────

export function transformDelivery(raw: BackendDelivery): Delivery {
  return {
    deliveryId: raw.deliveryId ?? "—",
    material: raw.material ?? "Material Desconhecido",
    weight: Number(raw.peso ?? 0),
    location: raw.local ? cleanLocation(raw.local) : "—",
    container: raw.container?.trim() || null,
  };
}

export function transformOrder(raw: BackendOrder): Order {
  const deliveries: Delivery[] = (raw.entregas ?? []).map(transformDelivery);

  const totalWeight = deliveries.reduce((sum, d) => sum + d.weight, 0);

  const primaryLocation = resolvePrimaryLocation(deliveries);

  const primaryContainer =
    deliveries.find((d) => d.container !== null)?.container ?? null;

  return {
    orderNumber: raw.pedido,
    status: deriveOrderStatus(deliveries),
    deliveries,
    totalWeight,
    primaryLocation,
    primaryContainer,
    createdAt: raw.data ?? null,
  };
}

export function transformOrders(rawOrders: BackendOrder[]): Order[] {
  return rawOrders.map(transformOrder);
}