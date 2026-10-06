/**
 * Builds the downloadable PDFs in public/downloads from HTML, with the site's fonts,
 * colors and numbers (read from src/content/terms.json and settings.json).
 *
 * DEMO CONTENT: the sample SOW, weekly report, payout statement and code sample use the
 * fictional preview clients. Replace them with approved real documents before launch.
 *
 *   npm i --no-save playwright-core && node scripts/pdfs/build.mjs
 *   (uses the Chromium that Playwright finds, or CHROMIUM_PATH)
 */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../../', import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), 'utf8');
const terms = JSON.parse(read('src/content/terms.json'));
const settings = JSON.parse(read('src/content/settings.json'));
const v = terms.vars;
const pkg = Object.fromEntries(terms.packages.map((p) => [p.id, p]));
const usd = (n) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
const fee = Math.round(terms.partner.feeRate * 100) + '%';
const fill = (s) => s.replace(/\{(\w+)\}/g, (_, k) => (k === 'feePercent' ? fee : v[k] ?? `{${k}}`));
const font = (f) => new URL(`public/fonts/${f}`, root).href;
const logo = (name) => read(`src/assets/brand/${name}.svg`);
const [f1, f2] = settings.founders;
const email = settings.contact.email;

const css = (accent, dark) => `
@font-face { font-family: Fraunces; src: url(${font('fraunces-600-latin.woff2')}); font-weight: 600; }
@font-face { font-family: Manrope; src: url(${font('manrope-var-latin.woff2')}); font-weight: 400 700; }
@page { size: Letter; margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font: 9.8pt/1.45 Manrope, Arial, sans-serif; color: #14201C; }
.page { position: relative; width: 8.5in; height: 11in; padding: 0 0.7in 0.9in; overflow: hidden; page-break-after: always; }
.page:last-child { page-break-after: auto; }
.band { margin: 0 -0.7in 0.3in; padding: 0.32in 0.7in 0.28in; background: ${dark}; color: #F6F2EA; display: flex; justify-content: space-between; align-items: center; }
.band svg { height: 26px; width: auto; }
.band .tag { font-size: 8.5pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .85; }
h1, h2, .big { font-family: Fraunces, Georgia, serif; font-weight: 600; letter-spacing: -0.01em; color: ${dark}; margin: 0; }
h1 { font-size: 23pt; line-height: 1.1; }
h2 { font-size: 13.5pt; line-height: 1.2; margin-top: 0.2in; margin-bottom: 0.07in; }
h3 { font-size: 10.5pt; margin: 0 0 4px; }
p { margin: 0 0 8px; }
.lead { font-size: 11.5pt; line-height: 1.42; margin-top: 8px; }
.muted { color: #5F6661; }
.sum { display: inline-block; border-bottom: 3px double ${accent}; padding-bottom: 1px; }
.rule { height: 3px; width: 64px; background: ${accent}; border-radius: 2px; margin: 14px 0; }
table { width: 100%; border-collapse: collapse; font-size: 9pt; }
th, td { text-align: left; padding: 5px 8px; border-bottom: 1px solid #DDE3DF; vertical-align: top; }
th { font-size: 8pt; text-transform: uppercase; letter-spacing: .06em; color: #5F6661; }
td.n, th.n { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
tr.total td { font-weight: 700; border-top: 2px solid ${dark}; border-bottom: 0; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.25in; }
.grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.18in; }
.card { border: 1px solid #DDE3DF; border-radius: 10px; padding: 10px 12px; }
.card p:last-child { margin-bottom: 0; }
.cols2 { columns: 2; column-gap: 0.25in; } .cols2 li { break-inside: avoid; }
.card .big { font-size: 18pt; }
ul { margin: 0; padding-left: 16px; } li { margin: 0 0 4px; }
ul.checks { list-style: none; padding: 0; } ul.checks li { padding-left: 18px; position: relative; }
ul.checks li::before { content: "✓"; position: absolute; left: 0; color: ${accent === '#F2A93B' ? '#1F5C4D' : accent}; font-weight: 700; }
ul.boxes { list-style: none; padding: 0; } ul.boxes li { padding-left: 22px; position: relative; margin-bottom: 7px; }
ul.boxes li::before { content: ""; position: absolute; left: 0; top: 2px; width: 11px; height: 11px; border: 1.5px solid ${dark}; border-radius: 3px; }
.pill { display: inline-block; padding: 2px 9px; border-radius: 999px; font-size: 8.5pt; font-weight: 700; background: #DCE7DF; color: #1F5C4D; }
.pill.amber { background: #FBE7C4; color: #14201C; }
.foot { position: absolute; left: 0.7in; right: 0.7in; bottom: 0.4in; display: flex; justify-content: space-between; font-size: 8pt; color: #5F6661; border-top: 1px solid #DDE3DF; padding-top: 8px; }
.stamp { display: inline-block; border: 1.5px solid ${accent}; color: ${dark}; font-size: 8pt; font-weight: 700; letter-spacing: .1em; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
pre { font: 7.6pt/1.36 "DejaVu Sans Mono", Menlo, monospace; background: #F6F2EA; border: 1px solid #E4E1D8; border-radius: 8px; padding: 10px 12px; white-space: pre-wrap; margin: 0 0 12px; }
.sig { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4in; margin-top: 0.3in; }
.sig div { border-top: 1px solid #14201C; padding-top: 6px; font-size: 9pt; }
`;

const page = (inner, { tag = '', foot = 'evenmont.com', n, of } = {}, mood = 'client') => `
<section class="page">
  <div class="band">${logo(mood === 'partner' ? 'evenmont-logo-partner-reverse' : 'evenmont-logo-reverse')}<span class="tag">${tag}</span></div>
  ${inner}
  <div class="foot"><span>Evenmont · ${email} · ${foot}</span><span>${n ? `Page ${n} of ${of}` : 'evenmont.com'}</span></div>
</section>`;

const doc = (pages, mood = 'client') => {
  const accent = mood === 'partner' ? '#2E5BFF' : '#F2A93B';
  const dark = mood === 'partner' ? '#0C2621' : '#0F3D34';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${css(accent, dark)}</style></head><body>${pages}</body></html>`;
};

/* ------------------------------------------------------------------ documents */
const steps = terms.process.steps;
const clientOnePager = doc(page(`
  <style>.page h2 { margin-top: 0.16in; } .page .card .big { font-size: 16pt; }</style>
  <h1>Sales, inventory, projects and books.<br>One system. <span class="sum">Everything adds up.</span></h1>
  <p class="lead">We implement Odoo for growing US companies — service firms, distributors and manufacturers. Fixed-price phases, your accountant in the loop, and a founder on every project.</p>
  <h2>How we work</h2>
  <table><thead><tr><th>Step</th><th>What you get</th><th>Time</th><th class="n">Price</th></tr></thead><tbody>
  ${steps.map((s, i) => `<tr><td><b>${i + 1}. ${s.name}</b></td><td>${fill(s.get)}</td><td>${fill(s.time)}</td><td class="n">${fill(s.price)}</td></tr>`).join('')}
  </tbody></table>
  <h2>Clear prices, before you commit</h2>
  <div class="grid3">
    ${['launch-services', 'launch-products', 'launch-make'].map((id) => `<div class="card"><h3>${pkg[id].name}</h3><p class="muted">${pkg[id].for}</p><p class="big">from ${usd(pkg[id].price)}</p><p class="muted">${pkg[id].includes.join(' · ')}</p></div>`).join('')}
  </div>
  <p class="muted" style="margin:6px 0 0">Blueprint ${usd(pkg.blueprint.price)}, credited to the project · Keep from ${usd(pkg.keep.price)}/month · ${terms.licensesNote}</p>
  <h2>Our promises, in writing</h2>
  <ul class="checks cols2">${terms.guarantees.map((g) => `<li>${fill(g)}</li>`).join('')}</ul>
  <p style="margin-top:0.12in"><b>Two founders, on your project:</b> ${f1.name} and ${f2.name}. <b>Book a ${v.fitCallLong} fit call:</b> evenmont.com/book</p>`, { tag: 'Client one-pager' }));

const eco = terms.partner.economics[0];
const ecoTotal = eco.projectAmount + eco.keepMonths * pkg.keep.price;
const partnerOnePager = doc(page(`
  <h1>Recommend Odoo <span class="sum">with confidence.</span></h1>
  <p class="lead">A partner program for CPAs, bookkeepers and fractional CFOs. Your clients get one system for sales, operations and the books. You keep the relationship — and the books.</p>
  <div class="grid2">
    <div class="card"><h3>Referral</h3><p>You introduce a client. We sell, implement and support. Books and advice stay with you.</p><p><b>You earn</b> ${fee} of the client’s fees in the first ${v.feeMonths} — or pass it to your client as a discount.</p></div>
    <div class="card"><h3>Co-delivery</h3><p>You own the accounting part: chart of accounts, opening balances, close process. We do all the technical work.</p><p><b>You earn</b> your own hours at your own rate.</p></div>
  </div>
  <h2>What you get</h2>
  <ul class="checks">${terms.partner.whatYouGet.map((w) => `<li>${fill(w)}</li>`).join('')}</ul>
  <h2>Example: a ${eco.label.toLowerCase()}</h2>
  <table><tbody>
    <tr><td>${eco.projectLabel} project</td><td class="n">${usd(eco.projectAmount)}</td></tr>
    <tr><td>Keep, ${eco.keepMonths} months × ${usd(pkg.keep.price)}</td><td class="n">${usd(eco.keepMonths * pkg.keep.price)}</td></tr>
    <tr><td>Client fees in the first ${v.feeMonths}</td><td class="n">${usd(ecoTotal)}</td></tr>
    <tr class="total"><td>Your referral fee (${fee})</td><td class="n">${usd(ecoTotal * terms.partner.feeRate)}</td></tr>
  </tbody></table>
  <p class="muted" style="margin-top:8px">Paid within ${v.payoutDays} after the client pays. If you perform attest services for the client, the fee goes to the client as a discount — see our CPA rules note.</p>
  <h2>Your contact</h2>
  <p><b>${settings.partnerContact.name}</b>, ${settings.partnerContact.role}. We reply within ${v.replyTime}. Book a ${v.partnerIntroShort} intro at evenmont.com/partners.</p>`, { tag: 'Partner one-pager' }, 'partner'), 'partner');

const sowPhases = [
  ['Blueprint', 'Process map, baseline metrics, scope and plan', '2 weeks', 1500],
  ['Build 1 — Projects & time', 'CRM, projects, timesheets, approvals', '4 weeks', 4800],
  ['Build 2 — Billing & contractors', 'Invoicing from approved hours, contractor module, payments', '3 weeks', 4200],
  ['Go-live', 'Data migration, opening balances with your accountant, training, 30 days of hypercare', '1 week + 30 days', 3000],
];
const sowTotal = sowPhases.reduce((a, p) => a + p[3], 0);
const sowFoot = 'Sample statement of work — fictional client';
const sow = doc([
  page(`
  <p class="stamp">Sample</p>
  <h1 style="margin-top:10px">Statement of work</h1>
  <p class="lead">Odoo implementation — Launch · Services<br><span class="muted">Client: Fieldwork Collective (fictional) · Prepared by ${f1.name} · SOW-2026-014</span></p>
  <h2>1. Goals</h2>
  <ul><li>One system for projects, time, billing, contractors and the books.</li><li>Live margin by project and customer.</li><li>Close the month in 5 days or less (baseline: 11 days).</li><li>Invoice 95% of hours within the month (baseline: 71%).</li></ul>
  <h2>2. Scope</h2>
  <table><thead><tr><th>Area</th><th>Included</th></tr></thead><tbody>
    <tr><td><b>CRM & sales</b></td><td>Pipeline, quotes from templates, conversion to projects</td></tr>
    <tr><td><b>Projects</b></td><td>Project templates by service line, budgets, stages, tasks</td></tr>
    <tr><td><b>Timesheets</b></td><td>Entry by project and task, weekly approval by project leads</td></tr>
    <tr><td><b>Invoicing</b></td><td>Invoices from approved hours and milestones, payment links</td></tr>
    <tr><td><b>Contractors</b></td><td>Evenmont contractor module: rates, contractor invoices, payouts</td></tr>
    <tr><td><b>Accounting</b></td><td>Chart of accounts owned by your accountant; bank feeds, reconciliation, reports</td></tr>
    <tr><td><b>Migration</b></td><td>Customers, open projects, open invoices, opening balances from QuickBooks</td></tr>
  </tbody></table>
  <h2>3. Out of scope</h2>
  <p>Payroll processing, historic transactions older than the opening balance date, custom reports beyond the five listed in the Blueprint, integrations not named above. Anything new goes through change control (section 7).</p>`, { tag: 'Statement of work', foot: sowFoot, n: 1, of: 3 }),
  page(`
  <h2 style="margin-top:0">4. Phases, deliverables and price</h2>
  <table><thead><tr><th>Phase</th><th>Deliverables</th><th>Duration</th><th class="n">Fixed price</th></tr></thead><tbody>
    ${sowPhases.map((p) => `<tr><td><b>${p[0]}</b></td><td>${p[1]}</td><td>${p[2]}</td><td class="n">${usd(p[3])}</td></tr>`).join('')}
    <tr class="total"><td colspan="3">Total (Blueprint fee credited)</td><td class="n">${usd(sowTotal)}</td></tr>
  </tbody></table>
  <p class="muted" style="margin-top:6px">${terms.licensesNote} Prices exclude taxes. Each phase is invoiced when it is accepted.</p>
  <h2>5. Timeline</h2>
  <p>Start: week of April 6, 2026. Go-live target: week of June 15, 2026. A demo every Friday; the plan is updated in the weekly report.</p>
  <h2>6. Acceptance</h2>
  <p>Each phase ends with a demo against the acceptance list agreed in the Blueprint. You have five business days to accept or list what is missing; we fix gaps within the fixed price.</p>
  <h2>7. Change control</h2>
  <p>New requests are written up as a change note with a fixed price and impact on the timeline. Nothing outside this SOW is billed without your signed approval.</p>
  <h2>8. Roles</h2>
  <table><tbody>
    <tr><td><b>Evenmont</b></td><td>${f1.name} (project lead), ${f2.name} (delivery), one Odoo consultant</td></tr>
    <tr><td><b>Client</b></td><td>COO (sponsor), two project leads (key users), finance manager</td></tr>
    <tr><td><b>Accountant</b></td><td>Chart of accounts, opening balances, sign-off on the accounting setup</td></tr>
  </tbody></table>`, { tag: 'Statement of work', foot: sowFoot, n: 2, of: 3 }),
  page(`
  <h2 style="margin-top:0">9. Our promises</h2>
  <ul class="checks">${terms.guarantees.map((g) => `<li>${fill(g)}</li>`).join('')}</ul>
  <h2>10. After go-live</h2>
  <p>${fill('{hypercare} of hypercare are included. After that, Keep (managed Odoo: support, updates, improvements) from ')}${usd(pkg.keep.price)}/month, cancellable monthly. ${fill('{resultsCheck} after go-live we measure the goals in section 1 against the Blueprint baseline.')}</p>
  <h2>11. Data and code</h2>
  <p>Your data stays in your Odoo database. Code written for this project is assigned to you, with documentation. Access is limited to the named team and removed at the end of the project unless you choose Keep.</p>
  <h2>12. Terms</h2>
  <p>This SOW is governed by the Evenmont master services agreement. If they differ, this SOW applies for this project.</p>
  <div class="sig"><div>For the client<br><br>Name, title, date</div><div>For Evenmont (${settings.legal.legalName})<br><br>${f1.name}, Co-founder, date</div></div>`, { tag: 'Statement of work', foot: sowFoot, n: 3, of: 3 }),
].join(''));

const weekly = doc(page(`
  <p class="stamp">Sample</p>
  <h1 style="margin-top:10px">Weekly report · Week 6 of 10</h1>
  <p class="lead">Fieldwork Collective (fictional) · Launch · Services · Friday, May 15, 2026</p>
  <div class="grid3" style="margin-top:0.15in">
    <div class="card"><h3>Status</h3><p class="big" style="color:#1F5C4D">On track</p><p class="muted">Go-live June 15, unchanged</p></div>
    <div class="card"><h3>Budget</h3><p class="big">Fixed</p><p class="muted">No change requests open</p></div>
    <div class="card"><h3>Phase</h3><p class="big">Build 2</p><p class="muted">Billing & contractors · 1 of 3 weeks</p></div>
  </div>
  <div class="grid2">
    <div><h2>Done this week</h2><ul class="checks"><li>Invoicing from approved hours, tested on 3 live projects</li><li>Contractor rates imported for 14 field contractors</li><li>Payment links on invoices switched on</li><li>Friday demo with project leads — 2 small changes noted</li></ul></div>
    <div><h2>Next week</h2><ul><li>Contractor invoices and payout run</li><li>Milestone billing for fixed-fee projects</li><li>Opening balance dry run with Raman &amp; Ellis CPAs</li><li>Demo: Friday, May 22, 11:00 MT</li></ul></div>
  </div>
  <h2>Decisions needed</h2>
  <table><thead><tr><th>Decision</th><th>Owner</th><th>By</th></tr></thead><tbody>
    <tr><td>Invoice numbering: keep the QuickBooks sequence or start a new one?</td><td>Finance manager</td><td>May 19</td></tr>
    <tr><td>Who approves contractor invoices over $5,000?</td><td>COO</td><td>May 20</td></tr>
  </tbody></table>
  <h2>Risks</h2>
  <table><thead><tr><th>Risk</th><th>Impact</th><th>What we do</th></tr></thead><tbody>
    <tr><td>Two contractors still send paper invoices</td><td><span class="pill amber">Low</span></td><td>Portal access + a one-page guide; project lead follows up</td></tr>
  </tbody></table>
  <h2>Progress to plan</h2>
  <p><span class="pill">Blueprint · accepted</span> <span class="pill">Build 1 · accepted</span> <span class="pill amber">Build 2 · in progress</span> <span class="pill" style="background:#EEF0EC;color:#5F6661">Go-live · June 15</span></p>`, { tag: 'Weekly report', foot: 'Sample weekly report — fictional client' }));

const agreement = doc([page(`
  <p class="stamp">Sample</p>
  <h1 style="margin-top:10px">Partner agreement — key terms</h1>
  <p class="lead">A plain-English summary of the Evenmont referral partner agreement. The signed agreement governs.</p>
  <table><tbody>
    <tr><td style="width:32%"><b>Parties</b></td><td>${settings.legal.legalName}, trading as Evenmont, and the partner firm.</td></tr>
    <tr><td><b>What the partner does</b></td><td>Introduces clients who may need an Odoo implementation. No sales targets, no quotas, no fee to join.</td></tr>
    <tr><td><b>What Evenmont does</b></td><td>Sells, implements and supports Odoo for the client. Never offers accounting, tax or advisory services to referred clients.</td></tr>
    <tr><td><b>Referral fee</b></td><td>${fee} of the fees the client pays Evenmont in the first ${v.feeMonths} after signing, excluding Odoo licenses and taxes.</td></tr>
    <tr><td><b>Client discount option</b></td><td>The partner may instead pass the same amount to the client as a discount — required where the partner performs attest services for the client.</td></tr>
    <tr><td><b>Payout</b></td><td>Within ${v.payoutDays} after the client pays, with a quarterly statement.</td></tr>
    <tr><td><b>Deal registration</b></td><td>An introduction registered in writing is protected for ${v.dealRegistration}.</td></tr>
    <tr><td><b>Disclosure</b></td><td>The partner discloses the fee to the client in writing. Evenmont provides a disclosure template.</td></tr>
    <tr><td><b>Co-delivery</b></td><td>Optional, per project: the partner owns the accounting part and invoices the client directly at its own rate.</td></tr>
    <tr><td><b>Confidentiality</b></td><td>Both sides keep client information confidential and use it only for the client’s project.</td></tr>
    <tr><td><b>Term and exit</b></td><td>Open-ended; either side may end it with 30 days’ notice. Fees on clients already signed are still paid.</td></tr>
    <tr><td><b>Governing law</b></td><td>Republic of Cyprus.</td></tr>
  </tbody></table>
  <div class="sig"><div>For the partner firm<br><br>Name, title, date</div><div>For Evenmont<br><br>${settings.partnerContact.name}, Co-founder, date</div></div>`, { tag: 'Partner agreement · key terms', foot: 'Sample — not a signed agreement' }, 'partner')].join(''), 'partner');

const payouts = [
  ['Fieldwork Collective', 'Blueprint', 'Jul 8', 1500],
  ['Fieldwork Collective', 'Build 1 accepted', 'Jul 29', 4800],
  ['Fieldwork Collective', 'Build 2 accepted', 'Aug 19', 4200],
  ['Fieldwork Collective', 'Keep · July–September', 'Sep 30', 2250],
  ['Clearwater Dental Labs', 'Blueprint', 'Sep 12', 1500],
];
const payTotal = payouts.reduce((a, p) => a + p[3], 0);
const statement = doc(page(`
  <p class="stamp">Sample</p>
  <h1 style="margin-top:10px">Payout statement · Q3 2026</h1>
  <p class="lead">Raman &amp; Ellis CPAs (fictional) · Partner ID P-0007 · Statement date October 5, 2026</p>
  <table style="margin-top:0.15in"><thead><tr><th>Client</th><th>Invoice</th><th>Client paid</th><th class="n">Amount paid</th><th class="n">Fee (${fee})</th></tr></thead><tbody>
    ${payouts.map((p) => `<tr><td>${p[0]}</td><td>${p[1]}</td><td>${p[2]}</td><td class="n">${usd(p[3])}</td><td class="n">${usd(p[3] * terms.partner.feeRate)}</td></tr>`).join('')}
    <tr class="total"><td colspan="3">Total this quarter</td><td class="n">${usd(payTotal)}</td><td class="n">${usd(payTotal * terms.partner.feeRate)}</td></tr>
  </tbody></table>
  <div class="grid2" style="margin-top:0.25in">
    <div class="card"><h3>Paid to</h3><p>Raman &amp; Ellis CPAs · ACH ending 4417</p><p class="muted">Payment date: October 9, 2026 (within ${v.payoutDays} of each client payment)</p></div>
    <div class="card"><h3>Registered introductions</h3><p>2 active · 1 in Blueprint</p><p class="muted">Protected for ${v.dealRegistration} from registration</p></div>
  </div>
  <h2>Notes</h2>
  <p>Fees are calculated on amounts the client has paid, excluding Odoo licenses and taxes, for the first ${v.feeMonths} after signing. Questions: ${settings.partnerContact.name}, ${email}.</p>`, { tag: 'Payout statement', foot: 'Sample statement — fictional partner and clients' }, 'partner'), 'partner');

const cpaNote = doc(page(`
  <h1>Referral fees and CPA rules</h1>
  <p class="lead">A short, plain-English note for accounting firms considering our partner program.</p>
  <div class="rule"></div>
  <h2>The short version</h2>
  <ul class="checks">
    <li>If you perform attest services for a client — an audit, a review, an examination of prospective financial information, or a compilation whose report doesn’t disclose a lack of independence — don’t accept our fee for that client. Pass it to the client as a discount instead.</li>
    <li>For other clients, you may accept the fee if you disclose it to the client in writing. We provide a disclosure template.</li>
    <li>Some state boards of accountancy have stricter rules. Check yours.</li>
  </ul>
  <h2>Where this comes from</h2>
  <p>The AICPA Code of Professional Conduct covers commissions and referral fees (the “Commissions and Referral Fees” rule, ET 1.520). It limits commissions for recommending another company’s products or services when you perform attest services for the client, and requires disclosure when a commission or referral fee is permitted. State boards adopt their own versions.</p>
  <h2>How our program is built around it</h2>
  <ul>
    <li>Every referral fee can be turned into a client discount — at your choice, per client.</li>
    <li>We never offer accounting, tax or advisory services to your clients.</li>
    <li>Co-delivery is an alternative: you bill your own hours to your client, and no fee changes hands.</li>
  </ul>
  <p class="muted" style="margin-top:0.25in">General information, not legal or ethics advice. Confirm your obligations with your state board and your professional liability insurer. Questions: ${settings.partnerContact.name}, ${email}.</p>`, { tag: 'Note for CPAs' }, 'partner'), 'partner');

const checklist = doc(page(`
  <h1>Is your company ready for Odoo?</h1>
  <p class="lead">Fifteen questions we ask on every fit call. Tick what’s true today — the gaps are your first project plan.</p>
  <div class="grid2">
    <div>
      <h2>Processes</h2>
      <ul class="boxes"><li>We can describe, step by step, how an order becomes an invoice.</li><li>We know which spreadsheets run the business — and who owns each one.</li><li>We know where we copy the same data between tools.</li><li>We have one person who can decide on process questions.</li></ul>
      <h2>Data</h2>
      <ul class="boxes"><li>Our customer and vendor lists are mostly clean.</li><li>We know our product or service catalog, with current prices.</li><li>We trust our stock counts (or we know we don’t).</li><li>We know which history we really need to bring over.</li></ul>
    </div>
    <div>
      <h2>People</h2>
      <ul class="boxes"><li>Key users can give 3–4 hours a week during the project.</li><li>The team knows why we’re changing systems.</li><li>We have a go-live window outside our busiest season.</li></ul>
      <h2>Books</h2>
      <ul class="boxes"><li>Our accountant knows about the project and will own the chart of accounts.</li><li>We know our month-end close steps and how long they take.</li><li>Our sales tax setup is documented (states, rates, exemptions).</li><li>We know how inventory is valued today (if we hold stock).</li></ul>
    </div>
  </div>
  <div class="card" style="margin-top:0.25in"><h3>Scored 10 or more?</h3><p style="margin:0">You’re ready for a Blueprint. Fewer? Book a ${v.fitCallShort} fit call anyway — we’ll tell you honestly what to fix first. evenmont.com/book</p></div>`, { tag: 'Readiness checklist' }));

const codeSample = doc([page(`
  <p class="stamp">Excerpt</p>
  <h1 style="margin-top:10px">Code sample: contractor payouts</h1>
  <p class="lead">An excerpt from our contractor module for Odoo 17: manifest, one model and one test. Full modules ship with docs and tests; all code is assigned to you or your client.</p>
  <h3>__manifest__.py</h3>
<pre>{
    "name": "Contractor Payouts",
    "version": "17.0.1.2.0",
    "summary": "Contractor rates, invoices from approved hours, payout runs",
    "author": "Evenmont",
    "license": "LGPL-3",
    "depends": ["hr_timesheet", "account", "project"],
    "data": [
        "security/ir.model.access.csv",
        "views/contractor_rate_views.xml",
        "views/payout_run_views.xml",
    ],
}</pre>
  <h3>models/contractor_rate.py</h3>
<pre>from odoo import api, fields, models
from odoo.exceptions import ValidationError


class ContractorRate(models.Model):
    _name = "contractor.rate"
    _description = "Contractor hourly rate per project"
    _order = "date_from desc"

    partner_id = fields.Many2one("res.partner", required=True, index=True)
    project_id = fields.Many2one("project.project")
    rate = fields.Monetary(required=True)
    currency_id = fields.Many2one(
        "res.currency", default=lambda self: self.env.company.currency_id
    )
    date_from = fields.Date(required=True, default=fields.Date.context_today)

    @api.constrains("rate")
    def _check_rate(self):
        if any(r.rate &lt;= 0 for r in self):
            raise ValidationError("A contractor rate must be positive.")

    def _rate_for(self, partner, project, day):
        """Most recent rate valid on the day: project-specific first, then default."""
        domain = [("partner_id", "=", partner.id), ("date_from", "&lt;=", day)]
        for scope in ([("project_id", "=", project.id)], [("project_id", "=", False)]):
            rate = self.search(domain + scope, limit=1)
            if rate:
                return rate.rate
        return 0.0</pre>`, { tag: 'Code sample', foot: 'Excerpt for review', n: 1, of: 2 }),
  page(`
  <h3>tests/test_contractor_rate.py</h3>
<pre>from odoo.tests import TransactionCase, tagged


@tagged("post_install", "-at_install")
class TestContractorRate(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.contractor = cls.env["res.partner"].create({"name": "Field Contractor"})
        cls.project = cls.env["project.project"].create({"name": "Riverside survey"})
        Rate = cls.env["contractor.rate"]
        Rate.create({"partner_id": cls.contractor.id, "rate": 60, "date_from": "2026-01-01"})
        Rate.create({"partner_id": cls.contractor.id, "project_id": cls.project.id,
                     "rate": 75, "date_from": "2026-03-01"})

    def test_project_rate_wins(self):
        rate = self.env["contractor.rate"]._rate_for(self.contractor, self.project, "2026-03-10")
        self.assertEqual(rate, 75)

    def test_default_rate_before_project_rate(self):
        rate = self.env["contractor.rate"]._rate_for(self.contractor, self.project, "2026-02-10")
        self.assertEqual(rate, 60)</pre>
  <h2>How we work on code</h2>
  <ul class="checks"><li>Your Git repository, your review rules, pull requests for every change.</li><li>Tests for business logic; linting with the OCA guidelines.</li><li>Technical documentation for every module, handed over with the code.</li><li>No lock-in: the code is assigned to you or your client.</li></ul>`, { tag: 'Code sample', foot: 'Excerpt for review', n: 2, of: 2 }),
].join(''));

const out = {
  'evenmont-client-one-pager.pdf': clientOnePager,
  'evenmont-partner-one-pager.pdf': partnerOnePager,
  'evenmont-sample-sow.pdf': sow,
  'evenmont-sample-weekly-report.pdf': weekly,
  'evenmont-sample-partner-agreement.pdf': agreement,
  'evenmont-sample-payout-statement.pdf': statement,
  'evenmont-cpa-rules-note.pdf': cpaNote,
  'evenmont-odoo-readiness-checklist.pdf': checklist,
  'evenmont-code-sample.pdf': codeSample,
};

export async function buildPdfs(chromium, previewDir) {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const pageObj = await browser.newPage();
  for (const [file, html] of Object.entries(out)) {
    const tmp = new URL(`scripts/pdfs/.tmp-${file}.html`, root);
    fs.writeFileSync(tmp, html);
    await pageObj.goto(tmp.href, { waitUntil: 'load' });
    await pageObj.evaluate(() => document.fonts.ready);
    if (previewDir) {
      await pageObj.setViewportSize({ width: 816, height: 1056 });
      await pageObj.screenshot({ path: `${previewDir}/${file}.png`, fullPage: true });
    }
    await pageObj.pdf({ path: fileURLToPath(new URL(`public/downloads/${file}`, root)), preferCSSPageSize: true, printBackground: true });
    fs.unlinkSync(tmp);
    console.log('✓', file);
  }
  await browser.close();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { chromium } = await import('playwright-core');
  await buildPdfs(chromium);
}
