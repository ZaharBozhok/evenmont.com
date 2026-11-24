// Every route of the site, for the QA scripts.
export const pages = [
  ['home', '/'],
  ['services', '/services'],
  ['distribution', '/distribution'],
  ['manufacturing', '/manufacturing'],
  ['cases', '/cases'],
  ['case-animal-life-sciences', '/cases/animal-life-sciences-lab'],
  // Demo cases: pre-release builds only (production builds leave them out, so these are 404 there).
  ['case-fieldwork', '/cases/fieldwork-collective'],
  ['case-ridgeway', '/cases/ridgeway-engineering'],
  ['case-copperline', '/cases/copperline-home-goods'],
  ['case-harbor', '/cases/harbor-supply'],
  ['case-tallis', '/cases/tallis-woodworks'],
  ['case-kestrel', '/cases/kestrel-signworks'],
  ['about', '/about'],
  ['security', '/security'],
  ['book', '/book'],
  ['partners', '/partners'],
  ['white-label', '/partners/white-label'],
  ['legal', '/legal'],
  ['privacy', '/privacy'],
  ['terms', '/terms'],
  ['404', '/this-page-does-not-exist'],
];
export const base = process.env.BASE_URL ?? 'http://localhost:4321';
export const launchOptions = { executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox'] };
