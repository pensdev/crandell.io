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

## CI

GitHub Actions runs on push and pull requests to `main`/`master`:

- **API**: `pytest` in [`apps/api`](apps/api)
- **Web**: `npm run lint` and `npm test` in [`apps/web`](apps/web)
- **E2E**: Playwright smoke test (starts API + `next dev`, hits the home page)

## Tests

```bash
# API (from apps/api, with a venv and dependencies installed)
cd apps/api && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && pytest

# Web (unit)
cd apps/web && npm test

# Web (e2e — requires Chromium; starts servers automatically on ports 8010 / 3010)
cd apps/web && npx playwright install chromium && npm run test:e2e
```

On minimal Linux environments, if Chromium fails with a missing shared library (for example `libgbm.so.1`), install system dependencies (Debian/Ubuntu: `libgbm1` and related packages) or run `npx playwright install-deps` where available. GitHub Actions uses `playwright install chromium --with-deps`.

## OpenAPI → TypeScript types

After changing Pydantic models in the API, regenerate the contract and client types:

```bash
cd apps/web && npm run codegen:api
```

This writes [`apps/web/lib/openapi.json`](apps/web/lib/openapi.json) and [`apps/web/lib/api-types.generated.ts`](apps/web/lib/api-types.generated.ts). [`apps/web/lib/types.ts`](apps/web/lib/types.ts) re-exports schema types from the generated file.

## API build metadata

Set optional environment variables on the API host so `/health` exposes deploy context:

- `APP_VERSION` — defaults to `0.1.0` if unset
- `GIT_COMMIT` — short or full git SHA (defaults to `unknown`)

[`deploy/policy-api.service`](deploy/policy-api.service) includes placeholders you can replace at deploy time.

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

Set **`NEXT_PUBLIC_API_URL=https://crandell.io`** (or your site origin) **before** `npm run build` so the static export calls the API on the same host. If the API lives only on another machine, use that origin instead and add it to **`ALLOWED_ORIGINS`** on the API.

**Optional — API on Render or Fly.io** (frontend still on crandell.io): use [`apps/api/Dockerfile`](apps/api/Dockerfile) or [`apps/api/render.yaml`](apps/api/render.yaml). Set **`ALLOWED_ORIGINS`** to include `https://crandell.io` (and `https://www.crandell.io` if used). Point **`NEXT_PUBLIC_API_URL`** at that API URL when you build the static site.

## Data attribution

Baseline magnitudes are rounded, stylized illustrations informed by public BEA/BLS/CBO-style ranges—see [`apps/api/data/SOURCES.md`](apps/api/data/SOURCES.md). Refresh CSVs when updating the model.
