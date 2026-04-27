import { clsx } from "clsx";
import type { Order, OrderStatus } from "@/types";
import { formatWeight, formatDate, getPendingAlertLevel, getPendingDays } from "@/lib/stats";

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const alertLevel = getPendingAlertLevel(order);
  const pendingDays = getPendingDays(order);

  const borderClass =
    alertLevel === "critical" ? "border-red-400 shadow-red-100" :
    alertLevel === "warning"  ? "border-amber-400 shadow-amber-100" :
    "border-slate-200";

  return (
    <article
      onClick={onClick}
      className={clsx(
        "bg-white rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden",
        onClick && "cursor-pointer",
        borderClass,
      )}
    >
      {/* ── Faixa de alerta (pendente antigo) ─────────────────────────── */}
      {alertLevel !== "none" && (
        <div className={clsx(
          "flex items-center gap-2 px-4 py-2 text-[11px] font-semibold",
          alertLevel === "critical" && "bg-red-500 text-white",
          alertLevel === "warning"  && "bg-amber-400 text-amber-900",
        )}>
          {/* Ponto piscante */}
          <span className={clsx(
            "w-2 h-2 rounded-full flex-shrink-0",
            alertLevel === "critical" ? "bg-white animate-pulse" : "bg-amber-700 animate-pulse",
          )} />
          {alertLevel === "critical"
            ? `CRITICO — Pendente há ${pendingDays} dias`
            : `ATENCAO — Pendente há ${pendingDays} dias`}
        </div>
      )}

      {/* ── Cabeçalho ─────────────────────────────────────────────────── */}
      <div className={clsx(
        "flex items-center justify-between px-4 py-3 border-b",
        alertLevel === "critical" ? "bg-red-50 border-red-100" :
        alertLevel === "warning"  ? "bg-amber-50 border-amber-100" :
        "bg-slate-50 border-slate-100",
      )}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
            PED
          </span>
          <span className="font-mono text-sm font-medium text-slate-700">
            {order.orderNumber}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} alertLevel={alertLevel} />
          {onClick && (
            <span className="text-[10px] text-slate-400 hidden group-hover:inline">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* ── Corpo ─────────────────────────────────────────────────────── */}
      <div className="p-4">

        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Metric label="Peso Total">
            <span className="text-[15px] font-bold text-slate-800">
              {formatWeight(order.totalWeight)}
            </span>
          </Metric>

          <Metric label="Entregas">
            <span className="text-[15px] font-bold text-slate-800">
              {order.deliveries.length}
              <span className="text-xs font-normal text-slate-500 ml-1">itens</span>
            </span>
          </Metric>

          {/* Localização primária */}
          <Metric label="Localização" className="col-span-2">
            <div className="flex items-center gap-1.5 mt-1">
              <PinIcon />
              <span className="text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                {order.primaryLocation}
              </span>
            </div>
          </Metric>

          {/* Container — destaque visual */}
          <Metric label="Container" className="col-span-2">
            <div className="mt-1">
              {order.primaryContainer ? (
                <ContainerBadge id={order.primaryContainer} />
              ) : (
                <span className="text-sm text-slate-300">Sem container atribuído</span>
              )}
            </div>
          </Metric>
        </div>

        {/* ── Linhas de entrega ─────────────────────────────────────── */}
        {order.deliveries.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Linhas de Entrega
            </p>
            <div className="space-y-1">
              {order.deliveries.slice(0, 4).map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0"
                >
                  <span className="font-mono text-slate-400 w-20 flex-shrink-0">
                    {d.deliveryId}
                  </span>
                  <span className="text-slate-600 flex-1 px-2 truncate" title={d.material}>
                    {d.material}
                  </span>
                  <span className="font-semibold text-slate-700 tabular-nums">
                    {formatWeight(d.weight)}
                  </span>
                </div>
              ))}
              {order.deliveries.length > 4 && (
                <p className="text-center text-xs text-slate-400 pt-1">
                  +{order.deliveries.length - 4} linha(s) adicional(is)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Data de criação */}
        {order.createdAt && (
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-50">
            Criado em {formatDate(order.createdAt)}
          </p>
        )}

        {/* Hint de clique */}
        {onClick && (
          <p className="text-[10px] text-slate-300 mt-2 text-right">
            Clique para ver detalhes →
          </p>
        )}
      </div>
    </article>
  );
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function Metric({
  label, children, className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      {children}
    </div>
  );
}

function ContainerBadge({ id }: { id: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-navy-800 text-blue-300 font-mono text-xs font-medium px-3 py-1.5 rounded-md border border-blue-900/30">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v3h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
      {id}
    </span>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  "in-transit": {
    label:     "Em Trânsito",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  delivered: {
    label:     "Entregue",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  pending: {
    label:     "Pendente",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

function StatusBadge({ status, alertLevel }: { status: OrderStatus; alertLevel: "none" | "warning" | "critical" }) {
  const { label, className } = statusConfig[status];
  const urgentClass =
    alertLevel === "critical" ? "bg-red-100 text-red-700 border-red-300 animate-pulse" :
    alertLevel === "warning"  ? "bg-amber-100 text-amber-800 border-amber-300" :
    className;

  return (
    <span className={clsx(
      "text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase",
      urgentClass
    )}>
      {label}
    </span>
  );
}
