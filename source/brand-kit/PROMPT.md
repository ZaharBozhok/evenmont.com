# Build the Evenmont website

You are a senior front-end engineer and web designer. Build the marketing website for **Evenmont** (evenmont.com) — a finance-first Odoo implementation partner for growing US companies. The site has two audiences with two visual “moods” inside one brand: **clients** (business owners) and **partners** (accountants and agencies).

## Inputs — read these first, in order
The attached kit `evenmont-site-kit/` is the source of truth:
1. `docs/01-brand-guide.md` — voice, logo rules, colors, typography, motifs, imagery.
2. `docs/02-site-structure.md` — sitemap, every page section by section, all copy.
3. `docs/03-motion-and-svg.md` — the SVG animation catalogue and rules.
4. `docs/04-placeholders-and-assets.md` — image policy, placeholders, head snippet.
5. `brand/tokens.css` (+ `tokens.json`) — use these variables; don't invent new colors.
6. `brand/logo/`, `brand/social/`, `brand/fonts/` — use the files as provided (logos are final; text is already outlined).

Use the copy from `02-site-structure.md` as written. You may tighten wording for layout, but keep the meaning, the voice rules and every placeholder (`{{…}}`) and ⚑ business term.

## Tech stack
- **Astro (latest stable), static output**, TypeScript. Plain CSS using the tokens (component-scoped styles). No UI framework runtime, no CSS framework, no animation library, no jQuery.
- Client-side JS only where needed, as small vanilla modules: mobile menu, scenario switcher (tabs), cost calculator, form submit, the single IntersectionObserver for animations. Target **< 30 KB JS gzip on any page** (ideally < 15 KB).
- Content collections for cases, FAQ, packages/terms (`src/content/…`) so the team edits content without touching components.
- Images through `astro:assets` (AVIF/WebP, responsive `srcset`, explicit dimensions).
- Deployable as static files (Cloudflare Pages / Netlify / Vercel). Include `_headers` (or equivalent) with long cache for hashed assets and fonts.

## Design requirements
- Moods: set `data-mood` on `<html>` per page — none (client) for client pages, `partner` for `/partners`, `partner-dark` for `/partners/white-label`. Components must read only semantic tokens (`--bg`, `--text`, `--accent`, `--rule`…) so they re-skin automatically. Never show Amber and Cobalt on the same page.
- Typography: Fraunces 600 only for H1/H2/display and big numbers; Manrope for everything else; tabular numbers in tables and prices. Sentence case. Max line length 68ch.
- Client hero and final CTA sit on Evergreen; partner hero on Night; white-label page is fully dark.
- Signature details: sum line (double underline) under key phrases/numbers, hairline ledger grid in hero/pricing, generous whitespace, cards with 16px radius and very light shadow, 48px buttons with 10px radius. Amber buttons on light backgrounds get a 1px Ink border.
- Don't use Odoo purple/teal or the Inter font. Don't put “Odoo” inside the logo. The Odoo partner badge is a placeholder slot, separate from our logo.
- Icons: Lucide or Phosphor outline icons as inline SVG (only the ones used).

## Mobile first — this is critical
- Design and build for 360–430px first, then scale up (768, 1024, 1280+). No horizontal scrolling at any width; wide tables become stacked cards or scroll inside their own container with a visible hint.
- Touch targets ≥ 44px, body text ≥ 16px, sticky bottom CTA bar on mobile after the hero, full-screen menu sheet, forms with correct `inputmode`/`autocomplete`.
- Respect safe areas (`viewport-fit=cover`, `env(safe-area-inset-*)`).
- Test in Chrome Android and iOS Safari sizes; nothing may depend on hover.

## Performance budget (mobile, Lighthouse, simulated 4G)
- Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100 on every page.
- LCP < 2.0 s, CLS < 0.05, INP < 200 ms, TBT < 100 ms.
- Home initial transfer < 400 KB before lazy images. CSS < 50 KB. Fonts: only the two provided WOFF2 files, preloaded, `font-display: swap`.
- The hero H1 is the LCP element: render it in HTML, never hide or animate it. Inline critical CSS if needed. No render-blocking third-party scripts. No external fonts, no trackers, no chat widgets. Leave an analytics slot for a cookieless tool, disabled.
- Lazy-load everything below the fold; reserve space for every image and embed.

## SVG animations
Implement the catalogue in `03-motion-and-svg.md`: logo settle in the hero, “many → one” hero illustration, sum-line draw-ins, scenario icon redraws, before/after row resolve, timeline draw, spirit-level bubble, checkmarks, partner “two columns, one total”, white-label grid and layers. Rules: inline SVG, CSS transitions/keyframes, transform/opacity/stroke-dashoffset only, trigger once when in view, full `prefers-reduced-motion` support, no layout shift, all animation JS < 3 KB.

## Accessibility
WCAG 2.2 AA: semantic landmarks, one H1 per page, skip link, visible focus ring (`--focus`), accessible tabs (ARIA pattern) and accordion (`<details>`), labeled form fields with inline errors, alt text for every meaningful image, decorative SVG `aria-hidden`. Color contrast per the tokens (already checked) — don't lighten muted text.

## SEO & sharing
Per-page title/description/canonical, Open Graph + Twitter tags with `og-image.png` (client pages) and `og-image-partners.png` (partner pages), JSON-LD `Organization` (name Evenmont, legalName JITO LTD), `sitemap.xml`, `robots.txt`, favicons and `site.webmanifest` from the kit, `lang="en-US"`, custom 404.

## Placeholders
- Photos: free stock images (Unsplash/Pexels) downloaded and optimized locally, or on-brand SVG mocks (preferred for screens, charts, logos). Mark each with `data-placeholder="true"` and list it in `src/content/placeholders.json`.
- Case studies: create 3 sample cases (one per scenario) with `placeholder: true`; show a “Sample” label in development builds and print a build warning while any `placeholder: true` content or `{{…}}` token remains.
- Forms post to `{{FORM_ENDPOINT}}` (progressive enhancement, honeypot, inline success state). Booking uses `{{BOOKING_URL}}`.
- Legal pages: skeletons only. Never write legal text, testimonials, client names, statistics or claims that aren't in the docs.

## Build order
1. Scaffold, fonts, tokens, base styles, layout, header (both moods), footer, buttons, sum line.
2. Home page, all sections.
3. Scenario template + 3 scenario pages.
4. Cases index + case template + 3 samples.
5. Partners page and white-label page.
6. About, Security, Book, Legal, Privacy, Terms, 404.
7. SVG animations.
8. Performance, accessibility and responsive QA pass; fix until the budgets are met.

## Deliverables
- The repository with a README: how to run, build and deploy; how to edit content (cases, FAQ, prices ⚑, legal placeholders); how to replace placeholder images; where the mood is set.
- A short QA report: Lighthouse mobile scores for `/`, `/distribution`, `/partners`, `/partners/white-label`; screenshots at 390px and 1440px for each page; the list of remaining placeholders.

## Done means
Every page from the sitemap exists with the documented sections and copy · both moods render correctly and never mix accents · no horizontal scroll from 360px up · budgets met on mobile · all animations respect reduced motion · no invented facts · all placeholders listed.
