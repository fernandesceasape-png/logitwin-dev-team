"use client";

import { useState, useRef, useEffect } from "react";
import type { Order } from "@/types";
import { exportBacklogCSV, exportBacklogPDF } from "@/lib/exportBacklog";

interface BacklogExportButtonProps {
  orders: Order[];
  disabled?: boolean;
}

export function BacklogExportButton({ orders, disabled }: BacklogExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const isDisabled = disabled || orders.length === 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={isDisabled}
        className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <DownloadIcon />
        Exportar Backlog
        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {orders.length}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && !isDisabled && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Relatório ITIL
            </p>
            <p className="text-xs text-slate-700 mt-0.5">
              {orders.length} pedido(s) no escopo
            </p>
          </div>

          <button
            onClick={() => { exportBacklogPDF(orders); setOpen(false); }}
            className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-blue-50 border-b border-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <PdfIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Exportar em PDF</p>
              <p className="text-[11px] text-slate-500">Para reuniões e auditoria</p>
            </div>
          </button>

          <button
            onClick={() => { exportBacklogCSV(orders); setOpen(false); }}
            className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-green-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
              <ExcelIcon />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Exportar em CSV (Excel)</p>
              <p className="text-[11px] text-slate-500">Análise e tratamento de dados</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M9 13h1m4 0h1M9 17h6"/>
    </svg>
  );
}

function ExcelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M8 13l3 4M11 13l-3 4M14 13l3 4M17 13l-3 4"/>
    </svg>
  );
}
