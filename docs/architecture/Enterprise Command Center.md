# Enterprise Command Center

## Purpose

Enterprise Core should evolve from a protected administrative dashboard into an operational command center for business work.

This document describes a future command-ready and AI-ready architecture direction. It is not a statement of current implementation.

The goal is to define a safe path where users can eventually execute business workflows through structured commands, and later through AI-assisted text or voice input, without allowing AI to directly execute arbitrary actions.

## Current Foundation

Enterprise Core currently includes the following implemented foundation:

- Laravel Enterprise Auth Service.
- PostgreSQL.
- Laravel Sanctum authentication.
- Active and inactive users.
- Roles and permissions.
- Admin Web built with Next.js.
- Protected dashboard.
- Users module.
- Read-only Roles page.
- Runtime English and Spanish language switching.
- Runtime light and dark theme switching.
- Toast notifications.
- Reusable access-denied state.
- Permission-aware navigation.

These features provide the access-control and administration base needed before introducing command-driven workflows.

## Why Command Center

A command center can make Enterprise Core faster to operate as the platform grows.

Instead of requiring users to manually navigate through every module, a command layer can help users trigger known workflows from a single interface.

Future examples may include:

- Updating a user.
- Creating a customer.
- Creating an inventory entry.
- Showing a sales report for last week.

The first implementation should be a non-AI command palette. This creates a predictable command model before adding natural language or voice interfaces.

## Command Registry Concept

Enterprise Core should introduce an Intent Registry or Command Registry before introducing AI execution.

Each command should be a known application capability with explicit metadata.

Every command should define:

- Command identifier.
- Human-readable name.
- Target module.
- Required permission.
- Required parameters.
- Optional parameters.
- Validation rules.
- Confirmation rules.
- Audit logging requirements.
- Application service or handler.

This registry allows the frontend and backend to reason about commands consistently and prevents command execution from becoming an unbounded text-to-action system.

## Safe AI Boundary

AI should not directly execute arbitrary actions in Enterprise Core.

If AI is introduced later, its role should be to map user intent into safe, known commands from the registry.

The AI layer may help interpret input such as:

```text
update a user
create a customer
create an inventory entry
show sales report for last week
```

The system should then resolve the input to a registered command, collect missing parameters, apply permission checks, request confirmation when required, execute through an application service, and write an audit log.

AI output should be treated as a proposal, not as trusted authority.

## Permission and Confirmation Flow

The target flow is:

```text
User text/voice
-> Intent Parser
-> Command Registry
-> Permission Check
-> Confirmation UI
-> Application Service
-> Audit Log
```

Permission checks should happen after the command is resolved and before execution.

Confirmation should be required for sensitive or irreversible operations, including future actions such as:

- Creating or updating administrative users.
- Changing roles or permissions.
- Exporting data.
- Importing data.
- Restoring backups.
- Creating invoices.
- Cancelling business documents.
- Changing company settings.

Read-only commands may require lower-friction confirmation rules, but they should still respect permissions.

## Auditability

Command execution should be auditable.

Future audit records should capture:

- Authenticated user.
- Command identifier.
- Target module.
- Parameters or safe parameter summary.
- Confirmation result.
- Execution result.
- Timestamp.
- Source interface, such as command palette, text input, or voice input.

Sensitive values should not be logged in plain text.

Audit logs should help administrators understand who performed an action, what command was used, and whether the action succeeded or failed.

## Example Commands

Potential future commands include:

```text
users.update
customers.create
inventory.entries.create
reports.sales.weekly.show
roles.list
settings.company.update
backups.export.create
```

Example command metadata:

```json
{
  "id": "customers.create",
  "module": "customers",
  "requiredPermission": "manage-customers",
  "requiredParameters": ["name"],
  "optionalParameters": ["email", "phone", "tax_id"],
  "requiresConfirmation": false,
  "audit": true
}
```

These examples are illustrative and are not implemented yet.

## Future Safe Command Candidate: Customer Taxpayer Lookup

A future safe command candidate is:

```text
Consultar Hacienda para cliente
```

Related natural-language examples may include:

```text
Crear cliente 3101123456
Crear cliente cedula 3101123456
Consultar Hacienda 3101123456
Actualizar cliente 3101123456
```

This command must be designed as a guided workflow, not as automatic mutation.
It should:

- Parse and validate a possible 9 to 12 digit identification number.
- Check whether a local customer already exists before consulting Hacienda.
- Open the existing customer in edit mode or offer a refresh workflow when one
  local match exists.
- Show a selection state when multiple local customers match.
- Prefill a create form only when no local customer exists and backend-mediated
  taxpayer lookup succeeds.
- Require explicit user confirmation before saving any customer changes.
- Preview any future "update from Hacienda" result before applying data.
- Avoid logging full taxpayer lookup payloads in command or system events.

The command palette must never run this lookup or mutate customer records
automatically without user action.

See [Costa Rica Taxpayer Lookup](Costa%20Rica%20Taxpayer%20Lookup.md) for the
future backend-mediated lookup architecture.

## Incremental Roadmap

A safe implementation path may be:

- Define command registry conventions.
- Add a non-AI command palette in Admin Web.
- Register read-only commands first.
- Add permission checks for command visibility and execution.
- Add confirmation UI for sensitive commands.
- Add audit logging for command execution.
- Register write commands for existing modules.
- Add command support for future modules such as customers, inventory, reports, and invoicing.
- Add an intent parser for natural language after the command model is stable.
- Add optional voice input after text commands are reliable.
- Add AI-assisted intent mapping only after command execution boundaries are well tested.

## Non-Goals for Now

The following are not goals for the current implementation phase:

- Adding AI execution.
- Adding voice command execution.
- Letting AI call arbitrary controllers, routes, SQL, or scripts.
- Bypassing RBAC because a command was generated by AI.
- Building a full workflow automation engine.
- Implementing command palette UI.
- Implementing command audit logs.
- Implementing customers, inventory, reports, or invoicing commands.

## Open Questions

- Should the command registry live only in the backend, or should the frontend receive a safe command manifest?
- How should command parameters be represented for dynamic forms?
- Which commands should be available in the first non-AI command palette?
- What audit log schema should support command execution?
- Which actions require confirmation by default?
- How should command visibility differ from command execution authorization?
- How should natural language parsing handle ambiguous intent?
- Should voice input be browser-only, desktop-only, or optional per deployment?
