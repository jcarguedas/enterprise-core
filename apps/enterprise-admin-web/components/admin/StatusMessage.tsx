"use client";

import { ReactNode, useEffect, useRef } from "react";

import { useI18n } from "@/lib/i18n/use-i18n";

type StatusMessageProps = {
  autoDismiss?: boolean;
  children: ReactNode;
  className?: string;
  dismissible?: boolean;
  durationMs?: number;
  onDismiss?: () => void;
  variant: "info" | "success" | "error";
};

const DEFAULT_AUTO_DISMISS_MS = 5000;

const variantClasses = {
  info: "app-muted",
  success: "app-status-success rounded-md border px-4 py-3 leading-6",
  error: "app-status-error rounded-md border px-4 py-3 leading-6",
};

const progressClasses = {
  info: "bg-[#64748b]",
  success: "bg-[#2f855a]",
  error: "bg-[#c53030]",
};

export function StatusMessage({
  autoDismiss = false,
  children,
  className = "",
  dismissible = false,
  durationMs = DEFAULT_AUTO_DISMISS_MS,
  onDismiss,
  variant,
}: StatusMessageProps) {
  const { messages: t } = useI18n();
  const onDismissRef = useRef(onDismiss);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const ariaLive =
    variant === "error" || variant === "success" ? "polite" : undefined;
  const shouldAutoDismiss = autoDismiss && Boolean(onDismiss);
  const safeDurationMs = Math.max(0, durationMs);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!shouldAutoDismiss) {
      return;
    }

    const progressBar = progressBarRef.current;

    if (progressBar) {
      progressBar.style.transitionDuration = "0ms";
      progressBar.style.width = "100%";
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      if (!progressBar) {
        return;
      }

      progressBar.style.transitionDuration = `${safeDurationMs}ms`;
      progressBar.style.width = "0%";
    });
    const timeoutId = window.setTimeout(() => {
      onDismissRef.current?.();
    }, safeDurationMs);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [children, safeDurationMs, shouldAutoDismiss]);

  return (
    <div
      aria-live={ariaLive}
      className={`relative text-sm font-medium ${shouldAutoDismiss ? "overflow-hidden" : ""} ${variantClasses[variant]} ${className}`}
    >
      <div className={dismissible ? "flex items-start gap-3" : ""}>
        <div className="min-w-0 flex-1">{children}</div>
        {dismissible ? (
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-current transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
            aria-label={t.dismissMessage}
          >
            <span aria-hidden="true">x</span>
          </button>
        ) : null}
      </div>

      {shouldAutoDismiss ? (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-black/5">
          <div
            ref={progressBarRef}
            className={`h-full w-full ${progressClasses[variant]} transition-[width] ease-linear`}
          />
        </div>
      ) : null}
    </div>
  );
}
