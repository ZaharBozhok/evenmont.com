// Full-page screenshots of every page at 390 px and 1440 px (after scrolling, so in-view animations have played).
// Usage: npm run build && npm run preview   (in another terminal)
//        npm install --no-save playwright-core && node scripts/qa/screenshots.mjs [outDir]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { pages, base, launchOptions } from './pages.mjs';

const outDir = process.argv[2] ?? 'qa-tmp/screenshots';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch(launchOptions);
for (const width of [390, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 768, hasTouch: width < 768 });
  const page = await context.newPage();
  for (const [name, path] of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    // Instant scrolling for the sweep; hide the fixed mobile bar (it would be painted mid-page in a full-page capture).
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}.sticky-cta{display:none!important}' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 110));
      }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${outDir}/${name}-${width}.png`, fullPage: true });
    console.log(`${name}-${width}.png`);
  }
  await context.close();
}
await browser.close();
