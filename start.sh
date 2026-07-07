#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/app"
PHP_HOST="127.0.0.1"
PHP_PORT="8000"
DOTNET_PORT="${PORT:-10000}"

cd "$APP_DIR"

# The current controllers call /tierapp/... URLs, so the PHP built-in server
# must serve from the repository root rather than tierapp/ directly.
php -S "${PHP_HOST}:${PHP_PORT}" -t "$APP_DIR" >/proc/1/fd/1 2>/proc/1/fd/2 &
PHP_PID=$!

cleanup() {
    kill "$PHP_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

export ASPNETCORE_URLS="http://0.0.0.0:${DOTNET_PORT}"

dotnet "$APP_DIR/RankingApp.dll"