# Manual API Testing

This document explains how to manually test the Enterprise Auth Service API during local development.

## Requirements

- PostgreSQL running locally.
- Enterprise Auth Service configured with a valid `.env`.
- Database migrations executed.
- Laravel development server running.

## Start the local server

From the Auth Service Laravel directory:

```powershell
cd C:\Projects\Enterprise-Core\services\enterprise-auth-service\src
php artisan serve
```

Default local URL:

```text
http://127.0.0.1:8000
```

---

## Create a test user

Run Tinker:

```powershell
php artisan tinker
```

Create a local test user:

```php
\App\Models\User::create([
    'name' => 'Admin User',
    'email' => 'admin@example.com',
    'password' => bcrypt('password123'),
]);
```

Exit Tinker:

```php
exit
```

---

## Health Check

### Request

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://127.0.0.1:8000/api/health" `
  -Headers @{ "Accept" = "application/json" }
```

### Expected Response

```json
{
  "status": "ok",
  "service": "enterprise-auth-service"
}
```

---

## Login

### Request

```powershell
$response = Invoke-RestMethod -Method Post `
  -Uri "http://127.0.0.1:8000/api/login" `
  -ContentType "application/json" `
  -Headers @{ "Accept" = "application/json" } `
  -Body '{"email":"admin@example.com","password":"password123"}'

$response
```

### Expected Response

```json
{
  "token": "plain-text-token",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "roles": [],
    "permissions": []
  }
}
```

Store the token:

```powershell
$token = $response.token
```

---

## Authenticated User

### Request

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://127.0.0.1:8000/api/me" `
  -Headers @{
    "Accept" = "application/json"
    "Authorization" = "Bearer $token"
  }
```

### Expected Response

```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

---

## Logout

### Request

```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://127.0.0.1:8000/api/logout" `
  -Headers @{
    "Accept" = "application/json"
    "Authorization" = "Bearer $token"
  }
```

### Expected Response

```json
{
  "message": "Logged out successfully."
}
```

---

## System Events

System events are protected by `auth:sanctum`, `active-user`, and the `view-system-events` permission.

Use an Administrator account seeded with the current permissions, or assign `view-system-events` to the role used by the test account.

### Request

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://127.0.0.1:8000/api/system-events?limit=25" `
  -Headers @{
    "Accept" = "application/json"
    "Authorization" = "Bearer $token"
  }
```

### Expected Response

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
  "limit": 25
}
```

Current events include login, logout, user creation, user updates, user activation/deactivation, and user role assignment/removal.

System events must not contain passwords, Sanctum tokens, raw credentials, or full request bodies. Failed login events may include the attempted email only.

---

## Unauthorized Request Example

Calling a protected endpoint without a Bearer token should return `401 Unauthorized`.

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://127.0.0.1:8000/api/me" `
  -Headers @{ "Accept" = "application/json" }
```

Expected result:

```json
{
  "message": "Unauthenticated."
}
```

---

## Notes

- Tokens must not be committed to Git.
- The `.env` file must not be committed.
- Test users created manually are only for local development.
- User management responses include `is_active`; new users default to active, and inactive users cannot login.
- System Events are read-only through the API and require `view-system-events`.
- Automated tests remain the source of truth for expected API behavior.
