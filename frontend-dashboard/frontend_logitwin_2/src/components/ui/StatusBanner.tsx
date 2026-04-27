import { clsx } from "clsx";

interface StatusBannerProps {
  type:       "error" | "info" | "success" | "warning";
  message:    string;
  onRetry?:   () => void;
  className?: string;
}

const bannerConfig = {
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon:      "text-red-500",
    btn:       "bg-red-700 hover:bg-red-800 text-white",
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon:      "text-blue-500",
    btn:       "bg-blue-700 hover:bg-blue-800 text-white",
  },
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon:      "text-green-500",
    btn:       "bg-green-700 hover:bg-green-800 text-white",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-800",
    icon:      "text-amber-500",
    btn:       "bg-amber-700 hover:bg-amber-800 text-white",
  },
};

export function StatusBanner({ type, message, onRetry, className }: StatusBannerProps) {
  const c = bannerConfig[type];
  return (
    <div className={clsx(
      "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium",
      c.container, className
    )}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className={c.icon}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4M12 16h.01"/>
      </svg>
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className={clsx(
            "ml-auto px-3 py-1 text-xs font-semibold rounded-md transition-colors",
            c.btn
          )}
        >
          Tentar Novamente
        </button>
      )}
    </div>
  );
}