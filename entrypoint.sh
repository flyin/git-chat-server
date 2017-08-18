#!/usr/bin/env bash
set -e
envsubst < ./.env.template > .env
exec "$@"
