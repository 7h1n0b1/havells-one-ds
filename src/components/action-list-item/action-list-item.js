import { playground, matrix } from '../../lib/demo.js';
// Action List_Item — components/Action List_Item.md, plus the demo.
export const LEADING = ['None', 'Icon', 'Media'], TRAILING = ['Chevron', 'Meta', 'None'];
export const STATES = ['Enabled', 'Hover', 'Pressed', 'Focused', 'Disabled'];

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const icon = name => { const s = el('span', 'ms', name); s.setAttribute('aria-hidden', 'true'); return s; };

export function actionListItem({ leading = 'None', trailing = 'Chevron', state = 'Enabled',
  title = 'Primary text', overline = 'Label', supporting = 'Supporting text',
  hasOverline = false, hasSupporting = true, divider = true,
  leadingIcon = 'settings', media = 'image', meta = 'Meta', onClick } = {}) {
  const b = el('button', 'hb-action-list-item');
  b.type = 'button';
  const layer = el('span', 'state-layer');
  if (leading !== 'None') {
    const l = el('span', 'leading');
    if (leading === 'Icon') l.append(icon(leadingIcon));
    else { const m = el('span', 'media'); m.append(icon(media)); l.append(m); }
    layer.append(l);
  }
  const c = el('span', 'content');
  if (hasOverline) c.append(el('span', 'overline t-overline', overline));
  c.append(el('span', 'title t-l2-14', title));
  if (hasSupporting) c.append(el('span', 'supporting t-b3-12', supporting));
  layer.append(c);
  if (trailing !== 'None') {
    const t = el('span', 'trailing');
    t.append(trailing === 'Chevron' ? icon('chevron_right') : el('span', 'meta-text t-b3-12', meta));
    layer.append(t);
  }
  b.append(layer);
  if (divider) { const d = el('span', 'divider'); d.setAttribute('aria-hidden', 'true'); b.append(d); }
  setState(b, state);
  b.addEventListener('click', e => onClick?.(e, b));
  return b;
}

export function setState(b, state) {
  b.classList.remove('is-hover', 'is-pressed', 'is-focused');
  b.disabled = state === 'Disabled';
  if (state === 'Hover') b.classList.add('is-hover');
  if (state === 'Pressed') b.classList.add('is-pressed');
  if (state === 'Focused') b.classList.add('is-focused');
}

const screen = n => { const s = el('div', 'hb-action-list-item-screen'); s.append(n); return s; };

export default function demo(stage) {
  playground(stage, {
    note: 'Tap, hover and Tab work for real. Meta has no text property in Figma; "Meta" and Body/B3 (12) are used here (spec allows L4 or B3). Secondary-action slot is deferred (Open questions). Media is a placeholder 40 slot. Not for Lux, or Loyalty on Surface_1 (contrast).',
    controls: [
      { name: 'leading', label: 'Leading Element', type: 'select', options: LEADING, value: 'None' },
      { name: 'trailing', label: 'Trailing Element', type: 'select', options: TRAILING, value: 'Chevron' },
      { name: 'state', label: 'State', type: 'select', options: ['Enabled', 'Disabled'], value: 'Enabled' },
      { name: 'title', label: 'Title', type: 'text', value: 'Change password' },
      { name: 'overline', label: 'Overline', type: 'text', value: 'Account' },
      { name: 'supporting', label: 'Supporting text', type: 'text', value: 'You last changed this in March' },
      { name: 'hasOverline', label: 'Has Overline', type: 'bool', value: false },
      { name: 'hasSupporting', label: 'Has Supporting text', type: 'bool', value: true },
      { name: 'divider', label: 'Divider', type: 'bool', value: true },
      { name: 'leadingIcon', label: 'Leading Icon', type: 'text', value: 'lock' },
    ],
    render: o => {
      const log = el('p', 'hb-action-list-item-log t-b3-12', 'Tap the row.');
      let n = 0;
      const row = actionListItem({ ...o, onClick: () => { log.textContent = `Tapped "${o.title}" (${++n})`; } });
      const s = screen(row); s.append(log);
      return s;
    },
  });
  matrix(stage, {
    title: 'Every variant (45)',
    cols: STATES,
    rows: LEADING.flatMap(l => TRAILING.map(t => `${l} · ${t}`)),
    cell: (r, state) => { const [leading, trailing] = r.split(' · '); return screen(actionListItem({ leading, trailing, state })); },
  });
  matrix(stage, {
    title: 'Content lines',
    note: 'Geometry: 48 · 52 · 52 · 65 high.',
    cols: ['Enabled'],
    rows: ['Title only', 'Title + Overline', 'Title + Supporting', 'Title + Overline + Supporting'],
    cell: r => screen(actionListItem({ hasOverline: r.includes('Overline'), hasSupporting: r.includes('Supporting') })),
  });
}
