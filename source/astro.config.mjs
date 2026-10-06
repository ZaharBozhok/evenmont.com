// @ts-check
import { defineConfig } from 'astro/config';
import placeholderReport from './integrations/placeholder-report.mjs';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://evenmont.com',
  output: 'static',
  // Clean URLs without trailing slash: /services, /partners/white-label
  trailingSlash: 'never',
  build: {
    format: 'file',
    // Critical CSS: every page ships its (small) stylesheet inline — no render-blocking request.
    inlineStylesheets: 'always',
  },
  // HTML whitespace rules (Astro 7 defaults to JSX rules, which drop spaces between inline tags).
  compressHTML: true,
  // Scope component styles with a short class instead of a data attribute (smaller CSS and HTML).
  scopedStyleStrategy: 'class',
  devToolbar: { enabled: false },
  integrations: [placeholderReport()],
});
