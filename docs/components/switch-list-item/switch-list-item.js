import { playground, matrix, device } from '../../lib/demo.js';
import { switchControl, setOn, setState as setSwitchState } from '../switch/switch.js';
import { STATES, applyState, isDisabled } from '../checkbox/checkbox.js';
import { listRow, setSupporting, LEADING } from '../selection-list-item/selection-list-item.js';
// Switch List_Item — components/Switch List_Item.md. Device-bound: a tap writes at once.
export const DEVICE = ['Sending', 'Failed', 'Offline'];
const FAILED = 'Couldn’t reach the device. Try again.', OFFLINE = 'Device offline';

export function switchListItem({ selected = 'No', state = 'Enabled', onWrite, ...rest } = {}) {
  const row = listRow({ cls: 'hb-switch-list-item', role: 'switch', trailing: switchControl({ decorative: true }), ...rest });
  row._supporting = rest.hasSupporting === false ? null : (rest.supporting ?? 'Supporting text');
  setRowOn(row, selected === 'Yes'); setRowState(row, state);
  if (onWrite) row.addEventListener('click', async () => {
    if (isDisabled(row) || row.getAttribute('aria-busy') === 'true') return;
    const was = row.dataset.on === 'true';
    setRowOn(row, !was); setDevice(row, 'Sending');
    const ok = await onWrite(!was, row);
    if (ok) setDevice(row, null); else { setRowOn(row, was); setDevice(row, 'Failed'); }
  });
  return row;
}

export function setRowOn(row, on) { row.dataset.on = on; row.setAttribute('aria-checked', on); setOn(row.querySelector('.hb-switch'), on); }
export function setRowState(row, state) {
  applyState(row, state);
  setSwitchState(row.querySelector('.hb-switch'), state === 'Disabled' ? 'disabled' : 'enabled');
}
// Device axis, modelled in code only (not Figma variants yet).
export function setDevice(row, d) {
  row.dataset.device = d ?? '';
  row.setAttribute('aria-busy', d === 'Sending');
  if (d === 'Offline') setRowState(row, 'Disabled');
  setSupporting(row, d === 'Failed' ? FAILED : d === 'Offline' ? OFFLINE : row._supporting);
}

export default function demo(stage) {
  playground(stage, {
    note: 'Tap the row, or Tab to it and press Space or Enter: the switch flips and the write goes at once (Sending = aria-busy); the "device" answers after 1.5 s. Fails: the switch returns and the error takes the Supporting text slot, no haptic. Offline: row disabled, reason in Supporting text, tap not accepted. Open: device states are not Figma variants yet; the optional Sending progress line, error text colour and the Pending→Failed timeout have no spec, so none is drawn. Error and offline copy are demo text. Ambiguous: Disabled sets the state layer and the Switch to 50%, which compounds.',
    controls: [
      { name: 'leading', label: 'Leading Element', type: 'select', options: LEADING, value: 'None' },
      { name: 'selected', label: 'Selected', type: 'select', options: ['No', 'Yes'], value: 'No' },
      { name: 'state', label: 'State', type: 'select', options: ['Enabled', 'Disabled'], value: 'Enabled' },
      { name: 'reply', label: 'Device reply', type: 'select', options: ['Succeeds', 'Fails', 'Offline'], value: 'Succeeds' },
      { name: 'title', label: 'Title', type: 'text', value: 'Motion alerts' },
      { name: 'overline', label: 'Overline', type: 'text', value: 'Doorbell' },
      { name: 'supporting', label: 'Supporting text', type: 'text', value: 'Notify when the camera sees movement' },
      { name: 'hasOverline', label: 'Has Overline', type: 'bool', value: false },
      { name: 'hasSupporting', label: 'Has Supporting text', type: 'bool', value: true },
      { name: 'divider', label: 'Divider', type: 'bool', value: true },
      { name: 'leadingIcon', label: 'Leading Icon', type: 'text', value: 'motion_sensor_active' },
    ],
    render: o => {
      const row = switchListItem({ ...o, onWrite: async () => { await device(); return o.reply === 'Succeeds'; } });
      if (o.reply === 'Offline') setDevice(row, 'Offline');
      const w = document.createElement('div');
      w.className = 'hb-switch-list-item-list';
      w.append(row);
      return w;
    },
  });
  matrix(stage, {
    title: 'Every variant (30)',
    cols: STATES,
    rows: LEADING.flatMap(l => ['No', 'Yes'].map(s => `${l} · ${s}`)),
    cell: (r, state) => { const [leading, selected] = r.split(' · '); return switchListItem({ leading, selected, state }); },
  });
  matrix(stage, {
    title: 'Device states (code only, not yet Figma variants)',
    note: 'Sending shows the new position while the write is out; Failed shows the previous position and the error; Offline shows the last known value, disabled.',
    cols: ['Turning on', 'Turning off'],
    rows: DEVICE,
    cell: (d, c) => {
      const toOn = c === 'Turning on', row = switchListItem({ selected: (d === 'Sending') === toOn ? 'Yes' : 'No' });
      setDevice(row, d);
      return row;
    },
  });
}
