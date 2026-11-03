import { playground, matrix } from '../../lib/demo.js';
// Read-only List_Item — components/Read-only List_Item.md, plus the demo.
export const LEADING = ['None', 'Icon', 'Media'], TRAILING = ['None', 'Value'];

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const icon = name => { const s = el('span', 'ms', name); s.setAttribute('aria-hidden', 'true'); return s; };

export function readOnlyListItem({ leading = 'None', trailing = 'None',
  title = 'Primary text', overline = 'Label', supporting = 'Supporting text',
  hasOverline = false, hasSupporting = true, divider = true,
  leadingIcon = 'info', media = 'image', value = 'Value' } = {}) {
  // Not a control: plain content. Property + value pair reads as term / definition.
  const row = el('div', 'hb-read-only-list-item');
  const layer = el('div', 'state-layer');
  if (leading !== 'None') {
    const l = el('span', 'leading');
    if (leading === 'Icon') l.append(icon(leadingIcon));
    else { const m = el('span', 'media'); m.append(icon(media)); l.append(m); }
    layer.append(l);
  }
  const c = el('div', 'content');
  if (hasOverline) c.append(el('span', 'overline t-overline', overline));
  c.append(el('span', 'title t-l2-14', title));
  if (hasSupporting) c.append(el('span', 'supporting t-b3-12', supporting));
  layer.append(c);
  if (trailing === 'Value') {
    const t = el('div', 'trailing');
    t.append(el('span', 'value t-l2-14', value));
    c.setAttribute('role', 'term'); t.setAttribute('role', 'definition');
    layer.append(t);
  }
  row.append(layer);
  if (divider) { const d = el('span', 'divider'); d.setAttribute('aria-hidden', 'true'); row.append(d); }
  return row;
}

const screen = n => { const s = el('div', 'hb-read-only-list-item-screen'); s.append(n); return s; };

export default function demo(stage) {
  playground(stage, {
    note: 'Not interactive by design: no hover, press, focus or disabled; it is skipped by Tab. Value has no text property in Figma; the text input is for the demo. The Tag trailing slot waits on Tag (Open questions). Media is a placeholder 40 slot. Not for Lux, or Loyalty on Surface_1 (contrast).',
    controls: [
      { name: 'leading', label: 'Leading Element', type: 'select', options: LEADING, value: 'None' },
      { name: 'trailing', label: 'Trailing Element', type: 'select', options: TRAILING, value: 'Value' },
      { name: 'title', label: 'Title', type: 'text', value: 'Serial number' },
      { name: 'value', label: 'Value', type: 'text', value: 'HAV-1032-8871' },
      { name: 'overline', label: 'Overline', type: 'text', value: 'Device' },
      { name: 'supporting', label: 'Supporting text', type: 'text', value: 'Printed under the front panel' },
      { name: 'hasOverline', label: 'Has Overline', type: 'bool', value: false },
      { name: 'hasSupporting', label: 'Has Supporting text', type: 'bool', value: false },
      { name: 'divider', label: 'Divider', type: 'bool', value: true },
      { name: 'leadingIcon', label: 'Leading Icon', type: 'text', value: 'tag' },
    ],
    render: o => screen(readOnlyListItem(o)),
  });
  matrix(stage, {
    title: 'Every variant (6)',
    cols: TRAILING,
    rows: LEADING,
    cell: (leading, trailing) => screen(readOnlyListItem({ leading, trailing })),
  });
  matrix(stage, {
    title: 'Content lines',
    note: 'Geometry: 48 · 52 · 65 high.',
    cols: TRAILING,
    rows: ['Title only', 'Title + Supporting', 'Title + Overline + Supporting'],
    cell: (r, trailing) => screen(readOnlyListItem({ trailing, hasOverline: r.includes('Overline'), hasSupporting: r.includes('Supporting') })),
  });
}
