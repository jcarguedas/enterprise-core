import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ToastProvider } from "@/components/admin/ToastProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enterprise Core Admin",
  description: "Intelligent Business Operations Platform admin web app.",
};

const themeInitializerScript = `
try {
  var theme = window.localStorage.getItem("enterprise_core_theme");
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
} catch {
  document.documentElement.dataset.theme = "light";
}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
