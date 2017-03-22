#!/usr/bin/env bash
set -e

envsubst < ./.env.template > .env

if [[ "$1" = 'npm' && "$2" = 'start' ]]; then
  exec "$@"
fi

exec "$@"
