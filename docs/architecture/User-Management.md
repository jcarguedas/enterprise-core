# User Management Architecture

## Overview

User Management is part of the Enterprise Auth Service and provides administrative capabilities for managing system users within Enterprise Core.

This module is designed for enterprise-controlled user administration. It does not expose public user registration.

## Goals

- Allow authorized administrators to manage users.
- Keep user management protected through authentication and RBAC authorization.
- Provide predictable API responses for frontend and external API consumers.
- Keep controllers focused on request handling and delegate authorization to middleware.
- Maintain test coverage for successful, unauthorized, forbidden, validation, and not found scenarios.

## Current Endpoints

```text
GET   /api/users
POST  /api/users
GET   /api/users/{user}
PATCH /api/users/{user}
```

## Security Model

All user management endpoints require:

```text
auth:sanctum
permission:manage-users
```

This means:

- Requests without a valid Bearer token receive `401 Unauthorized`.
- Authenticated users without the `manage-users` permission receive `403 Forbidden`.
- Authenticated users with the `manage-users` permission can access user management operations.

## RBAC Integration

Authorization is handled through the reusable permission middleware:

```php
->middleware('permission:manage-users')
```

The middleware uses the existing RBAC helper:

```php
$user->hasPermission('manage-users')
```

This keeps authorization rules declarative at the route level and avoids duplicating permission checks inside controllers.

## Response Shape

User management responses expose only safe user identity fields:

```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com"
}
```

Sensitive fields must not be returned, including:

- `password`
- `remember_token`
- access tokens
- roles
- permissions

Roles and permissions may be exposed later through dedicated endpoints if required.

## Current Capabilities

### List Users

Returns a list of users ordered by ID ascending.

```text
GET /api/users
```

### Create User

Creates a new user with validated name, email, and password.

```text
POST /api/users
```

### Show User

Returns the details of a specific user.

```text
GET /api/users/{user}
```

### Update User

Updates name, email, and/or password for an existing user.

```text
PATCH /api/users/{user}
```

## Validation Strategy

User creation and update operations validate:

- `name`
- `email`
- `password`
- `password_confirmation`

Email uniqueness is enforced.

During updates, the current user's email is excluded from the uniqueness check.

Passwords are hashed by the Laravel `User` model password cast.

## Testing Strategy

User management behavior is covered by feature tests for:

- Authorized users with `manage-users`.
- Guests without authentication.
- Authenticated users without the required permission.
- Invalid payloads.
- Duplicate email validation.
- Missing users returning `404 Not Found`.
- Password update behavior.

## Current Test Coverage

The current test suite validates the following user management scenarios:

- Authenticated user with `manage-users` can create users.
- Guest user cannot create users.
- Authenticated user without `manage-users` cannot create users.
- User creation validates required fields.
- User creation enforces unique email addresses.
- Authenticated user with `manage-users` can list users.
- Guest user cannot list users.
- Authenticated user without `manage-users` cannot list users.
- Authenticated user with `manage-users` can view user details.
- Guest user cannot view user details.
- Authenticated user without `manage-users` cannot view user details.
- Authenticated user with `manage-users` receives `404 Not Found` when viewing a missing user.
- Authenticated user with `manage-users` can update a user's name and email.
- Authenticated user with `manage-users` can update a user's password.
- Guest user cannot update users.
- Authenticated user without `manage-users` cannot update users.
- Authenticated user with `manage-users` receives `404 Not Found` when updating a missing user.
- User update enforces unique email addresses, except for the user being updated.
- Invalid update payloads return `422 Validation Error`.

## Design Decisions

### No Public Registration

Enterprise Core does not currently expose a public registration endpoint.

Users are created by authorized administrators through protected user management endpoints.

This supports an enterprise-oriented model where access is controlled by the organization instead of allowing anonymous public account creation.

### Route-Level Authorization

Permission requirements are declared at the route level using middleware.

This makes administrative access rules easier to see, maintain, and reuse.

Example:

```php
Route::post('/users', [UserController::class, 'store'])
    ->middleware('permission:manage-users');
```

### Thin Controllers

UserController should remain focused on request validation, persistence, and response formatting.

Authorization logic should remain in middleware.

If validation logic grows, Form Request classes may be introduced later.

If response formatting grows, API Resources may be introduced later.

## Future Improvements

Possible next improvements:

- Add `DELETE /api/users/{user}` with safe business rules.
- Add role assignment during user creation or update.
- Add dedicated endpoints for assigning and removing roles.
- Add pagination, search, and filters to `GET /api/users`.
- Consider Form Request classes if validation logic grows.
- Consider API Resources if response transformation becomes more complex.
