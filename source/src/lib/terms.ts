import { getEntry } from 'astro:content';
import { usd } from './text';

/**
 * ⚑ Business terms from src/content/terms.json.
 * `fmt()` fills {name} references in copy with values from terms.vars
 * (plus computed values: feePercent, keepPrice, blueprintFee).
 */
export async function getTerms() {
  const entry = await getEntry('terms', 'terms');
  if (!entry) throw new Error('src/content/terms.json is missing');
  const t = entry.data;

  const pkg = (id: string) => {
    const found = t.packages.find((p) => p.id === id);
    if (!found) throw new Error(`Unknown package "${id}" in terms.json`);
    return found;
  };
  const price = (p: (typeof t.packages)[number]) => (p.price === null ? (p.priceLabel ?? '') : usd(p.price) + (p.unit ?? ''));

  const keep = pkg('keep');
  const vars: Record<string, string> = {
    ...t.vars,
    feePercent: `${Math.round(t.partner.feeRate * 100)}%`,
    keepPrice: price(keep),
    blueprintFee: price(pkg('blueprint')),
  };

  const fmt = (text: string) =>
    text.replace(/(?<!\{)\{([a-zA-Z0-9]+)\}(?!\})/g, (match, key: string) => (key in vars ? vars[key] : match));

  const economics = t.partner.economics.map((e) => {
    const keepAmount = (keep.price ?? 0) * e.keepMonths;
    const total = e.projectAmount + keepAmount;
    return { ...e, keepMonthly: keep.price ?? 0, keepAmount, total, fee: Math.round(total * t.partner.feeRate) };
  });

  return { ...t, vars, fmt, pkg, price, economics };
}

export type Terms = Awaited<ReturnType<typeof getTerms>>;
