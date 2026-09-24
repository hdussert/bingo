#!/bin/sh
# The Verify step in one command, for local use, /finish and CI.
# Stops at the first failing step.
set -e

echo "▸ Type check"
# Refresh Next's generated route types first, so stale ones in .next/ can't fail tsc
next typegen >/dev/null
tsc --noEmit --pretty false

echo "▸ Lint"
eslint

echo "▸ Build"
next build

echo "✓ All checks passed"
