import { DEFAULT_LANGUAGE, SupportedLanguage } from "@/lib/i18n/config";

export type SharedMessages = {
  productName: string;
  adminWeb: string;
  goToLogin: string;
  backToOverview: string;
  signIn: string;
  logout: string;
  signingOut: string;
  dashboard: string;
  validatingSession: string;
  protectedWorkspacePlaceholder: string;
};

export const messages: Record<SupportedLanguage, SharedMessages> = {
  en: {
    productName: "Enterprise Core",
    adminWeb: "Admin Web",
    goToLogin: "Go to Login",
    backToOverview: "Back to overview",
    signIn: "Sign in",
    logout: "Logout",
    signingOut: "Signing out...",
    dashboard: "Dashboard",
    validatingSession: "Validating session...",
    protectedWorkspacePlaceholder: "Protected admin workspace placeholder.",
  },
  es: {
    productName: "Enterprise Core",
    adminWeb: "Admin Web",
    goToLogin: "Ir al inicio de sesión",
    backToOverview: "Volver al resumen",
    signIn: "Iniciar sesión",
    logout: "Cerrar sesión",
    signingOut: "Cerrando sesión...",
    dashboard: "Dashboard",
    validatingSession: "Validando sesión...",
    protectedWorkspacePlaceholder: "Marcador de posición del espacio administrativo protegido.",
  },
};

export const defaultMessages = messages[DEFAULT_LANGUAGE];
