import { useState, useCallback, useRef, useEffect } from "react";
import { ToastContext, type Toast } from "./ToastContext";
import { ToastContainer } from "../components/ui/ToastContainer";

interface ToastInternal extends Toast {
  timerId: ReturnType<typeof setTimeout> | null;
}

const DEFAULT_DURATION = 4000;

let toastCounter = 0;
function generateId(): string {
  toastCounter += 1;
  return `toast-${toastCounter}-${Date.now()}`;
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);
  const toastsRef = useRef(toasts);
  toastsRef.current = toasts;

  useEffect(() => {
    return () => {
      for (const toast of toastsRef.current) {
        if (toast.timerId) clearTimeout(toast.timerId);
      }
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.timerId) clearTimeout(toast.timerId);
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const scheduleDismiss = useCallback(
    (id: string, duration: number) => {
      const timerId = setTimeout(() => {
        dismissToast(id);
      }, duration);
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, timerId } : t)),
      );
    },
    [dismissToast],
  );

  const showToast = useCallback(
    (input: Omit<Toast, "id">): string => {
      const id = generateId();
      const duration = input.duration ?? DEFAULT_DURATION;
      const toast: ToastInternal = { ...input, id, duration, timerId: null };
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        scheduleDismiss(id, duration);
      }, 0);

      return id;
    },
    [scheduleDismiss],
  );

  const dismissAll = useCallback(() => {
    setToasts((prev) => {
      for (const toast of prev) {
        if (toast.timerId) clearTimeout(toast.timerId);
      }
      return [];
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, dismissAll }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};
