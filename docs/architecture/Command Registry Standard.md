# Command Registry Standard

## Purpose

Enterprise Core commands should be treated as product-level interaction primitives.

A command is not just a button, route, or API call. It is a named user intention that the product understands, can secure, can explain, and may later expose through different input layers such as a command palette, typed text, voice, or AI-assisted intent parsing.

Future modules should define their command surface during design. This helps keep navigation, permissions, confirmations, audit logging, and future AI boundaries consistent across the platform.

This document describes the target standard. It is not a statement that a full command registry is implemented today.

## Current Foundation

Admin Web currently includes a first command palette foundation.

Implemented capabilities include:

- `Ctrl+K` on Windows and Linux.
- `Command+K` on macOS.
- Safe known navigation commands.
- Typed aliases in English and Spanish.
- Permission-aware command visibility.
- A safe Create User preparation intent:

```text
/users?intent=create-user
```

The Users page responds to this intent by opening and preparing the existing Create User form.

The current foundation does not submit forms automatically, execute mutations, run AI, process voice input, request confirmations, or write audit logs.

## Command Types

Enterprise Core commands should be classified by risk.

Initial command types:

- Safe navigation commands.
- Safe preparation commands.
- Sensitive mutation commands.

This classification should influence permissions, confirmations, audit requirements, frontend visibility, and backend enforcement.

## Safe Navigation Commands

Safe navigation commands move the user to known product destinations or adjust read-only views.

Examples:

- Open page.
- Search or filter.
- Navigate to a known destination.

Examples in Admin Web:

```text
dashboard.open -> /dashboard
users.open -> /users
roles.open -> /roles
system.open -> /system
settings.open -> /settings
```

Safe navigation commands may still require permission-aware visibility. For example, `users.open` should remain hidden when the user does not have `manage-users`.

## Safe Preparation Commands

Safe preparation commands prepare a workflow without executing the final business action.

Examples:

- Open create form.
- Prefill search.
- Prepare edit screen.
- Focus a specific input.
- Navigate to a page with an intent query parameter.

Safe preparation commands must not automatically submit forms, create records, update data, delete data, move inventory, or post transactions.

Current example:

```text
users.create.prepare -> /users?intent=create-user
```

This command opens and prepares the existing Create User form. The administrator must still complete the form and submit it manually.

## Sensitive Mutation Commands

Sensitive mutation commands change business or security state.

Examples:

- Create.
- Update.
- Delete.
- Deactivate.
- Invoice.
- Move inventory.
- Financial operations.

Potential future examples:

```text
users.create.submit
users.deactivate
customers.create.submit
inventory.movements.create
invoices.issue
payments.record
```

Sensitive mutation commands require stronger controls than navigation or preparation commands.

## Permission Requirements

Every command should define its permission requirements.

Permission expectations:

- Backend permission enforcement is mandatory for sensitive operations.
- Frontend permission visibility should hide commands that the current user cannot use.
- Frontend checks improve usability but must not replace backend authorization.
- Permission names should align with the module permission model.

Examples:

```text
users.open -> manage-users
users.create.prepare -> manage-users
users.create.submit -> manage-users
customers.create.submit -> manage-customers
inventory.movements.create -> manage-inventory
reports.sales.weekly.show -> view-reports
```

## Confirmation Requirements

Sensitive commands should define whether explicit confirmation is required.

Confirmation should be required for actions such as:

- Deleting records.
- Deactivating users.
- Changing roles or permissions.
- Issuing invoices.
- Cancelling invoices or business documents.
- Moving inventory.
- Recording financial operations.
- Importing data.
- Restoring backups.
- Changing security settings.

Confirmation UI should clearly state what will happen before the operation is submitted.

Safe navigation and safe preparation commands usually do not require confirmation because they do not mutate data.

## Audit Expectations

Sensitive commands should be auditable.

Audit records should capture:

- Command identifier.
- Authenticated user.
- Target module.
- Target record when applicable.
- Safe parameter summary.
- Confirmation result.
- Execution result.
- Timestamp.
- Source interface, such as command palette, text input, voice input, or API.

Sensitive values should not be stored in plain text in audit logs.

Audit logging is future work and is not implemented by the current command palette foundation.

## Module Design Checklist

When designing a new Enterprise Core module, define the command surface before implementation.

Checklist:

- What pages can users open?
- What searches or filters should be command-accessible?
- What forms can be opened or prepared safely?
- Which commands require permissions?
- Which commands are safe navigation?
- Which commands are safe preparation?
- Which commands are sensitive mutations?
- Which commands require confirmation?
- Which commands require audit logging?
- What aliases should exist in English and Spanish?
- What feedback should users receive after success or failure?
- What backend service or application action owns each mutation?
- How should AI or voice map to these commands later without bypassing the registry?

## Examples

### Users

```json
[
  {
    "id": "users.open",
    "type": "safe_navigation",
    "href": "/users",
    "requiredPermission": "manage-users",
    "aliases": ["users", "usuarios", "gestionar usuarios"]
  },
  {
    "id": "users.create.prepare",
    "type": "safe_preparation",
    "href": "/users?intent=create-user",
    "requiredPermission": "manage-users",
    "autoSubmit": false
  },
  {
    "id": "users.deactivate",
    "type": "sensitive_mutation",
    "requiredPermission": "manage-users",
    "requiresConfirmation": true,
    "audit": true
  }
]
```

### Customers

```json
[
  {
    "id": "customers.open",
    "type": "safe_navigation",
    "href": "/customers",
    "requiredPermission": "view-customers"
  },
  {
    "id": "customers.create.prepare",
    "type": "safe_preparation",
    "href": "/customers?intent=create-customer",
    "requiredPermission": "manage-customers",
    "autoSubmit": false
  },
  {
    "id": "customers.create.submit",
    "type": "sensitive_mutation",
    "requiredPermission": "manage-customers",
    "requiresConfirmation": false,
    "audit": true
  }
]
```

### Inventory

```json
[
  {
    "id": "inventory.open",
    "type": "safe_navigation",
    "href": "/inventory",
    "requiredPermission": "view-inventory"
  },
  {
    "id": "inventory.search.prefill",
    "type": "safe_preparation",
    "requiredPermission": "view-inventory",
    "autoSubmit": false
  },
  {
    "id": "inventory.movements.create",
    "type": "sensitive_mutation",
    "requiredPermission": "manage-inventory",
    "requiresConfirmation": true,
    "audit": true
  }
]
```

### Sales Reports

```json
[
  {
    "id": "reports.sales.open",
    "type": "safe_navigation",
    "href": "/reports/sales",
    "requiredPermission": "view-reports"
  },
  {
    "id": "reports.sales.weekly.show",
    "type": "safe_navigation",
    "href": "/reports/sales?range=last-week",
    "requiredPermission": "view-reports"
  },
  {
    "id": "reports.sales.export",
    "type": "sensitive_mutation",
    "requiredPermission": "export-reports",
    "requiresConfirmation": true,
    "audit": true
  }
]
```

These examples are design guidance. Customers, inventory, reports, and invoicing modules are not implemented as complete product modules yet.

## Non-Goals for Now

The following are not goals for the current implementation phase:

- Building a full backend command registry.
- Implementing AI command execution.
- Implementing voice commands.
- Allowing AI to execute arbitrary actions.
- Adding mutation commands to the current command palette.
- Automatically submitting forms from command intents.
- Implementing confirmation workflows.
- Implementing command audit logs.
- Replacing backend RBAC with frontend command visibility.

## Open Questions

- Should the canonical command registry live in the backend, frontend, or shared generated metadata?
- How should command metadata be exposed safely to Admin Web?
- What naming convention should be used for command identifiers across modules?
- How should aliases be localized and reviewed?
- Which command types should be available to external API clients?
- How should command search handle ambiguity?
- What confirmation patterns should be standard for destructive actions?
- What audit schema should support command execution across modules?
- How should voice and AI input layers show confidence before mapping intent to a known command?
- How should commands be versioned when modules evolve?
