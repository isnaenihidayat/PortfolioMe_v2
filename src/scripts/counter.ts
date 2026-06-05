/* counter.ts — Animated stat counters with cubic ease-out */

const vh = () => window.innerHeight;
function inView(el: Element, ratio = 0.88) {
  const r = el.getBoundingClientRect();
  return r.top < vh() * ratio && r.bottom > 0;
}

function runCounter(el: HTMLElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const end = parseFloat(el.dataset.count!);
  const suf = el.dataset.suffix || '';

  if (reduce) { el.textContent = end + suf; return; }

  let t0: number | null = null;
  const dur = 1400;

  function step(ts: number) {
    if (!t0) t0 = ts;
    const p = Math.min((ts - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3); // cubic ease-out
    const val = Number.isInteger(end)
      ? Math.round(end * e)
      : (end * e).toFixed(1);
    el.textContent = val + suf;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function initCounters() {
  let counters = [...document.querySelectorAll<HTMLElement>('[data-count]')];

  function check() {
    for (let i = counters.length - 1; i >= 0; i--) {
      if (inView(counters[i], 0.92)) {
        runCounter(counters[i]);
        counters.splice(i, 1);
      }
    }
  }

  check();
  addEventListener('scroll', check, { passive: true });
  addEventListener('resize', check, { passive: true });
}
