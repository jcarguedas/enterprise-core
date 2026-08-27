# Testing

This document describes the automated test suite for Enterprise Auth Service.

## Run tests

From the Laravel service directory:

```powershell
cd C:\Projects\Enterprise-Core\services\enterprise-auth-service\src
php artisan test
```

## Current test suite

The current test suite validates the main authentication and authorization behavior of the service.

### AuthLoginTest

Validates:

- A user can login with valid credentials.
- A user cannot login with an invalid password.
- Login requires email and password.

### AuthMeLogoutTest

Validates:

- An authenticated user can retrieve their profile using `/api/me`.
- An authenticated user receives active roles in the `/api/me` response.
- An authenticated user receives unique sorted active permission slugs in the `/api/me` response.
- An inactive authenticated user with an existing token cannot access `/api/me`.
- A guest cannot access `/api/me`.
- An authenticated user can logout using `/api/logout`.
- A guest cannot logout.

### DatabaseSeedersTest

Validates:

- Initial roles are created.
- Initial permissions are created.
- Administrator permissions are assigned, including `view-system-events`, `view-customers`, `manage-customers`, and `lookup-taxpayer`.
- Seeders are idempotent and do not duplicate records when executed multiple times.

### CustomerManagementTest

Validates:

- A user with `view-customers` can list customers.
- A user without `view-customers` cannot list customers.
- A user with `view-customers` can view customer detail.
- A user with `manage-customers` can create and update customers.
- A user without `manage-customers` cannot create or update customers.
- Customer creation validates required `name`.
- Customer creation validates `fiscal_email`.
- Customer creation validates Costa Rica fiscal `identification_type` codes.
- Customer create and update responses include optional fiscal profile fields.
- Structured fiscal profile fields can be created and updated without triggering invoicing behavior.
- New customers default to active.
- Customer activation and deactivation create system events.
- Customer creation and update create system events.
- Customer system event metadata excludes economic activity, fiscal email, full fiscal profiles, address/location fields, address details, and `fiscal_notes`.
- Guest and inactive authenticated users cannot access customer routes.

### TaxpayerLookupTest

Validates:

- A guest cannot use `/api/taxpayer-lookup`.
- An inactive authenticated user cannot use `/api/taxpayer-lookup`.
- A user without `lookup-taxpayer` cannot use `/api/taxpayer-lookup`.
- `identification_number` is required.
- `identification_number` must be numeric.
- `identification_number` must be 9 to 12 digits.
- A successful live Hacienda response returns a normalized taxpayer payload.
- A successful live Hacienda response creates a cache entry.
- A second request uses a non-expired cache entry without calling Hacienda again.
- Hacienda `404`, `429`, and `5xx` responses return friendly errors.
- Connection errors and timeouts return friendly `503` errors.
- Successful and failed lookups create safe system events without raw Hacienda payloads or full taxpayer data.

The test suite uses `Http::fake` for Hacienda responses. Tests must not call the real Hacienda API.

### SystemEventsTest

Validates:

- A user with `view-system-events` can list system events.
- A user without `view-system-events` cannot list system events.
- Successful login creates a system event.
- Failed login creates a system event without storing passwords.
- Creating a user creates a system event.
- Updating user active status creates activated and deactivated events.
- Assigning and removing roles creates system events.

### RbacRelationshipsTest

Validates:

- A user can have roles.
- A role can have permissions.
- A user can check if they have a role.
- A role can check if it has a permission.
- A user can check if they have a permission through assigned roles.

## Expected result

The full suite should pass with `php artisan test`.

## Testing rules

- Every meaningful feature should include or update automated tests when applicable.
- Tests should validate behavior, not implementation details.
- Authentication endpoints must include tests for successful and failed scenarios.
- Protected endpoints must include tests for authenticated and unauthenticated access.
- Seeders must be safe to run multiple times.
- System event tests must verify that passwords, tokens, raw credentials, full request bodies, customer economic activity, fiscal email, address/location details, fiscal notes, raw Hacienda payloads, and full taxpayer data are not stored.
