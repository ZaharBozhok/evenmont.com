# evenmont.com

Source for [evenmont.com](https://evenmont.com), hosted on GitHub Pages (deploy from branch `main`, root folder).

- **`source/`** — the site: an Astro project. Edit here; see [`source/README.md`](source/README.md) for content, build and QA docs.
- **Repository root** — the built site that GitHub Pages serves (`index.html`, `_astro/`, `fonts/`, …), plus `CNAME` and `.nojekyll`.
  Do not edit these files by hand: they are replaced on every build.

## Deploy

Push changes under `source/` to `main`. The [Build site](.github/workflows/build-site.yml) workflow runs
`npm ci && npm run build` in `source/`, copies `source/dist` to the root with
[`.github/scripts/publish-build.sh`](.github/scripts/publish-build.sh) and commits the result; GitHub Pages then deploys it.
The workflow can also be started by hand from the Actions tab.

To build and publish locally instead (Node.js 22.12+):

```bash
cd source && npm ci && npm run build && cd ..
.github/scripts/publish-build.sh
git add -A && git commit -m "Build site" && git push
```
