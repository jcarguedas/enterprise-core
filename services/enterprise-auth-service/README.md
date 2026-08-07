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


