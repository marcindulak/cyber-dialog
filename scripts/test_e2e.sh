#!/usr/bin/env bash

set -Eeuo pipefail

docker compose down || true
docker compose up --detach --wait
docker compose exec playwright bash -c "rm -rfv playwright-report test-results || true"
docker compose exec playwright bash -c "npm install && npm test -- --reporter=list"

