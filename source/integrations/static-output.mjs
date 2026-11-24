// Post-build steps for GitHub Pages (static hosting, no redirects, no custom headers).
//
// 1. sitemap.xml from the generated pages: one entry per page that is indexable (no robots
//    noindex) and is its own canonical URL. So the sitemap can never list a noindex page, a
//    duplicate or a demo page left out of the build. In pre-release builds it is still written
//    (robots.txt and noindex keep crawlers out).
// 2. Trailing-slash aliases: GitHub Pages serves /services from services.html, but /services/ is
//    a 404. For every page `x.html` we also write `x/index.html` (same HTML, canonical → /x), so a
//    trailing-slash link or a refresh never ends on a 404. They are not listed in the sitemap.
// 3. Production builds leave out files from public/ that settings.demo.fields marks as unverified
//    (e.g. sample PDFs generated with the demo founders and clients). Their links are hidden too.
// 4. IndexNow key file: with INDEXNOW_KEY set (8–128 of a-z A-Z 0-9 -), writes /<key>.txt
//    containing the key, as the IndexNow protocol requires. See .github/workflows/indexnow.yml.

import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const attr = (html, re) => html.match(re)?.[1];
export const robotsOf = (html) => attr(html, /<meta\s+name="robots"\s+content="([^"]*)"/i) ?? '';
export const canonicalOf = (html) => attr(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);

/** Same rule as src/lib/site.ts: SITE_ENV wins, then PRERELEASE, then settings.prerelease. */
function isPrerelease(settings) {
  const siteEnv = (process.env.SITE_ENV ?? '').toLowerCase();
  if (siteEnv === 'production') return false;
  if (siteEnv === 'preview') return true;
  if (process.env.PRERELEASE) return process.env.PRERELEASE !== 'false';
  return settings.prerelease === true;
}

export default function staticOutput() {
  let site = '';
  let root = '';
  return {
    name: 'evenmont:static-output',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site;
        root = fileURLToPath(config.root);
      },
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const settings = JSON.parse(await readFile(path.join(root, 'src/content/settings.json'), 'utf8'));

        // Unverified public files (production only) — before the sitemap, so nothing points at them.
        if (!isPrerelease(settings)) {
          const get = (key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), settings);
          for (const field of settings.demo?.fields ?? []) {
            const value = get(field);
            if (typeof value === 'string' && value.startsWith('/downloads/')) {
              await rm(path.join(outDir, value), { force: true });
              logger.info(`left out unverified file ${value} (${field})`);
            }
          }
        }
        const files = (await walk(outDir)).filter((f) => f.endsWith('.html'));

        // 1. Sitemap
        const urls = new Set();
        for (const file of files) {
          const rel = path.relative(outDir, file).split(path.sep).join('/');
          if (rel === '404.html') continue;
          const html = await readFile(file, 'utf8');
          if (/noindex/i.test(robotsOf(html))) continue;
          const route = '/' + rel.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
          const self = new URL(route, site).href;
          const canonical = canonicalOf(html);
          if (canonical && canonical !== self) continue; // a duplicate of another page
          urls.add(self);
        }
        const sorted = [...urls].sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
        const xml =
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          sorted.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
          '\n</urlset>\n';
        await writeFile(path.join(outDir, 'sitemap.xml'), xml);
        logger.info(`sitemap.xml: ${sorted.length} URLs`);

        // 2. Trailing-slash aliases
        let aliases = 0;
        for (const file of files) {
          const base = path.basename(file);
          if (base === 'index.html' || base === '404.html') continue;
          const alias = path.join(file.replace(/\.html$/, ''), 'index.html');
          if (existsSync(alias)) continue;
          await mkdir(path.dirname(alias), { recursive: true });
          await writeFile(alias, await readFile(file));
          aliases++;
        }
        logger.info(`trailing-slash aliases: ${aliases}`);

        // 4. IndexNow key file
        const key = (process.env.INDEXNOW_KEY ?? '').trim();
        if (key) {
          if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error('INDEXNOW_KEY must be 8–128 characters of a-z, A-Z, 0-9 and "-".');
          await writeFile(path.join(outDir, `${key}.txt`), key);
          logger.info(`IndexNow key file: /${key}.txt`);
        }
      },
    },
  };
}
