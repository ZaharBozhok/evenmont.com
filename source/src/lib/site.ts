import settings from '../content/settings.json';

export { settings };

/** Pre-release: noindex on every page + robots Disallow. PRERELEASE=false (env) overrides for a trial launch build. */
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
export const prerelease = env.PRERELEASE ? env.PRERELEASE !== 'false' : settings.prerelease === true;

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

export const legalLine = () =>
  `Evenmont is a registered business name of ${settings.legal.legalName}, a company registered in ${settings.legal.country} ` +
  `(reg. no. ${settings.legal.regNo}; business name reg. no. ${settings.legal.businessNameRegNo}; VAT ${settings.legal.vatNo}). ` +
  `Registered office: ${settings.legal.registeredOffice}. Contact: ${settings.contact.email}.`;
