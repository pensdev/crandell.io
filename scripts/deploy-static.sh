#!/usr/bin/env bash
# Build the Next.js static export and copy it to nginx document root.
# Usage (from repo root):
#   NEXT_PUBLIC_API_URL=https://crandell.io ./scripts/deploy-static.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/apps/web"
PUB="$ROOT/public"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-https://crandell.io}"
cd "$WEB"
npm run build
rm -rf "$PUB"
mkdir -p "$PUB"
cp -a "$WEB/out/." "$PUB/"
echo "Deployed static files to $PUB (set NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL for API origin)."
echo "Reload nginx if needed: sudo nginx -t && sudo systemctl reload nginx"
