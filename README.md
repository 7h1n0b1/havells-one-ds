# Havells One DS site

The live reference for every Havells One foundation and component marked dev ready.
Designers and developers both read it. It renders real coded components from the same
tokens the app ships with, in all five `Colours` modes.

## Run

```
python3 build.py
python3 -m http.server 8090 -d dist
```

Open http://localhost:8090.

`build.py` reads `01_Dev Ready/` from OneDrive (set `DEV_READY=/path` to override). It
never writes there. It produces `dist/`:

- `tokens.css`: every `Colours` token per mode (`:root[data-mode="Lux"]`), every
  `Numbers` token, primitives as `--primitive-*` (effect styles only), and the 22 text
  styles parsed from `Typography.md` as `.t-*` classes.
- `manifest.json`: components, foundations, resolved tokens.
- `specs/`: the md files, rendered on each page.

CSS variable name = token path, lower case, non-alphanumerics to `-`:
`Component/Button/Filled/Text/Default` → `--component-button-filled-text-default`.

## Add a component

1. Its md lands in `01_Dev Ready/components/`. Rerun `build.py`: a spec-only page appears.
2. Add `src/components/<slug>/<slug>.css` and `<slug>.js` (slug = md name, lower case,
   non-alphanumerics to `-`). The js default-exports `demo(stageElement, manifest)`.
   Rerun: the live demo appears above the spec.

Rules for component code: `var(--token)` only, no hex, no raw px unless the spec gives
the number without a token (cite it in a comment). Open questions in the spec stay open.

## Publish

GitHub Pages serves `docs/` on `main`. CI cannot read OneDrive, so build locally:

```
DIST=docs python3 build.py
git add -A
git commit -m "Rebuild from Dev Ready"
git push
```

## Screenshots

`tools/shot.sh <slug> <Mode> out.png` takes a headless Chrome screenshot of one page from
the local server (`PORT=` to pick another port).
