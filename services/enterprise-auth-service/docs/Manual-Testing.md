# Manual API Testing

This document explains how to manually test the Enterprise Auth Service API during local development.

## Requirements

- PostgreSQL running locally.
- Enterprise Auth Service configured with a valid `.env`.
- Database migrations executed.
- Laravel development server running.
- Database seeders executed with `php artisan migrate --seed`.

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

## Demo admin user

After running migrations and seeders, a local demo administrator account is available:

```text
Email: admin@example.com
Password: password123
```

These are demo credentials for local development and technical demos only. Change them for any non-demo environment.

The demo admin is active and assigned to the `Administrator` role.

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
    "name": "Admin",
    "email": "admin@example.com",
    "roles": [
      "administrator"
    ],
    "permissions": [
      "lookup-taxpayer",
      "manage-customers",
      "manage-users",
      "view-customers",
      "view-system-events"
    ]
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
    "name": "Admin",
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

Customer fiscal profile fields are optional and nullable. They prepare customer records for a future Costa Rica electronic invoicing module only. Electronic invoicing is not implemented yet: no Hacienda API calls, Hacienda lookups, XML generation, signing, invoice keys, consecutive numbers, branches, terminals, CABYS handling, invoice emission, or tax calculation are performed.

Location catalogs and economic activity selection/catalogs are not implemented yet. Existing `province`, `canton`, `district`, and `neighborhood` text fields remain for backward compatibility. The newer code/name fields are intended for a future catalog-backed UI.

`identification_type` is optional. When provided, use a Costa Rica fiscal identification code:

```text
01 = Cedula fisica
02 = Cedula juridica
03 = DIMEX
04 = NITE
05 = Extranjero No Domiciliado
```

### Create Customer

```powershell
$customerResponse = Invoke-RestMethod -Method Post `
  -Uri "http://127.0.0.1:8000/api/customers" `
  -ContentType "application/json" `
  -Headers @{
    "Accept" = "application/json"
    "Authorization" = "Bearer $token"
  } `
  -Body '{"name":"Acme Corporation","legal_name":"Acme Corporation Sociedad Anonima","commercial_name":"Acme","email":"billing@acme.test","fiscal_email":"invoices@acme.test","economic_activity_code":"620100","economic_activity_name":"Software development services","phone":"+506 2222 3333","identification_type":"02","identification_number":"123456789","address":"San Jose","province":"San Jose","province_code":"1","province_name":"San Jose","canton":"Central","canton_code":"01","canton_name":"Central","district":"Carmen","district_code":"01","district_name":"Carmen","neighborhood":"Amon","neighborhood_code":"01","neighborhood_name":"Amon","other_signs":"North side of the central park.","fiscal_notes":"Optional fiscal profile notes."}'

$customerResponse
```

Expected result:

```json
{
  "customer": {
    "id": 1,
    "name": "Acme Corporation",
    "legal_name": "Acme Corporation Sociedad Anonima",
    "commercial_name": "Acme",
    "email": "billing@acme.test",
    "fiscal_email": "invoices@acme.test",
    "economic_activity_code": "620100",
    "economic_activity_name": "Software development services",
    "phone": "+506 2222 3333",
    "identification_type": "02",
    "identification_number": "123456789",
    "address": "San Jose",
    "province": "San Jose",
    "province_code": "1",
    "province_name": "San Jose",
    "canton": "Central",
    "canton_code": "01",
    "canton_name": "Central",
    "district": "Carmen",
    "district_code": "01",
    "district_name": "Carmen",
    "neighborhood": "Amon",
    "neighborhood_code": "01",
    "neighborhood_name": "Amon",
    "other_signs": "North side of the central park.",
    "notes": null,
    "fiscal_notes": "Optional fiscal profile notes.",
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
  -Body '{"name":"Acme Corporation Updated","fiscal_email":"updated-invoices@acme.test","economic_activity_code":"471100","economic_activity_name":"Retail sale in non-specialized stores","province":"Alajuela","province_code":"2","province_name":"Alajuela","canton":"San Carlos","canton_code":"10","canton_name":"San Carlos","district":"Quesada","district_code":"01","district_name":"Quesada","is_active":false}'
```

Customer create and update actions write system events:

```text
customers.created
customers.updated
customers.activated
customers.deactivated
```

Customer event metadata stores safe summaries only, currently `target_name` and `target_email`. It does not store full request bodies, customer notes, economic activity, fiscal email, full fiscal profiles, address/location fields, address details, or `fiscal_notes`.

---

## Costa Rica Taxpayer Lookup

Taxpayer lookup is protected by `auth:sanctum`, `active-user`, and the `lookup-taxpayer` permission.

Use an Administrator account seeded with the current permissions, or assign `lookup-taxpayer` to the role used by the test account.

This endpoint is a backend-mediated Hacienda lookup foundation for customer fiscal data prefill. It is not electronic invoicing and does not generate invoices, XML, signatures, invoice keys, consecutive numbers, branches, terminals, CABYS data, document emission, or taxes.

### Request

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://127.0.0.1:8000/api/taxpayer-lookup?identification_number=3101123456" `
  -Headers @{
    "Accept" = "application/json"
    "Authorization" = "Bearer $token"
  }
```

### Expected Successful Response

```json
{
  "taxpayer": {
    "identification_number": "3101123456",
    "name": "ACME SOCIEDAD ANONIMA",
    "identification_type": "02",
    "tax_regime": "Traditional",
    "tax_status": "Active",
    "economic_activities": [
      {
        "code": "6201.0",
        "name": "Software development",
        "status": "Active"
      }
    ]
  },
  "source": "live",
  "fetched_at": "2026-08-27T15:30:00.000000Z"
}
```

`source` can be `live` or `cache`. The backend checks `taxpayer_lookup_caches` before calling Hacienda. The default cache TTL is 24 hours.

### Validation

`identification_number` is required and must be numeric with 9 to 12 digits.

Invalid requests return `422 Validation Error`.

### Friendly Error Handling

The endpoint maps Hacienda and connection failures to friendly responses:

- `404 Not Found` when no taxpayer record is found.
- `429 Too Many Requests` when Hacienda rate limits lookup.
- `503 Service Unavailable` when Hacienda is unavailable or a connection timeout occurs.

Raw Hacienda payloads are not returned in error responses.

### System Events

Taxpayer lookup writes:

```text
taxpayer_lookup.succeeded
taxpayer_lookup.failed
```

Metadata stores only source, HTTP status, and a masked identification number such as `******3456`. It must not store full Hacienda payloads or full taxpayer data.

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
