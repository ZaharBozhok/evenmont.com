# Evenmont — Site structure & content

Conventions
- `{{LIKE_THIS}}` = value the team will provide (legal numbers, links, names). Keep as visible placeholders.
- ⚑ = business term to be confirmed (prices, fees, timelines). Build it as editable content, not hard-coded text.
- All copy is a strong first draft in US English. Keep the voice rules from `01-brand-guide.md`.
- Moods: **client** = default (`:root`), **partner** = `data-mood="partner"`, **partner-dark** = `data-mood="partner-dark"`.

## 1. Sitemap

| Route | Page | Mood | Main action |
| --- | --- | --- | --- |
| `/` | Home | client | Book a fit call |
| `/services` | Scenario: services & projects | client | Book a fit call |
| `/distribution` | Scenario: distribution & e-commerce | client | Book a fit call |
| `/manufacturing` | Scenario: light manufacturing | client | Book a fit call |
| `/cases` | Case studies index (filter by scenario) | client | Read a case |
| `/cases/[slug]` | Case study (template) | client | Book a fit call |
| `/about` | Who we are | client | Book a fit call |
| `/security` | Security & data | client | Book a fit call |
| `/book` | Book a fit call | client | Booking / short form |
| `/partners` | Partner program for accountants, CPAs, fractional CFOs | partner | Book a partner intro |
| `/partners/white-label` | White-label Odoo delivery for agencies & integrators | partner-dark | Send us a scope |
| `/legal` | Legal notice | core (neutral) | — |
| `/privacy`, `/terms` | Privacy policy, Terms | core | — |
| `404` | Not found | client | Back home |

## 2. Global components

**Header — client mood.** Logo (`evenmont-logo.svg`) · nav: Services, Distribution, Manufacturing, Cases, Pricing (`/#pricing`), For partners · primary button “Book a fit call”.
Mobile: logo + compact “Book a call” button + menu button; menu opens a full-screen sheet; after the hero, a sticky bottom bar with the primary button appears (hide it when the footer CTA is visible).

**Header — partner mood.** Logo (`evenmont-logo-partner.svg`, reverse version on dark) · nav: How it works, What you get, Risks, CPA rules, FAQ · text link “For businesses →” · primary button “Book a partner intro” (`/partners`) or “Send us a scope” (`/partners/white-label`).

**Footer — all pages** (neutral core styling in the page's mood).
- Logo with descriptor. Short line: “Everything adds up.”
- Columns: Solutions (Services, Distribution, Manufacturing) · Company (How we work `/#process`, Cases, About, Security & data) · Partners (Partner program, White-label) · Legal (Legal notice, Privacy, Terms).
- Legal line: “Evenmont is a registered business name of JITO LTD, a company registered in Cyprus (reg. no. {{JITO_REG_NO}}; business name reg. no. {{BN_REG_NO}}; VAT {{VAT_NO}}). Registered office: {{REGISTERED_OFFICE}}. Contact: {{EMAIL}}.”
- “Odoo is a trademark of Odoo S.A.” + slot for the official Odoo partner badge `{{ODOO_PARTNER_BADGE}}` (placeholder box until the team adds the official file).

**Reusable components:** Button (primary / secondary outline / text link with arrow) · Sum line (double underline, draws in) · Scenario switcher (accessible tabs: Services / Distribution / Manufacturing) · Before→after table · Case card · Package card · Timeline (5 steps) · FAQ accordion (`<details>` based) · Trust strip · Founder card · Comparison table · Forms (fit call, partner intro, white-label scope) · Placeholder image component.

**Forms.** Labels above fields, 48px fields, inline errors (text + color), honeypot field, no CAPTCHA by default. Submit to `{{FORM_ENDPOINT}}` (will become the Odoo website form/CRM). Success state in place, no page reload.
- Fit call: name, work email, company, scenario (select), team size (select: 1–10, 11–50, 51–200, 200+), what you use today (short text), message (optional).
- Partner intro: name, firm, role (CPA / bookkeeper / fractional CFO / other), number of clients (select), email, how you'd like to work (referral / co-delivery / not sure).
- White-label scope: name, company, email, Odoo version, what you need (textarea), timeline, NDA needed (checkbox).

## 3. Home `/` (client mood)

1. **Hero** (Evergreen background, ledger-grid lines, “many → one” illustration)
   - Eyebrow: “Finance-first Odoo implementation”
   - H1 (display): “Sales, inventory, projects and books. One system. Everything adds up.” (sum line under “Everything adds up.”)
   - Sub: “We implement Odoo for growing US companies — service firms, distributors and manufacturers. Fixed-price phases, your accountant in the loop, and a founder on every project.”
   - Primary: “Book a 30-min fit call” → `/book`. Secondary: “See pricing” → `#pricing`.
   - Micro-line under buttons: “No sales pitch. If Odoo isn’t right for you, we’ll say so.”
   - Scenario chips (set the scenario switcher below): “We sell services” · “We sell products” · “We make products”.
2. **Trust strip:** “Certified Odoo consultants” · Odoo partner badge slot · “Built with your accountant” · “Fixed-price phases” · client logos from cases (placeholders).
3. **Sound familiar?** (scenario switcher; 3 cards per scenario)
   - Services: “You find out a project lost money after it’s over.” · “Contractor invoices hide in email threads.” · “Month-end close is a spreadsheet marathon.”
   - Distribution: “The system says 40. The shelf says 12.” · “We oversold on Amazon again.” · “Inventory and the books never match at month-end.”
   - Manufacturing: “The production plan lives on a whiteboard.” · “We don’t know what a unit really costs us.” · “A recall would take us a week to trace.”
4. **What changes** — before→after table + “many → one” diagram
   | Today | With Evenmont |
   | --- | --- |
   | Twelve tools, copy-paste between them | One system, every number entered once |
   | Profit per project or product is a guess | Live margin by project, product and customer |
   | Stock counts nobody trusts | Real-time inventory with barcode scanning |
   | Production planned on a whiteboard | Work orders, bills of materials and real unit costs |
   | Contractors paid from email | Rates, timesheets, invoices and payouts in one flow |
   | Close drags on | Close without spreadsheet marathons, together with your accountant |
5. **Cases** — H2 “Companies like yours, on even ground.” 3 case cards filtered by the current scenario + “All case studies →”. (Content from `/cases`; placeholders for now.)
6. **Cost of chaos calculator** — H2 “What the spreadsheets really cost.” Inputs: people doing manual work (default 4), hours per person per week (default 5), loaded hourly cost $ (default 45). Output: hours per year and $ per year (`people × hours × 48 weeks × rate`), with a sum line under the result. Note: “A rough estimate. We measure the real number in your Blueprint.” CTA: “Book a fit call”.
7. **Three scenarios** — H2 “Built for how you make money.” 3 cards linking to scenario pages:
   | Scenario | Typical Odoo apps | Outcome |
   | --- | --- | --- |
   | Services & projects | CRM, Sales, Project, Timesheets, Accounting, our contractor module | Margin by project, invoices from hours, contractor payouts |
   | Distribution & e-commerce | Sales, Purchase, Inventory, Barcode, Accounting, eCommerce + connectors | Accurate stock, real unit costs, faster shipping |
   | Light manufacturing | Everything in distribution + Manufacturing, Quality | Unit costs, production plan, lot traceability |
   Line under cards: “For every scenario: migration from QuickBooks and spreadsheets, accounting set up with your accountant, integrations (Avalara, payments, storefronts), custom modules, client portals and mobile apps, training, managed Odoo.”
8. **Why Odoo** — comparison table (columns: QuickBooks + apps · NetSuite · Separate inventory tool · Odoo with Evenmont; rows: one system for sales, operations and books; typical cost to run; time to go live; flexibility for your process; who sets up the books). Keep claims qualitative (“low / high”, “weeks / months”), no competitor prices. Honest line: “Odoo isn’t for everyone. On the first call we’ll tell you if it’s not a fit.”
9. **How we work** (`id="process"`) — timeline:
   | Step | What you get | Time ⚑ | Price ⚑ |
   | --- | --- | --- | --- |
   | 1. Fit call | An honest answer: is Odoo right for you? | 30 min | Free |
   | 2. Blueprint | Process map, baseline metrics, scope, fixed project price | 1–3 weeks | Fixed, credited to the project |
   | 3. Build | Configuration in phases, a demo every week | 1–3 months (services), 2–6 (inventory & manufacturing) | Fixed per phase |
   | 4. Go-live | Launch, team training, 30 days of hypercare | 30 days | Included |
   | 5. Keep | Managed Odoo: support, updates, improvements | Monthly | Retainer |
   Note: “90 days after go-live we measure results against your Blueprint numbers.”
10. **With your accountant** — H2 “Built with your accountant, not around them.” Two columns — Your accountant: owns the chart of accounts, signs off on the setup, keeps advising. Evenmont: builds and integrates the system, migrates data, trains the team, supports it. Spirit-level animation between them. Link: “Are you an accountant? See the partner program →” `/partners`.
11. **Pricing** (`id="pricing"`) — H2 “Clear prices, before you commit.” Package cards ⚑:
    | Package | For | Includes | From |
    | --- | --- | --- | --- |
    | Fit Call | Everyone | 30 minutes, honest assessment | Free |
    | Blueprint | Ready to move | Process review, baseline metrics, plan, fixed price | $1,500 |
    | Launch · Services | Service companies | CRM, projects, timesheets, accounting, contractors, QuickBooks migration | $9,500 |
    | Launch · Products | Distribution & e-commerce | Sales, purchasing, inventory, barcode, accounting, storefront connection | $15,000 |
    | Launch · Make | Light manufacturing | Everything in Products + bills of materials, work orders, unit costs | $25,000 |
    | Custom | Complex processes | Integrations, custom modules, client portal | After Blueprint |
    | Keep | After go-live | Support, updates, improvements | $750/month |
    Note: “Odoo licenses are billed separately by Odoo.”
12. **Guarantees** — H2 “Our promises, in writing.” ⚑ (each must exist in the contract)
    - “Fixed price per phase. If we underestimate, that’s on us.”
    - “Stop after any phase. You pay only for what’s delivered.”
    - “Your code, your data, full documentation. No lock-in.”
    - “Your Blueprint fee is credited toward the project.”
    - “30 days of hypercare after go-live.”
    - “90 days after go-live, we measure results against your Blueprint numbers.”
13. **Check us before you call** — certifications (links `{{CERT_LINKS}}`), Odoo partner status, 60–90s founder video (placeholder poster + play button), reviews (`{{CLUTCH_URL}}` placeholder), “Ask for a reference call”, sample SOW & weekly report (download placeholders), link to `/security`.
14. **Not a fit (yet)** — “You need validated manufacturing for pharma or medical devices.” · “You run several plants and need advanced production scheduling.” · “You’re looking for the cheapest hourly developer.” · “You want to go live next week without your team’s time.”
15. **Who we are** — two founder cards (photo placeholder, `{{FOUNDER_1_NAME}}`, role, 2 lines each). Copy: “Two founders, both on your project. We moved our own company to Odoo first. Europe-based, with daily overlap with US business hours.” + “We take on {{N}} new projects per quarter.” ⚑ Link: “More about us →” `/about`.
16. **FAQ** (accordion)
    - How much does Odoo cost in total? — Two parts: Odoo licenses, billed by Odoo per user, and our fixed implementation fee. You get both numbers after the Blueprint, before you commit to the build.
    - How long does implementation take? — Typically 1–3 months for service companies and 2–6 months with inventory or manufacturing. The Blueprint gives you a dated plan.
    - Will we lose our QuickBooks history? — We migrate what your accountant needs — customers, vendors, items, opening balances and history — and agree the cutover date with them.
    - Does it handle US sales tax? — Yes. Odoo calculates sales tax, and we can connect Avalara for multi-state rules. We have set this up for US companies before.
    - Can our accountant keep working the way they do? — Yes. They own the chart of accounts and sign off on the setup. We can train their team too.
    - How do you set up inventory valuation and COGS? — Together with your accountant: costing method, landed costs and valuation accounts are agreed in the Blueprint.
    - Can you connect our storefront and marketplaces? — In most cases, yes. We confirm the connectors and any custom work during the Blueprint.
    - What barcode scanners do we need? — Standard USB or Bluetooth scanners and mobile devices work. We recommend hardware in the Blueprint.
    - What if the project goes over budget? — Each phase has a fixed price. If we underestimate, that’s on us. Scope changes are quoted before any work starts.
    - You’re in Europe — how do meetings work? — Calls and demos happen during US business hours, and you get a written update every week.
    - Who owns the code and the data? — You do. Full documentation, no lock-in.
    - What happens after go-live? — 30 days of hypercare, then optional managed Odoo (Keep) for support, updates and improvements.
17. **Final CTA** (Evergreen) — H2 “Let’s see if everything adds up for you.” Primary “Book a 30-min fit call”. Secondary text link: “Not ready to talk? Get the Odoo readiness checklist” (email capture placeholder).

## 4. Scenario pages `/services`, `/distribution`, `/manufacturing` (one template)
Sections: Hero (scenario H1 + sub + CTA) → 3 pains → before/after (scenario rows) → What we set up (apps + integrations) → Cases (filtered) → How we work (compact 5 steps) → Scenario package + Keep → Scenario FAQ → Final CTA.

| | Services & projects | Distribution & e-commerce | Light manufacturing |
| --- | --- | --- | --- |
| H1 | “Projects, hours, contractors and books — in one system.” | “Inventory that matches the books.” | “Your production plan, off the whiteboard.” |
| Sub | For agencies, consultancies, IT and professional services firms. See margin by project, bill from timesheets, pay contractors without spreadsheets. | For wholesalers, importers and e-commerce brands with their own warehouse. Real-time stock, real unit costs, faster shipping — with your accountant in the loop. | For assembly and make-to-order manufacturers. Bills of materials, work orders, real unit costs and lot traceability — connected to sales and the books. |
| Outcomes | Live project margin · invoices from approved hours · contractor rates, invoices and payouts in one flow · faster close | Stock accuracy with barcode scanning · landed costs in unit cost · reorder rules from real sales · one stock count for every channel · automated sales tax | Unit cost roll-up · work orders and capacity · lot/serial traceability · quality checks · purchasing driven by demand |
| Apps | CRM, Sales, Project, Timesheets, Accounting, Recruitment, Website, our contractor module | Sales, Purchase, Inventory, Barcode, Accounting, eCommerce, connectors, Avalara | Manufacturing, Quality, Inventory, Barcode, Purchase, Sales, Accounting |
| Package ⚑ | Launch · Services from $9,500 | Launch · Products from $15,000 | Launch · Make from $25,000 |
| FAQ | How do timesheets turn into invoices? · Can Odoo handle retainers and milestone billing? · How do contractor payouts work? · Can we keep our payroll provider? | Do we need to stop shipping during go-live? · How do you handle the first stock count? · Which marketplaces can you connect? · How are landed costs calculated? | Can you import our bills of materials? · How is unit cost calculated? · Do we need tablets on the shop floor? · How do we go live without stopping production? |
Manufacturing page also repeats the “Not a fit (yet)” note for validated pharma/medical devices and multi-plant scheduling.
Write short, honest FAQ answers in the brand voice; anything project-specific: “We confirm this in the Blueprint.”

## 5. Cases
**`/cases` index:** H1 “Case studies”, filter chips (All · Services · Distribution · Manufacturing), grid of case cards. Until real cases exist, show 3 placeholder cases (one per scenario) with `placeholder: true` and a visible “Sample” label in development builds.

**Case card fields:** scenario · company profile (“Distribution · 35 people · Texas”) · headline result with a number · one-line before→after · apps & integrations · time & model (“Live in 10 weeks · fixed-price phases”) · quote (photo, name, role) · “Read the story →”.

**Case page template `/cases/[slug]`:** 1) result headline with a number and sum line · 2) snapshot (industry, size, state, apps, integrations, timeline, pricing model) · 3) Before: situation and pains in the client’s words · 4) Why they chose us · 5) What we did, by phase — including the accountant’s role · 6) Results: before/after table with measurement dates · 7) Quote from the owner or COO · 8) Screenshots with blurred data (placeholders) · 9) What’s next (support, next phases) · 10) CTAs: “Book a fit call” and “Talk to this client” (only if `referenceCall: true`).

Store cases as content files (Markdown + frontmatter) so the team can add them without touching code.

## 6. About `/about`
H1 “Two founders. One system. Every number adds up.” Story: we built and ran a software company, moved it onto Odoo ourselves, and now do the same for US companies — finance-first and together with their accountant. Name story: “Even — books that balance. Mont — ground that holds.” Founder cards (placeholders), how we work (fixed phases, weekly demos, written updates, US-hours overlap), values: Precision · Candor · Ownership · Calm (one line each), legal entity line (same as footer), CTA.

## 7. Security & data `/security`
Where your data lives (Odoo.sh or your own server — your choice) · who has access (named accounts, least privilege, MFA, access removed after the project) · backups and restore test before go-live · NDA on request · GDPR: as an EU-based company we process personal data in line with GDPR · contact for security questions `{{SECURITY_EMAIL}}`.

## 8. Book `/book`
H1 “Book a 30-minute fit call.” What happens on the call: we learn how you work · we tell you honestly if Odoo fits · you leave with next steps, even if we’re not the right partner. Embed or link the booking page `{{BOOKING_URL}}` (Odoo Appointments). Fallback: the fit call form. Show time-zone note: “Calls run during US business hours.”

## 9. Partner program `/partners` (partner mood, light)
1. **Hero** (Night band): eyebrow “Partner program for CPAs, bookkeepers and fractional CFOs” · H1 “Recommend Odoo with confidence. You keep the books — we build the system.” · sub “Refer a client or co-deliver with us. Fixed-price phases, no quotas, no fees to join — and your client stays your client.” · primary “Book a 20-min partner intro” · secondary “Get the partner one-pager” (PDF placeholder). Illustration: “two columns, one total”.
2. **The problem:** your clients outgrew QuickBooks · inventory doesn’t match the books · cleanup eats your hours · “Which system should we use?” has no good answer.
3. **Two ways to work** (cards):
   | | Referral | Co-delivery |
   | --- | --- | --- |
   | You | Introduce us to a client | Own the accounting part: chart of accounts, opening balances, close process |
   | We | Sell, implement, support | Do all the technical work |
   | Client relationship | Books and advice stay with you | Same |
   | Who invoices the client | Evenmont | Each of us for our own part |
   | You earn | Referral fee — or the same amount as a discount for your client | Your own hours at your own rate |
4. **What you get** ⚑: 10% of the client’s fees in the first 12 months, paid within 30 days after the client pays — or passed to your client as a discount · free Odoo accounting training for your team · ready materials (client one-pager, referral email template, written disclosure template) · deal registration protects your introduction for 12 months · project and payout status in a partner portal · referrals back to you when our clients need an accountant or CFO · one founder as your single point of contact.
5. **What you don’t risk** (central block, table “Your concern → How we handle it”):
   - “If the project fails, my reputation suffers.” → Fixed-price phases, a founder on every project, weekly demos, you see the status.
   - “You’ll take my client.” → We never do bookkeeping, tax or financial advisory; non-solicit clause in the agreement.
   - “I’ll get dragged into tech support.” → Technology, training and support are fully on us.
   - “I might break CPA ethics rules.” → Written disclosure, attest-client option, fee-as-discount option.
   - “It will take my time.” → No quotas, no minimums, no mandatory training; a handoff takes 15 minutes.
   - “I’ll be locked in.” → Free to join, no exclusivity, leave any time.
   - “Who gets credit for the client?” → Deal registration, scheduled payouts, transparent statements.
   - “My client’s data could be at risk.” → NDA, least-privilege access, hosting on Odoo.sh or the client’s server.
   - “I’ll be liable if something goes wrong.” → The client signs the implementation contract with us, not with you.
6. **Built for CPA rules:** “Designed around AICPA rules on referral fees: written disclosure for every fee, and a no-fee option for attest clients. State rules can be stricter — our agreement asks you to confirm yours.” Link placeholder `{{CPA_RULES_NOTE_URL}}`.
7. **How it works:** Apply → 20-min intro → one-page agreement → first client → payout.
8. **Economics example** (illustration, not a promise) ⚑: service client pays $12,000 (Launch · Services) + $750 × 6 months (Keep) = $16,500 → your fee $1,650. Distributor pays $15,000 + $750 × 6 = $19,500 → $1,950. Co-delivery: your own hours at your own rate.
9. **What your client gets:** short version of the client promise + link to `/` and “Download the client one-pager”.
10. **Proof for partners:** co-delivery cases with an accountant quote (placeholders) · sample partner agreement and sample payout statement (downloads) · partner list (with permission) · the founder who runs partnerships (photo, name) · “We reply within one business day.” ⚑
11. **FAQ:** Do I need to know Odoo? · Will you do bookkeeping for my client? · How is the fee paid and disclosed? · What if my client is an attest client? · What if the project goes wrong? · Can I refer clients who aren’t ready yet? · Do you work with QuickBooks Online clients? · I’m already in Odoo’s program for accounting firms — why you? (You advise, we implement.)
12. **Apply** — partner intro form + booking button. Link: “For businesses →” `/`.

## 10. White-label `/partners/white-label` (partner-dark mood)
1. **Hero:** eyebrow “White-label Odoo delivery for agencies and Odoo partners” · H1 “Your brand. Our certified Odoo team.” · sub “Custom modules, integrations, migrations and US accounting setup — delivered under your name, inside your process.” · primary “Send us a scope” · under it: “Fixed quote before you send your proposal.”
2. **When teams call us:** overloaded delivery team · custom modules · integrations · migrations · US accounting & sales tax setup · rescuing stuck projects.
3. **Inside your process:** your tools and tracker · daily async updates · code review · documentation · Odoo coding guidelines.
4. **Risks you don’t carry:** “We’ll be exposed to your client” → we work under your brand, from your email and channels; NDA · “You’ll poach the client” → non-solicit; direct contact only with your permission · “Code quality” → code review, tests, documentation · “IP” → all code is assigned to you or your client · “Deadlines” → fixed price and dates before start, daily updates · “Hiring for peaks” → no headcount, capacity per project.
5. **Commercials** ⚑: fixed price per scope or a monthly capacity block; payment by milestones.
6. **Honest capacity** ⚑: “We take {{N}} white-label projects at a time — currently up to two people per project.”
7. **Proof:** modules in the Odoo Apps Store (placeholders), code samples, certifications, white-label cases with the agency’s permission.
8. **FAQ + scope form.**

## 11. Legal pages (core styling)
- `/legal` — Legal notice: operator JITO LTD, Cyprus company reg. no. {{JITO_REG_NO}}, business name “Evenmont” reg. no. {{BN_REG_NO}}, registered office {{REGISTERED_OFFICE}}, VAT {{VAT_NO}}, email {{EMAIL}}, directors {{DIRECTORS}}. Odoo trademark notice.
- `/privacy`, `/terms` — page skeletons with headings and a clear “Content to be provided” placeholder. Do not invent legal text.

## 12. SEO basics per page
Unique `<title>` (≤ 60 chars) and meta description (≤ 155 chars), canonical URL, Open Graph + Twitter tags (`brand/social/og-image.png`; partners pages use `og-image-partners.png`), `lang="en-US"`. JSON-LD `Organization` on every page: name “Evenmont”, legalName “JITO LTD”, url, logo, sameAs `{{SOCIAL_LINKS}}`. `sitemap.xml`, `robots.txt`, clean 404.
