# Enterprise Auth Service API

Enterprise Auth Service exposes REST endpoints for authentication and identity operations within the Enterprise Core ecosystem.

Base path:

```text
/api
```

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
    "email": "admin@example.com"
  }
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
GET  /api/health
POST /api/login
GET  /api/me
POST /api/logout
GET  /api/users
POST /api/users
```


## Authentication Strategy

This API uses Laravel Sanctum tokens for authentication.

Authorization is handled by the internal RBAC domain model:

```text
User::hasRole()
User::hasPermission()
Role::hasPermission()
```
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
      "email": "admin@example.com"
    },
    {
      "id": 2,
      "name": "Operator User",
      "email": "operator@example.com"
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
