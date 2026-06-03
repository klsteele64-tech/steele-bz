# Steele.bz

Personal portfolio and app hub for [steele.bz](https://steele.bz). Built as a monorepo with an Astro portfolio site, path-based app hosting, and GitHub integration — deployed on Cloudflare Pages.

## Structure

```
steele-bz/
├── site/                 # Astro portfolio (home, projects, apps, blog, about, contact)
├── apps/burger-buds/     # React + Vite menu app at /apps/burger-buds/
├── functions/            # Cloudflare Pages Functions (/api/github/repos)
├── scripts/build-all.mjs # Unified build → dist/
└── dist/                 # Deploy output (gitignored)
```

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

Open the portfolio at `http://localhost:4321` during `npm run dev`. After `npm run build && npm run preview`, test the full site (including `/api/github/repos` and `/apps/burger-buds/`) at `http://localhost:8788`.

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

Pages Functions live in `functions/` at the repo root. The GitHub API proxy is at `/api/github/repos`.

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
| `npm run build` | Build site + apps → unified `dist/` |
| `npm run preview` | Local Cloudflare Pages preview |

## License

Private — © Kasey Steele
