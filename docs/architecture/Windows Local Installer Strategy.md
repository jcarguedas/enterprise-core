# Windows Local Installer Strategy

## Purpose

This document describes a future Windows installer and local runtime strategy for Enterprise Core.

It is an architecture direction only. Enterprise Core does not currently provide a production Windows installer, automatic runtime manager, update service, licensing service, or built-in backup and restore workflow.

## Product Vision

Enterprise Core should eventually feel like installed business software while preserving the advantages of a web-based Admin Web interface.

The target experience is:

- A customer downloads `Enterprise-Core-Setup.exe`.
- The installer prepares the local Enterprise Core runtime.
- A desktop icon launches Enterprise Core.
- The launcher starts or verifies local services.
- The default browser opens the local Admin Web URL.
- A first-run screen lets the user create a new company, restore a backup, or open an existing company.
- Customer business data remains local by default.

Admin Web should remain web-based, but the installation, launcher, and local runtime should make the product feel like local desktop software to non-technical users.

## Non-Goals

The future Windows installer strategy should not imply that these capabilities exist today.

Current non-goals:

- Shipping a production `Enterprise-Core-Setup.exe`.
- Installing or managing PostgreSQL automatically.
- Running background services through an implemented supervisor.
- Applying product updates automatically.
- Enforcing licenses or memberships.
- Uploading customer operational data to a cloud service.
- Replacing the web-based Admin Web with a native desktop UI.
- Supporting SQLite as the primary professional-edition database.

## Recommended Local Runtime Architecture

The recommended professional-edition runtime is:

- Local Windows machine or local office server.
- Enterprise Auth Service running as a local Laravel API service.
- Admin Web running as a local web application.
- PostgreSQL as the primary database.
- Optional future launcher process responsible for startup checks and browser launch.
- Optional future Windows services for long-running runtime components.

Local services should bind to `127.0.0.1` by default unless a local-network deployment is explicitly configured.

PostgreSQL should remain the recommended primary database for the professional edition because it aligns with the current backend foundation, supports richer relational modeling, and better matches business operations growth. SQLite may be considered later for a light or single-user edition only.

## Installation Folder Strategy

A future installer should use a predictable folder structure, such as:

```text
C:\Program Files\Enterprise Core\
  app\
  runtime\
  launcher\
  tools\

C:\ProgramData\Enterprise Core\
  config\
  logs\
  backups\
  updates\
```

Application binaries and runtime files should be separated from customer data, logs, backups, and local configuration.

Customer-controlled data should not live inside source-code folders or temporary build directories.

## Runtime Startup Flow

A future launcher should provide a simple startup flow:

```text
Desktop icon
-> Enterprise Core launcher
-> verify local configuration
-> verify PostgreSQL connectivity
-> start or verify backend service
-> start or verify Admin Web service
-> open browser to local Admin Web URL
```

On first run, Admin Web may present setup choices:

- Create a new company.
- Restore from a backup.
- Open an existing company.

The launcher should report clear errors when required services are unavailable instead of failing silently.

## Database Strategy

PostgreSQL is the recommended database for the professional edition.

The database strategy should support:

- One local database per customer environment.
- Clear database credentials configured during setup.
- Versioned Laravel migrations.
- Explicit migration approval during updates.
- Backup before migration.
- Health checks after migration.

SQLite may be evaluated later for a light or single-user edition, but it should not replace PostgreSQL for the professional edition without a separate architecture decision.

## Backup and Restore Strategy

Because Enterprise Core is local-first, backup and restore must be treated as first-class product capabilities before customer-facing installer distribution.

Future backup files could use an Enterprise Core-specific extension such as:

```text
.ecbackup
```

A future `.ecbackup` format may package database exports, metadata, product version, migration compatibility notes, and integrity information.

Future restore workflows should clearly validate compatibility before changing a local environment.

## Update Strategy

Updates must be customer-controlled.

A future update flow should:

- Notify the local administrator that an update is available.
- Show release notes and migration risk.
- Require explicit user confirmation.
- Create or require an automatic backup before running migrations.
- Verify update package signatures or checksums.
- Apply application updates.
- Run database migrations only after approval.
- Run health checks after the update.

Update packages should eventually be signed or checksummed before installation. No update package distribution or verification is implemented today.

## Licensing / Membership Strategy

A future remote license server may validate subscription or membership status.

The licensing service may handle:

- Active subscription status.
- Eligible product edition.
- Eligible release channel.
- Update access.

The licensing service should not store customer business data by default. Customer records, inventory, sales, invoices, reports, and operational data should remain local unless a future cloud feature is explicitly designed and approved.

## Security Considerations

The Windows local runtime should preserve the security model already established in Enterprise Core:

- Sanctum authentication.
- Active user enforcement.
- RBAC permissions for administrative actions.
- Local services bound to `127.0.0.1` by default.
- No public registration endpoint unless explicitly approved.
- Secrets stored in local configuration, not source control.
- Update packages verified through signatures or checksums.
- Backups protected according to customer policy.

If Enterprise Core later supports local-network access, that mode should require explicit configuration, firewall guidance, and stronger deployment documentation.

## Windows Service Strategy

A production installer may eventually install Enterprise Core runtime components as Windows services.

Potential services:

- Enterprise Core API service.
- Enterprise Core web service.
- Enterprise Core worker service.
- Enterprise Core scheduler service.

Services should be named clearly, logged predictably, and manageable through standard Windows administration tools.

This is future work. The current repository does not provide production Windows services.

## Launcher Strategy

A future launcher should be small, predictable, and user-facing.

Responsibilities may include:

- Start or verify local services.
- Show service status.
- Open Admin Web in the default browser.
- Surface configuration errors.
- Provide backup and restore entry points.
- Provide update notifications.
- Link to support or diagnostics.

The launcher should not bypass RBAC, store credentials insecurely, or silently modify business data.

## Development Phases

Recommended phases:

1. Document manual Windows demo setup.
2. Provide safe local development startup helpers.
3. Define production runtime folders and configuration boundaries.
4. Add backup and restore commands.
5. Add local health checks.
6. Add a launcher prototype.
7. Add signed or checksummed update package design.
8. Add installer packaging.
9. Add Windows service management.
10. Add licensing and membership validation.

Each phase should remain reviewable and should not overpromise product behavior before it is implemented.

## Impact on Current Development

Current development should continue to use the existing Laravel, PostgreSQL, and Next.js foundation.

Immediate impact:

- Keep backend and frontend runnable from the monorepo.
- Keep configuration explicit and local.
- Avoid hard-coding production paths.
- Keep migrations versioned and testable.
- Preserve local-first data ownership.
- Keep administrative behavior protected by RBAC.
- Document setup clearly before automating it.

This strategy supports future installer work without requiring application-code changes today.
