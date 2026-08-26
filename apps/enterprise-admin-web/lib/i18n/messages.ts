import { DEFAULT_LANGUAGE, SupportedLanguage } from "@/lib/i18n/config";

export type SharedMessages = {
  productName: string;
  adminWeb: string;
  platformFoundation: string;
  landingEyebrow: string;
  landingSubtitle: string;
  landingDescription: string;
  viewArchitecture: string;
  operationsOverview: string;
  identityAndAccess: string;
  managed: string;
  available: string;
  protected: string;
  permissions: string;
  module: string;
  scope: string;
  coreApi: string;
  rbac: string;
  governance: string;
  modules: string;
  roadmap: string;
  planned: string;
  capabilityUserManagementTitle: string;
  capabilityUserManagementDescription: string;
  capabilityRbacTitle: string;
  capabilityRbacDescription: string;
  capabilityPlatformTitle: string;
  capabilityPlatformDescription: string;
  goToLogin: string;
  backToOverview: string;
  loginEyebrow: string;
  loginTitle: string;
  loginDescription: string;
  signInToAdmin: string;
  accessPortal: string;
  passwordPlaceholder: string;
  loginDefaultError: string;
  loginGenericError: string;
  loginIncompleteResponse: string;
  authServiceUnavailable: string;
  apiErrorInvalidCredentials: string;
  apiErrorEmailAlreadyTaken: string;
  apiErrorInactiveAccount: string;
  apiErrorEmailRequired: string;
  apiErrorPasswordRequired: string;
  apiErrorNameRequired: string;
  apiErrorPasswordMinLength: string;
  apiErrorPasswordConfirmationMismatch: string;
  apiErrorPasswordConfirmationRequired: string;
  show: string;
  hide: string;
  showPassword: string;
  hidePassword: string;
  signIn: string;
  signingIn: string;
  logout: string;
  signingOut: string;
  command: string;
  commandPalette: string;
  commandPaletteDescription: string;
  editUserCommand: string;
  editUserFor: string;
  customerSearchFor: string;
  searchUser: string;
  searchUsersFor: string;
  searchCommands: string;
  noCommandsFound: string;
  customers: string;
  customerManagement: string;
  customersDescription: string;
  customersReadOnlyDescription: string;
  customersAccessDenied: string;
  customersAccessDeniedDescription: string;
  customersLoadError: string;
  closeCommandPalette: string;
  dashboard: string;
  dashboardDescription: string;
  dashboardWelcome: string;
  system: string;
  systemDescription: string;
  systemEvents: string;
  systemEventsDescription: string;
  systemEventsSummaryDescription: string;
  systemEventsReadOnlyStatus: string;
  systemEventsPermissionDescription: string;
  viewSystemEvents: string;
  refreshEvents: string;
  refreshingEvents: string;
  loadingSystemEvents: string;
  noSystemEventsFound: string;
  eventType: string;
  severity: string;
  actor: string;
  target: string;
  message: string;
  dateTime: string;
  systemEventsAccessDenied: string;
  systemEventsAccessDeniedDescription: string;
  systemEventsLoadError: string;
  systemInformation: string;
  systemInformationDescription: string;
  productDisplayNameLabel: string;
  productVersionLabel: string;
  adminApp: string;
  apiBaseUrl: string;
  authenticationProvider: string;
  enterpriseAuthService: string;
  updateMode: string;
  manualUpdatesFutureNetworkPlanned: string;
  deploymentModel: string;
  localFirstDirection: string;
  releaseInformation: string;
  releaseInformationDescription: string;
  updateStrategyStatus: string;
  updateStrategyDescription: string;
  administratorFallback: string;
  unavailable: string;
  accountSummary: string;
  signedIn: string;
  sessionSecurity: string;
  authenticated: string;
  sessionSecurityDescription: string;
  userManagement: string;
  ready: string;
  userManagementDescription: string;
  manageUsers: string;
  users: string;
  roles: string;
  rolesDescription: string;
  rolesCatalog: string;
  rolesCatalogDescription: string;
  noRolesReturned: string;
  rolesAccessDenied: string;
  rolesAccessDeniedDescription: string;
  roleDescription: string;
  settings: string;
  settingsDescription: string;
  settingsInformationalNotice: string;
  workspacePreferences: string;
  workspacePreferencesDescription: string;
  localizationSettings: string;
  localizationSettingsDescription: string;
  appearanceSettings: string;
  appearanceSettingsDescription: string;
  securitySettings: string;
  securitySettingsDescription: string;
  browserRuntime: string;
  future: string;
  usersDescription: string;
  userDirectory: string;
  userDirectoryDescription: string;
  roleAssignments: string;
  roleAssignmentsDescription: string;
  accessStatus: string;
  accessStatusDescription: string;
  createUser: string;
  editUser: string;
  refresh: string;
  refreshCustomers: string;
  refreshingCustomers: string;
  refreshingUsers: string;
  searchCustomers: string;
  searchCustomersPlaceholder: string;
  searchUsers: string;
  searchUsersPlaceholder: string;
  clearSearch: string;
  noUsersMatchSearch: string;
  showingUsersCount: string;
  usersPerPage: string;
  previousPage: string;
  nextPage: string;
  usersPageCount: string;
  enterpriseAccountAvailable: string;
  enterpriseAccountsAvailable: string;
  sortById: string;
  sortByName: string;
  sortByEmail: string;
  sortByStatus: string;
  saveChanges: string;
  crudComingNext: string;
  comingNext: string;
  readOnly: string;
  loadingCustomers: string;
  loadingUsers: string;
  noCustomersFound: string;
  noCustomersMatchSearch: string;
  noUsersReturned: string;
  actions: string;
  status: string;
  viewRoles: string;
  close: string;
  dismissMessage: string;
  loadingRoles: string;
  noRolesAssigned: string;
  roleSlug: string;
  roleStatus: string;
  active: string;
  inactive: string;
  userRoles: string;
  assignRole: string;
  availableRoles: string;
  selectRole: string;
  assigningRole: string;
  roleAssignedSuccessfully: string;
  noAvailableRoles: string;
  removeRole: string;
  removingRole: string;
  roleRemovedSuccessfully: string;
  deactivateUser: string;
  reactivateUser: string;
  deactivatingUser: string;
  reactivatingUser: string;
  userDeactivatedSuccessfully: string;
  userReactivatedSuccessfully: string;
  cannotDeactivateOwnAccount: string;
  edit: string;
  id: string;
  identification: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  cancel: string;
  creatingUser: string;
  updatingUser: string;
  showCreateUserForm: string;
  userCreatedSuccessfully: string;
  userUpdatedSuccessfully: string;
  inactiveAccountLoginMessage: string;
  validationError: string;
  validatingSession: string;
  protectedWorkspacePlaceholder: string;
  userManagementUnavailable: string;
  userManagementUnavailableDescription: string;
  userManagementAccessDenied: string;
  userManagementAccessDeniedDescription: string;
  restricted: string;
  backToDashboard: string;
  language: string;
  english: string;
  spanish: string;
  theme: string;
  light: string;
  dark: string;
  protectedWorkspace: string;
  sessionUnavailable: string;
};

export const messages: Record<SupportedLanguage, SharedMessages> = {
  en: {
    productName: "Enterprise Core",
    adminWeb: "Admin Web",
    platformFoundation: "Platform foundation",
    landingEyebrow: "Enterprise administration workspace",
    landingSubtitle: "Intelligent Business Operations Platform",
    landingDescription:
      "This admin web app will manage users, roles, permissions, and future enterprise modules from a secure, API-first operations console.",
    viewArchitecture: "View Architecture",
    operationsOverview: "Operations Overview",
    identityAndAccess: "Identity and access",
    managed: "Managed",
    available: "Available",
    protected: "Protected",
    permissions: "Permissions",
    module: "Module",
    scope: "Scope",
    coreApi: "Core API",
    rbac: "RBAC",
    governance: "Governance",
    modules: "Modules",
    roadmap: "Roadmap",
    planned: "Planned",
    capabilityUserManagementTitle: "User Management",
    capabilityUserManagementDescription:
      "Administer enterprise-controlled identities, access status, and operator workflows from a focused web console.",
    capabilityRbacTitle: "Role-Based Access Control",
    capabilityRbacDescription:
      "Model roles, permissions, and administrative boundaries with clear visibility across protected operations.",
    capabilityPlatformTitle: "Modular Enterprise Platform",
    capabilityPlatformDescription:
      "Prepare the workspace for future business modules while keeping identity and governance at the core.",
    goToLogin: "Go to Login",
    backToOverview: "Back to overview",
    loginEyebrow: "Secure operations console",
    loginTitle: "Admin Web Access",
    loginDescription:
      "Access is controlled by enterprise administrators. Use your assigned credentials to enter the protected admin workspace.",
    signInToAdmin: "Sign in to admin",
    accessPortal: "Enterprise-controlled access portal",
    passwordPlaceholder: "Enter your password",
    loginDefaultError: "Unable to sign in. Please verify your credentials.",
    loginGenericError: "Unable to sign in. Please try again shortly.",
    loginIncompleteResponse:
      "The login response was incomplete. Please try again.",
    authServiceUnavailable:
      "Unable to reach the auth service. Please confirm it is running and try again.",
    apiErrorInvalidCredentials: "Invalid credentials.",
    apiErrorEmailAlreadyTaken: "The email has already been taken.",
    apiErrorInactiveAccount:
      "Your account is inactive. Contact an administrator.",
    apiErrorEmailRequired: "The email field is required.",
    apiErrorPasswordRequired: "The password field is required.",
    apiErrorNameRequired: "The name field is required.",
    apiErrorPasswordMinLength:
      "The password field must be at least 8 characters.",
    apiErrorPasswordConfirmationMismatch:
      "The password confirmation field does not match.",
    apiErrorPasswordConfirmationRequired:
      "The password confirmation field is required.",
    show: "Show",
    hide: "Hide",
    showPassword: "Show password",
    hidePassword: "Hide password",
    signIn: "Sign in",
    signingIn: "Signing in...",
    logout: "Logout",
    signingOut: "Signing out...",
    command: "Command",
    commandPalette: "Command Palette",
    commandPaletteDescription:
      "Search and open known Admin Web destinations. This palette only supports safe navigation commands.",
    editUserCommand: "Edit user",
    editUserFor: 'Edit user "{query}"',
    customerSearchFor: 'Search customers for "{query}"',
    searchUser: "Search user",
    searchUsersFor: 'Search users for "{query}"',
    searchCommands: "Search commands",
    noCommandsFound: "No matching commands were found.",
    customers: "Customers",
    customerManagement: "Customer Management",
    customersDescription: "View and search business customers.",
    customersReadOnlyDescription:
      "This first business module view is read-only. Create, edit, delete, export, and status changes are not implemented here yet.",
    customersAccessDenied: "Customers access denied",
    customersAccessDeniedDescription:
      "You do not have permission to view customers.",
    customersLoadError:
      "Unable to load customers. Please try again shortly.",
    closeCommandPalette: "Close command palette",
    dashboard: "Dashboard",
    dashboardDescription:
      "Protected admin workspace for Enterprise Core operations.",
    dashboardWelcome: "Welcome, {name}.",
    system: "System",
    systemDescription:
      "Read-only product, deployment, and update strategy information for this Admin Web instance.",
    systemEvents: "System Events",
    systemEventsDescription:
      "View chronological system activity and security events.",
    systemEventsSummaryDescription:
      "Open the read-only activity log for authentication, access, and user administration events.",
    systemEventsReadOnlyStatus: "Read only",
    systemEventsPermissionDescription:
      "This page requires the view-system-events permission.",
    viewSystemEvents: "View System Events",
    refreshEvents: "Refresh events",
    refreshingEvents: "Refreshing events...",
    loadingSystemEvents: "Loading system events...",
    noSystemEventsFound: "No system events found.",
    eventType: "Event type",
    severity: "Severity",
    actor: "Actor",
    target: "Target",
    message: "Message",
    dateTime: "Date/time",
    systemEventsAccessDenied: "System events access denied",
    systemEventsAccessDeniedDescription:
      "You do not have permission to view system events.",
    systemEventsLoadError:
      "Unable to load system events. Please try again shortly.",
    systemInformation: "System Information",
    systemInformationDescription:
      "Current runtime details for the protected administration interface.",
    productDisplayNameLabel: "Product display name",
    productVersionLabel: "Product version",
    adminApp: "Admin app",
    apiBaseUrl: "API base URL",
    authenticationProvider: "Authentication provider",
    enterpriseAuthService: "Enterprise Auth Service",
    updateMode: "Update mode",
    manualUpdatesFutureNetworkPlanned:
      "Manual updates / future update network planned",
    deploymentModel: "Deployment model",
    localFirstDirection: "Local-first direction",
    releaseInformation: "Release Information",
    releaseInformationDescription:
      "The version label identifies this product build. Real update checking and distribution are not implemented yet.",
    updateStrategyStatus: "Manual",
    updateStrategyDescription:
      "Future local-first deployments should be notified of available releases, then upgraded only after an administrator reviews notes, prepares backups, and approves the update.",
    administratorFallback: "administrator",
    unavailable: "Unavailable",
    accountSummary: "Account Summary",
    signedIn: "Signed in",
    sessionSecurity: "Session Security",
    authenticated: "Authenticated",
    sessionSecurityDescription:
      "This workspace validates your stored session with the Enterprise Auth Service before protected admin content is shown.",
    userManagement: "User Management",
    ready: "Ready",
    userManagementDescription:
      "Review enterprise users, manage account status, and maintain role assignments from the Users workspace.",
    manageUsers: "Manage users",
    users: "Users",
    roles: "Roles",
    rolesDescription:
      "Review enterprise roles and their current availability for access workflows.",
    rolesCatalog: "Roles Catalog",
    rolesCatalogDescription:
      "Read-only view of roles managed by the Enterprise Auth Service.",
    noRolesReturned: "No roles were returned by the API.",
    rolesAccessDenied: "Access denied",
    rolesAccessDeniedDescription:
      "Your account does not currently have permission to view roles.",
    roleDescription: "Description",
    settings: "Settings",
    settingsDescription:
      "Protected area for future workspace, localization, security, and system preferences.",
    settingsInformationalNotice:
      "This page is informational only. Settings are not persisted from this page yet.",
    workspacePreferences: "Workspace Preferences",
    workspacePreferencesDescription:
      "Future configurable company and workspace settings will be managed here.",
    localizationSettings: "Localization",
    localizationSettingsDescription:
      "The current language is handled at runtime in the browser and can be changed from the language selector.",
    appearanceSettings: "Appearance",
    appearanceSettingsDescription:
      "The current theme is handled at runtime in the browser and can be changed from the theme selector.",
    securitySettings: "Security Settings",
    securitySettingsDescription:
      "Future password, session, and security policy settings may be managed here.",
    browserRuntime: "Browser runtime",
    future: "Future",
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
    editUser: "Edit User",
    refresh: "Refresh",
    refreshCustomers: "Refresh customers",
    refreshingCustomers: "Refreshing customers...",
    refreshingUsers: "Refreshing users...",
    searchCustomers: "Search customers",
    searchCustomersPlaceholder:
      "Search by ID, name, email, phone, identification, or status",
    searchUsers: "Search users",
    searchUsersPlaceholder: "Search by ID, name, email, or status",
    clearSearch: "Clear search",
    noUsersMatchSearch: "No users match your search.",
    showingUsersCount: "Showing {visible} of {total} users",
    usersPerPage: "Users per page",
    previousPage: "Previous",
    nextPage: "Next",
    usersPageCount: "Page {current} of {total}",
    enterpriseAccountAvailable: "1 enterprise account available.",
    enterpriseAccountsAvailable: "{count} enterprise accounts available.",
    sortById: "Sort by ID",
    sortByName: "Sort by name",
    sortByEmail: "Sort by email",
    sortByStatus: "Sort by status",
    saveChanges: "Save changes",
    crudComingNext: "CRUD coming next",
    comingNext: "Coming next",
    readOnly: "Read only",
    loadingCustomers: "Loading customers...",
    loadingUsers: "Loading users...",
    noCustomersFound: "No customers found.",
    noCustomersMatchSearch: "No customers match your search.",
    noUsersReturned: "No users were returned by the API.",
    actions: "Actions",
    status: "Status",
    viewRoles: "View Roles",
    close: "Close",
    dismissMessage: "Dismiss message",
    loadingRoles: "Loading roles...",
    noRolesAssigned: "No roles are assigned to this user.",
    roleSlug: "Slug",
    roleStatus: "Status",
    active: "Active",
    inactive: "Inactive",
    userRoles: "User Roles",
    assignRole: "Assign Role",
    availableRoles: "Available Roles",
    selectRole: "Select a role",
    assigningRole: "Assigning role...",
    roleAssignedSuccessfully: "Role assigned successfully.",
    noAvailableRoles: "No active roles are available to assign.",
    removeRole: "Remove",
    removingRole: "Removing...",
    roleRemovedSuccessfully: "Role removed successfully.",
    deactivateUser: "Deactivate",
    reactivateUser: "Reactivate",
    deactivatingUser: "Deactivating...",
    reactivatingUser: "Reactivating...",
    userDeactivatedSuccessfully: "User deactivated successfully.",
    userReactivatedSuccessfully: "User reactivated successfully.",
    cannotDeactivateOwnAccount: "You cannot deactivate your own account.",
    edit: "Edit",
    id: "ID",
    identification: "Identification",
    name: "Name",
    email: "Email",
    phone: "Phone",
    password: "Password",
    passwordConfirmation: "Password Confirmation",
    cancel: "Cancel",
    creatingUser: "Creating user...",
    updatingUser: "Updating user...",
    showCreateUserForm: "Show create user form",
    userCreatedSuccessfully: "User created successfully.",
    userUpdatedSuccessfully: "User updated successfully.",
    inactiveAccountLoginMessage:
      "Your account is inactive. Contact an administrator.",
    validationError: "Validation error",
    validatingSession: "Validating session...",
    protectedWorkspacePlaceholder: "Protected admin workspace placeholder.",
    userManagementUnavailable: "User Management Unavailable",
    userManagementUnavailableDescription:
      "Your account does not currently include access to user management.",
    userManagementAccessDenied: "Access denied",
    userManagementAccessDeniedDescription:
      "Your account does not currently have permission to manage users.",
    restricted: "Restricted",
    backToDashboard: "Back to Dashboard",
    language: "Language",
    english: "English",
    spanish: "Spanish",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    protectedWorkspace: "Protected Workspace",
    sessionUnavailable: "Session unavailable",
  },
  es: {
    productName: "Enterprise Core",
    adminWeb: "Admin Web",
    platformFoundation: "Base de plataforma",
    landingEyebrow: "Espacio de administración empresarial",
    landingSubtitle: "Plataforma inteligente de operaciones empresariales",
    landingDescription:
      "Esta aplicación administrativa gestionará usuarios, roles, permisos y futuros módulos empresariales desde una consola de operaciones segura y API-first.",
    viewArchitecture: "Ver arquitectura",
    operationsOverview: "Resumen de operaciones",
    identityAndAccess: "Identidad y acceso",
    managed: "Gestionados",
    available: "Disponibles",
    protected: "Protegidos",
    permissions: "Permisos",
    module: "Módulo",
    scope: "Alcance",
    coreApi: "API central",
    rbac: "RBAC",
    governance: "Gobernanza",
    modules: "Módulos",
    roadmap: "Roadmap",
    planned: "Planificado",
    capabilityUserManagementTitle: "Gestión de usuarios",
    capabilityUserManagementDescription:
      "Administra identidades controladas por la empresa, estado de acceso y flujos operativos desde una consola web enfocada.",
    capabilityRbacTitle: "Control de acceso basado en roles",
    capabilityRbacDescription:
      "Modela roles, permisos y límites administrativos con visibilidad clara sobre operaciones protegidas.",
    capabilityPlatformTitle: "Plataforma empresarial modular",
    capabilityPlatformDescription:
      "Prepara el espacio de trabajo para futuros módulos de negocio manteniendo identidad y gobernanza en el centro.",
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
    editUser: "Editar usuario",
    refresh: "Actualizar",
    refreshCustomers: "Actualizar clientes",
    refreshingCustomers: "Actualizando clientes...",
    refreshingUsers: "Actualizando usuarios...",
    searchCustomers: "Buscar clientes",
    searchCustomersPlaceholder:
      "Busca por ID, nombre, correo, teléfono, identificación o estado",
    searchUsers: "Buscar usuarios",
    searchUsersPlaceholder:
      "Busca por ID, nombre, correo electrónico o estado",
    clearSearch: "Limpiar búsqueda",
    noUsersMatchSearch: "Ningún usuario coincide con tu búsqueda.",
    showingUsersCount: "Mostrando {visible} de {total} usuarios",
    usersPerPage: "Usuarios por página",
    previousPage: "Anterior",
    nextPage: "Siguiente",
    usersPageCount: "Página {current} de {total}",
    enterpriseAccountAvailable: "1 cuenta empresarial disponible.",
    enterpriseAccountsAvailable: "{count} cuentas empresariales disponibles.",
    sortById: "Ordenar por ID",
    sortByName: "Ordenar por nombre",
    sortByEmail: "Ordenar por correo electrónico",
    sortByStatus: "Ordenar por estado",
    saveChanges: "Guardar cambios",
    crudComingNext: "CRUD próximamente",
    comingNext: "Próximamente",
    readOnly: "Solo lectura",
    loadingCustomers: "Cargando clientes...",
    loadingUsers: "Cargando usuarios...",
    noCustomersFound: "No se encontraron clientes.",
    noCustomersMatchSearch: "Ningún cliente coincide con tu búsqueda.",
    noUsersReturned: "La API no devolvió usuarios.",
    actions: "Acciones",
    status: "Estado",
    viewRoles: "Ver roles",
    close: "Cerrar",
    dismissMessage: "Cerrar mensaje",
    loadingRoles: "Cargando roles...",
    noRolesAssigned: "Este usuario no tiene roles asignados.",
    roleSlug: "Slug",
    roleStatus: "Estado",
    active: "Activo",
    inactive: "Inactivo",
    userRoles: "Roles del usuario",
    assignRole: "Asignar rol",
    availableRoles: "Roles disponibles",
    selectRole: "Selecciona un rol",
    assigningRole: "Asignando rol...",
    roleAssignedSuccessfully: "Rol asignado correctamente.",
    noAvailableRoles: "No hay roles activos disponibles para asignar.",
    removeRole: "Quitar",
    removingRole: "Quitando...",
    roleRemovedSuccessfully: "Rol quitado correctamente.",
    deactivateUser: "Desactivar",
    reactivateUser: "Reactivar",
    deactivatingUser: "Desactivando...",
    reactivatingUser: "Reactivando...",
    userDeactivatedSuccessfully: "Usuario desactivado correctamente.",
    userReactivatedSuccessfully: "Usuario reactivado correctamente.",
    cannotDeactivateOwnAccount: "No puedes desactivar tu propia cuenta.",
    edit: "Editar",
    id: "ID",
    identification: "Identificación",
    name: "Nombre",
    email: "Correo electrónico",
    phone: "Teléfono",
    password: "Contraseña",
    passwordConfirmation: "Confirmación de contraseña",
    cancel: "Cancelar",
    creatingUser: "Creando usuario...",
    updatingUser: "Actualizando usuario...",
    showCreateUserForm: "Mostrar formulario para crear usuario",
    userCreatedSuccessfully: "Usuario creado correctamente.",
    userUpdatedSuccessfully: "Usuario actualizado correctamente.",
    inactiveAccountLoginMessage:
      "Tu cuenta está inactiva. Contacta a un administrador.",
    validationError: "Error de validación",
    goToLogin: "Ir al inicio de sesión",
    backToOverview: "Volver al resumen",
    loginEyebrow: "Consola segura de operaciones",
    loginTitle: "Acceso a Admin Web",
    loginDescription:
      "El acceso es controlado por administradores empresariales. Usa tus credenciales asignadas para entrar al espacio administrativo protegido.",
    signInToAdmin: "Iniciar sesión en admin",
    accessPortal: "Portal de acceso controlado por la empresa",
    passwordPlaceholder: "Ingresa tu contraseña",
    loginDefaultError:
      "No se pudo iniciar sesión. Verifica tus credenciales.",
    loginGenericError:
      "No se pudo iniciar sesión. Inténtalo de nuevo pronto.",
    loginIncompleteResponse:
      "La respuesta de inicio de sesión está incompleta. Inténtalo de nuevo.",
    authServiceUnavailable:
      "No se pudo conectar con el servicio de autenticación. Confirma que esté en ejecución e inténtalo de nuevo.",
    apiErrorInvalidCredentials: "Credenciales inválidas.",
    apiErrorEmailAlreadyTaken: "El correo electrónico ya está en uso.",
    apiErrorInactiveAccount:
      "Tu cuenta está inactiva. Contacta a un administrador.",
    apiErrorEmailRequired: "El correo electrónico es obligatorio.",
    apiErrorPasswordRequired: "La contraseña es obligatoria.",
    apiErrorNameRequired: "El nombre es obligatorio.",
    apiErrorPasswordMinLength:
      "La contraseña debe tener al menos 8 caracteres.",
    apiErrorPasswordConfirmationMismatch:
      "La confirmación de contraseña no coincide.",
    apiErrorPasswordConfirmationRequired:
      "La confirmación de contraseña es obligatoria.",
    show: "Mostrar",
    hide: "Ocultar",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    signIn: "Iniciar sesión",
    signingIn: "Iniciando sesión...",
    logout: "Cerrar sesión",
    signingOut: "Cerrando sesión...",
    command: "Comando",
    commandPalette: "Paleta de comandos",
    commandPaletteDescription:
      "Busca y abre destinos conocidos de Admin Web. Esta paleta solo permite comandos seguros de navegación.",
    editUserCommand: "Editar usuario",
    editUserFor: 'Editar usuario "{query}"',
    customerSearchFor: 'Buscar clientes por "{query}"',
    searchUser: "Buscar usuario",
    searchUsersFor: 'Buscar usuarios por "{query}"',
    searchCommands: "Buscar comandos",
    noCommandsFound: "No se encontraron comandos coincidentes.",
    customers: "Clientes",
    customerManagement: "Gestión de clientes",
    customersDescription: "Consulta y busca clientes del negocio.",
    customersReadOnlyDescription:
      "Esta primera vista del módulo de negocio es de solo lectura. Crear, editar, eliminar, exportar y cambiar estados aún no están implementados aquí.",
    customersAccessDenied: "Acceso a clientes denegado",
    customersAccessDeniedDescription:
      "No tienes permiso para ver clientes.",
    customersLoadError:
      "No se pudieron cargar los clientes. Inténtalo de nuevo pronto.",
    closeCommandPalette: "Cerrar paleta de comandos",
    dashboard: "Dashboard",
    dashboardDescription:
      "Espacio administrativo protegido para operaciones de Enterprise Core.",
    dashboardWelcome: "Bienvenido, {name}.",
    system: "Sistema",
    systemDescription:
      "Información de solo lectura sobre producto, despliegue y estrategia de actualizaciones para esta instancia de Admin Web.",
    systemEvents: "Eventos del sistema",
    systemEventsDescription:
      "Consulta la actividad cronológica del sistema y eventos de seguridad.",
    systemEventsSummaryDescription:
      "Abre el registro de actividad de solo lectura para eventos de autenticación, acceso y administración de usuarios.",
    systemEventsReadOnlyStatus: "Solo lectura",
    systemEventsPermissionDescription:
      "Esta página requiere el permiso view-system-events.",
    viewSystemEvents: "Ver eventos del sistema",
    refreshEvents: "Actualizar eventos",
    refreshingEvents: "Actualizando eventos...",
    loadingSystemEvents: "Cargando eventos del sistema...",
    noSystemEventsFound: "No se encontraron eventos del sistema.",
    eventType: "Tipo de evento",
    severity: "Severidad",
    actor: "Actor",
    target: "Destino",
    message: "Mensaje",
    dateTime: "Fecha/hora",
    systemEventsAccessDenied: "Acceso a eventos del sistema denegado",
    systemEventsAccessDeniedDescription:
      "No tienes permiso para ver eventos del sistema.",
    systemEventsLoadError:
      "No se pudieron cargar los eventos del sistema. Inténtalo de nuevo pronto.",
    systemInformation: "Información del sistema",
    systemInformationDescription:
      "Detalles actuales de ejecución para la interfaz administrativa protegida.",
    productDisplayNameLabel: "Nombre visible del producto",
    productVersionLabel: "Versión del producto",
    adminApp: "Aplicación admin",
    apiBaseUrl: "URL base de API",
    authenticationProvider: "Proveedor de autenticación",
    enterpriseAuthService: "Enterprise Auth Service",
    updateMode: "Modo de actualización",
    manualUpdatesFutureNetworkPlanned:
      "Actualizaciones manuales / red futura de actualizaciones planificada",
    deploymentModel: "Modelo de despliegue",
    localFirstDirection: "Dirección local-first",
    releaseInformation: "Información de release",
    releaseInformationDescription:
      "La etiqueta de versión identifica este build del producto. La verificación y distribución real de actualizaciones aún no está implementada.",
    updateStrategyStatus: "Manual",
    updateStrategyDescription:
      "Los futuros despliegues local-first deberían recibir avisos de releases disponibles y actualizarse solo después de que un administrador revise notas, prepare backups y apruebe la actualización.",
    administratorFallback: "administrador",
    unavailable: "No disponible",
    accountSummary: "Resumen de cuenta",
    signedIn: "Sesión iniciada",
    sessionSecurity: "Seguridad de sesión",
    authenticated: "Autenticado",
    sessionSecurityDescription:
      "Este espacio valida tu sesión almacenada con Enterprise Auth Service antes de mostrar contenido administrativo protegido.",
    userManagement: "Gestión de usuarios",
    ready: "Listo",
    userManagementDescription:
      "Revisa usuarios empresariales, administra el estado de cuentas y mantiene asignaciones de roles desde el espacio de Usuarios.",
    manageUsers: "Administrar usuarios",
    roles: "Roles",
    rolesDescription:
      "Revisa roles empresariales y su disponibilidad actual para flujos de acceso.",
    rolesCatalog: "Catálogo de roles",
    rolesCatalogDescription:
      "Vista de solo lectura de roles administrados por Enterprise Auth Service.",
    noRolesReturned: "La API no devolvió roles.",
    rolesAccessDenied: "Acceso denegado",
    rolesAccessDeniedDescription:
      "Tu cuenta no tiene permiso actualmente para ver roles.",
    roleDescription: "Descripción",
    settings: "Configuración",
    settingsDescription:
      "Área protegida para futuras preferencias de espacio de trabajo, localización, seguridad y sistema.",
    settingsInformationalNotice:
      "Esta página es solo informativa. Todavía no persiste configuraciones.",
    workspacePreferences: "Preferencias del espacio de trabajo",
    workspacePreferencesDescription:
      "Las futuras configuraciones de empresa y espacio de trabajo se administrarán aquí.",
    localizationSettings: "Localización",
    localizationSettingsDescription:
      "El idioma actual se maneja en tiempo de ejecución en el navegador y puede cambiarse desde el selector de idioma.",
    appearanceSettings: "Apariencia",
    appearanceSettingsDescription:
      "El tema actual se maneja en tiempo de ejecución en el navegador y puede cambiarse desde el selector de tema.",
    securitySettings: "Configuración de seguridad",
    securitySettingsDescription:
      "Las futuras políticas de contraseña, sesión y seguridad podrían administrarse aquí.",
    browserRuntime: "Runtime del navegador",
    future: "Futuro",
    validatingSession: "Validando sesión...",
    protectedWorkspacePlaceholder:
      "Marcador de posición del espacio administrativo protegido.",
    userManagementUnavailable: "Gestión de usuarios no disponible",
    userManagementUnavailableDescription:
      "Tu cuenta no incluye acceso a la gestión de usuarios actualmente.",
    userManagementAccessDenied: "Acceso denegado",
    userManagementAccessDeniedDescription:
      "Tu cuenta no tiene permiso actualmente para administrar usuarios.",
    restricted: "Restringido",
    backToDashboard: "Volver al Dashboard",
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    protectedWorkspace: "Espacio protegido",
    sessionUnavailable: "Sesión no disponible",
  },
};

export const defaultMessages = messages[DEFAULT_LANGUAGE];
