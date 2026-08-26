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

This is a foundation only. Customer deletion, advanced search, exports, invoicing, and Admin Web customer screens are not implemented yet.

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

- JWT Authentication
- Password Hashing
- Token Revocation
- Refresh Tokens
- Rate Limiting
- Email Verification
- Password Reset
- Role Based Access Control (RBAC)

---

# Dependencies

Tecnologías previstas:

- Laravel
- PostgreSQL
- JWT
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

🚧 Under Development

Sprint 1

---
# Communication

Enterprise Auth Service expondrá APIs REST para consumo interno del ecosistema Enterprise Core.

No tendrá acceso directo a las bases de datos de otros servicios.

Toda comunicación entre servicios deberá realizarse mediante contratos de API.

---
# Roadmap

- [x] Initialize Laravel Project
- [x] Configure PostgreSQL Connection
- [ ] Configure JWT Authentication
- [ ] Create Initial Domain Models
- [ ] Create OpenAPI Specification
- [ ] Implement Authentication Flow
- [ ] Implement Authorization Layer
- [ ] Implement Audit Logging


