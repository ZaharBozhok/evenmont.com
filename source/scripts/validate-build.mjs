#!/usr/bin/env node
// Validates the generated static site (dist/) before it is deployed.
//
//   node scripts/validate-build.mjs --production   # the public site: must be indexable and clean
//   node scripts/validate-build.mjs --preview      # a pre-release build: must be fully noindex
//   node scripts/validate-build.mjs                # mode from SITE_ENV (production | preview), else production
//
// Exits 1 on any error (the deploy workflow stops), 0 with warnings only. No dependencies.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const args = process.argv.slice(2);
const mode = args.includes('--preview') ? 'preview' : args.includes('--production') ? 'production' : process.env.SITE_ENV === 'preview' ? 'preview' : 'production';

const settings = JSON.parse(readFileSync(path.join(root, 'src/content/settings.json'), 'utf8'));
const config = readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
const SITE = new URL(config.match(/site:\s*'([^']+)'/)?.[1] ?? settings.siteUrl);
const ORIGIN = SITE.origin;

/** Pages that are kept out of search engines on purpose. Anything else with noindex is an error. */
const INTENTIONALLY_NOINDEX = new Set(['/404', '/privacy', '/terms']);
/** Hosts that must never appear in the production site. */
const FORBIDDEN_HOSTS = [/localhost/i, /127\.0\.0\.1/, /0\.0\.0\.0/, /\.github\.io\b/i, /\.netlify\.app\b/i, /\.vercel\.app\b/i, /\.pages\.dev\b/i, /\bwww\.evenmont\.com\b/i, /http:\/\/evenmont\.com/i];

const errors = [];
const warnings = [];
const error = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/index.html not found — run the build first.');
  process.exit(1);
}

// ---------- files ----------
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const all = walk(dist);
const rel = (f) => path.relative(dist, f).split(path.sep).join('/');
const htmlFiles = all.filter((f) => f.endsWith('.html'));
const routeOf = (r) => ('/' + r.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '')).replace(/\/$/, '') || '/';
/** Trailing-slash aliases written by integrations/static-output.mjs (x/index.html next to x.html). */
const isAlias = (r) => r.endsWith('/index.html') && existsSync(path.join(dist, r.replace(/\/index\.html$/, '.html')));

/** Resolves a site path the way GitHub Pages does: exact file, then .html, then /index.html. */
function resolvePath(p) {
  let clean;
  try {
    clean = decodeURIComponent(p.split('#')[0].split('?')[0]);
  } catch {
    return null;
  }
  if (clean === '' || clean === '/') return path.join(dist, 'index.html');
  const base = path.join(dist, clean);
  for (const c of [base, `${base.replace(/\/$/, '')}.html`, path.join(base, 'index.html')]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
}

// ---------- HTML helpers ----------
const meta = (html, key, attr = 'name') => html.match(new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`, 'i'))?.[1];
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const textOf = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

// ---------- unverified (demo) values that must not reach production ----------
const get = (obj, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const leaves = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(leaves) : v && typeof v === 'object' ? Object.entries(v).filter(([k]) => k !== '$comment' && k !== 'id').flatMap(([, x]) => leaves(x)) : []);
const demoValues = new Set();
for (const field of settings.demo?.fields ?? []) {
  for (const value of leaves(get(settings, field))) {
    // Skip short generic values ("3 days", "v17") and links that also appear in verified copy.
    if (value.length < 8 || value === 'demo' || /^https?:\/\/|^\//.test(value) || /^(Partner|Clutch|v\d+)$/.test(value)) continue;
    demoValues.add(value);
  }
}
const caseDir = path.join(root, 'src/content/cases');
const demoCases = readdirSync(caseDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => ({ slug: f.replace(/\.md$/, ''), text: readFileSync(path.join(caseDir, f), 'utf8') }))
  .filter((c) => /^(demo|placeholder):\s*true\s*$/m.test(c.text.split('---')[1] ?? ''))
  .map((c) => ({ slug: c.slug, company: c.text.match(/^company:\s*"([^"]+)"/m)?.[1] }));
for (const c of demoCases) if (c.company) demoValues.add(c.company);

// ---------- pages ----------
const pages = new Map(); // route -> info
for (const file of htmlFiles) {
  const r = rel(file);
  const html = readFileSync(file, 'utf8');
  const route = routeOf(r);
  const alias = isAlias(r);
  const robots = meta(html, 'robots') ?? '';
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i)?.[1];
  const info = { file, r, html, route, alias, robots, canonical, noindex: /noindex/i.test(robots) };
  if (!alias) pages.set(route, info);

  if (alias) {
    // Must be identical to its page (so it carries the same canonical).
    const page = readFileSync(path.join(dist, r.replace(/\/index\.html$/, '.html')), 'utf8');
    if (page !== html) error(r, 'trailing-slash alias differs from its page');
    continue;
  }
  const where = route;

  // Indexing directives
  if (mode === 'preview') {
    if (!/noindex/i.test(robots) || !/nofollow/i.test(robots)) error(where, `preview build page is indexable (robots="${robots}")`);
    continue;
  }
  if (/nofollow/i.test(robots)) error(where, `robots meta contains nofollow ("${robots}")`);
  if (info.noindex && !INTENTIONALLY_NOINDEX.has(route)) error(where, `unexpected noindex ("${robots}") — add to INTENTIONALLY_NOINDEX only if this is deliberate`);
  if (!info.noindex && INTENTIONALLY_NOINDEX.has(route) && route === '/404') error(where, '404 page must be noindex');

  // Basic document
  if (!/<html[^>]+lang="[a-z]{2}(-[A-Z]{2})?"/i.test(html)) error(where, 'missing <html lang>');
  if (!/<meta\s+name="viewport"[^>]*width=device-width/i.test(html)) error(where, 'missing responsive viewport meta');
  const title = decode(html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? '');
  const description = decode(meta(html, 'description') ?? '');
  info.title = title;
  info.description = description;
  if (!title) error(where, 'missing <title>');
  else if (title.length > 65) warn(where, `title is ${title.length} characters (search results show ~60)`);
  if (!description) error(where, 'missing meta description');
  else if (description.length > 170) warn(where, `meta description is ${description.length} characters`);
  const h1s = html.match(/<h1[\s>]/gi)?.length ?? 0;
  if (h1s === 0) error(where, 'no <h1>');
  if (h1s > 1) warn(where, `${h1s} <h1> elements`);

  // Images: every <img> needs an alt attribute (empty for decorative images).
  for (const img of html.match(/<img\b[^>]*>/gi) ?? []) if (!/\salt=/.test(img)) error(where, `<img> without alt: ${img.slice(0, 100)}`);

  // Canonical + Open Graph + Twitter (indexable pages)
  if (!info.noindex) {
    const expected = new URL(route, ORIGIN).href;
    if (!canonical) error(where, 'missing canonical link');
    else {
      if (!canonical.startsWith(`${ORIGIN}/`)) error(where, `canonical not on ${ORIGIN}: ${canonical}`);
      if (canonical !== expected) error(where, `canonical ${canonical} ≠ page URL ${expected}`);
    }
    const og = { title: meta(html, 'og:title', 'property'), description: meta(html, 'og:description', 'property'), url: meta(html, 'og:url', 'property'), image: meta(html, 'og:image', 'property') };
    for (const [k, v] of Object.entries(og)) if (!v) error(where, `missing og:${k}`);
    if (og.url && canonical && og.url !== canonical) error(where, `og:url ${og.url} ≠ canonical ${canonical}`);
    if (og.image && (!og.image.startsWith(`${ORIGIN}/`) || !resolvePath(new URL(og.image).pathname))) error(where, `og:image missing or not on site: ${og.image}`);
    if (!meta(html, 'twitter:card')) error(where, 'missing twitter:card');
  }

  // JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  if (!blocks.length) error(where, 'no JSON-LD');
  let hasOrg = false;
  for (const block of blocks) {
    let data;
    try {
      data = JSON.parse(block);
    } catch (e) {
      error(where, `invalid JSON-LD: ${e.message}`);
      continue;
    }
    if (data['@context'] !== 'https://schema.org') error(where, 'JSON-LD without @context https://schema.org');
    const nodes = data['@graph'] ?? [data];
    for (const n of nodes) {
      if (!n['@type']) error(where, 'JSON-LD node without @type');
      if (n['@type'] === 'Organization') {
        hasOrg = true;
        if (n.url !== `${ORIGIN}/`) error(where, `Organization url ${n.url} ≠ ${ORIGIN}/`);
      }
      if (n['@type'] === 'FAQPage' && !(n.mainEntity?.length > 0)) error(where, 'FAQPage without questions');
      if (n['@type'] === 'FAQPage') {
        const visible = textOf(html);
        for (const q of n.mainEntity ?? []) if (!visible.includes(q.name)) error(where, `FAQPage question not visible on the page: "${q.name}"`);
      }
      if (/Rating|Review/.test(String(n['@type'])) || n.aggregateRating || n.review) error(where, 'JSON-LD rating/review markup: only with verified, visible reviews');
    }
    for (const url of block.match(/https?:\/\/[^"\\]+/g) ?? []) {
      if (url.startsWith(ORIGIN) && !url.includes('#') && !resolvePath(new URL(url).pathname)) error(where, `JSON-LD URL not found in build: ${url}`);
    }
  }
  if (blocks.length && !hasOrg) error(where, 'JSON-LD has no Organization');

  // Leftover tokens
  if (/\{\{[A-Z0-9_]+\}\}/.test(html)) error(where, 'contains an unfilled {{TOKEN}} placeholder');

  // Unverified (demo) content
  if (mode === 'production') {
    const visible = textOf(html) + ' ' + blocks.join(' ');
    for (const v of demoValues) if (visible.includes(v)) error(where, `unverified demo value rendered: "${v}"`);
    for (const c of demoCases) if (html.includes(`/cases/${c.slug}"`)) error(where, `links to demo case /cases/${c.slug}`);
  }
}

// ---------- links and assets (all pages) ----------
const checked = new Map();
for (const { r, html, route, alias } of [...pages.values()]) {
  if (alias) continue;
  const refs = [
    ...[...html.matchAll(/\s(?:href|src|action|poster|content)="([^"]+)"/gi)].map((m) => m[1]),
    ...[...html.matchAll(/\ssrcset="([^"]+)"/gi)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0])),
  ];
  for (const raw of refs) {
    const ref = decode(raw);
    for (const re of FORBIDDEN_HOSTS) if (re.test(ref)) error(route, `forbidden host reference: ${ref}`);
    if (/^(mailto:|tel:|data:|javascript:|#)/i.test(ref) || !/^(\/|https?:)/.test(ref)) continue;
    let url;
    try {
      url = new URL(ref, ORIGIN);
    } catch {
      continue;
    }
    if (url.origin !== ORIGIN) continue; // external
    const key = url.pathname;
    if (!checked.has(key)) checked.set(key, resolvePath(key));
    const target = checked.get(key);
    if (!target) {
      error(route, `broken internal link or missing asset: ${ref}`);
      continue;
    }
    if (url.hash.length > 1 && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      const t = readFileSync(target, 'utf8');
      if (!new RegExp(`\\sid="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(t)) warn(route, `link target #${id} not found in ${rel(target)}`);
    }
  }
  // Stylesheets and fonts referenced from inline CSS
  for (const m of html.matchAll(/url\((?:'|")?(\/[^'")]+)(?:'|")?\)/g)) if (!resolvePath(m[1])) error(route, `missing CSS asset ${m[1]}`);
}

// Duplicate titles / descriptions / canonicals among indexable pages
const indexable = [...pages.values()].filter((p) => !p.noindex);
const dupes = (key) => {
  const seen = new Map();
  for (const p of indexable) if (p[key]) seen.set(p[key], [...(seen.get(p[key]) ?? []), p.route]);
  for (const [v, routes] of seen) if (routes.length > 1) error(routes.join(', '), `duplicate ${key}: "${v}"`);
};
if (mode === 'production') ['title', 'description', 'canonical'].forEach(dupes);

// ---------- robots.txt ----------
const robotsPath = path.join(dist, 'robots.txt');
if (!existsSync(robotsPath)) error('robots.txt', 'missing');
else {
  const txt = readFileSync(robotsPath, 'utf8');
  // Parse groups (RFC 9309): consecutive User-agent lines share the rules that follow.
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  for (const line of txt.split(/\r?\n/)) {
    const [k, ...rest] = line.replace(/#.*/, '').split(':');
    const key = k.trim().toLowerCase();
    const value = rest.join(':').trim();
    if (!key) continue;
    if (key === 'user-agent') {
      if (!lastWasAgent) groups.push((current = { agents: [], rules: [] }));
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if ((key === 'allow' || key === 'disallow') && current) current.rules.push({ key, value });
    }
  }
  const blocksAll = (g) => g.rules.some((r) => r.key === 'disallow' && r.value === '/') && !g.rules.some((r) => r.key === 'allow' && r.value === '/');
  if (mode === 'preview') {
    const star = groups.find((g) => g.agents.includes('*'));
    if (!star || !blocksAll(star)) error('robots.txt', 'preview build must disallow all crawling');
  } else {
    const mustAllow = ['*', 'googlebot', 'bingbot', 'applebot', 'oai-searchbot', 'chatgpt-user', 'perplexitybot', 'perplexity-user', 'claude-searchbot', 'claude-user'];
    for (const agent of mustAllow) {
      const g = groups.find((x) => x.agents.includes(agent)) ?? groups.find((x) => x.agents.includes('*'));
      if (!g) error('robots.txt', `no group applies to ${agent}`);
      else if (g.rules.some((r) => r.key === 'disallow' && r.value && r.value !== '')) error('robots.txt', `${agent} is restricted: ${g.rules.map((r) => `${r.key}: ${r.value}`).join(', ')}`);
    }
    const sitemapLine = txt.match(/^Sitemap:\s*(\S+)/im)?.[1];
    if (sitemapLine !== `${ORIGIN}/sitemap.xml`) error('robots.txt', `Sitemap line must be ${ORIGIN}/sitemap.xml (got ${sitemapLine ?? 'none'})`);
  }
}

// ---------- sitemap.xml ----------
const sitemapPath = path.join(dist, 'sitemap.xml');
if (!existsSync(sitemapPath)) error('sitemap.xml', 'missing');
else if (mode === 'production') {
  const xml = readFileSync(sitemapPath, 'utf8');
  if (!xml.startsWith('<?xml') || !xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') || !xml.trim().endsWith('</urlset>')) error('sitemap.xml', 'not a valid urlset document');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!locs.length) error('sitemap.xml', 'no URLs');
  const seen = new Set();
  for (const loc of locs) {
    if (seen.has(loc)) error('sitemap.xml', `duplicate ${loc}`);
    seen.add(loc);
    if (!loc.startsWith(`${ORIGIN}/`)) {
      error('sitemap.xml', `URL not on ${ORIGIN}: ${loc}`);
      continue;
    }
    const page = pages.get(new URL(loc).pathname.replace(/\/$/, '') || '/');
    if (!page) error('sitemap.xml', `URL has no page: ${loc}`);
    else if (page.noindex) error('sitemap.xml', `lists a noindex page: ${loc}`);
    else if (page.canonical !== loc) error('sitemap.xml', `${loc} is not canonical (canonical: ${page.canonical})`);
  }
  for (const p of indexable) if (!seen.has(p.canonical)) error('sitemap.xml', `indexable page missing: ${p.route}`);
}

// ---------- GitHub Pages files ----------
const cname = path.join(dist, 'CNAME');
if (!existsSync(cname)) error('CNAME', 'missing (GitHub Pages custom domain)');
else if (readFileSync(cname, 'utf8').trim() !== SITE.hostname) error('CNAME', `must be ${SITE.hostname}`);
if (!existsSync(path.join(dist, '.nojekyll'))) error('.nojekyll', 'missing (GitHub Pages would run Jekyll and drop _astro/)');
if (!existsSync(path.join(dist, '404.html'))) error('404.html', 'missing');
if (mode === 'production' && !existsSync(path.join(dist, 'llms.txt'))) warn('llms.txt', 'missing');
for (const f of ['llms.txt', 'robots.txt', 'sitemap.xml', 'site.webmanifest']) {
  const p = path.join(dist, f);
  if (!existsSync(p)) continue;
  const t = readFileSync(p, 'utf8');
  for (const re of FORBIDDEN_HOSTS) if (re.test(t)) error(f, `forbidden host reference (${re})`);
  if (mode === 'production' && f === 'llms.txt') for (const v of demoValues) if (t.includes(v)) error(f, `unverified demo value: "${v}"`);
}
if (mode === 'production') {
  for (const field of settings.demo?.fields ?? []) {
    const value = get(settings, field);
    if (typeof value === 'string' && value.startsWith('/') && existsSync(path.join(dist, value))) error(value, `unverified file (${field}) is in the production build`);
  }
}
for (const leftover of ['_headers', '_redirects', 'netlify.toml', 'vercel.json']) if (existsSync(path.join(dist, leftover))) warn(leftover, 'host-specific file has no effect on GitHub Pages');

// ---------- report ----------
const pageCount = pages.size;
console.log(`\nvalidate-build (${mode}): ${pageCount} pages, ${checked.size} internal URLs checked, ${indexable.length} indexable`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n` + warnings.map((w) => `  ⚠ ${w}`).join('\n'));
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n` + errors.map((e) => `  ✗ ${e}`).join('\n'));
  console.error('\nThe build is not fit to deploy.');
  process.exit(1);
}
console.log('\n✓ No errors.');
