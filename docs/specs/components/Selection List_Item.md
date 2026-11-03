# Selection List_Item

| | |
|---|---|
| **Status** | **Ready** in `Platform`, `Product` and `Studio` on every surface; **Loyalty** on Canvas, `Low_Contrast/Surface_2` and `Surface_3` only; **Lux** blocked. See Accessibility |
| **Figma** | `Selection List_Item 2.0` · set `40000601:10592` · page `Lists` `4258:8723` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-29 |

Read `../_FOUNDATIONS.md`, `Checkbox.md`, `Radio Button.md` and `Check Circle.md`
first. This row hosts one of those three; its shape and states are theirs. Token
values per mode are in `../foundations/Colour.md` Part B.

## What it is

A row whose outcome is a selection, not navigation. Tapping it toggles the
control at the trailing edge, and the whole row is the tap target.

## When to use

- Multi-select lists — pick zero, one or several from a set. The Control is
  `Checkbox`.
- Single-select lists — pick exactly one, and the value cannot clear itself
  once set. The Control is `Radio Button`.
- Object pickers — the thing being chosen is a named object with an icon or
  image. The Control is `Check Circle`.

## When not to use

- The row toggles a device setting the moment it is tapped — that is a
  **Switch List_Item**.
- The row navigates or fires one action — that is an **Action List_Item**.
- The row is a fact the user cannot act on — that is a **Read-only List_Item**.

## Anatomy

```
Selection List_Item     outer frame, hug × hug, carries the tap target
├── State layer         hover / pressed tint, focus ring parent
│   ├── Leading         optional icon (24) or media (40 slot)
│   ├── Content         Overline · Title · Supporting text
│   └── Trailing        instance of Checkbox, Radio Button or Check Circle
└── Divider             1 dp LINE, fills row width, flush against State layer, optional
```

**The divider is a `LINE` node**, not a rectangle or bordered frame. It sits
as a sibling of `State layer` inside the outer VERTICAL auto-layout with
`gap = 0` and `padding = 0`, so its stroke draws hard against the bottom edge
of the row.

The Control at the trailing edge is not a second tap target — its 48 × 48
frame overlaps the row's, and the row's tap fires the toggle.

### Layout, frame by frame

| Frame | Direction | Width | Height | Padding | Gap | Fill at rest |
|---|---|---|---|---|---|---|
| `Selection List_Item` | col | fill | hug, min `Size/Touch_Target` | `Space/Zero` | `Space/Zero` | none |
| `State layer` | row | fill | hug, min `Size/Touch_Target` | `Space/Small` vertical, `Space/Medium` horizontal | `Space/Medium` | none, or `Component/List_Item/Overlay/{Hover,Pressed}` |
| `Leading` | row | hug | hug | `Space/Zero` | `Space/Zero` | none |
| `Content` | col | fill | hug | `Space/Zero` | `Space/XXS` | none |
| `Trailing` | row | `Size/Touch_Target` | `Size/Touch_Target` | `Space/Zero` | `Space/Small` | none |
| `Control` | — | 48 | 48 | — | — | instance of Checkbox / Radio Button / Check Circle |
| `Divider` | LINE | fill | `Stroke Width/Regular` | — | — | stroke `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default`, weight `Stroke Width/Regular`, stroke align CENTER, visibility toggled by the `Divider` boolean |

### Geometry — generated from Figma, 2026-09-29

| Case | Height |
|---|---|
| Title only | 48 (touch target) |
| Title + Supporting | 65 |
| Title + Overline + Supporting | 78 |

The Trailing frame is 48 × 48 in every case — the control is always there.

## Properties

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Leading Element` | variant | `None` · `Icon` · `Media` | `None` | |
| `Control` | variant | `Checkbox` · `Radio Button` · `Check Circle` | `Checkbox` | The trailing atom. See When to use |
| `Selected` | variant | `No` · `Yes` | `No` | Drives the Control's own `Selected` |
| `State` | variant | `Enabled` · `Hover` · `Pressed` · `Focused` · `Disabled` | `Enabled` | |
| `Title` | text | any | `Primary text` | |
| `Overline` | text | any | `Label` | Shown only when `Has Overline = true` |
| `Supporting text` | text | any | `Supporting text` | Shown only when `Has Supporting text = true` |
| `Has Overline` | boolean | `true` · `false` | `false` | |
| `Has Supporting text` | boolean | `true` · `false` | `true` | |
| `Divider` | boolean | `true` · `false` | `true` | |
| `Leading Icon` | instance swap | any 24×24 Material Symbols icon | placeholder | Used when `Leading Element = Icon` |
| `Media` | instance swap | any 40×40 media | placeholder | Used when `Leading Element = Media` |

90 variants (3 Leading × 3 Control × 2 Selected × 5 State). Every colour,
spacing, radius, stroke width and text uses a token or a text style.

## States

The row and the trailing Control share a State. Both change together on hover,
pressed, focus and disabled.

| State | Row change | Control change |
|---|---|---|
| `Enabled` | Resting | Resting |
| `Hover` | `State layer` fills `Component/List_Item/Overlay/Hover` | Its own `Hover` overlay |
| `Pressed` | `State layer` fills `Component/List_Item/Overlay/Pressed` | Its own `Pressed` overlay |
| `Focused` | Outer frame gains `Stroke/Focus/Default` at `Stroke Width/Bold` | No focus ring on the atom — the row owns focus |
| `Disabled` | `State layer` at 50% opacity | 50% opacity (whole atom) |

**Focus is one stop.** The row is focusable; the atom inside it is not.

## Behaviour

Tapping anywhere in the row toggles the Control:

- **`Control = Checkbox`** — toggles between `Yes` and `No`. `Indeterminate` is
  computed by the caller for a parent row that summarises children; a tap
  never lands on `Indeterminate` directly (see `Checkbox.md`).
- **`Control = Radio Button`** — sets this row to `Yes` and clears its siblings.
  A tap on an already-selected radio does nothing (it does not clear itself).
- **`Control = Check Circle`** — toggles between `Yes` and `No`, like Checkbox.
  Use when the row's leading Media makes the whole row read as an object being
  chosen.

The visual change is immediate and local. Nothing is sent — the selection is
held until the caller ends the step with a confirm button. If you find
yourself wanting to send on tap, the row belongs on a **Switch List_Item**.

## Tokens

Row-level tokens, in addition to the parent atom's own tokens.

| Part | Token |
|---|---|
| State layer, `Hover` | `Component/List_Item/Overlay/Hover` |
| State layer, `Pressed` | `Component/List_Item/Overlay/Pressed` |
| Focus ring | `Stroke/Focus/Default`, width `Stroke Width/Bold`, on outer frame |
| Overline text | `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default`, style `Heading/Overline -` |
| Title text | `Text/Neutral/On_Low_Contrast/High_Emphasis/Default`, style `Label/L2 (14) -` |
| Supporting text | `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default`, style `Body/B3 (12) =` |
| Leading Icon | `Icon/On_Neutral/Low_Contrast/High_Emphasis/Default`, size `Size/Icon/XL` |
| `Divider` LINE | `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default`, weight `Stroke Width/Regular` |
| Row minimum height | `Size/Touch_Target` |
| Control size | `Size/Touch_Target` |
| State-layer padding | `Space/Small` vertical, `Space/Medium` horizontal |
| Content gap | `Space/XXS` |
| Leading / Trailing outer gap | `Space/Medium` |

For the Control's own tokens see `Checkbox.md`, `Radio Button.md` and
`Check Circle.md`.

## Accessibility

| Field | Value |
|---|---|
| Semantic role | `checkbox`, `radio` or `checkbox` (with Check Circle glyph), depending on `Control` |
| Label | The Title. The Overline is read as a preceding label if it adds meaning |
| State | `checked` / `unchecked` / `mixed` (Checkbox parent only); `disabled` when `Disabled` |
| Focus order | One stop for the row. The atom is not separately focusable |
| Touch target | 48 × 48, carried by the outer frame's `min-height` |

### Where it can ship

Inherits the parent atom's per-surface matrix. All three atoms fail the same
cells against the same shared token.

| Mode | Canvas | `Low_Contrast/Surface_1` | `Surface_2` | `Surface_3` |
|---|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ |
| Lux | ❌ | ❌ | ❌ | ❌ |
| Loyalty | ✅ | ❌ | ✅ | ✅ |
| Studio | ✅ | ✅ | ✅ | ✅ |

**Do not ship a ❌ cell.** The fault is in
`Component/Selection_Control/Icon/Selected/Default`, not in this row. Fixing
that token clears Checkbox, Radio Button, Check Circle **and** Selection
List_Item together.

The Loyalty `Surface_1` fail is the `Loyalty Primary/Base` glyph on
`Loyalty Secondary/600` — measured 2.42:1 against the 3:1 floor. See Open
questions.

### Implementation

Web (Checkbox variant):

```html
<label class="list-item">
  <span class="content">
    <span class="overline">Notifications</span>
    <span class="title">Daily summary</span>
    <span class="supporting">Sent every morning at 9am</span>
  </span>
  <input type="checkbox" name="daily-summary">
</label>
```

Flutter:

```dart
CheckboxListTile(
  title: Text('Daily summary'),
  subtitle: Text('Sent every morning at 9am'),
  value: dailySummary,
  onChanged: (v) => ...,
)
```

The stock `RadioListTile` and `CheckboxListTile` draw their own control — bind
the tokens above and use the shared v1.3 atoms rather than the framework
defaults.

## Haptics

| Event | Fires |
|---|---|
| Tap that changes the selection | Selection changed — light impact |

One haptic, on the tap that changes the value. Nothing else, ever. Not on
`Disabled`, not on a Radio tap that reselects the same row.

See `_FOUNDATIONS.md` §5.

## Content

- Title states the thing being chosen, not the action: "Daily summary", not "Enable daily summary".
- Sentence case.
- Write it so it reads true when selected. If the Title needs "Don't" or "Never", invert it.
- Titles wrap. They do not truncate — a truncated choice is an unreadable choice.
- Supporting text is optional context. If it repeats the Title, drop it.

## Do

- Keep a list of Selection List_Items in a stable order. Never reorder on selection.
- Put the Control at the trailing edge, always.
- Let the whole row take the tap. Never nest a second target inside it.
- Use one Control per list. Mixing `Checkbox`, `Radio Button` and `Check Circle` in the same list confuses the interaction model.

## Don't

- Don't use this for a setting that takes effect immediately — that is a Switch List_Item.
- Don't use `Radio Button` when zero-selected is a valid outcome; Radio never clears itself.
- Don't put the focus ring on the Control. The row owns focus.
- Don't disable a row while its atom stays enabled. Disable both.
- Don't put a Divider between rows and their parent group header.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-29 | Loyalty `Surface_1` fails at 2.42:1 with the current `Component/Selection_Control/Icon/Selected/Default = Loyalty Primary/Base`. The smallest fix is `Loyalty Primary/300` (3.42:1); a value change was **not** applied today. Ship blocking that cell for now. | Design owner |
| 2026-09-29 | Lux failures on every surface — the CTA is olive-on-cream. Fix is a token retune, not a component change. | Design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-29 | Divider redesigned to a `LINE` node named `Divider`, stroke `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default` at `Stroke Width/Regular` (1 dp), sibling of `State layer` inside the outer VERTICAL auto-layout with `gap = 0` and `padding = 0`. Visibility bound to the `Divider` boolean. |
| 2026-09-26 | Built in Figma. |
