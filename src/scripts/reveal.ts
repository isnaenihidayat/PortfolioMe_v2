/* reveal.ts — Scroll reveal system + hero title intro + animation probe */

const vh = () => window.innerHeight;

function inView(el: Element, ratio = 0.88) {
  const r = el.getBoundingClientRect();
  return r.top < vh() * ratio && r.bottom > 0;
}

// ── Hero title intro ──────────────────────────────────────────
let heroPlayed = false;
function playHero() {
  if (heroPlayed) return;
  heroPlayed = true;
  document.querySelectorAll('.hero-title .line > span').forEach((s, i) => {
    const el = s as HTMLElement;
    el.style.transition = 'transform 1s cubic-bezier(0.22,1,0.36,1)';
    el.style.transitionDelay = (0.12 + i * 0.09) + 's';
    el.style.transform = 'translateY(0)';
  });
}

// ── Reveal elements ───────────────────────────────────────────
let reveals: Element[] = [];
function checkReveals() {
  for (let i = reveals.length - 1; i >= 0; i--) {
    const el = reveals[i];
    if (inView(el, 0.9)) {
      el.classList.add('in');
      reveals.splice(i, 1);
    }
  }
}

// ── Timeline progressive fill + dots ─────────────────────────
let tlItems: Element[] = [];
let tlFill: HTMLElement | null = null;
function checkTimeline() {
  let active = 0;
  tlItems.forEach(el => {
    if (inView(el, 0.7)) el.classList.add('in');
    if (el.classList.contains('in')) active++;
  });
  if (tlFill && tlItems.length) {
    tlFill.style.height = (active / tlItems.length * 100) + '%';
  }
}

// ── forceVisible — fallback for non-painting envs ─────────────
export function forceVisible() {
  document.documentElement.classList.remove('anim-on');
  reveals.length = 0;
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('in');
    (el as HTMLElement).style.transition = 'none';
    (el as HTMLElement).style.opacity = '1';
    (el as HTMLElement).style.transform = 'none';
  });
  tlItems.forEach(el => el.classList.add('in'));
  if (tlFill) tlFill.style.height = '100%';
  document.querySelectorAll('.hero-title .line > span').forEach(s => {
    (s as HTMLElement).style.transition = 'none';
    (s as HTMLElement).style.transform = 'none';
  });
  heroPlayed = true;
}

// ── Master scroll tick ────────────────────────────────────────
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    checkReveals();
    checkTimeline();
    ticking = false;
  });
}

// ── Init ──────────────────────────────────────────────────────
export function initReveal() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { forceVisible(); return; }

  reveals = [...document.querySelectorAll('.reveal')];
  tlItems  = [...document.querySelectorAll('.tl-item')];
  tlFill   = document.querySelector<HTMLElement>('.tl-line .fill');

  // Add anim-on so CSS hides elements before animating in
  document.documentElement.classList.add('anim-on');

  // First pass
  checkReveals(); checkTimeline();
  requestAnimationFrame(() => { checkReveals(); checkTimeline(); playHero(); });
  window.addEventListener('load', () => { checkReveals(); checkTimeline(); playHero(); });

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });

  // Probe: check if CSS transitions actually progress
  const probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:fixed;top:-60px;left:-60px;width:4px;height:4px;opacity:0.02;transition:opacity .25s linear;pointer-events:none;';
  document.body.appendChild(probe);
  void probe.offsetWidth;
  probe.style.opacity = '1';
  setTimeout(() => {
    const moved = parseFloat(getComputedStyle(probe).opacity) > 0.4;
    probe.remove();
    if (!moved) forceVisible();
    else { checkReveals(); checkTimeline(); playHero(); }
  }, 220);

  // Ultimate safety net
  setTimeout(() => {
    const s = document.querySelector('.hero-status');
    if (
      document.documentElement.classList.contains('anim-on') &&
      s && parseFloat(getComputedStyle(s).opacity) < 0.5
    ) { forceVisible(); }
  }, 1500);
}
