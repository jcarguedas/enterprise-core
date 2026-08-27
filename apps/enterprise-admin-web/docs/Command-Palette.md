# Command Palette

## Purpose

The Admin Web Command Palette is a protected productivity feature for opening known destinations and preparing safe UI workflows from one place.

It is intentionally limited to safe, registered commands. It does not execute arbitrary actions, create records automatically, or bypass permissions.

## How to Open

The command palette is available on protected Admin Web pages.

Open it with:

- Header button: `Command` / `Comando`.
- Windows/Linux shortcut: `Ctrl+K`.
- macOS shortcut: `Command+K`.

Close it with:

- `Escape`.
- Backdrop click.
- Close button.

## Current Commands

| Command | Destination | Visibility |
| --- | --- | --- |
| Dashboard | `/dashboard` | Visible to authenticated users |
| Customers | `/customers` | Requires `view-customers` |
| Users | `/users` | Requires `manage-users` |
| Roles | `/roles` | Requires `manage-users` |
| System | `/system` | Visible to authenticated users |
| System Events | `/system/events` | Requires `view-system-events` |
| Settings | `/settings` | Visible to authenticated users |
| Create User | `/users?intent=create-user` | Requires `manage-users` |
| Create Customer | `/customers?intent=create-customer` | Requires `manage-customers` |
| Search Customers | `/customers?search=<query>` | Requires `view-customers` |
| Search Users | `/users?search=<query>` | Requires `manage-users` |
| Edit User | `/users?intent=edit-user&search=<query>` | Requires `manage-users` |
| Edit Customer | `/customers?intent=edit-customer&search=<query>` | Requires `manage-customers` |

## Typed Aliases

Commands can be found by label, destination, or typed aliases.

Aliases are matched in English and Spanish. Accents are normalized, so both `configuración` and `configuracion` should match the Settings command.

Examples:

- `home`
- `clientes`
- `customer list`
- `usuarios`
- `permisos`
- `audit log`
- `eventos del sistema`
- `configuracion`
- `crear usuario`
- `nuevo usuario`
- `crear cliente`
- `nuevo cliente`

Safe user search phrases are also supported:

- `search user Jean Carlos`
- `find user Jean Carlos`
- `buscar usuario Jean Carlos`
- `ver usuario Jean Carlos`
- `usuario Jean Carlos`

Safe customer search phrases are supported:

- `search customer Acme`
- `find customer Acme`
- `customer Acme`
- `buscar cliente Acme`
- `ver cliente Acme`
- `cliente Acme`

Safe edit-user preparation phrases are supported:

- `edit user Jean Carlos`
- `update user Jean Carlos`
- `editar usuario Jean Carlos`
- `actualizar usuario Jean Carlos`

Safe edit-customer preparation phrases are supported:

- `edit customer Acme`
- `update customer Acme`
- `editar cliente Acme`
- `actualizar cliente Acme`

## Permission Behavior

The palette respects frontend permission visibility.

Commands that require `manage-users` are hidden when the trusted current user does not have that permission:

- Users.
- Roles.
- Create User.
- Search Users.
- Edit User.

The System Events command requires `view-system-events` and is hidden when that permission is missing.

Customers and Search Customers require `view-customers` and are hidden when that permission is missing.

Create Customer and Edit Customer require `manage-customers` and are hidden when that permission is missing.

Frontend visibility improves usability, but backend authorization remains the final enforcement layer for protected API behavior.

## Create User Intent

The Create User command navigates to:

```text
/users?intent=create-user
```

The Users page responds by opening and preparing the existing Create User form.

This command does not:

- Create a user automatically.
- Submit the form automatically.
- Bypass validation.
- Bypass permissions.
- Add new backend calls beyond the existing Users page behavior.

## User Search Intent

The command palette can detect simple typed user search phrases and navigate to:

```text
/users?search=<query>
```

For example:

```text
search user Jean Carlos
```

navigates to:

```text
/users?search=Jean%20Carlos
```

The Users page fills the existing search input with the query and reuses its current local filtering behavior.

This intent does not:

- Call the backend from the command palette.
- Open edit mode automatically.
- Create, update, deactivate, or delete users.
- Bypass `manage-users`.

## Create Customer Intent

The Create Customer command navigates to:

```text
/customers?intent=create-customer
```

The Customers page responds by opening and preparing the existing Create Customer form.

This command does not:

- Create a customer automatically.
- Submit the form automatically.
- Bypass validation.
- Bypass permissions.
- Add new backend calls beyond the existing Customers page behavior.

## Customer Search Intent

The command palette can detect simple typed customer search phrases and navigate to:

```text
/customers?search=<query>
```

For example:

```text
search customer Acme
```

navigates to:

```text
/customers?search=Acme
```

The Customers page fills the existing local search input with the query and filters the currently loaded customer list.

This intent does not:

- Call the backend from the command palette.
- Open edit mode automatically.
- Create, update, deactivate, delete, or export customers.
- Bypass `view-customers`.

## Edit Customer Intent

The command palette can detect simple typed edit-customer phrases and navigate to:

```text
/customers?intent=edit-customer&search=<query>
```

For example:

```text
edit customer Acme
```

navigates to:

```text
/customers?intent=edit-customer&search=Acme
```

The Customers page applies the existing search filter. If exactly one customer matches after filtering, it opens the existing edit form for that customer.

If zero or multiple customers match, the page leaves the search filter applied and does not open edit mode automatically.

This intent does not:

- Submit customer changes automatically.
- Update, deactivate, delete, create, or export customers.
- Call the backend from the command palette.
- Bypass `manage-customers`.

## Edit User Intent

The command palette can detect simple typed edit-user phrases and navigate to:

```text
/users?intent=edit-user&search=<query>
```

For example:

```text
edit user Jean Carlos
```

navigates to:

```text
/users?intent=edit-user&search=Jean%20Carlos
```

The Users page applies the existing search filter. If exactly one user matches after filtering, it opens the existing edit form for that user.

If zero or multiple users match, the page leaves the search filter applied and does not open edit mode automatically.

This intent does not:

- Submit user changes automatically.
- Update, deactivate, delete, or create users.
- Call the backend from the command palette.
- Bypass `manage-users`.

## Safety Boundaries

The current command palette supports safe known navigation and preparation commands only.

It does not implement:

- AI.
- Voice input.
- Mutation commands.
- Arbitrary route execution.
- Arbitrary API calls.
- Confirmations.
- Audit logs.

Sensitive commands in future modules should require backend permission enforcement, frontend permission visibility, explicit confirmation, audit logs, and clear result feedback.

## Future Direction

Future Enterprise Core modules should define command surfaces during design.

Voice and AI may become input layers later, but they should map user intent to known registered commands. AI should not execute arbitrary actions directly.

Future command types may include:

- Safe navigation commands.
- Safe preparation commands.
- Sensitive mutation commands with confirmation and audit logging.

## Troubleshooting

If a command is missing, confirm that the current user has the required permission.

If `Ctrl+K` or `Command+K` does not open the palette, use the `Command` / `Comando` button in the protected header.

If Create User opens the Users page but the form does not appear, confirm that the session is valid and the current user has `manage-users`.
