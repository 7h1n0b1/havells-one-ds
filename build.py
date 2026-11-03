"""Build the Havells One DS site from 01_Dev Ready/ into dist/.

Reads only. Rerun after any change to the Dev Ready folder or src/.
"""
import json, os, re, shutil, sys
from pathlib import Path

ROOT = Path(__file__).parent
SRC, DIST = ROOT / "src", Path(os.environ.get("DIST", ROOT / "dist"))
READY = Path(os.environ.get("DEV_READY", Path.home() /
        "Library/CloudStorage/OneDrive-Havells/02_Design System/Component Handoff/01_Dev Ready"))
F = READY / "foundations"

sem = json.load(open(F / "Semantic Library.json"))
prim = json.load(open(F / "Primitive Library.json"))
MODES = sem["Colours"]["modes"]


def var(name):
    return "--" + re.sub(r"[^a-z0-9_]+", "-", name.lower()).strip("-")


def node(root, path):
    for k in path:
        root = root[k]
    return root


def leaves(n):
    if isinstance(n, dict):
        if "type" in n and "value" in n:
            yield n
        else:
            for v in n.values():
                yield from leaves(v)


def resolve(ref, mode):
    """Alias -> final value. Colours come back as #rrggbb or #rrggbbaa."""
    opacity = None
    if isinstance(ref, dict):
        ref, opacity = ref["color"], ref["opacity"]
        if opacity > 1:  # Figma stores alias-with-opacity as a percentage
            opacity /= 100
    if not (isinstance(ref, str) and ref.startswith("{")):
        return ref
    coll, *path = ref[1:-1].split(".")
    src = prim if coll == "Primitive_Color_Lib" else sem
    t = node(src[coll], path)
    v = resolve(t["modes"].get(mode, t["value"]) if "modes" in t else t["value"], mode)
    if opacity is not None:
        v = v[:7] + f"{round(opacity * 255):02x}"
    return v


def css_value(t, v):
    if t["type"] == "number":
        return f"{v}px"
    return v


# ---- tokens ----
colours = list(leaves(sem["Colours"]))
numbers = list(leaves(sem["Numbers"]))
resolved = {m: {} for m in MODES}
out = [":root {"]
for t in numbers:
    v = resolve(t["value"], None)
    out.append(f"  {var(t['name'])}: {css_value(t, v)};")
    for m in MODES:
        resolved[m][t["name"]] = v
# Primitives: only for effect styles (shadows) and the Colour page. Never bind in components.
prims = list(leaves(prim["Primitive_Color_Lib"]))
for t in prims:
    out.append(f"  {var('Primitive/' + t['name'])}: {t['value']};")
out.append("}")
for m in MODES:
    out.append(f':root[data-mode="{m}"] {{')
    for t in colours:
        v = resolve(t["modes"][m], m)
        resolved[m][t["name"]] = v
        out.append(f"  {var(t['name'])}: {css_value(t, v)};")
    out.append("}")
tokens_css = "\n".join(out) + "\n"
if re.search(r": [^;]*\{", tokens_css):
    sys.exit("unresolved alias in tokens.css")

# ---- typography: parse Typography.md §3 table ----
WEIGHT = {"Regular": 400, "Semi Bold": 600, "Bold": 700}
typo, type_css = [], []
for line in (F / "Typography.md").read_text().splitlines():
    m = re.match(r"\| `([^`]+)` \| `([^`]+)` \| ([^|]+) \| \**([A-Za-z ]+?) \d+\** \| (\d+) \| (\d+)% \| ([^|]+) \| ([^|]+) \|", line)
    if not m:
        continue
    style, token, fam, w, size, lh, track, case = (s.strip() for s in m.groups())
    tm = re.search(r"\(([+−-][\d.]+)\)", track)
    ls = float(tm.group(1).replace("−", "-")) if tm else 0
    cls = "t-" + re.sub(r"[^a-z0-9]+", "-", token.lower()).strip("-")
    typo.append(dict(style=style, token=token, family=fam, weight=WEIGHT[w], size=int(size),
                     lh=int(lh) / 100, ls=ls, upper="UPPER" in case, cls=cls))
    ff = "'Libre Baskerville', serif" if "Baskerville" in fam else "Inter, sans-serif"
    type_css.append(f".{cls} {{ font-family: {ff}; font-weight: {WEIGHT[w]}; font-size: var(--text-size-{size}); "
                    f"line-height: {int(lh) / 100}; letter-spacing: {ls}px;"
                    + (" text-transform: uppercase;" if "UPPER" in case else "") + " }")
if len(typo) != 22:
    sys.exit(f"expected 22 text styles, parsed {len(typo)}")

# ---- manifest ----
def front(md):
    rows = dict(re.findall(r"^\| \*\*([^*]+)\*\* \| (.+) \|$", md, re.M))
    return {"status": rows.get("Status", ""), "figma": rows.get("Figma", ""),
            "updated": rows.get("Last updated", "")}


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


components = []
for p in sorted((READY / "components").glob("*.md")):
    if p.name.startswith("_"):
        continue
    s = slug(p.stem)
    components.append({"name": p.stem, "slug": s, "spec": f"specs/components/{p.name}",
                       "coded": (SRC / "components" / s / f"{s}.js").exists(), **front(p.read_text())})
foundations = [{"name": p.stem, "slug": slug(p.stem), "spec": f"specs/foundations/{p.name}", **front(p.read_text())}
               for p in sorted(F.glob("*.md"))]

# ---- write ----
if DIST.exists():
    shutil.rmtree(DIST)
shutil.copytree(SRC, DIST)
shutil.copytree(READY / "components", DIST / "specs/components", ignore=shutil.ignore_patterns("_*"))
shutil.copytree(F, DIST / "specs/foundations", ignore=shutil.ignore_patterns("*.json"))
for p in ("_FOUNDATIONS.md", "AGENTS.md", "README.md"):
    shutil.copy(READY / p, DIST / "specs" / p)
(DIST / ".nojekyll").write_text("")  # GitHub Pages: serve _FOUNDATIONS.md as-is
(DIST / "tokens.css").write_text(tokens_css + "\n" + "\n".join(type_css) + "\n")
(DIST / "manifest.json").write_text(json.dumps({
    "modes": MODES, "components": components, "foundations": foundations, "typography": typo,
    "tokens": resolved,
    "colourNames": [t["name"] for t in colours],
    "numberNames": [t["name"] for t in numbers],
    "primitives": {t["name"]: t["value"] for t in prims},
}, indent=1))
print(f"built {len(components)} components ({sum(c['coded'] for c in components)} coded), "
      f"{len(colours)} colour + {len(numbers)} number tokens x {len(MODES)} modes -> {DIST}")
