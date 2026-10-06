# Evenmont — Placeholders, images & assets

## Images (temporary)
The team will replace all photos later. For now:
- Use free stock photos (Unsplash or Pexels license), **downloaded into the repo** (no hot-linking), resized and converted to AVIF + WebP with a JPEG fallback, with explicit `width`/`height`, `loading="lazy"` and `decoding="async"` (except anything above the fold).
- Every placeholder image gets `data-placeholder="true"` and an entry in `src/content/placeholders.json` (slot, file, source URL, suggested replacement) so the team can find and replace them in one pass.
- Style: real people at work, warehouses, workshops, laptops with dashboards, natural light. Avoid handshakes, people pointing at screens, AI-generated faces, mountains, forests.

| Slot | Page | Suggested stock search | Ratio |
| --- | --- | --- | --- |
| Hero product screen | Home, scenario pages | laptop dashboard office (or build an SVG “screen” mock with neutral charts) | 16:10 |
| Scenario cards (3) | Home | agency team meeting · warehouse shelves scanner · small manufacturing workshop | 4:3 |
| Founder portraits (2) | Home, About | neutral headshot placeholder → better: initials avatar in Sage/Evergreen | 1:1 |
| Case covers (3) | Cases | office team · distribution warehouse · assembly line small | 16:9 |
| Client logos (3–6) | Trust strip, cases | generate neutral SVG wordmarks “Client A/B/C” | — |
| Founder video poster | Home | still of a person talking to camera, or Evergreen poster with play icon | 16:9 |
| Partner page visual | Partners | accountant desk with laptop and documents | 4:3 |

Prefer on-brand SVG mocks over photos wherever a photo is not essential (product screens, charts, logos) — lighter and always consistent.

## Text & data placeholders (keep visible, easy to search)
`{{JITO_REG_NO}}` · `{{BN_REG_NO}}` · `{{VAT_NO}}` · `{{REGISTERED_OFFICE}}` · `{{DIRECTORS}}` · `{{EMAIL}}` · `{{SECURITY_EMAIL}}` · `{{PHONE_US}}` · `{{BOOKING_URL}}` · `{{FORM_ENDPOINT}}` · `{{ODOO_PARTNER_BADGE}}` · `{{CERT_LINKS}}` · `{{CLUTCH_URL}}` · `{{SOCIAL_LINKS}}` · `{{FOUNDER_1_NAME}}` / `{{FOUNDER_2_NAME}}` · `{{N}}` (projects per quarter) · `{{CPA_RULES_NOTE_URL}}` · downloadable PDFs (one-pagers, sample SOW, sample report, sample partner agreement, sample payout statement) as placeholder files.

Business terms marked ⚑ in `02-site-structure.md` (prices, fee %, timelines, guarantees) live in one content file (e.g. `src/content/terms.json`) so they can be changed in one place.

## Brand assets in this kit
- `brand/logo/` — all logo SVGs (text converted to paths), favicon set, app icons.
- `brand/social/` — `og-image.png` (client), `og-image-partners.png` (partner pages), plus SVG sources.
- `brand/fonts/` — `fraunces-600-latin.woff2` (18 KB), `manrope-var-latin.woff2` (23 KB), OFL licenses. Serve from `/fonts/`, preload both.
- `brand/tokens.css` — CSS variables for both moods; `brand/tokens.json` — same values as data.

## Head snippet (reference)
```html
<link rel="preload" href="/fonts/manrope-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/fraunces-600-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0F3D34">
<meta name="color-scheme" content="only light">
<meta property="og:image" content="https://evenmont.com/og-image.png">
```
