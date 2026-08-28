# Costa Rica Taxpayer Lookup

## Purpose

This document describes a future architecture for helping users prefill customer
fiscal profile data by consulting Costa Rica Hacienda taxpayer information.

The feature is intended to support customer data preparation only. It does not
implement Costa Rica electronic invoicing, invoice issuance, document signing,
or tax calculation.

## Non-Goals

This design does not implement:

- Electronic invoicing.
- XML generation.
- XAdES signing.
- Invoice key generation.
- Consecutive numbers.
- Branches or terminals.
- Tax calculation.
- CABYS selection.
- Invoice issuing.
- Hacienda authentication for sending documents.

## External Source

The intended external source is the Hacienda public taxpayer endpoint:

```text
GET https://api.hacienda.go.cr/fe/ae?identificacion={identification_number}
```

The endpoint may return taxpayer-related data such as:

- Name.
- Identification type.
- Tax regime.
- Tax status.
- Economic activities.

Exact response normalization, error handling, and data retention rules should be
defined during implementation.

## Validation Constraints

Before calling Hacienda, the system should validate that:

- The identification value is numeric.
- The identification value is 9 to 12 digits.
- The lookup was explicitly triggered by the user through a button or command.

Lookup must not run on every keystroke. Customer form typing should remain local
until the user asks to consult Hacienda.

## Recommended Internal Flow

The recommended flow is:

```text
Admin Web -> Enterprise Auth Service -> Hacienda public API
```

Admin Web should not call Hacienda directly. The backend should mediate lookup
requests so Enterprise Core can centralize validation, rate limiting, caching,
response normalization, error handling, permissions, and audit behavior.

## Proposed Backend Endpoint

A future internal endpoint could be:

```text
GET /api/taxpayer-lookup?identification_number=...
```

The exact route can be decided during implementation.

The endpoint should:

- Validate `identification_number` before lookup.
- Check a local cache first.
- Call Hacienda only when needed.
- Normalize the response.
- Avoid exposing raw Hacienda payloads directly to the frontend unless that is
  intentionally designed.
- Return a safe DTO for Admin Web.

## Local Customer Existence Check

Before creating a new customer from a command or lookup flow, the system must
check whether a local customer already exists with the same
`identification_number`.

Future behavior should be:

- If exactly one local customer exists, open the Customers page in edit mode for
  that customer and optionally offer a "refresh fiscal data from Hacienda"
  action.
- If no local customer exists, run taxpayer lookup through the backend and
  prefill the create customer form.
- If multiple local customers match, show a selection state and do not mutate
  records automatically.

This local-first check prevents accidental duplicate customer creation and keeps
the user's existing customer record as the source of operational context.

## Command Center Flow

Future command examples:

```text
Crear cliente 3101123456
Crear cliente cedula 3101123456
Consultar Hacienda 3101123456
Actualizar cliente 3101123456
```

Command behavior should:

- Parse a possible identification number from command text.
- Validate that the parsed value is 9 to 12 numeric digits.
- Search local loaded customers first when available.
- Navigate to `/customers` with an intent query if local data is incomplete.
- Never create or update a customer automatically.
- Require explicit user confirmation before saving changes.
- Show a preview before applying any future "update from Hacienda" result.

Possible future routes:

```text
/customers?intent=create-customer&identification_number=3101123456
/customers?intent=edit-customer&search=3101123456
/customers?intent=taxpayer-lookup&identification_number=3101123456
```

Exact intent names can be decided during implementation.

## Caching Strategy

A future local cache table should be introduced before relying on repeated
external calls:

```text
taxpayer_lookup_cache
```

Suggested fields:

- `id`
- `identification_number`
- `source`
- `payload` JSON
- `normalized_payload` JSON nullable
- `fetched_at`
- `expires_at`
- `created_at`
- `updated_at`

The cache should:

- Avoid repeated calls to Hacienda for the same identification.
- Reduce the risk of `429 Too Many Requests` responses.
- Reduce the risk of IP blocks.
- Allow graceful fallback if Hacienda is unavailable.

A starting TTL of 24 hours is reasonable and can be adjusted after observing
real usage and Hacienda response behavior.

## Rate Limiting and Resilience

The backend must rate limit the internal lookup endpoint.

The backend should handle Hacienda responses including:

- `400 Bad Request`
- `404 Not Found`
- `429 Too Many Requests`
- `5xx` server errors

Customer creation must not be blocked if lookup fails. Admin Web should show a
user-friendly message and let the user continue entering fiscal data manually.

System Events should store only safe metadata for lookup attempts, successes,
and failures. They must not store the full Hacienda payload.

## Frontend UX

The future Admin Web flow should allow the user to:

- Enter or select identification data.
- Click "Consultar Hacienda" or run a command.
- See a loading state while the backend performs the lookup.
- Preview returned data before applying it to an existing customer.
- Apply returned data to selected customer fields.

Candidate fields for prefill:

- `name`
- `legal_name`
- `identification_type`
- `identification_number`
- `economic_activity_code`
- `economic_activity_name`

If multiple economic activities are returned, the user should select one.

The frontend must not overwrite manually edited fields without user action. If
useful, Admin Web can show whether data came from the local cache or from a live
Hacienda lookup.

## Privacy and Audit

The system should avoid logging or exposing unnecessary taxpayer data.

System Events should not log the full Hacienda response payload. Safe metadata
may include:

- Lookup attempted.
- Lookup succeeded.
- Lookup failed.
- Source used.
- Masked identification value or identification hash, if needed.

The platform should avoid storing sensitive data beyond what is needed for the
customer profile and lookup cache.

## Future Implementation Phases

### Phase 1

- Architecture document.
- Backend service design.
- Cache migration and model.

### Phase 2

- Backend endpoint.
- Feature tests.
- Safe error handling.
- Rate limiting.

### Phase 3

- Admin Web lookup button.
- Result preview.
- Controlled apply-to-form behavior.

### Phase 4

- Command Center intents for creating a customer by identification.
- Command Center local customer lookup by identification.
- Command Center fiscal data refresh with confirmation.

### Phase 5

- Official economic activity catalog support, if needed.
- Official Costa Rica location catalog import, if needed.

