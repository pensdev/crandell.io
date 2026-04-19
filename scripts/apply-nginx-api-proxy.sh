#!/usr/bin/env bash
# Run on the server with sudo:  sudo bash /var/www/crandell.io/scripts/apply-nginx-api-proxy.sh
set -euo pipefail
REPO="/var/www/crandell.io"
SNIP_SRC="$REPO/deploy/snippets/crandell-api-proxy.conf"
SNIP_DST="/etc/nginx/snippets/crandell-api-proxy.conf"
SITE="/etc/nginx/sites-available/crandell.io"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash $0" >&2
  exit 1
fi

cp "$SNIP_SRC" "$SNIP_DST"
chmod 644 "$SNIP_DST"

if grep -q 'include /etc/nginx/snippets/crandell-api-proxy.conf' "$SITE" 2>/dev/null; then
  echo "Nginx site already includes crandell-api-proxy.conf"
else
  # Insert include after real_ip_header line, before location /
  awk '
    { print }
    /real_ip_header CF-Connecting-IP;/ && !done {
      print ""
      print "    include /etc/nginx/snippets/crandell-api-proxy.conf;"
      done=1
    }
  ' "$SITE" > "${SITE}.new"
  mv "${SITE}.new" "$SITE"
  echo "Inserted include into $SITE"
fi

nginx -t
systemctl reload nginx
echo "Nginx OK — API routes proxied to 127.0.0.1:8000"
