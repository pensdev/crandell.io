# Policy Impact Simulator

Monorepo with a **FastAPI** scoring API and a **Next.js** UI. Outputs are **illustrative** educational estimates—not official CBO, Treasury, or JCT scores.

## Layout

| Path | Description |
|------|-------------|
| [`apps/api`](apps/api) | FastAPI + pandas scoring, `/simulate`, `/health`, OpenAPI at `/docs` |
| [`apps/web`](apps/web) | Next.js 14 App Router, sliders, Recharts (lazy), CSV/PDF export |
| [`apps/web/public`](apps/web/public) | Static assets only (manifest, `robots.txt`, `presets/scenarios.json`, icons) |
| [`apps/api/data`](apps/api/data) | Versioned baseline CSVs + [`SOURCES.md`](apps/api/data/SOURCES.md) |

## Local development

**API** (Python 3.11+):

```bash
cd apps/api
pip install -r requirements.txt
export ALLOWED_ORIGINS=http://localhost:3000
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Web**:

```bash
cd apps/web
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set `NEXT_PUBLIC_API_URL` in `.env.local` to your API origin.

## Tests

```bash
# API (from apps/api, with dependencies installed)
pytest

# Web
cd apps/web && npm test
```

## Self-hosted static site (crandell.io / nginx)

Nginx was pointing at `/var/www/crandell.io/public`, but nothing had been built there, so every request returned **404**. The Next app is configured for **`output: "export"`** so it can be served as plain files (no Node on the server).

From the repo root (build static export, then copy to your nginx docroot, e.g. `public/`):

```bash
export NEXT_PUBLIC_API_URL=https://crandell.io   # or your API host
cd apps/web && npm install && npm run build
rm -rf ../public && mkdir -p ../public && cp -a out/. ../public/
cd .. && sudo nginx -t && sudo systemctl reload nginx   # if you changed nginx
```

That mirrors `apps/web/out/` into the docroot nginx serves.

**API on the same domain (fixes 404 HTML from nginx when moving sliders):** the UI POSTs to `https://crandell.io/simulate`. Nginx must **proxy** that to FastAPI.

On the server: install [`deploy/snippets/crandell-api-proxy.conf`](deploy/snippets/crandell-api-proxy.conf) into `/etc/nginx/snippets/`, include it in your `server { }` block (before `location /`), copy [`deploy/policy-api.service`](deploy/policy-api.service) to `/etc/systemd/system/`, create a venv under `apps/api`, `pip install -r apps/api/requirements.txt`, point `ExecStart` at `.venv/bin/uvicorn`, then `sudo systemctl daemon-reload && sudo systemctl enable --now policy-api` and reload nginx.

**Check:** `curl -sS https://crandell.io/health` → `{"status":"ok"}`.

## Deployment

- **Vercel (frontend)**:
  1. **Root Directory** must be **`apps/web`** (Project → Settings → General). If you import the repo root, Vercel will not find `next.config` / `package.json` for the app and the build will fail or produce the wrong output.
  2. **Environment variables**: add **`NEXT_PUBLIC_API_URL`** = your public API base URL (no trailing slash), e.g. `https://policy-api.onrender.com`. Redeploy after saving.
  3. **Preview URL shows `401 Unauthorized`**: that is usually **Deployment Protection** (team settings blocking unauthenticated access to preview deployments). Fix: Project → Settings → **Deployment Protection** → allow the deployment, **or** open the **Production** deployment URL instead of a preview alias, **or** sign in when Vercel prompts you.
- **Render / Fly.io (API)**: use [`apps/api/Dockerfile`](apps/api/Dockerfile) or [`apps/api/render.yaml`](apps/api/render.yaml). Set **`ALLOWED_ORIGINS`** to your Vercel app origin(s), e.g. `https://your-app.vercel.app,https://crandell.io` (comma-separated, no spaces unless quoted per host).

## Data attribution

Baseline magnitudes are rounded, stylized illustrations informed by public BEA/BLS/CBO-style ranges—see [`apps/api/data/SOURCES.md`](apps/api/data/SOURCES.md). Refresh CSVs when updating the model.
