/* cursor.js — Custom cursor: dot + ring with smooth lerp & hover detection */

export function initCursor() {
  const isTouch = window.matchMedia('(max-width: 900px)').matches;
  if (isTouch) return;

  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  // Dot follows instantly
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    (dot as HTMLElement).style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  // Ring lerps behind
  (function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    (ring as HTMLElement).style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  // Hover state
  const hoverables = 'a, button, .btn, .social, .tag, .post, .work-card, .stack-row, [data-cursor]';
  document.addEventListener('mouseover', e => {
    if ((e.target as Element).closest(hoverables)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if ((e.target as Element).closest(hoverables)) ring.classList.remove('hover');
  });
}
