# Enterprise Admin Web

Enterprise Admin Web is the protected Next.js administration interface for the
Enterprise Core platform. It connects to the auth API and provides the first
portfolio-grade user administration workflows.

## Current Capabilities

- Authentication against the Enterprise Auth API.
- Protected admin shell with session validation before rendering admin pages.
- Protected dashboard entry point for authenticated administrators.
- Permission-aware sidebar and dashboard actions based on `/api/me`
  permissions.
- Runtime English/Spanish language switching stored in the browser.
- Floating toast notifications for non-critical successful operations.
- Users module backed by real API data from `GET /api/users`.
- Users module access gated in the UI by the `manage-users` permission, with
  backend authorization still treated as the final enforcement layer.
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

The language selector appears in the protected admin header.

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

The sidebar keeps Dashboard visible for authenticated users and shows Users only
when the trusted current user has `manage-users`.

The `/users` page does not request `GET /api/users` when the trusted current
user lacks `manage-users`; it shows an access-denied message inside the admin
layout instead. Backend `403 Forbidden` responses remain the fallback authority
for permission enforcement.

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
