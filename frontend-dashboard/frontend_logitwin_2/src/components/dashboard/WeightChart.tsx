"use client";

import { useEffect, useRef } from "react";
import type { Order } from "@/types";
import { topOrdersByWeight } from "@/lib/stats";

interface WeightChartProps {
  orders: Order[];
}

export function WeightChart({ orders }: WeightChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef  = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || orders.length === 0) return;

    const data = topOrdersByWeight(orders, 8);

    async function init() {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(canvasRef.current!, {
        type: "bar",
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            {
              label:           "Peso (kg)",
              data:            data.map((d) => d.weight),
              backgroundColor: "rgba(37, 99, 235, 0.12)",
              borderColor:     "rgba(37, 99, 235, 0.75)",
              borderWidth:     1.5,
              borderRadius:    4,
              borderSkipped:   false,
            },
          ],
        },
        options: {
          indexAxis:   "y",
          responsive:  true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${Number(ctx.parsed.x).toFixed(1)} kg`,
              },
            },
          },
          scales: {
            x: {
              grid:   { color: "rgba(0,0,0,0.04)" },
              border: { display: false },
              ticks: {
                font:  { size: 10 },
                color: "#94a3b8",
                callback: (v) => {
                  const n = Number(v);
                  return n >= 1000 ? `${(n / 1000).toFixed(1)}t` : `${n}kg`;
                },
              },
            },
            y: {
              grid:   { display: false },
              border: { display: false },
              ticks: { font: { size: 10 }, color: "#64748b" },
            },
          },
        },
      });
    }

    init();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [orders]);

  const chartHeight = Math.max(orders.slice(0, 8).length * 40 + 60, 200);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-800">Peso por Pedido</h3>
      <p className="text-xs text-slate-400 mb-4">Top pedidos por peso da carga</p>
      <div style={{ position: "relative", height: chartHeight }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}