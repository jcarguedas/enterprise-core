# Windows Demo Setup

## Purpose

This guide explains how a technical user can clone and run Enterprise Core on a Windows machine for local development or demo purposes.

This is not the final Windows installer. The future installer should automate most of these steps. Today, setup is intentionally manual so dependencies, local database configuration, and credentials remain explicit.

## Prerequisites

Install these tools before starting:

- Git.
- PHP compatible with the Laravel project.
- Composer.
- Node.js LTS.
- npm.
- PostgreSQL.

Confirm each tool is available from PowerShell:

```powershell
git --version
php -v
composer --version
node -v
npm -v
psql --version
```

## Clone the Repository

```powershell
git clone <repository-url> Enterprise-Core
cd Enterprise-Core
```

Use the real repository URL provided by the project owner.

## Configure the Backend

Go to the Laravel service:

```powershell
cd services/enterprise-auth-service/src
```

Create the backend environment file from the example if needed:

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure the local PostgreSQL connection:

```text
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=enterprise_core
DB_USERNAME=<local-postgres-user>
DB_PASSWORD=<local-postgres-password>
```

Do not commit `.env`.

Install PHP dependencies:

```powershell
composer install
```

Generate the Laravel application key if the `.env` file does not already have one:

```powershell
php artisan key:generate
```

Create the PostgreSQL database manually using your preferred PostgreSQL tool, then run migrations and seeders:

```powershell
php artisan migrate --seed
```

After seeding, the local demo administrator login is:

```text
Email: admin@example.com
Password: password123
```

These are demo credentials for local development and technical demos only. Change them for any non-demo environment.

## Configure Admin Web

From the repository root, go to the Admin Web app:

```powershell
cd apps/enterprise-admin-web
```

Create `.env.local` if the app requires local API configuration.

Example:

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

Use the variable names expected by the current Admin Web implementation. Do not commit `.env.local`.

Install frontend dependencies:

```powershell
npm install
```

## Run Manually

Open one PowerShell window for the backend:

```powershell
cd services/enterprise-auth-service/src
php artisan serve
```

Open another PowerShell window for the frontend:

```powershell
cd apps/enterprise-admin-web
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Run With the Windows Helper Script

After dependencies are installed, environment files are configured, and migrations have been run, you can use the demo startup helper:

```powershell
.\scripts\windows\start-enterprise-core.ps1
```

Or double-click:

```text
scripts\windows\Start Enterprise Core.bat
```

The helper starts the backend and frontend in separate PowerShell windows and opens Admin Web in the default browser.

The helper does not install dependencies, modify databases, run migrations, store secrets, or require admin rights.

## Common Troubleshooting

### Port Already in Use

`php artisan serve` normally uses port `8000`, and Admin Web normally uses port `3000`.

If either port is already in use, stop the other process or configure a different port intentionally. Make sure Admin Web points to the correct backend API URL.

### Backend Unavailable

If Admin Web cannot authenticate or load data, confirm the backend is running:

```text
http://127.0.0.1:8000
```

Also check the backend PowerShell window for Laravel errors.

### Frontend Cannot Reach API

Confirm `.env.local` points to the backend API URL used by the Laravel dev server.

Common local value:

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

Restart `npm run dev` after changing `.env.local`.

### PostgreSQL Connection Failure

Confirm PostgreSQL is running and the backend `.env` database values match your local database.

Check:

- `DB_HOST`.
- `DB_PORT`.
- `DB_DATABASE`.
- `DB_USERNAME`.
- `DB_PASSWORD`.

Then rerun:

```powershell
php artisan migrate --seed
```

### Permissions After Seeding

Seeders create the baseline roles and permissions required by the current backend.

If a user cannot access an administrative feature, confirm the user's roles include the required permissions. User management should require `manage-users` unless a future task explicitly changes that rule.

### Browser Cache or Session Permissions After New Permissions Are Seeded

After permissions or roles are changed through seeders, an existing browser session may still reflect older access state.

Try:

- Logging out and logging back in.
- Refreshing the page.
- Clearing the browser cache for the local site.
- Creating a new token by signing in again.

## Future Installer Direction

The future Windows installer should automate dependency preparation, runtime startup, service management, first-run setup, backup validation, update checks, and browser launch.

Until that exists, this guide is the technical Windows demo path.
