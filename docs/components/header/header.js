import { playground, matrix } from '../../lib/demo.js';
import { button } from '../button/button.js';
// Header — components/Header.md, plus the demo.
export const SURFACES = ['Solid', 'Transparent'], SHADOWS = ['Yes', 'No'];
export const MODES = ['Default', 'Selection'], DEVICES = ['Android', 'Notch', 'Dynamic Island'];
export const ACTION_STATES = ['Enabled', 'Hover', 'Pressed', 'Focused', 'Disabled'];

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const icon = name => { const s = el('span', 'ms', name); s.setAttribute('aria-hidden', 'true'); return s; };

// .Header_Action — internal to Header.
export function headerAction({ icon: name = 'more_vert', label, state = 'Enabled', onClick } = {}) {
  const b = el('button', 'hb-header-action');
  b.type = 'button';
  b.setAttribute('aria-label', label ?? name);
  const layer = el('span', 'layer');
  layer.append(icon(name));
  b.append(layer);
  setActionState(b, state);
  b.addEventListener('click', e => onClick?.(e, b));
  return b;
}

export function setActionState(b, state) {
  b.classList.remove('is-hover', 'is-pressed', 'is-focused');
  b.disabled = state === 'Disabled';
  if (state === 'Hover') b.classList.add('is-hover');
  if (state === 'Pressed') b.classList.add('is-pressed');
  if (state === 'Focused') b.classList.add('is-focused');
}

export function header({ surface = 'Solid', shadow = 'Yes', mode = 'Default', device = 'Android',
  leading = true, title = 'Sample text for header', subtitle = false, subtitleText = '2 Devices',
  action1 = true, action2 = true,
  action1Props = {}, action2Props = {}, leadingProps = {}, onLeading, onSelectAll } = {}) {
  const h = el('header', 'hb-header');
  h.setAttribute('role', 'banner');
  h.dataset.surface = surface; h.dataset.device = device; h.dataset.mode = mode;
  h.dataset.shadow = surface === 'Transparent' ? 'No' : shadow; // Transparent + shadow is not built

  // Status bar: drawn art, not a real status bar.
  const sb = el('div', 'status-bar');
  sb.setAttribute('aria-hidden', 'true');
  const glyphs = el('span', 'glyphs');
  glyphs.append(icon('signal_cellular_alt'), icon('wifi'), icon('battery_full'));
  sb.append(el('span', 'clock t-l3strong-12', '9:41'), glyphs);

  const row = el('div', 'contents');
  if (leading) {
    const sel = mode === 'Selection';
    row.append(headerAction({ icon: sel ? 'close' : 'arrow_back', label: sel ? 'Cancel selection' : 'Back', onClick: onLeading, ...leadingProps }));
  }
  const tb = el('div', 'title-block');
  tb.append(el('h1', 'title t-h1-18', title));
  if (subtitle) tb.append(el('p', 'subtitle t-l3strong-12', subtitleText));
  row.append(tb);
  const tr = el('div', 'trailing');
  if (mode === 'Selection') tr.append(button({ type: 'Text', size: 'Small', label: 'Select all', onClick: onSelectAll }));
  else {
    if (action1) tr.append(headerAction({ label: 'More options', ...action1Props }));
    if (action2) tr.append(headerAction({ label: 'More options', ...action2Props }));
  }
  row.append(tr);
  h.append(sb, row);
  return h;
}

const screen = (n, device) => { const s = el('div', 'hb-header-screen'); s.dataset.device = device; if (n) s.append(n); return s; };

export default function demo(stage) {
  playground(stage, {
    note: 'Back, the trailing actions, Cancel selection and Select all all respond; hover, press and Tab work for real. Shadow is ignored on Transparent (not built). The status bar is drawn placeholder art: its glyphs, clock style and inset are not specified. Keyboard focus ring fails 3:1 in Loyalty and Studio on some surfaces (Open questions). No transition between Default and Selection, by spec.',
    controls: [
      { name: 'surface', label: 'Surface', type: 'select', options: SURFACES, value: 'Solid' },
      { name: 'shadow', label: 'Shadow', type: 'select', options: SHADOWS, value: 'Yes' },
      { name: 'mode', label: 'Mode', type: 'select', options: MODES, value: 'Default' },
      { name: 'device', label: 'Device', type: 'select', options: DEVICES, value: 'Android' },
      { name: 'leading', label: 'Leading', type: 'bool', value: true },
      { name: 'title', label: 'Title', type: 'text', value: 'Devices' },
      { name: 'subtitle', label: 'Subtitle', type: 'bool', value: false },
      { name: 'subtitleText', label: 'Subtitle Text', type: 'text', value: '2 Devices' },
      { name: 'action1', label: 'Action 1', type: 'bool', value: true },
      { name: 'action2', label: 'Action 2', type: 'bool', value: true },
      { name: 'action2State', label: 'Action 2 State', type: 'select', options: ['Enabled', 'Disabled'], value: 'Enabled' },
    ],
    render: o => {
      const wrap = screen(null, o.device);
      const log = el('p', 'hb-header-log t-b3-12', 'Tap an action.');
      let mode = o.mode, title = o.title;
      const paint = () => {
        wrap.replaceChildren(header({
          ...o, mode, title: mode === 'Selection' && title === o.title ? '1 selected' : title,
          action1Props: { icon: 'add', label: 'Add device', onClick: () => { log.textContent = 'Add device'; } },
          action2Props: { icon: 'more_vert', label: 'More options', state: o.action2State, onClick: () => { log.textContent = 'More options'; } },
          onLeading: () => {
            if (mode === 'Selection') { mode = 'Default'; title = o.title; paint(); log.textContent = 'Selection cancelled'; wrap.querySelector('.hb-header-action')?.focus(); }
            else log.textContent = 'Back: pops the screen';
          },
          onSelectAll: () => { title = '12 selected'; paint(); log.textContent = 'Select all'; },
        }), log);
      };
      paint();
      return wrap;
    },
  });
  matrix(stage, {
    title: 'Every variant (18)',
    cols: DEVICES,
    rows: [['Solid', 'Yes'], ['Solid', 'No'], ['Transparent', 'No']].flatMap(([s, sh]) => MODES.map(m => `${s} · Shadow ${sh} · ${m}`)),
    cell: (r, device) => {
      const [surface, sh, mode] = r.split(' · ');
      return screen(header({ surface, shadow: sh.replace('Shadow ', ''), mode, device }), device);
    },
  });
  matrix(stage, {
    title: '.Header_Action (5)',
    cols: ACTION_STATES,
    rows: ['more_vert'],
    cell: (name, state) => headerAction({ icon: name, label: 'More options', state }),
  });
  matrix(stage, {
    title: 'Booleans, Android',
    cols: ['Android'],
    rows: ['Leading = false', 'Subtitle = true', 'Action 2 = false', 'No actions'],
    cell: r => screen(header({
      leading: r !== 'Leading = false', subtitle: r === 'Subtitle = true',
      action2: !['Action 2 = false', 'No actions'].includes(r), action1: r !== 'No actions',
    }), 'Android'),
  });
}
