# Switch List_Item

| | |
|---|---|
| **Status** | **Ready** in `Platform`, `Product` and `Studio` on every surface; **Loyalty** on Canvas, `Low_Contrast/Surface_2` and `Surface_3` only; **Lux** blocked. See Accessibility |
| **Figma** | `Switch List_Item 2.0` · set `40000602:10022` · page `Lists` `4258:8723` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-29 |

Read `../_FOUNDATIONS.md` and `Switch.md` first. This row hosts a Switch; its
On/Off, focus and disabled behaviour are the Switch's.

## What it is

A row that toggles one setting in place. The change is committed the moment
the row is tapped — nothing navigates, nothing needs confirming.

## When to use

- Device settings that write immediately — sound on/off, notifications for a
  device, motion detection, do-not-disturb.
- User preferences that persist across sessions and take effect at once —
  dark mode, autoplay video, offline downloads.
- Any row where the value the user sees IS the value the system holds.

## When not to use

- The change should stay local until a confirm button ends the step — that is
  a **Selection List_Item** with `Control = Checkbox`.
- The row navigates or fires an action — that is an **Action List_Item**.
- The row shows a fact — that is a **Read-only List_Item**.

## Anatomy

```
Switch List_Item        outer frame, hug × hug, carries the tap target
├── State layer         hover / pressed tint, focus ring parent
│   ├── Leading         optional icon (24) or media (40 slot)
│   ├── Content         Overline · Title · Supporting text
│   └── Trailing        instance of Switch, 62 × 32
└── Divider             1 dp LINE, fills row width, flush against State layer, optional
```

**The divider is a `LINE` node**, not a rectangle or bordered frame. It sits
as a sibling of `State layer` inside the outer VERTICAL auto-layout with
`gap = 0` and `padding = 0`, so its stroke draws hard against the bottom edge
of the row.

The Switch at the trailing edge is not a second tap target — the row's tap
fires the toggle and the Switch reflects it.

### Layout, frame by frame

| Frame | Direction | Width | Height | Padding | Gap | Fill at rest |
|---|---|---|---|---|---|---|
| `Switch List_Item` | col | fill | hug, min `Size/Touch_Target` | `Space/Zero` | `Space/Zero` | none |
| `State layer` | row | fill | hug, min `Size/Touch_Target` | `Space/Small` vertical, `Space/Medium` horizontal | `Space/Medium` | none, or `Component/List_Item/Overlay/{Hover,Pressed}` |
| `Leading` | row | hug | hug | `Space/Zero` | `Space/Zero` | none |
| `Content` | col | fill | hug | `Space/Zero` | `Space/XXS` | none |
| `Trailing` | row | 62 | 32 | `Space/Zero` | `Space/Small` | none |
| `Switch` | — | 62 | 32 | — | — | instance of Switch |
| `Divider` | LINE | fill | `Stroke Width/Regular` | — | — | stroke `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default`, weight `Stroke Width/Regular`, stroke align CENTER, visibility toggled by the `Divider` boolean |

### Geometry — generated from Figma, 2026-09-29

| Case | Height |
|---|---|
| Title only | 48 (touch target) |
| Title + Supporting | 52 |
| Title + Overline + Supporting | 65 |

The Trailing frame is 62 × 32 in every case.

## Properties

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Leading Element` | variant | `None` · `Icon` · `Media` | `None` | |
| `Selected` | variant | `No` · `Yes` | `No` | Drives the Switch's own `Selected` |
| `State` | variant | `Enabled` · `Hover` · `Pressed` · `Focused` · `Disabled` | `Enabled` | |
| `Title` | text | any | `Primary text` | |
| `Overline` | text | any | `Label` | Shown only when `Has Overline = true` |
| `Supporting text` | text | any | `Supporting text` | Shown only when `Has Supporting text = true` |
| `Has Overline` | boolean | `true` · `false` | `false` | |
| `Has Supporting text` | boolean | `true` · `false` | `true` | |
| `Divider` | boolean | `true` · `false` | `true` | |
| `Leading Icon` | instance swap | any 24×24 Material Symbols icon | placeholder | Used when `Leading Element = Icon` |
| `Media` | instance swap | any 40×40 media | placeholder | Used when `Leading Element = Media` |

30 variants (3 Leading × 2 Selected × 5 State). Every colour, spacing, radius,
stroke width and text uses a token or a text style.

## States

The row and the trailing Switch share a State.

| State | Row change | Switch change |
|---|---|---|
| `Enabled` | Resting | Resting |
| `Hover` | `State layer` fills `Component/List_Item/Overlay/Hover` | Its own state-layer overlay |
| `Pressed` | `State layer` fills `Component/List_Item/Overlay/Pressed` | Its own state-layer overlay |
| `Focused` | Outer frame gains `Stroke/Focus/Default` at `Stroke Width/Bold` | No focus ring on the Switch — the row owns focus |
| `Disabled` | `State layer` at 50% opacity | 50% opacity (whole atom) |

## Behaviour

Tapping anywhere in the row toggles the Switch and **fires the write
immediately**. Do not batch. Do not queue behind a confirm button. If either is
tempting, the row is misused; use a Selection List_Item instead.

**The row is device-bound.** Because a tap starts a write, it carries the
device axis from `_FOUNDATIONS.md` §2. The five interaction states above are
what Figma models today; the three device states below are described in text
and modelled in code:

| Device state | What to show |
|---|---|
| `Sending` | The Switch animates toward the new position. Optionally show a subtle progress line at the bottom of the row. |
| `Failed` | The Switch returns to its previous position. Surface the error inline in the Supporting text slot. Do not fire a haptic on the revert. |
| `Offline` | Do not accept the tap. Show the row as `Disabled` and put the offline reason in Supporting text. |

Device state is not yet modelled as Figma variants; see Open questions.

## Tokens

Row-level tokens, in addition to the Switch's own tokens.

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
| State-layer padding | `Space/Small` vertical, `Space/Medium` horizontal |
| Content gap | `Space/XXS` |
| Leading / Trailing outer gap | `Space/Medium` |

For the Switch's own tokens see `Switch.md`.

## Accessibility

| Field | Value |
|---|---|
| Semantic role | `switch` |
| Label | The Title. The Overline is read as a preceding label if it adds meaning |
| State | `on` / `off`; `disabled` when `Disabled` or `Offline` |
| Focus order | One stop for the row. The Switch is not separately focusable |
| Touch target | 48 × 48, carried by the outer frame's `min-height` |

### Where it can ship

Inherits the parent atom's per-surface matrix.

| Mode | Canvas | `Low_Contrast/Surface_1` | `Surface_2` | `Surface_3` |
|---|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ |
| Lux | ❌ | ❌ | ❌ | ❌ |
| Loyalty | ✅ | ❌ | ✅ | ✅ |
| Studio | ✅ | ✅ | ✅ | ✅ |

**Do not ship a ❌ cell.** Same shared-token issue as Switch, Checkbox, Radio
Button and Check Circle.

### Implementation

Web:

```html
<label class="list-item">
  <span class="content">
    <span class="overline">Doorbell</span>
    <span class="title">Motion alerts</span>
    <span class="supporting">Notify when the camera sees movement</span>
  </span>
  <button role="switch" aria-checked="true">
    <span class="sr-only">Motion alerts</span>
  </button>
</label>
```

Flutter:

```dart
SwitchListTile(
  title: Text('Motion alerts'),
  subtitle: Text('Notify when the camera sees movement'),
  value: motionAlerts,
  onChanged: enabled ? (v) => write(v) : null,
)
```

`onChanged: null` renders as `Disabled` — which is also how you render
`Offline`. Match the tokens above rather than the framework default.

## Haptics

| Event | Fires |
|---|---|
| Tap that changes the value | Selection changed — light impact |
| Successful write | None — the row's visual is enough |
| Failed write | None — the revert is enough |

One haptic, on the tap. See `_FOUNDATIONS.md` §5.

## Content

- Title states the thing being toggled, not the action: "Motion alerts", not "Enable motion alerts".
- Sentence case.
- Write it so the label reads true when the Switch is on. If it needs "Don't" or "Never", invert it.
- Supporting text explains the effect of the toggle, not how to tap it.
- Never put the current value in the Title ("Motion alerts (on)"). The Switch is the value.

## Do

- Send the write the moment the row is tapped.
- Show the whole row as `Disabled` when the device is offline, and put the reason in Supporting text.
- Revert the Switch on a failed write and surface the error inline.
- Keep Switch rows together and separate from Action rows visually — mixing them makes it unclear which taps are safe.

## Don't

- Don't queue Switch changes behind a save button. Use a Selection List_Item for that.
- Don't grow the Switch on press. Press is signalled by the state layer.
- Don't put the focus ring on the Switch. The row owns focus.
- Don't disable a row while its Switch stays enabled. Disable both.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-29 | The three device states (`Sending`, `Failed`, `Offline`) are described in this file but not modelled as variants in Figma yet. Add them, or ship the state axis as interaction-only and treat device state as pure runtime? | Design owner |
| 2026-09-29 | Contrast fails in Lux (all surfaces) and on Loyalty `Low_Contrast/Surface_1`. Same shared-token fix as the atoms. | Design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-29 | Retheme unblocked — the Switch it hosts was rebuilt today (Theme axis removed, mode-based Colours). |
| 2026-09-29 | Divider redesigned to a `LINE` node named `Divider`, stroke `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default` at `Stroke Width/Regular` (1 dp), sibling of `State layer` inside the outer VERTICAL auto-layout with `gap = 0` and `padding = 0`. Visibility bound to the `Divider` boolean. |
| 2026-09-26 | Built in Figma. |
