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
- Seeders are idempotent and do not duplicate records when executed multiple times.

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
