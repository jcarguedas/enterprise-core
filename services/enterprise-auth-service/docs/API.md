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
GET   /api/taxpayer-lookup
GET   /api/customers
POST  /api/customers
GET   /api/customers/{customer}
PATCH /api/customers/{customer}
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

Customer read endpoints are protected with:

```text
auth:sanctum
active-user
permission:view-customers
```

Customer create and update endpoints are protected with:

```text
auth:sanctum
active-user
permission:manage-customers
```

Taxpayer lookup endpoints are protected with:

```text
auth:sanctum
active-user
permission:lookup-taxpayer
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

## Customers

Customers are the first business-domain module foundation in Enterprise Auth Service.

The module is intentionally small and API-first. It supports listing, detail, creation, partial updates, and optional fiscal profile data for customer records.

The fiscal profile fields prepare customer data for a future Costa Rica electronic invoicing module. Electronic invoicing is not implemented yet: the service does not call Hacienda APIs, perform Hacienda lookups, generate XML, sign documents, generate invoice keys, generate consecutive numbers, manage branches or terminals, calculate taxes, manage CABYS, or emit invoices.

Location catalogs and economic activity selection/catalogs are not implemented yet. Existing `province`, `canton`, `district`, and `neighborhood` text fields remain for backward compatibility. The newer code/name fields are intended for a future catalog-backed UI.

`identification_type` is optional. When provided, it must use one of the Costa Rica fiscal identification codes:

| Code | Meaning |
|---|---|
| `01` | Cedula fisica |
| `02` | Cedula juridica |
| `03` | DIMEX |
| `04` | NITE |
| `05` | Extranjero No Domiciliado |

### List Customers

```http
GET /api/customers
```

Requires `view-customers`.

Example response:

```json
{
  "customers": [
    {
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
      "notes": "Preferred billing contact.",
      "fiscal_notes": "Optional fiscal profile notes.",
      "is_active": true,
      "created_by_user_id": 1,
      "updated_by_user_id": 1,
      "created_at": "2026-08-26T15:30:00.000000Z",
      "updated_at": "2026-08-26T15:30:00.000000Z"
    }
  ]
}
```

### View Customer

```http
GET /api/customers/{customer}
```

Requires `view-customers`.

Example response:

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
    "notes": "Preferred billing contact.",
    "fiscal_notes": "Optional fiscal profile notes.",
    "is_active": true,
    "created_by_user_id": 1,
    "updated_by_user_id": 1,
    "created_at": "2026-08-26T15:30:00.000000Z",
    "updated_at": "2026-08-26T15:30:00.000000Z"
  }
}
```

### Create Customer

```http
POST /api/customers
```

Requires `manage-customers`.

Example request:

```json
{
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
  "notes": "Preferred billing contact.",
  "fiscal_notes": "Optional fiscal profile notes.",
  "is_active": true
}
```

Validation rules:

| Field | Rules |
|---|---|
| `name` | required, string, max 255 |
| `legal_name` | nullable, string, max 255 |
| `commercial_name` | nullable, string, max 255 |
| `email` | nullable, email, max 255 |
| `fiscal_email` | nullable, email, max 255 |
| `economic_activity_code` | nullable, string, max 20 |
| `economic_activity_name` | nullable, string, max 255 |
| `phone` | nullable, string, max 50 |
| `identification_type` | nullable, string, one of `01`, `02`, `03`, `04`, `05` |
| `identification_number` | nullable, string, max 100 |
| `address` | nullable, string, max 500 |
| `province` | nullable, string, max 100 |
| `province_code` | nullable, string, max 2 |
| `province_name` | nullable, string, max 100 |
| `canton` | nullable, string, max 100 |
| `canton_code` | nullable, string, max 2 |
| `canton_name` | nullable, string, max 100 |
| `district` | nullable, string, max 100 |
| `district_code` | nullable, string, max 2 |
| `district_name` | nullable, string, max 100 |
| `neighborhood` | nullable, string, max 100 |
| `neighborhood_code` | nullable, string, max 2 |
| `neighborhood_name` | nullable, string, max 100 |
| `other_signs` | nullable, string, max 500 |
| `notes` | nullable, string, max 2000 |
| `fiscal_notes` | nullable, string, max 2000 |
| `is_active` | nullable, boolean |

New customers default to active when `is_active` is omitted.

Fiscal fields are optional and nullable. They are data preparation only and do not trigger electronic invoicing behavior.

Successful response:

```http
201 Created
```

### Update Customer

```http
PATCH /api/customers/{customer}
```

Requires `manage-customers`.

Allows partial updates using the same field limits as create. `updated_by_user_id` is set to the current authenticated user.

Example request:

```json
{
  "name": "Acme Corporation Updated",
  "is_active": false
}
```

Successful response:

```http
200 OK
```

### Customer Event Types

```text
customers.created
customers.updated
customers.activated
customers.deactivated
```

Customer event metadata stores safe summaries such as `target_name` and `target_email`. It does not store full request bodies or customer notes.

Customer event metadata must not store full fiscal profiles, economic activity, fiscal email, address/location code or name details, address details, or `fiscal_notes`.

---

## Costa Rica Taxpayer Lookup

The taxpayer lookup endpoint provides a backend-mediated foundation for future customer fiscal data prefill using the Hacienda public taxpayer API.

This endpoint is data lookup only. It does not implement electronic invoicing, generate invoices, generate XML, sign documents, generate invoice keys, generate consecutive numbers, manage branches or terminals, calculate taxes, manage CABYS, or emit invoices.

```http
GET /api/taxpayer-lookup?identification_number=3101123456
```

Requires `lookup-taxpayer`.

The backend validates the identification number, checks the local cache first, calls Hacienda only when needed, normalizes the response, and returns a safe DTO. Raw Hacienda payloads are not returned directly to Admin Web.

### Query Parameters

| Parameter | Type | Required | Rules |
|---|---|---:|---|
| `identification_number` | string | yes | numeric, 9 to 12 digits |

### Successful Response

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

`source` is either `live` or `cache`.

### Error Responses

Missing or invalid identification number:

```http
422 Validation Error
```

Hacienda rejected the lookup request:

```http
422 Unprocessable Entity
```

No taxpayer record was found:

```http
404 Not Found
```

Hacienda rate limiting:

```http
429 Too Many Requests
```

Hacienda unavailable or connection timeout:

```http
503 Service Unavailable
```

Error responses use friendly messages and do not include raw Hacienda payloads.

### Cache Behavior

Successful live lookups are stored in `taxpayer_lookup_caches` with the raw payload, normalized payload, status, HTTP status, `fetched_at`, and `expires_at`.

The endpoint checks non-expired cache entries before calling Hacienda. The default TTL is 24 hours and can be configured with `HACIENDA_TAXPAYER_LOOKUP_CACHE_TTL_HOURS`.

### System Events

Taxpayer lookup writes safe system events:

```text
taxpayer_lookup.succeeded
taxpayer_lookup.failed
```

Metadata is limited to `source`, `http_status`, and a masked identification number such as `******3456`. Full Hacienda payloads and full taxpayer data must not be stored in system events.

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
customers.created
customers.updated
customers.activated
customers.deactivated
taxpayer_lookup.succeeded
taxpayer_lookup.failed
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
