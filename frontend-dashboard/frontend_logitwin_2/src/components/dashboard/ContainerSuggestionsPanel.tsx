"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { useContainerSuggestions } from "@/hooks/useContainerSuggestions";
import type { ContainerSuggestion } from "@/types";

export function ContainerSuggestionsPanel() {
  const { data, loading, error, refetch } = useContainerSuggestions();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
          Calculando sugestões inteligentes…
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-800">
        Não foi possível gerar sugestões: {error}
        <button onClick={refetch} className="ml-2 underline font-semibold">retentar</button>
      </div>
    );
  }

  if (data.suggestions.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
            <CheckIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">
              Todas as entregas estão alocadas
            </p>
            <p className="text-xs text-green-700 mt-0.5">
              Sem sugestões pendentes — fluxo logístico em dia.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Cabeçalho */}
      <div className="px-5 py-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <BrainIcon />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest">
                Inteligência Logística
              </p>
              <p className="text-sm font-semibold">Sugestões de Alocação de Contentores</p>
            </div>
          </div>
          <button
            onClick={refetch}
            className="text-[10px] font-semibold text-blue-100 hover:text-white bg-white/5 border border-white/10 rounded-full px-2.5 py-1"
          >
            Recalcular
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Stat label="Entregas pendentes" value={data.totalPendingDeliveries} />
          <Stat label="Containers ativos"  value={data.totalActiveContainers} />
          <Stat label="Sugestões geradas"  value={data.suggestions.length} />
        </div>
      </div>

      {/* Lista de sugestões */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {data.suggestions.map(sugg => (
          <SuggestionRow
            key={sugg.delivery.id}
            suggestion={sugg}
            expanded={expanded === sugg.delivery.id}
            onToggle={() => setExpanded(e => e === sugg.delivery.id ? null : sugg.delivery.id)}
          />
        ))}
      </div>

      <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400">
        Algoritmo: proximidade física + capacidade restante.
        Atualizado em {new Date(data.generatedAt).toLocaleTimeString("pt-BR")}.
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
      <p className="text-[9px] font-semibold text-blue-200 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}

interface SuggestionRowProps {
  suggestion: ContainerSuggestion;
  expanded: boolean;
  onToggle: () => void;
}

function SuggestionRow({ suggestion, expanded, onToggle }: SuggestionRowProps) {
  const { delivery, candidates, bestMatch } = suggestion;

  return (
    <div className="px-5 py-3 hover:bg-slate-50 transition-colors">
      {/* Linha principal */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
            <BoxIcon />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-800">
                {delivery.id}
              </span>
              <span className="text-[10px] text-slate-400">
                pedido {delivery.orderId}
              </span>
            </div>
            <p className="text-xs text-slate-600 truncate">
              {delivery.material} · <strong>{delivery.weight.toFixed(1)} t</strong> em {delivery.location}
            </p>
          </div>
        </div>

        {bestMatch ? (
          <div className="text-right flex-shrink-0">
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
              Sugestão
            </p>
            <span className={clsx(
              "inline-flex items-center gap-1 font-mono text-[11px] px-2 py-1 rounded-md border",
              bestMatch.fits
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            )}>
              {bestMatch.containerId}
              <span className="text-[9px] font-bold">
                · {bestMatch.distanceUnits}u
              </span>
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-400">sem candidatos</span>
        )}
      </button>

      {/* Detalhes expandidos */}
      {expanded && (
        <div className="mt-3 ml-11 space-y-1 border-l-2 border-blue-200 pl-3">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Top 3 candidatos
          </p>
          {candidates.map((c, i) => (
            <div
              key={c.containerId}
              className="flex items-center justify-between text-[11px] py-1"
            >
              <div className="flex items-center gap-2">
                <span className={clsx(
                  "w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center",
                  i === 0 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600",
                )}>
                  {i + 1}
                </span>
                <span className="font-mono text-slate-800">{c.containerId}</span>
                <span className="text-slate-400">{c.type}</span>
                <span className="text-slate-500">@ {c.currentLocation}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <span>dist: <strong>{c.distanceUnits}u</strong></span>
                <span>livre: <strong>{c.remainingCapacity.toFixed(1)}t</strong></span>
                {!c.fits && (
                  <span className="text-amber-600 font-semibold">⚠ não cabe</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BrainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/>
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
