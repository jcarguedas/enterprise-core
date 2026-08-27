# Enterprise Admin Web

Enterprise Admin Web is the protected Next.js administration interface for the
Enterprise Core platform. It connects to the auth API and provides the first
portfolio-grade user administration workflows.

The product brand is displayed with the current release label:
`Enterprise Core v1.0.1`.

## Current Capabilities

- Authentication against the Enterprise Auth API.
- Protected admin shell with session validation before rendering admin pages.
- Protected dashboard entry point for authenticated administrators.
- Protected System Info page with read-only product version, API, auth provider,
  deployment direction, and update strategy status.
- Protected System Events page with read-only chronological activity from the
  Enterprise Auth Service.
- Protected Customers page backed by `GET /api/customers`, with create/edit
  workflows available to users with `manage-customers`.
- Customer create/edit forms support optional fiscal profile fields and
  structured location preparation for future Costa Rica fiscal data needs.
- Customer location fields use cascading selects backed by a temporary local
  demo catalog for UX validation.
- Customer economic activity code input is constrained in the UI to the
  `XXXX.X` format as preparation for future Costa Rica fiscal workflows.
- Protected Settings placeholder page for future workspace, localization,
  appearance, and security preferences.
- Protected command palette foundation with safe known navigation commands and
  permission-aware command visibility.
- Permission-aware sidebar and dashboard actions based on `/api/me`
  permissions.
- Runtime English/Spanish language switching stored in the browser.
- Runtime light/dark theme switching stored in the browser.
- Internal dependency-free SVG icons for sidebar navigation and password
  visibility controls.
- Floating toast notifications for non-critical successful operations.
- Localized known backend/API error messages for login and user validation
  workflows.
- Users module backed by real API data from `GET /api/users`.
- Users module access gated in the UI by the `manage-users` permission, with
  backend authorization still treated as the final enforcement layer.
- Read-only Roles page backed by `GET /api/roles`.
- User directory with list, refresh, create, and edit workflows.
- Client-side user search across currently loaded ID, name, email, and status
  values.
- Sortable user table columns for ID, Name, Email, and Status.
- Client-side user pagination over currently loaded users, with page sizes of
  5, 10, and 25 applied after search and sorting.
- Filtered user empty state when no currently loaded users match the search.
- Visible/total user count for filtered directory results.
- Create User flow with validation feedback and authenticated API submission.
- Edit User flow for updating user name and email.
- Manual users refresh to reload the user directory from the API.
- Create/Edit form coordination so only one user form is active at a time.
- User role management for viewing, assigning, and removing user roles.
- User status controls for viewing, deactivating, and reactivating users.

Current limitations:

- No hard delete user flow yet.
- No backend pagination or server-side user search yet; current pagination and
  search are local to the loaded user set.
- No Admin Web customer delete/export/bulk flows yet.

## Language Switching

Admin Web supports runtime language switching between English and Spanish.
English is the default language. The selected locale is stored in
`localStorage` and reused across page navigation and future sessions in the same
browser.

The language selector appears in the public landing page, login page, and
protected admin header.

## Theme Switching

Admin Web supports runtime light/dark theme switching. Light is the default
theme. The selected theme is stored in `localStorage`, applied on the document
root, and reused across page navigation and future sessions in the same browser.

The theme selector appears next to the language selector on the public landing
page, login page, and protected admin header.

## Toast Notifications

Admin Web shows floating toast notifications for non-critical successful
operations such as creating or updating users, changing user active status, and
assigning or removing roles.

Critical/session/access errors and form validation errors remain inline near the
workflow that needs attention.

## Dashboard

The protected dashboard is available at `/dashboard`. It validates the current
session with the Enterprise Auth API before showing protected content.

The dashboard includes:

- Authenticated account summary using the current user's name and email.
- Session security card explaining that protected content depends on successful
  session validation.
- Quick access to User Management when the authenticated user has
  `manage-users`.
- Informational user management access card when the authenticated user does not
  have `manage-users`.

## Permission-Aware Access

The admin shell validates the current session through `GET /api/me` and uses the
returned `user.permissions` array for navigation and dashboard UX decisions.

The sidebar keeps Dashboard, System, and Settings visible for authenticated
users, shows Customers only when the trusted current user has `view-customers`,
and shows Users and Roles only when the trusted current user has `manage-users`.
System Events remains a System subpage and is not shown as a top-level sidebar
item.

The `/users` page does not request `GET /api/users` when the trusted current
user lacks `manage-users`; it shows an access-denied message inside the admin
layout instead. Backend `403 Forbidden` responses remain the fallback authority
for permission enforcement.

The `/customers` page lists customers from `GET /api/customers`. It requires
`view-customers` and includes local search across currently loaded customer
fields. Users with `manage-customers` can create customers through
`POST /api/customers` and edit customers through `PATCH /api/customers/{customer}`.
Users with `view-customers` but without `manage-customers` can only view and
search. Customer delete, export, bulk actions, and quick status toggles are not
implemented.

Customer create/edit forms include optional fiscal profile fields such as legal
name, commercial name, fiscal email, economic activity code/name, structured
province/canton/district/neighborhood code and name values, other signs, and
fiscal notes. The visible location workflow uses cascading selects for
province, canton, district, and neighborhood, backed by a temporary local demo
catalog. Existing province, canton, district, and neighborhood text payload
fields remain supported for backward compatibility.

`identification_type` is optional and uses Costa Rica fiscal identification code
options: `01`, `02`, `03`, `04`, and `05`.

The economic activity code field accepts digits and a single dot, and is
currently constrained in the UI to the `XXXX.X` format when provided, as
preparation for future Costa Rica electronic invoicing data requirements.

These fields only prepare customer records for future Costa Rica fiscal
workflows. Admin Web does not implement electronic invoicing, call Hacienda
APIs, perform Hacienda lookup, provide economic activity catalogs, import
official location catalogs, generate XML, sign documents, manage consecutive
numbers, or calculate taxes.

The `/roles` page follows the same pattern for `GET /api/roles` and shows a
read-only role catalog when the trusted current user has `manage-users`.

The `/system` page is available to authenticated users without requiring
`manage-users`. It is informational only and does not perform update checks.

The `/system/events` page lists the latest backend system events from
`GET /api/system-events`. It requires `view-system-events`, is read-only, and
does not expose raw event metadata, delete events, export events, or perform any
mutation. It is accessible from the `/system` page when the trusted current user
has `view-system-events`, and from the Command Palette with the same permission.

The `/settings` page is available to authenticated users without requiring
`manage-users`. It is a placeholder only and does not persist settings yet.

Access-denied states use a reusable admin component so future protected modules
can present the same restricted-access pattern with a clear explanation and a
return path to `/dashboard`.

## Command Palette

Protected admin pages include a command palette button in the admin header and a
keyboard shortcut:

```text
Ctrl+K on Windows/Linux
Command+K on macOS
```

The current command palette is a safe navigation and typed intent foundation
only. It includes known destinations for Dashboard, Customers, Users, Roles,
System, System Events, and Settings, with localized aliases such as `home`,
`clientes`, `usuarios`, `permisos`, `activity log`, and `configuracion`.

The palette also includes a future-safe Create User intent that navigates to
`/users?intent=create-user`. The Users page responds by opening and preparing
the existing Create User form without submitting anything automatically. Users,
Roles, and Create User are hidden when the trusted current user does not have
`manage-users`.

The palette also supports safe user search phrases such as `search user Jean`,
`find user Jean`, `buscar usuario Jean`, and `usuario Jean`. These navigate to
`/users?search=Jean`, where the Users page fills the existing search input and
reuses the current local filtering behavior.

Safe edit-user phrases such as `edit user Jean`, `update user Jean`,
`editar usuario Jean`, and `actualizar usuario Jean` navigate to
`/users?intent=edit-user&search=Jean`. The Users page applies the search and
opens the existing edit form only when exactly one local user matches.

The palette also supports safe customer search phrases such as
`search customer Acme`, `find customer Acme`, `buscar cliente Acme`, and
`cliente Acme`. These navigate to `/customers?search=Acme`, where the Customers
page fills the local search input and filters the currently loaded customers.

The palette also includes a safe Create Customer intent that navigates to
`/customers?intent=create-customer`. The Customers page responds by opening and
preparing the Create Customer form without submitting anything automatically.

Safe edit-customer phrases such as `edit customer Acme`, `update customer Acme`,
`editar cliente Acme`, and `actualizar cliente Acme` navigate to
`/customers?intent=edit-customer&search=Acme`. The Customers page applies the
search and opens the existing edit form only when exactly one local customer
matches.

AI, mutation commands, confirmations, and audit logging are not implemented in
this foundation.

See [Command Palette](docs/Command-Palette.md) for the Admin Web command
palette manual and [Command Center Roadmap](docs/Command-Center-Roadmap.md)
for the phased product direction.

## Roles

The read-only Roles page is available at `/roles`. It validates the current
session, checks the trusted current user's permissions, and loads role data from
the Enterprise Auth API only when the user has `manage-users`.

The page displays each role's ID, name, slug, description, and active/inactive
status. Role creation, editing, and deletion are not implemented in this
feature.

## User Status Controls

The Users module displays each user's active or inactive status from the
`is_active` field returned by the Enterprise Auth API.

Administrators can deactivate or reactivate users directly from the user table.
Status changes are submitted through `PATCH /api/users/{user}` and update the
affected row without a full page reload.

Inactive users are blocked from logging in by the backend.

## User Role Management

The Users module includes protected role management actions for each user:

- View assigned roles with role name, slug, status, and description.
- Assign active roles from the available role catalog.
- Remove assigned roles without deleting the role itself.

These workflows use authenticated API calls against the Enterprise Auth API:

- `GET /api/users/{user}/roles`
- `GET /api/roles`
- `POST /api/users/{user}/roles`
- `DELETE /api/users/{user}/roles/{role}`

## Local Development

Run the development server:

```bash
npm run dev
```

Validate the application:

```bash
npm run build
npm run lint
```

The API base URL is configured with `NEXT_PUBLIC_API_BASE_URL`. If the variable
is not set, the app defaults to:

```text
http://127.0.0.1:8000/api
```

### Local Network Testing

For mobile testing from another device on the same WiFi network, expose the
backend on the LAN:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Configure the Admin Web `.env.local` file to use the backend LAN URL:

```text
NEXT_PUBLIC_API_BASE_URL=http://<LAN_IP>:8000/api
```

Do not commit `.env.local`.

Run the Admin Web dev server bound to the machine LAN IP:

```bash
npm run dev -- -H <LAN_IP>
```

If files under `/_next/static` return `403`, React may not hydrate and the login
form may fall back to plain HTML submission. In this environment, binding the
dev server directly to `<LAN_IP>` avoids that issue.
