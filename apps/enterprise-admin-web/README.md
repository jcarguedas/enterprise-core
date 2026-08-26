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
users and shows Users only when the trusted current user has `manage-users`.

The `/users` page does not request `GET /api/users` when the trusted current
user lacks `manage-users`; it shows an access-denied message inside the admin
layout instead. Backend `403 Forbidden` responses remain the fallback authority
for permission enforcement.

The `/roles` page follows the same pattern for `GET /api/roles` and shows a
read-only role catalog when the trusted current user has `manage-users`.

The `/system` page is available to authenticated users without requiring
`manage-users`. It is informational only and does not perform update checks.

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
only. It includes known destinations for Dashboard, Users, Roles, System, and
Settings, with localized aliases such as `home`, `usuarios`, `permisos`, and
`configuracion`.

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
