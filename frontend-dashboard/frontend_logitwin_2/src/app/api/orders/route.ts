/**
 * API Route: GET /api/orders
 *
 * Proxy entre o frontend Next.js e o backend Node.js.
 * Aplica a camada de transformação SAP → domínio LogiTwin.
 * Mantém o backend desacoplado do cliente.
 */

import { NextResponse } from "next/server";
import { transformOrders } from "@/lib/transform";
import type { BackendOrder } from "@/types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/orders`, {
      headers:  { Accept: "application/json" },
      cache:    "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend retornou ${res.status}` },
        { status: res.status }
      );
    }

    const raw: BackendOrder[] = await res.json();

    if (!Array.isArray(raw)) {
      return NextResponse.json(
        { error: "Formato de dados inesperado" },
        { status: 500 }
      );
    }

    const orders = transformOrders(raw);

    return NextResponse.json(orders, {
      headers: {
        "Cache-Control":       "no-store, no-cache, must-revalidate",
        "X-LogiTwin-Total":    String(orders.length),
        "X-LogiTwin-Updated":  new Date().toISOString(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    console.error("[API /orders]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}