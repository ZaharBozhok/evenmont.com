# Evenmont — Brand guide for the website

## 1. Who we are (for context)
- **Evenmont** — finance-first Odoo implementation partner for growing US companies (10–200 people) in three scenarios: **services & projects**, **distribution & e-commerce**, **light manufacturing**.
- We work **with the client's accountant**, in **fixed-price phases**, with **a founder on every project**. We run our own company on Odoo.
- Two audiences, two page moods: **clients** (owners, COOs) and **partners** (CPA firms, bookkeepers, fractional CFOs; agencies & Odoo integrators for white-label).
- Legal: Evenmont is a registered business name of **JITO LTD** (Cyprus). The legal entity is mentioned only in the footer, legal pages, contracts and invoices — never in marketing copy.

**Central idea / tagline:** “Everything adds up.”
**Secondary line:** “Business on even ground.”
**Name story (About page):** “Even — books that balance. Mont — ground that holds.”

## 2. Voice & tone
Calm, precise, human. The voice of an experienced operator who has seen this before — not a salesperson.

| Do | Don't |
| --- | --- |
| Numbers instead of adjectives | “Best-in-class”, “cutting-edge”, “seamless”, “revolutionary” |
| Short sentences, plain words | Jargon without explanation (“ERP synergy”, “digital transformation”) |
| Say what's included and what's not | Vague promises, fake urgency, countdown timers |
| “If Odoo isn't right for you, we'll say so.” | Fear-selling (“Your business will fail without…”) |
| Talk about outcomes (margin, stock accuracy, close) | Talk about modules for their own sake |

- Banned mountain clichés: “reach new heights”, “peak performance”, “summit of success”, “scale new heights”.
- Clients: pain → outcome → calm path to it. Partners: numbers → terms → risks → how to start (peer-to-peer, denser).
- Write “Odoo” with a capital O. Never “ODOO”, never “Odoos”.

## 3. Logo
Files: `brand/logo/`. All text is converted to paths (no font dependency).

| File | Use |
| --- | --- |
| `evenmont-logo.svg` | Default, client pages, light backgrounds |
| `evenmont-logo-reverse.svg` | Client pages on Evergreen/dark backgrounds |
| `evenmont-logo-partner.svg` | Partner pages on light backgrounds (Cobalt accent line) |
| `evenmont-logo-partner-reverse.svg` | Partner pages on Night/dark backgrounds (Sky accent line) |
| `evenmont-logo-descriptor*.svg` | Footer, OG images, documents (with “Finance-first Odoo implementation”) |
| `evenmont-mark*.svg` | Icon-only uses, loaders, section motifs |
| `evenmont-wordmark*.svg` | Rare, when the mark is already nearby |
| `evenmont-logo-mono-*.svg` | One-color situations |
| `favicon.svg`, `favicon.ico`, `favicon-16/32/48.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Browser & app icons |

**The mark — “Even Peaks”:** two peaks of equal height with a level line resting on both tops. It means *even mountains* (Even-mont), *debit = credit* (the books balance), and it reads as an **M**. The level line is the only accent-colored element: **Amber** in the client mood, **Cobalt** (light) / **Sky** (dark) in the partner mood.

- Clear space: at least the height of the level line ×3 on all sides (≈ cap height of the wordmark × 0.5).
- Minimum size: horizontal logo 24px tall on screen; mark alone 16px (use favicon tile below 20px).
- Header logo: 28–32px tall on mobile, 32–36px on desktop.
- Don't: stretch, rotate, recolor outside the palettes, add shadows/gradients, place on busy photos, put “Odoo” inside the logo, or combine it with the Odoo partner badge.
- Odoo partner badge: only the official file from Odoo, placed separately (trust strip, footer). Slot is a placeholder until the team adds it.

## 4. Color
Two palettes on one core. Core = Evergreen (logo), Ink (text), fonts, sum-line motif.

### Client mood — Palette A “Evergreen Ledger” (default, `:root`)
| Token | HEX | Role | Contrast |
| --- | --- | --- | --- |
| Evergreen | #0F3D34 | Logo, hero & final CTA background, headings | White 12.1:1 |
| Pine | #1F5C4D | Links, hovers, charts | On Sand 7.0:1 |
| Sage | #DCE7DF | Card/table surfaces | Ink 13.2:1 |
| Sand | #F6F2EA | Page background | Ink 15.0:1 |
| Ink | #14201C | Body text | — |
| Stone | #5F6661 | Muted text | On Sand 5.3:1 |
| Amber | #F2A93B | Primary buttons, sum line, logo accent | Ink on Amber 8.4:1 |

Proportions ≈ 60% Sand · 25% Evergreen+Ink · 10% Sage · 5% Amber.
Rules: **never white text on Amber** (2.0:1). Amber buttons on light backgrounds get a 1px Ink border (Amber vs Sand is only 1.8:1). Amber text only on Evergreen (6.1:1). Hero and final CTA sit on Evergreen — the Amber button pops most there.

### Partner mood — Palette P “Partner Desk” (`[data-mood="partner"]`, `[data-mood="partner-dark"]`)
| Token | HEX | Role | Contrast |
| --- | --- | --- | --- |
| Night | #0C2621 | Partner hero/dark sections; white-label page background | Paper 14.9:1 |
| Evergreen | #0F3D34 | Logo (shared core) | Paper 11.3:1 |
| Cobalt | #2E5BFF | Primary buttons (white text), links on Paper | White 5.2:1; on Paper 4.8:1 |
| Sky | #9DB9FF | Links/accents on dark | On Night 8.2:1 |
| Mist | #E4E7EC | Tables, surfaces | Ink 13.5:1 |
| Paper | #F7F7F4 | Page background (accountants page) | Ink 15.6:1 |
| Slate | #5E6671 | Muted text | On Paper 5.4:1 |

Rules: no Cobalt text on Mist (4.2:1) — use Ink. On dark cards add a 1px Sky edge to Cobalt buttons. No Amber anywhere in the partner mood.

**Never** use Odoo purple #714B67 or teal #017E84 as brand colors, and don't use Inter (Odoo's typeface) — the site must not look like an Odoo page.

## 5. Typography
- **Fraunces 600** (`brand/fonts/fraunces-600-latin.woff2`, static instance: opsz 36, SOFT 50, WONK 0) — H1, H2, hero, big numbers, pull quotes. Never for tables, UI or small text.
- **Manrope 400–700 variable** (`brand/fonts/manrope-var-latin.woff2`) — H3, body, navigation, buttons, forms, tables. Prices and tables use `font-variant-numeric: tabular-nums`.
- Scale (fluid, see tokens): display 40→64, H1 36→56, H2 28→40, H3 20→22 (Manrope 700), lead 18→21, body 17→18, small 15, xs 13.
- Line-height: headings 1.08–1.15, body 1.6. Max line length 68ch. Sentence case everywhere (no ALL-CAPS headings).
- Both fonts are SIL OFL — license files are in `brand/fonts/`.

## 6. Signature motifs
| Motif | Look | Meaning / where |
| --- | --- | --- |
| Sum line | Double underline (2 × 4–6px, accent color) under a key number or phrase | “It all adds up.” Headlines, key numbers, final CTA |
| Ledger grid | Hairline horizontal rules, 1px, 6–8% opacity | Section backgrounds (hero, pricing) |
| Level | Items settling onto one line; a spirit-level bubble settling in the center | Balance; used in the “with your accountant” block |
| Many → one | Several thin lines converging into one thick line | “Twelve tools. One system.” Hero illustration |
| Two columns, one total | Two ledger columns with one shared double line | Partner pages: partnership = two books, one truth |

## 7. Imagery & icons
- Photos (placeholders for now): real people at work, real warehouses/workshops, real screens. Warm, natural light. No handshake stock, no people pointing at screens, no AI-generated faces, no landscapes/mountains/trees (the name already carries the mountain).
- Screens are our main visual genre: product screenshots in a neutral frame with accent-colored annotations.
- Illustrations: line-based, 1.5–2px strokes, Evergreen/Ink + one accent. No isometric 3D, no gradients, no glassmorphism.
- Icons: outline set (Lucide or Phosphor), 1.5px stroke, inline SVG, `currentColor`. No colorful Odoo module icons.

## 8. Accessibility baseline
WCAG 2.2 AA minimum (body text is AAA). Visible focus ring (2px, `--focus`, offset 2px). Status never by color alone. All motion respects `prefers-reduced-motion`. Touch targets ≥ 44px.
