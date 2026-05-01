import { clsx } from "clsx";
import type { Order, OrderStatus } from "@/types";
import { formatWeight, getPendingAlertLevel, getPendingDays, type AlertLevel } from "@/lib/stats";

interface OrdersTableProps {
  orders: Order[];
  onRowClick?: (order: Order) => void;
}

export function OrdersTable({ orders, onRowClick }: OrdersTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {[
                "Número do Pedido",
                "Status",
                "Localização",
                "Container",
                "Entregas",
                "Peso Total",
                "",
              ].map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <TableRow
                key={order.orderNumber}
                order={order}
                onClick={onRowClick ? () => onRowClick(order) : undefined}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer com contagem */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          {orders.length} pedido(s) exibido(s)
        </p>
      </div>
    </div>
  );
}

// ── Linha da tabela ───────────────────────────────────────────────────────────

function TableRow({ order, onClick }: { order: Order; onClick?: () => void }) {
  const alertLevel = getPendingAlertLevel(order);
  const pendingDays = getPendingDays(order);

  const rowClass = clsx(
    "transition-colors",
    onClick && "cursor-pointer",
    alertLevel === "critical"    && "bg-red-50 hover:bg-red-100",
    alertLevel === "approaching" && "bg-orange-50 hover:bg-orange-100",
    alertLevel === "warning"     && "bg-amber-50 hover:bg-amber-100",
    alertLevel === "none"        && "hover:bg-slate-50",
  );

  return (
    <tr className={rowClass} onClick={onClick}>
      {/* Número do Pedido */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {alertLevel !== "none" && (
            <span className={clsx(
              "w-2 h-2 rounded-full flex-shrink-0 animate-pulse",
              alertLevel === "critical"    ? "bg-red-500"    :
              alertLevel === "approaching" ? "bg-orange-500" :
              "bg-amber-400",
            )} />
          )}
          <span className="font-mono text-[12px] text-slate-700">
            {order.orderNumber}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <InlineStatusBadge status={order.status} alertLevel={alertLevel} />
          {alertLevel !== "none" && (
            <span className={clsx(
              "text-[10px] font-semibold",
              alertLevel === "critical"    ? "text-red-600"    :
              alertLevel === "approaching" ? "text-orange-600" :
              "text-amber-600",
            )}>
              {pendingDays}d parado
            </span>
          )}
        </div>
      </td>

      {/* Localização */}
      <td className="px-4 py-3">
        {order.primaryLocation !== "—" ? (
          <span className="flex items-center gap-1.5 text-xs text-slate-600">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            {order.primaryLocation}
          </span>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        )}
      </td>

      {/* Container */}
      <td className="px-4 py-3">
        {order.primaryContainer ? (
          <span className="inline-flex items-center gap-1 bg-navy-800 text-blue-300 font-mono text-[11px] px-2.5 py-1 rounded border border-blue-900/30">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1"/>
              <path d="M16 8h4l3 5v3h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            {order.primaryContainer}
          </span>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        )}
      </td>

      {/* Entregas */}
      <td className="px-4 py-3 text-sm text-slate-600">
        {order.deliveries.length}
      </td>

      {/* Peso */}
      <td className="px-4 py-3 text-right">
        <span className="font-semibold font-mono text-[13px] text-slate-800 tabular-nums">
          {formatWeight(order.totalWeight)}
        </span>
      </td>

      {/* Ação */}
      <td className="px-3 py-3">
        {onClick && (
          <span className="text-slate-300 hover:text-slate-600 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </span>
        )}
      </td>
    </tr>
  );
}

// ── Badge inline ──────────────────────────────────────────────────────────────

const statusMap: Record<OrderStatus, { label: string; className: string }> = {
  "in-transit": { label: "Em Trânsito", className: "bg-blue-50 text-blue-700" },
  delivered:    { label: "Entregue",    className: "bg-green-50 text-green-700" },
  pending:      { label: "Pendente",    className: "bg-amber-50 text-amber-700" },
};

function InlineStatusBadge({ status, alertLevel }: { status: OrderStatus; alertLevel: AlertLevel }) {
  const { label, className } = statusMap[status];
  const urgentClass =
    alertLevel === "critical"    ? "bg-red-100 text-red-700 animate-pulse" :
    alertLevel === "approaching" ? "bg-orange-100 text-orange-700"          :
    alertLevel === "warning"     ? "bg-amber-100 text-amber-800"           :
    className;

  return (
    <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide", urgentClass)}>
      {label}
    </span>
  );
}
