# Check Circle

| | |
|---|---|
| **Status** | **Ready** in `Platform`, `Product` and `Studio`, on every surface. **Blocked** in `Lux`. In `Loyalty`, **ready on Canvas, `Low_Contrast/Surface_2` and `Surface_3`, blocked on `Low_Contrast/Surface_1`**. See Accessibility |
| **Figma** | `Check Circle` · set `40000452:3315` · key `a120a6cfeea624b73ba151fdcf613d818684d61d` · page `Checkbox and Radio button` `4196:804` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-29 |

Read `../_FOUNDATIONS.md` first. Token values per mode are in
`../foundations/Colour.md` Part B and `../foundations/Numbers.md`; the icon render
configuration is in `../foundations/Icons.md`.

## What it is

A round tick that confirms a whole row is selected, used where the thing being
chosen is an object rather than a label.

## When to use

- Picking devices, rooms or scenes from a list, where each row already has its
  own name, icon and detail line.
- Multi-select inside a sheet or a picker that ends with a confirm button.
- Anywhere the row is clearly the target and a small square box beside a rich row
  would look like an afterthought.

## When not to use

- The choice is a plain label with no object behind it — that is a **Checkbox**.
  Check Circle is for rows, Checkbox is for statements.
- Exactly one row may be chosen — that is a **Radio Button**, even inside a rich
  row. A round tick that behaves like a radio will be read as multi-select and
  tapped twice.
- The change applies immediately — that is a **Switch**.
- The row navigates somewhere instead of being chosen — that is a plain List Item
  with a chevron.

## Anatomy

```
Check Circle     outer frame, always 48x48 — the touch target
└── Visible          the 40x40 state layer, circular (`Corner Radius/Circular`)
    └── Icon         24x24 Material glyph, the only thing normally visible
```

### Layout, frame by frame

| Frame | Direction | Width | Height | Alignment | Padding | Corner radius | Clips | Fill at rest |
|---|---|---|---|---|---|---|---|---|
| `Check Circle` | row | fixed `Size/Touch_Target` | fixed `Size/Touch_Target` | child centred on both axes | 0 | `Corner Radius/Zero` | yes | none |
| `Visible` | row | hug | hug | — | `Space/Small` on all four sides | `Corner Radius/Circular` | yes | none |
| `Icon` | — | `Size/Icon/XL` | `Size/Icon/XL` | — | — | — | — | glyph only |

### Geometry — generated from Figma, 2026-09-29

| Part | Size |
|---|---|
| Touch target | 48 × 48 |
| State layer | 40 × 40, circular |
| Glyph box | 24 × 24 |
| Drawn glyph inside the box | 19 × 19, inset 2.5 on every side |

Token values: `Size/Touch_Target` 48 · `Space/Small` 8 · `Size/Icon/XL` 24 ·
`Stroke Width/Bold` 2 · `Corner Radius/Circular` 9999 · `Corner Radius/Zero` 0.

### The glyph

Render it from **Material Symbols** with the configuration in `Icons.md`
(Rounded, optical size 24, weight 300, grade 0), except for the Fill axis, which
this component sets:

| `Selected` | Symbol | `Fill = Yes` | `Fill = No` |
|---|---|---|---|
| `Yes` | `check_circle` | FILL 1 — solid disc, knocked-out tick | FILL 0 — ring with a tick inside |
| `No` | `radio_button_unchecked` | **FILL 0** | FILL 0 |

`Selected = No` always renders FILL 0, whatever `Fill` says: the design draws the
same empty ring at both `Fill` values.

**The control carries no label of its own.** The text beside it is placed by the
screen, and that text supplies the accessible name.

## Properties

These mirror the Figma component properties exactly.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Selected` | variant | `Yes` · `No` | `Yes` | |
| `State` | variant | `Enabled` · `Hover` · `Pressed` · `Focused` · `Disabled` | `Enabled` | |
| `Fill` | variant | `Yes` · `No` | `Yes` | Solid disc with a knocked-out tick, or a ring with a tick inside. **No effect when `Selected = No`** |

20 variants. The ten `Selected = No` variants are five identical pairs. Every
colour, size, space, radius and stroke width is bound; none is raw.

Unselected draws `radio_button_unchecked`, the same empty ring the Radio Button
uses. On its own, a Check Circle in its unselected state is indistinguishable
from an unselected Radio Button. Only the selected state tells them apart, and
only then by the tick. Keep the two out of the same list.

## States

The same change applies to every `Selected` and `Fill` value.

| State | What changes, relative to `Enabled` |
|---|---|
| `Enabled` | Resting. Glyph only; the state layer has no fill. |
| `Hover` | `Visible` fills with `Component/Selection_Control/Overlay/Hover`. No shadow. Pointer platforms only. |
| `Pressed` | `Visible` fills with `Component/Selection_Control/Overlay/Pressed`. |
| `Focused` | Focus ring on the outer `Check Circle` frame: `Stroke/Focus/Default`, width `Stroke Width/Bold`, outside the frame, square corners. |
| `Disabled` | `Visible` at 50% opacity, glyph included. The touch target is unchanged. Not tappable. |

`Hover` does not exist on touch. Build it for web and for keyboard-plus-pointer,
and do not treat it as the press feedback on a phone — `Pressed` is the only
feedback a finger gets.

The pressed tint is lighter than the hover tint. That is the design, not a defect.

## Behaviour

Tapping anywhere in the row toggles it. The circle is never its own target — if
the circle is tappable and the row is not, users will aim at the circle and miss.

`Fill=Yes` is the stronger read and should be the default for multi-select lists.
`Fill=No` is for dense lists where a run of solid discs would dominate the page.
Pick one per list and keep it — mixing them inside one list reads as two
different meanings.

The visual change is immediate and local. Nothing is sent.

These controls have **only the interaction axis**. They do not carry the device
axis from `_FOUNDATIONS.md` §2 — no `Offline`, no `Pending`, no `Failed` — because
nothing is sent when they are tapped. A selection is held locally until the user
presses the button that ends the step, and it is that button that owns the
optimistic UI, the timeout and the revert.

If you find yourself wanting an offline or pending state on one of these, the
control is being used where a Switch belongs. Fix that instead.

## Tokens

| Part | Token |
|---|---|
| Glyph, selected and unselected | `Component/Selection_Control/Icon/Selected/Default` |
| State layer, Hover | `Component/Selection_Control/Overlay/Hover` |
| State layer, Pressed | `Component/Selection_Control/Overlay/Pressed` |
| Focus ring | `Stroke/Focus/Default`, width `Stroke Width/Bold`, outside the touch target |
| Touch target | `Size/Touch_Target` |
| Glyph box | `Size/Icon/XL` |
| State layer padding | `Space/Small` |
| State layer radius | `Corner Radius/Circular` |
| Touch target radius | `Corner Radius/Zero` |

**Overlay tokens carry their own transparency.** Use the token value as-is; do
not add a second opacity on top.

There is no separate token for the unselected glyph: selected and unselected both
draw in the theme CTA colour.
That is why an unselected control is brand red in `Platform` rather than neutral
grey. Whether it stays that way is not yet ruled; see Open questions.

## Accessibility

| Field | Value |
|---|---|
| Semantic role | checkbox — it is a multi-select control, whatever its shape |
| Label | the row's primary text. The circle contributes nothing to the name |
| State | checked / unchecked; disabled when `Disabled` |
| Focus order | one stop for the row. The circle is not separately focusable, and neither is the row's icon |

Touch target is 48 x 48 for the control, but the real target is the row, which is
taller. Do not shrink the row below 48.

Check Circle is not a native control on either platform. It is an icon standing
in for a checkbox, which means the semantics have to be added by hand — the
browser and the framework will not supply them. This is the single most common
way a rich selection list ends up unusable with a screen reader.

### Where it can ship

The glyph is a graphical control, so the threshold is **3:1** (WCAG 1.4.11),
against the surface the control sits on. The focus ring uses the same colour value
in every mode, so it passes and fails in the same cells.

| Mode | Canvas | `Low_Contrast/Surface_1` | `Surface_2` | `Surface_3` |
|---|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ |
| Lux | ❌ | ❌ | ❌ | ❌ |
| Loyalty | ✅ | ❌ | ✅ | ✅ |
| Studio | ✅ | ✅ | ✅ | ✅ |

**Do not ship a ❌ cell.** The fault is in the value that
`Component/Selection_Control/Icon/Selected/Default` carries in those modes, not in
the component. Fixing that one token clears Checkbox, Radio Button and
Check Circle together, with no code change.

`Disabled` drops below 3:1 in every mode because the state layer runs at 50%.
That is allowed — inactive controls are exempt.

### Implementation

Web — the row is the control, the circle is decoration:

```html
<div role="checkbox" tabindex="0" aria-checked="true" aria-labelledby="dev-1-name">
  <img src="..." alt="">
  <span id="dev-1-name">Living room fan</span>
  <span class="detail">On · 3 of 5</span>
  <svg aria-hidden="true"><!-- check_circle --></svg>
</div>
```

`role="checkbox"` on a `div` brings no keyboard behaviour with it. Space must be
wired by hand, and `tabindex="0"` is what puts the row in the tab order at all.

Flutter:

```dart
Semantics(
  checked: selected,
  enabled: enabled,
  label: deviceName,
  child: InkWell(
    onTap: enabled ? () => toggle() : null,
    child: ...,   // the Icon is ExcludeSemantics
  ),
)
```

Wrap the icon in `ExcludeSemantics` so it is not announced a second time.

## Haptics

| Event | Fires |
|---|---|
| Tap | Selection changed — light impact |

One haptic, on the tap that changes the selection. Nothing else fires, because
these controls do not talk to a device — see Behaviour. Do not fire anything on
`Disabled`, and do not fire a second time when the step is later confirmed; that
haptic belongs to the button that confirms it.

See `_FOUNDATIONS.md` §5. The haptics map is still awaiting sign-off.

## Content

- The row's primary text is the name of the object: "Living room fan", not
  "Select living room fan".
- The detail line carries state, not instructions.
- Sentence case. The primary text may truncate at one line; the detail line may
  truncate at one line. Never truncate both to nothing.

## Do

- Make the whole row tappable and at least 48 high.
- Put the circle at the trailing edge of the row, where a tick reads as a result.
  A leading circle reads as a checkbox and invites Checkbox expectations.
- Pick `Fill=Yes` or `Fill=No` once per list and stay with it.
- Show a count of what is selected when the list can run past one screen.

## Don't

- Don't use a Check Circle for single-select. Users read a round tick as
  multi-select and will try to tick a second row.
- Don't put Check Circles and Radio Buttons in the same list — unselected, they
  are the same empty ring.
- Don't rely on `Fill` to distinguish the unselected states; it does nothing there.
- Don't leave the row without a role. The circle is an image and announces nothing.
- Don't instance `.[DEPRECATED] Check_Circle` `18698:12822`.
- Don't put the focus ring on the circle. It goes on the 48 × 48 frame, or on the row when the row is the target.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-26 | Unselected draws in the same CTA colour as selected. Not ruled. If it changes, the unselected glyph gets its own token and needs a new binding. | Design owner |
| 2026-09-26 | Unselected Check Circle and unselected Radio Button are the same glyph. Should Check Circle's unselected state get its own shape? | Design owner |
| 2026-09-29 | `Fill` produces two identical variants when `Selected = No`. Remove the duplicates, or keep them for API symmetry? Removing them is a breaking change for placed instances. | Design owner |
| 2026-09-29 | The glyph and focus ring are below 3:1 in Lux and on Loyalty `Surface_1`. Which token value changes? | Design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-29 | Where it can ship is stated per surface. Loyalty ships on Canvas, `Surface_2` and `Surface_3`. |
| 2026-09-29 | Glyph specified as Material Symbols names and Fill values per variant. |
| 2026-09-29 | Overlay tokens are used as-is; the token carries the transparency. |
