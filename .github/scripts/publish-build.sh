#!/usr/bin/env bash
# Copies the Astro build (source/dist) to the repository root, which GitHub Pages
# publishes as-is ("Deploy from a branch": main, / (root)).
#
# Usage (from the repository root, after `npm run build` in source/):
#   .github/scripts/publish-build.sh
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if [ ! -f source/dist/index.html ]; then
  echo "source/dist/index.html not found: run 'npm run build:production' in source/ first." >&2
  exit 1
fi
# Never publish a build that has not passed production validation.
(cd source && node scripts/validate-build.mjs --production)

# Remove the previous build: everything at the root except the repository files below.
find . -mindepth 1 -maxdepth 1 \
  ! -name .git ! -name .github ! -name source \
  ! -name CNAME ! -name .nojekyll ! -name README.md \
  -exec rm -rf {} +

cp -R source/dist/. .

# source/dist is complete as built: CNAME and .nojekyll come from source/public/, and the
# trailing-slash aliases (services/index.html …) are written by integrations/static-output.mjs.
