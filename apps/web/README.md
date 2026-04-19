# Web (Next.js)

Policy Impact Simulator frontend. See the [repository root README](../../README.md) for **crandell.io** deployment (static export, nginx, API).

**Local dev:**

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Point `NEXT_PUBLIC_API_URL` at your API (e.g. `http://127.0.0.1:8000`).

Fonts use [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with local Geist files under `app/fonts/`.
