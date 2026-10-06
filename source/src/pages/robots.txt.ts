import type { APIRoute } from 'astro';
import { prerelease } from '../lib/site';

// Pre-release (settings.prerelease): keep the whole site out of search engines.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap.xml', site).href;
  const body = prerelease
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
