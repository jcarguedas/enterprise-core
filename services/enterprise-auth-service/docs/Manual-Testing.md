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
    "email": "admin@example.com"
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
- Automated tests remain the source of truth for expected API behavior.
