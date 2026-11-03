import { playground, matrix } from '../../lib/demo.js';
// Day Picker — components/Day Picker.md, plus the demo.
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const STATES = ['Enabled', 'Hover', 'Pressed', 'Focused', 'Disabled'];
// Figma marks Sunday and Saturday as Weekend (OPEN: v1.2 marked Sunday only).
const WEEKEND = [0, 6];

// One .Day_Picker_Unit: a native checkbox inside a 48 label. The letter is decoration; the name is the full day.
export function dayUnit({ day = 'Sunday', letter = day[0], weekend = false, selected = false,
  state = 'Enabled', onChange } = {}) {
  const l = document.createElement('label');
  l.className = 'hb-day-picker-unit';
  l.dataset.day = weekend ? 'Weekend' : 'Other';
  l.innerHTML = `<input type="checkbox"><span class="layer"><span class="chip t-l3-12" aria-hidden="true"></span></span>`;
  l.querySelector('.chip').textContent = letter;
  const input = l.querySelector('input');
  input.setAttribute('aria-label', day);
  input.checked = selected;
  input.disabled = state === 'Disabled';
  if (state === 'Hover') l.classList.add('is-hover');
  if (state === 'Pressed') l.classList.add('is-pressed');
  if (state === 'Focused') l.classList.add('is-focused');
  input.addEventListener('change', () => onChange?.(input.checked));
  return l;
}

// The row: seven units, Sunday first. selected and disabled are day indices, 0 = Sunday. Any number, including none.
export function dayPicker({ selected = [], disabled = [], label = 'Repeat on', onChange } = {}) {
  const row = document.createElement('div');
  row.className = 'hb-day-picker';
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', label);
  const set = new Set(selected);
  DAYS.forEach((day, i) => row.append(dayUnit({
    day, weekend: WEEKEND.includes(i), selected: set.has(i),
    state: disabled.includes(i) ? 'Disabled' : 'Enabled',
    onChange: on => { on ? set.add(i) : set.delete(i); onChange?.([...set].sort(), i, on); },
  })));
  return row;
}

export default function demo(stage) {
  let sel = [1, 2, 3, 4, 5];
  playground(stage, {
    note: 'Tap days to toggle them; Tab moves day to day and Space toggles. Sunday and Saturday carry the weekend tint as Figma has it. Open, not invented: whether the weekend is Sunday only or both days, whether the tint stays at all (it is invisible in Loyalty and Studio), and what a screen does when every day is cleared. Haptics are unsigned, so none fire.',
    controls: [
      { name: 'label', label: 'Group label', type: 'text', value: 'Repeat on' },
      { name: 'disableSun', label: 'Disable Sunday', type: 'bool', value: false },
    ],
    render: o => {
      const phone = document.createElement('div');
      phone.className = 'hb-day-picker-phone';
      const cap = document.createElement('p');
      cap.className = 'caption t-b3-12';
      cap.style.margin = '0';
      const show = () => { cap.textContent = `${o.label || 'Repeat on'}: ${sel.length ? sel.map(i => DAYS[i]).join(', ') : 'no days'}`; };
      show();
      phone.append(cap, dayPicker({
        selected: sel, label: o.label || 'Repeat on', disabled: o.disableSun ? [0] : [],
        onChange: s => { sel = s; show(); },
      }));
      return phone;
    },
  });
  matrix(stage, {
    title: '.Day_Picker_Unit, every variant (20)',
    cols: STATES,
    rows: ['Yes', 'No'].flatMap(s => ['Other', 'Weekend'].map(d => `Selected ${s} · ${d}`)),
    cell: (r, state) => dayUnit({ day: 'Sunday', letter: 'S', selected: r.includes('Yes'), weekend: r.endsWith('Weekend'), state }),
  });
}
