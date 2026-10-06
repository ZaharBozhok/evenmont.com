# Evenmont — Motion & SVG animation spec

## Principles
- **Calm, purposeful, once.** Motion shows things *settling into place* — the brand promise “everything adds up”. No bouncing, no parallax, no infinite loops, no scroll-jacking, no count-up tickers.
- **Cheap to run.** Inline SVG + CSS keyframes/transitions. Animate only `transform`, `opacity`, `stroke-dashoffset`. No animation libraries (no GSAP, Lottie, Framer Motion). All animation JS together < 3 KB gzip: one `IntersectionObserver` that adds `.is-in` to `[data-animate]` elements once (threshold 0.25, `rootMargin: 0px 0px -10% 0px`), then unobserves.
- **Timing:** tokens `--dur-1..4` (150–600ms), `--dur-draw` 900ms, `--stagger` 80ms, easing `--ease-out`; “settle” moments use `--ease-settle` (tiny overshoot).
- **Accessibility:** under `prefers-reduced-motion: reduce` every element renders in its final state immediately (tokens already zero the durations; also skip the JS class toggling and set final styles). Decorative SVGs get `aria-hidden="true"`; meaningful ones get `<title>`.
- **No layout shift:** animated elements reserve their final size; draw-ins use `pathLength="1"` + `stroke-dasharray: 1; stroke-dashoffset: 1 → 0`.
- **Colors come from tokens** (`currentColor`, `var(--rule)`), so every animation re-skins automatically in the partner mood.

## Catalogue

| # | Where | Animation | Details |
| --- | --- | --- | --- |
| 1 | Hero, first load | **Logo settle** | Mark only (inline SVG of `evenmont-mark`): the two peaks rise 6px → 0 with fade (400ms, stagger 80ms), then the level line scales X 0 → 1 from the left and settles (`--ease-settle`, 500ms). Once per session (`sessionStorage`). Header logo is static. |
| 2 | Hero illustration | **Many → one** | 5–6 thin lines (1.5px, `--on-dark-muted`) start at labeled chips — “Spreadsheets”, “CRM”, “Accounting”, “Inventory”, “Email”, “Time tracking” — curve and merge into one thick Evergreen/Sand line that ends at an Amber sum mark. Lines draw in with stagger 80ms (900ms each), chips fade in first. Use generic labels, no third-party logos. Static SVG fallback. Mobile: vertical composition, 4 lines. |
| 3 | Headlines & key numbers | **Sum line draw** | Double underline under the key phrase/number: two rects scale X 0 → 1 from left, second one 120ms later (400ms each). Component: `<SumLine>`. |
| 4 | Ledger grid | **Grid fade** | Hairline rules in hero/pricing backgrounds fade from 0 → 7% opacity over 600ms. No movement. |
| 5 | “Sound familiar?” switcher | **Scenario icons draw** | Each tab has a 24px line icon (services: clock + invoice; distribution: box + arrows; manufacturing: gear + workbench). On select: icon strokes redraw (400ms), cards cross-fade (150ms out / 250ms in, translateY 8px → 0). |
| 6 | Before → after table | **Row resolve** | Row by row (stagger 80ms): the “Today” cell dims to `--text-muted`, a small arrow draws, the “With Evenmont” cell fades in. |
| 7 | Cases cards | **Hover lift** | translateY(-2px) + sum line under the headline number draws on hover/focus (desktop only). |
| 8 | Cost of chaos | **Result update** | On input: result fades (150ms) and a horizontal bar scales X to the new value (250ms). Numbers change instantly — no ticking counters. |
| 9 | How we work | **Timeline draw** | A single path connects the 5 steps (horizontal ≥ 1024px, vertical on mobile). Each segment draws when its step enters the viewport; the step dot fills with the accent color. Not tied to scroll position — just triggered in view. |
| 10 | With your accountant | **Spirit level** | A capsule (spirit level) sits between the two columns; the bubble slides in from the right and settles exactly in the center (`--ease-settle`, 700ms). Label under it: “Balanced.” |
| 11 | Guarantees | **Checkmarks draw** | Check icons draw (300ms, stagger 80ms). |
| 12 | Final CTA (Evergreen) | **Quiet peaks** | Large mark outline at 6% opacity in the background; the level line draws once when in view. |
| 13 | Partners hero | **Two columns, one total** | Two short ledger columns (“Your firm” / “Evenmont”, 3 rows of neutral values like “Books ✓”, “System ✓”) fade up; then one Cobalt double line draws across both; then a single “Balanced” label appears. No fake money figures. |
| 14 | Partners risks table | **Shield checks** | Each row's icon draws as it enters (stagger 60ms). |
| 15 | White-label hero (dark) | **Blueprint grid + layers** | Faint Sky grid (8% opacity) draws in; two stacked cards: “Your brand” card slides over the “Evenmont” card (translateX 12px → 0) — we stay invisible. |
| 16 | Buttons & links | **Micro** | Arrow in text links/buttons nudges 3px on hover; press state scales 0.98. Focus ring always visible. |

## Implementation notes
- Keep each illustration a hand-written inline SVG (< 4 KB). Use `viewBox`, no fixed width/height; size with CSS.
- Pattern for draw-ins:
  ```css
  [data-animate] .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
  [data-animate].is-in .draw { stroke-dashoffset: 0; transition: stroke-dashoffset var(--dur-draw) var(--ease-out); }
  ```
  with `pathLength="1"` on each path, and `transition-delay: calc(var(--i) * var(--stagger))` for staggering.
- Hero animation must not delay LCP: the H1 text is the LCP element and is never hidden or animated.
- Pause everything off-screen (nothing loops anyway). Test on a mid-range Android phone.
