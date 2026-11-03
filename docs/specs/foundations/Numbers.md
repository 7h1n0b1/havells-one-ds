# Numbers

| | |
|---|---|
| **Figma** | `(Havells One) Component UI v1.3` · key `pgOKFbALAAtm6NX5xTqxHO` · `Numbers` collection |
| **Last updated** | 2026-09-28 |

**How to read this file.** Every number in the design system — spacing, corner
radius, stroke width, type size, size — comes from a `Numbers` variable. Rules
below are ruled by the design owner. Anything under **Not decided** is genuinely
undecided — ask rather than infer.

---

## 1. The one rule that never bends

**Bind the semantic token. Never the primitive, never a number.**

`Space/Medium`, not `Numbers/16`, and certainly not `16`. A value with no token is
a stop sign, not a licence to type a number.

There are two layers:

| Layer | Collection | Example | Bind it? |
|---|---|---|---|
| Primitive | `_Base_Semantic_Library` | `Numbers/16` | **No.** Raw value, no meaning |
| Semantic | `Numbers` | `Space/Medium` | **Yes** |

Every semantic token aliases a primitive. Fractional primitives are written with a
hyphen because Figma does not allow a dot in a variable name: `Numbers/1-5` is
1.5.

---

## 2. Space

| Token | Value | Separates |
|---|---:|---|
| `Space/Zero` | 0 | role not stated — see Not decided |
| `Space/XXS` | 2 | role not stated — see Not decided |
| `Space/XS` | 4 | inside a control |
| `Space/Small` | 8 | an icon and its label; tight pairs |
| `Space/Medium` | 16 | one component from the next; **the screen side margin** |
| `Space/Rare` | 24 | one section from the next |
| `Space/Large` | 32 | major breaks, such as above a page title |

**Anything outside this ladder is an exception that has to be argued for.**

| Token | Value | Note |
|---|---:|---|
| `Space/XL` | 64 | on scale, no role stated |
| `Space/XXL` | 128 | on scale, no role stated |
| `Space/Number-10` | 10 | **off scale — treat as legacy** |
| `Space/Number-12` | 12 | **off scale — treat as legacy** |
| `Space/Number-14` | 14 | **off scale — treat as legacy** |

Padding is always a pair of ladder steps. A list item pads `Space/Medium` left and
right and `Space/Small` top and bottom. Designers name these shapes — square,
squish, stretch, stack, inline — but they are vocabulary, not tokens. There is no
`space-inset-*` variable. Bind `Space/*`.

---

## 3. Corner radius

| Token | Value | Use |
|---|---:|---|
| `Corner Radius/Zero` | 0 | explicit no radius. Bind it rather than leaving a radius unset |
| `Corner Radius/2` | 2 | no use rule stated |
| `Corner Radius/4` | 4 | no use rule stated |
| `Corner Radius/6` | 6 | no use rule stated |
| `Corner Radius/10` | 10 | no use rule stated |
| `Corner Radius/12` | 12 | no use rule stated |
| `Corner Radius/16` | 16 | small surface cards |
| `Corner Radius/20` | 20 | no use rule stated |
| `Corner Radius/24` | 24 | banners and large surfaces |
| `Corner Radius/Circular` | 9999 | pills, circles, state layers |

---

## 4. Stroke width

| Token | Value |
|---|---:|
| `Stroke Width/Hairline` | 0.2 |
| `Stroke Width/Regular` | 1 |
| `Stroke Width/Medium` | 1.5 |
| `Stroke Width/Bold` | 2 |

Focus rings use `Stroke Width/Bold`. A 0.5 stroke in an older design is
`Stroke Width/Hairline`.

---

## 5. Type size

`Text Size/51 · 40 · 32 · 25 · 20 · 18 · 16 · 14 · 12 · 10`. Each text style binds
its size to one of these. **Bind the text style, not the size** — see
`Typography.md`.

---

## 6. Size

| Token | Value | Status |
|---|---:|---|
| `Size/Touch_Target` | 48 | the minimum tap target, see §7 |
| `Size/Icon/Small` | 12 | **provisional** — under review |
| `Size/Icon/Medium` | 14 | **provisional** — under review |
| `Size/Icon/Large` | 16 | **provisional** — under review |
| `Size/Icon/XL` | 24 | **provisional** — under review |

The `Size/Icon/*` tokens are bound in published components and are safe to read.
Whether they stay as a scale is under review; do not build new icon-size logic on
them.

---

## 7. Tap targets and hit area

**Every tap target is at least 48 x 48, even when the visible control is
smaller.**

```
A11y frame      fixed at 48 (Size/Touch_Target), centre-aligned,
                no padding of its own
└── Visible     hugs its content with tokenised padding
```

**Invisible padding is never a typed value.** It falls out of the two heights. A
24 glyph inside a 40 state layer inside a 48 frame needs no number anywhere —
`Space/Small` around the glyph and `Size/Touch_Target` on the frame produce it.

The focus ring is drawn on the A11y frame, so it never fights a component's own
stroke.

---

## 8. Layout rules that are captured

- **A skeleton keeps its component's footprint exactly** — same size, same
  padding, same radius — so the list does not reflow when data arrives.
- **Disabled is 50% opacity at the component.** No disabled tokens, and no
  disabled spacing.

---

## 9. Not decided — ask, do not infer

| Question | Status |
|---|---|
| What `Space/Zero` and `Space/XXS` each separate | `OPEN` |
| Whether new work may use `Space/Number-10/12/14` | `OPEN` |
| Screen margins beyond the side margin, and whether any vary by breakpoint or theme | `NOT YET CAPTURED` |
| A grid or column system, if any | `NOT YET CAPTURED` |
| Breakpoints | `NOT YET CAPTURED` |
| Use rules for `Corner Radius` 2, 4, 6, 10, 12 and 20 | Not documented |
| Roles for `Space/XL` and `Space/XXL` | Not documented |

**Do not derive a layout rule from a screen in the Figma file.** What you would be
copying is one designer's choice on one day, not a system rule.
