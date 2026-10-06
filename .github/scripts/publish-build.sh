#!/usr/bin/env bash
# Copies the Astro build (source/dist) to the repository root, which GitHub Pages
# publishes as-is ("Deploy from a branch": main, / (root)).
#
# Usage (from the repository root, after `npm run build` in source/):
#   .github/scripts/publish-build.sh
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if [ ! -f source/dist/index.html ]; then
  echo "source/dist/index.html not found: run 'npm ci && npm run build' in source/ first." >&2
  exit 1
fi

# Remove the previous build: everything at the root except the repository files below.
find . -mindepth 1 -maxdepth 1 \
  ! -name .git ! -name .github ! -name source \
  ! -name CNAME ! -name .nojekyll ! -name README.md \
  -exec rm -rf {} +

cp -R source/dist/. .

# /cases and /partners are both a page (cases.html) and a folder (cases/). Give each such
# folder an index.html so the URL works on GitHub Pages with or without a trailing slash.
for page in *.html; do
  dir="${page%.html}"
  if [ -d "$dir" ] && [ ! -e "$dir/index.html" ]; then
    cp "$page" "$dir/index.html"
  fi
done
