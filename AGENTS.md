# Enterprise Core - Agent Instructions

## Project role

You are assisting with Enterprise Core, a professional portfolio-grade business platform built with Laravel, PostgreSQL, API-first architecture, RBAC, and enterprise software practices.

The goal is not to rush code. The goal is to produce clean, tested, documented, reviewable software suitable for a professional backend engineering portfolio.

## Language and communication

- Explain summaries to the user in Spanish.
- Write code, comments, commit messages, class names, method names, routes, and documentation headings in English.
- Be concise and practical.
- Before making broad changes, state the intended plan.

## Repository workflow

- Work from feature branches only.
- Do not commit automatically unless explicitly asked.
- Do not push automatically unless explicitly asked.
- Keep changes small and reviewable.
- Prefer one coherent feature per branch.
- Before editing, inspect the current branch and relevant files.
- After editing, summarize changed files and why they changed.

## Safety rules

- Never expose, print, modify, or commit secrets.
- Do not modify `.env` unless explicitly instructed.
- Do not invent credentials, tokens, passwords, API keys, or production URLs.
- Do not delete files unless explicitly asked.
- Do not run destructive commands such as `rm -rf`, `git reset --hard`, `git clean -fd`, database drops, or force pushes unless explicitly approved.
- Do not change Git history.

## Laravel service rules

Main service path:

`services/enterprise-auth-service/src`

When changing Laravel code:

- Prefer tests first when practical.
- Run `php artisan test` after changes.
- If routes change, run `php artisan route:list`.
- Keep API responses consistent.
- Use Laravel conventions.
- Prefer Form Requests, middleware, policies, or service classes when logic grows.
- Keep controllers thin.
- Do not add public registration endpoints unless explicitly approved.
- User creation is enterprise-controlled and must remain protected.
- RBAC permissions must be enforced for administrative actions.

## Auth and RBAC rules

- Authentication uses Laravel Sanctum.
- RBAC uses User, Role, and Permission models.
- Permissions should be checked through existing helper methods when possible.
- Administrative endpoints must not rely only on authentication.
- For user management, require `manage-users` unless the task explicitly says otherwise.

## Testing rules

- Every behavior change should include or update tests.
- Do not remove tests just to make the suite pass.
- Prefer feature tests for API behavior.
- Keep the full suite passing before saying the task is complete.
- Report the final test result.

## Documentation rules

- Update docs only when behavior or usage changes meaningfully.
- Keep docs clear and technical.
- Do not over-document small internal refactors.

## Current validation commands

From:

`C:\Projects\Enterprise-Core\services\enterprise-auth-service\src`

Use:

```powershell
php artisan test
php artisan route:list
```
