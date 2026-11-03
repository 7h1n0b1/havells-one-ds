import { playground, matrix } from '../../lib/demo.js';
// Checkbox — components/Checkbox.md. Also exports the selection-control core that
// Radio Button and Check Circle reuse (48 target > 40 state layer > 24 glyph).
export const STATES = ['Enabled', 'Hover', 'Pressed', 'Focused', 'Disabled'];
const FORCED = { Hover: 'is-hover', Pressed: 'is-pressed', Focused: 'is-focused' };
export const toggle = v => v === 'Yes' ? 'No' : 'Yes'; // Indeterminate -> Yes (spec: Indeterminate)
export const isDisabled = el => el.disabled || el.getAttribute('aria-disabled') === 'true';

// Interaction state on any control or row. Forced classes are for the matrix only.
export function applyState(el, state) {
  el.classList.remove(...Object.values(FORCED));
  if (FORCED[state]) el.classList.add(FORCED[state]);
  const off = state === 'Disabled';
  el.classList.toggle('is-disabled', off);
  if (el.tagName === 'BUTTON') el.disabled = off;
  else if (el.getAttribute('role')) { el.setAttribute('aria-disabled', off); el.tabIndex = off ? -1 : 0; }
}

// glyph(selected, fill) -> [symbol, FILL 1?]
export function control({ cls, role, glyph, fill = 'Yes', selected = 'Yes', state = 'Enabled', decorative = false, onActivate }) {
  const el = document.createElement(decorative ? 'span' : 'button');
  el.className = cls;
  if (decorative) el.setAttribute('aria-hidden', 'true'); // inside a row: the row is the control
  else { el.type = 'button'; el.setAttribute('role', role); }
  el.innerHTML = '<span class="visible"><span class="ms" aria-hidden="true"></span></span>';
  el._glyph = glyph; el.dataset.fill = fill;
  setSelected(el, selected); applyState(el, state);
  if (onActivate) el.addEventListener('click', () => !isDisabled(el) && onActivate(el));
  return el;
}

export function setSelected(el, v) {
  el.dataset.checked = v;
  if (el._glyph) {
    const [name, filled] = el._glyph(v, el.dataset.fill), ms = el.querySelector('.ms');
    ms.textContent = name; ms.classList.toggle('fill', filled);
  }
  if (el.getAttribute('role')) el.setAttribute('aria-checked', v === 'Yes' ? 'true' : v === 'No' ? 'false' : 'mixed');
}

const GLYPH = { Yes: 'check_box', No: 'check_box_outline_blank', Indeterminate: 'indeterminate_check_box' };
const glyph = (v, fill) => [GLYPH[v], v !== 'No' && fill === 'Yes']; // Selected=No is always FILL 0

export function checkbox({ selected = 'Yes', state = 'Enabled', fill = 'Yes', decorative = false, onChange } = {}) {
  return control({ cls: 'hb-checkbox', role: 'checkbox', glyph, fill, selected, state, decorative,
    onActivate: decorative ? null : el => { const v = toggle(el.dataset.checked); setSelected(el, v); onChange?.(v, el); } });
}

// Control + its screen-placed label (the label is the accessible name).
let uid = 0;
export function field(ctrl, text) {
  const f = document.createElement('div'), l = document.createElement('label');
  f.className = 'hb-checkbox-field';
  ctrl.id = `hb-ctl-${++uid}`; l.htmlFor = ctrl.id; l.className = 't-l2-14'; l.textContent = text;
  f.append(ctrl, l);
  return f;
}

export default function demo(stage) {
  playground(stage, {
    note: 'Tap, click, Space or Enter toggles; Tab shows the focus ring; hover and press are real. Indeterminate is computed — tapping it selects (goes to Yes). Open: unselected draws in the CTA colour (not ruled); Fill has no effect on Selected = No.',
    controls: [
      { name: 'selected', label: 'Selected', type: 'select', options: ['Yes', 'No', 'Indeterminate'], value: 'Yes' },
      { name: 'state', label: 'State', type: 'select', options: ['Enabled', 'Disabled'], value: 'Enabled' },
      { name: 'fill', label: 'Fill', type: 'select', options: ['Yes', 'No'], value: 'Yes' },
      { name: 'label', label: 'Label (screen text)', type: 'text', value: 'Daily summary' },
    ],
    render: o => field(checkbox(o), o.label),
  });
  matrix(stage, {
    title: 'Every variant (30)',
    cols: STATES,
    rows: ['Yes', 'No', 'Indeterminate'].flatMap(s => ['Yes', 'No'].map(f => `${s} · Fill ${f}`)),
    cell: (r, state) => { const [selected, f] = r.split(' · Fill '); return checkbox({ selected, fill: f, state }); },
  });
}
