// Router + shell. Data comes from manifest.json, written by build.py.
const $ = (s, el = document) => el.querySelector(s);
const main = $('#main'), nav = $('#nav');
const M = await (await fetch('manifest.json')).json();
const SURFACES = {
  'Canvas': 'canvas',
  'Low_Contrast/Surface_1': 'lc1', 'Low_Contrast/Surface_2': 'lc2', 'Low_Contrast/Surface_3': 'lc3',
};
const FOUNDATION_VIEWS = ['colour', 'typography', 'numbers', 'icons'];

// ---- mode ----
const sel = $('#mode');
sel.innerHTML = M.modes.map(m => `<option>${m}</option>`).join('');
let saved = new URLSearchParams(location.search).get('mode'); // ?mode=Lux for screenshots
if (!saved) try { saved = localStorage.getItem('mode'); } catch {}
setMode(M.modes.includes(saved) ? saved : M.modes[0]);
sel.onchange = () => setMode(sel.value);
function setMode(m) {
  document.documentElement.dataset.mode = sel.value = m;
  try { localStorage.setItem('mode', m); } catch {}
  window.dispatchEvent(new CustomEvent('modechange', { detail: m }));
}

// ---- nav ----
const link = (href, label, extra = '') => `<a href="${href}">${label}${extra}</a>`;
nav.innerHTML = `
  <h2 class="t-overline">Start</h2>${link('#/', 'Overview')}${link('#/s/AGENTS', 'Read me first')}${link('#/s/_FOUNDATIONS', 'Foundations rules')}
  <h2 class="t-overline">Foundations</h2>${M.foundations.map(f => link(`#/f/${f.slug}`, f.name)).join('')}
  <h2 class="t-overline">Components</h2>${M.components.map(c =>
    link(`#/c/${c.slug}`, c.name, c.coded ? '' : ' <span class="pill">spec only</span>')).join('')}`;
$('.menu').onclick = e => {
  const open = document.body.classList.toggle('nav-open');
  e.currentTarget.setAttribute('aria-expanded', open);
};

// ---- markdown ----
async function spec(path) {
  const md = await (await fetch(path)).text();
  const el = document.createElement('article');
  el.className = 'spec';
  el.innerHTML = marked.parse(md);
  // Page head already shows the title and front-matter table.
  if (el.firstElementChild?.tagName === 'H1') el.firstElementChild.remove();
  if (el.firstElementChild?.tagName === 'TABLE' && /Status|Figma/.test(el.firstElementChild.textContent)) el.firstElementChild.remove();
  el.querySelectorAll('table').forEach(t => t.outerHTML = `<div class="table">${t.outerHTML}</div>`);
  return el;
}

// ---- stage: demo area with a surface picker ----
export function stage(title = 'Live') {
  const wrap = document.createElement('section');
  wrap.className = 'stage-wrap';
  wrap.innerHTML = `<div class="stage-bar"><h2 class="t-h2-16">${title}</h2>
    <label>Surface <select>${Object.keys(SURFACES).map(s => `<option value="${SURFACES[s]}">${s}</option>`).join('')}</select></label></div>
    <div class="stage" data-surface="canvas"></div>`;
  const st = $('.stage', wrap);
  $('select', wrap).onchange = e => st.dataset.surface = e.target.value;
  return [wrap, st];
}

// ---- routes ----
async function route() {
  const [, kind, id] = location.hash.split('/');
  nav.querySelectorAll('a').forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === location.hash || (!kind && a.getAttribute('href') === '#/')));
  document.body.classList.remove('nav-open');
  main.replaceChildren();
  if (kind === 'c') {
    const c = M.components.find(x => x.slug === id);
    if (!c) return notFound();
    main.append(head(c.name, c));
    if (c.coded) {
      const css = document.createElement('link');
      css.rel = 'stylesheet'; css.href = `components/${c.slug}/${c.slug}.css`;
      document.head.querySelectorAll('link[data-c]').forEach(l => l.remove());
      css.dataset.c = ''; document.head.append(css);
      const [wrap, st] = stage();
      main.append(wrap);
      (await import(`./components/${c.slug}/${c.slug}.js`)).default(st, M);
    } else {
      main.insertAdjacentHTML('beforeend', `<p class="note">Spec is dev ready. Coded demo not built yet — build from the spec below.</p>`);
    }
    main.append(await spec(c.spec));
  } else if (kind === 'f') {
    const f = M.foundations.find(x => x.slug === id);
    if (!f) return notFound();
    main.append(head(f.name, f));
    if (FOUNDATION_VIEWS.includes(f.slug)) (await import(`./foundations/${f.slug}.js`)).default(main, M);
    main.append(await spec(f.spec));
  } else if (kind === 's') {
    main.append(await spec(`specs/${id}.md`));
  } else {
    main.append(home());
    main.append(await spec('specs/README.md'));
  }
  main.focus({ preventScroll: true });
  scrollTo(0, 0);
}
function head(name, meta) {
  const h = document.createElement('header');
  h.className = 'page-head';
  h.innerHTML = `<h1 class="t-d3-32">${name}</h1>` +
    (meta.status ? `<div class="status">${marked.parseInline(meta.status)}</div>` : '') +
    `<p class="meta t-b3-12">${meta.figma ? 'Figma ' + marked.parseInline(meta.figma) : ''}${meta.updated ? ' · updated ' + meta.updated : ''}</p>`;
  return h;
}
function home() {
  const s = document.createElement('section');
  s.innerHTML = `<h1 class="t-d3-32">Havells One design system</h1>
  <p class="t-b1-16 lead">Every foundation and component marked dev ready, rendered from the same tokens the app ships with. Pick a mode at the top; every page re-themes. If it is not on this site, it is not ready to build.</p>
  <div class="grid">${M.components.map(c => `<a class="card" href="#/c/${c.slug}"><span class="t-h3-14">${c.name}</span><span class="t-b3-12">${c.coded ? 'Live demo + spec' : 'Spec only'} · ${c.updated}</span></a>`).join('')}</div>`;
  return s;
}
function notFound() { main.innerHTML = '<p>Not found.</p>'; }
addEventListener('hashchange', route);
route();
