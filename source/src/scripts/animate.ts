/**
 * Motion — "calm, purposeful, once". One small module, no dependencies.
 *
 * 1. [data-animate]  gets .is-in once it is in view; CSS drives the illustration.
 * 2. [data-reveal] (the element) and [data-reveal-children] (each direct child)
 *    rise and fade in as they scroll into view; items that enter together are
 *    staggered. Only items below the fold at load are hidden, so nothing that is
 *    already on screen ever blinks, and nothing is hidden without JS.
 *
 * With prefers-reduced-motion everything is simply shown in its final state.
 */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasIO = 'IntersectionObserver' in window;

if (!reduced && hasIO) {
  /* ---- 1. Illustrations ---- */
  const scenes = document.querySelectorAll('[data-animate]');
  const sceneIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        // Tall elements can never reach 25% of their area on a phone: accept 40% of the viewport instead.
        if (entry.intersectionRatio < 0.25 && entry.intersectionRect.height < innerHeight * 0.4) continue;
        entry.target.classList.add('is-in');
        // A finished part drops its keyframes, so a later re-render (e.g. a resize across a
        // breakpoint) can't replay it.
        entry.target.addEventListener('animationend', (e) => (e.target as Element).classList.remove('k'));
        sceneIO.unobserve(entry.target);
      }
    },
    { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '0px 0px -10% 0px' },
  );
  scenes.forEach((el) => sceneIO.observe(el));

  /* ---- 2. Scroll reveal ---- */
  // The observer's first report tells what is already on screen (left alone) and what is
  // below the fold (hidden until it scrolls in) — no layout reads of our own.
  const items: Element[] = [];
  document.querySelectorAll('[data-reveal]').forEach((el) => items.push(el));
  document.querySelectorAll('[data-reveal-children]').forEach((el) => items.push(...Array.from(el.children)));
  const seen = new WeakSet<Element>();
  const done = (e: Event) => {
    const el = e.currentTarget as HTMLElement;
    if (e.target !== el) return;
    el.classList.remove('rv', 'rv-in');
    el.style.removeProperty('--rv-d');
    el.removeEventListener('transitionend', done);
  };
  const revealIO = new IntersectionObserver(
    (entries) => {
      const entering: IntersectionObserverEntry[] = [];
      for (const entry of entries) {
        const el = entry.target;
        if (!seen.has(el)) {
          seen.add(el);
          if (entry.boundingClientRect.top < innerHeight) revealIO.unobserve(el);
          else el.classList.add('rv');
        } else if (entry.isIntersecting) entering.push(entry);
      }
      entering
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((entry, i) => {
          const el = entry.target as HTMLElement;
          el.style.setProperty('--rv-d', `${Math.min(i, 5) * 90}ms`);
          el.addEventListener('transitionend', done);
          el.classList.add('rv-in');
          revealIO.unobserve(el);
        });
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  items.forEach((el) => revealIO.observe(el));
} else if (!reduced) {
  document.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('is-in'));
}
