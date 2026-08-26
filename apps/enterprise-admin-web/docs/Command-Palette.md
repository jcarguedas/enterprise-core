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
| Users | `/users` | Requires `manage-users` |
| Roles | `/roles` | Requires `manage-users` |
| System | `/system` | Visible to authenticated users |
| Settings | `/settings` | Visible to authenticated users |
| Create User | `/users?intent=create-user` | Requires `manage-users` |

## Typed Aliases

Commands can be found by label, destination, or typed aliases.

Aliases are matched in English and Spanish. Accents are normalized, so both `configuración` and `configuracion` should match the Settings command.

Examples:

- `home`
- `usuarios`
- `permisos`
- `configuracion`
- `crear usuario`
- `nuevo usuario`

## Permission Behavior

The palette respects frontend permission visibility.

Commands that require `manage-users` are hidden when the trusted current user does not have that permission:

- Users.
- Roles.
- Create User.

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
