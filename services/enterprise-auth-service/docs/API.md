# Enterprise Auth Service API

Enterprise Auth Service exposes REST endpoints for authentication and identity operations within the Enterprise Core ecosystem.

Base path:

```text
/api
```

---

## Health Check

### GET /api/health

Returns the current service health status.

### Response 200

```json
{
  "status": "ok",
  "service": "enterprise-auth-service"
}
```

---

## Login

### POST /api/login

Authenticates a user and returns a Bearer token.

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Response 200

```json
{
  "token": "plain-text-token",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### Response 401

```json
{
  "message": "Invalid credentials."
}
```

Inactive users receive the same generic `401 Unauthorized` response.

### Response 422

Returned when required fields are missing or invalid.

```json
{
  "message": "The email field is required. (and 1 more error)",
  "errors": {
    "email": [
      "The email field is required."
    ],
    "password": [
      "The password field is required."
    ]
  }
}
```

---

## Authenticated User

### GET /api/me

Returns the authenticated user profile.

Requires Bearer token.

Only active roles and active permissions are included.

### Headers

```text
Authorization: Bearer {token}
Accept: application/json
```

### Response 200

```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "roles": [
      {
        "id": 1,
        "name": "Administrator",
        "slug": "administrator",
        "description": "System administrator role",
        "is_active": true
      }
    ],
    "permissions": [
      "manage-users",
      "view-reports"
    ]
  }
}
```

`permissions` is a unique sorted list of permission slugs collected through the user's active roles.

### Response 401

Returned when the token is missing or invalid.

```json
{
  "message": "Unauthenticated."
}
```

### Response 403

Returned when a valid token belongs to an inactive user.

```json
{
  "message": "Your account is inactive."
}
```

---

## Logout

### POST /api/logout

Revokes the current access token.

Requires Bearer token.

### Headers

```text
Authorization: Bearer {token}
Accept: application/json
```

### Response 200

```json
{
  "message": "Logged out successfully."
}
```

### Response 401

Returned when the token is missing or invalid.

```json
{
  "message": "Unauthenticated."
}
```

---

## Current Endpoints

```text
GET   /api/health
POST  /api/login
GET   /api/me
POST  /api/logout
GET   /api/users
POST  /api/users
GET   /api/users/{user}
PATCH /api/users/{user}
GET   /api/roles
GET   /api/system-events
GET   /api/users/{user}/roles
POST  /api/users/{user}/roles
DELETE /api/users/{user}/roles/{role}
```

---

## Authentication Strategy

This API uses Laravel Sanctum tokens for authentication.

Authorization is handled by the internal RBAC domain model:

```text
User::hasRole()
User::hasPermission()
Role::hasPermission()
```

Administrative user management endpoints are protected with:

```text
auth:sanctum
permission:manage-users
```

System event endpoints are protected with:

```text
auth:sanctum
active-user
permission:view-system-events
```

---

## List Users

```http
GET /api/users
```

Lists users in the Enterprise Auth Service.

### Authentication

Requires a valid Bearer token.

```http
Authorization: Bearer {token}
```

### Required Permission

```text
manage-users
```

### Successful Response

Status code:

```http
200 OK
```

Example response:

```json
{
  "users": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "is_active": true
    },
    {
      "id": 2,
      "name": "Operator User",
      "email": "operator@example.com",
      "is_active": true
    }
  ]
}
```

### Error Responses

Guest request without token:

```http
401 Unauthorized
```

Authenticated user without `manage-users` permission:

```http
403 Forbidden
```

Example response:

```json
{
  "message": "This action is unauthorized."
}
```

---

## Create User

```http
POST /api/users
```

Creates a new user in the Enterprise Auth Service.

New users are active by default.

### Authentication

Requires a valid Bearer token.

```http
Authorization: Bearer {token}
```

### Required Permission

```text
manage-users
```

### Request Body

```json
{
  "name": "Operator User",
  "email": "operator@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Validation Rules

| Field | Rules |
|---|---|
| `name` | required, string, max:255 |
| `email` | required, email, max:255, unique among users |
| `password` | required, string, min:8, confirmed |

### Successful Response

Status code:

```http
201 Created
```

Example response:

```json
{
  "user": {
    "id": 2,
    "name": "Operator User",
    "email": "operator@example.com",
    "is_active": true
  }
}
```

### Error Responses

Guest request without token:

```http
401 Unauthorized
```

Authenticated user without `manage-users` permission:

```http
403 Forbidden
```

Example response:

```json
{
  "message": "This action is unauthorized."
}
```

Invalid request body or duplicate email:

```http
422 Validation Error
```

---

## Show User

```http
GET /api/users/{user}
```

Returns the details of a specific user in the Enterprise Auth Service.

### Authentication

Requires a valid Bearer token.

```http
Authorization: Bearer {token}
```

### Required Permission

```text
manage-users
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---:|---:|---|
| `user` | integer | yes | User ID. |

### Successful Response

Status code:

```http
200 OK
```

Example response:

```json
{
  "user": {
    "id": 2,
    "name": "Operator User",
    "email": "operator@example.com",
    "is_active": true
  }
}
```

### Error Responses

Guest request without token:

```http
401 Unauthorized
```

Authenticated user without `manage-users` permission:

```http
403 Forbidden
```

Example response:

```json
{
  "message": "This action is unauthorized."
}
```

Requested user does not exist:

```http
404 Not Found
```

---

## Update User

```http
PATCH /api/users/{user}
```

Updates an existing user in the Enterprise Auth Service.

### Authentication

Requires a valid Bearer token.

```http
Authorization: Bearer {token}
```

### Required Permission

```text
manage-users
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---:|---:|---|
| `user` | integer | yes | User ID. |

### Request Body

All fields are optional, but when provided they must be valid.

```json
{
  "name": "Updated User",
  "email": "updated@example.com",
  "is_active": false,
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

### Validation Rules

| Field | Rules |
|---|---|
| `name` | sometimes, required, string, max:255 |
| `email` | sometimes, required, email, max:255, unique among users except the current user |
| `is_active` | sometimes, boolean |
| `password` | sometimes, required, string, min:8, confirmed |

Self-deactivation is blocked. If an authenticated user sends
`is_active: false` for their own user record, the API returns `422 Validation
Error` with `You cannot deactivate your own account.`

### Successful Response

Status code:

```http
200 OK
```

Example response:

```json
{
  "user": {
    "id": 2,
    "name": "Updated User",
    "email": "updated@example.com",
    "is_active": false
  }
}
```

### Error Responses

Guest request without token:

```http
401 Unauthorized
```

Authenticated user without `manage-users` permission:

```http
403 Forbidden
```

Example response:

```json
{
  "message": "This action is unauthorized."
}
```

Invalid request body:

```http
422 Validation Error
```

Requested user does not exist:

```http
404 Not Found
```

---

## List Roles

```http
GET /api/roles
```

Lists all roles in the Enterprise Auth Service ordered by ID ascending.

### Authentication

Requires a valid Bearer token.

```http
Authorization: Bearer {token}
```

### Required Permission

```text
manage-users
```

### Successful Response

Status code:

```http
200 OK
```

Example response:

```json
{
  "roles": [
    {
      "id": 1,
      "name": "Administrator",
      "slug": "administrator",
      "description": "System administrator role",
      "is_active": true
    }
  ]
}
```

### Error Responses

Guest request without token:

```http
401 Unauthorized
```

Authenticated user without `manage-users` permission:

```http
403 Forbidden
```

Example response:

```json
{
  "message": "This action is unauthorized."
}
```

---

## List User Roles

```http
GET /api/users/{user}/roles
```

Returns the roles assigned to a specific user.

### Authentication

Requires a valid Bearer token.

```http
Authorization: Bearer {token}
```

### Required Permission

```text
manage-users
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---:|---:|---|
| `user` | integer | yes | User ID. |

### Successful Response

Status code:

```http
200 OK
```

Example response:

```json
{
  "roles": [
    {
      "id": 1,
      "name": "Administrator",
      "slug": "administrator",
      "description": "System administrator role",
      "is_active": true
    }
  ]
}
```

### Error Responses

Guest request without token:

```http
401 Unauthorized
```

Authenticated user without `manage-users` permission:

```http
403 Forbidden
```

Example response:

```json
{
  "message": "This action is unauthorized."
}
```

Requested user does not exist:

```http
404 Not Found
```

---

## Assign Role to User

```http
POST /api/users/{user}/roles
```

Assigns a role to a specific user.

This endpoint is idempotent. Assigning the same role more than once does not create duplicate role assignments.

### Authentication

Requires a valid Bearer token.

```http
Authorization: Bearer {token}
```

### Required Permission

```text
manage-users
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---:|---:|---|
| `user` | integer | yes | User ID. |

### Request Body

```json
{
  "role_id": 1
}
```

### Validation Rules

| Field | Rules |
|---|---|
| `role_id` | required, exists in roles |

### Successful Response

Status code:

```http
200 OK
```

Example response:

```json
{
  "roles": [
    {
      "id": 1,
      "name": "Administrator",
      "slug": "administrator",
      "description": "System administrator role",
      "is_active": true
    }
  ]
}
```

### Error Responses

Guest request without token:

```http
401 Unauthorized
```

Authenticated user without `manage-users` permission:

```http
403 Forbidden
```

Example response:

```json
{
  "message": "This action is unauthorized."
}
```

Invalid or missing `role_id`:

```http
422 Validation Error
```

Requested user does not exist:

```http
404 Not Found
```

---

## Remove Role from User

```http
DELETE /api/users/{user}/roles/{role}
```

Removes a role from a specific user.

This endpoint is idempotent. Removing a role that is not assigned to the user still returns `200 OK` with the user's current roles.

### Authentication

Requires a valid Bearer token.

```http
Authorization: Bearer {token}
```

### Required Permission

```text
manage-users
```

### Path Parameters

| Parameter | Type | Required | Description |
|---|---:|---:|---|
| `user` | integer | yes | User ID. |
| `role` | integer | yes | Role ID. |

### Successful Response

Status code:

```http
200 OK
```

Example response:

```json
{
  "roles": [
    {
      "id": 1,
      "name": "Administrator",
      "slug": "administrator",
      "description": "System administrator role",
      "is_active": true
    }
  ]
}
```

### Error Responses

Guest request without token:

```http
401 Unauthorized
```

Authenticated user without `manage-users` permission:

```http
403 Forbidden
```

Example response:

```json
{
  "message": "This action is unauthorized."
}
```

Requested user or role does not exist:

```http
404 Not Found
```

---

## System Events

```http
GET /api/system-events
```

Returns the latest system activity events first.

System events provide a secure chronological foundation for future Admin Web activity log views. They are intended for operational visibility around authentication, user administration, and role assignment activity.

### Authentication

Requires a valid Bearer token for an active user.

```http
Authorization: Bearer {token}
```

### Required Permission

```text
view-system-events
```

### Query Parameters

| Parameter | Type | Required | Description |
|---|---:|---:|---|
| `limit` | integer | no | Maximum number of events to return. Defaults to `50`; maximum is `100`. |

### Successful Response

Status code:

```http
200 OK
```

Example response:

```json
{
  "events": [
    {
      "id": 1,
      "event_type": "auth.login.succeeded",
      "severity": "info",
      "message": "User logged in successfully.",
      "actor_user_id": 1,
      "actor_email": "admin@example.com",
      "target_type": null,
      "target_id": null,
      "ip_address": "127.0.0.1",
      "user_agent": "Example Client",
      "metadata": null,
      "created_at": "2026-08-26T15:30:00.000000Z"
    }
  ],
  "limit": 50
}
```

### Current Event Types

```text
auth.login.succeeded
auth.login.failed
auth.logout
users.created
users.updated
users.activated
users.deactivated
users.roles.assigned
users.roles.removed
```

### Safety Boundary

System events must not store passwords, Sanctum tokens, raw credentials, or full request bodies. Failed login events may store the attempted email address for security review, but never the attempted password.

### Error Responses

Guest request without token:

```http
401 Unauthorized
```

Inactive authenticated user:

```http
403 Forbidden
```

Authenticated user without `view-system-events` permission:

```http
403 Forbidden
```

Example response:

```json
{
  "message": "This action is unauthorized."
}
```
