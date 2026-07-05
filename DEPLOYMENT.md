# Deploying TrackPath

Two proven paths, easiest first. TrackPath is a standard Laravel 11 + Inertia monolith with no queues, websockets, or cron jobs — any PHP host that runs Laravel runs this.

## Before any deploy (production checklist)

1. **Environment** — copy `.env.example`, then set:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-domain.com
   ```
2. **Database** — SQLite is fine for a single user (just keep `database/database.sqlite` on persistent storage and back it up). To switch to MySQL/PostgreSQL, change the `DB_*` vars — migrations are driver-agnostic, then run `php artisan migrate --seed` once.
3. **Uploads** — study-material files live in `storage/app`. That directory must be persistent and included in backups. On a fresh box run `php artisan storage:link`.
4. **Build assets** — `npm ci && npm run build` produces `public/build`. Production servers don't need Node at runtime if you build in CI or locally and deploy the artifacts.
5. **Register** — after seeding, log in and change the seeded password (Profile → Update Password), or delete the seeded user and register fresh. Consider commenting out the `register` routes in `routes/auth.php` once your account exists — it's a single-user app.

## Option A — Laravel Cloud (fastest)

[Laravel Cloud](https://cloud.laravel.com) is the first-party managed platform; it detects a standard Laravel app and handles TLS, deploys, and scaling.

1. Push the repo to GitHub.
2. In Laravel Cloud: **New application** → connect the repo → pick the `main` branch.
3. Choose the smallest compute tier (this app is tiny) and add a **database** (managed MySQL/Postgres) or keep SQLite with a persistent volume.
4. Set the env vars from the checklist above in the dashboard (`APP_KEY` is generated for you).
5. Add the deploy commands:
   ```bash
   php artisan migrate --force
   php artisan storage:link
   php artisan config:cache && php artisan route:cache && php artisan view:cache
   ```
6. Deploy. Every push to `main` redeploys.

## Option B — VPS + Laravel Forge

A $6–12/mo VPS (DigitalOcean, Hetzner, Vultr) managed by [Forge](https://forge.laravel.com).

1. **Provision**: in Forge, connect your VPS provider and create a server — choose PHP 8.3, and MySQL (or "none" to stay on SQLite).
2. **Site**: create a site for your domain, connect the GitHub repo, branch `main`.
3. **Deploy script** (Forge's default plus the build):
   ```bash
   cd /home/forge/your-domain.com
   git pull origin main
   composer install --no-dev --optimize-autoloader
   npm ci && npm run build
   php artisan migrate --force
   php artisan storage:link
   php artisan config:cache && php artisan route:cache && php artisan view:cache
   php artisan octane:reload 2>/dev/null || sudo -S service php8.3-fpm reload
   ```
4. **Environment**: paste your production `.env` in the site's Environment tab; Forge generates `APP_KEY` if missing.
5. **TLS**: enable LetsEncrypt from the SSL tab.
6. **Backups**: enable database backups in Forge; add `storage/app` to a nightly `rsync`/S3 job if you upload real files.
7. Enable **Quick Deploy** so pushes to `main` auto-deploy.

## Manual VPS (no Forge)

Nginx + PHP-FPM 8.3 + the deploy script above, with the vhost root pointed at `public/`. The Laravel docs' [deployment page](https://laravel.com/docs/11.x/deployment) covers the nginx config verbatim — nothing in TrackPath deviates from it.

## Smoke test after first deploy

- `/login` renders with the DM Sans styling (assets built correctly)
- Log in, upload a file in Materials, download it back (storage writable + persistent)
- Drag a job card between columns (CSRF/session config correct behind TLS)
- `php artisan schedule:list` shows nothing — correct; the app has no scheduled jobs
