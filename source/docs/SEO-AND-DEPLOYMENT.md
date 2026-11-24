# Search, AI crawling and GitHub Pages deployment

How evenmont.com is built for search engines and AI search, how a deploy is validated, and the steps that
need a person (DNS, Search Console, Bing). Audit and changes: 2026-11-24.

## 1. Audit of the live site (before this change)

Tested against https://evenmont.com with HTTP requests from a cloud sandbox, 2026-11-24.

| Check | Result |
| --- | --- |
| `https://evenmont.com/` | 200, served by GitHub Pages (`server: GitHub.com`, Fastly), `cache-control: max-age=600` |
| TLS (apex) | Let's Encrypt certificate for `evenmont.com`, valid 2026-09-25 → 2026-12-24 (GitHub renews it) |
| `https://www.evenmont.com/` | **certificate error**: GitHub serves its `*.github.io` certificate for `www`, then 301 → `https://evenmont.com/`. Browsers and crawlers stop at the certificate error. See §6. |
| `http://` | not testable from the sandbox (its proxy only carries HTTPS). Check "Enforce HTTPS" in the Pages settings. |
| DNS records | not readable from the sandbox (no DNS tools / resolver access). `www` evidently points at GitHub Pages. |
| **`/robots.txt`** | 200, **`User-agent: * / Disallow: /`** — every crawler, including OAI-SearchBot, ChatGPT-User, Googlebot, Bingbot, PerplexityBot and Claude, was told not to fetch anything. |
| **Robots meta** | **`<meta name="robots" content="noindex, nofollow">` on every page** |
| `X-Robots-Tag` header | none |
| `/sitemap.xml` | 200, 20 URLs — including the 6 fictional case studies |
| Canonicals | absolute, `https://evenmont.com/...`, no trailing slash — consistent |
| Routing | `/services` → 200 (`services.html`); **`/services/` → 404**; `/services.html` → 200 duplicate (canonical points to `/services`); `/cases/` and `/partners/` → 200 |
| Crawler user agents | identical 200 responses for Googlebot, bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-User and a desktop browser: no user-agent blocking at the host |
| Assets | `/_astro/*`, fonts, favicons served (Jekyll disabled by `.nojekyll`) |
| `/llms.txt` | 404 |

**Root cause of "ChatGPT can't access the site" and the missing search visibility:** the site was deployed in its
pre-release mode (`settings.prerelease: true`), which writes `Disallow: /` into robots.txt and `noindex, nofollow` into every
page. Nothing in the deploy workflow set production mode; launching depended on editing that file by hand.

Pre-release mode was on deliberately: every page carried invented demo content (fictional founders, registration and VAT numbers,
a "4.9 on Clutch" rating, six fictional case studies …). Simply switching indexing on would have published those claims. See
[`CONTENT-AUDIT.md`](CONTENT-AUDIT.md).

## 2. Build modes

`src/lib/site.ts` decides the mode once, at build time:

| `SITE_ENV` | Used by | Robots | Unverified (demo) content |
| --- | --- | --- | --- |
| `production` | the GitHub Pages workflow (`npm run build:production`) | indexable, robots.txt allows crawling | hidden |
| `preview` | `npm run build:preview` | `noindex, nofollow`, `Disallow: /` | shown |
| unset | `npm run dev`, `npm run build` | `PRERELEASE` env if set, else `settings.prerelease` (true) | shown when pre-release |

`settings.prerelease` stays `true` in the repository so a local or accidental build is never indexable. Production does not depend
on it. `SITE_ENV=production` together with `PRERELEASE=true` is refused.

## 3. What the production build contains

- **robots.txt** — `Allow: /` for everyone, with explicit groups for search engines and AI search / assistant fetchers
  (Googlebot, Bingbot, Applebot, DuckDuckBot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot,
  Perplexity-User) and a **separate** group for model-training crawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended,
  CCBot), also allowed — there is no business requirement to block them. To opt out of training later, change that group to
  `Disallow: /` in `src/pages/robots.txt.ts`; search visibility is unaffected. Ends with `Sitemap: https://evenmont.com/sitemap.xml`.
  Token names: Anthropic's were checked against its documentation on 2026-11-24; the other vendors' documentation pages were not
  reachable from the build sandbox, so re-check them against each vendor's bot documentation when convenient.
- **Robots meta** — `index, follow, max-image-preview:large, max-snippet:-1` on public pages; `noindex, follow` on `/404` and the
  draft `/privacy` and `/terms`. No `X-Robots-Tag` (GitHub Pages cannot set headers).
- **sitemap.xml** — generated *from the built pages* (`integrations/static-output.mjs`): exactly the pages that are indexable and
  are their own canonical URL. 12 URLs today.
- **Canonical / Open Graph / Twitter** — absolute `https://evenmont.com/<path>` (no trailing slash; root `/`), `og:url` = canonical,
  `og:type=article` on case studies.
- **JSON-LD** — one `@graph` per page (`src/lib/schema.ts`): `Organization` (name, legal name, logo, email, contact points, area
  served: United States, `knowsAbout` Odoo/ERP topics), `WebSite`, the page (`WebPage`, `AboutPage`, `ContactPage`,
  `CollectionPage`), `BreadcrumbList`; plus `Service` on the home, scenario and partner pages, `Article` on case studies and
  `FAQPage` where an FAQ accordion is shown (same questions and answers as the visible text). Unverified facts (phone, address,
  VAT, founders, partner level) are added only once verified. `Organization` rather than `ProfessionalService`/`LocalBusiness`:
  Evenmont has no verified customer-facing address. No ratings or reviews.
- **llms.txt** — a short Markdown summary (what Evenmont does, for whom, process, services, contact, public case studies), built from
  the same verified data. Supplementary only.
- **Verification meta tags** — `google-site-verification` and `msvalidate.01`, only when a token is configured (§6).
- **GitHub Pages files** — `CNAME` (`evenmont.com`) and `.nojekyll` come from `public/`, so every build carries them.
- **Trailing-slash aliases** — `services/index.html` next to `services.html` (same HTML, same canonical), so `/services/` works too.

## 4. Routing on GitHub Pages

`build.format: 'file'` + `trailingSlash: 'never'` was **kept**. On the live site GitHub Pages serves `/services` from
`services.html` (200, no redirect), nested routes such as `/partners/white-label` and `/cases/<slug>` work, and a refresh on any of
them returns 200. The only gap was the trailing-slash form (`/services/` → 404), now covered by the aliases. Moving to
`format: 'directory'` + `trailingSlash: 'always'` would have changed every public URL to `/services/` (GitHub would 301 the old
ones) for no gain, so it was not done.

All content is in the initial HTML (Astro static output); JavaScript only enhances (menu, tabs, calculator, forms).

## 5. Deployment and validation

Architecture (unchanged): GitHub Pages "Deploy from a branch", `main`, `/ (root)`. The **Build site** workflow
(`.github/workflows/build-site.yml`) builds `source/` and commits `source/dist` to the repository root; Pages then publishes it.

Each run, on push to `main` (and as a check on pull requests, without publishing):

1. `npm ci`, `npm run check` (TypeScript / Astro)
2. `astro build` with `SITE_ENV=production`
3. `node scripts/validate-build.mjs --production` — **fails the job** (nothing is published) on:
   pre-release left on (any unexpected `noindex`/`nofollow`), robots.txt blocking public content or any of the named crawlers, a
   missing/invalid sitemap or one that lists a noindex, missing or non-canonical URL, canonical/`og:url` errors or wrong domain,
   duplicate titles/descriptions/canonicals, missing title/description/H1/`lang`/viewport, `<img>` without `alt`, invalid JSON-LD,
   FAQPage questions that are not visible, rating/review markup, broken internal links or missing assets (incl. `srcset` and CSS
   `url()`), references to localhost/`*.github.io`/Netlify/Vercel/Cloudflare/`www.`/`http://evenmont.com`, leftover `{{TOKENS}}`,
   any unverified demo value or demo case or flagged file in the output, missing `CNAME`/`.nojekyll`/`404.html`.
   Missing `#fragment` targets and long titles are warnings.
4. `.github/scripts/publish-build.sh` (re-runs the validation, then copies `dist/` to the root) and commit.

Preview builds are checked the other way round (`--preview`): every page must be `noindex, nofollow` and robots.txt must disallow all.

Why not `actions/deploy-pages`? It would avoid committing build output, but needs the Pages source switched to "GitHub Actions" in
the repository settings at the same moment the workflow changes, or the site goes down. The branch-based setup works and is now
gated by the same validation; switching is optional.

Removed: `public/_headers`, `netlify.toml`, `vercel.json`. GitHub Pages ignores them (`_headers` was even published as a file). Lost
with them: custom security headers (`X-Frame-Options`, `Permissions-Policy`, …) and long-lived cache headers — GitHub Pages cannot
set response headers (it sends `cache-control: max-age=600`). If those headers are required, a CDN in front of Pages (e.g. Cloudflare
proxy) would be needed.

## 6. Manual steps (outside the repository)

1. **Merge and deploy.** After merging to `main`, the workflow publishes the production build. Then check the live site:
   ```bash
   curl -s https://evenmont.com/robots.txt
   curl -s https://evenmont.com/ | grep -o '<meta name="robots"[^>]*>'
   curl -s -o /dev/null -w '%{http_code}\n' https://evenmont.com/services/
   ```
2. **Fix `www`.** In the DNS zone, `www` should be a `CNAME` to `zaharbozhok.github.io` (and the apex the four GitHub Pages `A`
   records, optionally `AAAA`). Then in *Settings → Pages* GitHub issues a certificate covering `www`; if it does not, remove and
   re-add the custom domain `evenmont.com`. Tick **Enforce HTTPS**. Verify with `curl -sI https://www.evenmont.com/`.
   Optionally verify the domain for the account/organization (*Settings → Pages → Verified domains*) to prevent takeover.
3. **Google Search Console** — add a *Domain* property (DNS TXT record; nothing to change here), or a *URL-prefix* property with the
   HTML-tag method: put the `content` value in the repository variable `GOOGLE_SITE_VERIFICATION` (*Settings → Secrets and variables →
   Actions → Variables*) or in `settings.json → verification.google`, redeploy, verify. Then submit `https://evenmont.com/sitemap.xml`
   and use *URL inspection → Request indexing* for `/`, `/services`, `/distribution`, `/manufacturing`, `/partners`, `/about`.
4. **Bing Webmaster Tools** — import from Search Console, or use the meta tag (`BING_SITE_VERIFICATION` /
   `verification.bing`). Submit the sitemap. Bing's index also feeds ChatGPT search and other assistants.
5. **IndexNow (optional)** — set the repository variable `INDEXNOW_KEY` (8–128 characters: a-z, A-Z, 0-9, `-`). Builds then publish
   `/<key>.txt`, and `.github/workflows/indexnow.yml` submits the sitemap URLs after each Pages build. Check the protocol details at
   indexnow.org before enabling (they could not be fetched from the build sandbox).
6. **Replace demo content** (see `CONTENT-AUDIT.md`), most urgently a real **form endpoint** and **booking URL** — until then forms open
   the visitor's email app — and confirm the `hello@evenmont.com` mailbox receives mail.
7. **Legal review** of `/privacy` and `/terms`; remove the `draft` prop and their entries in `INTENTIONALLY_NOINDEX`.

## 7. Commands

```bash
npm run build:production   # production build + validation (what CI runs)
npm run build:preview      # pre-release build + preview validation
npm run validate           # validate the current dist/ (mode from SITE_ENV, default production)
npm run check              # TypeScript / Astro diagnostics
```
