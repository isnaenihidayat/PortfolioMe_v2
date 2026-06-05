/* ============================================================
   Isnaeni Hidayat — Portfolio · interactions
   Scroll-driven reveals (no IntersectionObserver dependency)
   ============================================================ */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 900px)').matches;

  /* ---------- helpers ---------- */
  const vh = () => window.innerHeight;
  // is element's top within [trigger] portion of viewport?
  function inView(el, ratio) {
    const r = el.getBoundingClientRect();
    return r.top < vh() * (ratio == null ? 0.88 : ratio) && r.bottom > 0;
  }

  /* ---------- Custom cursor ---------- */
  if (!isTouch) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    const hoverables = 'a, button, .skill-card, .project, .post, .btn, .social, .tag, [data-cursor]';
    document.addEventListener('mouseover', e => { if (e.target.closest(hoverables)) ring.classList.add('hover'); });
    document.addEventListener('mouseout', e => { if (e.target.closest(hoverables)) ring.classList.remove('hover'); });
  }

  /* ---------- Hero title intro ---------- */
  let heroPlayed = false;
  function playHero() {
    if (heroPlayed) return;
    heroPlayed = true;
    document.querySelectorAll('.hero-title .line > span').forEach((s, i) => {
      s.style.transition = 'transform 1s cubic-bezier(0.22,1,0.36,1)';
      s.style.transitionDelay = (0.12 + i * 0.09) + 's';
      s.style.transform = 'translateY(0)';
    });
  }

  /* ---------- Reveal elements ---------- */
  const reveals = [...document.querySelectorAll('.reveal')];
  function checkReveals() {
    for (let i = reveals.length - 1; i >= 0; i--) {
      const el = reveals[i];
      if (inView(el, 0.9)) { el.classList.add('in'); reveals.splice(i, 1); }
    }
  }

  /* ---------- Timeline progressive fill + dots ---------- */
  const tlItems = [...document.querySelectorAll('.tl-item')];
  const tlFill = document.querySelector('.tl-line .fill');
  function checkTimeline() {
    let active = 0;
    tlItems.forEach(el => { if (inView(el, 0.7)) { el.classList.add('in'); } if (el.classList.contains('in')) active++; });
    if (tlFill && tlItems.length) tlFill.style.height = (active / tlItems.length * 100) + '%';
  }

  /* ---------- Stat counters ---------- */
  const counters = [...document.querySelectorAll('[data-count]')];
  function runCounter(el) {
    const end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = end + suf; return; }
    let t0 = null, dur = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (Number.isInteger(end) ? Math.round(end * e) : (end * e).toFixed(1)) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function checkCounters() {
    for (let i = counters.length - 1; i >= 0; i--) {
      if (inView(counters[i], 0.92)) { runCounter(counters[i]); counters.splice(i, 1); }
    }
  }

  /* ---------- Terminal typing ---------- */
  const term = document.querySelector('.term-body');
  let termStarted = false;
  function checkTerminal() {
    if (termStarted || !term) return;
    if (!inView(term, 0.8)) return;
    termStarted = true;
    if (reduce) { term.innerHTML = termLines.map(l => `<div class="ln">${l || '&nbsp;'}</div>`).join(''); return; }
    let i = 0;
    (function next() {
      if (i >= termLines.length) return;
      const div = document.createElement('div');
      div.className = 'ln';
      div.innerHTML = termLines[i] || '&nbsp;';
      term.appendChild(div);
      i++;
      setTimeout(next, 230 + Math.random() * 160);
    })();
  }
  const termLines = [
    '<span class="c-prompt">$</span> isnaeni --whoami',
    '<span class="c-str">Fullstack Developer × AI Engineer</span>',
    '',
    '<span class="c-prompt">$</span> cat focus.json',
    '<span class="c-dim">{</span>',
    '  <span class="c-key">"ship"</span>: <span class="c-str">"end-to-end products"</span>,',
    '  <span class="c-key">"ai"</span>: <span class="c-str">"RAG, agents, LLM apps"</span>,',
    '  <span class="c-key">"stack"</span>: <span class="c-str">"TS · Python · infra"</span>',
    '<span class="c-dim">}</span>',
    '',
    '<span class="c-prompt">$</span> <span class="cursor-blink"></span>'
  ];

  /* ---------- Navbar scrolled + active section ---------- */
  const nav = document.querySelector('.nav');
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const navSections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function checkNav() {
    nav.classList.toggle('scrolled', scrollY > 30);
    let curId = navSections[0] && navSections[0].id;
    for (const s of navSections) { if (s.getBoundingClientRect().top <= vh() * 0.35) curId = s.id; }
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + curId));
  }

  /* ---------- Master scroll loop ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      checkReveals(); checkTimeline(); checkCounters(); checkTerminal(); checkNav();
      ticking = false;
    });
    // also run synchronously in case rAF is throttled
    checkNav();
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });

  function initPass() { checkReveals(); checkTimeline(); checkCounters(); checkTerminal(); checkNav(); }

  /* ---------- Reveal-everything fallback (for non-painting envs) ----------
     If the environment doesn't actually advance animation frames, CSS
     transitions freeze at opacity 0. Removing .anim-on drops all the hiding
     rules so content shows at its natural resting state. We also resolve any
     JS-driven values (counters, timeline, terminal) to their end state. */
  function forceVisible() {
    document.documentElement.classList.remove('anim-on');
    reveals.length = 0;
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('in');
      // Set resting values inline with transition off, so an element caught
      // mid-transition doesn't stay frozen at opacity 0 in non-painting contexts.
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    tlItems.forEach(el => el.classList.add('in'));
    if (tlFill) tlFill.style.height = '100%';
    document.querySelectorAll('.hero-title .line > span').forEach(s => { s.style.transition = 'none'; s.style.transform = 'none'; });
    counters.forEach(el => { el.textContent = (el.dataset.count) + (el.dataset.suffix || ''); });
    counters.length = 0;
    if (term && !termStarted) { termStarted = true; term.innerHTML = termLines.map(l => `<div class="ln">${l || '&nbsp;'}</div>`).join(''); }
  }

  /* ---------- Decide whether animations can actually run ----------
     A frame *count* is not enough: in throttled/non-painting contexts the first
     1-2 rAF callbacks fire but transitions never progress, freezing content at
     opacity 0. Instead we measure whether a real transition makes progress,
     sampled with setTimeout (which fires reliably even when rAF is throttled).
     If it doesn't progress, we drop .anim-on so everything shows at rest. */
  document.documentElement.classList.add('anim-on');

  // Kick off the intended animations for healthy browsers right away.
  initPass();
  requestAnimationFrame(() => { initPass(); playHero(); });
  window.addEventListener('load', () => { initPass(); playHero(); });

  // Probe: animate a throwaway element and check it actually moved.
  const probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:fixed;top:-60px;left:-60px;width:4px;height:4px;opacity:0.02;transition:opacity .25s linear;pointer-events:none;';
  document.body.appendChild(probe);
  void probe.offsetWidth;            // force reflow so the change transitions
  probe.style.opacity = '1';
  setTimeout(() => {
    const moved = parseFloat(getComputedStyle(probe).opacity) > 0.4;
    probe.remove();
    if (!moved) forceVisible();       // transitions are frozen → reveal everything
    else { initPass(); playHero(); }  // healthy → make sure above-fold is in
  }, 220);

  // Ultimate safety net: if the hero is *still* hidden later on, force it.
  setTimeout(() => {
    const s = document.querySelector('.hero-status');
    if (document.documentElement.classList.contains('anim-on') && s &&
        parseFloat(getComputedStyle(s).opacity) < 0.5) {
      forceVisible();
    }
  }, 1500);

  /* ---------- Magnetic buttons ---------- */
  if (!isTouch && !reduce) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const str = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * str;
        const y = (e.clientY - r.top - r.height / 2) * str;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Skill card spotlight ---------- */
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Smooth anchor + back to top ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        const y = t.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  });

})();
