import { playground, matrix } from '../../lib/demo.js';
// Tabs — components/Tabs.md, plus the demo.
export const TYPES = ['Primary', 'Secondary'], CONFIGS = ['Text Only', 'Text + Icon', 'Icon Only'], SCROLLING = ['No', 'Yes'];
export const STATES = ['Enabled', 'Hover', 'Pressed', 'Focused', 'Disabled'];
export const BLOCKS = [['Primary', 'Text Only'], ['Primary', 'Text + Icon'], ['Primary', 'Icon Only'], ['Secondary', 'Text Only'], ['Secondary', 'Text + Icon']];
const DEFAULT_ITEMS = Array.from({ length: 5 }, () => ({ label: 'Tab', icon: 'star' }));

let uid = 0;
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

export function setState(t, state) {
  t.classList.remove('is-hover', 'is-pressed', 'is-focused');
  t.disabled = state === 'Disabled';
  if (state === 'Hover') t.classList.add('is-hover');
  if (state === 'Pressed') t.classList.add('is-pressed');
  if (state === 'Focused') t.classList.add('is-focused');
}

function setSelected(t, yes) {
  t.setAttribute('aria-selected', yes);
  t.tabIndex = yes ? 0 : -1; // one stop for the row
  const l = t.querySelector('.label');
  if (l) l.className = `label ${yes ? 't-h3-14' : 't-l2-14'}`;
}

// items: [{ label, icon, state }]. Tabs 1 and 2 always show; tab3..tab5 toggle the rest.
export function tabs({ type = 'Primary', configuration = 'Text Only', scrolling = 'No',
  tab3 = true, tab4 = false, tab5 = false, items = DEFAULT_ITEMS, selected = 0,
  label = 'Views', onSelect } = {}) {
  const row = el('div', 'hb-tabs');
  Object.assign(row.dataset, { type, config: configuration, scrolling });
  const group = el('div', 'group');
  group.setAttribute('role', 'tablist');
  group.setAttribute('aria-label', label);
  const show = [true, true, tab3, tab4, tab5];
  const list = items.filter((_, i) => show[i]).map((it, i) => {
    const t = el('button', 'hb-tab');
    t.type = 'button'; t.id = `hb-tab-${++uid}`;
    t.setAttribute('role', 'tab');
    const contents = el('span', 'tab-contents');
    if (configuration !== 'Text Only') { const ic = el('span', 'ms', it.icon); ic.setAttribute('aria-hidden', 'true'); contents.append(ic); }
    if (configuration !== 'Icon Only') contents.append(el('span', 'label', it.label));
    else t.setAttribute('aria-label', it.label); // Icon Only: the name comes from the screen
    contents.append(el('span', 'indicator'));
    const layer = el('span', 'state-layer');
    layer.append(contents);
    t.append(layer);
    setState(t, it.state ?? 'Enabled');
    setSelected(t, i === selected);
    t.addEventListener('click', () => select(i));
    group.append(t);
    return t;
  });
  function select(i, focus = false) {
    const t = list[i];
    if (!t || t.disabled) return;
    list.forEach((x, j) => setSelected(x, j === i));
    if (focus) t.focus();
    if (scrolling === 'Yes') t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    onSelect?.(i, t);
  }
  // Arrow keys move the selection; disabled tabs are skipped; Tab leaves the row.
  group.addEventListener('keydown', e => {
    const cur = list.findIndex(t => t.getAttribute('aria-selected') === 'true');
    const n = list.length, step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    let next = -1;
    if (step) { for (let k = 1; k <= n; k++) { const j = (cur + step * k + n * k) % n; if (!list[j].disabled) { next = j; break; } } }
    else if (e.key === 'Home') next = list.findIndex(t => !t.disabled);
    else if (e.key === 'End') next = list.length - 1 - [...list].reverse().findIndex(t => !t.disabled);
    else return;
    e.preventDefault();
    if (next >= 0) select(next, true);
  });
  row.append(group, el('div', 'divider'));
  row.tabs = list;
  return row;
}

const screen = (...n) => { const s = el('div', 'hb-tabs-screen'); s.append(...n); return s; };
const VIEWS = [
  { label: 'Overview', icon: 'home' }, { label: 'Usage', icon: 'bar_chart' }, { label: 'Schedule', icon: 'schedule' },
  { label: 'Energy', icon: 'bolt' }, { label: 'Alerts', icon: 'notifications' },
];

export default function demo(stage) {
  playground(stage, {
    note: 'Tap or use arrow keys (Home / End too) to switch tabs; the panel below changes. Only the selected tab is in the Tab order. No indicator motion, by spec (Open questions). Icon Only is built for Primary only; Secondary Icon Only is an open question. Indicator misses 3:1 in Loyalty, focus ring in Loyalty and Studio.',
    controls: [
      { name: 'type', label: 'Type', type: 'select', options: TYPES, value: 'Primary' },
      { name: 'configuration', label: 'Configuration', type: 'select', options: CONFIGS, value: 'Text Only' },
      { name: 'scrolling', label: 'Scrolling', type: 'select', options: SCROLLING, value: 'No' },
      { name: 'tab3', label: 'Tab 3', type: 'bool', value: true },
      { name: 'tab4', label: 'Tab 4', type: 'bool', value: false },
      { name: 'tab5', label: 'Tab 5', type: 'bool', value: false },
      { name: 'tab2State', label: 'Tab 2 State', type: 'select', options: ['Enabled', 'Disabled'], value: 'Enabled' },
    ],
    render: o => {
      if (o.type === 'Secondary' && o.configuration === 'Icon Only')
        return el('p', 't-b3-12 meta', 'Secondary / Icon Only is not built (Open questions).');
      const panel = el('div', 'hb-tabs-panel t-b2-14');
      panel.setAttribute('role', 'tabpanel'); panel.tabIndex = 0;
      const items = VIEWS.map((v, i) => ({ ...v, state: i === 1 ? o.tab2State : 'Enabled' }));
      const shown = items.filter((_, i) => [true, true, o.tab3, o.tab4, o.tab5][i]);
      const show = (i, t) => { panel.setAttribute('aria-labelledby', t.id); panel.textContent = `${shown[i].label} view fills the screen here.`; };
      const row = tabs({ ...o, items, onSelect: show });
      row.tabs.forEach(t => t.setAttribute('aria-controls', (panel.id ||= `hb-tabpanel-${++uid}`)));
      show(0, row.tabs[0]);
      return screen(row, panel);
    },
  });
  matrix(stage, {
    title: 'Every variant (10)',
    note: 'Three tabs, first selected, at 360 wide.',
    cols: SCROLLING,
    rows: BLOCKS.map(b => b.join(' · ')),
    cell: (r, scrolling) => { const [type, configuration] = r.split(' · '); return screen(tabs({ type, configuration, scrolling })); },
  });
  matrix(stage, {
    title: 'One tab: State × Selected (10 per building block)',
    cols: STATES,
    rows: BLOCKS.flatMap(b => ['Yes', 'No'].map(s => `${b.join(' · ')} · Selected ${s}`)),
    cell: (r, state) => {
      const [type, configuration, sel] = r.split(' · ');
      return tabs({ type, configuration, scrolling: 'Yes', items: [{ label: 'Tab', icon: 'star', state }], selected: sel === 'Selected Yes' ? 0 : -1 });
    },
  });
}
