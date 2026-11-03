// Shared demo scaffolding for component pages.
// playground(): one live, fully interactive instance driven by controls.
// matrix(): every variant, fixed default content. Playground controls never touch it.

let uid = 0;
export function playground(stage, { controls, render, note = '' }) {
  const opts = Object.fromEntries(controls.map(c => [c.name, c.value]));
  const sec = document.createElement('section');
  sec.className = 'pg';
  sec.innerHTML = `<h3 class="t-h2-16">Playground</h3>${note ? `<p class="t-b3-12 meta">${note}</p>` : ''}
    <div class="controls"></div><div class="pg-out"></div>`;
  const box = sec.querySelector('.controls'), out = sec.querySelector('.pg-out');
  for (const c of controls) {
    const id = `pg-${++uid}`, l = document.createElement('label');
    l.htmlFor = id;
    if (c.type === 'bool') l.innerHTML = `<input type="checkbox" id="${id}" ${c.value ? 'checked' : ''}> ${c.label ?? c.name}`;
    else if (c.type === 'select') l.innerHTML = `${c.label ?? c.name} <select id="${id}">${c.options.map(o => `<option ${o === c.value ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
    else l.innerHTML = `${c.label ?? c.name} <input type="text" id="${id}" value="${c.value ?? ''}">`;
    l.querySelector('input,select').addEventListener('input', e => {
      opts[c.name] = c.type === 'bool' ? e.target.checked : e.target.value;
      draw();
    });
    box.append(l);
  }
  const draw = () => { const n = render({ ...opts }); out.replaceChildren(...[].concat(n)); };
  draw();
  stage.append(sec);
  return sec;
}

export function matrix(stage, { title, cols, rows, cell, note = '' }) {
  const sec = document.createElement('section');
  sec.className = 'mx';
  sec.innerHTML = `<h3 class="t-h2-16">${title}</h3>${note ? `<p class="t-b3-12 meta">${note}</p>` : ''}
    <div class="table"><table class="demo-table"><thead><tr><th></th>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody></tbody></table></div>`;
  const tb = sec.querySelector('tbody');
  for (const r of rows) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<th>${r}</th>`;
    for (const c of cols) {
      const td = document.createElement('td');
      td.append(...[].concat(cell(r, c)));
      // The matrix is a picture of states; keep it out of the tab order.
      td.querySelectorAll('button,input,[tabindex],a').forEach(el => el.tabIndex = -1);
      tr.append(td);
    }
    tb.append(tr);
  }
  stage.append(sec);
  return sec;
}

// Fake device round trip for Loading / Pending demos.
export const device = (ms = 1500) => new Promise(r => setTimeout(r, ms));
