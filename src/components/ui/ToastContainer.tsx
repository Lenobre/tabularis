import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { ToastKind } from "../../contexts/ToastContext";

interface ToastItem {
  id: string;
  message: string;
  kind: ToastKind;
  title?: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const iconConfig: Record<
  ToastKind,
  { Icon: typeof Info; bgClass: string; textClass: string; borderClass: string }
> = {
  success: {
    Icon: CheckCircle,
    bgClass: "bg-green-900/25",
    textClass: "text-green-400",
    borderClass: "border-green-500/30",
  },
  error: {
    Icon: XCircle,
    bgClass: "bg-red-900/25",
    textClass: "text-red-400",
    borderClass: "border-red-500/30",
  },
  warning: {
    Icon: AlertTriangle,
    bgClass: "bg-yellow-900/25",
    textClass: "text-yellow-400",
    borderClass: "border-yellow-500/30",
  },
  info: {
    Icon: Info,
    bgClass: "bg-blue-900/25",
    textClass: "text-blue-400",
    borderClass: "border-blue-500/30",
  },
};

function SingleToast({
  toast,
  onDismiss,
  style,
}: {
  toast: ToastItem;
  onDismiss: () => void;
  style: React.CSSProperties;
}) {
  const { Icon, bgClass, textClass, borderClass } = iconConfig[toast.kind];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={style}
      className={`
        flex items-start gap-3 w-[380px] bg-elevated border ${borderClass} rounded-xl shadow-2xl p-4
        transition-all duration-300 ease-out
        ${visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}
      `}
      role="alert"
    >
      <div className={`p-1.5 ${bgClass} rounded-lg shrink-0 mt-0.5`}>
        <Icon size={16} className={textClass} />
      </div>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-primary mb-0.5">
            {toast.title}
          </p>
        )}
        <p className="text-sm text-secondary whitespace-pre-wrap break-words">
          {toast.message}
        </p>
      </div>

      <button
        onClick={onDismiss}
        className="p-0.5 rounded text-muted hover:text-primary hover:bg-surface-secondary transition-colors shrink-0 mt-0.5"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  const handleDismiss = useCallback(
    (id: string) => {
      onDismiss(id);
    },
    [onDismiss],
  );

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast, index) => (
        <div key={toast.id} className="pointer-events-auto">
          <SingleToast
            toast={toast}
            onDismiss={() => handleDismiss(toast.id)}
            style={{
              marginBottom: index < toasts.length - 1 ? 0 : undefined,
            }}
          />
        </div>
      ))}
    </div>,
    document.body,
  );
}
