import type { Order } from "@/types";
import { groupWeightByLocation, formatWeight } from "@/lib/stats";

interface LocationDistributionProps {
  orders: Order[];
}

export function LocationDistribution({ orders }: LocationDistributionProps) {
  const locations = groupWeightByLocation(orders);
  const maxWeight = locations[0]?.weight ?? 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-800">
        Distribuição por Armazém
      </h3>
      <p className="text-xs text-slate-400 mb-4">Peso acumulado por localização</p>

      <div className="space-y-3">
        {locations.map(({ location, weight }) => {
          const pct = Math.round((weight / maxWeight) * 100);
          return (
            <div key={location}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-700">{location}</span>
                <span className="text-xs font-mono text-slate-500">
                  {formatWeight(weight)}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}