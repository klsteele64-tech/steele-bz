# Cloudflare Pages Setup

Follow these steps after the repo is on GitHub.

## 1. Connect GitHub to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select **klsteele64-tech/steele-bz**
4. Configure build settings:

| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

5. Click **Save and Deploy**

## 2. Add GitHub token (recommended)

1. GitHub → **Settings** → **Developer settings** → **Fine-grained personal access tokens**
2. Create token with **Public repositories (read-only)**
3. Cloudflare → your Pages project → **Settings** → **Environment variables**
4. Add `GITHUB_TOKEN` for Production and Preview

## 3. Attach custom domain

1. Pages project → **Custom domains** → **Set up a custom domain**
2. Enter `steele.bz`
3. Optionally add `www.steele.bz` (redirect to apex is configured via `_redirects`)

Cloudflare will provision SSL automatically if DNS is already on Cloudflare.

## 4. Verify deployment

After the first deploy succeeds, check:

- https://steele.bz/
- https://steele.bz/projects
- https://steele.bz/apps/burger-buds/
- https://steele.bz/api/github/repos
- https://steele-bz.pages.dev/health
- https://steele-bz.pages.dev/api/v1/catalog
- https://steele-bz.pages.dev/api/v1/lessons/L01
- https://steele-bz.pages.dev/apps/training/baseline/
- https://steele-bz.pages.dev/apps/training/lenstemper/
- https://steele-bz.pages.dev/apps/training/superpowers/

## CLI alternative (optional)

If you prefer Wrangler CLI:

```bash
npx wrangler login
npx wrangler pages project create steele-bz --production-branch main
npm run build
npx wrangler pages deploy dist --project-name=steele-bz
npx wrangler pages secret put GITHUB_TOKEN --project-name=steele-bz
```

For Git-connected deploys, use the dashboard method above so pushes to `main` auto-deploy.
