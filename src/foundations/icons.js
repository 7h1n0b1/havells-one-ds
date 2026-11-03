// Material Symbols Rounded at the ruled configuration (Icons.md): opsz 24, wght 300, FILL 0, GRAD 0.
const SAMPLE = ['power_settings_new', 'mode_cool', 'mode_fan', 'thermostat', 'schedule', 'wifi', 'wifi_off', 'refresh',
  'chevron_right', 'arrow_back', 'close', 'check', 'add', 'remove', 'search', 'settings', 'notifications', 'home',
  'devices', 'person', 'lightbulb', 'bolt', 'water_drop', 'air'];
export default function (main) {
  const s = document.createElement('section');
  s.innerHTML = `<h2 class="t-h1-18">Render check</h2>
  <p class="t-b2-14 meta">CSS: <code>font-family: 'Material Symbols Rounded'; font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;</code> Colour from an <code>Icon/*</code> token. Sample names only — use the icon the design names.</p>
  <div class="grid">${SAMPLE.map(n => `<div class="card"><span class="ms" style="color:var(--icon-on_neutral-low_contrast-high_emphasis-default)" aria-hidden="true">${n}</span><code class="t-b3-12">${n}</code></div>`).join('')}</div>`;
  main.append(s);
}
