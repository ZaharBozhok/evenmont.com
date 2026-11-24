import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getTerms } from '../lib/terms';
import { isPublicCase, settings } from '../lib/site';

/**
 * /llms.txt — a short, plain-Markdown summary of the site for AI assistants (llmstxt.org proposal).
 * Supplementary only: crawling, the sitemap and JSON-LD remain the primary signals. Built from the
 * same verified data as the pages; demo content never appears here.
 */
export const GET: APIRoute = async ({ site }) => {
  const url = (p: string) => new URL(p, site).href;
  const terms = await getTerms();
  const scenarios = (await getCollection('scenarios')).sort((a, b) => a.data.order - b.data.order);
  const cases = (await getCollection('cases', isPublicCase)).sort((a, b) => a.data.order - b.data.order);
  const steps = terms.process.steps.map((s) => `${s.name}`).join(' → ');

  const lines = [
    `# ${settings.siteName}`,
    '',
    `> ${settings.siteName} is a ${settings.descriptor.charAt(0).toLowerCase()}${settings.descriptor.slice(1)} company for growing US businesses — service firms, distributors and manufacturers. ` +
      'It implements Odoo ERP (sales, inventory, manufacturing, projects and accounting in one system) in fixed-price phases, with the client’s accountant in the loop.',
    '',
    `- Operator: ${settings.siteName} is a registered business name of ${settings.legal.legalName}, a company registered in ${settings.legal.country}.`,
    '- Market served: companies in the United States; calls during US business hours.',
    `- How projects run: ${steps}.`,
    `- Contact: ${settings.contact.email} · book a fit call at ${url('/book')}`,
    '- Odoo is a trademark of Odoo S.A.',
    '',
    '## Services',
    '',
    ...scenarios.map((s) => `- [${s.data.seo.title.replace(/ \| Evenmont$/, '')}](${url(`/${s.id}`)}): ${s.data.seo.description}`),
    `- [Partner program for CPAs and bookkeepers](${url('/partners')}): refer a client or co-deliver Odoo projects; the accountant keeps the client.`,
    `- [White-label Odoo delivery for agencies](${url('/partners/white-label')}): custom modules, integrations, migrations and US accounting setup under the agency's brand.`,
    '',
    '## Company',
    '',
    `- [About Evenmont](${url('/about')})`,
    `- [Security & data](${url('/security')}): where client data lives, access, backups, NDA and GDPR.`,
    `- [Pricing and process](${url('/#pricing')})`,
    `- [Book a fit call](${url('/book')})`,
    '',
    ...(cases.length
      ? ['## Case studies', '', ...cases.map((c) => `- [${c.data.title}](${url(`/cases/${c.id}`)}): ${c.data.description}`), '']
      : []),
    '## Optional',
    '',
    `- [Legal notice](${url('/legal')})`,
    `- [Sitemap](${url('/sitemap.xml')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
