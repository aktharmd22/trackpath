# TrackPath

A personal web app for managing a career transition into supply chain analytics. It tracks learning progress across modules and lessons, stores study materials, and manages job applications on a kanban pipeline.

Built as a Laravel 11 + Inertia.js + React monolith — no separate API.

## Stack

- **Laravel 11** with **SQLite** in development (swap to MySQL/PostgreSQL via `.env` — migrations are driver-agnostic)
- **Inertia.js + React 18** (Breeze starter), **Vite**
- **Tailwind CSS** with a custom design-token theme, **DM Sans** self-hosted via `@fontsource/dm-sans`
- **lucide-react** (icons), **@dnd-kit** (kanban drag-and-drop), **recharts** (dashboard charts)

## Requirements

- PHP ≥ 8.2 with `pdo_sqlite`
- Composer 2
- Node 20+

## Setup

```bash
composer install
npm install
cp .env.example .env          # on Windows: copy .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
```

## Run

Two terminals:

```bash
php artisan serve   # http://localhost:8000
npm run dev         # Vite dev server with HMR
```

Log in with the seeded account (see `database/seeders/DatabaseSeeder.php`) or register your own.

## Design system

Design tokens live as CSS variables in [resources/css/app.css](resources/css/app.css) and are mapped to Tailwind color names in [tailwind.config.js](tailwind.config.js) (`ink`, `muted`, `accent`, `tint`, `line`, `card`, `positive`, `warning`). Components reference tokens only — a dark mode later just redefines the variables.

The app is mobile-first: bottom tab bar below `md`, fixed sidebar above it. Layouts are checked at 375px, 768px, and 1280px.

## Project layout

- `resources/js/Layouts/AppShell.jsx` — responsive shell (sidebar + bottom tabs)
- `resources/js/Components/` — shared UI kit (`Card`, `Button`, `Pill`, `PageHeader`, `EmptyState`, …)
- `resources/js/Pages/` — Inertia pages, one folder per section

## Build status

- **Phase 0 — Foundation** ✅ auth, design tokens, responsive shell, placeholder pages
- **Phase 1 — Learning + Jobs + Dashboard** ✅ modules/lessons/hours, kanban with drag-and-drop + stage history, dashboard with stats and study chart
- **Phase 2 — Materials** ✅ file uploads (medialibrary), links, notes, tagging, tag/module/type filters
- **Phase 3 — Polish + Projects** ✅ Projects CRUD, confirm dialogs, drop animations, page transitions
- **Phase 4 — Extras** ✅ follow-up reminder dates, applications CSV export, [deployment guide](DEPLOYMENT.md)

All phases of the original build plan are complete.
