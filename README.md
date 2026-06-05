# Steele.bz

Personal portfolio and app hub for [steele.bz](https://steele.bz). Built as a monorepo with an Astro portfolio site, path-based app hosting, and GitHub integration — deployed on Cloudflare Pages.

## Structure

```
steele-bz/
├── site/                 # Astro portfolio (home, projects, apps, blog, about, contact)
├── apps/burger-buds/     # React + Vite menu app at /apps/burger-buds/
├── apps/training/        # Three Cursor training web apps (baseline, lenstemper, superpowers)
├── training-streams/     # Bundled content + shared Hono API per stream
├── functions/            # Cloudflare Pages Functions (GitHub API + Training APIs)
├── training-api/         # Legacy baseline API docs (see training-streams/)
├── examples/             # Site integration sample (vanilla JS fetch)
├── scripts/build-all.mjs # Unified build → dist/
└── dist/                 # Deploy output (gitignored)
```

## Cursor Training (3 plans)

Three self-contained training web apps on Cloudflare Pages — each plan is a full player (catalog, lesson, timer, quiz, progress in localStorage) backed by its own API:

| Plan | Web app | API base |
|------|---------|----------|
| **Baseline** (40 lessons) | [/apps/training/baseline/](https://steele-bz.pages.dev/apps/training/baseline/) | `/api/training/baseline/v1` |
| **LensTemper** (phased, prerequisites) | [/apps/training/lenstemper/](https://steele-bz.pages.dev/apps/training/lenstemper/) | `/api/training/lenstemper/v1` |
| **Superpowers** (v1, 12 lessons) | [/apps/training/superpowers/](https://steele-bz.pages.dev/apps/training/superpowers/) | `/api/training/superpowers/v1` |

Legacy baseline alias: `/api/v1/*` → same content as baseline stream.

Build bundles lesson content from sibling repos (`cursor-training-baseline`, `cursor-training-lenstemper`, `cursor-training-superpowers`) via `npm run build`.

## Cursor Training API (baseline alias)

The 40-lesson baseline curriculum is served as a Web API on this Pages project:

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health probe |
| `GET /api/v1/catalog` | Tracks + lessons |
| `GET /api/v1/lessons/:id` | Lesson meta + DEMO.md |
| `POST /api/v1/lessons/:id/quiz` | Score quiz `{ answers: number[] }` |
| `GET /api/v1/lessons/:id/assist` | ASSIST.md when available |
| `GET /api/v1/docs/:slug` | Offline docs excerpt |
| `GET /api/v1/openapi.json` | OpenAPI stub |

Live: **https://steele-bz.pages.dev/api/v1/catalog**

Source content: [cursor-training-baseline](https://github.com/klsteele64-tech/cursor-training-baseline) (`stream/api-baseline`). See [training-api/README.md](training-api/README.md) and [examples/site-integration/api-client.js](examples/site-integration/api-client.js).

## Local development

```bash
npm install

# Portfolio site only
npm run dev

# Burger Buds app with path base
npm run dev:apps

# Full production build
npm run build

# Test static output + API functions locally
npm run preview
```

Open the portfolio at `http://localhost:4321` during `npm run dev`. After `npm run build && npm run preview`, test the full site (including `/health`, `/api/v1/catalog`, `/api/github/repos`, and `/apps/burger-buds/`) at `http://localhost:8788`.

## Cloudflare Pages deployment

1. Push this repo to GitHub (`klsteele64-tech/steele-bz`).
2. In Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repo and configure:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
   - **Production branch:** `main`
4. Add environment variable (optional but recommended):
   - `GITHUB_TOKEN` — fine-grained PAT with read-only access to public repositories
5. Attach custom domain **steele.bz** (and optionally redirect `www.steele.bz` → apex).

See [docs/DEPLOY.md](docs/DEPLOY.md) for step-by-step Cloudflare Pages and domain setup.

### Creating a GitHub token

1. GitHub → **Settings** → **Developer settings** → **Fine-grained tokens**
2. Create a token with **Public repositories (read-only)** access
3. Add as `GITHUB_TOKEN` in Cloudflare Pages → **Settings** → **Environment variables**

## Adding a new hosted app

1. Create `apps/<slug>/` with your app (set `base` to `/apps/<slug>/` when building for steele.bz).
2. Register the app in `site/src/data/apps.json`.
3. Add a build step in `scripts/build-all.mjs` to copy output to `dist/apps/<slug>/`.
4. Push to `main` — Cloudflare Pages redeploys automatically.

## Adding a blog post

Add a markdown file under `site/src/content/blog/`:

```md
---
title: "My first post"
description: "Short summary"
pubDate: 2026-06-03
draft: false
---

Post content here.
```

Posts appear automatically on `/blog`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Astro dev server for portfolio |
| `npm run dev:apps` | Burger Buds dev with `/apps/burger-buds/` base |
| `npm run build` | Bundle training API + build site + apps → `dist/` |
| `npm run preview` | Local Cloudflare Pages preview (portfolio + APIs) |

## License

Private — © Kasey Steele
