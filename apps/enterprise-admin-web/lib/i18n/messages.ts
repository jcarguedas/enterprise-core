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
  users: string;
  usersDescription: string;
  userDirectory: string;
  userDirectoryDescription: string;
  roleAssignments: string;
  roleAssignmentsDescription: string;
  accessStatus: string;
  accessStatusDescription: string;
  createUser: string;
  crudComingNext: string;
  comingNext: string;
  readOnly: string;
  loadingUsers: string;
  noUsersReturned: string;
  actions: string;
  viewRoles: string;
  edit: string;
  id: string;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  cancel: string;
  creatingUser: string;
  showCreateUserForm: string;
  userCreatedSuccessfully: string;
  validationError: string;
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
    users: "Users",
    usersDescription: "Manage enterprise users, access, and account readiness.",
    userDirectory: "User Directory",
    userDirectoryDescription: "Read-only view of enterprise-managed users.",
    roleAssignments: "Role Assignments",
    roleAssignmentsDescription:
      "Role assignment workflows will connect to this workspace next.",
    accessStatus: "Access Status",
    accessStatusDescription:
      "Access readiness tracking is planned for the user management module.",
    createUser: "Create User",
    crudComingNext: "CRUD coming next",
    comingNext: "Coming next",
    readOnly: "Read only",
    loadingUsers: "Loading users...",
    noUsersReturned: "No users were returned by the API.",
    actions: "Actions",
    viewRoles: "View Roles",
    edit: "Edit",
    id: "ID",
    name: "Name",
    email: "Email",
    password: "Password",
    passwordConfirmation: "Password Confirmation",
    cancel: "Cancel",
    creatingUser: "Creating user...",
    showCreateUserForm: "Show create user form",
    userCreatedSuccessfully: "User created successfully.",
    validationError: "Validation error",
    validatingSession: "Validating session...",
    protectedWorkspacePlaceholder: "Protected admin workspace placeholder.",
  },
  es: {
    productName: "Enterprise Core",
    users: "Usuarios",
    usersDescription:
      "Administra usuarios empresariales, acceso y preparación de cuentas.",
    userDirectory: "Directorio de usuarios",
    userDirectoryDescription:
      "Vista de solo lectura de usuarios administrados por la empresa.",
    roleAssignments: "Asignaciones de roles",
    roleAssignmentsDescription:
      "Los flujos de asignación de roles se conectarán a este espacio próximamente.",
    accessStatus: "Estado de acceso",
    accessStatusDescription:
      "El seguimiento de preparación de acceso está planificado para el módulo de gestión de usuarios.",
    createUser: "Crear usuario",
    crudComingNext: "CRUD próximamente",
    comingNext: "Próximamente",
    readOnly: "Solo lectura",
    loadingUsers: "Cargando usuarios...",
    noUsersReturned: "La API no devolvió usuarios.",
    actions: "Acciones",
    viewRoles: "Ver roles",
    edit: "Editar",
    id: "ID",
    name: "Nombre",
    email: "Correo electrónico",
    password: "Contraseña",
    passwordConfirmation: "Confirmación de contraseña",
    cancel: "Cancelar",
    creatingUser: "Creando usuario...",
    showCreateUserForm: "Mostrar formulario para crear usuario",
    userCreatedSuccessfully: "Usuario creado correctamente.",
    validationError: "Error de validación",
    adminWeb: "Admin Web",
    goToLogin: "Ir al inicio de sesión",
    backToOverview: "Volver al resumen",
    signIn: "Iniciar sesión",
    logout: "Cerrar sesión",
    signingOut: "Cerrando sesión...",
    dashboard: "Dashboard",
    validatingSession: "Validando sesión...",
    protectedWorkspacePlaceholder:
      "Marcador de posición del espacio administrativo protegido.",
  },
};

export const defaultMessages = messages[DEFAULT_LANGUAGE];
