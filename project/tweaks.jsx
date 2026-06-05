/* Tweaks island — applies design tweaks to the vanilla document via CSS variables.
   Renders only the panel; the rest of the site stays plain HTML/JS. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "violet",
  "depth": "ink",
  "grid": true,
  "motion": true
}/*EDITMODE-END*/;

const ACCENT_HUE = { violet: 265, blue: 250, cyan: 215, magenta: 320 };
const DEPTH_L = { ink: 0.16, deep: 0.125, slate: 0.20 };

function applyTweaks(t) {
  const r = document.documentElement;
  // accent hue
  r.style.setProperty('--acc-hue', String(ACCENT_HUE[t.accent] ?? 265));
  // background depth — recompute surface ladder from a base lightness
  const L = DEPTH_L[t.depth] ?? 0.16;
  r.style.setProperty('--bg', `oklch(${L} 0.012 265)`);
  r.style.setProperty('--bg-2', `oklch(${L + 0.03} 0.014 265)`);
  r.style.setProperty('--surface', `oklch(${L + 0.06} 0.016 265)`);
  r.style.setProperty('--surface-2', `oklch(${L + 0.10} 0.018 265)`);
  // grid texture
  r.classList.toggle('no-grid', !t.grid);
  // motion
  r.classList.toggle('no-motion', !t.motion);
  if (!t.motion) {
    r.classList.remove('anim-on');
    document.querySelectorAll('.reveal, .tl-item').forEach(e => e.classList.add('in'));
    const f = document.querySelector('.tl-line .fill'); if (f) f.style.height = '100%';
  }
}

function TweaksIsland() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);
  return (
    React.createElement(TweaksPanel, { title: 'Tweaks' },
      React.createElement(TweakSection, { label: 'Accent' }),
      React.createElement(TweakRadio, {
        label: 'Hue', value: t.accent,
        options: ['violet', 'blue', 'cyan', 'magenta'],
        onChange: (v) => setTweak('accent', v)
      }),
      React.createElement(TweakSection, { label: 'Surface' }),
      React.createElement(TweakRadio, {
        label: 'Depth', value: t.depth,
        options: ['ink', 'deep', 'slate'],
        onChange: (v) => setTweak('depth', v)
      }),
      React.createElement(TweakToggle, {
        label: 'Grid texture', value: t.grid,
        onChange: (v) => setTweak('grid', v)
      }),
      React.createElement(TweakSection, { label: 'Motion' }),
      React.createElement(TweakToggle, {
        label: 'Animations', value: t.motion,
        onChange: (v) => setTweak('motion', v)
      })
    )
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(React.createElement(TweaksIsland));
