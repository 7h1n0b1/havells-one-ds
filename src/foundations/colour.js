// Every Colours token, resolved per mode. Swatches use the live CSS variable so they follow the mode switch.
const v = n => '--' + n.toLowerCase().replace(/[^a-z0-9_]+/g, '-').replace(/^-|-$/g, '');
const isColour = x => typeof x === 'string' && x.startsWith('#');

function lum(hex) {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(x => x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

export default function (main, M) {
  const s = document.createElement('section');
  const groups = {};
  for (const n of M.colourNames) {
    if (!isColour(M.tokens.Platform[n])) continue;
    const g = n.split('/').slice(0, n.startsWith('Component/') ? 2 : 1).join('/');
    (groups[g] ??= []).push(n);
  }
  s.innerHTML = `<h2 class="t-h1-18">Tokens, all five modes</h2>
    <p class="t-b2-14 meta">Generated from <code>Semantic Library.json</code>. The big swatch follows the mode picker. Text and icon tokens show contrast against Canvas in the current mode.</p>
    <label class="controls"><input type="text" placeholder="Filter tokens" aria-label="Filter tokens"></label>
    ${Object.entries(groups).map(([g, names]) => `<details ${g === 'Surface' ? 'open' : ''}><summary class="t-h3-14">${g} (${names.length})</summary>
      <div class="table"><table class="tok"><thead><tr><th>Token</th><th>Now</th>${M.modes.map(m => `<th>${m}</th>`).join('')}</tr></thead><tbody>
      ${names.map(n => `<tr data-n="${n.toLowerCase()}"><td><code>${n}</code><br><code class="meta">var(${v(n)})</code></td>
        <td><span class="sw big" style="background:var(${v(n)})"></span><span class="cr" data-n="${n}"></span></td>
        ${M.modes.map(m => `<td><span class="sw" style="background:${M.tokens[m][n]}"></span><code>${M.tokens[m][n]}</code></td>`).join('')}</tr>`).join('')}
      </tbody></table></div></details>`).join('')}`;
  const style = document.createElement('style');
  style.textContent = `.sw{display:inline-block;width:var(--space-rare);height:var(--space-rare);border-radius:var(--corner-radius-6);vertical-align:middle;margin-right:var(--space-xs);
    border:var(--stroke-width-regular) solid var(--stroke-on_neutral-low_contrast-stroke_1-default);background-image:none}
    .sw.big{width:var(--space-large);height:var(--space-large)} details{margin:var(--space-small) 0} summary{cursor:pointer;min-height:var(--size-touch_target);display:flex;align-items:center}
    .cr{font-size:var(--text-size-10);display:block}`;
  s.prepend(style);
  s.querySelector('input').oninput = e => {
    const q = e.target.value.toLowerCase();
    s.querySelectorAll('tr[data-n]').forEach(r => r.hidden = !r.dataset.n.includes(q));
    if (q) s.querySelectorAll('details').forEach(d => d.open = true);
  };
  const ratios = () => {
    const mode = document.documentElement.dataset.mode, bg = M.tokens[mode]['Surface/Neutral/Canvas/Default'];
    s.querySelectorAll('.cr').forEach(el => {
      const n = el.dataset.n, c = M.tokens[mode][n];
      el.textContent = /^(Text|Icon)\//.test(n) && c.length === 7 ? contrast(c, bg).toFixed(2) + ':1' : '';
    });
  };
  ratios();
  addEventListener('modechange', ratios);
  main.append(s);
}
