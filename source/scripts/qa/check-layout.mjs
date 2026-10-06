// Layout sweep: no horizontal scroll, one H1, no console errors — every page at every width.
// Usage: npm run build && npm run preview   (in another terminal)
//        npm install --no-save playwright-core && node scripts/qa/check-layout.mjs   (CHROME_PATH=/path/to/chrome if needed)
import { chromium } from 'playwright-core';
import { pages, base, launchOptions } from './pages.mjs';

const widths = [320, 360, 390, 430, 768, 1024, 1280, 1440];
const browser = await chromium.launch(launchOptions);
let failures = 0;
for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: 800 }, isMobile: width < 768, hasTouch: width < 768 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !m.text().includes('404') && errors.push(m.text()));
  for (const [, path] of pages) {
    errors.length = 0;
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
      h1: document.querySelectorAll('h1').length,
    }));
    if (r.scroll > r.client || r.h1 !== 1 || errors.length) {
      failures++;
      console.log('FAIL', width, path, JSON.stringify(r), errors);
    }
  }
  await context.close();
}
await browser.close();
console.log(failures ? `${failures} failure(s)` : `All ${pages.length} pages pass at ${widths.join(', ')} px`);
process.exit(failures ? 1 : 0);
