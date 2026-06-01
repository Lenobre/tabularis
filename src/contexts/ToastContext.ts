import { createContext } from "react";

export type ToastKind = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
  title?: string;
  duration?: number;
  onClose?: () => void;
}

export interface ToastContextValue {
  showToast: (toast: Omit<Toast, "id">) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
