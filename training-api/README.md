# Cursor Training API (Pages Functions)

HTTP API for the 40-lesson baseline curriculum, served as [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/) alongside the Steele.bz portfolio.

**Live:** https://steele-bz.pages.dev

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health probe |
| GET | `/api/v1/catalog` | Tracks + lessons |
| GET | `/api/v1/lessons/:id` | Lesson meta + DEMO.md |
| POST | `/api/v1/lessons/:id/quiz` | Score quiz `{ answers: number[] }` |
| GET | `/api/v1/lessons/:id/assist` | ASSIST.md when available |
| GET | `/api/v1/docs/:slug` | Offline docs excerpt |
| GET | `/api/v1/openapi.json` | OpenAPI stub |

## Local development

```bash
npm install
npm run build
npm run preview   # http://localhost:8788
```

Test endpoints:

```bash
curl -s http://localhost:8788/health
curl -s http://localhost:8788/api/v1/catalog
curl -s http://localhost:8788/api/v1/lessons/L01
```

## Content bundle

Lesson content is bundled into `training-api/dist/bundled-content.json` at build time.

- With a sibling `cursor-training-baseline` clone, `npm run build` refreshes the bundle automatically.
- Without it, the committed JSON in this repo is used (Cloudflare Git builds).

Source of truth: [cursor-training-baseline](https://github.com/klsteele64-tech/cursor-training-baseline) on branch `stream/api-baseline`.

## Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=steele-bz --branch=main
```

Or push to `main` — Cloudflare Pages Git integration rebuilds automatically.

## Environment

| Variable | Purpose |
|----------|---------|
| `CORS_ORIGIN` | Extra allowed origins (comma-separated) |

Default CORS allows `https://steele-bz.pages.dev`, `https://steele.bz`, localhost dev ports, and `*.pages.dev`.

## Site integration

See [examples/site-integration/api-client.js](../examples/site-integration/api-client.js).

Progress is stored **client-side** on your site (`localStorage`), not on the API.
