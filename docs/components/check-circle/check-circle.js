import { playground, matrix } from '../../lib/demo.js';
import { STATES, control, setSelected, toggle, field } from '../checkbox/checkbox.js';
// Check Circle — components/Check Circle.md. Multi-select, so role=checkbox whatever its shape.

const glyph = (v, fill) => v === 'Yes' ? ['check_circle', fill === 'Yes'] : ['radio_button_unchecked', false];

export function checkCircle({ selected = 'Yes', state = 'Enabled', fill = 'Yes', decorative = false, onChange } = {}) {
  return control({ cls: 'hb-check-circle', role: 'checkbox', glyph, fill, selected, state, decorative,
    onActivate: decorative ? null : el => { const v = toggle(el.dataset.checked); setSelected(el, v); onChange?.(v, el); } });
}

export default function demo(stage) {
  playground(stage, {
    note: 'Tap, Space or Enter toggles; Tab shows the focus ring; hover and press are real. In product it lives at the trailing edge of a row (see Selection List_Item). Open: unselected is the same ring as an unselected Radio Button and draws in the CTA colour (not ruled); Fill has no effect on Selected = No.',
    controls: [
      { name: 'selected', label: 'Selected', type: 'select', options: ['Yes', 'No'], value: 'Yes' },
      { name: 'state', label: 'State', type: 'select', options: ['Enabled', 'Disabled'], value: 'Enabled' },
      { name: 'fill', label: 'Fill', type: 'select', options: ['Yes', 'No'], value: 'Yes' },
      { name: 'label', label: 'Label (screen text)', type: 'text', value: 'Living room fan' },
    ],
    render: o => field(checkCircle(o), o.label),
  });
  matrix(stage, {
    title: 'Every variant (20)',
    cols: STATES,
    rows: ['Yes', 'No'].flatMap(s => ['Yes', 'No'].map(f => `${s} · Fill ${f}`)),
    cell: (r, state) => { const [selected, f] = r.split(' · Fill '); return checkCircle({ selected, fill: f, state }); },
  });
}
