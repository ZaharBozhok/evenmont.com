# Evenmont website

Marketing site for **Evenmont** (evenmont.com) — finance-first Odoo implementation for growing US companies.
Two audiences, one brand: **clients** (business owners) and **partners** (accountants and agencies), each with its own page mood.

- **Stack:** Astro 7 (static output), TypeScript, plain component-scoped CSS on the kit's design tokens. No UI framework, no CSS framework, no animation library.
- **JavaScript:** small vanilla modules only where needed (menu, scenario tabs, calculator, forms, sticky CTA, one IntersectionObserver). Largest page (home): 3.1 KB gzip.
- **Source of truth:** the brand kit, copied into [`brand-kit/`](brand-kit/) (brand guide, site structure, motion spec, placeholder policy, tokens).
- **QA:** [`docs/qa/QA-REPORT.md`](docs/qa/QA-REPORT.md) — Lighthouse scores, screenshots at 390 px and 1440 px, remaining placeholders.

> **Pre-release preview.** The site is filled end to end with **invented demo content** (six fictional case studies, quotes,
> founder names, legal details, partner firms, PDFs) so the final look is clear. Everything invented is listed in
> [`docs/DEMO-CONTENT.md`](docs/DEMO-CONTENT.md) and in the build report. Pre-release mode keeps every page out of search
> engines (`noindex` + `robots.txt` Disallow) until `settings.prerelease` is set to `false`.

---

## Run, build, deploy

Requires **Node.js 22.12+**.

```bash
npm install
npm run dev        # http://localhost:4321 — live reload
npm run build      # static site in dist/ (+ placeholder report in the terminal)
npm run preview    # serve dist/ locally
npm run check      # TypeScript / Astro diagnostics
```

The build prints a **placeholder report**: pre-release status, every piece of demo content (`demo: true` cases and the settings
in `settings.json → demo.fields`), any `{{TOKEN}}` left, and every placeholder image. It is a warning, not an error.
`PRERELEASE=false npm run build` makes a launch-mode build (indexable) without editing the settings file.

Downloadable PDFs are generated from the site data: `npm install --no-save playwright-core && node scripts/pdfs/build.mjs`.

QA helpers (optional, not site dependencies): `npm install --no-save playwright-core`, then with `npm run preview` running,
`node scripts/qa/check-layout.mjs` (no horizontal scroll, one H1, no errors at 320–1440 px) and `node scripts/qa/screenshots.mjs`.

### Deploy (static files)

| Host | Settings |
| --- | --- |
| **Cloudflare Pages** | Build command `npm run build`, output directory `dist`, env `NODE_VERSION=22`. Headers from `public/_headers`. |
| **Netlify** | `netlify.toml` is included (build + publish dir). Headers from `public/_headers`. |
| **Vercel** | Framework preset "Astro" or "Other", output `dist`. `vercel.json` sets clean URLs and headers. |

URLs have no trailing slash (`/services`, `/partners/white-label`); pages are emitted as `services.html` etc. (`build.format: 'file'`).
Caching: hashed assets in `/_astro/*` and fonts in `/fonts/*` are `immutable` for a year; stable-URL files (favicons, OG images, PDFs) get short caches.
If the production domain changes, update `site` in `astro.config.mjs` (canonical URLs, sitemap, OG image URLs).

---

## Where things live

```
brand-kit/                  The kit as delivered (docs, tokens.css/json, OG sources) — reference only
public/                     Copied as-is: fonts, favicons, manifest, OG images, PDFs, _headers
scripts/pdfs/               PDF generator for public/downloads (HTML → PDF with the site's fonts and data)
docs/DEMO-CONTENT.md        Everything invented for the preview, and how to replace it
src/
  content/                  ← content the team edits (no component changes needed)
    cases/*.md              Case studies (Markdown + frontmatter)
    faq/*.json              FAQ per page: home, services, distribution, manufacturing, partners, white-label
    scenarios.json          The three scenarios: hero copy, pains, before/after rows, apps, package
    terms.json              ⚑ Business terms: prices, fees, timelines, guarantees, comparison table
    settings.json           Legal details, links, founders, booking URL, form endpoint, prerelease, demo list, analytics
    placeholders.json       Registry of placeholder images, mocks and files
  content.config.ts         Collection schemas (validated at build)
  pages/                    One file per route ([scenario].astro and cases/[slug].astro are templates)
  components/               Header, Footer, Button, SumLine, cards, forms, sections/, illustrations/
  layouts/BaseLayout.astro  <html data-mood>, SEO/OG/JSON-LD, fonts, header, footer, sticky CTA
  styles/tokens.css         The kit's tokens (partner-mood blocks moved to moods-partner.css, values unchanged)
  styles/theme.css          Tone classes (.tone-dark / .tone-alt), font fallbacks — maps to existing colors only
  styles/base.css           Reset, type, buttons, sum line, ledger grid, forms, motion utilities
  scripts/                  animate.ts (the one IntersectionObserver), scenario.ts, forms.ts
  icons/lucide.ts           Only the Lucide icons the site uses
  assets/                   Logos (hashed on build) and placeholder photos (optimized by astro:assets)
integrations/placeholder-report.mjs   Build-time placeholder warning
```

---

## Editing content

### Prices, fees, timelines, promises (⚑ business terms)
Everything marked ⚑ in the site structure lives in **`src/content/terms.json`** — change it in one place:

- `packages` — the seven pricing cards (`price` is a number in USD; `null` + `priceLabel` for "Free" / "After Blueprint").
  Scenario pages pick their package by id (`scenarios.json` → `package`).
- `process.steps` — the five "How we work" steps (time and price columns) and the 90-day note.
- `guarantees` — "Our promises, in writing." Each one must exist in the contract.
- `partner` — fee rate (`feeRate: 0.1` = 10%), "What you get" list, economics examples (totals and fees are calculated).
- `whiteLabel` — commercials and capacity.
- `comparison` — the "Why Odoo" table. Qualitative only, no competitor prices. **Please review this wording.**
- `vars` — values reused in copy. Any text in `terms.json` or the FAQ files can say `{hypercare}`, `{buildServices}`,
  `{feePercent}`, … and the value is filled in everywhere. (`feePercent`, `keepPrice` and `blueprintFee` are computed.)

### FAQ
`src/content/faq/<page>.json` — a `title` and a list of `{ "q": …, "a": … }`. Answers may use `{vars}` from `terms.json`.

### Case studies
One Markdown file per case in **`src/content/cases/`**; the file name becomes the URL (`/cases/<file-name>`).
Copy a sample file and edit it:

- Frontmatter: `scenario` (`services` · `distribution` · `manufacturing`), `company`, `profile`, `result` (the headline number),
  `headline`, `beforeAfter`, `apps`, `integrations`, `timeline`, `pricingModel`, `quote`, `cover` + `coverAlt`,
  `results` (before/after table with measurement dates), `screenshots`, `whatsNext`.
- Body (Markdown): `## Before`, `## Why they chose us`, `## What we did` — under it one `### Phase` heading per phase
  (Blueprint, Build, Go-live, Keep), each followed by a paragraph; the page draws them as a numbered timeline.
- `results`: a numeric before/after pair in the same unit (`11` → `3`, `71%` → `96%`, `$412k` → `$284k`) is drawn as two bars;
  anything else is shown as words.
- `demo: true` marks invented preview content (no label on the page, listed in the build report). `placeholder: true` shows a
  **Sample** label. Remove both only for real, approved content.
- `referenceCall: true` adds the "Talk to this client" button — only with the client's permission.
- `coDelivery: true` + `accountantQuote` lists the case as partner proof on `/partners`.
- Screenshots: add `image: ../../assets/cases/<file>.png` to a screenshot entry to use a real (blurred) screenshot; without `image`, an on-brand SVG mock is shown.
- The six current cases are **demo content** (fictional companies, people and numbers) — see `docs/DEMO-CONTENT.md`.

The home page shows the first three cases (by `order`) and puts the one matching the selected scenario first; cases 4–6 feed
"What clients wrote" in *Check us*. Scenario pages show that scenario's cases.

### Scenario pages
`src/content/scenarios.json` drives `/services`, `/distribution`, `/manufacturing` and the scenario blocks on the home page
(hero copy, the three pains, before/after rows, outcomes, apps, integrations, card text, package id, image).

### Site settings
**`src/content/settings.json`** holds every value the team provides: legal details, contact, links (booking, form endpoint,
certifications, reviews, CPA note, video, Apps Store, code samples, social), the Odoo partner badge, founders, the partnerships
contact, the partner firm list, white-label cases, `prerelease` and the analytics slot. Change a value and it changes on every page.

For the preview most values are **demo values**, listed in `demo.fields` (see `docs/DEMO-CONTENT.md`). Three links accept the
special value `demo`: `formEndpoint` (forms simulate success, nothing is sent), `bookingUrl` (an in-page slot picker on `/book`)
and `founderVideoUrl` (the poster opens the video script). Any `{{TOKEN}}` value still works as a placeholder: it is shown with a
dashed outline and listed by the build.

### Legal pages
- `/legal` reads the operator details from `settings.json`.
- `/privacy` and `/terms` are **drafts for legal review**, written from how the site actually works (forms, no cookies,
  analytics off). The `draft` prop on `LegalPage` shows the notice; remove it once counsel has approved the text.

### Page copy
Section copy lives in the page files (`src/pages/*.astro`) and in `src/components/sections/*.astro`. It follows the site structure
document; wording was only tightened where the layout needed it.

---

## Placeholder images and files

| What | Where | How to replace |
| --- | --- | --- |
| Stock photos (Pexels license) | `src/assets/placeholders/*.jpg` | Overwrite the file (same name, same ratio) or change the import. Astro regenerates AVIF/WebP/JPEG + `srcset`. |
| Product screens, case screenshots | `src/components/illustrations/ScreenMock.astro` | Add real screenshots (see case studies above) or swap the component for a `<Picture>`. |
| Client wordmarks (demo) | `src/components/illustrations/ClientLogo.astro` | Replace with real logos (with permission). |
| Founder portraits | `src/components/Avatar.astro` | Initials are shown; pass a `photo` for real portraits. |
| Founder video | `src/components/sections/CheckUs.astro`, poster `src/assets/placeholders/video-poster.jpg` | Set `links.founderVideoUrl`; replace the poster when ready. |
| Odoo partner badge | `settings.json` → `odooPartnerBadge`, `src/components/PartnerBadge.astro` | Place the official badge artwork from Odoo. |
| PDFs (9) | `public/downloads/*.pdf`, generated by `scripts/pdfs/build.mjs` | Re-run the script after changes, or replace with final documents (same file names). |

Every placeholder carries `data-placeholder="true"` in the HTML and is listed in **`src/content/placeholders.json`**
(slot, file, source URL, suggested replacement). Set an item's `status` to `"replaced"` and it drops out of the build warning.

---

## Moods (theming)

The mood is set **per page** with the `mood` prop on `BaseLayout`, which writes `data-mood` on `<html>`:

| Pages | `mood` | `<html>` |
| --- | --- | --- |
| Home, scenarios, cases, about, security, book, legal, 404 | `client` (default) | no attribute |
| `/partners` | `partner` | `data-mood="partner"` |
| `/partners/white-label` | `partner-dark` | `data-mood="partner-dark"` |

Components read only semantic tokens (`--bg`, `--text`, `--accent`, `--rule`, …), so they re-skin automatically:
Amber on client pages, Cobalt (Sky on dark) on partner pages — never both on one page.
Bands inside a page use tone classes from `theme.css`: `.tone-dark` (hero, final CTA — Evergreen / Night), `.tone-alt` (Sage / Mist),
and `.tone-light` (a light card inside a dark band). The header takes `headerTone="dark"` (on a hero) or `"light"` (legal pages).

---

## Motion

The SVG animation catalogue from `brand-kit/docs/03-motion-and-svg.md`, implemented with CSS transitions and keyframes on
`transform`, `opacity` and `stroke-dashoffset` only. One small module (`src/scripts/animate.ts`, < 1 KB gzip) does two things:

- adds `.is-in` once per `[data-animate]` element when it is in view (25% of it, or 40% of the viewport for tall elements);
- **scroll reveal**: `[data-reveal]` elements and the children of `[data-reveal-children]` (section heads, card grids, lists) rise
  and fade in as they enter; items entering together are staggered. Only items below the fold at load are hidden, so nothing on
  screen blinks and nothing is hidden without JS.

Illustrations with a choreography use the **scene** system in `base.css`: the root gets `.scene` + `data-animate`, each part
gets `.k` and inline `--k` (keyframes), `--t` (duration), `--d` (delay) — see `HeroSystem.astro`. Finished parts drop their
keyframes so a resize never replays them.

| # | Animation | Component |
| --- | --- | --- |
| 1 | Logo settle — **removed**: on the home hero it read as a second logo next to the header logo | — |
| 2 | Many → one: tool chips send amber pulses into one line; a dashboard card settles, rows fill in, the accountant's sign-off toast rises in (no count-up: the kit rules out tickers) | `illustrations/HeroSystem.astro` |
| 3 | Sum line draw — one continuous sweep across the words | `SumLine.astro` |
| 4 | Ledger grid fade | `.ledger` in `base.css` (heroes, pricing) |
| 5 | Scenario icons redraw, cards cross-fade | `illustrations/ScenarioIcon.astro`, `sections/ScenarioSwitcher.astro` |
| 6 | Before → after: a compare slider (twelve tools ↔ one system; drag or arrow keys, one gentle settle from 86% to 50% on first view) and change cards | `illustrations/CompareSlider.astro`, `BeforeAfter.astro` |
| 7 | Case card hover lift + sum line | `CaseCard.astro` |
| 8 | Calculator result fade + bar | `sections/Calculator.astro` |
| 9 | Timeline draw | `Timeline.astro` |
| 10 | Spirit level | `illustrations/SpiritLevel.astro` |
| 11 | Checkmarks draw, then both founders' signatures write themselves once | `sections/Guarantees.astro` |
| 12 | Quiet peaks | `illustrations/QuietPeaks.astro` |
| 13 | Two columns, one total | `illustrations/TwoColumns.astro` |
| 14 | Shield checks | `RiskTable.astro` |
| 15 | Blueprint grid + layers | `illustrations/BlueprintLayers.astro` |
| 16 | Micro (arrow nudge, press scale) | `base.css` |

Static visuals added for the preview (no motion beyond the scroll reveal): problem screens with accent annotations
(`illustrations/PainVisual.astro`), certification seals (`illustrations/Seal.astro`), rating stars (`Stars.astro`), the
"In every project" chips (`Included.astro`), the Odoo app window on scenario pages, result bars on case pages.

**Reduced motion / no JavaScript:** initial states only apply with JS *and* without `prefers-reduced-motion`, so both groups
see every final state immediately (the tokens also zero all durations). Nothing animates the hero H1 (it is the LCP element).

---

## Forms

Fit call (`/book`), partner intro (`/partners#apply`), white-label scope (`/partners/white-label#scope`) and the readiness
checklist (final CTA) post to `settings.links.formEndpoint` (later the Odoo website form / CRM).

- Works without JavaScript (plain POST). With JavaScript: inline validation (text + color), `fetch` submit with
  `Accept: application/json`, inline success state, no page reload. Any 2xx response counts as success.
- Honeypot field `website`; no CAPTCHA. A hidden `form` field tells submissions apart.
- **Demo mode** (`formEndpoint: "demo"`, the preview setting): submissions are simulated in the browser — a short "sending"
  state, then the success message. Nothing is sent anywhere. A `{{TOKEN}}` endpoint shows "This form is not connected yet"
  in production builds instead of pretending to send.
- Booking: with `bookingUrl: "demo"`, `/book` shows a slot picker (next five business days, US Eastern) that writes the chosen
  time into the fit-call form. With a real `https://` Odoo Appointments URL it shows the booking button and a click-to-load
  embed (the third-party iframe loads only on request).

---

## Performance and accessibility

Budgets (mobile, Lighthouse simulated 4G) and results are in the QA report. How they are met:

- The hero H1 is server-rendered text and the LCP element; nothing hides or animates it.
- All CSS is inlined per page (`build.inlineStylesheets: 'always'`; home ~11 KB gzip) — no render-blocking requests.
  The partner-mood tokens live in `styles/moods-partner.css` and load only on the partner pages.
- Two WOFF2 files only, preloaded, `font-display: swap`, with metric-matched local fallbacks to avoid layout shift.
- Images via `astro:assets` (AVIF/WebP + JPEG, responsive `srcset`, explicit dimensions, lazy below the fold).
- No third-party scripts, trackers, chat widgets or external fonts. Analytics slot (cookieless tool) is in
  `settings.json` → `analytics`, disabled.
- WCAG 2.2 AA: landmarks, one H1 per page, skip link, visible focus ring, ARIA tabs, `<details>` accordions, labeled fields with
  inline errors, alt text, decorative SVGs `aria-hidden`, 44 px touch targets, focus kept clear of the sticky bar.

---

## Decisions worth knowing

- **Mobile header:** the horizontal logo is ~9.7:1, so at 360–519 px the header shows logo + menu (the logo scales between 24
  and 28 px); the compact "Book a call" button appears from 520 px, the full label from 768 px, the full navigation from 1280 px.
  Below 520 px the call to action is in the hero, the menu sheet and the sticky bottom bar.
- **Partner footer logo:** the descriptor lock-up exists only with the Amber accent, so partner pages use the partner logo with the
  descriptor set as text beside it (no Amber on partner pages).
- **Sample label:** shown on `placeholder: true` cases in development *and* production builds, so sample content can never go live
  unlabeled.
- **People without fake faces:** testimonial authors, founders and the hero's sign-off toast use monogram avatars — no stock
  faces, because stock models can't be shown endorsing a company. Stock photos appear only as context (people at work, desks,
  warehouses), per the kit's photo rules; each is listed in `placeholders.json`.
- **Visual first:** problems are shown as small product screens with an accent annotation, changes as a compare slider and icon
  cards, the comparison as a scorecard, the process as an icon timeline, case results as before/after bars. Copy stays short.
- **Demo content, clearly fenced:** for the CEO preview every gap is filled with invented content (cases, quotes, names, legal
  details). It is flagged in the source (`demo: true`, `demo.fields`), listed by every build and in `docs/DEMO-CONTENT.md`, and the
  site stays `noindex` until `prerelease` is turned off. The scenario FAQ answers and the comparison table were written from
  facts in the brand kit and are flagged for review.

---

## Licenses

- Fraunces and Manrope — SIL Open Font License (`public/fonts/OFL-*.txt`).
- Lucide icons — ISC (`src/icons/LICENSE-lucide.txt`).
- Placeholder photos — Pexels License (sources in `src/content/placeholders.json`); replace before launch.
- Tokens: `src/styles/tokens.css` is the kit's file with the partner-mood blocks moved to `moods-partner.css` (values unchanged);
  the untouched original is `brand-kit/tokens.css`.
- Logos, OG images and brand assets — © Evenmont / JITO LTD.
