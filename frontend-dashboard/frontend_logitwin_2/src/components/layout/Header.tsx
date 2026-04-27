"use client";

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh:   () => void;
}

export function Header({ lastUpdated, onRefresh }: HeaderProps) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString("pt-BR", {
        hour:   "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  return (
    <header className="bg-navy-900 border-b border-navy-700 h-16 flex items-center justify-between px-6 sticky top-0 z-50 flex-shrink-0">

      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
          <TruckIcon />
        </div>
        <div>
          <div className="text-white text-[15px] font-semibold tracking-tight leading-none">
            LogiTwin
          </div>
          <div className="text-slate-400 text-[10px] tracking-widest uppercase mt-0.5">
            Central de Logística
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4">
        {/* Live badge */}
        <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-green-500/20 tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
          LIVE
        </div>

        {/* Timestamp */}
        <span className="text-slate-400 text-xs font-mono hidden sm:block">
          Atualizado {timeStr}
        </span>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-navy-800 border border-navy-600 rounded-md hover:bg-navy-700 hover:text-white hover:border-navy-500 transition-all"
        >
          <RefreshIcon />
          Atualizar
        </button>
      </div>
    </header>
  );
}

// ── Ícones inline (sem dependência externa) ───────────────────────────────────

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 5v3h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  );
}