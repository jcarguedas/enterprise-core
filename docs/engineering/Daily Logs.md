# Enterprise Engineering

## Sprint 1 - Día 1

Estado: ✅ Completado

### Objetivo

Modernizar completamente el entorno de desarrollo.

### Herramientas instaladas

- Git
- Laravel Herd
- PHP 8.4
- Composer 2.10
- Laravel Installer
- Node.js 22 LTS
- npm
- PostgreSQL 17
- pgAdmin 4

### Problemas resueltos

- Prioridad incorrecta del PATH para PHP.
- Composer utilizando PHP 7.2.
- Conflicto entre NVM y Herd.
- Node.js desactualizado.
- PostgreSQL no disponible desde la terminal.

### Aprendizajes

- Funcionamiento del PATH.
- Gestión de múltiples versiones de PHP.
- Composer depende del PHP activo.
- Administración de versiones de Node mediante NVM.
- Instalación y configuración de PostgreSQL.

## 2026-08-06

### Summary

Se avanzó significativamente en Enterprise Auth Service, estableciendo la base inicial del modelo de autorización RBAC dentro de Enterprise Core.

### Completed

- Configuración de GitHub remoto para el repositorio enterprise-core.
- Publicación de ramas principales:
  - main
  - develop
  - feature/auth-service-bootstrap
- Configuración de Git Credential Manager para evitar ingresar usuario/token en cada push.
- Creación de modelos de dominio:
  - User
  - Role
  - Permission
- Creación de migraciones:
  - roles
  - permissions
  - role_user
  - permission_role
- Ejecución exitosa de migraciones en PostgreSQL.
- Implementación de relaciones RBAC:
  - User belongsToMany Role
  - Role belongsToMany User
  - Role belongsToMany Permission
  - Permission belongsToMany Role
- Implementación de helpers de autorización:
  - User::hasRole()
  - User::hasPermission()
  - Role::hasPermission()
- Creación de seeders iniciales:
  - RoleSeeder
  - PermissionSeeder
- Actualización de DatabaseSeeder.
- Creación de pruebas para:
  - relaciones RBAC
  - helpers de autorización
  - seeders iniciales
  - idempotencia de seeders
- Integración de múltiples feature branches hacia develop usando merge commits.

### Tests

Resultado final:

```text
10 tests passed
23 assertions
```
### Git branches integrated into develop

- feature/auth-domain-models
- feature/auth-rbac-relationship-tests
- feature/auth-rbac-authorization-helpers
- feature/auth-database-seeders
- feature/auth-seeder-tests

### Current status

Enterprise Auth Service cuenta con una base funcional de RBAC, datos iniciales mediante seeders y pruebas automatizadas que validan el comportamiento principal.

### Next steps

- Crear autenticación API real.
- Evaluar JWT / token authentication strategy.
- Crear endpoints iniciales de login/logout.
- Crear pruebas para flujo de autenticación.
- Documentar contratos API.

## 2026-08-07

### Summary

Se avanzó en la implementación del flujo básico de autenticación API para Enterprise Auth Service, utilizando Laravel Sanctum y manteniendo una estrategia basada en pruebas automatizadas y documentación técnica.

### Completed

- Creación del ADR-010 para definir la estrategia de autenticación API.
- Instalación y configuración de Laravel Sanctum.
- Publicación de configuración de Sanctum.
- Ejecución de migración para `personal_access_tokens`.
- Registro de rutas API mediante `routes/api.php`.
- Implementación de endpoints:
  - `GET /api/health`
  - `POST /api/login`
  - `GET /api/me`
  - `POST /api/logout`
- Implementación de generación de tokens Bearer con Sanctum.
- Protección de rutas mediante `auth:sanctum`.
- Implementación de logout revocando el token actual.
- Creación de pruebas automatizadas para:
  - login exitoso
  - login con credenciales inválidas
  - validación de campos requeridos
  - consulta del usuario autenticado
  - acceso no autenticado a rutas protegidas
  - logout autenticado
  - logout no autenticado
- Eliminación de tests genéricos creados por Laravel.
- Creación de documentación API:
  - `services/enterprise-auth-service/docs/API.md`
- Creación de documentación de pruebas manuales:
  - `services/enterprise-auth-service/docs/Manual-Testing.md`
- Creación de documentación de testing:
  - `services/enterprise-auth-service/docs/Testing.md`
- Actualización del README del Auth Service para enlazar documentación técnica.
- Integración de todas las features hacia `develop`.

### Tests

Resultado actual:

```text
15 tests passed
42 assertions
```

### Git branches integrated into develop

- feature/auth-api-authentication-strategy
- feature/auth-sanctum-installation
- feature/auth-login-endpoint
- feature/auth-me-logout-endpoints
- feature/auth-api-documentation
- feature/auth-readme-api-link
- feature/auth-manual-api-testing-notes
- feature/auth-test-cleanup
- feature/auth-testing-documentation

### Current status

Enterprise Auth Service cuenta con autenticación API básica funcional, generación de tokens, rutas protegidas, logout, documentación técnica y pruebas automatizadas reales.

### Next steps

- Implementar endpoint de registro o creación controlada de usuarios.
- Definir política para creación de usuarios administrativos.
- Crear endpoints para gestión de roles.
- Crear endpoints para gestión de permisos.
- Implementar middleware de permisos.
- Evaluar auditoría de autenticación.


## 2026-08-10

### Focus

Continued development of the Enterprise Auth Service, focusing on enterprise-controlled user management and RBAC enforcement.

### Completed

- Added a protected `POST /api/users` endpoint for administrative user creation.
- Added feature tests for user creation scenarios:
  - Authenticated user can create a user.
  - Guest user cannot create a user.
  - Required validation errors are returned correctly.
  - Duplicate email validation is enforced.
- Restored the empty `tests/Unit` directory using `.gitkeep` so PHPUnit can run correctly.
- Added RBAC enforcement to user creation.
- Updated user creation so only authenticated users with the `manage-users` permission can create users.
- Added test coverage for authenticated users without `manage-users`, expecting `403 Forbidden`.
- Added `AGENTS.md` to define project instructions for Codex and future AI-assisted development.
- Used Codex in review mode to inspect the current branch without modifying files.
- Ran final validations:
  - `vendor/bin/pint --dirty --format agent`
  - `php artisan test --compact`
  - `php artisan route:list`

### Results

- `POST /api/users` is now protected by both Sanctum authentication and RBAC authorization.
- Current API behavior:
  - Guest without token: `401 Unauthorized`
  - Authenticated user without `manage-users`: `403 Forbidden`
  - Authenticated user with `manage-users`: `201 Created`
  - Invalid data: `422 Validation Error`
  - Duplicate email: `422 Validation Error`
- Test suite result: `20 passed, 56 assertions`.
- Merged `feature/auth-user-management` into `develop`.
- Merged `feature/auth-user-management-permission` into `develop`.
- `develop` is up to date with `origin/develop`.

### Notes

The user management endpoint is now functionally correct, but the permission check currently lives inside `UserController`. A future improvement is to extract this logic into reusable middleware, such as `RequirePermission`, so administrative routes can be protected declaratively.

### Next Step

Create a reusable permission middleware and protect `POST /api/users` using a route-level permission requirement, for example:

```php
Route::post('/users', [UserController::class, 'store'])
    ->middleware('permission:manage-users');
```

## 2026-08-11

### Focus

Improved the Enterprise Auth Service authorization structure by extracting permission checks from the controller into reusable route middleware.

### Completed

- Created a reusable `RequirePermission` middleware.
- Registered the middleware alias as `permission`.
- Updated `POST /api/users` to use route-level permission protection:

```php
Route::post('/users', [UserController::class, 'store'])
    ->middleware('permission:manage-users');
```

- Removed the direct `manage-users` permission check from `UserController`.
- Kept the existing user management behavior unchanged:
  - Guest users receive `401 Unauthorized`.
  - Authenticated users without `manage-users` receive `403 Forbidden`.
  - Authenticated users with `manage-users` can create users.
- Ran Laravel Pint on dirty files.
- Ran the full test suite after the refactor.
- Added a protected `GET /api/users/{user}` endpoint for administrative user detail retrieval.
- Protected the user detail endpoint with `permission:manage-users`.
- Added test coverage for user detail scenarios:
  - Authenticated user with `manage-users` can view user details.
  - Guest user cannot view user details.
  - Authenticated user without `manage-users` receives `403 Forbidden`.
  - Authenticated user with `manage-users` receives `404 Not Found` when the requested user does not exist.
- Updated `API.md` to document the user detail endpoint.
- Confirmed the route list now includes:
  - `GET /api/users/{user}`
- Test suite result after user detail endpoint: `27 passed, 67 assertions`.
- Added a protected `PATCH /api/users/{user}` endpoint for administrative user updates.
- Protected the user update endpoint with `permission:manage-users`.
- Added test coverage for user update scenarios:
  - Authenticated user with `manage-users` can update a user's name and email.
  - Authenticated user with `manage-users` can update a user's password.
  - Guest user cannot update users.
  - Authenticated user without `manage-users` receives `403 Forbidden`.
  - Authenticated user with `manage-users` receives `404 Not Found` when the requested user does not exist.
  - Duplicate email validation is enforced.
  - Invalid payloads return `422 Validation Error`.
- Updated `API.md` to document the user update endpoint.
- Confirmed the route list now includes:
  - `PATCH /api/users/{user}`
- Test suite result after user update endpoint: `34 passed, 86 assertions`.
- Added `docs/architecture/User-Management.md` to document the User Management architecture.
- Documented the enterprise-controlled user administration model.
- Documented the RBAC security model for user management endpoints.
- Documented current user management capabilities, validation strategy, test coverage, design decisions, and future improvements.
- Removed `docs/architecture/.gitkeep` because the architecture directory now contains real documentation.

### Results

- `POST /api/users` is now protected declaratively through middleware.
- `UserController` is cleaner and focused on user creation.
- Permission authorization is now reusable for future administrative endpoints.
- Test suite result: `20 passed, 56 assertions`.
- Merged `feature/auth-permission-middleware` into `develop`.
- `develop` is up to date with `origin/develop`.
- User management now supports listing users, creating users, and viewing individual user details.
- User management endpoints are protected consistently through reusable permission middleware.
- User management now supports listing, creating, viewing, and updating users.
- User update operations are protected consistently through reusable RBAC permission middleware.
- User Management now has both implementation-level API documentation and architecture-level documentation.
- The architecture documentation explains the security model, route-level authorization, response shape, testing strategy, and future improvements.

### Notes

This refactor improves maintainability because future routes can now declare required permissions directly at the route level instead of duplicating permission checks inside controllers.

### Next Step

Create a protected user listing endpoint:

```php
Route::get('/users', [UserController::class, 'index'])
    ->middleware('permission:manage-users');
```

The endpoint should return a basic list of users and include tests for authorized users, authenticated users without permission, and guests.

- Added a protected `GET /api/users` endpoint for administrative user listing.
- Protected the user listing endpoint with `permission:manage-users`.
- Added test coverage for user listing scenarios:
  - Authenticated user with `manage-users` can list users.
  - Guest user cannot list users.
  - Authenticated user without `manage-users` receives `403 Forbidden`.
- Confirmed the route list now includes both:
  - `GET /api/users`
  - `POST /api/users`
- Test suite result after user listing endpoint: `23 passed, 61 assertions`.


## 2026-08-12

### Focus

Extended Enterprise Auth Service user management with role assignment capabilities.

### Completed

- Added protected user role management endpoints:
  - `GET /api/users/{user}/roles`
  - `POST /api/users/{user}/roles`
- Created `UserRoleController` to keep role assignment logic separate from `UserController`.
- Protected both role management endpoints with `permission:manage-users`.
- Added test coverage for user role management scenarios:
  - Authenticated user with `manage-users` can list a user's roles.
  - Guest user cannot list user roles.
  - Authenticated user without `manage-users` receives `403 Forbidden`.
  - Missing user returns `404 Not Found`.
  - Authenticated user with `manage-users` can assign a role to a user.
  - Assigning the same role twice does not create duplicate role assignments.
  - Invalid or missing `role_id` returns `422 Validation Error`.
- Updated `API.md` to document user role listing and role assignment endpoints.
- Confirmed the route list now includes:
  - `GET /api/users/{user}/roles`
  - `POST /api/users/{user}/roles`
  - Added protected user role removal endpoint:
  - `DELETE /api/users/{user}/roles/{role}`
- Protected the role removal endpoint with `permission:manage-users`.
- Implemented idempotent role removal behavior:
  - If the user has the role, it is detached.
  - If the user does not have the role, the endpoint still returns `200 OK`.
  - The response returns the user's current roles.
- Added test coverage for role removal scenarios:
  - Authenticated user with `manage-users` can remove a role from a user.
  - Removing a role that is not assigned remains idempotent.
  - Guest user cannot remove roles.
  - Authenticated user without `manage-users` receives `403 Forbidden`.
  - Missing user returns `404 Not Found`.
  - Missing role returns `404 Not Found`.
  - Removing one role does not remove other roles assigned to the user.
- Updated `API.md` to document the role removal endpoint.
- Confirmed the route list now includes:
  - `DELETE /api/users/{user}/roles/{role}`
- Performed manual API testing with Postman for the Enterprise Auth Service.
- Created a Postman collection named `Enterprise Auth Service`.
- Configured Postman collection variables:
  - `base_url`
  - `token`
  - `user_id`
  - `role_id`
- Configured a Postman post-response script to automatically store the latest created user ID into the `user_id` collection variable.
- Verified login using the local admin user.
- Verified authenticated profile retrieval with `GET /api/me`.
- Verified user management endpoints manually:
  - `GET /api/users`
  - `POST /api/users`
  - `GET /api/users/{user}`
  - `PATCH /api/users/{user}`
- Verified password update behavior by logging in with the updated user password.
- Verified user role management endpoints manually:
  - `GET /api/users/{user}/roles`
  - `POST /api/users/{user}/roles`
- Confirmed that assigning a role to a user works correctly through Postman.

### Results

- User management now supports listing, creating, viewing, updating, listing roles, and assigning roles.
- Role assignment is idempotent and avoids duplicate pivot records.
- Test suite result: `44 passed, 106 assertions`.
- `develop` is up to date with `origin/develop`.
- User role management now supports listing, assigning, and removing roles.
- User role removal is idempotent and safe for repeated API calls.
- Test suite result after role removal endpoint: `51 passed, 120 assertions`.
- Automated tests and manual Postman testing both confirm the current user management and role assignment flow.
- The local API can now be demonstrated manually using Postman with collection variables and Bearer token authentication.
- Remaining manual testing can continue tomorrow, including role removal, authorization failure cases, validation errors, and not found scenarios.

### Next Step

Add the endpoint to remove a role from a user:

```text
DELETE /api/users/{user}/roles/{role}
```
This endpoint should be protected with permission:manage-users, should be idempotent, and should return the user's current roles after removal.

## 2026-08-13

### Focus

Continued development of Enterprise Core, completing backend RBAC validation, adding role listing support, and bootstrapping the initial admin web frontend.

### Completed

- Continued from a clean `develop` branch.
- Completed manual Postman validation for the user management and RBAC API.
- Verified:
  - `DELETE /api/users/{user}/roles/{role}`
  - `401 Unauthorized` behavior without token
  - `403 Forbidden` behavior with an authenticated user without `manage-users` permission
  - `422 Validation Error` responses for missing fields
  - `422 Validation Error` for duplicated email validation
  - `422 Validation Error` for invalid `role_id` validation
  - `404 Not Found` behavior for missing users
  - `404 Not Found` behavior for missing roles
- Implemented protected role listing endpoint:
  - `GET /api/roles`
  - Protected by `auth:sanctum` and `permission:manage-users`
  - Returns roles ordered by ID ascending
- Added automated tests for `GET /api/roles`.
- Verified automated backend tests:
  - `54 passed`
  - `125 assertions`
- Verified `GET /api/roles` manually in Postman.
- Documented `GET /api/roles` in the auth service API documentation.
- Created the frontend admin web application:
  - `apps/enterprise-admin-web`
  - Next.js
  - TypeScript
  - Tailwind CSS
  - App Router
  - Turbopack
- Verified frontend build and lint.
- Added initial Enterprise Core landing page with a sober modern enterprise dashboard style.
- Reviewed the initial frontend screen in the browser.
- Confirmed the visual direction:
  - modern enterprise dashboard
  - sober and professional
  - subtle SaaS polish
- Captured a future product decision:
  - the system should support English and Spanish
  - future modules should support local currency, Costa Rican colon, and US dollars where applicable

### Results

- Backend user management and RBAC are ready enough to support the first frontend admin workflows.
- The project now has a separated backend service and frontend app structure.
- The frontend foundation is ready for the next feature: login screen and API authentication flow.
- Current backend test suite passes with `54 tests` and `125 assertions`.

### Next Step

- Integrate the admin web bootstrap branch into `develop`.
- Start frontend authentication:
  - `/login` page
  - API login request
  - token storage strategy for development
  - protected dashboard layout
- Later consider internationalization and currency formatting strategy.

## 2026-08-14

### Focus

Continued Enterprise Core frontend development on `feature/admin-web-login`, building the first admin web authentication flow and preparing a lightweight bilingual text foundation.

### Completed

- Started from clean `develop` and created `feature/admin-web-login`.
- Added initial `/login` page for the admin web.
- Updated the landing page "Go to Login" action to navigate to `/login`.
- Added initial API configuration for the frontend using default backend URL `http://127.0.0.1:8000/api`.
- Connected the login form to the Laravel auth API using `POST /api/login`.
- Stored the returned token and user in `localStorage` for the initial development flow.
- Added initial `/dashboard` placeholder page.
- Added basic frontend route behavior:
  - `/dashboard` redirects to `/login` when no token exists.
  - `/login` redirects to `/dashboard` when a token exists.
  - Local logout clears stored auth data.
- Improved dashboard security by validating the stored token with `GET /api/me`.
- Fixed the dashboard refresh behavior so it does not redirect too early during client initialization.
- Confirmed invalid or unauthorized tokens are cleared and redirected to `/login`.
- Added backend logout integration from the dashboard using `POST /api/logout`.
- Added logout loading state.
- Added a lightweight bilingual text foundation:
  - English and Spanish supported.
  - English as default language.
  - Shared message structure added.
- Confirmed future product direction for English/Spanish support and later CRC/USD currency formatting.
- Ran frontend build and lint successfully.
- Performed manual browser testing for:
  - login success
  - dashboard access
  - dashboard refresh
  - invalid routes
  - logout
  - backend unavailable behavior

### Results

- The admin web now has a functional first authentication flow.
- The dashboard now validates the session against the Laravel backend instead of trusting `localStorage` alone.
- The frontend has an initial structure for bilingual text support.
- The feature is ready to be integrated into `develop`.

### Next Step

- Merge `feature/admin-web-login` into `develop`.
- Start the protected admin layout and first real dashboard structure.
- Then begin the Users UI that consumes the existing user management API.

## 2026-08-17

### Focus

- Continued Enterprise Core admin web development.
- Built the first protected admin layout foundation.
- Started the Users module UI connected to the existing Laravel API.

### Completed

- Started from clean `develop` and created `feature/admin-web-protected-layout`.
- Added protected admin layout components:
  - `AdminShell`
  - `AdminSidebar`
  - `AdminHeader`
- Refactored `/dashboard` to use the new protected admin layout.
- Added sidebar navigation for:
  - Dashboard
  - Users
  - Roles
  - Settings
- Added active navigation behavior for Dashboard and Users.
- Confirmed browser extension hydration warning was not an app bug by testing in incognito mode.
- Created `/users` protected page.
- Extracted shared protected session logic into `use-protected-admin-session`.
- Connected Users page to the existing backend endpoint `GET /api/users`.
- Added typed users API helper in `lib/users-api.ts`.
- Added loading, error, unauthorized, and empty-state handling for Users.
- Added read-only Users table with ID, Name, Email.
- Extracted shared admin UI components:
  - `PageHeader`
  - `StatusMessage`
  - `SummaryCard`
- Extracted `UsersTable` into `components/admin/users/UsersTable.tsx`.
- Added disabled Create User placeholder action.
- Added disabled Users table placeholder actions:
  - View Roles
  - Edit
- Expanded i18n messages with Users-related English and Spanish labels.
- Fixed Spanish accents and encoding in i18n messages.
- Kept runtime language switching out of scope for now.
- Ran frontend build and lint successfully.
- Ran backend test suite successfully:
  - `54 passed`
  - `125 assertions`
- Performed manual browser testing:
  - login
  - dashboard access
  - users navigation
  - users table loading
  - sidebar active state
  - dashboard refresh
  - users refresh
  - logout from protected area
  - redirect to `/login` without session

### Results

- Admin web now has a reusable protected layout foundation.
- Dashboard and Users share the same shell/header/sidebar structure.
- Users is the first admin page consuming real backend data.
- Users CRUD is visually prepared but not functionally implemented yet.
- The frontend structure is cleaner and better prepared for the next CRUD steps.

### Next Step

- Merge `feature/admin-web-protected-layout` into `develop`.
- Start implementing the first real Users CRUD action, likely Create User.
- Consider extracting more reusable table/action patterns only when needed.
- Add runtime language switching later in a dedicated branch.
