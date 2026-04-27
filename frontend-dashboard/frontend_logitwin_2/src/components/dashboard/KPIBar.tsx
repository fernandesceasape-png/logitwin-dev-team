import type { DashboardStats } from "@/types";
import { formatWeight } from "@/lib/stats";
import { clsx } from "clsx";

interface KPIBarProps {
  stats: DashboardStats;
}

interface KPIItem {
  label:    string;
  value:    string | number;
  sub:      string;
  color:    "blue" | "teal" | "amber" | "green";
  icon:     React.ReactNode;
}

export function KPIBar({ stats }: KPIBarProps) {
  const kpis: KPIItem[] = [
    {
      label: "Total de Pedidos",
      value: stats.totalOrders,
      sub:   `${stats.totalDeliveries} entregas no total`,
      color: "blue",
      icon:  <ClipboardIcon />,
    },
    {
      label: "Peso Total da Carga",
      value: formatWeight(stats.totalWeight),
      sub:   `Média: ${formatWeight(stats.avgWeightPerOrder)} / pedido`,
      color: "teal",
      icon:  <ScaleIcon />,
    },
    {
      label: "Containers Ativos",
      value: stats.activeContainers,
      sub:   "containers únicos atribuídos",
      color: "amber",
      icon:  <ContainerIcon />,
    },
    {
      label: "Armazéns Rastreados",
      value: stats.uniqueLocations,
      sub:   `${stats.ordersInTransit} pedido(s) em trânsito`,
      color: "green",
      icon:  <LocationIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.label} {...kpi} />
      ))}
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────

const colorMap = {
  blue:  { icon: "bg-blue-50 text-blue-600",   border: "border-blue-100" },
  teal:  { icon: "bg-teal-50 text-teal-700",   border: "border-teal-100" },
  amber: { icon: "bg-amber-50 text-amber-700", border: "border-amber-100" },
  green: { icon: "bg-green-50 text-green-700", border: "border-green-100" },
};

function KPICard({ label, value, sub, color, icon }: KPIItem) {
  const colors = colorMap[color];
  return (
    <div className={clsx(
      "bg-white rounded-2xl border p-5 flex items-start gap-4",
      "shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
      colors.border
    )}>
      <div className={clsx(
        "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
        colors.icon
      )}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-1.5">
          {value}
        </p>
        <p className="text-xs text-slate-400 truncate">{sub}</p>
      </div>
    </div>
  );
}

// ── Ícones ────────────────────────────────────────────────────────────────────

const iconProps = {
  width: 20, height: 20, fill: "none",
  stroke: "currentColor", strokeWidth: 2,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" {...iconProps}>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" {...iconProps}>
      <path d="M12 3v1M3 7l2.5 7.5h13L21 7M5.5 14.5V17a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2.5"/>
      <path d="M12 4L3 7M12 4l9 3"/>
    </svg>
  );
}

function ContainerIcon() {
  return (
    <svg viewBox="0 0 24 24" {...iconProps}>
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 5v3h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" {...iconProps}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}