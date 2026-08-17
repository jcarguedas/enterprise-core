import { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
  userDisplayName: string;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export function AdminShell({
  children,
  userDisplayName,
  isLoggingOut,
  onLogout,
}: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#f4f6f9] text-[#111827]">
      <div className="min-h-screen lg:flex">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            userDisplayName={userDisplayName}
            isLoggingOut={isLoggingOut}
            onLogout={onLogout}
          />
          <section className="flex-1 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
