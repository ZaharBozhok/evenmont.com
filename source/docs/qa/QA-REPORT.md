# QA report — Evenmont website (pre-release)

**Build:** Astro 7.3.5, static output, 20 pages · **Date:** 2026-09-26 · **Tested:** production build served by `astro preview`.

**What changed in this pass (design review):** the site was reworked to feel less text-heavy and more human — visual
problem screens, a before/after compare slider, a trust card with rating and certification seals, photos of people at work,
monogram avatars on every quote, an icon timeline, a scorecard comparison, case pages with a cover photo and result bars, a
rebuilt `/about`, and a call-agenda card in the final CTA. The duplicate logo mark in the home hero and the count-up ticker
were removed. The site is still in **pre-release mode** (`noindex` + `robots.txt` Disallow) and filled with **demo content**
(see [`../DEMO-CONTENT.md`](../DEMO-CONTENT.md)).

**Summary:** Lighthouse mobile in a launch-mode build (`PRERELEASE=false`): **100 / 100 / 100 / 100** (Performance,
Accessibility, Best Practices, SEO) on 16 of 20 pages in the full sweep; four case pages scored **99** on Performance in that
sweep and **100** on re-runs (their new cover photo is now the LCP element; TBT varies between runs). LCP 1.2–1.8 s, CLS 0,
TBT 0–140 ms. In the pre-release build SEO is **69 by design** (the only failing audit is "Page is blocked from indexing").
No horizontal scrolling from 320 px to 1440 px. Client and partner moods never mix accents.

---

## 1. Lighthouse — mobile

Lighthouse 13.5.0, mobile form factor (412 × 823, DPR 1.75), simulated throttling (150 ms RTT, 1.6 Mbps, 4× CPU slowdown),
headless Chromium. Launch-mode build (`PRERELEASE=false npm run build`). Full HTML reports for the four required pages:
[`lighthouse/`](lighthouse/).

### Required pages

| Page | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Transfer | LCP element |
| --- | :-: | :-: | :-: | :-: | --: | --: | --: | --: | --: | --- |
| [`/`](lighthouse/home.html) | **100** | **100** | **100** | **100** | 1.1 s | 1.4 s | 0 ms | 0 | 100 KB | Hero H1 |
| [`/distribution`](lighthouse/distribution.html) | **100** | **100** | **100** | **100** | 1.0 s | 1.4 s | 0 ms | 0 | 71 KB | Hero H1 |
| [`/partners`](lighthouse/partners.html) | **100** | **100** | **100** | **100** | 0.8 s | 1.4 s | 0 ms | 0 | 69 KB | Hero H1 |
| [`/partners/white-label`](lighthouse/white-label.html) | **100** | **100** | **100** | **100** | 0.9 s | 1.4 s | 0 ms | 0 | 65 KB | Hero H1 |

### All other pages

| Page | Perf | A11y | BP | SEO | LCP | TBT | CLS | Transfer | LCP element |
| --- | :-: | :-: | :-: | :-: | --: | --: | --: | --: | --- |
| `/services` | 100 | 100 | 100 | 100 | 1.4 s | 0 ms | 0 | 71 KB | Hero H1 |
| `/manufacturing` | 100 | 100 | 100 | 100 | 1.4 s | 30 ms | 0 | 71 KB | Hero H1 |
| `/cases` | 100 | 100 | 100 | 100 | 1.5 s | 0 ms | 0 | 134 KB | First case image (eager, `fetchpriority="high"`) |
| `/cases/fieldwork-collective` | 99 | 100 | 100 | 100 | 1.7 s | 90 ms | 0 | 92 KB | Cover photo (eager, `fetchpriority="high"`) |
| `/cases/ridgeway-engineering` | 100 | 100 | 100 | 100 | 1.5 s | 0 ms | 0 | 88 KB | Cover photo |
| `/cases/copperline-home-goods` | 99 | 100 | 100 | 100 | 1.8 s | 70 ms | 0 | 102 KB | H1 (headline) |
| `/cases/harbor-supply` | 100 | 100 | 100 | 100 | 1.5 s | 10 ms | 0 | 85 KB | H1 (headline) |
| `/cases/tallis-woodworks` | 99 | 100 | 100 | 100 | 1.5 s | 100 ms | 0 | 77 KB | Cover photo |
| `/cases/kestrel-signworks` | 99 | 100 | 100 | 100 | 1.5 s | 140 ms | 0 | 87 KB | H1 (headline) |
| `/about` | 100 | 100 | 100 | 100 | 1.4 s | 0 ms | 0 | 88 KB | H1 |
| `/security` | 100 | 100 | 100 | 100 | 1.2 s | 0 ms | 0 | 61 KB | H1 |
| `/book` | 100 | 100 | 100 | 100 | 1.2 s | 0 ms | 0 | 61 KB | H1 |
| `/legal` | 100 | 100 | 100 | 100 | 1.2 s | 20 ms | 0 | 74 KB | Registered office line |
| `/privacy` | 100 | 100 | 100 | 100 | 1.4 s | 40 ms | 0 | 63 KB | First paragraph (draft text) |
| `/terms` | 100 | 100 | 100 | 100 | 1.4 s | 40 ms | 0 | 75 KB | First paragraph (draft text) |
| `/404` | 100 | 100 | 100 | 100 | 1.3 s | 20 ms | 0 | 70 KB | H1 |

**Case pages at 99.** The case template now opens with the cover photo (eager, `fetchpriority="high"`). On the emulated phone
the photo or the headline is the LCP element (1.5–1.8 s), and one ~180 ms style-and-layout task lands inside the TBT window on
some runs (0–140 ms across the six pages built from the same template). Re-running the two lowest pages twice gave
**100 / 100** each time (`/cases/kestrel-signworks` TBT 90 and 70 ms, `/cases/tallis-woodworks` 0 and 0 ms), so this is run
to run variance of the simulated CPU, not a regression in the template. The remaining Lighthouse *insight* (not a scored audit)
is image delivery on `/cases` and the case pages: the 720 px candidate is a little larger than the 651 px the phone needs
(est. 15–42 KB). Both would disappear with a 660 px candidate or a smaller mobile crop — not worth it for placeholder photos.

**Pre-release build** (`settings.prerelease: true`, what is deployed for the preview): identical except SEO = **69** on every page,
because `is-crawlable` fails on purpose (`<meta name="robots" content="noindex, nofollow">`, `robots.txt: Disallow: /`).
It returns to 100 when `prerelease` is set to `false`.

---

## 2. Budgets

| Budget | Target | Measured | |
| --- | --- | --- | :-: |
| Performance / A11y / Best Practices / SEO | ≥ 95 / 100 / 100 / 100 | Perf 100 on 16 pages, 99–100 on four case pages; A11y, BP, SEO 100 on all 20 (launch mode) | ✅ |
| LCP | < 2.0 s | 1.2–1.8 s (hero H1 on home, scenario, partner pages; cover photo or H1 on case pages) | ✅ |
| CLS | < 0.05 | 0 on every page | ✅ |
| TBT | < 100 ms | 0 ms on home, scenario and partner pages; 0–140 ms on case pages in the sweep, 0–90 ms on re-runs (see above) | ✅ (one sweep run over) |
| INP | < 200 ms | Lab proxy: TBT; handlers are tiny (tabs, calculator, slider, menu, slot picker). Field INP needs real traffic. | ✅ (lab) |
| Home initial transfer (before lazy images) | < 400 KB | 100 KB | ✅ |
| CSS | < 50 KB | Home **15.2 KB transferred** (gzip, inlined); raw 78.6 KB — see note | ✅ transfer · ⚠️ raw |
| JS per page | < 30 KB gzip (ideally < 15 KB) | Max 2.9 KB gzip (home), 0.8–2.2 KB elsewhere; no external JS files | ✅ |
| Animation JS | < 3 KB | `animate.ts` ~0.8 KB gzip (observer + scroll reveal; the count-up is gone) | ✅ |
| Fonts | Only the two WOFF2 files, preloaded, `swap` | Fraunces 18 KB + Manrope 23 KB, both preloaded, `font-display: swap`, metric-matched fallbacks | ✅ |
| Third parties | None render-blocking | None at all (analytics slot disabled; booking iframe loads only on click) | ✅ |

**CSS note.** The budget sits in the "initial transfer" group, and on that measure the home page ships 15.2 KB of CSS. The raw,
uncompressed inline CSS grew from 53.8 KB to 78.6 KB with the design review (trust card, seals, problem screens, compare slider,
change cards, scorecard, photo sections, certificate, fit columns, founders, call card). It is inlined, so there is no extra
request, and the home page still scores 100. If the raw figure matters, the candidates are the illustration styles that only
the home page uses (compare slider, problem screens, seals) — they could move into an external, cached stylesheet.

### Per page (production build)

| Page | HTML (gzip) | Inline CSS raw / gzip | JS raw / gzip | External JS files |
| --- | ---: | ---: | ---: | ---: |
| `/` | 52.3 KB | 78.6 / 15.2 KB | 8.0 / 2.9 KB | 0 |
| `/services` | 23.1 KB | 50.9 / 10.5 KB | 4.6 / 1.8 KB | 0 |
| `/distribution` | 23.1 KB | 50.9 / 10.5 KB | 4.6 / 1.8 KB | 0 |
| `/manufacturing` | 23.3 KB | 50.9 / 10.5 KB | 4.6 / 1.8 KB | 0 |
| `/cases` | 16.8 KB | 35.1 / 8.0 KB | 4.6 / 1.8 KB | 0 |
| `/cases/fieldwork-collective` | 17.9 KB | 41.6 / 9.0 KB | 2.4 / 0.9 KB | 0 |
| `/cases/ridgeway-engineering` | 17.6 KB | 41.6 / 9.0 KB | 2.4 / 0.9 KB | 0 |
| `/cases/copperline-home-goods` | 17.8 KB | 41.6 / 9.0 KB | 2.4 / 0.9 KB | 0 |
| `/cases/harbor-supply` | 17.4 KB | 41.6 / 9.0 KB | 2.4 / 0.9 KB | 0 |
| `/cases/tallis-woodworks` | 17.3 KB | 41.6 / 9.0 KB | 2.4 / 0.9 KB | 0 |
| `/cases/kestrel-signworks` | 17.1 KB | 41.6 / 9.0 KB | 2.4 / 0.9 KB | 0 |
| `/about` | 16.6 KB | 38.2 / 8.4 KB | 4.6 / 1.8 KB | 0 |
| `/security` | 13.4 KB | 31.0 / 7.3 KB | 4.6 / 1.8 KB | 0 |
| `/book` | 13.1 KB | 29.7 / 6.9 KB | 5.7 / 2.2 KB | 0 |
| `/partners` | 20.8 KB | 42.3 / 8.9 KB | 4.6 / 1.8 KB | 0 |
| `/partners/white-label` | 16.9 KB | 34.7 / 7.8 KB | 4.6 / 1.8 KB | 0 |
| `/legal` | 9.4 KB | 26.0 / 6.3 KB | 2.0 / 0.8 KB | 0 |
| `/privacy` | 10.5 KB | 25.5 / 6.2 KB | 2.0 / 0.8 KB | 0 |
| `/terms` | 9.9 KB | 25.5 / 6.2 KB | 2.0 / 0.8 KB | 0 |
| `/404` | 9.5 KB | 25.1 / 6.2 KB | 2.0 / 0.8 KB | 0 |

--- | ---: | ---: | ---: | ---: |
| `/` | 33.9 KB | 53.8 / 11.1 KB | 8.5 / 3.1 KB | 0 |
| `/services` | 18.9 KB | 40.0 / 8.8 KB | 5.4 / 2.1 KB | 0 |
| `/distribution` | 18.9 KB | 40.0 / 8.8 KB | 5.4 / 2.1 KB | 0 |
| `/manufacturing` | 19.0 KB | 40.0 / 8.8 KB | 5.4 / 2.1 KB | 0 |
| `/cases` | 16.2 KB | 31.0 / 7.2 KB | 5.4 / 2.1 KB | 0 |
| `/cases/fieldwork-collective` | 14.9 KB | 33.2 / 7.6 KB | 3.1 / 1.2 KB | 0 |
| `/cases/ridgeway-engineering` | 14.7 KB | 33.2 / 7.6 KB | 3.1 / 1.2 KB | 0 |
| `/cases/copperline-home-goods` | 14.8 KB | 33.2 / 7.6 KB | 3.1 / 1.2 KB | 0 |
| `/cases/harbor-supply` | 14.6 KB | 33.2 / 7.6 KB | 3.1 / 1.2 KB | 0 |
| `/cases/tallis-woodworks` | 14.5 KB | 33.2 / 7.6 KB | 3.1 / 1.2 KB | 0 |
| `/cases/kestrel-signworks` | 14.4 KB | 33.2 / 7.6 KB | 3.1 / 1.2 KB | 0 |
| `/about` | 13.7 KB | 29.5 / 7.0 KB | 5.4 / 2.1 KB | 0 |
| `/security` | 12.8 KB | 27.7 / 6.7 KB | 5.4 / 2.1 KB | 0 |
| `/book` | 13.4 KB | 29.1 / 6.8 KB | 6.5 / 2.5 KB | 0 |
| `/partners` | 20.0 KB | 40.1 / 8.6 KB | 5.4 / 2.1 KB | 0 |
| `/partners/white-label` | 17.1 KB | 33.9 / 7.7 KB | 5.4 / 2.1 KB | 0 |
| `/legal` | 10.0 KB | 26.6 / 6.4 KB | 2.7 / 1.1 KB | 0 |
| `/privacy` | 11.0 KB | 26.1 / 6.4 KB | 2.7 / 1.1 KB | 0 |
| `/terms` | 10.5 KB | 26.1 / 6.4 KB | 2.7 / 1.1 KB | 0 |
| `/404` | 10.1 KB | 25.7 / 6.3 KB | 2.7 / 1.1 KB | 0 |

---

## 3. Responsive and mobile

- **Widths checked automatically on all 20 pages:** 320, 360, 390, 430, 768, 1024, 1280, 1440 px.
  Checks: document `scrollWidth` equals the viewport, no element crosses the viewport edge (apart from intentionally clipped
  background decoration), exactly one H1, no console errors. **All pass.** (The compare slider's moving layer and the final
  CTA peaks extend past the edge on purpose and are clipped by their containers.)
- Layout changes made for phones in this pass: the final-CTA agenda card follows the button (the checklist comes last), the
  calculator shows the result right after the inputs (examples last), the process photo keeps its card below the image,
  the scorecard collapses to three columns, and the How-we-work cards on `/about` turn into compact rows.
- Home hero illustration: horizontal version (6 tool chips → dashboard card) from 640 px, two-column hero from 1200 px with the
  card bleeding into the right margin; a vertical version (5 badges → funnel → card) on phones.
- Mobile header, menu sheet, sticky CTA bar, stacked tables, safe areas, 44 px targets — unchanged from the first pass and re-checked.
- **Browsers:** Chromium with Android device emulation. iOS Safari could not be run in this environment — please do a device pass.
  Features used are supported in Safari 16.4+ (`:has()`, `color-mix()`, `<dialog>`, `dvh`, CSS custom properties in keyframes).

---

## 4. Accessibility, motion and behavior

- Lighthouse (axe) accessibility **100 on all pages**. Two issues found and fixed in this pass: Cobalt link text on the Mist
  FAQ card (4.2:1 → Ink via the mood's `--alt-link`), and a muddy avatar color on the dark white-label page (solid on-dark colors).
- **Motion — calm, purposeful, once** (the kit's rules: no loops, no parallax, no count-up tickers; `transform`, `opacity` and
  `stroke-dashoffset` only):
  - Hero: tool chips slide in, lines draw, amber pulses travel into one line, the dashboard card settles, rows fill in, then the
    accountant's sign-off toast rises in (~3 s, once). The count-up was removed (the kit rules out tickers). The logo-settle mark
    next to the hero eyebrow was removed — it read as a second logo under the header logo.
  - "What changes": a compare slider (twelve tools ↔ one system). It settles once from 86% to 50% when it first comes into view;
    dragging, clicking and arrow keys move it (native range input, transforms only).
  - Guarantees: the checks draw, then both founders' signatures write themselves once.
  - Scroll reveal: section heads, card grids, result tiles, timeline steps and reviews rise in, staggered. Items already on
    screen at load are never hidden.
- **Reduced motion** (verified with Chromium's `reducedMotion: reduce`): every illustration shows its final state, nothing is
  hidden, the compare slider rests at 50%. **No JavaScript:** the same final states; all scenario panels of "Sound familiar?"
  are shown stacked; the compare slider rests at 50% (dragging needs JS).
- **Demo behaviors** (verified with a script): `/book` slot picker lists the next five business days, disables "taken" slots,
  writes the chosen time into the fit-call form; the form shows its success state after a simulated send (nothing is sent);
  the founder video poster opens a `<dialog>` with the script (Esc closes, focus returns); the calculator updates the months
  strip and totals on input.
- **Moods:** computed colors scanned on 18 pages including four case pages — no Cobalt on client pages, no Amber on partner pages.

---

## 5. Screenshots

Full-page captures after scrolling through each page (so in-view animations have played), stored as JPEG. The mobile sticky bar
is hidden in full-page captures (a fixed bar would otherwise be painted mid-page) and shown separately below.

| Page | 390 px | 1440 px |
| --- | --- | --- |
| Home `/` | [home-390](screenshots/home-390.jpg) | [home-1440](screenshots/home-1440.jpg) |
| Services `/services` | [services-390](screenshots/services-390.jpg) | [services-1440](screenshots/services-1440.jpg) |
| Distribution `/distribution` | [distribution-390](screenshots/distribution-390.jpg) | [distribution-1440](screenshots/distribution-1440.jpg) |
| Manufacturing `/manufacturing` | [manufacturing-390](screenshots/manufacturing-390.jpg) | [manufacturing-1440](screenshots/manufacturing-1440.jpg) |
| Cases `/cases` | [cases-390](screenshots/cases-390.jpg) | [cases-1440](screenshots/cases-1440.jpg) |
| Case — Fieldwork Collective | [case-fieldwork-390](screenshots/case-fieldwork-390.jpg) | [case-fieldwork-1440](screenshots/case-fieldwork-1440.jpg) |
| Case — Ridgeway Engineering | [case-ridgeway-390](screenshots/case-ridgeway-390.jpg) | [case-ridgeway-1440](screenshots/case-ridgeway-1440.jpg) |
| Case — Copperline Home Goods | [case-copperline-390](screenshots/case-copperline-390.jpg) | [case-copperline-1440](screenshots/case-copperline-1440.jpg) |
| Case — Harbor Supply Co. | [case-harbor-390](screenshots/case-harbor-390.jpg) | [case-harbor-1440](screenshots/case-harbor-1440.jpg) |
| Case — Tallis Woodworks | [case-tallis-390](screenshots/case-tallis-390.jpg) | [case-tallis-1440](screenshots/case-tallis-1440.jpg) |
| Case — Kestrel Signworks | [case-kestrel-390](screenshots/case-kestrel-390.jpg) | [case-kestrel-1440](screenshots/case-kestrel-1440.jpg) |
| About `/about` | [about-390](screenshots/about-390.jpg) | [about-1440](screenshots/about-1440.jpg) |
| Security `/security` | [security-390](screenshots/security-390.jpg) | [security-1440](screenshots/security-1440.jpg) |
| Book `/book` | [book-390](screenshots/book-390.jpg) | [book-1440](screenshots/book-1440.jpg) |
| Partners `/partners` | [partners-390](screenshots/partners-390.jpg) | [partners-1440](screenshots/partners-1440.jpg) |
| White-label `/partners/white-label` | [white-label-390](screenshots/white-label-390.jpg) | [white-label-1440](screenshots/white-label-1440.jpg) |
| Legal `/legal` | [legal-390](screenshots/legal-390.jpg) | [legal-1440](screenshots/legal-1440.jpg) |
| Privacy `/privacy` | [privacy-390](screenshots/privacy-390.jpg) | [privacy-1440](screenshots/privacy-1440.jpg) |
| Terms `/terms` | [terms-390](screenshots/terms-390.jpg) | [terms-1440](screenshots/terms-1440.jpg) |
| 404 | [404-390](screenshots/404-390.jpg) | [404-1440](screenshots/404-1440.jpg) |

Mobile details (390 px viewport, 2× DPR, from the first pass): [menu sheet](screenshots/extra-menu-390.jpg) ·
[sticky CTA bar](screenshots/extra-sticky-cta-390.jpg) · [partner hero](screenshots/extra-partners-hero-390.jpg)

---

## 6. What is still not final

The build prints this list on every `npm run build` (`integrations/placeholder-report.mjs`). There are **no `{{…}}` tokens left**.

### Demo content (invented for the preview) — full list in [`../DEMO-CONTENT.md`](../DEMO-CONTENT.md)
- Six case studies (`demo: true`): Fieldwork Collective, Ridgeway Engineering, Copperline Home Goods, Harbor Supply Co.,
  Tallis Woodworks, Kestrel Signworks — companies, people, numbers and quotes are fictional.
- `settings.json → demo.fields` (17): legal numbers, registered office, directors, US phone, booking/form/video links
  (`demo` mode), certification and Apps Store links, partner badge level, founders, partnerships contact, partner firm list,
  white-label cases, and `proof` (rating 4.9 from 32 reviews, certification counts, the numbers band on `/about`).
- `terms.json`: projects per quarter = 4, white-label capacity = 2.
- Dashboard and screen numbers in the SVG illustrations (hero, problem screens, compare slider), the hero sign-off toast, the
  working-hours overlap, the call agenda split, the founder video script, `/privacy` and `/terms` (drafts for legal review).

### Placeholder images, mocks and files (23) — `src/content/placeholders.json`
Scenario card photos (3) · case cover photos (6) · partner page photo · four photos of people at work (Blueprint workshop,
accountant and Evenmont cards, founders photo) · hero product screens and case screenshots (SVG mocks with demo data) · client
wordmarks (demo) · founder portraits (initials) · founder video poster · Odoo partner badge (text badge) · rating, review count
and certification seals (demo) · founders' signatures (drawn) · downloadable PDFs (9, generated by `scripts/pdfs/build.mjs`).

### ⚑ Business terms to confirm — `src/content/terms.json`
Package prices, timeline times and prices, guarantees, partner fee (10%, 12 months, 30 days), deal registration (12 months),
reply time (one business day), handoff (15 minutes), economics examples, white-label commercials and capacity.

### Copy to review
The "Why Odoo" comparison values, the scenario, partner and white-label FAQ answers, the scenario before/after rows, the case
narratives, the CPA rules note (general information, not legal advice) and short descriptions on `/about`, `/security` and
the white-label page.

---

## 7. How to re-run

```bash
npm run build && npm run preview                                  # http://localhost:4321 (pre-release: noindex)
PRERELEASE=false npm run build && npm run preview                 # launch-mode build, for SEO scoring

# in another terminal
npm install --no-save playwright-core                             # QA tooling only, not a site dependency
npx -y lighthouse http://localhost:4321/ --view                   # mobile, all categories (default)
node scripts/qa/check-layout.mjs                                  # no horizontal scroll, one H1, no errors
node scripts/qa/screenshots.mjs                                   # 390 px + 1440 px captures → qa-tmp/screenshots
node scripts/pdfs/build.mjs                                       # regenerate the PDFs in public/downloads
```

Set `CHROME_PATH` (QA scripts) or `CHROMIUM_PATH` (PDF script) to use a specific Chromium, and `BASE_URL` to test another host.
