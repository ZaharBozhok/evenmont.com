/**
 * JSON-LD (schema.org) for every page, as one @graph: Organization, WebSite, the page itself
 * (WebPage or a subtype), its BreadcrumbList, plus page-specific nodes (Service, Article …).
 *
 * Only verified facts go in here: values still listed in settings.demo.fields are left out of
 * production builds (see `show` in ./site). Do not add ratings, reviews, addresses or credentials
 * that are not shown on the site and confirmed.
 */
import { settings, show } from './site';

export type JsonLdNode = Record<string, unknown>;
export type PageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'FAQPage';

const abs = (site: URL, path: string) => new URL(path, site).href;
export const orgId = (site: URL) => abs(site, '/#organization');
export const websiteId = (site: URL) => abs(site, '/#website');

/** What Evenmont does, in terms that appear on the site. */
export const knowsAbout = [
  'Odoo',
  'Odoo ERP implementation',
  'ERP implementation',
  'Accounting system setup',
  'Inventory management',
  'Manufacturing resource planning',
  'Project and timesheet billing',
  'Odoo custom module development',
  'Odoo migrations',
];

export function organization(site: URL): JsonLdNode {
  const c = settings.contact;
  const l = settings.legal;
  const node: JsonLdNode = {
    '@type': 'Organization',
    '@id': orgId(site),
    name: settings.siteName,
    legalName: l.legalName,
    url: abs(site, '/'),
    logo: { '@type': 'ImageObject', url: abs(site, '/icon-512.png'), width: 512, height: 512 },
    image: abs(site, '/og-image.png'),
    description: `${settings.descriptor} for growing US companies: service firms, distributors and manufacturers. Fixed-price phases, with the client's accountant in the loop.`,
    slogan: settings.tagline,
    email: c.email,
    areaServed: { '@type': 'Country', name: 'United States' },
    knowsAbout,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: c.email,
        ...(show('contact.phoneUs') ? { telephone: c.phoneUs } : {}),
        areaServed: 'US',
        availableLanguage: ['en'],
      },
      { '@type': 'ContactPoint', contactType: 'security', email: c.securityEmail },
    ],
  };
  if (show('legal.vatNo')) node.vatID = l.vatNo;
  if (show('legal.registeredOffice')) {
    node.address = { '@type': 'PostalAddress', streetAddress: l.registeredOffice, addressCountry: l.country };
  }
  if (show('founders')) node.founder = settings.founders.map((f) => ({ '@type': 'Person', name: f.name, jobTitle: f.role }));
  if (show('odooPartnerBadge')) {
    node.memberOf = { '@type': 'ProgramMembership', programName: 'Odoo Partner Program', name: settings.odooPartnerBadge };
  }
  if (settings.links.socialLinks.length) node.sameAs = settings.links.socialLinks;
  return node;
}

export function website(site: URL): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': websiteId(site),
    url: abs(site, '/'),
    name: settings.siteName,
    description: `${settings.descriptor} for growing US companies.`,
    inLanguage: 'en-US',
    publisher: { '@id': orgId(site) },
  };
}

/** Names of intermediate path segments for breadcrumbs. */
const sectionNames: Record<string, string> = { '/cases': 'Case studies', '/partners': 'Partners' };

export function breadcrumbs(site: URL, path: string, name: string): JsonLdNode | null {
  if (path === '/') return null;
  const parts = path.split('/').filter(Boolean);
  const items = [{ name: 'Home', url: abs(site, '/') }];
  parts.forEach((_, i) => {
    const p = '/' + parts.slice(0, i + 1).join('/');
    items.push({ name: i === parts.length - 1 ? name : (sectionNames[p] ?? parts[i]), url: abs(site, p) });
  });
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(site, path)}#breadcrumb`,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

export function webPage(opts: {
  site: URL;
  canonical: string;
  path: string;
  type: PageType;
  title: string;
  description: string;
  breadcrumb: JsonLdNode | null;
}): JsonLdNode {
  const { site, canonical, path, type, title, description, breadcrumb } = opts;
  return {
    '@type': type,
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: 'en-US',
    isPartOf: { '@id': websiteId(site) },
    ...(path === '/' ? { about: { '@id': orgId(site) } } : {}),
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(site, '/og-image.png') },
    ...(breadcrumb ? { breadcrumb: { '@id': breadcrumb['@id'] } } : {}),
  };
}

/** An implementation service offered by Evenmont (no prices: business terms are still being confirmed). */
export function service(site: URL, opts: { id: string; name: string; description: string; url: string; audience?: string }): JsonLdNode {
  return {
    '@type': 'Service',
    '@id': `${abs(site, opts.url)}#service`,
    name: opts.name,
    serviceType: 'Odoo ERP implementation',
    description: opts.description,
    url: abs(site, opts.url),
    provider: { '@id': orgId(site) },
    areaServed: { '@type': 'Country', name: 'United States' },
    ...(opts.audience ? { audience: { '@type': 'BusinessAudience', audienceType: opts.audience } } : {}),
  };
}

/** Removes undefined values so the output is clean JSON. */
export const graph = (nodes: (JsonLdNode | null | undefined)[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) }, (_k, v) => (v === undefined ? undefined : v)).replace(
    /</g,
    '\\u003c',
  );
