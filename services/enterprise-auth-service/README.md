# Enterprise Auth Service

## Overview

Enterprise Auth Service es el servicio responsable de la identidad, autenticación y autorización dentro del ecosistema Enterprise Core.

Su objetivo es garantizar que únicamente usuarios autorizados puedan acceder a los recursos del sistema, manteniendo un modelo de seguridad escalable para empresas con múltiples sucursales y diferentes niveles de acceso.

Este servicio constituye el punto de entrada a toda la plataforma.

---

# Design Goals

Enterprise Auth Service ha sido diseñado para proporcionar una capa de identidad desacoplada del resto del ecosistema Enterprise Core.

El servicio deberá ser capaz de autenticar usuarios, emitir credenciales seguras y administrar permisos sin conocer la lógica de negocio de otros servicios.

Su diseño permitirá ser reutilizado por cualquier servicio del ecosistema.

---

# Responsibilities

El servicio es responsable de:

- Autenticación de usuarios.
- Gestión de usuarios.
- Gestión de roles.
- Gestión de permisos.
- Administración de sesiones.
- Emisión y validación de JWT.
- Recuperación y cambio de contraseña.
- Auditoría de autenticación.

---

# Out of Scope

Este servicio NO administra:

- Inventario
- Productos
- Compras
- Ventas
- Reportes
- Inteligencia Artificial
- Pagos

Estos procesos pertenecen a otros servicios del ecosistema Enterprise Core.

---
## Service Boundaries

Enterprise Auth Service administra únicamente identidad, autenticación y autorización.

La información organizacional (empresas, sucursales y configuración empresarial) será administrada por Enterprise Company Service.

La comunicación entre ambos servicios se realizará mediante APIs internas.
---

# Domain Model

El servicio administrará inicialmente las siguientes entidades:

- User
- Role
- Permission
- Session
- PasswordReset
- RefreshToken
- AuditLog

---

# Planned REST API

## Authentication

POST /login

POST /logout

POST /refresh-token

POST /forgot-password

POST /reset-password

---

## Users

GET /users

POST /users

PUT /users/{id}

DELETE /users/{id}

---

## Roles

GET /roles

POST /roles

PUT /roles/{id}

DELETE /roles/{id}

---

## Permissions

GET /permissions

POST /permissions

PUT /permissions/{id}

DELETE /permissions/{id}

---

# API Documentation

The current REST API documentation is available at:

- [Enterprise Auth Service API](docs/API.md)

---

# Local Demo Admin

Running the default database seeders creates an active demo administrator account:

```text
Email: admin@example.com
Password: password123
```

These are demo credentials for local development and technical demos only. Change them for any non-demo environment.

The demo admin values can be configured before seeding with:

```text
ADMIN_USER_NAME
ADMIN_USER_EMAIL
ADMIN_USER_PASSWORD
```

The seeded user is assigned to the `Administrator` role.

---

# Customers

Enterprise Auth Service now includes the first business-domain module foundation: Customers.

Current customer routes:

```text
GET    /api/customers
POST   /api/customers
GET    /api/customers/{customer}
PATCH  /api/customers/{customer}
```

Customer read routes require:

```text
auth:sanctum
active-user
permission:view-customers
```

Customer create and update routes require:

```text
auth:sanctum
active-user
permission:manage-customers
```

The `view-customers` and `manage-customers` permissions are seeded and assigned to the Administrator role by the permission seeder.

Customer actions write safe system events:

- `customers.created`
- `customers.updated`
- `customers.activated`
- `customers.deactivated`

Customer event metadata is limited to safe summaries such as customer name and email. It must not store full request bodies, credentials, tokens, or customer notes.

The Customers foundation now includes optional fiscal profile fields:

- `legal_name`
- `commercial_name`
- `fiscal_email`
- `economic_activity_code`
- `economic_activity_name`
- `province`
- `province_code`
- `province_name`
- `canton`
- `canton_code`
- `canton_name`
- `district`
- `district_code`
- `district_name`
- `neighborhood`
- `neighborhood_code`
- `neighborhood_name`
- `other_signs`
- `fiscal_notes`

These fields prepare customer records for a future Costa Rica electronic invoicing module. Electronic invoicing is not implemented yet. Customer create and update routes do not call Hacienda APIs, perform Hacienda lookups, generate XML, sign documents, generate invoice keys, generate consecutive numbers, manage branches or terminals, calculate taxes, manage CABYS, or emit invoices.

`identification_type` remains optional and is validated as a Costa Rica fiscal identification code when provided:

- `01` Cedula fisica
- `02` Cedula juridica
- `03` DIMEX
- `04` NITE
- `05` Extranjero No Domiciliado

Location catalogs and economic activity selection/catalogs are not implemented yet. Existing `province`, `canton`, `district`, and `neighborhood` text fields remain for backward compatibility. New code/name fields are intended for a future catalog-backed UI.

Customer event metadata is limited to safe summaries such as `target_name` and `target_email`. It must not store full request bodies, credentials, tokens, customer notes, economic activity, fiscal email, full fiscal profiles, address/location fields, address details, or `fiscal_notes`.

This is a foundation only. Customer deletion, advanced search, exports, and electronic invoicing are not implemented yet.

---

# Costa Rica Taxpayer Lookup

Enterprise Auth Service includes a backend-mediated taxpayer lookup foundation for future customer fiscal data prefill.

Current route:

```text
GET /api/taxpayer-lookup?identification_number=3101123456
```

This endpoint requires:

```text
auth:sanctum
active-user
permission:lookup-taxpayer
```

The `lookup-taxpayer` permission is seeded and assigned to the Administrator role by the permission seeder.

The lookup validates `identification_number` as 9 to 12 numeric digits, checks the local `taxpayer_lookup_caches` table first, and only calls the Hacienda public taxpayer API when no non-expired cache entry exists.

The response returns a normalized safe taxpayer DTO for Admin Web. It does not expose raw Hacienda payloads directly.

Taxpayer lookup writes safe system events:

- `taxpayer_lookup.succeeded`
- `taxpayer_lookup.failed`

Lookup event metadata is limited to source, HTTP status, and masked identification number. It must not store full Hacienda payloads or full taxpayer data.

This is not electronic invoicing. It does not generate invoices, XML, signatures, invoice keys, consecutive numbers, taxes, CABYS data, branches, terminals, or document emission.

---

# System Events

Enterprise Auth Service includes a backend foundation for chronological system events.

The current read-only endpoint is:

```text
GET /api/system-events
```

It requires:

```text
auth:sanctum
active-user
permission:view-system-events
```

The `view-system-events` permission is seeded and assigned to the Administrator role by the permission seeder.

Current event types:

- `auth.login.succeeded`
- `auth.login.failed`
- `auth.logout`
- `users.created`
- `users.updated`
- `users.activated`
- `users.deactivated`
- `users.roles.assigned`
- `users.roles.removed`
- `customers.created`
- `customers.updated`
- `customers.activated`
- `customers.deactivated`

System events are intentionally limited to safe operational metadata. They must not store passwords, Sanctum tokens, raw credentials, or full request bodies.

---

# Testing Documentation

The current automated testing documentation is available at:

- [Enterprise Auth Service Testing](docs/Testing.md)

---

# Security

El servicio implementará:

- Laravel Sanctum Authentication
- Password Hashing
- Token Revocation
- Active User Middleware
- Rate Limiting
- Permission-protected administrative routes
- Safe system event metadata
- Role Based Access Control (RBAC)

---

# Dependencies

Tecnologías previstas:

- Laravel
- PostgreSQL
- Laravel Sanctum
- OpenAPI
- PHPUnit

---

# Future Integrations

Este servicio será consumido por:

- Company Service
- Inventory Service
- Catalog Service
- Payment Service
- Reporting Service
- AI Services

---

# Engineering Principles

Este servicio sigue los principios establecidos en Enterprise Core Blueprint y en los ADR del proyecto.

---

# Current Status

Under active development.

Current foundation:

- Laravel and PostgreSQL backend.
- Sanctum authentication.
- Active user middleware.
- RBAC with users, roles, and permissions.
- User management backend.
- Role listing and user role assignment backend.
- System Events backend foundation.
- Customers backend foundation with optional fiscal profile fields.
- Backend-mediated Costa Rica taxpayer lookup foundation.
- Backend automated tests.
---
# Communication

Enterprise Auth Service expondrá APIs REST para consumo interno del ecosistema Enterprise Core.

No tendrá acceso directo a las bases de datos de otros servicios.

Toda comunicación entre servicios deberá realizarse mediante contratos de API.

---
# Roadmap

## Completed

- [x] Initialize Laravel project.
- [x] Configure PostgreSQL connection.
- [x] Implement Sanctum authentication.
- [x] Create initial User, Role, Permission, System Event, and Customer models.
- [x] Implement RBAC authorization layer.
- [x] Implement user management endpoints.
- [x] Implement role listing and user role assignment endpoints.
- [x] Implement System Events foundation.
- [x] Implement Customers foundation.
- [x] Add optional customer fiscal profile fields for future Costa Rica electronic invoicing preparation.
- [x] Add structured economic activity and location code/name fields for future catalog-backed fiscal workflows.
- [x] Add backend-mediated Costa Rica taxpayer lookup foundation with cache-first behavior.
- [x] Add backend automated tests for implemented behavior.

## Next

- Improve the Customers module.
- Define business roles.
- Add role-permission management.
- Prepare fiscal customer profile workflows for future Costa Rica electronic invoicing.
- Plan product/catalog or inventory module boundaries.

## Future

- Inventory.
- Catalog.
- Sales.
- Reporting.
- Costa Rica electronic invoicing.
- Docker and deployment packaging.
- Optional update and licensing network.
- Voice or AI command input layer.

Electronic invoicing remains future work and must be introduced separately with explicit data modeling, authorization, tests, and documentation.


