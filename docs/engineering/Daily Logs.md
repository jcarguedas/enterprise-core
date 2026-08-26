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

## 2026-08-18

### Focus

Continued Enterprise Core admin web development, completing the first real Users module CRUD flows and documenting the current frontend capabilities.

### Completed

- Implemented Create User flow in the admin web.
- Added typed `createUser` API helper using `POST /api/users`.
- Added password confirmation support required by backend validation.
- Added validation error handling for `422` responses.
- Extracted `CreateUserForm` component.
- Extracted `useCreateUser` hook.
- Added manual users Refresh action.
- Merged create-user work into `develop` and pushed it.
- Implemented Edit User flow in the admin web.
- Added typed `updateUser` API helper using `PATCH /api/users/{userId}`.
- Added `EditUserForm` component.
- Added `useEditUser` hook.
- Enabled Edit action in `UsersTable`.
- Kept View Roles disabled as a placeholder.
- Coordinated Create/Edit forms so only one form can be active at a time.
- Merged edit-user work into `develop` and pushed it.
- Updated admin web README with current Users module capabilities and local development commands.

### Results

- Admin web now supports login, protected session validation, real Users API data, user creation, user editing, and manual users refresh.
- Create and Edit forms are reusable, coordinated, and backed by typed API helpers and focused hooks.
- View Roles remains intentionally disabled until role management UI is implemented.
- Frontend validation:
  - `npm run build` passed.
  - `npm run lint` passed.
- Backend validation:
  - `php artisan test` passed with `54 tests` and `125 assertions`.
- `develop` is up to date with `origin/develop`.
- Working tree is clean.
- Latest commit: `docs(admin-web): document users module capabilities`.

### Next Step

- Implement View Roles UI.
- Later consider user deactivation instead of hard delete.
- Later add language switcher as a dedicated feature.

## 2026-08-19

### Focus

Completed a full user access management cycle across the Enterprise Auth Service backend, Enterprise Admin Web frontend, and project documentation.

### Completed

- Implemented Admin Web user role management:
  - View assigned roles for a user.
  - Assign active roles to a user.
  - Remove assigned roles from a user.
  - Updated the Admin Web README to document user role management.
  - Published the role management work to `develop`.
- Implemented Auth Service user status support:
  - Added `users.is_active` migration.
  - Included `is_active` in user API responses.
  - Added `is_active` support to `PATCH /api/users/{user}`.
  - Ensured new users default to active.
  - Blocked inactive users from login.
  - Updated backend API and manual testing documentation.
- Implemented Admin Web user status controls:
  - Display Active/Inactive status in the Users table.
  - Allow administrators to deactivate and reactivate users.
  - Update user status rows without a full page reload.
  - Added `use-user-status` hook.
  - Updated user status i18n messages.
  - Updated the Admin Web README to document status controls.
- Implemented self-deactivation protection:
  - Backend blocks authenticated users from deactivating their own account.
  - Backend returns `422 Validation Error` with `You cannot deactivate your own account.`
  - Added backend tests for self-deactivation prevention, own profile updates, and deactivating another user.
  - Frontend disables the Deactivate button for the currently authenticated active user.
  - Edit and View Roles remain available for the current user.

### Validation

- Admin Web build passed.
- Admin Web lint passed.
- Auth Service tests passed:
  - `61 tests`
  - `148 assertions`
- Manual browser testing passed for user status controls.

### Notes

- The backend remains the source of truth for self-deactivation prevention.
- The frontend prevents self-deactivation as a UX improvement.
- A local database migration was required to add `is_active` before testing with existing local data.
- Newly created users appear first in local UI state, but backend refresh ordering places users by ID ascending. This is acceptable for now.

### Next Step

- Consider documenting the full user management workflow in the root README or portfolio notes.
- Consider notification auto-dismiss or progress indicators.
- Consider pagination, search, and sorting for the Users table.
- Consider token revocation or request-time blocking for users deactivated after already having an active token.

## 2026-08-21

### Focus

Completed another access-management improvement cycle across Enterprise Admin Web, Enterprise Auth Service, and local mobile testing documentation.

### Completed

- Improved Admin Web status messages:
  - Added dismissible status messages.
  - Added auto-dismiss support for success messages.
  - Added manual dismissal for validation and operation errors.
  - Kept critical session and users-load errors visible.
- Improved the Admin Web Users module:
  - Added client-side search by ID, name, email, and status.
  - Added sortable columns for ID, Name, Email, and Status.
  - Added client-side pagination with page size options.
  - Ensured pagination applies after search and sorting.
  - Added visible/total counts and filtered empty states.
- Improved Auth Service inactive-user security:
  - Added `active-user` middleware.
  - Protected authenticated API routes from inactive users at request time.
  - Blocked existing Sanctum tokens after a user becomes inactive.
  - Returned `403` JSON responses with `Your account is inactive.`.
  - Preserved generic invalid-credentials behavior for inactive login attempts.
- Improved Admin Web inactive-account handling:
  - Detected inactive-account API responses from protected endpoints.
  - Cleared stored auth when inactive-account responses are received.
  - Redirected inactive sessions to `/login?reason=inactive-account`.
  - Displayed `Your account is inactive. Contact an administrator.` on login.
  - Applied handling across protected session validation, users loading, roles, create/edit user, and status update flows.
  - Updated the login form to use `method="post"` as a safer fallback when React hydration has not completed.
- Documented local network and mobile testing for Admin Web:
  - Backend LAN serving with `php artisan serve --host=0.0.0.0 --port=8000`.
  - Frontend `.env.local` API URL using `<LAN_IP>`.
  - Next.js LAN serving with `npm run dev -- -H <LAN_IP>`.
  - Troubleshooting for `/_next/static` `403` chunks causing hydration failure.
- Updated Admin Web README documentation for:
  - Users search and sorting.
  - Users pagination.
  - Local network testing.

### Validation

- Admin Web build passed.
- Admin Web lint passed.
- Auth Service tests passed:
  - `63 tests`
  - `152 assertions`
- Manual PC and phone testing passed:
  - Phone login worked on the same WiFi network.
  - Operator user could not access user management due to missing permissions.
  - After the operator was deactivated from the PC, the phone session redirected to login with the inactive-account alert.
- `develop` was pushed after each completed merge.

### Notes

- Search, sorting, and pagination are currently local to the users already loaded from the API.
- Backend pagination and server-side user search remain future improvements.
- The inactive-user middleware closes the gap where a previously active user could keep using an existing Sanctum token after deactivation.
- Binding the Admin Web dev server directly to the LAN IP avoided local mobile hydration failures caused by blocked `/_next/static` chunks in this environment.

### Next Step

- Consider backend pagination and server-side search for larger user directories.
- Consider documenting the full access-management workflow in portfolio notes.
- Continue hardening protected admin workflows around account lifecycle events.

## 2026-08-21 - Later Update

### Focus

Improved the Admin Web dashboard experience and captured the next access-management planning decisions.

### Completed

- Improved `/dashboard` so it feels more like a real admin home page.
- Added an authenticated account summary using the current user's name and email.
- Added a session security card explaining that protected content is shown only after validating the session with the Auth Service.
- Added a User Management quick action linking to `/users`.
- Kept the dashboard implementation frontend-only.
- Avoided inventing permission data because `/api/me` does not expose permissions yet.
- Updated the Admin Web README to document:
  - `/dashboard`
  - Account summary.
  - Session validation/security card.
  - Quick access to user management.
  - Current limitation around permission-aware dashboard cards.
- Merged and pushed the dashboard feature to `develop`.
- Merged and pushed the dashboard documentation update to `develop`.

### Validation

- Admin Web build passed.
- Admin Web lint passed.

### Planning Notes

- Runtime EN/ES language switching should be implemented soon as a separate feature.
- Floating toast notifications are a good next UX improvement for lower-priority success and operation messages, while critical errors should remain inline.
- Remaining access-management improvements before moving deeply into other modules:
  - Expose roles and permissions from `/api/me`.
  - Make the sidebar and dashboard permission-aware.
  - Improve access-denied UX.
  - Expand roles management later.
  - Eventually add audit logs.

### Next Step

- Start runtime language switching as a focused Admin Web feature.

## 2026-08-25

### Focus

Completed the current-user permissions contract in Enterprise Auth Service and made Enterprise Admin Web permission-aware for user management UX.

### Completed

- Updated Auth Service `GET /api/me` to include active roles and unique sorted active permission slugs.
- Kept existing current-user fields:
  - `id`
  - `name`
  - `email`
- Filtered inactive roles and inactive permissions out of the current-user response.
- Avoided exposing pivots, tokens, timestamps, passwords, or sensitive internal data.
- Updated Auth Service API, manual testing, and testing documentation.
- Added backend tests for:
  - Existing current-user profile behavior.
  - Active roles in `/api/me`.
  - Unique sorted active permission slugs in `/api/me`.
  - Inactive authenticated user token blocking.
- Updated Admin Web current-user and auth storage types to include roles and permissions.
- Added a permissions helper with the `manage-users` permission constant.
- Updated `AdminShell` to pass the trusted current user into `AdminSidebar`.
- Made Admin Web navigation permission-aware:
  - Dashboard remains visible for authenticated users.
  - Users is shown only when the trusted user has `manage-users`.
- Made the dashboard permission-aware:
  - Shows the Manage users quick action only with `manage-users`.
  - Shows an informational restricted card without `manage-users`.
- Updated `/users` permission behavior:
  - Does not request `GET /api/users` when the trusted user lacks `manage-users`.
  - Shows an access-denied message inside the admin layout.
  - Keeps backend `403 Forbidden` responses as the fallback enforcement authority.
- Updated the Admin Web README for permission-aware access.
- Merged and pushed both completed features to `develop`.

### Validation

- Auth Service tests passed:
  - `65 tests`
  - `157 assertions`
- Admin Web build passed.
- Admin Web lint passed.

### Planning Notes

- After lunch, continue with runtime EN/ES language switching as a focused Admin Web feature.
- A strong UX feature after that could be floating toast notifications.
- Later security and enterprise improvements can include a fuller Roles module and Audit Log.

### Next Step

- Start runtime EN/ES language switching as the next focused Admin Web feature.

## 2026-08-25 - Later Update

### Focus

Completed a second Admin Web UX pass focused on runtime language switching, operation feedback, reusable restricted-access states, and read-only roles visibility.

### Completed

- Added runtime EN/ES language switching to Admin Web.
- Added a reusable `LanguageSelector` component.
- Stored the selected locale in `localStorage`.
- Added the language selector to the protected `AdminHeader`.
- Extended i18n coverage across Admin Web pages and components.
- Added a reusable `ToastProvider`.
- Added floating toast notifications for non-critical successful operations:
  - User created.
  - User updated.
  - User activated or deactivated.
  - Role assigned.
  - Role removed.
- Kept critical session, access, load, and validation errors inline.
- Added a reusable `AccessDeniedState` component.
- Updated `/users` to use the reusable access-denied state.
- Added EN/ES messages for restricted state and the back-to-dashboard action.
- Added a read-only `/roles` page using `GET /api/roles`.
- Protected `/roles` visually with `manage-users` and reused `AccessDeniedState`.
- Added loading, empty, error, and access-denied states for roles.
- Updated the sidebar Roles link to point to `/roles`.
- Completed dashboard i18n by replacing remaining hardcoded English strings.
- Added language switching to public pages:
  - `/`
  - `/login`
- Translated the main visible landing page and login page text.
- Preserved login behavior, including `method="post"`, inactive-account messaging, stored-token redirect, and API login handling.
- Updated the Admin Web README for language switching, toast notifications, reusable access-denied state, and the read-only Roles page.
- Merged and pushed each completed feature to `develop`.

### Validation

- Admin Web build passed after each feature.
- Admin Web lint passed after each feature.

### Planning Notes

- Dark mode/theme switching should remain a separate future feature with careful contrast checks.
- Future architecture notes should capture local-first Enterprise Core, optional cloud licensing/update network, future Electronic Invoicing CR, and an AI-ready Enterprise Command Center.

### Next Step

- Plan the next Admin Web feature independently, likely dark mode/theme switching or another focused UX improvement.

## 2026-08-25 - Later Update

### Focus

Added runtime light/dark theme switching to Enterprise Admin Web and made the main admin surfaces theme-aware.

### Completed

- Added runtime Light/Dark theme switching to Admin Web.
- Added a reusable `ThemeSelector` component.
- Added a `useTheme` hook.
- Stored the selected theme in `localStorage` using `enterprise_core_theme`.
- Applied the selected theme globally through `document.documentElement.dataset.theme`.
- Added a theme initializer script in `app/layout.tsx` to reduce theme flicker before hydration.
- Added EN/ES i18n labels for Theme, Light, and Dark.
- Added the theme selector next to the language selector on:
  - `/`
  - `/login`
  - Protected `AdminHeader`
- Added CSS variables in `globals.css` for light and dark theme tokens.
- Added reusable theme-aware utility classes for backgrounds, cards, panels, buttons, inputs, badges, status messages, tables, and shell surfaces.
- Updated public pages, dashboard, users, roles, forms, toasts, access-denied state, page headers, and summary cards for theme-aware styling.
- Updated the Admin Web README with Theme Switching documentation.
- Merged and pushed the completed feature to `develop`.

### Validation

- Manual visual check passed in dark mode for:
  - `/`
  - `/login`
  - `/dashboard`
  - `/users`
  - `/roles`
- EN/ES switching still worked.
- Theme persisted after refresh.
- Admin Web lint passed.
- Admin Web build passed.

### Planning Notes

- Keep future theme changes focused on contrast, consistency, and small reusable tokens.
- Future architecture notes should capture local-first Enterprise Core, optional cloud licensing/update network, future Electronic Invoicing CR, and an AI-ready Enterprise Command Center.

### Next Step

- Continue with the next focused Admin Web or architecture improvement.

## 2026-08-26 - Command Center, System Events, and Customers foundation

### Summary

Advanced Enterprise Core from an admin foundation toward a command-ready business platform.

This work strengthened the Admin Web command experience, added a backend/frontend system activity log, and introduced Customers as the first business-domain module.

### Completed

#### Command Center foundation

- Added safe create-user command intent:
  - `/users?intent=create-user`
  - Opens and prepares the existing Create User form.
  - Does not submit automatically.
- Added safe user search command intent:
  - `/users?search=<query>`
  - Fills the existing Users search input and filters locally.
- Added safe edit-user preparation intent:
  - `/users?intent=edit-user&search=<query>`
  - Opens edit mode only when exactly one local user matches.
  - Does not save automatically.
- Added Admin Web Command Palette manual:
  - `apps/enterprise-admin-web/docs/Command-Palette.md`
- Added Command Registry Standard:
  - `docs/architecture/Command Registry Standard.md`
- Added Command Center Roadmap:
  - `apps/enterprise-admin-web/docs/Command-Center-Roadmap.md`

#### System Events / Activity Log

- Added backend System Events foundation.
- Created `system_events` table.
- Added `SystemEvent` model.
- Added `SystemEventLogger` service.
- Added protected endpoint:
  - `GET /api/system-events`
- Added permission:
  - `view-system-events`
- Assigned `view-system-events` to Administrator through seeding.
- Logged events for:
  - successful login
  - failed login
  - logout
  - user created
  - user updated
  - user activated/deactivated
  - role assigned/removed
- Added frontend System Events page:
  - `/system/events`
- Kept System Events as a System subpage, not a top-level sidebar item.
- Added access from:
  - `/system`
  - Command Palette
  - direct URL `/system/events`
- Added safe login error sanitization to prevent raw SQL/internal backend errors from being displayed in the UI.

#### Customers foundation

- Added backend Customers foundation.
- Created `customers` table.
- Added `Customer` model.
- Added `CustomerController`.
- Added protected routes:
  - `GET /api/customers`
  - `GET /api/customers/{customer}`
  - `POST /api/customers`
  - `PATCH /api/customers/{customer}`
- Added permissions:
  - `view-customers`
  - `manage-customers`
- Assigned customer permissions to Administrator through seeding.
- Added customer system events:
  - `customers.created`
  - `customers.updated`
  - `customers.activated`
  - `customers.deactivated`
- Added frontend Customers page:
  - `/customers`
- Added local customer search.
- Added Customers sidebar item visible with `view-customers`.
- Added Command Palette support:
  - open customers
  - search customer
  - create customer
  - edit customer
- Added customer create and edit flows in Admin Web.
- Added reusable Customer form.
- Added create/update success toasts.
- Kept Customers safe boundaries:
  - no delete
  - no export
  - no bulk actions
  - no automatic mutation from Command Palette

### Validation

Backend:

- `php artisan test` passed after System Events foundation.
- `php artisan test` passed after Customers foundation.
- Latest backend validation:
  - `89 passed`
  - `257 assertions`

Frontend:

- `npm run lint` passed after System Events page.
- `npm run build` passed after System Events page.
- `npm run lint` passed after readonly Customers page.
- `npm run build` passed after readonly Customers page.
- `npm run lint` passed after customer create/edit flows.
- `npm run build` passed after customer create/edit flows.

Manual validation:

- Login works after applying migrations.
- System Events page loads for authorized administrator.
- System Events is accessible from `/system` and Command Palette.
- System Events is not shown as a top-level sidebar item.
- Customers appears for users with `view-customers`.
- Customers page loads.
- Customer creation works.
- Customer editing works.
- Customer search works.
- Command Palette customer intents work.
- Raw SQL/internal login errors are no longer shown directly to the user.

### Published develop commits

- `5030c82` merge: handle admin web create user command intent
- `1f62515` docs(architecture): add command registry standard
- `dd3b6b8` merge: add admin web command palette manual
- `9010640` merge: add admin web user search command intent
- `199dbb7` merge: add admin web edit user command intent
- `8547ba5` merge: add admin web command center roadmap
- `0d8fbbd` merge: add auth service system events foundation
- `1c6b057` merge: add admin web system events page
- `1765fce` merge: add auth service customers foundation
- `6a338a0` merge: add admin web readonly customers page
- `1d34ad9` merge: add admin web customer create and edit flows

### Notes

- Command Palette remains a safe navigation and preparation layer.
- Command Palette does not execute sensitive mutations automatically.
- Sensitive future commands should require backend authorization, confirmation, audit logging, and clear result feedback.
- Permissions are assigned to roles, not directly to users as the main design model.
- Current customer permissions are seeded to Administrator only until business roles are formally defined.
- Customers is now the first usable business-domain module in Enterprise Core.

### Next

- Define business roles more clearly:
  - Administrator
  - Manager
  - Operator
- Add role-permission management later.
- Continue Customers improvements:
  - better detail view
  - status handling
  - optional pagination
  - stronger validation localization
- Start planning the next business module after Customers:
  - Products
  - Inventory
  - Sales
  - Reports
