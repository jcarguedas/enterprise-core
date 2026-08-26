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

## Customers

Customers are protected by `auth:sanctum` and `active-user`.

Read routes require `view-customers`. Create and update routes require `manage-customers`.

Use an Administrator account seeded with the current permissions, or assign the required customer permissions to the role used by the test account.

### Create Customer

```powershell
$customerResponse = Invoke-RestMethod -Method Post `
  -Uri "http://127.0.0.1:8000/api/customers" `
  -ContentType "application/json" `
  -Headers @{
    "Accept" = "application/json"
    "Authorization" = "Bearer $token"
  } `
  -Body '{"name":"Acme Corporation","email":"billing@acme.test","phone":"+506 2222 3333"}'

$customerResponse
```

Expected result:

```json
{
  "customer": {
    "id": 1,
    "name": "Acme Corporation",
    "email": "billing@acme.test",
    "phone": "+506 2222 3333",
    "identification_type": null,
    "identification_number": null,
    "address": null,
    "notes": null,
    "is_active": true,
    "created_by_user_id": 1,
    "updated_by_user_id": 1,
    "created_at": "2026-08-26T15:30:00.000000Z",
    "updated_at": "2026-08-26T15:30:00.000000Z"
  }
}
```

### List Customers

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://127.0.0.1:8000/api/customers" `
  -Headers @{
    "Accept" = "application/json"
    "Authorization" = "Bearer $token"
  }
```

### Update Customer

```powershell
Invoke-RestMethod -Method Patch `
  -Uri "http://127.0.0.1:8000/api/customers/1" `
  -ContentType "application/json" `
  -Headers @{
    "Accept" = "application/json"
    "Authorization" = "Bearer $token"
  } `
  -Body '{"name":"Acme Corporation Updated","is_active":false}'
```

Customer create and update actions write system events:

```text
customers.created
customers.updated
customers.activated
customers.deactivated
```

Customer event metadata stores safe summaries only. It does not store full request bodies or customer notes.

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
- Customer routes require `view-customers` for reads and `manage-customers` for create/update.
- Automated tests remain the source of truth for expected API behavior.
