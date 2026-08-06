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
