#!/bin/sh
# Vercel runs this instead of `build` (via the `vercel-build` script).
# Production (`main`) and staging (`dev`) apply pending migrations first, each
# to its own database, so a failed migration fails the deploy. Feature branch
# previews share the dev database and don't migrate it.
set -e

if [ "$VERCEL_ENV" = "production" ] || [ "$VERCEL_GIT_COMMIT_REF" = "dev" ]; then
  echo "Applying database migrations..."
  drizzle-kit migrate
fi

next build
