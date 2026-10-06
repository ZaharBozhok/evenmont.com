import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/** sitemap.xml — every page from the sitemap plus one entry per case study. */
const staticRoutes = [
  '/',
  '/services',
  '/distribution',
  '/manufacturing',
  '/cases',
  '/about',
  '/security',
  '/book',
  '/partners',
  '/partners/white-label',
  '/legal',
  '/privacy',
  '/terms',
];

export const GET: APIRoute = async ({ site }) => {
  const cases = await getCollection('cases');
  const routes = [...staticRoutes, ...cases.map((c) => `/cases/${c.id}`)];
  const urls = routes
    .map((route) => `  <url><loc>${new URL(route, site).href}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
