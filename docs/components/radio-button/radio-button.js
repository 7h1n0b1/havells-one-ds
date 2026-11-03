import { playground, matrix } from '../../lib/demo.js';
import { STATES, control, setSelected, field, isDisabled } from '../checkbox/checkbox.js';
// Radio Button — components/Radio Button.md. The group, not the button, owns the value.

const glyph = v => [v === 'Yes' ? 'radio_button_checked' : 'radio_button_unchecked', false]; // FILL 0 always

export function radioButton({ selected = 'Yes', state = 'Enabled', decorative = false } = {}) {
  return control({ cls: 'hb-radio-button', role: 'radio', glyph, selected, state, decorative });
}

// One tab stop, arrows move and select, tapping the selected one does nothing.
// items: elements with role=radio; set(el, 'Yes'|'No') lets rows update their atom too.
export function radioGroup(items, { set = setSelected, onChange } = {}) {
  const sync = () => {
    const on = items.find(i => i.dataset.checked === 'Yes' && !isDisabled(i)) ?? items.find(i => !isDisabled(i));
    items.forEach(i => { if (!isDisabled(i)) i.tabIndex = i === on ? 0 : -1; });
  };
  const pick = el => {
    if (el.dataset.checked === 'Yes') return;
    items.forEach(i => set(i, i === el ? 'Yes' : 'No'));
    sync(); onChange?.(el);
  };
  for (const el of items) {
    el.addEventListener('click', () => !isDisabled(el) && pick(el));
    el.addEventListener('keydown', e => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      const live = items.filter(i => !isDisabled(i)), t = live[(live.indexOf(el) + d + live.length) % live.length];
      pick(t); t.focus();
    });
  }
  sync();
  return pick;
}

export default function demo(stage) {
  playground(stage, {
    note: 'A three-option group: one Tab stop, arrow keys move and select, tapping the selected option does nothing. Selected drives the first option; hover, press and focus are real. Open: unselected draws in the CTA colour (not ruled).',
    controls: [
      { name: 'selected', label: 'Selected (first option)', type: 'select', options: ['Yes', 'No'], value: 'Yes' },
      { name: 'state', label: 'State', type: 'select', options: ['Enabled', 'Disabled'], value: 'Enabled' },
      { name: 'label', label: 'Label (screen text)', type: 'text', value: 'Celsius' },
    ],
    render: o => {
      const g = document.createElement('div');
      g.setAttribute('role', 'radiogroup'); g.setAttribute('aria-label', 'Temperature unit');
      g.style.display = 'grid';
      const radios = [o.selected, o.selected === 'Yes' ? 'No' : 'Yes', 'No'].map(s => radioButton({ selected: s, state: o.state }));
      g.append(...radios.map((r, i) => field(r, [o.label, 'Fahrenheit', 'Kelvin'][i])));
      radioGroup(radios);
      return g;
    },
  });
  matrix(stage, {
    title: 'Every variant (10)',
    cols: STATES,
    rows: ['Yes', 'No'],
    cell: (selected, state) => radioButton({ selected, state }),
  });
}
