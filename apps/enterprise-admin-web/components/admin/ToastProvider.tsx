"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useI18n } from "@/lib/i18n/use-i18n";

type ToastVariant = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type AddToastInput = {
  message: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  addToast: (toast: AddToastInput) => void;
  dismissToast: (toastId: number) => void;
};

type ToastProviderProps = {
  children: ReactNode;
};

const TOAST_AUTO_DISMISS_MS = 5000;
const ToastContext = createContext<ToastContextValue | null>(null);

const variantClasses: Record<ToastVariant, string> = {
  success: "border-[#b7dcc7] bg-[#f3fbf6] text-[#276749]",
  error: "border-[#f1b8b8] bg-[#fff5f5] text-[#9b2c2c]",
  info: "border-[#cbd5e1] bg-[#f8fafc] text-[#334155]",
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (toastId: number) => void;
}) {
  const { messages: t } = useI18n();

  useEffect(() => {
    if (toast.variant !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss(toast.id);
    }, TOAST_AUTO_DISMISS_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onDismiss, toast.id, toast.variant]);

  return (
    <div
      role="status"
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-[0_18px_48px_rgba(15,23,42,0.18)] ${variantClasses[toast.variant]}`}
    >
      <div className="min-w-0 flex-1 leading-6">{toast.message}</div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-current transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
        aria-label={t.dismissMessage}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: ToastProviderProps) {
  const nextToastIdRef = useRef(1);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((toastId: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    );
  }, []);

  const addToast = useCallback((toast: AddToastInput) => {
    const nextToast: Toast = {
      id: nextToastIdRef.current,
      message: toast.message,
      variant: toast.variant ?? "info",
    };

    nextToastIdRef.current += 1;
    setToasts((currentToasts) => [nextToast, ...currentToasts].slice(0, 4));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, dismissToast }}>
      {children}
      <div className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-3 sm:left-auto sm:right-5 sm:w-full sm:max-w-sm">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
