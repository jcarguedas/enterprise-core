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
- pgAdmin.
- 7-Zip.

Example `winget` installs from Command Prompt or PowerShell:

```cmd
winget install --id Git.Git -e
winget install --id OpenJS.NodeJS.LTS -e
winget install --id PHP.PHP.8.4 -e
winget install --id PostgreSQL.PostgreSQL.17 -e
winget install --id PostgreSQL.pgAdmin -e
winget install --id 7zip.7zip -e
```

After installing command-line tools, close and reopen PowerShell so PATH changes are loaded.

Confirm each tool is available from PowerShell:

```powershell
git --version
php -v
composer --version
node -v
npm -v
psql --version
```

If `psql --version` fails after PostgreSQL 17 is installed, PostgreSQL may be running but its `bin` folder may not be on PATH. The default location is usually:

```text
C:\Program Files\PostgreSQL\17\bin
```

Add that folder to the user or system PATH, then open a new terminal.

## PHP Extensions

The PHP 8.4 package installed through `winget` may not enable every extension needed by Composer, Laravel, PostgreSQL, and backend tests.

Confirm the active `php.ini` file:

```powershell
php --ini
```

Open the loaded `php.ini` and enable these extensions if they are commented out:

```ini
extension=fileinfo
extension=zip
extension=pdo_pgsql
extension=pgsql
extension=pdo_sqlite
extension=sqlite3
```

Why these matter:

- `fileinfo` and `zip` are required by Composer.
- `pdo_pgsql` and `pgsql` are required for Laravel to use PostgreSQL.
- `pdo_sqlite` and `sqlite3` are required by backend tests that use SQLite.

After editing `php.ini`, close and reopen PowerShell, then verify:

```powershell
php -m
```

For targeted checks from Command Prompt, use:

```cmd
php -m | findstr fileinfo
php -m | findstr zip
php -m | findstr pgsql
php -m | findstr sqlite
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

Create the PostgreSQL database manually using your preferred PostgreSQL tool.

If `psql` is not on PATH, use the full PostgreSQL 17 path:

```cmd
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres
```

Inside `psql`, create the local database and exit:

```sql
CREATE DATABASE enterprise_core;
\q
```

Then run migrations and seeders:

```powershell
php artisan migrate --seed
```

After seeding, the local demo administrator login is:

```text
Email: admin@example.com
Password: password123
```

These are demo credentials for local development and technical demos only. Change them for any non-demo environment.

The demo admin user is created by the backend seeders. Fresh local/demo installations should be able to log in immediately after `php artisan migrate --seed`.

## Backend Validation Checklist

From `services/enterprise-auth-service/src`, validate the backend setup:

```cmd
composer install
php artisan key:generate
php artisan migrate --seed
php artisan migrate:status
php artisan test
```

The latest known backend test result for this setup is:

```text
107 passed
```

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

## Admin Web Validation Checklist

From `apps/enterprise-admin-web`, validate the Admin Web setup:

```cmd
npm install
npm run build
```

The expected Admin Web routes include:

- `/`
- `/login`
- `/dashboard`
- `/users`
- `/roles`
- `/customers`
- `/system`
- `/system/events`
- `/settings`

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

## Preflight Check

Before running the launcher helper, use the safe preflight checker to validate the local demo environment.

From PowerShell:

```powershell
.\scripts\windows\check-enterprise-core-prerequisites.ps1
```

If local PowerShell policy blocks direct `.ps1` execution, use the BAT wrapper below or run PowerShell with `ExecutionPolicy Bypass` for this script only.

From Command Prompt, quote the BAT filename because it contains spaces:

```cmd
"scripts\windows\Check Enterprise Core Prerequisites.bat"
```

The preflight checker validates command-line tools, PHP extensions, PostgreSQL service status, expected environment files, backend `vendor`, and frontend `node_modules`.

It does not install dependencies, modify files, modify databases, run migrations, or start the app.

## Run With the Windows Helper Script

After dependencies are installed, environment files are configured, and migrations have been run, you can use the demo startup helper:

```powershell
.\scripts\windows\start-enterprise-core.ps1
```

From Command Prompt, quote the BAT filename because it contains spaces:

```cmd
"scripts\windows\Start Enterprise Core.bat"
```

Or double-click:

```text
scripts\windows\Start Enterprise Core.bat
```

The helper starts the backend and frontend in separate PowerShell windows and opens Admin Web in the default browser.

Both PowerShell windows must remain open. Closing the backend window stops the Laravel API, and closing the frontend window stops Admin Web. This is expected for the technical demo helper.

A future installer or Windows service runtime should manage local services differently.

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

On PostgreSQL 17 installed through `winget`, the Windows service name may be:

```text
postgresql-x64-17
```

Check the service from PowerShell:

```powershell
Get-Service postgresql-x64-17
```

Command Prompt equivalents:

```cmd
sc query postgresql-x64-17
net stop postgresql-x64-17
net start postgresql-x64-17
```

If PostgreSQL is installed and running but login fails because the `postgres` password is unknown, reset the local password intentionally. One practical local-only recovery path is:

1. Stop the PostgreSQL service.
2. Locate `pg_hba.conf` in the PostgreSQL data folder.
3. Temporarily change local authentication to `trust`.
4. Start the PostgreSQL service.
5. Connect locally with `psql` or pgAdmin.
6. Run `ALTER USER postgres WITH PASSWORD '<new-local-password>';`.
7. Restore `pg_hba.conf` to password-based authentication, such as `scram-sha-256`.
8. Restart PostgreSQL.
9. Update the backend `.env` `DB_PASSWORD` value.

Temporary local-only `pg_hba.conf` lines:

```text
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
```

Secure restored lines:

```text
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
```

Use `trust` only temporarily on local demo machines. Restore `scram-sha-256` immediately after resetting the password. Restart the PostgreSQL service after each `pg_hba.conf` change.

### psql Not Found

If PostgreSQL is installed but `psql` is not recognized, add the PostgreSQL `bin` directory to PATH:

```text
C:\Program Files\PostgreSQL\17\bin
```

Open a new terminal and verify:

```powershell
psql --version
```

You can also call `psql` directly with the full path:

```cmd
"C:\Program Files\PostgreSQL\17\bin\psql.exe" --version
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres
```

### Composer Missing Required Extensions

If `composer install` fails with missing `fileinfo` or `zip`, enable these in `php.ini`:

```ini
extension=fileinfo
extension=zip
```

Then open a new PowerShell window and rerun:

```powershell
composer install
```

### Laravel Cannot Connect to PostgreSQL

If Laravel reports a missing PostgreSQL driver, enable these PHP extensions:

```ini
extension=pdo_pgsql
extension=pgsql
```

Then open a new PowerShell window and rerun:

```powershell
php artisan migrate --seed
```

### Backend Tests Need SQLite Extensions

If `php artisan test` fails because SQLite drivers are missing, enable:

```ini
extension=pdo_sqlite
extension=sqlite3
```

Then open a new PowerShell window and rerun:

```powershell
php artisan test
```

### Permissions After Seeding

Seeders create the baseline roles and permissions required by the current backend.

If a user cannot access an administrative feature, confirm the user's roles include the required permissions. User management should require `manage-users` unless a future task explicitly changes that rule.

For a fresh demo setup, `php artisan migrate --seed` creates the active demo admin user and assigns the `Administrator` role. Use:

```text
admin@example.com
password123
```

If permissions were recently changed, rerun the seeders and sign in again.

### Browser Cache or Session Permissions After New Permissions Are Seeded

After permissions or roles are changed through seeders, an existing browser session may still reflect older access state.

Try:

- Logging out and logging back in.
- Refreshing the page.
- Clearing the browser cache for the local site.
- Creating a new token by signing in again.

## Final Clean-Machine Checklist

Before considering a clean Windows demo setup ready, confirm:

- Tool versions verified.
- PHP extensions enabled.
- PostgreSQL service running.
- `enterprise_core` database created.
- Backend `.env` configured.
- `composer install` completed.
- Migrations and seeders passed.
- Backend tests passed.
- Admin Web `.env.local` configured.
- `npm install` completed.
- Admin Web build passed.
- Launcher script opened backend, frontend, and browser.
- Login succeeded.
- Users, Customers, Roles, System Events, and Command Palette were manually checked.

## Future Installer Direction

The future Windows installer should automate dependency preparation, runtime startup, service management, first-run setup, backup validation, update checks, and browser launch.

Until that exists, this guide is the technical Windows demo path.
