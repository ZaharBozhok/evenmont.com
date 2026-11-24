import settings from '../content/settings.json';

export { settings };

/**
 * Build environment.
 *
 *   SITE_ENV=production  → the public site: indexable (no noindex, robots.txt allows crawling) and
 *                          unverified demo content is NOT rendered. Set by the GitHub Pages workflow.
 *   SITE_ENV=preview     → pre-release preview: noindex everywhere + robots.txt Disallow, demo content shown.
 *   (unset)              → local development / ad-hoc builds: PRERELEASE env if set, else settings.prerelease
 *                          (true in the repository, so an accidental build is never indexable).
 *
 * Invariant: unverified content (settings.demo.fields, `demo: true` / `placeholder: true` cases) is only
 * ever rendered in noindex builds. scripts/validate-build.mjs checks the generated site for this.
 */
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
const siteEnvRaw = (env.SITE_ENV ?? '').trim().toLowerCase();
if (siteEnvRaw && siteEnvRaw !== 'production' && siteEnvRaw !== 'preview') {
  throw new Error(`SITE_ENV must be "production" or "preview" (got "${env.SITE_ENV}").`);
}
export const siteEnv: 'production' | 'preview' | 'development' = (siteEnvRaw || 'development') as never;
if (siteEnv === 'production' && env.PRERELEASE && env.PRERELEASE !== 'false') {
  throw new Error('SITE_ENV=production cannot be combined with PRERELEASE=true.');
}

/** Pre-release: noindex on every page + robots.txt Disallow. */
export const prerelease =
  siteEnv === 'production' ? false : siteEnv === 'preview' ? true : env.PRERELEASE ? env.PRERELEASE !== 'false' : settings.prerelease === true;

/** Unverified (demo) content is shown only in pre-release builds, which are never indexable. */
export const showUnverified = prerelease;

const demoFields: string[] = settings.demo?.fields ?? [];

/** True when a settings path (e.g. "legal.regNo", "proof.rating") is not listed, itself or via a parent, in settings.demo.fields. */
export const isVerified = (field: string) => !demoFields.some((f) => field === f || field.startsWith(`${f}.`));

/** Whether a settings value may be rendered in this build. */
export const show = (field: string) => showUnverified || isVerified(field);

/** Case studies that may be rendered in this build (demo and sample cases only in pre-release builds). */
export const isPublicCase = (entry: { data: { demo?: boolean; placeholder?: boolean } }) =>
  showUnverified || (!entry.data.demo && !entry.data.placeholder);

export type Mood = 'client' | 'partner' | 'partner-dark';
export type NavItem = { label: string; href: string };
export type Cta = { label: string; short: string; href: string };

export const clientNav: NavItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'Distribution', href: '/distribution' },
  { label: 'Manufacturing', href: '/manufacturing' },
  { label: 'Cases', href: '/cases' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'For partners', href: '/partners' },
];

export const partnerNav: NavItem[] = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'What you get', href: '#what-you-get' },
  { label: 'Risks', href: '#risks' },
  { label: 'CPA rules', href: '#cpa-rules' },
  { label: 'FAQ', href: '#faq' },
];

/** Same header pattern on the white-label page, pointing at its own sections. */
export const whiteLabelNav: NavItem[] = [
  { label: 'How it works', href: '#process' },
  { label: 'What you get', href: '#when' },
  { label: 'Risks', href: '#risks' },
  { label: 'Commercials', href: '#commercials' },
  { label: 'FAQ', href: '#faq' },
];

export const ctas = {
  client: { label: 'Book a fit call', short: 'Book a call', href: '/book' },
  partner: { label: 'Book a partner intro', short: 'Book an intro', href: '#apply' },
  whiteLabel: { label: 'Send us a scope', short: 'Send a scope', href: '#scope' },
} satisfies Record<string, Cta>;

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: 'Solutions',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Distribution', href: '/distribution' },
      { label: 'Manufacturing', href: '/manufacturing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'How we work', href: '/#process' },
      { label: 'Cases', href: '/cases' },
      { label: 'About', href: '/about' },
      { label: 'Security & data', href: '/security' },
    ],
  },
  {
    title: 'Partners',
    links: [
      { label: 'Partner program', href: '/partners' },
      { label: 'White-label', href: '/partners/white-label' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Legal notice', href: '/legal' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

export const legalLine = () => {
  const l = settings.legal;
  const ids = [
    show('legal.regNo') && `reg. no. ${l.regNo}`,
    show('legal.businessNameRegNo') && `business name reg. no. ${l.businessNameRegNo}`,
    show('legal.vatNo') && `VAT ${l.vatNo}`,
  ].filter(Boolean);
  return (
    `Evenmont is a registered business name of ${l.legalName}, a company registered in ${l.country}` +
    (ids.length ? ` (${ids.join('; ')})` : '') +
    '.' +
    (show('legal.registeredOffice') ? ` Registered office: ${l.registeredOffice}.` : '') +
    ` Contact: ${settings.contact.email}.`
  );
};
