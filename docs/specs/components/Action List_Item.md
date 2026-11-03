# Action List_Item

| | |
|---|---|
| **Status** | **Ready** in `Platform`, `Product` and `Studio` on every surface; **Loyalty** on Canvas, `Low_Contrast/Surface_2` and `Surface_3` only; **Lux** blocked. See Accessibility |
| **Figma** | `Action List_Item` · set `40000599:9579` · page `Lists` `4258:8723` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-29 |

Read `../_FOUNDATIONS.md` first. Token values per mode are in
`../foundations/Colour.md` Part B, sizes in `../foundations/Numbers.md`, text
styles in `../foundations/Typography.md`.

## What it is

A row that navigates somewhere or fires one primary action. The whole row is
the tap target.

## When to use

- Menu rows that take the user to a next screen — a device detail page, an
  account settings sub-screen, a help article.
- Rows that fire one action inline where there is nowhere else meaningful to
  put it — "Sign out", "Delete account".
- Rows in a floating menu, action sheet or bottom sheet.

## When not to use

- The row toggles a setting in place — that is a **Switch List_Item**.
- The row selects itself from a set of options — that is a
  **Selection List_Item**.
- The row is a value the user cannot act on — that is a **Read-only List_Item**.
- The row hosts a live device with its own state and controls — that is a
  **Device Card**.

## Anatomy

```
Action List_Item        outer frame, hug × hug, carries the tap target
├── State layer         hover / pressed tint, focus ring parent
│   ├── Leading         optional icon (24) or media (40 slot)
│   ├── Content         Overline · Title · Supporting text
│   └── Trailing        Chevron, Meta or None
└── Divider             1 dp LINE, fills row width, flush against State layer, optional
```

**The divider is a `LINE` node**, not a rectangle or a bordered frame. It sits
as a sibling of `State layer` inside the outer VERTICAL auto-layout with
`gap = 0` and `padding = 0`, so its stroke draws hard against the bottom edge
of the row's content with nothing between them.

**Property-driven visibility:** `Leading Element = None` hides the whole
Leading frame; `Trailing Element = None` hides Trailing; `Divider = false`
hides the divider; `Has Overline` and `Has Supporting text` toggle those lines.

### Layout, frame by frame

| Frame | Direction | Width | Height | Padding | Gap | Corner | Fill at rest |
|---|---|---|---|---|---|---|---|
| `Action List_Item` | col | fill | hug, min `Size/Touch_Target` | `Space/Zero` | `Space/Zero` | `Corner Radius/Zero` | none |
| `State layer` | row | fill | hug, min `Size/Touch_Target` | `Space/Small` top/bottom, `Space/Medium` left/right | `Space/Medium` | `Corner Radius/Zero` | none, or `Component/List_Item/Overlay/{Hover,Pressed}` |
| `Leading` | row | hug | hug | `Space/Zero` | `Space/Zero` | — | none |
| `Content` | col | fill | hug | `Space/Zero` | `Space/XXS` | — | none |
| `Trailing` | row | hug | hug | `Space/Zero` | `Space/Small` | — | none |
| `Divider` | LINE | fill | `Stroke Width/Regular` | — | — | — | stroke `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default`, weight `Stroke Width/Regular`, stroke align CENTER, visibility toggled by the `Divider` boolean |

### Geometry — generated from Figma, 2026-09-29

| Case | Height |
|---|---|
| Title only | 48 (touch target) |
| Title + Overline | 52 |
| Title + Supporting | 52 |
| Title + Overline + Supporting | 65 |

The divider is 1 dp (`Stroke Width/Regular`). Focus ring adds 2 dp outside the
row.

## Properties

Exactly as in Figma.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Leading Element` | variant | `None` · `Icon` · `Media` | `None` | `Icon` is a 24 slot; `Media` is a 40 slot for an image, avatar or device illustration |
| `Trailing Element` | variant | `Chevron` · `Meta` · `None` | `Chevron` | `Meta` is a short right-aligned label; `None` leaves the row unadorned |
| `State` | variant | `Enabled` · `Hover` · `Pressed` · `Focused` · `Disabled` | `Enabled` | |
| `Title` | text | any | `Primary text` | |
| `Overline` | text | any | `Label` | Shown only when `Has Overline = true` |
| `Supporting text` | text | any | `Supporting text` | Shown only when `Has Supporting text = true` |
| `Has Overline` | boolean | `true` · `false` | `false` | |
| `Has Supporting text` | boolean | `true` · `false` | `true` | |
| `Divider` | boolean | `true` · `false` | `true` | |
| `Leading Icon` | instance swap | any 24×24 Material Symbols icon | placeholder | Used when `Leading Element = Icon` |
| `Media` | instance swap | any 40×40 media | placeholder | Used when `Leading Element = Media` |

45 variants (3 Leading × 3 Trailing × 5 State). Every colour, spacing, radius,
stroke width and text uses a token or a text style; none is raw.

## States

| State | What changes |
|---|---|
| `Enabled` | Resting. `State layer` has no fill. |
| `Hover` | `State layer` fills with `Component/List_Item/Overlay/Hover`. Pointer platforms only. |
| `Pressed` | `State layer` fills with `Component/List_Item/Overlay/Pressed`. |
| `Focused` | Outer `Action List_Item` gains `Stroke/Focus/Default` at `Stroke Width/Bold`. The state layer keeps its resting fill. |
| `Disabled` | `State layer` at 50% opacity. Not tappable. Not focusable. |

`Hover` does not exist on touch. `Pressed` is the only feedback a finger gets.

The pressed tint is lighter than the hover tint. That is the design, not a
defect.

## Behaviour

Tapping anywhere in the row fires the primary action or navigates. There is no
secondary target inside the row — the Leading icon, the Content and the
Trailing chevron are all part of the same 48-tall hit area.

Nothing happens on `Disabled`. Show the disabled state only when the action
genuinely cannot be taken now, and prefer removing the row over disabling it
where the reason is not obvious from the label.

Rows never change height on hover or press.

**Meta trailing content** is a short right-aligned label, `Label/L4 (10)` or
`Body/B3 (12)`, in `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default`. Use it
for auxiliary information tied to the row's action — a count, a last-updated
timestamp, a keyboard shortcut. Do not use it for status; status belongs in a
Tag when Tag exists (see Open questions).

## Tokens

| Part | Token |
|---|---|
| State layer, `Hover` | `Component/List_Item/Overlay/Hover` |
| State layer, `Pressed` | `Component/List_Item/Overlay/Pressed` |
| Focus ring | `Stroke/Focus/Default`, width `Stroke Width/Bold`, on outer frame |
| Overline text | `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default`, style `Heading/Overline -` |
| Title text | `Text/Neutral/On_Low_Contrast/High_Emphasis/Default`, style `Label/L2 (14) -` |
| Supporting text | `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default`, style `Body/B3 (12) =` |
| Leading Icon | `Icon/On_Neutral/Low_Contrast/High_Emphasis/Default`, size `Size/Icon/XL` |
| Chevron | `Icon/On_Neutral/Low_Contrast/Low_Emphasis/Default`, size `Size/Icon/XL` |
| `Divider` LINE | `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default`, weight `Stroke Width/Regular` |
| Row minimum height | `Size/Touch_Target` |
| State-layer padding | `Space/Small` vertical, `Space/Medium` horizontal |
| Content gap | `Space/XXS` |
| Leading / Trailing outer gap | `Space/Medium` |

**Overlay tokens carry their own transparency.** Use the token value as-is; do
not add a second opacity on top.

## Accessibility

| Field | Value |
|---|---|
| Semantic role | `button` (navigation or in-place action). If the row opens a link, use `link` |
| Label | The Title. If the Overline adds meaning ("Account", "Bluetooth"), read it as a preceding label |
| State | `disabled` when `Disabled` |
| Focus order | One stop for the row. Leading icon and Trailing chevron are not separately focusable |
| Touch target | 48 × 48 minimum, carried by the outer frame's `min-height` |

### Where it can ship

Text contrast is 4.5:1 (WCAG 1.4.3) against the surface the row sits on. The
divider is decorative (no floor). The focus ring is a graphical indicator
(3:1). Verified against Canvas and `Low_Contrast/Surface_1..3` in every mode.

| Mode | Canvas | `Low_Contrast/Surface_1` | `Surface_2` | `Surface_3` |
|---|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ |
| Lux | ❌ | ❌ | ❌ | ❌ |
| Loyalty | ✅ | ❌ | ✅ | ✅ |
| Studio | ✅ | ✅ | ✅ | ✅ |

**Do not ship a ❌ cell.** The Lux failures and the Loyalty `Surface_1` failure
are shared with Button, Checkbox, Radio Button, Check Circle and Switch —
same root token (`Component/Selection_Control/Icon/Selected/Default`, which
also drives the focus ring). One value change upstream clears every failing
cell on this row without a component edit.

### Implementation

Web:

```html
<button type="button" class="list-item">
  <span class="overline">Account</span>
  <span class="title">Change password</span>
  <span class="supporting">You last changed this in March</span>
  <span class="chevron" aria-hidden="true">›</span>
</button>
```

Flutter:

```dart
ListTile(
  title: Text('Change password'),
  subtitle: Text('You last changed this in March'),
  trailing: Icon(Icons.chevron_right),
  onTap: () => ...,
)
```

Match the token table above rather than the framework default's padding and
type ramp.

## Haptics

| Event | Fires |
|---|---|
| Tap that navigates | Selection changed — light impact |
| Tap that fires an in-place action | The action's own haptic, if any. Otherwise none |

Nothing fires on `Disabled`.

See `_FOUNDATIONS.md` §5. The haptics map is still awaiting sign-off.

## Content

- The Title is what the row does or where it goes. Sentence case, no trailing punctuation.
- The Supporting text explains, does not repeat the Title.
- The Overline is a category label, sentence case, one or two words.
- Titles wrap; they do not truncate. Supporting truncates to one line by default; wrap where the row can accommodate it.
- Never put "Tap to..." in front of a Title. The whole row being tappable is a given.

## Do

- Give every row a Title. The Title is required; Overline and Supporting are optional.
- Use `Chevron` when the row navigates. Use `Meta` for a short right-aligned label. Use `None` when the row fires an action in place.
- Group like rows into sections with a header outside the row, not inside it.
- Show a divider between rows in a section. Hide the divider on the last row of a section, and on rows next to a section header.

## Don't

- Don't put a secondary tap target inside the row. If two things need to be tappable, split the row into two rows.
- Don't disable a row when the action can be tried and will fail — let the tap fire and surface the error.
- Don't shorten the touch target below 48 dp to fit more rows on screen.
- Don't stack an action list inside a swipe list. Pick one interaction model per screen.
- Don't use this for a row that toggles a setting — that is a Switch List_Item.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-28 | The Action row's secondary-action slot (an inline second action next to Chevron) — deferred, may return later. | Design owner |
| 2026-09-29 | Contrast fails in Lux (all surfaces) and on Loyalty `Low_Contrast/Surface_1`. Same shared-token fix as Checkbox / Radio / Check Circle / Switch. | Design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-29 | Divider redesigned: was a 0.2 dp bordered frame beneath the row, now a **LINE** node (`Divider`) sibling of `State layer` inside the outer VERTICAL auto-layout with `gap = 0` and `padding = 0`, stroke `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default` at `Stroke Width/Regular` (1 dp), stroke align CENTER, visibility bound to the `Divider` boolean. Uniform `strokeWeight` binding works because it's a LINE. |
| 2026-09-26 | Built in Figma. |
