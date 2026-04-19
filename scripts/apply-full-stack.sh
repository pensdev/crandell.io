#!/usr/bin/env bash
# One-shot: apt deps, Python venv + API service, nginx API proxy, reload.
# Run: sudo bash /var/www/crandell.io/scripts/apply-full-stack.sh
set -euo pipefail
REPO="/var/www/crandell.io"
API="$REPO/apps/api"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash $0" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq python3-venv python3-pip

# API venv + deps
if [[ ! -x "$API/.venv/bin/uvicorn" ]]; then
  sudo -u projectuser python3 -m venv "$API/.venv"
fi
sudo -u projectuser "$API/.venv/bin/pip" install -U pip wheel -q
sudo -u projectuser "$API/.venv/bin/pip" install -q -r "$API/requirements.txt"

# Nginx snippet + include
cp "$REPO/deploy/snippets/crandell-api-proxy.conf" /etc/nginx/snippets/crandell-api-proxy.conf
chmod 644 /etc/nginx/snippets/crandell-api-proxy.conf

SITE="/etc/nginx/sites-available/crandell.io"
if ! grep -q 'include /etc/nginx/snippets/crandell-api-proxy.conf' "$SITE"; then
  awk '
    { print }
    /real_ip_header CF-Connecting-IP;/ && !done {
      print ""
      print "    include /etc/nginx/snippets/crandell-api-proxy.conf;"
      done=1
    }
  ' "$SITE" > "${SITE}.new"
  mv "${SITE}.new" "$SITE"
  echo "Updated $SITE"
fi

nginx -t
systemctl reload nginx

# systemd unit
cp "$REPO/deploy/policy-api.service" /etc/systemd/system/policy-api.service
chmod 644 /etc/systemd/system/policy-api.service
systemctl daemon-reload
systemctl enable policy-api
systemctl restart policy-api

if ! systemctl is-active --quiet policy-api; then
  echo "policy-api: unit not active — journalctl -u policy-api -n 80" >&2
  journalctl -u policy-api -n 80 --no-pager >&2 || true
  exit 1
fi
echo "policy-api: unit started (waiting for HTTP — cold pandas/numpy import can take ~30s)…"

ok=0
for i in $(seq 1 60); do
  if curl -sf -o /tmp/health.json "http://127.0.0.1:8000/health" 2>/dev/null; then
    echo "API healthy after ${i}s"
    ok=1
    break
  fi
  sleep 1
done

if [[ "$ok" -ne 1 ]]; then
  echo "API: no response on :8000 after 60s — check logs:" >&2
  systemctl status policy-api --no-pager -l >&2 || true
  journalctl -u policy-api -n 80 --no-pager >&2 || true
  exit 1
fi

echo -n "/health body: "
cat /tmp/health.json
echo ""
