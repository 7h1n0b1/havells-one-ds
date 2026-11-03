import { playground, matrix, device } from '../../lib/demo.js';
// Switch — components/Switch.md. Device-bound: a tap starts a write.
export const STATES = ['enabled', 'hovered', 'focused', 'pressed', 'disabled'];
const FORCED = { hovered: 'is-hover', pressed: 'is-pressed', focused: 'is-focused' };

export function switchControl({ selected = true, state = 'enabled', hasLabel = false, decorative = false, onChange } = {}) {
  const el = document.createElement(decorative ? 'span' : 'button');
  el.className = 'hb-switch';
  if (decorative) el.setAttribute('aria-hidden', 'true'); // inside a Switch List_Item the row is the switch
  else { el.type = 'button'; el.setAttribute('role', 'switch'); }
  // ON/OFF letters: OPEN, review only. Hidden from AT until ruled (Switch.md Accessibility).
  el.innerHTML = `<span class="track">${hasLabel ? '<span class="lbl on t-l4-10" aria-hidden="true">ON</span><span class="lbl off t-l4-10" aria-hidden="true">OFF</span>' : ''}<span class="target"><span class="layer"><span class="handle"></span></span></span></span>`;
  setOn(el, selected); setState(el, state);
  if (onChange) el.addEventListener('click', () => { if (!el.disabled && el.getAttribute('aria-busy') !== 'true') { setOn(el, el.dataset.on !== 'true'); onChange(el.dataset.on === 'true', el); } });
  return el;
}

export function setOn(el, on) {
  el.dataset.on = on;
  if (el.getAttribute('role')) el.setAttribute('aria-checked', on);
}

export function setState(el, state) {
  el.classList.remove(...Object.values(FORCED));
  if (FORCED[state]) el.classList.add(FORCED[state]);
  el.classList.toggle('is-disabled', state === 'disabled');
  if (el.tagName === 'BUTTON') el.disabled = state === 'disabled';
}

export default function demo(stage) {
  playground(stage, {
    note: 'Tap, Space or Enter flips the handle at once and sends the write; the "device" answers after 1.5 s (Sending = aria-busy). Fails: handle returns and the error shows inline, no haptic. Offline: tap not accepted, shown disabled with the reason. Open: Has Label (ON/OFF at 10) is review-only and its text colour is not specified (rendered in the handle colour); Sending/Failed are not modelled in Figma; Pending→Failed timeout, handle animation timing and the tighter pressed state-layer padding have no values, so none are invented.',
    controls: [
      { name: 'selected', label: 'Selected', type: 'select', options: ['true', 'false'], value: 'true' },
      { name: 'state', label: 'State', type: 'select', options: ['enabled', 'disabled'], value: 'enabled' },
      { name: 'hasLabel', label: 'Has Label', type: 'bool', value: false },
      { name: 'reply', label: 'Device reply', type: 'select', options: ['Succeeds', 'Fails', 'Offline'], value: 'Succeeds' },
    ],
    render: o => {
      const f = document.createElement('div'), l = document.createElement('label'), msg = document.createElement('p');
      f.className = 'hb-switch-field';
      l.className = 't-l2-14'; l.textContent = 'Daily summary'; l.htmlFor = 'hb-switch-pg';
      msg.className = 't-b3-12 msg'; msg.setAttribute('role', 'status');
      const offline = o.reply === 'Offline';
      const sw = switchControl({ selected: o.selected === 'true', hasLabel: o.hasLabel, state: offline ? 'disabled' : o.state,
        onChange: async (on, el) => {
          msg.textContent = '';
          el.setAttribute('aria-busy', 'true');
          await device();
          el.setAttribute('aria-busy', 'false');
          if (o.reply === 'Fails') { setOn(el, !on); msg.textContent = 'Couldn’t reach the device. Daily summary is unchanged.'; }
        } });
      sw.id = 'hb-switch-pg';
      if (offline) msg.textContent = 'Device offline. Showing the last known value.';
      f.append(l, sw);
      return [f, msg];
    },
  });
  matrix(stage, {
    title: 'Every variant (10, plus Has Label for review)',
    cols: STATES,
    rows: ['true', 'false', 'true · Has Label', 'false · Has Label'],
    cell: (r, state) => switchControl({ selected: r.startsWith('true'), hasLabel: r.includes('Label'), state }),
  });
}
