# evenmont.com

Source for [evenmont.com](https://evenmont.com), hosted on GitHub Pages (deploy from branch `main`, root folder).

- **`source/`** — the site: an Astro project. Edit here; see [`source/README.md`](source/README.md) for content, build and QA docs.
- **Repository root** — the built site that GitHub Pages serves (`index.html`, `_astro/`, `fonts/`, …), plus `CNAME` and `.nojekyll`.
  Do not edit these files by hand: they are replaced on every build.

## Deploy

Push changes under `source/` to `main`. The [Build site](.github/workflows/build-site.yml) workflow builds `source/` in
**production mode** (`SITE_ENV=production`: indexable, unverified demo content hidden), **validates** the output with
`scripts/validate-build.mjs` (indexing, robots.txt, sitemap, canonicals, links, assets, JSON-LD, no demo content) and only
then copies `source/dist` to the root with [`.github/scripts/publish-build.sh`](.github/scripts/publish-build.sh) and commits
it; GitHub Pages then deploys it. A failed validation publishes nothing. Pull requests get the same build and validation as a
check. The workflow can also be started by hand from the Actions tab.

To build and publish locally instead (Node.js 22.12+):

```bash
cd source && npm ci && npm run build:production && cd ..
.github/scripts/publish-build.sh
git add -A && git commit -m "Build site" && git push
```

Search, AI crawling, validation and the remaining manual steps (DNS for `www`, Search Console, Bing, IndexNow):
[`source/docs/SEO-AND-DEPLOYMENT.md`](source/docs/SEO-AND-DEPLOYMENT.md). Unverified content and where it is:
[`source/docs/CONTENT-AUDIT.md`](source/docs/CONTENT-AUDIT.md).
