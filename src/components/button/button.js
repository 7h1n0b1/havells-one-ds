import { playground, matrix, device } from '../../lib/demo.js';
// Button — reference implementation of components/Button.md, plus the demo.
const LABEL_STYLE = { Large: 't-h2-16', Medium: 't-h3-14', Small: 't-l3strong-12' };
export const TYPES = ['Filled', 'Outlined', 'Text'], SIZES = ['Large', 'Medium', 'Small'];
export const STATES = ['Enabled', 'Hover', 'Pressed', 'Focused', 'Disabled', 'Loading'];

function spinner() {
  // 8 ticks, one every 45° from 12 o'clock clockwise. Box 100: length 16.4, thickness 5.3, centre radius 21.75.
  const ticks = Array.from({ length: 8 }, (_, i) => {
    const a = i * Math.PI / 4, cx = 50 + 21.75 * Math.sin(a), cy = 50 - 21.75 * Math.cos(a);
    const dx = 8.2 * Math.sin(a), dy = -8.2 * Math.cos(a);
    return `<line x1="${cx - dx}" y1="${cy - dy}" x2="${cx + dx}" y2="${cy + dy}" stroke-width="5.3" style="animation-delay:-${((7 - i) % 8) * 300}ms"/>`;
  }).join('');
  return `<svg class="spinner" viewBox="0 0 100 100" aria-hidden="true">${ticks}</svg>`;
}

export function button({ type = 'Filled', size = 'Large', label = 'Button', hasLabel = true,
  leading = null, trailing = null, state = 'Enabled', onClick } = {}) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'hb-button';
  b.dataset.type = type; b.dataset.size = size;
  const icon = n => n ? `<span class="ms" aria-hidden="true">${n}</span>` : '';
  b.innerHTML = `<span class="visible"><span class="content ${LABEL_STYLE[size]}">${icon(leading)}${hasLabel ? `<span class="label">${label}</span>` : ''}${icon(trailing)}</span>${spinner()}</span>`;
  if (!hasLabel) b.setAttribute('aria-label', label); // icon-only keeps an accessible name
  setState(b, state);
  b.addEventListener('click', e => { if (b.getAttribute('aria-busy') === 'true') e.preventDefault(); else onClick?.(e, b); });
  return b;
}

export function setState(b, state) {
  b.classList.remove('is-hover', 'is-pressed', 'is-focused');
  b.disabled = state === 'Disabled';
  b.setAttribute('aria-busy', state === 'Loading');
  if (state === 'Hover') b.classList.add('is-hover');
  if (state === 'Pressed') b.classList.add('is-pressed');
  if (state === 'Focused') b.classList.add('is-focused');
}

export default function demo(stage) {
  playground(stage, {
    note: 'Tap sends a command; the "device" answers after 1.5 s. Hover, press and Tab work for real.',
    controls: [
      { name: 'type', label: 'Type', type: 'select', options: TYPES, value: 'Filled' },
      { name: 'size', label: 'Size', type: 'select', options: SIZES, value: 'Large' },
      { name: 'state', label: 'State', type: 'select', options: ['Enabled', 'Disabled', 'Loading'], value: 'Enabled' },
      { name: 'label', label: 'Label', type: 'text', value: 'Turn on' },
      { name: 'hasLabel', label: 'Has Label', type: 'bool', value: true },
      { name: 'leading', label: 'Leading Icon', type: 'bool', value: false },
      { name: 'trailing', label: 'Trailing Icon', type: 'bool', value: false },
    ],
    render: o => button({
      ...o,
      leading: o.leading || (!o.hasLabel && !o.trailing) ? 'power_settings_new' : null,
      trailing: o.trailing ? 'chevron_right' : null,
      onClick: async (_, b) => { setState(b, 'Loading'); await device(); setState(b, o.state); },
    }),
  });
  matrix(stage, {
    title: 'Every variant (54)',
    cols: STATES,
    rows: TYPES.flatMap(t => SIZES.map(s => `${t} · ${s}`)),
    cell: (r, state) => { const [type, size] = r.split(' · '); return button({ type, size, state, label: 'Button' }); },
  });
}
