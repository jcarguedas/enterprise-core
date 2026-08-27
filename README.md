# Enterprise Core

Enterprise Core is a portfolio-grade foundation for a modular business operations platform in active development.

The project is evolving from a secure authentication and administration system into a broader enterprise platform architecture. The current implementation focuses on API-first backend foundations, role-based access control, protected administration workflows, early business-domain modules, and a Next.js Admin Web experience.

Enterprise Core is currently a platform foundation, not a complete ERP. Customers is the first business-domain module. Inventory, catalog, sales, reporting, Costa Rica electronic invoicing, and AI-assisted operations remain roadmap directions and should not be treated as implemented product areas.

## Current Status

Enterprise Core currently provides a working backend and frontend foundation for protected business administration:

- Monorepo structure for backend services, frontend apps, and documentation.
- Enterprise Auth Service backend.
- Laravel and PostgreSQL backend foundation.
- Laravel Sanctum authentication.
- Active user middleware and inactive account handling.
- RBAC with roles and permissions.
- User management backend.
- Role listing and user role assignment backend.
- System Events backend foundation.
- Customers backend foundation.
- Next.js Admin Web.
- Public landing page.
- Login page.
- Protected dashboard.
- Users management page.
- Roles page.
- System page.
- System Events page.
- Settings placeholder.
- Customers page with create and edit flows.
- Runtime English and Spanish language switching.
- Runtime light and dark theme switching.
- Toast notifications.
- Command Palette foundation with safe command intents.
- Backend automated tests.
- Frontend lint and build validation.

The current focus is to keep the foundation clean, testable, and reviewable while expanding carefully into business operations modules.

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

- `services/enterprise-auth-service`: Laravel backend service for authentication, users, roles, permissions, system events, customers, and protected API behavior.
- `apps/enterprise-admin-web`: Next.js admin frontend for login, dashboard, user management, roles visibility, system information, system events, customers, theming, localization, command palette workflows, and permission-aware navigation.
- `docs/architecture`: Architecture documents for platform direction and future system design.

## Implemented Foundation

### Backend

The backend foundation includes:

- Laravel API service.
- PostgreSQL persistence.
- Sanctum token authentication.
- Active and inactive user state.
- Active user middleware.
- User management endpoints.
- Roles and permissions model.
- Role listing endpoints.
- User role assignment endpoints.
- Permission middleware for administrative routes.
- System Events foundation.
- Customers module foundation.
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
- Roles page.
- System page.
- System Events page.
- Settings placeholder.
- Customers page with create and edit flows.
- Permission-aware sidebar navigation.
- Permission-aware dashboard actions.
- Runtime EN/ES language switching.
- Runtime light/dark theme switching.
- Toast notifications.
- Reusable access-denied UI state.
- Command Palette foundation.
- Safe command intents for creating users, searching users, editing users, opening customers, searching customers, creating customers, editing customers, and opening system events.

The frontend is intended to grow into an operational admin experience while keeping access control, localization, and runtime preferences visible and consistent.

### Business Modules

Customers is the first business-domain module in Enterprise Core. The current foundation supports customer visibility and create/edit workflows in Admin Web backed by protected API behavior.

Fiscal customer profile support and Costa Rica electronic invoicing are future work. They are not implemented yet and should be introduced incrementally with explicit data modeling, validation, authorization, tests, and documentation.

## Architecture Vision

Enterprise Core is being documented as a modular platform with two important architecture directions:

- [Local-First Enterprise Core](docs/architecture/Local-First%20Enterprise%20Core.md): describes a future local-first deployment model where each customer can run its own local instance and database, with cloud services limited to licensing, subscription status, update metadata, and product distribution.
- [Enterprise Command Center](docs/architecture/Enterprise%20Command%20Center.md): describes a future command-ready and AI-ready operational dashboard architecture built around safe known commands, permissions, confirmation flows, application services, and audit logs.
- [Command Registry Standard](docs/architecture/Command%20Registry%20Standard.md): defines command types, permission expectations, confirmation rules, audit expectations, and module design guidance for future command-aware modules.
- [Costa Rica Taxpayer Lookup](docs/architecture/Costa%20Rica%20Taxpayer%20Lookup.md): describes a future backend-mediated Hacienda taxpayer lookup flow for customer fiscal data prefill, local customer existence checks, caching, and safe Command Center behavior.
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

## Roadmap

### Completed

- Project structure for a monorepo with services, apps, and architecture documentation.
- Authentication foundation with Laravel Sanctum.
- RBAC foundation with roles, permissions, and protected administrative behavior.
- User management backend and Admin Web workflows.
- Roles foundation with role listing and user role assignment support.
- Admin Web foundation with login, protected dashboard, users, roles, system, system events, settings, customers, localization, theming, and toast notifications.
- Command Palette foundation with safe command intents for create user, search user, edit user, open customers, search customer, create customer, edit customer, and system events.
- System Events backend and Admin Web page foundation.
- Customers module foundation as the first business-domain module.
- Backend automated tests.
- Architecture documentation for local-first deployment, command-center design, command registry standards, and release/update strategy.

### Next

- Improve the Customers module with richer profile fields, filtering, validation, and operational workflows.
- Define business roles for customer and future module operations.
- Add role-permission management workflows.
- Prepare fiscal customer profiles for future Costa Rica electronic invoicing.
- Plan product/catalog or inventory module boundaries.

### Future

- Inventory module.
- Catalog module.
- Sales and order workflows.
- Reporting and operational analytics.
- Costa Rica electronic invoicing.
- Backend-mediated Costa Rica taxpayer lookup for customer fiscal data prefill.
- Docker and deployment packaging.
- Optional update and licensing network.
- Voice or AI command input layer built on the command registry.

Roadmap areas should be implemented incrementally with tests, documentation, and explicit authorization rules.

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
