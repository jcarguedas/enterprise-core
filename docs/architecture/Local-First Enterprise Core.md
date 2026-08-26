# Local-First Enterprise Core

## Purpose

Enterprise Core is intended to evolve from an admin web and authentication portfolio project into a modular business operations platform.

This document describes a future local-first architecture direction. It is not a statement of current implementation.

The target model is to let each customer or company run its own Enterprise Core instance and database while keeping operational data local by default.

## Current Foundation

Enterprise Core currently includes the following implemented foundation:

- Laravel Enterprise Auth Service.
- PostgreSQL.
- Laravel Sanctum authentication.
- Active and inactive users.
- Roles and permissions.
- Admin Web built with Next.js.
- Protected dashboard.
- Users module.
- Read-only Roles page.
- Runtime English and Spanish language switching.
- Runtime light and dark theme switching.
- Toast notifications.
- Reusable access-denied state.
- Permission-aware navigation.

These capabilities establish the authentication, administrative, frontend, and RBAC base for future platform modules.

## Target Architecture

The target architecture is a local-first business operations platform where each customer environment can run independently.

In this model:

- Each customer or company runs its own local Enterprise Core instance.
- Each local instance owns its own database.
- Operational business data remains local by default.
- The platform can be extended through modules such as customers, inventory, sales, invoicing, reporting, and administration.
- Cloud services are optional and limited to product operations rather than customer operations.

This direction reduces dependency on centralized cloud hosting for customer data and allows Enterprise Core to support businesses that prefer local control, predictable costs, or limited external data exposure.

## Local Data Ownership

Customer data should belong to the customer environment where it is created and operated.

By default, a local Enterprise Core deployment should store operational records in the customer's own database, including future modules such as customers, inventory, sales, invoices, and reports.

The customer is responsible for protecting, backing up, and managing its own data. Enterprise Core should support that responsibility through clear tools, documentation, and operational workflows.

This approach is intended to reduce cloud hosting costs and avoid making Enterprise Core responsible for centralized storage of every customer's operational business data.

## Optional Cloud Network

A future Enterprise Core cloud network may exist, but it should be limited in scope.

Potential cloud responsibilities include:

- Licensing and subscription status.
- Product distribution.
- Update metadata.
- Version availability notifications.
- Optional account or membership validation.

The cloud network should not store customer operational data by default.

A future licensing service may validate whether a customer has an active membership or subscription without storing the customer's business records, invoices, inventory, sales, employees, or customers.

A future update network may notify local deployments when new versions are available and provide metadata needed to plan upgrades.

## Backups and Recovery Direction

Because local deployments own their data, Enterprise Core should provide tools that make data protection practical.

Future backup and recovery direction may include:

- Database export tools.
- Database import tools.
- Scheduled backup guidance.
- Manual backup workflows.
- Restore documentation.
- Environment migration guidance.
- Version-aware upgrade notes.

These tools should help customers recover from local hardware failure, database corruption, accidental deletion, or environment migration.

Backup and recovery features are not part of the current implemented scope.

## Security and Access Control

The current RBAC foundation should remain central to the local-first platform.

Administrative and operational actions should continue to use:

- Authenticated access through Sanctum.
- Active user enforcement where applicable.
- Role and permission checks.
- Permission-aware navigation.
- Reusable access-denied states.

As new modules are added, they should define explicit permissions rather than relying only on authentication.

Examples of future permission areas may include:

- Managing users.
- Managing customers.
- Managing inventory.
- Viewing reports.
- Managing invoices.
- Exporting data.
- Restoring data.
- Managing system settings.

## Roadmap Modules

Future local-first modules may include:

- Customer management.
- Inventory management.
- Sales and orders.
- Reporting.
- Audit logs.
- Backup and restore tools.
- Settings and company profile management.
- Costa Rica Electronic Invoicing.

Costa Rica Electronic Invoicing is a roadmap module only. It is not part of the current implemented scope and should be designed carefully around legal, tax, certificate, signing, and integration requirements when the project reaches that stage.

## Non-Goals for Now

The following are not goals for the current implementation phase:

- Building a centralized cloud ERP.
- Storing customer operational data in an Enterprise Core cloud service by default.
- Implementing licensing enforcement.
- Implementing product update distribution.
- Implementing backup, restore, export, or import workflows.
- Implementing Costa Rica Electronic Invoicing.
- Supporting multi-company cloud tenancy in a shared production database.
- Promising offline-first conflict resolution across multiple devices.

## Open Questions

- What deployment model should be recommended first: local machine, local network server, Docker, or managed private server?
- How should local backups be encrypted and verified?
- Should Enterprise Core provide a built-in backup scheduler or only documented commands?
- What minimum cloud licensing data is required without collecting operational data?
- How should update notifications handle incompatible database migrations?
- What module boundaries should define the first business operations release?
- How should Costa Rica Electronic Invoicing be isolated from customers that do not need it?
