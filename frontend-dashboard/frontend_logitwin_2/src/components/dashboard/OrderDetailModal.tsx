"use client";

import { useEffect } from "react";
import { clsx } from "clsx";
import type { Order, OrderStatus } from "@/types";
import { formatWeight, formatDate, getPendingAlertLevel, getPendingDays } from "@/lib/stats";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const alertLevel = getPendingAlertLevel(order);
  const pendingDays = getPendingDays(order);

  // Fechar com Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Travar scroll do body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes do pedido ${order.orderNumber}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Painel */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className={clsx(
          "flex items-center justify-between px-6 py-4 border-b",
          alertLevel === "critical" && "bg-red-50 border-red-200",
          alertLevel === "warning"  && "bg-amber-50 border-amber-200",
          alertLevel === "none"     && "bg-slate-50 border-slate-200",
        )}>
          <div className="flex items-center gap-3">
            {/* Ícone de carga */}
            <div className={clsx(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              alertLevel === "critical" && "bg-red-100",
              alertLevel === "warning"  && "bg-amber-100",
              alertLevel === "none"     && "bg-blue-100",
            )}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke={alertLevel === "critical" ? "#dc2626" : alertLevel === "warning" ? "#d97706" : "#2563eb"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1"/>
                <path d="M16 8h4l3 5v3h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">Pedido</span>
                <span className="font-mono font-bold text-slate-800">{order.orderNumber}</span>
                <StatusBadge status={order.status} />
              </div>
              {order.createdAt && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Criado em {formatDate(order.createdAt)}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Fechar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Alerta de Pendente Antigo ──────────────────────────────── */}
        {alertLevel !== "none" && (
          <div className={clsx(
            "flex items-start gap-3 px-6 py-3 border-b text-sm",
            alertLevel === "critical" && "bg-red-50 border-red-200 text-red-700",
            alertLevel === "warning"  && "bg-amber-50 border-amber-200 text-amber-700",
          )}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="mt-0.5 flex-shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <span className="font-semibold">
                {alertLevel === "critical"
                  ? `Pendente há ${pendingDays} dias — Ação imediata necessária`
                  : `Pendente há ${pendingDays} dias — Requer atenção`}
              </span>
              <p className="text-xs mt-0.5 opacity-80">
                {alertLevel === "critical"
                  ? "Este pedido está parado há mais de 30 dias. Contate o responsável e verifique o container."
                  : "Este pedido está aguardando há mais de uma semana. Considere acompanhar sua evolução."}
              </p>
            </div>
          </div>
        )}

        {/* ── Corpo com scroll ──────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">

          {/* ── KPIs rápidos ─────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3">
            <QuickKPI label="Peso Total" value={formatWeight(order.totalWeight)} />
            <QuickKPI label="Entregas" value={`${order.deliveries.length} itens`} />
            <QuickKPI label="Localização" value={order.primaryLocation} />
          </div>

          {/* ── Container ────────────────────────────────────────────── */}
          <section>
            <SectionTitle icon="container" label="Container" />
            {order.primaryContainer ? (
              <div className="mt-2 inline-flex items-center gap-2 bg-slate-900 text-blue-300 font-mono text-sm px-4 py-2 rounded-xl border border-blue-900/40">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="1"/>
                  <path d="M16 8h4l3 5v3h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                {order.primaryContainer}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-400 italic">Nenhum container atribuído a este pedido.</p>
            )}
          </section>

          {/* ── Itens da carga ───────────────────────────────────────── */}
          <section>
            <SectionTitle icon="list" label={`Itens da Carga (${order.deliveries.length})`} />
            <div className="mt-2 rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["ID Entrega", "Material", "Local", "Container", "Peso"].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.deliveries.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-500">{d.deliveryId}</td>
                      <td className="px-3 py-2 text-slate-700 max-w-[180px] truncate" title={d.material}>{d.material}</td>
                      <td className="px-3 py-2">
                        {d.location !== "—" ? (
                          <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{d.location}</span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {d.container ? (
                          <span className="font-mono text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {d.container}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold font-mono text-[12px] text-slate-800 tabular-nums">
                        {formatWeight(d.weight)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 border-t border-slate-200">
                    <td colSpan={4} className="px-3 py-2 text-xs font-semibold text-slate-500 text-right">
                      Peso Total
                    </td>
                    <td className="px-3 py-2 text-right font-bold font-mono text-[13px] text-slate-800 tabular-nums">
                      {formatWeight(order.totalWeight)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function QuickKPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-800 truncate" title={value}>{value}</p>
    </div>
  );
}

function SectionTitle({ label, icon }: { label: string; icon: "container" | "list" }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      {icon === "container" ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="1"/>
          <path d="M16 8h4l3 5v3h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      )}
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</h3>
    </div>
  );
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  "in-transit": { label: "Em Trânsito", className: "bg-blue-50 text-blue-700 border-blue-200" },
  delivered:    { label: "Entregue",    className: "bg-green-50 text-green-700 border-green-200" },
  pending:      { label: "Pendente",    className: "bg-amber-50 text-amber-700 border-amber-200" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = statusConfig[status];
  return (
    <span className={clsx(
      "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide",
      className
    )}>
      {label}
    </span>
  );
}
