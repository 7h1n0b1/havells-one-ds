# Radio Button

| | |
|---|---|
| **Status** | **Ready** in `Platform`, `Product` and `Studio`, on every surface. **Blocked** in `Lux`. In `Loyalty`, **ready on Canvas, `Low_Contrast/Surface_2` and `Surface_3`, blocked on `Low_Contrast/Surface_1`**. See Accessibility |
| **Figma** | `Radio Button` · set `40000451:3265` · key `e02bdd2b4adfe83c537c37f408daa6ceab6a9f52` · page `Checkbox and Radio button` `4196:804` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-29 |

Read `../_FOUNDATIONS.md` first. Token values per mode are in
`../foundations/Colour.md` Part B and `../foundations/Numbers.md`; the icon render
configuration is in `../foundations/Icons.md`.

## What it is

A circle that picks exactly one option out of a set, held until the user confirms
the step.

## When to use

- Two to five alternatives where choosing one rules out the rest — fan speed
  preset, temperature unit, which schedule a device follows.
- The options need to be visible side by side so they can be compared. If they
  do not, a Dropdown is smaller.
- One option is always chosen, including before the user touches anything.

## When not to use

- The user must be able to choose nothing. A Radio Button cannot be unselected by
  tapping it, so this is the wrong control — use a **Checkbox** or add an explicit
  "None" option to the set.
- More than one can be chosen — that is a **Checkbox**.
- There are more than about five options — that is a **Dropdown** or a full list.
- The choice takes effect immediately — that is a **Switch**, or for a small set
  of modes, the mode selector cluster.
- The user is switching between views rather than choosing a value — that is
  **Tabs**.

## Anatomy

```
Radio Button     outer frame, always 48x48 — the touch target
└── Visible          the 40x40 state layer, circular (`Corner Radius/Circular`)
    └── Icon         24x24 Material glyph, the only thing normally visible
```

### Layout, frame by frame

| Frame | Direction | Width | Height | Alignment | Padding | Corner radius | Clips | Fill at rest |
|---|---|---|---|---|---|---|---|---|
| `Radio Button` | row | fixed `Size/Touch_Target` | fixed `Size/Touch_Target` | child centred on both axes | 0 | `Corner Radius/Zero` | yes | none |
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
(Rounded, optical size 24, FILL 0, weight 300, grade 0). There is no deviation.

| `Selected` | Symbol |
|---|---|
| `Yes` | `radio_button_checked` — ring with a centre dot |
| `No` | `radio_button_unchecked` — empty ring |

**The control carries no label of its own.** The text beside it is placed by the
screen, and that text supplies the accessible name.

## Properties

These mirror the Figma component properties exactly.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Selected` | variant | `Yes` · `No` | `Yes` | |
| `State` | variant | `Enabled` · `Hover` · `Pressed` · `Focused` · `Disabled` | `Enabled` | |

10 variants. Every colour, size, space, radius and stroke width is bound; none is raw. No `Fill` property — unlike Checkbox and Check Circle, the radio
glyph has only one form.

## States

The same change applies to every `Selected` value.

| State | What changes, relative to `Enabled` |
|---|---|
| `Enabled` | Resting. Glyph only; the state layer has no fill. |
| `Hover` | `Visible` fills with `Component/Selection_Control/Overlay/Hover`. No shadow. Pointer platforms only. |
| `Pressed` | `Visible` fills with `Component/Selection_Control/Overlay/Pressed`. |
| `Focused` | Focus ring on the outer `Radio Button` frame: `Stroke/Focus/Default`, width `Stroke Width/Bold`, outside the frame, square corners. |
| `Disabled` | `Visible` at 50% opacity, glyph included. The touch target is unchanged. Not tappable. |

`Hover` does not exist on touch. Build it for web and for keyboard-plus-pointer,
and do not treat it as the press feedback on a phone — `Pressed` is the only
feedback a finger gets.

The pressed tint is lighter than the hover tint. That is the design, not a defect.

## Behaviour

Tapping anywhere in the 48 frame selects that option and clears whichever option
was selected before. **Tapping the selected option does nothing** — it does not
clear itself. That single rule is what separates a Radio Button from a Checkbox,
and it is the one developers most often get wrong by wiring a toggle.

The group, not the button, owns the value. In code there is one value for the
group and each button compares itself against it.

When a radio sits inside a Selection List Item the **whole row** is the target,
not the circle.

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
| Semantic role | radio, inside a radiogroup |
| Label | the visible label beside it, or the row's text |
| Group label | the radiogroup needs its own name — the question being answered, such as "Temperature unit" |
| State | checked / unchecked; disabled when `Disabled` |
| Focus order | **the whole group is one tab stop.** Arrow keys move between options inside it. This is native behaviour — do not make each radio its own tab stop |

Touch target is 48 x 48 even though the glyph is 24.

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

Web:

```html
<fieldset role="radiogroup">
  <legend>Temperature unit</legend>
  <label><input type="radio" name="unit" value="c" checked> Celsius</label>
  <label><input type="radio" name="unit" value="f"> Fahrenheit</label>
</fieldset>
```

The shared `name` is what makes them one group, and what gives arrow-key movement
for free. Without it they behave as unrelated checkboxes.

Flutter:

```dart
RadioGroup<Unit>(
  groupValue: unit,
  onChanged: (v) => setState(() => unit = v!),
  child: Column(children: const [
    RadioListTile(value: Unit.celsius, title: Text('Celsius')),
    RadioListTile(value: Unit.fahrenheit, title: Text('Fahrenheit')),
  ]),
)
```

Pass `onChanged: null` to disable. **Check against the Flutter version in use —
`RadioGroup` replaced the per-`Radio` `groupValue`/`onChanged` API, and on older
versions each `Radio` still takes both itself.**

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

- Label each option with the value it sets, not with a sentence: "Celsius", not
  "Use Celsius".
- Keep the options parallel — same part of speech, same length where possible.
- The group needs a label of its own. A set of radios with no question above it
  is unreadable to a screen reader.
- Sentence case. Labels wrap, they do not truncate.

## Do

- Give every group a preselected option. A group where nothing is selected forces
  the user to guess what the default was.
- Keep the options in a fixed, meaningful order — smallest to largest, or most to
  least common. Never reorder on selection.
- Put the circle at the leading edge, label trailing.
- Add an explicit "None" or "Off" option if choosing nothing is legal.

## Don't

- Don't let tapping the selected option clear it.
- Don't use radios for two options that are plainly on and off — that is a Switch
  if it applies immediately, a Checkbox if it does not.
- Don't make each radio a separate tab stop.
- Don't instance `.[DEPRECATED] Radio buttons` `18701:2526` or the
  `[DEPRECATED] Radio button` frame `13636:16930`.
- Don't put the focus ring on the circle. It goes on the 48 × 48 frame.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-26 | Unselected draws in the same CTA colour as selected. Not ruled. If it changes, the unselected glyph gets its own token and needs a new binding. | Design owner |
| 2026-09-29 | The glyph and focus ring are below 3:1 in Lux and on Loyalty `Surface_1`. Which token value changes? | Design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-29 | Where it can ship is stated per surface. Loyalty ships on Canvas, `Surface_2` and `Surface_3`. |
| 2026-09-29 | Glyph specified as Material Symbols names and Fill values per variant. |
| 2026-09-29 | Overlay tokens are used as-is; the token carries the transparency. |
