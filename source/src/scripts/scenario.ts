/**
 * Scenario switcher — ARIA tabs pattern (automatic activation, arrow keys, Home/End).
 * Panels cross-fade (150ms out / 250ms in). The hero chips select a tab, and the
 * home cases list puts the matching cases first.
 */
const root = document.querySelector<HTMLElement>('[data-tabs]');

if (root) {
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls') ?? '')!);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = Math.max(0, tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true'));
  let timer = 0;

  const orderCases = (scenario: string) => {
    const list = document.querySelector<HTMLElement>('[data-case-list]');
    if (!list) return;
    const cards = Array.from(list.children) as HTMLElement[];
    const sorted = [...cards].sort(
      (a, b) =>
        Number(b.dataset.scenario === scenario) - Number(a.dataset.scenario === scenario) ||
        Number(a.dataset.order) - Number(b.dataset.order),
    );
    sorted.forEach((card) => list.appendChild(card));
    const label = document.querySelector('[data-case-filter-label]');
    if (label) label.textContent = tabs[current].dataset.name ?? '';
  };

  const select = (index: number, focus = false) => {
    if (focus) tabs[index].focus();
    if (index === current) return;
    const prev = panels[current];
    const next = panels[index];
    current = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    window.clearTimeout(timer);
    panels.forEach((p) => p.classList.remove('is-entering', 'is-leaving'));
    prev.classList.add('is-leaving');
    timer = window.setTimeout(
      () => {
        prev.classList.remove('is-active', 'is-leaving');
        next.classList.add('is-active', 'is-entering');
      },
      reduced ? 0 : 150,
    );
    orderCases(tabs[index].dataset.scenario ?? '');
  };

  tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));
  root.querySelector('[role="tablist"]')?.addEventListener('keydown', (event) => {
    const e = event as KeyboardEvent;
    const last = tabs.length - 1;
    const map: Record<string, number> = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    select(map[e.key], true);
  });

  document.querySelectorAll<HTMLAnchorElement>('[data-scenario-set]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const index = tabs.findIndex((tab) => tab.dataset.scenario === link.dataset.scenarioSet);
      if (index < 0) return;
      event.preventDefault();
      select(index);
      root.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      tabs[index].focus({ preventScroll: true });
    });
  });
}
