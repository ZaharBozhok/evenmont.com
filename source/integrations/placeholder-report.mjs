// Build-time placeholder report.
// Prints a warning after `astro build` while the site still contains
//   · {{TOKENS}} in the generated HTML (legal numbers, links, names …)
//   · content entries marked `placeholder: true` (sample case studies)
//   · demo content invented for the pre-release preview: entries marked `demo: true`
//     and the settings listed in settings.json → demo.fields
//   · placeholder images listed in src/content/placeholders.json
//   · the pre-release switch (settings.prerelease: noindex + robots Disallow)
// It never fails the build — it only makes the remaining work impossible to miss.

import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const TOKEN = /\{\{([A-Z0-9_]+)\}\}|%7B%7B([A-Z0-9_]+)%7D%7D/g;

async function walk(dir, ext) {
  const out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, ext)));
    else if (ext.some((e) => entry.name.endsWith(e))) out.push(full);
  }
  return out;
}

function pageName(root, file) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/\.html$/, '').replace(/\/index$/, '');
}

export default function placeholderReport() {
  let projectRoot = '';
  return {
    name: 'evenmont:placeholder-report',
    hooks: {
      'astro:config:done': ({ config }) => {
        projectRoot = fileURLToPath(config.root);
      },
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);

        // 1. {{TOKENS}} left in the generated pages
        const tokens = new Map();
        for (const file of await walk(outDir, ['.html', '.xml', '.txt', '.webmanifest'])) {
          const text = await readFile(file, 'utf8');
          for (const match of text.matchAll(TOKEN)) {
            const name = match[1] || match[2];
            if (!tokens.has(name)) tokens.set(name, new Set());
            tokens.get(name).add(pageName(outDir, file));
          }
        }

        // 2. Content entries with `placeholder: true`
        const samples = [];
        const contentDir = path.join(projectRoot, 'src', 'content');
        for (const file of await walk(contentDir, ['.md', '.mdx'])) {
          const text = await readFile(file, 'utf8');
          const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
          if (frontmatter && /^placeholder:\s*true\s*$/m.test(frontmatter[1])) {
            samples.push(path.relative(projectRoot, file));
          }
        }

        // 2b. Demo content (invented for the preview)
        const demo = [];
        for (const file of await walk(contentDir, ['.md', '.mdx'])) {
          const text = await readFile(file, 'utf8');
          const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
          if (frontmatter && /^demo:\s*true\s*$/m.test(frontmatter[1])) demo.push(path.relative(projectRoot, file));
        }
        let settings = {};
        try {
          settings = JSON.parse(await readFile(path.join(contentDir, 'settings.json'), 'utf8'));
        } catch {
          /* no settings */
        }
        const demoFields = settings.demo?.fields ?? [];

        // 3. Placeholder images registry
        let images = [];
        try {
          const registry = JSON.parse(await readFile(path.join(contentDir, 'placeholders.json'), 'utf8'));
          images = (registry.items || []).filter((item) => item.status !== 'replaced');
        } catch {
          /* no registry */
        }

        if (!tokens.size && !samples.length && !images.length && !demo.length && !demoFields.length && !(settings.prerelease && process.env.PRERELEASE !== 'false')) {
          logger.info('No placeholders left. Ready for launch.');
          return;
        }

        const lines = ['', 'Placeholders still in the build — replace before launch:'];
        if (settings.prerelease && process.env.PRERELEASE !== 'false') {
          lines.push('', '  PRE-RELEASE: settings.prerelease is true — every page is noindex and robots.txt disallows all.');
        }
        if (demo.length || demoFields.length) {
          lines.push('', `  Demo content invented for the preview (${demo.length + demoFields.length}) — see docs/DEMO-CONTENT.md:`);
          for (const s of demo) lines.push(`    ${s}  (demo: true)`);
          for (const f of demoFields) lines.push(`    settings.json → ${f}`);
        }
        if (tokens.size) {
          lines.push('', `  {{…}} tokens (${tokens.size}):`);
          for (const [name, pages] of [...tokens].sort((a, b) => a[0].localeCompare(b[0]))) {
            const list = [...pages].sort();
            const shown = list.slice(0, 4).join(', ') + (list.length > 4 ? ` +${list.length - 4} more` : '');
            lines.push(`    {{${name}}}  →  ${shown}`);
          }
        }
        if (samples.length) {
          lines.push('', `  Sample content (placeholder: true) (${samples.length}):`);
          for (const s of samples) lines.push(`    ${s}`);
        }
        if (images.length) {
          lines.push('', `  Placeholder images and mocks (${images.length}) — see src/content/placeholders.json:`);
          for (const item of images) lines.push(`    ${item.slot}  →  ${item.file}`);
        }
        lines.push('');
        logger.warn(lines.join('\n'));
      },
    },
  };
}
