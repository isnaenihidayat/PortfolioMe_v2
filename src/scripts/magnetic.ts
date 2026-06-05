/* magnetic.ts — Magnetic buttons + skill card spotlight */

export function initMagnetic() {
  const isTouch  = window.matchMedia('(max-width: 900px)').matches;
  const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Magnetic buttons ──────────────────────────────────────
  if (!isTouch && !reduce) {
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(el => {
      const str = parseFloat(el.dataset.magnetic!) || 0.3;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * str;
        const y = (e.clientY - r.top  - r.height / 2) * str;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ── Skill card spotlight (--mx / --my CSS vars) ───────────
  document.querySelectorAll<HTMLElement>('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top)  + 'px');
    });
  });
}
