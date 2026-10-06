# Demo content — what is invented, and where to replace it

For the CEO preview the site is filled end to end, so the structure and the final look are clear.
**Everything below is invented** (companies, people, numbers, quotes, legal details). Nothing here
is a real client, a real result or a real claim yet. Replace each item with real, approved content
before launch. `npm run build` prints the open list every time.

The site is in **pre-release mode** (`settings.prerelease: true` in `src/content/settings.json`):
every page carries `<meta name="robots" content="noindex, nofollow">` and `robots.txt` disallows
everything, so nothing can be indexed by accident. Set it to `false` at launch.
(`PRERELEASE=false npm run build` makes a one-off launch-mode build without touching the file.)

## 1. Case studies — `src/content/cases/*.md` (`demo: true`)

Six fictional clients, two per scenario. Each file has the company, profile, headline result,
before/after, apps, timeline, a quote, a results table with dates, screens and the story.

| File | Company (fictional) | Scenario | Headline result | Quote from |
|---|---|---|---|---|
| `fieldwork-collective.md` | Fieldwork Collective — environmental consulting, 42 people, Denver CO | Services | 3 days to close the month (was 11) | Maya Castellanos, COO · accountant quote: Priya Raman, CPA, Raman & Ellis CPAs |
| `ridgeway-engineering.md` | Ridgeway Engineering — civil engineering, 65 people, Portland OR | Services | $214k unbilled work recovered | Sarah Lindgren, Managing Partner |
| `copperline-home-goods.md` | Copperline Home Goods — home & kitchen, 35 people, Austin TX | Distribution | 99.2% stock accuracy | Daniel Okafor, Founder & CEO · accountant quote: Marcus Hale, CPA, Northgate Accounting Group |
| `harbor-supply.md` | Harbor Supply Co. — industrial supplies, 48 people, Cleveland OH | Distribution | −31% dead stock | Rachel Novak, Operations Director |
| `tallis-woodworks.md` | Tallis Woodworks — custom furniture, 58 people, Asheville NC | Manufacturing | +11 pts gross margin | Greg Lindqvist, Owner |
| `kestrel-signworks.md` | Kestrel Signworks — signage & fabrication, 30 people, Phoenix AZ | Manufacturing | 45 min to quote (was 2 days) | Luis Ortega, Founder |

To replace: edit the file with the real case (or delete it and add a new one), then remove
`demo: true`. The quotes also feed **"What clients wrote"** on the home page (cases 4–6 by
`order`) and the **co-delivery quotes** on `/partners` (cases with `coDelivery` + `accountantQuote`).

## 2. Site settings — `src/content/settings.json`

Every invented value is listed in `demo.fields`; remove a key from that list once it's real.

| Setting | Demo value | Replace with |
|---|---|---|
| `legal.regNo` / `businessNameRegNo` / `vatNo` | HE 432178 / BN 118904 / CY 10432178X | Real JITO LTD registration numbers |
| `legal.registeredOffice` | 41 Griva Digeni Avenue, 3036 Limassol, Cyprus | Real registered office |
| `legal.directors` | Alex Kovac, Elena Sorel | Real directors |
| `contact.phoneUs` | +1 (646) 555-0142 (a 555 fictional number) | Real US number |
| `contact.email` / `securityEmail` | hello@ / security@evenmont.com | Confirm the mailboxes exist |
| `founders` | Alex Kovac, Elena Sorel — names, roles, bios | Real founders; add portraits (see §5) |
| `partnerContact.name` | Elena Sorel | The founder who runs partnerships |
| `odooPartnerBadge` | "Odoo Ready Partner" (text badge) | The real partnership level; swap in Odoo's badge artwork in `src/components/PartnerBadge.astro` |
| `links.bookingUrl` / `partnerBookingUrl` | `demo` → in-page slot picker on `/book` | The Odoo Appointments URL (the page then shows the real calendar, click-to-load) |
| `links.formEndpoint` | `demo` → forms simulate success in the browser, **nothing is sent** | The real form endpoint |
| `links.founderVideoUrl` | `demo` → the poster opens the video script in a dialog | The video URL |
| `links.certLinks` | Odoo's partner directory (generic) | The link to your consultants' certifications |
| `links.odooAppsStoreUrl` | Odoo Apps Store (generic) | Your publisher page on the Apps Store |
| `links.clutchUrl` | `/#reviews` (the reviews on the home page) | A review profile (Clutch, G2 …) when you have one |
| `links.codeSamplesUrl` | `/downloads/evenmont-code-sample.pdf` | A public repo or keep the PDF |
| `links.socialLinks` | empty (hidden) | LinkedIn etc. |
| `partnerFirms` | 4 fictional accounting firms | Firms that agreed to be listed |
| `whiteLabelCases` | 2 anonymized agency cases | Real white-label cases (with the agency's permission) |
| `proof.rating` | **4.9 from 32 reviews on Clutch** — hero proof line, trust card, “What clients wrote”, `/cases` hero | The real score, count and source (and link the profile in `links.clutchUrl`) |
| `proof.certifications` | Three seals: Odoo Ready Partner · 4 functional consultants · 2 technical consultants (trust card) | Real partnership level and certification counts; the official Odoo badge file |
| `proof.stats` | 40+ projects · 96% on the fixed price · 3 days median close · 12 US states (`/about` numbers band) | Real, verifiable numbers — or remove the band |

## 3. Business terms — `src/content/terms.json`

Filled for the preview: `projectsPerQuarter` = **4**, `whiteLabelProjects` = **2**. All other
prices, fees and timelines come from the brief and are still ⚑ to confirm.

## 4. Pages and components with invented copy

| Where | What |
|---|---|
| Home hero illustration (`HeroSystem.astro`) | Dashboard numbers ($412,800 sales orders, 38.4% gross margin …) and the sign-off toast “Priya Raman, CPA — Signed off the September close” |
| “Sound familiar?” screens (`PainVisual.astro`) | Nine small problem screens with demo figures and annotations (“Found 34 days after close”, “Day 11 of the close” …) |
| “What changes” slider (`CompareSlider.astro`) | Both scenes: the spreadsheet `Margins_Q3_v12_FINAL.xlsx`, inbox and chat on the left; the dashboard (38.4% margin, Day 3 close, 99.2% stock accuracy, “Good morning, Maya”, the activity feed) on the right |
| Calculator (`Calculator.astro`) | “Where those hours usually go” examples |
| Guarantees (`Guarantees.astro`) | The founders’ signatures (drawn SVG placeholders) |
| Founders (`Founders.astro`) | Working hours: Evenmont 3 am–1 pm ET (10:00–20:00 in Limassol), overlap 9 am–1 pm ET |
| Final CTA (`FinalCta.astro`) | The call agenda split into 0–10 / 10–20 / 20–30 min (the three steps from `/book`) |
| `/about` | The three-step story (“We built a software company …”) and the numbers band (`proof.stats`) |
| Product screens (`ScreenMock.astro`) | Project names, people, orders and costs in the SVG screens |
| Trust strip (`ClientLogo.astro`) | Invented wordmarks for the six demo clients |
| Check us (`CheckUs.astro`) | Founder video script (dialog), "1:20" length |
| `/partners` | Accountant quotes (from the demo cases), partner firm list, the one-line notes under “The problem” |
| `/partners/white-label` | Two anonymized white-label cases |
| `/privacy`, `/terms` | **Drafts for legal review** (marked on the page) — must be approved by counsel |
| `/legal` | Uses the demo legal details from settings |

## 5. Images and files

Stock photos (Pexels License) stand in for real photography; every one is listed in
`src/content/placeholders.json` with its source and what to replace it with. New for the preview:
three extra case covers, the founder video poster, and four photos of people at work — the Blueprint
workshop (home “How we work”), the accountant and Evenmont cards (“Built with your accountant”) and
the founders photo (home “Who we are” and `/about`). The founders photo matters most: replace it with
a real photo of both founders.

Founders are shown as initials avatars (no stock faces, on purpose). Add real portraits via
`quote.photo` (cases) and the `Avatar` component.

**PDFs** in `public/downloads/` (9) are generated from the site's data by
`scripts/pdfs/build.mjs`: client and partner one-pagers, a sample SOW and weekly report, the partner
agreement key terms, a payout statement, the CPA rules note, the readiness checklist and a code
sample. The samples use the demo clients and are marked "Sample". Re-run the script after changing
prices or names, or replace the files with real documents.

## 6. Before launch — checklist

1. Replace or delete the six demo cases; remove `demo: true`.
2. Fill the real values for every key in `settings.json → demo.fields`, then empty the list.
3. Real `formEndpoint` and `bookingUrl` (test a real submission).
4. Legal review of `/privacy` and `/terms`; remove the `draft` prop in both pages.
5. Replace stock photos and wordmarks (`placeholders.json`, set `status: "replaced"`).
6. Re-generate or replace the PDFs.
7. Set `prerelease` to `false`, build, and check `robots.txt` allows crawling.
