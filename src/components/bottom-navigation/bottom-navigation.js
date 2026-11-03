import { playground, matrix } from '../../lib/demo.js';
// Bottom Navigation — components/Bottom Navigation.md, plus the demo.
export const BRANDS = ['Havells', 'Lloyd', 'Crabtree', 'Standard', 'Product'];
export const STATES = ['Enabled', 'Hover', 'Pressed', 'Focused', 'Disabled'];
const DEFAULTS = [
  ['Control', 'tune'], ['Timer', 'timer'], ['Schedule', 'calendar_month'], ['Energy', 'bolt'],
  ['Modes', 'mode_fan'], ['Sleep', 'bedtime'], ['Settings', 'settings'],
].map(([label, icon]) => ({ label, icon }));
let uid = 0;

// One .Bottom_Nav_Segment. Geometry depends on Selected only; State never moves it.
export function segment({ label = 'Label', icon = 'tune', hasIcon = true, hasBadge = false,
  brand = 'Havells', selected = false, state = 'Enabled' } = {}) {
  const b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('role', 'tab');
  b.className = 'hb-bottom-navigation-segment';
  b.dataset.brand = brand;
  b.innerHTML = `<span class="layer"><span class="content">${hasIcon ? `<span class="ms" aria-hidden="true">${icon}</span>` : ''}<span class="label-row"><span class="label"></span>${hasBadge ? '<span class="badge"></span>' : ''}</span></span></span>`;
  b.querySelector('.label').textContent = label;
  // OPEN: what a visible badge announces is not decided; a neutral hint stands in.
  if (hasBadge) b.setAttribute('aria-description', 'has activity');
  setSelected(b, selected);
  setState(b, state);
  return b;
}

export function setSelected(b, on) {
  b.setAttribute('aria-selected', on);
  b.tabIndex = on ? 0 : -1;
  b.querySelector('.label').className = `label ${on ? 't-l3strong-12' : 't-l3-12'}`;
}

export function setState(b, state) {
  b.classList.remove('is-hover', 'is-pressed', 'is-focused');
  b.disabled = state === 'Disabled';
  if (state === 'Hover') b.classList.add('is-hover');
  if (state === 'Pressed') b.classList.add('is-pressed');
  if (state === 'Focused') b.classList.add('is-focused');
}

// The belt. segments: [{label, icon, badge, disabled}], 2–7. Exactly one selected.
export function bottomNavigation({ segments = DEFAULTS.slice(0, 2), selected = 0, brand = 'Havells',
  hasIcon = true, label = 'Controls', onSelect } = {}) {
  const belt = document.createElement('div');
  belt.className = 'hb-bottom-navigation';
  belt.dataset.scroll = segments.length >= 4; // 2–3 share the width; 4+ hug and scroll
  belt.innerHTML = '<div class="viewport"><div class="row" role="tablist"></div></div>';
  const vp = belt.querySelector('.viewport'), row = belt.querySelector('.row');
  row.setAttribute('aria-label', label);
  const id = `bn-${++uid}`;
  const tabs = segments.map((s, i) => {
    const t = segment({ ...s, hasBadge: s.badge, brand, hasIcon, selected: i === selected,
      state: s.disabled ? 'Disabled' : 'Enabled' });
    t.id = `${id}-t${i}`;
    t.setAttribute('aria-controls', `${id}-p${i}`);
    t.addEventListener('click', () => select(i, true));
    row.append(t);
    return t;
  });
  let current = selected;

  // offset = clamp(segmentCentre − viewportWidth/2, 0, rowWidth − viewportWidth). Manual scroll never changes selection.
  function centre(smooth) {
    const t = tabs[current];
    const target = t.offsetLeft + t.offsetWidth / 2 - vp.clientWidth / 2;
    const left = Math.min(Math.max(target, 0), vp.scrollWidth - vp.clientWidth);
    vp.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' }); // OPEN: no scroll duration/curve; platform default
  }
  function select(i, smooth, focus = false) {
    if (tabs[i].disabled) return;
    if (i !== current) {
      setSelected(tabs[current], false);
      setSelected(tabs[i], true);
      current = i;
      onSelect?.(i, segments[i]);
    }
    if (focus) tabs[i].focus({ preventScroll: true });
    centre(smooth);
  }
  // One tab stop; arrows move the selection, skipping disabled segments.
  row.addEventListener('keydown', e => {
    const step = { ArrowRight: 1, ArrowLeft: -1, Home: 'first', End: 'last' }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const order = step === 'first' ? tabs.map((_, i) => i) : step === 'last' ? tabs.map((_, i) => tabs.length - 1 - i)
      : Array.from({ length: tabs.length - 1 }, (_, k) => (current + step * (k + 1) + tabs.length) % tabs.length);
    const next = order.find(i => !tabs[i].disabled);
    if (next !== undefined) select(next, true, true);
  });
  // First paint: jump, no animation.
  requestAnimationFrame(() => centre(false));
  belt.panelId = i => `${id}-p${i}`;
  belt.tabId = i => `${id}-t${i}`;
  return belt;
}

export default function demo(stage) {
  let sel = 0;
  playground(stage, {
    note: 'Tap a segment, or focus the belt and use the arrow keys: the selection scrolls to the centre, clamped at both ends. Scroll by hand with a trackpad; selection stays put. Brand shows only in Platform and Product. Open, not invented: the scroll has no specified duration (browser default); what a visible badge announces is undecided; a badge on a selected segment is invisible in Loyalty and Studio, so the badge sits on Timer.',
    controls: [
      { name: 'count', label: 'Segments', type: 'select', options: ['2', '3', '4', '5', '6', '7'], value: '5' },
      { name: 'brand', label: 'Brand', type: 'select', options: BRANDS, value: 'Havells' },
      { name: 'hasIcon', label: 'Has Icon', type: 'bool', value: true },
      { name: 'hasBadge', label: 'Has Badge', type: 'bool', value: false },
      { name: 'label', label: 'First label', type: 'text', value: 'Control' },
    ],
    render: o => {
      const segs = DEFAULTS.slice(0, +o.count).map((s, i) => ({ ...s, label: i === 0 ? o.label || 'Control' : s.label, badge: o.hasBadge && i === 1 }));
      if (sel >= segs.length) sel = 0;
      const phone = document.createElement('div');
      phone.className = 'hb-bottom-navigation-phone';
      const panel = document.createElement('div');
      panel.setAttribute('role', 'tabpanel');
      panel.className = 't-b2-14';
      const belt = bottomNavigation({
        segments: segs, selected: sel, brand: o.brand, hasIcon: o.hasIcon,
        onSelect: i => { sel = i; showPanel(); },
      });
      const showPanel = () => {
        panel.id = belt.panelId(sel);
        panel.setAttribute('aria-labelledby', belt.tabId(sel));
        panel.textContent = `${segs[sel].label} controls appear here.`;
      };
      showPanel();
      phone.append(panel, belt);
      return phone;
    },
  });
  matrix(stage, {
    title: '.Bottom_Nav_Segment, every variant (50)',
    note: 'Each segment is shown on a piece of belt, because an unselected segment has no fill of its own.',
    cols: STATES,
    rows: BRANDS.flatMap(b => ['Yes', 'No'].map(s => `${b} · Selected ${s}`)),
    cell: (r, state) => {
      const [brand, s] = r.split(' · ');
      const belt = document.createElement('div');
      belt.className = 'hb-bottom-navigation is-cell';
      belt.append(segment({ brand, selected: s.endsWith('Yes'), state }));
      return belt;
    },
  });
  matrix(stage, {
    title: 'Belt, Segments 2–7 at 328',
    cols: ['Has Icon = true', 'Has Icon = false'],
    rows: ['2', '3', '4', '5', '6', '7'],
    cell: (n, c) => {
      const box = document.createElement('div');
      box.className = 'hb-bottom-navigation-belt-box';
      box.append(bottomNavigation({ segments: Array.from({ length: +n }, () => ({ label: 'Label', icon: 'tune' })), hasIcon: c.endsWith('true') }));
      return box;
    },
  });
}
