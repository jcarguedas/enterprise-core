# Command Center Roadmap

## Purpose

The Admin Web Command Center is a product direction, not just a shortcut menu.

The goal is to make Enterprise Core faster and safer to operate as modules grow by exposing known commands through consistent, permission-aware interaction patterns.

The current implementation is intentionally small. It establishes safe navigation and preparation commands before adding sensitive mutations, confirmations, audit logging, voice, or AI.

## Current Implemented Foundation

Admin Web currently includes a protected command palette foundation:

- Header button: `Command` / `Comando`.
- Keyboard shortcut: `Ctrl+K` on Windows/Linux and `Command+K` on macOS.
- Modal command palette with search.
- English and Spanish typed aliases.
- Accent-normalized matching.
- Permission-aware command visibility.
- Safe known navigation commands.
- Safe preparation intents for Users workflows.

Current safe commands:

- Dashboard.
- Users.
- Roles.
- System.
- Settings.
- Create User.
- Search Users.
- Edit User.

Current intent behavior:

```text
/users?intent=create-user
/users?search=<query>
/users?intent=edit-user&search=<query>
```

Create User, Search Users, and Edit User are safe because they prepare UI state only. They do not submit forms, mutate data, bypass permissions, or call backend APIs from the command palette.

Edit User opens edit mode only when exactly one local user matches after filtering.

## Phase 1: Safe Navigation and Preparation

Phase 1 establishes the command palette as a safe productivity surface.

Implemented capabilities include:

- Navigate to known protected pages.
- Match commands by label, route, and typed aliases.
- Hide permission-gated commands when the user lacks the required permission.
- Prepare existing UI state through query parameters.
- Keep all write actions under explicit user control.

This phase should continue to favor simple, inspectable command objects over a broad command framework.

## Phase 2: Module-Aware Commands

Future modules should be command-ready from the beginning.

Each module should define:

- Navigation commands.
- Search or filter preparation commands.
- Create form preparation commands.
- Edit preparation commands.
- Required permissions.
- English and Spanish aliases.
- Clear boundaries between preparation and mutation.

The command palette can then become a consistent entry point across modules without becoming an unbounded natural language executor.

## Phase 3: Confirmation and Audit Layer

Sensitive commands should not be introduced until confirmation and audit expectations are clear.

Future sensitive commands must require:

- Backend authorization.
- Frontend visibility rules.
- Explicit confirmation.
- Audit logs.
- Clear success and failure feedback.

Examples of sensitive commands:

- Deactivate user.
- Delete customer.
- Move inventory.
- Issue invoice.
- Cancel invoice.
- Record payment.

These commands should execute through application services and backend permission enforcement, not directly from the command palette UI.

## Phase 4: Voice and AI Input Layers

Voice and AI should be later input layers.

They should map user intent to known registered commands instead of executing arbitrary actions.

Future flow:

```text
User text/voice
-> Intent parser
-> Command registry
-> Permission check
-> Confirmation when required
-> Application service
-> Audit log
```

AI output should be treated as a proposal that resolves to a known command. It should not call arbitrary routes, controllers, SQL, or scripts.

## Command Safety Principles

Command Center development should follow these principles:

- Commands are product-level interaction primitives.
- Safe navigation commands can open known pages.
- Safe preparation commands can prepare UI state without submitting.
- Mutation commands require backend authorization.
- Frontend permission visibility improves UX but does not replace backend RBAC.
- Sensitive operations require confirmation and audit logs.
- Unknown user input should never become arbitrary execution.
- AI and voice should map to registered commands only.

## Suggested Next Module: Customers

Customers is a strong next business module for Command Center expansion.

Reasons:

- It represents a real business concept.
- It supports a simple CRUD foundation.
- It becomes useful for future sales, billing, invoices, and reports.
- It can be command-ready from day one.
- It creates a practical bridge from admin identity workflows into business operations.

Example future customer commands:

- `open customers`
- `create customer`
- `search customer`
- `edit customer`

Potential safe preparation intents:

```text
/customers
/customers?intent=create-customer
/customers?search=<query>
/customers?intent=edit-customer&search=<query>
```

These examples are roadmap guidance. The Customers module is not implemented yet.

## Non-Goals for Current Phase

The following are not part of the current Command Palette foundation:

- AI command execution.
- Voice input.
- Mutation commands.
- Automatic form submission.
- Backend command registry.
- Confirmation flows.
- Audit logs.
- Arbitrary natural language execution.
- Customer, inventory, invoicing, or reporting command implementation.
