/* terminal.ts — Terminal typing animation for AI section */

const LINES = [
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
  '<span class="c-prompt">$</span> <span class="cursor-blink"></span>',
];

const vh = () => window.innerHeight;
function inView(el: Element, ratio = 0.88) {
  const r = el.getBoundingClientRect();
  return r.top < vh() * ratio && r.bottom > 0;
}

export function initTerminal() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const term = document.querySelector<HTMLElement>('#terminal-body');
  if (!term) return;

  let started = false;

  function start() {
    if (started) return;
    started = true;

    if (reduce) {
      term.innerHTML = LINES.map(l => `<div class="ln">${l || '&nbsp;'}</div>`).join('');
      return;
    }

    let i = 0;
    function next() {
      if (i >= LINES.length) return;
      const div = document.createElement('div');
      div.className = 'ln';
      div.innerHTML = LINES[i] || '&nbsp;';
      term.appendChild(div);
      // Scroll term to bottom smoothly
      term.scrollTop = term.scrollHeight;
      i++;
      setTimeout(next, 220 + Math.random() * 160);
    }
    next();
  }

  function check() {
    if (!started && inView(term, 0.8)) start();
  }

  check();
  addEventListener('scroll', check, { passive: true });
}
