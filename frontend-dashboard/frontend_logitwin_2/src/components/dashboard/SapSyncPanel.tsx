"use client";

import { clsx } from "clsx";
import { useSapSync } from "@/hooks/useSapSync";
import type { SapTableStatus } from "@/types";

export function SapSyncPanel() {
  const { status, loading, error, refetch } = useSapSync();

  if (loading && !status) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
          Conectando ao S/4HANA…
        </div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-red-700">
              Falha na conexão SAP
            </p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="text-xs font-semibold text-red-700 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const { connection, tables } = status;
  const lastSyncDate = new Date(connection.lastSync);
  const lastSyncStr = lastSyncDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  const dotClass =
    connection.status === "connected"  ? "bg-green-500"  :
    connection.status === "degraded"   ? "bg-amber-500"  :
                                         "bg-red-500";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <SapIcon />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Integração ERP
            </p>
            <p className="text-sm font-semibold">
              {connection.system} · cliente {connection.client}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
          <span className={clsx("w-2 h-2 rounded-full animate-pulse", dotClass)} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">
            {connection.status === "connected" ? "Conectado" :
             connection.status === "degraded"  ? "Degradado" : "Desconectado"}
          </span>
        </div>
      </div>

      {/* Métricas globais */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
        <Metric label="Host" value={connection.host} mono />
        <Metric label="Latência média" value={`${connection.avgLatencyMs} ms`} />
        <Metric label="Última sync" value={lastSyncStr} mono />
      </div>

      {/* Tabelas SAP */}
      <div className="p-5 space-y-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Tabelas Sincronizadas
        </p>
        {tables.map(t => <TableRow key={t.name} table={t} />)}
      </div>

      <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">
          Total de registros: <strong className="text-slate-600">{connection.totalRecords}</strong>
        </span>
        <button
          onClick={refetch}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
        >
          Re-sincronizar
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={clsx("text-xs text-slate-700 mt-0.5 truncate", mono && "font-mono")}>
        {value}
      </p>
    </div>
  );
}

function TableRow({ table }: { table: SapTableStatus }) {
  const dot =
    table.status === "online"   ? "bg-green-500" :
    table.status === "degraded" ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50">
      <div className="flex items-center gap-3 min-w-0">
        <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} />
        <div className="min-w-0">
          <span className="font-mono text-xs font-bold text-slate-800">{table.name}</span>
          <span className="text-[11px] text-slate-500 ml-2">{table.description}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[11px] flex-shrink-0">
        <span className="text-slate-500">
          <strong className="font-mono text-slate-700">{table.records}</strong> registros
        </span>
        <span className="font-mono text-slate-400">{table.latencyMs}ms</span>
      </div>
    </div>
  );
}

function SapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
    </svg>
  );
}
