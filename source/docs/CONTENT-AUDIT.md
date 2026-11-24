# Content audit — unverified content and how production handles it

Audited 2026-11-24. Companion to [`DEMO-CONTENT.md`](DEMO-CONTENT.md) (what was invented for the preview and how to
replace it). This file answers a different question: **what is still unverified, where it is, and what reaches the public,
indexable site.**

Nothing was deleted and nothing was rewritten. Unverified items are *hidden* from production builds by data flags and come
back automatically as soon as the flag is removed.

## How it works

| Build | Command | Indexing | Unverified content |
| --- | --- | --- | --- |
| Production (GitHub Pages) | `npm run build:production` (`SITE_ENV=production`) | indexable; robots.txt allows crawling | **not rendered**; flagged PDFs left out of `dist/` |
| Preview / pre-release | `npm run build:preview` (`SITE_ENV=preview`) | `noindex, nofollow` + `Disallow: /` | shown, exactly as before |
| Local / ad-hoc | `npm run build`, `npm run dev` | follows `settings.prerelease` (true) | shown |

The flags:

- **`src/content/settings.json → demo.fields`** — every settings value listed there (or under a listed parent) is unverified.
  Components call `show('<field>')` (`src/lib/site.ts`), which is false in production for listed fields.
- **`demo: true` / `placeholder: true`** in a case study's frontmatter — the case gets no page in production and is left out of
  every list, the logo strip, reviews, partner proof, the sitemap and `llms.txt` (`isPublicCase` in `src/lib/site.ts`).
- **`downloads.*` in `demo.fields`** — the PDF's links are hidden and the file is removed from the production build
  (`integrations/static-output.mjs`).

`scripts/validate-build.mjs --production` fails the deploy if any listed value, demo case or flagged file still appears in
the production output.

**To publish a verified item:** replace the value with the real one, remove its key from `demo.fields` (or `demo: true` from the
case), push. Nothing else to change.

## 1. Hidden from production (flagged, needs real data)

| Item | Location | Shown on (preview) | Production |
| --- | --- | --- | --- |
| Six fictional case studies (Fieldwork Collective, Ridgeway Engineering, Copperline Home Goods, Harbor Supply Co., Tallis Woodworks, Kestrel Signworks) incl. invented clients, people, quotes, numbers, accountant quotes | `src/content/cases/*.md` (`demo: true`) | `/`, `/services`, `/distribution`, `/manufacturing`, `/cases`, `/cases/<slug>`, `/partners` | no pages (`/cases/<slug>` → 404), not listed |
| Invented client wordmarks | `src/components/illustrations/ClientLogo.astro` (fed by the demo cases) | home trust strip | hidden (no public non-NDA cases) |
| Rating "4.9 from 32 reviews on Clutch" | `settings.proof.rating` | home hero, trust card, reviews, `/cases` hero | hidden |
| Certification seals and counts ("Odoo Ready Partner", "4 functional / 2 technical consultants") | `settings.proof.certifications` | home trust card, hero | hidden |
| Company stats (40+ projects, 96% on fixed price, 3 days median close, 12 US states) | `settings.proof.stats` | `/about` numbers band | hidden |
| Odoo partner level "Odoo Ready Partner" | `settings.odooPartnerBadge` | footer badge (all pages), "Check us" | hidden; not in JSON-LD |
| Founders "Alex Kovac", "Elena Sorel" (names, roles, bios) | `settings.founders` | `/about`, final CTA (all client pages), `/book`, FAQ card, founder video | names/avatars hidden; copy without names stays |
| Partnerships contact name | `settings.partnerContact.name` | `/partners`, partner FAQ card | replaced by "Partnerships" + email |
| Company reg. no. HE 432178, business name reg. no. BN 118904, VAT CY 10432178X | `settings.legal.*` | footer (all pages), `/legal`, `/privacy` | hidden |
| Registered office "41 Griva Digeni Avenue, 3036 Limassol" | `settings.legal.registeredOffice` | footer, `/legal`, `/privacy` | hidden |
| Directors | `settings.legal.directors` | `/legal` | hidden |
| US phone +1 (646) 555-0142 (fictional 555 number) | `settings.contact.phoneUs` | `/legal`, `/book` | hidden |
| Partner firm list (4 fictional CPA firms) | `settings.partnerFirms` | `/partners` | hidden |
| Two white-label agency cases | `settings.whiteLabelCases` | `/partners/white-label` | hidden |
| Booking calendar (`demo` slot picker) | `settings.links.bookingUrl`, `partnerBookingUrl` | `/book`, `/partners` | "Email us to pick a time" (mailto) |
| Form endpoint (`demo`: shows success, **sends nothing**) | `settings.links.formEndpoint` | every form | forms compose an email to `contact.email` instead; never a fake success |
| Founder video (`demo`: script dialog, stock poster) | `settings.links.founderVideoUrl` | home "Check us" | hidden |
| Certifications link (generic Odoo partner directory) | `settings.links.certLinks` | "Check us", white-label proof | hidden |
| Apps Store link (generic) | `settings.links.odooAppsStoreUrl` | white-label proof | hidden |
| 7 PDFs naming the demo founders/clients: client & partner one-pagers, sample SOW, sample weekly report, sample partner agreement, sample payout statement, CPA rules note | `public/downloads/*.pdf` (generated by `scripts/pdfs/build.mjs` from settings + demo cases) | home, `/partners` | links hidden, files not deployed |
| Hero illustration sign-off toast "Priya Raman, CPA" (a demo accountant) | `src/components/illustrations/HeroSystem.astro` | home hero | shows "Your CPA" |

## 2. Still public — needs manual review (not flagged as invented, but not verified by this audit)

These are not marked as demo data in the repository, so they stay on the production site. Confirm or correct them.

| Item | Location | Note |
| --- | --- | --- |
| Operator "JITO LTD, a company registered in Cyprus" and "Evenmont is a registered business name of JITO LTD" | `settings.legal.legalName`, `country`; footer, `/legal`, JSON-LD `legalName`, `llms.txt` | Not in `demo.fields`, so treated as real. Confirm. |
| Mailboxes hello@ / security@evenmont.com | `settings.contact` | DEMO-CONTENT.md asks to confirm they exist. Production forms and booking now rely on hello@. **Check that mail is received.** |
| Prices, fees, timelines, guarantees, capacity ("4 new projects per quarter", "2 white-label projects") | `src/content/terms.json` (⚑ "to be confirmed") | Shown on home, scenario pages, partners. Not used in JSON-LD (no `Offer` prices). |
| "Two founders", "We moved our own company to Odoo first", "We built a software company…", "Europe-based" | `/about` (`src/pages/about.astro`), `Founders.astro` | Company story listed as invented copy in DEMO-CONTENT.md §4. Confirm wording. |
| Scenario FAQ answers and the comparison table | `src/content/faq/*.json`, `terms.json → comparison` | Written from the brand kit; flagged "please review". FAQ answers are also emitted as FAQPage JSON-LD. |
| Illustrative numbers in product mocks ($412,800 sales orders, 38.4% margin, "Good morning, Maya", activity feeds, nine problem screens) | `HeroSystem.astro`, `CompareSlider.astro`, `PainVisual.astro`, `ScreenMock.astro` | UI illustrations, not claims about clients. Keep or replace with real (anonymised) screenshots. |
| Calculator examples, call agenda timings | `Calculator.astro`, `FinalCta.astro` | Illustrative. |
| Stock photos (Pexels) incl. "founders at work" and the Blueprint workshop | `src/content/placeholders.json` | Alt text describes them neutrally; captions such as "A founder on every project" sit on a stock photo. Replace with real photos. |
| Real case "Animal life sciences: order to lab in one day" | `src/content/cases/animal-life-sciences-lab.md` | Marked as a real project under NDA. Confirm the numbers with the delivery team. |
| Readiness checklist and code sample PDFs | `public/downloads/evenmont-odoo-readiness-checklist.pdf`, `evenmont-code-sample.pdf` | No demo names found; still deployed. Review. |

## 3. Kept out of search engines on purpose

| Page | Why |
| --- | --- |
| `/privacy`, `/terms` | Drafts awaiting legal review (`draft` prop on `LegalPage`). `noindex, follow`, not in the sitemap. Remove the `draft` prop once counsel approves: they become indexable automatically. Also remove them from `INTENTIONALLY_NOINDEX` in `scripts/validate-build.mjs`. |
| `/404` | Error page. |

## 4. Not found

- No `{{TOKEN}}` placeholders left in the generated pages.
- No rating, review or `AggregateRating` markup in JSON-LD (the validator rejects it).
