// Numbers collection, drawn to scale.
const v = n => '--' + n.toLowerCase().replace(/[^a-z0-9_]+/g, '-').replace(/^-|-$/g, '');
export default function (main, M) {
  const s = document.createElement('section'), T = M.tokens.Platform;
  const draw = n => n.startsWith('Space/') ? `<span class="bar" style="width:var(${v(n)})"></span>`
    : n.startsWith('Corner Radius/') ? `<span class="box" style="border-radius:var(${v(n)})"></span>`
    : n.startsWith('Stroke Width/') ? `<span class="box" style="border:var(${v(n)}) solid currentColor"></span>`
    : n.startsWith('Size/') ? `<span class="sq" style="width:var(${v(n)});height:var(${v(n)})"></span>` : '';
  s.innerHTML = `<style>.bar{display:inline-block;height:var(--space-small);background:var(--component-selection_control-icon-selected-default)}
    .box{display:inline-block;width:var(--space-large);height:var(--space-large);background:var(--surface-neutral-low_contrast-surface_2-default)}
    .sq{display:inline-block;background:var(--surface-neutral-low_contrast-surface_3-default)}</style>
  <h2 class="t-h1-18">Numbers, to scale</h2>
  <div class="table"><table class="tok"><thead><tr><th>Token</th><th>Value</th><th>CSS</th><th></th></tr></thead><tbody>
  ${M.numberNames.filter(n => !n.startsWith('Text Size/')).map(n => `<tr><td><code>${n}</code></td><td>${T[n]}</td><td><code>var(${v(n)})</code></td><td>${draw(n)}</td></tr>`).join('')}
  </tbody></table></div>`;
  main.append(s);
}
