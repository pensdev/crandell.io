#!/usr/bin/env bash
# Install API dependencies into a venv (no sudo). Run as projectuser.
set -euo pipefail
API="/var/www/crandell.io/apps/api"
cd "$API"
python3 -m venv .venv
. .venv/bin/activate
pip install -U pip wheel
pip install -r requirements.txt
echo "Venv ready: $API/.venv"
