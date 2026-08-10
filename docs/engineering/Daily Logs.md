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
