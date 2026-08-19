# Enterprise Admin Web

Enterprise Admin Web is the protected Next.js administration interface for the
Enterprise Core platform. It connects to the auth API and provides the first
portfolio-grade user administration workflows.

## Current Capabilities

- Authentication against the Enterprise Auth API.
- Protected admin shell with session validation before rendering admin pages.
- Protected dashboard entry point for authenticated administrators.
- Users module backed by real API data from `GET /api/users`.
- User directory with list, refresh, create, and edit workflows.
- Create User flow with validation feedback and authenticated API submission.
- Edit User flow for updating user name and email.
- Manual users refresh to reload the user directory from the API.
- Create/Edit form coordination so only one user form is active at a time.
- User role management for viewing, assigning, and removing user roles.

Current limitations:

- No user deactivation flow yet.
- No delete user flow yet.
- No runtime language switcher yet.

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
