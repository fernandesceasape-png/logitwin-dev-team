"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { KPIBar } from "@/components/dashboard/KPIBar";
import { OrderCard } from "@/components/dashboard/OrderCard";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { WeightChart } from "@/components/dashboard/WeightChart";
import { LocationDistribution } from "@/components/dashboard/LocationDistribution";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { OrderDetailModal } from "@/components/dashboard/OrderDetailModal";
import { SapSyncPanel } from "@/components/dashboard/SapSyncPanel";
import { ContainerSuggestionsPanel } from "@/components/dashboard/ContainerSuggestionsPanel";
import { BacklogExportButton } from "@/components/dashboard/BacklogExportButton";
import { useOrders } from "@/hooks/useOrders";
import type { Order } from "@/types";
import { getPendingAlertLevel } from "@/lib/stats";

type ViewMode = "cards" | "table";

export default function DashboardPage() {
  const { orders, stats, loading, error, lastUpdated, refetch } = useOrders();
  const [view, setView] = useState<ViewMode>("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filtra pedidos pelo número digitado na busca
  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) =>
      o.orderNumber.toLowerCase().includes(q)
    );
  }, [orders, searchQuery]);

  // Contagem de alertas para exibir resumo
  const alertCounts = useMemo(() => {
    const critical    = orders.filter((o) => getPendingAlertLevel(o) === "critical").length;
    const approaching = orders.filter((o) => getPendingAlertLevel(o) === "approaching").length;
    const warning     = orders.filter((o) => getPendingAlertLevel(o) === "warning").length;
    return { critical, approaching, warning };
  }, [orders]);

  // Pedidos no escopo do relatório de backlog (todos com algum nível de aging)
  const backlogOrders = useMemo(
    () => orders.filter((o) => getPendingAlertLevel(o) !== "none"),
    [orders]
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        lastUpdated={lastUpdated}
        onRefresh={refetch}
      />

      <main className="flex-1 p-6 max-w-screen-2xl mx-auto w-full">

        {/* ── Erro ─────────────────────────────────────────────────── */}
        {error && (
          <StatusBanner
            type="error"
            message={error}
            onRetry={refetch}
            className="mb-6"
          />
        )}

        {/* ── Aviso de pedidos críticos ─────────────────────────────── */}
        {!loading && alertCounts.critical > 0 && (
          <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-300 rounded-xl px-4 py-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <p className="text-sm text-red-700 font-semibold">
              {alertCounts.critical} pedido(s) com status <strong>CRÍTICO</strong> — pendente há mais de 30 dias.
              {alertCounts.approaching > 0 && ` ${alertCounts.approaching} aproximando-se do limite.`}
              {alertCounts.warning > 0 && ` Mais ${alertCounts.warning} requer(em) atenção.`}
            </p>
          </div>
        )}
        {!loading && alertCounts.critical === 0 && alertCounts.approaching > 0 && (
          <div className="mb-4 flex items-center gap-3 bg-orange-50 border border-orange-300 rounded-xl px-4 py-3">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse flex-shrink-0" />
            <p className="text-sm text-orange-800 font-semibold">
              <strong>AGING:</strong> {alertCounts.approaching} pedido(s) próximo(s) do limite crítico (15-29 dias) — aja proativamente para evitar prejuízos.
            </p>
          </div>
        )}
        {!loading && alertCounts.critical === 0 && alertCounts.approaching === 0 && alertCounts.warning > 0 && (
          <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <p className="text-sm text-amber-800 font-semibold">
              {alertCounts.warning} pedido(s) pendente(s) há mais de 7 dias — verifique a situação.
            </p>
          </div>
        )}

        {/* ── Painel de monitoramento SAP ───────────────────────────── */}
        {!loading && (
          <div className="mb-6 animate-fade-in">
            <SapSyncPanel />
          </div>
        )}

        {/* ── Loading inicial ───────────────────────────────────────── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
            <div className="w-9 h-9 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm font-medium">Carregando dados SAP…</p>
          </div>
        ) : (
          <>
            {/* ── KPIs ─────────────────────────────────────────────── */}
            {stats && (
              <div className="mb-6 animate-fade-in">
                <KPIBar stats={stats} />
              </div>
            )}

            {/* ── Grid principal ───────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

              {/* ── Coluna de pedidos ──────────────────────────────── */}
              <div>
                {/* Header da seção */}
                <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                      Pedidos Ativos
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {filteredOrders.length === orders.length
                        ? `${orders.length} pedidos rastreados`
                        : `${filteredOrders.length} de ${orders.length} pedidos`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Export do backlog */}
                    <BacklogExportButton orders={backlogOrders} />

                    {/* Toggle de visualização */}
                    <div className="flex gap-1 bg-slate-200 rounded-lg p-1">
                      {(["cards", "table"] as ViewMode[]).map((v) => (
                        <button
                          key={v}
                          onClick={() => setView(v)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${view === v
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-600 hover:text-slate-800"
                            }`}
                        >
                          {v === "cards" ? "Cards" : "Tabela"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Barra de busca ─────────────────────────────────── */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por número do pedido…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Limpar busca"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Nenhum resultado */}
                {filteredOrders.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400 animate-fade-in">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      className="mb-3">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <p className="text-sm font-medium">Nenhum pedido encontrado</p>
                    <p className="text-xs mt-1">Tente outro número de pedido</p>
                  </div>
                )}

                {/* Visualização */}
                {filteredOrders.length > 0 && (
                  view === "cards" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 animate-fade-in">
                      {filteredOrders.map(order => (
                        <OrderCard
                          key={order.orderNumber}
                          order={order}
                          onClick={() => setSelectedOrder(order)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <OrdersTable
                        orders={filteredOrders}
                        onRowClick={(order) => setSelectedOrder(order)}
                      />
                    </div>
                  )
                )}
              </div>

              {/* ── Sidebar de gráficos ────────────────────────────── */}
              <aside className="flex flex-col gap-4">
                <WeightChart orders={orders} />
                <LocationDistribution orders={orders} />
              </aside>

            </div>

            {/* ── Inteligência Logística ─────────────────────────────── */}
            <div className="mt-6 animate-fade-in">
              <ContainerSuggestionsPanel />
            </div>
          </>
        )}
      </main>

      {/* ── Modal de detalhes ──────────────────────────────────────────── */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
