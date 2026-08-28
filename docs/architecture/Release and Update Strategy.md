# Release and Update Strategy

## Purpose

Enterprise Core should have a clear release and update strategy before it grows into a local-first business operations platform.

This document describes a future architecture direction for versioning, release metadata, customer-controlled updates, and database migration safety.

The current implementation only displays a product version label in the Admin Web, such as:

```text
Enterprise Core v1.0.1
```

Real update distribution, update checks, package downloads, licensing enforcement, and automated upgrade workflows are future work.

For the related Windows installer, launcher, and local runtime direction, see [Windows Local Installer Strategy](Windows%20Local%20Installer%20Strategy.md).

## Current Foundation

Enterprise Core currently includes:

- Laravel Enterprise Auth Service.
- PostgreSQL.
- Laravel Sanctum authentication.
- Active and inactive users.
- Roles and permissions.
- Protected API endpoints.
- Next.js Admin Web.
- Public landing page.
- Login page.
- Protected dashboard.
- Users module.
- Read-only Roles page.
- Runtime English and Spanish language switching.
- Runtime light and dark theme switching.
- Toast notifications.
- Reusable access-denied state.
- Permission-aware navigation.
- Product release label displayed in Admin Web.

This foundation is enough to communicate the current product identity, but it does not yet implement an update system.

## Version Display

Admin Web displays a product release label so users can identify which version of Enterprise Core they are using.

The version label is informational only. It does not currently:

- Check for available updates.
- Validate subscription eligibility.
- Download update packages.
- Apply patches.
- Run database migrations.
- Verify local deployment health.

The version display should remain simple and consistent across product areas where release identity matters.

## Semantic Versioning Direction

Enterprise Core should follow semantic versioning as the project matures.

Recommended version meaning:

- `PATCH`: backward-compatible fixes, small UI improvements, security fixes, or low-risk corrections.
- `MINOR`: backward-compatible features, new modules, new endpoints, or additive database changes.
- `MAJOR`: breaking changes, risky database changes, removed capabilities, incompatible API changes, or upgrades that require special migration planning.

Example:

```text
v1.0.1
```

The `v` prefix is useful for display, release tags, and product communication. Internal tooling may store the normalized version separately if needed.

## Local-First Update Model

Enterprise Core has a local-first architecture direction.

Each customer may run its own local instance and database. Customer operational data should stay local by default.

Because local deployments may contain business-critical data and database migrations, local customer instances should not be force-updated automatically.

Instead, the preferred model is:

- Local deployment checks whether update metadata is available.
- Admin Web shows an update notice when a newer version exists.
- Customer or local administrator reviews the release notes.
- Customer or local administrator approves the upgrade.
- Backup or export guidance is completed before risky updates.
- Update is applied intentionally.
- Database migrations run as part of the controlled upgrade process.
- Health checks verify the local deployment after the update.

Safe update flow:

```text
Local instance
-> checks update metadata
-> shows update notice
-> admin reviews notes
-> backup/export
-> apply update
-> run migrations
-> verify health
```

## Optional Cloud Update Network

A future cloud update network may support product operations without storing customer operational data by default.

Potential responsibilities include:

- Latest available version.
- Release notes.
- Migration warnings.
- Download or update package metadata.
- Minimum supported version.
- License or subscription eligibility.
- Product distribution metadata.

The cloud update network should not store local customer business records by default, including customers, inventory, sales, invoices, reports, employees, or operational documents.

On Windows, a future installer or launcher may use this metadata to guide updates, but the local administrator should still confirm the update and complete backup requirements before migrations run.

## Release Metadata

Release metadata should be structured so local deployments can safely evaluate update availability and risk.

Example release metadata:

```json
{
  "product": "Enterprise Core",
  "latestVersion": "v1.1.0",
  "minimumSupportedVersion": "v1.0.0",
  "releasedAt": "2026-08-26",
  "channel": "stable",
  "releaseNotesUrl": "https://updates.example.com/enterprise-core/releases/v1.1.0",
  "package": {
    "url": "https://updates.example.com/enterprise-core/packages/v1.1.0.zip",
    "sha256": "example-release-package-checksum"
  },
  "database": {
    "migrationsRequired": true,
    "migrationRisk": "medium",
    "backupRequired": true,
    "rollbackSupported": false,
    "notes": "Adds backward-compatible tables for the customer module."
  },
  "license": {
    "requiresActiveSubscription": true,
    "eligible": true
  }
}
```

This example is illustrative only. No release metadata service is implemented yet.

## Database Migration Safety

Database migrations are one of the highest-risk parts of updating local-first software.

Enterprise Core updates that include migrations should provide:

- Clear migration notes.
- Compatibility notes.
- Backup guidance.
- Expected migration duration when known.
- Whether the migration is reversible.
- Required minimum version.
- Post-update health checks.

Risky migrations should be treated differently from simple UI or API fixes.

Major versions may be appropriate when database changes are difficult to reverse, require manual preparation, or alter important business workflows.

## Customer-Controlled Updates

Customers or local administrators should remain in control of when updates are applied.

The system may notify administrators of available updates, but approval should be explicit.

Customer-controlled updates are important because:

- Local deployments may run during business hours.
- Updates may require downtime.
- Database migrations may need backups.
- Customers may need to verify integrations.
- Some environments may require internal approval before changes.

Enterprise Core should favor predictable and explainable upgrades over silent automatic changes.

## Rollback and Backup Expectations

Rollback strategy needs careful design because database migrations may not always be reversible.

Future update workflows should assume:

- Backups are required before migration-based updates.
- Export tools may be needed for customer-controlled recovery.
- Rollback may involve restoring a database backup, not simply reinstalling an older application version.
- Release notes should clearly state whether rollback is supported.
- Health verification should happen after an update.

Enterprise Core should provide practical backup, export, import, and restore guidance before offering update workflows that affect local data.

## Licensing Relationship

A future licensing service may validate whether a customer is eligible to receive updates.

Licensing checks may include:

- Active subscription or membership status.
- Current product edition.
- Eligible release channels.
- Minimum supported version.

The licensing service should not require storing customer operational data in the Enterprise Core cloud network by default.

Licensing should support product access and update eligibility, not centralize customer business operations.

## Non-Goals for Now

The following are not goals for the current implementation phase:

- Building an update distribution service.
- Automatically updating customer deployments.
- Downloading or applying update packages.
- Running remote-controlled database migrations.
- Enforcing licensing or subscription status.
- Implementing rollback automation.
- Implementing backup, export, import, or restore workflows.
- Storing customer operational data in a cloud update network by default.
- Promising that all database migrations will be reversible.

## Open Questions

- Where should the canonical product version be stored for backend, frontend, and release tooling?
- Should Admin Web read version metadata from a static frontend module, backend endpoint, or build-time file?
- What release channels should exist first: stable, preview, or internal?
- How should local deployments authenticate with a future update network?
- What metadata is required before an admin can approve a migration-based update?
- Should updates be applied manually, through an installer, or through an in-app maintenance mode?
- What health checks should run after an update?
- How should failed migrations be detected and reported?
- What backup format should Enterprise Core recommend for PostgreSQL deployments?
- What is the minimum rollback standard before customer-facing update workflows are introduced?
