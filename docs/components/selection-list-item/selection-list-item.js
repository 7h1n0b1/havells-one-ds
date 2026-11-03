import { playground, matrix } from '../../lib/demo.js';
import { STATES, applyState, setSelected, toggle, isDisabled, checkbox } from '../checkbox/checkbox.js';
import { radioButton, radioGroup } from '../radio-button/radio-button.js';
import { checkCircle } from '../check-circle/check-circle.js';
// Selection List_Item — components/Selection List_Item.md. The whole row is the control.

export const LEADING = ['None', 'Icon', 'Media'], CONTROLS = ['Checkbox', 'Radio Button', 'Check Circle'];
const ATOM = { Checkbox: checkbox, 'Radio Button': radioButton, 'Check Circle': checkCircle };
const ROLE = { Checkbox: 'checkbox', 'Radio Button': 'radio', 'Check Circle': 'checkbox' };

// Shared row skeleton (Switch List_Item reuses it). Text goes in via textContent.
let uid = 0;
export function listRow({ cls, role, trailing, leading = 'None', leadingIcon = 'lightbulb', title = 'Primary text',
  overline = 'Label', supporting = 'Supporting text', hasOverline = false, hasSupporting = true, divider = true }) {
  const row = document.createElement('div'), id = `hb-row-${++uid}`;
  row.className = cls; row.setAttribute('role', role); row.tabIndex = 0;
  const lead = leading === 'Icon' ? `<span class="leading"><span class="ms icon" aria-hidden="true">${leadingIcon}</span></span>`
    : leading === 'Media' ? '<span class="leading"><span class="media" aria-hidden="true"><span class="ms">image</span></span></span>' : '';
  row.innerHTML = `<div class="layer">${lead}<div class="content"><span class="overline t-overline" id="${id}-o"></span>`
    + `<span class="title t-l2-14" id="${id}-t"></span><span class="supporting t-b3-12" id="${id}-s"></span></div>`
    + `<div class="trailing"></div></div>${divider ? '<hr class="divider">' : ''}`;
  const q = s => row.querySelector(s);
  q('.overline').textContent = overline; q('.overline').hidden = !hasOverline;
  q('.title').textContent = title;
  q('.trailing').append(trailing);
  row.setAttribute('aria-labelledby', hasOverline ? `${id}-o ${id}-t` : `${id}-t`);
  setSupporting(row, hasSupporting ? supporting : null);
  row.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); row.click(); } });
  return row;
}

export function setSupporting(row, text) {
  const s = row.querySelector('.supporting');
  s.hidden = text == null; s.textContent = text ?? '';
  if (text == null) row.removeAttribute('aria-describedby'); else row.setAttribute('aria-describedby', s.id);
}

// Row + atom share Selected and State. Focus stays on the row, never on the atom.
export function setRowSelected(row, v) { setSelected(row, v); setSelected(row.querySelector('.trailing > *'), v); }
export function setRowState(row, state) { applyState(row, state); applyState(row.querySelector('.trailing > *'), state === 'Disabled' ? 'Disabled' : 'Enabled'); }

export function selectionListItem({ control = 'Checkbox', selected = 'No', state = 'Enabled', fill = 'Yes', onChange, ...rest } = {}) {
  const atom = ATOM[control]({ selected, fill, decorative: true });
  const row = listRow({ cls: 'hb-selection-list-item', role: ROLE[control], trailing: atom, ...rest });
  row.dataset.control = control;
  setRowSelected(row, selected); setRowState(row, state);
  if (control !== 'Radio Button') // radios are driven by radioGroup()
    row.addEventListener('click', () => { if (isDisabled(row)) return; const v = toggle(row.dataset.checked); setRowSelected(row, v); onChange?.(v, row); });
  return row;
}

export default function demo(stage) {
  playground(stage, {
    note: 'Three rows; the first takes the controls. Tap anywhere on a row, or Tab to it and press Space or Enter. Radio rows are one Tab stop with arrow keys and never clear themselves. Hover and press tint row and atom together; focus is on the row only. Media is a 40 placeholder. Ambiguous: Figma gives 48 for a title-only row, but the 48 control plus Space/Small padding makes 64 here; Disabled sets the state layer and the atom to 50%, which compounds.',
    controls: [
      { name: 'leading', label: 'Leading Element', type: 'select', options: LEADING, value: 'None' },
      { name: 'control', label: 'Control', type: 'select', options: CONTROLS, value: 'Checkbox' },
      { name: 'selected', label: 'Selected', type: 'select', options: ['No', 'Yes'], value: 'No' },
      { name: 'state', label: 'State', type: 'select', options: ['Enabled', 'Disabled'], value: 'Enabled' },
      { name: 'title', label: 'Title', type: 'text', value: 'Daily summary' },
      { name: 'overline', label: 'Overline', type: 'text', value: 'Notifications' },
      { name: 'supporting', label: 'Supporting text', type: 'text', value: 'Sent every morning at 9am' },
      { name: 'hasOverline', label: 'Has Overline', type: 'bool', value: false },
      { name: 'hasSupporting', label: 'Has Supporting text', type: 'bool', value: true },
      { name: 'divider', label: 'Divider', type: 'bool', value: true },
      { name: 'leadingIcon', label: 'Leading Icon', type: 'text', value: 'notifications' },
    ],
    render: o => {
      const radio = o.control === 'Radio Button';
      const rows = [o, { ...o, title: 'Weekly report', selected: radio && o.selected === 'No' ? 'Yes' : 'No', state: 'Enabled' },
        { ...o, title: 'Firmware updates', selected: 'No', state: 'Enabled' }].map(p => selectionListItem(p));
      const list = document.createElement('div');
      list.className = 'hb-selection-list-item-list';
      list.setAttribute('role', radio ? 'radiogroup' : 'group'); list.setAttribute('aria-label', 'Notifications');
      list.append(...rows);
      if (radio) radioGroup(rows, { set: setRowSelected });
      return list;
    },
  });
  matrix(stage, {
    title: 'Every variant (90)',
    cols: STATES,
    rows: LEADING.flatMap(l => CONTROLS.flatMap(c => ['No', 'Yes'].map(s => `${l} · ${c} · ${s}`))),
    cell: (r, state) => { const [leading, control, selected] = r.split(' · '); return selectionListItem({ leading, control, selected, state }); },
  });
}
