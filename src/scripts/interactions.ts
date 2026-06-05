/* interactions.ts — Main orchestrator: imports & runs all interaction modules */

import { initCursor }   from './cursor';
import { initReveal }   from './reveal';
import { initCounters } from './counter';
import { initTerminal } from './terminal';
import { initMagnetic } from './magnetic';
import { initNav }      from './nav';

// Run everything after DOM is ready
function boot() {
  initNav();       // navbar scrolled state + active section + smooth anchors
  initReveal();    // scroll reveals + hero title + timeline fill + animation probe
  initCounters();  // stat number count-up
  initTerminal();  // terminal typing animation
  initCursor();    // custom cursor dot + ring
  initMagnetic();  // magnetic buttons + skill card spotlight
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
