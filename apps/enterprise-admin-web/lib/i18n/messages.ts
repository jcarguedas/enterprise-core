import { DEFAULT_LANGUAGE, SupportedLanguage } from "@/lib/i18n/config";

export type SharedMessages = {
  productName: string;
  adminWeb: string;
  goToLogin: string;
  backToOverview: string;
  signIn: string;
  signingIn: string;
  logout: string;
  signingOut: string;
  dashboard: string;
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
  refreshingUsers: string;
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
  loadingUsers: string;
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
  name: string;
  email: string;
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
  protectedWorkspace: string;
  sessionUnavailable: string;
};

export const messages: Record<SupportedLanguage, SharedMessages> = {
  en: {
    productName: "Enterprise Core",
    adminWeb: "Admin Web",
    goToLogin: "Go to Login",
    backToOverview: "Back to overview",
    signIn: "Sign in",
    signingIn: "Signing in...",
    logout: "Logout",
    signingOut: "Signing out...",
    dashboard: "Dashboard",
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
    refreshingUsers: "Refreshing users...",
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
    loadingUsers: "Loading users...",
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
    name: "Name",
    email: "Email",
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
    protectedWorkspace: "Protected Workspace",
    sessionUnavailable: "Session unavailable",
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
    editUser: "Editar usuario",
    refresh: "Actualizar",
    refreshingUsers: "Actualizando usuarios...",
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
    loadingUsers: "Cargando usuarios...",
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
    name: "Nombre",
    email: "Correo electrónico",
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
    adminWeb: "Admin Web",
    goToLogin: "Ir al inicio de sesión",
    backToOverview: "Volver al resumen",
    signIn: "Iniciar sesión",
    signingIn: "Iniciando sesión...",
    logout: "Cerrar sesión",
    signingOut: "Cerrando sesión...",
    dashboard: "Dashboard",
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
    protectedWorkspace: "Espacio protegido",
    sessionUnavailable: "Sesión no disponible",
  },
};

export const defaultMessages = messages[DEFAULT_LANGUAGE];
