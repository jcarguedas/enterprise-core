# Enterprise Core

Enterprise Core is a portfolio-grade foundation for a modular business operations platform.

The project is evolving from an admin web and authentication system into a broader enterprise platform architecture. The current implementation focuses on authentication, role-based access control, protected administration workflows, and a Next.js admin experience.

Enterprise Core is currently a platform foundation, not a complete ERP. Business modules such as customers, inventory, sales, reporting, invoicing, and AI-assisted operations are roadmap directions and should not be treated as implemented features.

## Current Status

Enterprise Core currently provides a working authentication and administration foundation:

- Laravel Enterprise Auth Service.
- PostgreSQL database.
- Laravel Sanctum authentication.
- Active and inactive user support.
- Roles and permissions.
- Protected API endpoints.
- Next.js Admin Web.
- Public landing page.
- Login page.
- Protected dashboard.
- Users module.
- Read-only Roles page.
- Permission-aware sidebar and dashboard actions.
- Runtime English and Spanish language switching.
- Runtime light and dark theme switching.
- Toast notifications.
- Reusable access-denied state.

The current focus is to keep the foundation clean, testable, and reviewable before expanding into business operations modules.

## Repository Structure

```text
services/
  enterprise-auth-service/
    src/

apps/
  enterprise-admin-web/

docs/
  architecture/
```

Key areas:

- `services/enterprise-auth-service`: Laravel backend service for authentication, users, roles, permissions, and protected API behavior.
- `apps/enterprise-admin-web`: Next.js admin frontend for login, dashboard, user management, roles visibility, theming, localization, and permission-aware navigation.
- `docs/architecture`: Architecture documents for platform direction and future system design.

## Implemented Foundation

### Backend

The backend foundation includes:

- Laravel API service.
- PostgreSQL persistence.
- Sanctum token authentication.
- Active and inactive user state.
- User management endpoints.
- Roles and permissions model.
- Permission middleware for administrative routes.
- Protected API endpoints.
- Feature tests for core API behavior.

Administrative endpoints should remain protected by explicit permissions. User management actions currently require the relevant RBAC checks and must not depend on authentication alone.

### Frontend

The frontend foundation includes:

- Next.js Admin Web application.
- Public landing page.
- Login flow.
- Protected dashboard.
- Users module.
- Read-only Roles page.
- Permission-aware sidebar navigation.
- Permission-aware dashboard actions.
- Runtime EN/ES language switching.
- Runtime light/dark theme switching.
- Toast notifications.
- Reusable access-denied UI state.

The frontend is intended to grow into an operational admin experience while keeping access control visible and consistent.

## Architecture Vision

Enterprise Core is being documented as a modular platform with two important architecture directions:

- [Local-First Enterprise Core](docs/architecture/Local-First%20Enterprise%20Core.md): describes a future local-first deployment model where each customer can run its own local instance and database, with cloud services limited to licensing, subscription status, update metadata, and product distribution.
- [Enterprise Command Center](docs/architecture/Enterprise%20Command%20Center.md): describes a future command-ready and AI-ready operational dashboard architecture built around safe known commands, permissions, confirmation flows, application services, and audit logs.
- [Release and Update Strategy](docs/architecture/Release%20and%20Update%20Strategy.md): describes future versioning, release metadata, customer-controlled local updates, migration safety, and the relationship between updates and licensing.

These documents describe direction, not completed implementation.

## Release Notes

- [Enterprise Core v1.0.1](docs/releases/v1.0.1.md)

## Validation

Backend validation:

```bash
cd services/enterprise-auth-service/src
php artisan test
```

Frontend validation:

```bash
cd apps/enterprise-admin-web
npm run lint
npm run build
```

## Roadmap Direction

Future roadmap areas may include:

- Customer management.
- Inventory management.
- Sales and orders.
- Reporting.
- Audit logging.
- Backup, export, and import workflows.
- Local-first deployment tooling.
- Licensing and update metadata services.
- Command palette before AI-assisted commands.
- Safe AI intent mapping through a command registry.
- Costa Rica Electronic Invoicing as a future module.

These areas are intentionally described as future work. They should be implemented incrementally with tests, documentation, and explicit authorization rules.

## Notes

- This repository is documentation- and test-conscious by design.
- The project should remain modular and reviewable.
- New backend behavior should include or update tests.
- New administrative actions should enforce RBAC permissions.
- Public registration should not be added unless explicitly approved.
- Documentation should clearly distinguish implemented behavior from architecture direction.

## Author

Jean Carlos Arguedas  
Software Engineer
