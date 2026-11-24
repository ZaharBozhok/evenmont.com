import type { APIRoute } from 'astro';
import { prerelease } from '../lib/site';

/**
 * robots.txt
 *
 * Pre-release / preview builds: everything disallowed (the pages are also noindex).
 * Production: all public content may be crawled. The named groups only make the policy explicit;
 * each repeats the default (Allow: /). A crawler follows the most specific group that names it, so a
 * restriction added to `User-agent: *` later does NOT reach the named crawlers — edit their group too.
 *
 * Search and AI answer crawlers are kept separate from AI model-training crawlers, so the training
 * policy can change (e.g. to Disallow) without affecting search visibility in ChatGPT, Claude,
 * Perplexity, Google, Bing or Apple. There is no business requirement to block training crawlers today.
 */
const searchAndAnswer = [
  // Search engines
  'Googlebot',
  'Bingbot',
  'Applebot',
  'DuckDuckBot',
  // AI search indexes and user-initiated fetches
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
];

const modelTraining = [
  'GPTBot', // OpenAI
  'ClaudeBot', // Anthropic
  'Google-Extended', // Google (Gemini training/grounding control token; not a separate crawler)
  'Applebot-Extended', // Apple (training control token; not a separate crawler)
  'CCBot', // Common Crawl
];

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap.xml', site).href;
  const group = (agents: string[]) => agents.map((a) => `User-agent: ${a}`).join('\n') + '\nAllow: /\n';
  const body = prerelease
    ? '# Pre-release build: keep out of search engines.\nUser-agent: *\nDisallow: /\n'
    : [
        '# Evenmont — https://evenmont.com',
        '# All public pages may be crawled and indexed.',
        '',
        '# Search engines, AI search and AI assistants fetching pages for users',
        group(searchAndAnswer),
        '# AI model training (separate policy; allowed)',
        group(modelTraining),
        '# Everyone else',
        'User-agent: *\nAllow: /\n',
        `Sitemap: ${sitemap}`,
        '',
      ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
