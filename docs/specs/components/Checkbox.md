# Checkbox

| | |
|---|---|
| **Status** | **Ready** in `Platform`, `Product` and `Studio`, on every surface. **Blocked** in `Lux`. In `Loyalty`, **ready on Canvas, `Low_Contrast/Surface_2` and `Surface_3`, blocked on `Low_Contrast/Surface_1`**. See Accessibility |
| **Figma** | `Checkbox` · set `40000450:54205` · key `93fee218e6dca997839a9ca5d77cdbad3ca56d46` · page `Checkbox and Radio button` `4196:804` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-29 |

Read `../_FOUNDATIONS.md` first. Token values per mode are in
`../foundations/Colour.md` Part B and `../foundations/Numbers.md`; the icon render
configuration is in `../foundations/Icons.md`.

## What it is

A box that records one independent yes-or-no choice, held until the user confirms
the step.

## When to use

- Several choices that are each true or false on their own — notification types,
  which rooms a schedule applies to, which devices to include in a scene.
- A single agreement before continuing, such as accepting terms.
- A parent row that selects or clears every child under it, which is the only
  thing that ever shows `Indeterminate`.

## When not to use

- The change should take effect the moment it is tapped — that is a **Switch**.
  This is the line that matters most in an IoT settings menu, and it is the one
  most often crossed.
- Exactly one option must be chosen from a set — that is a **Radio Button**.
- The thing being chosen is a whole object with its own name, icon and detail —
  that is a **Check Circle**.
- The user is narrowing a list that stays on screen — that is a **Filter Chip**.

## Anatomy

```
Checkbox        touch target, fixed square. Takes the focus ring
└── Visible     state layer, square, centred. Takes the hover and pressed tint
    └── Icon    Material Symbols glyph, the only thing visible at rest
```

**The control carries no label of its own.** The text beside it is placed by the
screen, and that text supplies the accessible name.

### Layout, frame by frame

| Frame | Direction | Width | Height | Alignment | Padding | Corner radius | Clips | Fill at rest |
|---|---|---|---|---|---|---|---|---|
| `Checkbox` | row | fixed `Size/Touch_Target` | fixed `Size/Touch_Target` | child centred on both axes | 0 | `Corner Radius/Zero` | yes | none |
| `Visible` | row | hug | hug | — | `Space/Small` on all four sides | `Corner Radius/Zero` | yes | none |
| `Icon` | — | `Size/Icon/XL` | `Size/Icon/XL` | — | — | — | — | glyph only |

The state layer is square here and circular on Radio Button and Check Circle.
That is intentional.

### Geometry — generated from Figma, 2026-09-29

| Part | Size |
|---|---|
| Touch target | 48 × 48 |
| State layer | 40 × 40 |
| Glyph box | 24 × 24 |
| Drawn glyph inside the box | 17 × 17, inset 3.5 on every side |

Token values: `Size/Touch_Target` 48 · `Space/Small` 8 · `Size/Icon/XL` 24 ·
`Stroke Width/Bold` 2 · `Corner Radius/Zero` 0.

### The glyph

Render it from **Material Symbols** with the configuration in `Icons.md`
(Rounded, optical size 24, weight 300, grade 0), except for the Fill axis, which
this component sets:

| `Selected` | Symbol | `Fill = Yes` | `Fill = No` |
|---|---|---|---|
| `Yes` | `check_box` | FILL 1 | FILL 0 |
| `No` | `check_box_outline_blank` | **FILL 0** | FILL 0 |
| `Indeterminate` | `indeterminate_check_box` | FILL 1 | FILL 0 |

`Selected = No` always renders FILL 0, whatever `Fill` says: the design draws the
same empty outline at both `Fill` values.

## Properties

These mirror the Figma component properties exactly.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Selected` | variant | `Yes` · `No` · `Indeterminate` | `Yes` | `Indeterminate` is computed, never tapped into — see Behaviour |
| `State` | variant | `Enabled` · `Hover` · `Pressed` · `Focused` · `Disabled` | `Enabled` | |
| `Fill` | variant | `Yes` · `No` | `Yes` | Filled or outlined glyph. **No effect when `Selected = No`** |

30 variants. The ten `Selected = No` variants are five identical pairs. Every
colour, size, space, radius and stroke width is bound; none is raw.

## States

The same change applies to every `Selected` and `Fill` value.

| State | What changes, relative to `Enabled` |
|---|---|
| `Enabled` | Resting. Glyph only; the state layer has no fill. |
| `Hover` | `Visible` fills with `Component/Selection_Control/Overlay/Hover`. No shadow. Pointer platforms only. |
| `Pressed` | `Visible` fills with `Component/Selection_Control/Overlay/Pressed`. |
| `Focused` | Focus ring on the outer `Checkbox` frame: `Stroke/Focus/Default`, width `Stroke Width/Bold`, outside the frame, square corners. |
| `Disabled` | `Visible` at 50% opacity, glyph included. The touch target is unchanged. Not tappable. |

`Hover` does not exist on touch. Build it for web and for keyboard-plus-pointer,
and do not treat it as the press feedback on a phone — `Pressed` is the only
feedback a finger gets.

The pressed tint is lighter than the hover tint. That is the design, not a defect.

### Indeterminate

`Indeterminate` means *some but not all children are selected*. It is a computed
display state, never something a tap produces directly:

- Tapping a parent showing `Indeterminate` selects **all** children, not none.
- Tapping a parent showing `Yes` clears all children.
- The parent never shows `Indeterminate` because of its own value — it has none.

In code the value is three-state: `true`, `false`, `null`.

## Behaviour

Tapping anywhere in the 48 × 48 frame toggles the box. When the checkbox sits
inside a Selection List Item the **whole row** is the target, not the box — the
box itself must not be a second, smaller target inside a larger one.

The visual change is immediate and local. Nothing is sent.

These controls have **only the interaction axis**. They do not carry the device
axis from `_FOUNDATIONS.md` §2 — no `Offline`, no `Pending`, no `Failed` — because
nothing is sent when they are tapped. A selection is held locally until the user
presses the button that ends the step, and it is that button that owns the
optimistic UI, the timeout and the revert.

If you find yourself wanting an offline or pending state on one of these, the
control is being used where a Switch belongs. Fix that instead.

The control never changes size. There is no Size property.

## Tokens

| Part | Token |
|---|---|
| Glyph — selected, unselected and indeterminate | `Component/Selection_Control/Icon/Selected/Default` |
| State layer, Hover | `Component/Selection_Control/Overlay/Hover` |
| State layer, Pressed | `Component/Selection_Control/Overlay/Pressed` |
| Focus ring | `Stroke/Focus/Default`, width `Stroke Width/Bold`, outside the touch target |
| Touch target | `Size/Touch_Target` |
| Glyph box | `Size/Icon/XL` |
| State layer padding | `Space/Small` |
| State layer and touch target radius | `Corner Radius/Zero` |

**Overlay tokens carry their own transparency.** Use the token value as-is; do
not add a second opacity on top.

There is no separate token for the unselected glyph: selected and unselected both
draw in the theme CTA colour. That is why an unchecked box is brand red in
`Platform` rather than neutral grey. Whether it stays that way is not yet ruled;
see Open questions.

## Accessibility

| Field | Value |
|---|---|
| Semantic role | checkbox |
| Label | The visible label beside it. If there is no visible label, the checkbox is inside a row and the row's text is the name |
| State | checked / unchecked / mixed; disabled when `Disabled` |
| Focus order | One stop for the row. The glyph is not separately focusable |
| Touch target | 48 × 48, carried by the outer frame |

### Where it can ship

The glyph is a graphical control, so the threshold is **3:1** (WCAG 1.4.11),
against the surface the checkbox sits on. The focus ring uses the same colour
value in every mode, so it passes and fails in the same cells.

| Mode | Canvas | `Low_Contrast/Surface_1` | `Surface_2` | `Surface_3` |
|---|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ |
| Lux | ❌ | ❌ | ❌ | ❌ |
| Loyalty | ✅ | ❌ | ✅ | ✅ |
| Studio | ✅ | ✅ | ✅ | ✅ |

**Do not ship a ❌ cell.** The fault is in the value that
`Component/Selection_Control/Icon/Selected/Default` carries in those modes, not in
the component. Fixing that one token clears Checkbox, Radio Button and Check
Circle together, with no code change.

`Disabled` drops below 3:1 because the state layer runs at 50%. That is allowed —
inactive controls are exempt.

### Implementation

Web:

```html
<label>
  <input type="checkbox" id="all-rooms">
  Apply to all rooms
</label>
```

```js
// indeterminate is a property, not an attribute — it cannot be set in HTML
el.indeterminate = true;   // also sets aria-checked="mixed" for AT
```

Flutter:

```dart
Checkbox(
  tristate: true,          // required for Indeterminate
  value: allSelected,      // true | false | null
  onChanged: enabled ? (v) => ... : null,   // null disables it
)
```

`tristate: true` is what makes `null` legal. Without it, passing `null` throws.
The stock Material `Checkbox` draws its own box; to match the design, render the
Material Symbols glyph from the table above inside a 40 × 40 square state layer
rather than relying on the default painter.

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

- The label states the thing being chosen, not the action: "Daily summary", not
  "Enable daily summary".
- Sentence case.
- Write it so it reads true when checked. If the label needs "Don't" or "Never"
  to make sense, invert it.
- Labels wrap. They do not truncate — a truncated choice is an unreadable choice.

## Do

- Put the checkbox at the leading edge of the row, with the label to its trailing side.
- Make the whole row tappable, and give it at least 48 of height.
- Use `Indeterminate` only on a parent that has children.
- Keep a list of checkboxes in a stable order — never reorder on selection.
- Render `Selected = No` at FILL 0 whatever `Fill` is set to.

## Don't

- Don't use a checkbox for something that takes effect immediately. That is a Switch.
- Don't use a single checkbox where the two outcomes are opposites rather than on and off — that is a Radio Button pair.
- Don't rely on `Fill` to distinguish the unselected states; it does nothing there.
- Don't put the focus ring on the state layer. It goes on the 48 × 48 frame.
- Don't round the state layer. It is square on Checkbox.
- Don't instance `.[DEPRECATED] Checkbox` `18698:11449` or the `[DEPRECATED] Checkbox` frame `13630:13697`. They carry a `Theme` axis that v1.3 replaced with colour modes.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-26 | Unselected draws in the same CTA colour as selected. Not ruled. If it changes, the unselected glyph gets its own token and needs a new binding. | Design owner |
| 2026-09-26 | `Fill` produces two identical variants when `Selected = No`. Remove the duplicates, or keep them for API symmetry? Removing them is a breaking change for placed instances. | Design owner |
| 2026-09-29 | The glyph and focus ring are below 3:1 in Lux and on Loyalty `Surface_1`. Which token value changes? | Design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-29 | Overlay tokens are used as-is; the token carries the transparency. |
| 2026-09-29 | Where it can ship is stated per surface. Loyalty ships on Canvas, `Surface_2` and `Surface_3`. |
| 2026-09-29 | Glyph specified as Material Symbols names and Fill values per variant. |
