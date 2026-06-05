/* nav.ts — Navbar scroll state + active section tracker */

export function initNav() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav  = document.querySelector<HTMLElement>('.nav');
  const links = [...document.querySelectorAll<HTMLAnchorElement>('.nav-links a')];
  const sections = links
    .map(a => document.querySelector<HTMLElement>(a.getAttribute('href')!))
    .filter(Boolean) as HTMLElement[];

  const vh = () => window.innerHeight;

  function checkNav() {
    // Scrolled state
    nav?.classList.toggle('scrolled', window.scrollY > 30);

    // Active section highlight
    let curId = sections[0]?.id ?? '';
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= vh() * 0.35) curId = s.id;
    }
    links.forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === '#' + curId)
    );
  }

  // Smooth anchor scroll
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        const y = t.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  });

  checkNav();
  addEventListener('scroll', checkNav, { passive: true });
  addEventListener('resize', checkNav, { passive: true });
}
