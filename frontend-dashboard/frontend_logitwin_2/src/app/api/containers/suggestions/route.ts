import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export const dynamic    = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/containers/suggestions`, {
      headers: { Accept: "application/json" },
      cache:   "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend retornou ${res.status}` },
        { status: res.status }
      );
    }

    return NextResponse.json(await res.json(), {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    console.error("[API /containers/suggestions]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
