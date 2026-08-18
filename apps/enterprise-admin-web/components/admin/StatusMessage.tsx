import { ReactNode } from "react";

type StatusMessageProps = {
  children: ReactNode;
  className?: string;
  variant: "info" | "success" | "error";
};

const variantClasses = {
  info: "text-[#475569]",
  success:
    "rounded-md border border-[#b7dcc7] bg-[#f3fbf6] px-4 py-3 leading-6 text-[#276749]",
  error:
    "rounded-md border border-[#f1b8b8] bg-[#fff5f5] px-4 py-3 leading-6 text-[#9b2c2c]",
};

export function StatusMessage({
  children,
  className = "",
  variant,
}: StatusMessageProps) {
  const ariaLive =
    variant === "error" || variant === "success" ? "polite" : undefined;

  return (
    <div
      aria-live={ariaLive}
      className={`text-sm font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
