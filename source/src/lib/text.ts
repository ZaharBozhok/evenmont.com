/** Helpers for copy: placeholder tokens stay visible and easy to find. */

const TOKEN = /\{\{[A-Z0-9_]+\}\}/g;

/** True when the value still contains a {{PLACEHOLDER}} token. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return !!value && /\{\{[A-Z0-9_]+\}\}/.test(value);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escapes text and wraps {{TOKENS}} in <span class="ph"> so they are visibly marked. */
export function phHtml(value: string): string {
  return escapeHtml(value).replace(TOKEN, (token) => `<span class="ph">${token}</span>`);
}

/** Escapes text and keeps hyphenated words on one line ("30-minute", "e-commerce") in headings. */
export function noBreakHyphens(value: string): string {
  return escapeHtml(value).replace(/(\S*\w-\w\S*)/g, '<span class="nowrap">$1</span>');
}

/** Money in US format: 9500 → "$9,500". */
export function usd(amount: number): string {
  return '$' + amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/** Initials for an avatar, or "" while the name is still a placeholder. */
export function initials(name: string): string {
  if (isPlaceholder(name)) return '';
  return name
    .split(',')[0] // "Priya Raman, CPA" → "PR"
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
