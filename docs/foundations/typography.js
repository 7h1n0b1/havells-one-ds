// The 22 text styles, parsed from Typography.md by build.py, rendered live.
export default function (main, M) {
  const s = document.createElement('section');
  s.innerHTML = `<h2 class="t-h1-18">The 22 styles, live</h2>
  <div class="table"><table class="tok"><thead><tr><th>Sample</th><th>Figma style</th><th>Flutter</th><th>CSS class</th><th>Spec</th></tr></thead><tbody>
  ${M.typography.map(t => `<tr><td class="${t.cls}" style="max-width:420px">Turn on the living room AC</td>
    <td><code>${t.style}</code></td><td><code>${t.token}</code></td><td><code>.${t.cls}</code></td>
    <td class="meta">${t.family} ${t.weight} · ${t.size} · ${t.lh} · ${t.ls}${t.upper ? ' · UPPER' : ''}</td></tr>`).join('')}
  </tbody></table></div>`;
  main.append(s);
}
