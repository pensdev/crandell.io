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

## Deployment

- **Vercel (frontend)**: set the project **Root Directory** to `apps/web`. Configure `NEXT_PUBLIC_API_URL` to your public API URL.
- **Render / Fly.io (API)**: use [`apps/api/Dockerfile`](apps/api/Dockerfile) or [`apps/api/render.yaml`](apps/api/render.yaml). Set `ALLOWED_ORIGINS` to your Vercel domain (comma-separated if multiple).

## Data attribution

Baseline magnitudes are rounded, stylized illustrations informed by public BEA/BLS/CBO-style ranges—see [`apps/api/data/SOURCES.md`](apps/api/data/SOURCES.md). Refresh CSVs when updating the model.
