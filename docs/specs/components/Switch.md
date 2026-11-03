# Switch

| | |
|---|---|
| **Status** | **Ready** in `Platform`, `Product` and `Studio`, on every surface. **Blocked** in `Lux`. In `Loyalty`, **ready on Canvas, `Low_Contrast/Surface_2` and `Surface_3`, blocked on `Low_Contrast/Surface_1`**. See Accessibility |
| **Figma** | `Switch` · set `18714:2632` · page `Switch` `7323:35935` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-29 |

Read `../_FOUNDATIONS.md` first. Token values per mode are in
`../foundations/Colour.md` Part B and `../foundations/Numbers.md`.

## What it is

A control that commits a binary setting the moment it is tapped. No confirmation.

## When to use

- A setting whose new value takes effect immediately — Wi-Fi on/off, notifications on/off, a device schedule enabled/disabled.
- The user is toggling a real device state, and the write travels to the device or the service the moment it happens.

## When not to use

- The change is one of several the user will confirm together — that is a **Checkbox**.
- Exactly one option must be chosen from a set — that is a **Radio Button**.
- The thing being chosen is a whole object with its own name, icon and detail — that is a **Check Circle**.
- Nothing is sent when it is tapped — that is a **Checkbox**, and you have used a Switch by mistake. The line most often crossed in an IoT settings menu.

## Anatomy

```
Switch                touch target and focus ring on the visible track
└── Track             62 × 32 pill, carries the on/off surface and the focus ring
    ├── ON / OFF      inline text, hidden unless `Has Label = true`
    └── Handle        moves between the two ends
        └── Target    48 × 48 hit area centred on the handle, overflows the track
            └── State-layer   40 × 40, takes the hover and pressed tint
                └── Handle shape   24 (on) or 16 (off), circular, filled
```

The Target extends above and below the 32-tall Track. That is intentional — a
finger must not have to hit a 32-tall strip.

**The control carries no external label of its own.** The text beside it is
placed by the screen, and that text supplies the accessible name.

### Layout, frame by frame

| Frame | Direction | Width | Height | Padding | Corner radius | Fill at rest |
|---|---|---|---|---|---|---|
| `Track` | row | fixed `62` | fixed `32` | varies with `Selected` | `Corner Radius/Circular` | `Component/Switch/Track/On` (on) or `Component/Switch/Track/Off/Surface` (off) |
| `Handle` | — | hug | 28 | 0 | 0 | none — it is a positioning frame |
| `Target` | row | fixed `Size/Touch_Target` | fixed `Size/Touch_Target` | `Space/XS` on all four sides | 0 | none |
| `State-layer` | col | hug | hug | `Space/Small` on all four sides at rest, tighter when `Pressed` | `Corner Radius/Circular` | none, `Component/Switch/Overlay/Hover`, or `Component/Switch/Overlay/Pressed` |
| `Handle shape` | — | fixed `Numbers/24` (on) or `Numbers/16` (off) | same | 0 | `Corner Radius/Circular` | `Component/Switch/Handle/On` or `Component/Switch/Handle/Off` |

### Geometry — generated from Figma, 2026-09-29

| Part | Size |
|---|---|
| Track | 62 × 32 |
| Handle shape, `Selected = true` | 24 × 24 |
| Handle shape, `Selected = false` | 16 × 16 |
| Touch target | 48 × 48 |
| State layer at rest | 40 × 40 |

Token values: `Size/Touch_Target` 48 · `Space/Small` 8 · `Space/XS` 4 ·
`Corner Radius/Circular` circular · `Stroke Width/Bold` 2.

## Properties

These mirror the Figma component properties exactly.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Selected` | variant | `true` · `false` | `true` | Whether the setting is on |
| `State` | variant | `enabled` · `hovered` · `focused` · `pressed` · `disabled` | `enabled` | |
| `Has Label` | boolean | `true` · `false` | `false` | Reveals the inline `ON` / `OFF` letters on the track. **Do not enable in production** — see Accessibility |

10 variants. Every colour, size, space, radius and stroke width is bound; none
is raw.

## States

| State | What changes, relative to `Enabled` |
|---|---|
| `Enabled` | Resting. `State-layer` has no fill. |
| `Hovered` | `State-layer` fills with `Component/Switch/Overlay/Hover`. Pointer platforms only. |
| `Focused` | Focus ring on the `Track`: `Stroke/Focus/Default`, width `Stroke Width/Bold`, outside the pill, corners follow the track. On `Selected = false`, the focus ring replaces the off-track stroke — the focus ring is the boundary while focus is held. |
| `Pressed` | `State-layer` fills with `Component/Switch/Overlay/Pressed`. |
| `Disabled` | Whole component at 50% opacity. Not tappable. Not focusable. |

`Hovered` does not exist on touch. Build it for web and for keyboard-plus-pointer,
and do not treat it as press feedback on a phone — `Pressed` is the only
feedback a finger gets.

The pressed tint is lighter than the hover tint. That is the design, not a defect.

## Behaviour

Tapping anywhere in the 48 × 48 frame toggles the switch. When the switch sits
inside a Switch List Item the **whole row** is the target, not the switch — the
switch itself must not be a second, smaller target inside a larger one.

The visual change is immediate. **The write is sent immediately.** Do not batch
switch changes into a save button; if you find yourself wanting to, you have
picked the wrong control — see When not to use.

**Switch is device-bound.** Because a tap starts a write, the component *does*
carry the device axis from `_FOUNDATIONS.md` §2. Selection controls (Checkbox,
Radio, Check Circle) do not — Switch is the only selection-shaped control that
does.

| Device state | What to show |
|---|---|
| `Sending` | Handle animates toward the new position; the row shows a subtle progress line if it is inside a Switch List Item. |
| `Failed` | Handle returns to its previous position. Show an error inline. Do not fire a haptic on the revert. |
| `Offline` | Do not accept the tap. Show the row as disabled with an offline explanation. |

The control never changes size. There is no Size property. There is no growth
animation on press — press is signalled by the state layer, not by resizing the
handle.

## Tokens

| Part | Token |
|---|---|
| Track, `Selected = true` | `Component/Switch/Track/On/Default` |
| Track, `Selected = false` — surface | `Component/Switch/Track/Off/Surface/Default` |
| Track, `Selected = false` — stroke | `Component/Switch/Track/Off/Stroke/Default`, width `Stroke Width/Bold`, inside |
| Handle, `Selected = true` | `Component/Switch/Handle/On/Default` |
| Handle, `Selected = false` | `Component/Switch/Handle/Off/Default` |
| State layer, `Hovered` | `Component/Switch/Overlay/Hover` |
| State layer, `Pressed` | `Component/Switch/Overlay/Pressed` |
| Focus ring | `Stroke/Focus/Default`, width `Stroke Width/Bold`, outside the track |
| Touch target | `Size/Touch_Target` |
| Handle size, on | `Numbers/24` |
| Handle size, off | `Numbers/16` |
| Track corner and state-layer corner | `Corner Radius/Circular` |
| State layer padding at rest | `Space/Small` |
| Target padding | `Space/XS` |

**Overlay tokens carry their own transparency.** Use the token value as-is; do
not add a second opacity on top.

`Component/Switch/Overlay/Hover` and `Overlay/Pressed` alias the same steps as
`Component/Selection_Control/Overlay/*` and `Component/List_Item/Overlay/*` —
one number per theme.

**The handle carries the theme brand accent even when Off, in four of the five
modes.** `Component/Switch/Handle/Off/Default` aliases
`Component/Selection_Control/Icon/Selected/Default` in `Product`, `Lux`,
`Loyalty` and `Studio` — the same brand colour that fills the On track. Platform
is the exception: the Off handle is a dark neutral (`Surface/Neutral/
High_Contrast/Surface_3/Default`) because a red handle on a light grey track
would over-signal the off state. So a Switch reads as "brand-coloured handle in
every state, brighter track when on" in every theme except Platform, where the
off state is a neutral handle on a neutral track. This is the design.

## Accessibility

| Field | Value |
|---|---|
| Semantic role | switch |
| Label | The visible label beside it. If there is no visible label, the switch is inside a row and the row's text is the name |
| State | on / off; disabled when `Disabled` |
| Focus order | One stop for the switch. The handle is not separately focusable |
| Touch target | 48 × 48, carried by the outer frame |

### Where it can ship

The handle is a graphical control, so the threshold is **3:1** (WCAG 1.4.11),
handle against the track fill it sits on. The focus ring uses the same colour
value in every mode, so it passes and fails in the same cells.

| Mode | Canvas | `Low_Contrast/Surface_1` | `Surface_2` | `Surface_3` |
|---|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ |
| Lux | ❌ | ❌ | ❌ | ❌ |
| Loyalty | ✅ | ❌ | ✅ | ✅ |
| Studio | ✅ | ✅ | ✅ | ✅ |

**Do not ship a ❌ cell.** Same table as Checkbox, Radio Button and Check Circle
— the fault is in the shared brand-accent token
`Component/Selection_Control/Icon/Selected/Default`, which drives the On track,
the focus ring and the Off handle in Product, Lux, Loyalty and Studio. Fixing
that one value clears all four components together.

Because the Off handle now aliases the brand accent in four of five modes, the
Off-state contrast has two axes to check when the token is retuned: handle
against the off track (this component), and handle against the surface the
switch sits on (the same 3:1 rule as On).

`Disabled` drops below 3:1 because the whole control is at 50%. That is allowed —
inactive controls are exempt.

### The `ON` / `OFF` label — OPEN

The inline `ON` / `OFF` text sits inside a 32-tall track at 10pt in
`Text Size/10`. The design owner has ruled that the text stays as an option for
now; **the boolean `Has Label` exposes it for review and it must not be enabled
in production** until:

- letter legibility at 10pt on the track surface is verified, and
- either the label reads acceptably to a screen reader as part of the switch or
  is explicitly hidden from the accessibility tree.

At `Has Label = false` (the default) the letters are hidden and the switch reads
as a plain graphical control.

### Implementation

Web:

```html
<button role="switch" aria-checked="true">
  Daily summary
</button>
```

```js
btn.setAttribute('aria-checked', String(nextValue));
```

Flutter:

```dart
Switch(
  value: dailySummaryOn,
  onChanged: enabled ? (v) => ... : null,   // null disables it
)
```

`Switch` is the material component; theme it to bind the tokens above. The
stock switch grows the handle on press — override the pressed painter to match
this component, which uses a state-layer tint instead.

## Haptics

| Event | Fires |
|---|---|
| Tap that changes the value | Selection changed — light impact |
| Failed write | None — the returning handle is enough |

One haptic, on the tap. Nothing else. Not on `Disabled`, not on the revert.

See `_FOUNDATIONS.md` §5. The haptics map is still awaiting sign-off.

## Content

There is no content inside the control — the switch has no text of its own that
the caller sets. The adjoining label is the only text the user reads.

For the adjoining label:

- State the thing being toggled, not the action: "Daily summary", not "Enable daily summary".
- Sentence case.
- Write it so it reads true when on. If the label needs "Don't" or "Never" to make sense, invert it.

## Do

- Send the write the moment the switch changes.
- Show the switch inside a Switch List Item when it sits in a settings list, and let the whole row take the tap.
- Keep the label to the leading side of the switch when the switch is not inside a row.
- Revert the handle on a failed write and show the error inline.

## Don't

- Don't batch switch changes behind a save button — use a Checkbox for that.
- Don't grow the handle on press. Press is signalled by the state layer.
- Don't enable `Has Label` in production.
- Don't rely on colour alone — the handle's position is the primary indicator.
- Don't put the focus ring on the touch target. It goes on the visible track.
- Don't ship in Lux, or on Loyalty `Low_Contrast/Surface_1`.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-29 | `Has Label` inline `ON` / `OFF` at 10pt: is the intended treatment to raise the size, drop the text, or keep-and-document? Cannot be enabled in production until this is answered. | Design owner |
| 2026-09-29 | Handle contrast fails in Lux (all surfaces) and on Loyalty `Low_Contrast/Surface_1`. Which token value changes? Same fix now covers On track, focus ring, and Off handle in Product/Lux/Loyalty/Studio — one token, four components. | Design owner |
| 2026-09-29 | `Sending` and `Failed` device states are described but not modelled as variants in Figma yet — the current axis is interaction only. Confirm the shape before Switch List Item is built. | Design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-29 | Rebuilt from the `Theme`-axis v1.2 shape. 50 variants → 10. New `Component/Switch/*` tokens. Anatomy preserved apart from the removed 2×2 `Container` and a fixed handle-size at all states (no press-grow). |
| 2026-09-29 | Owner retuned three of the seven new tokens. **`Handle/Off`** now aliases `Component/Selection_Control/Icon/Selected/Default` in Product, Lux, Loyalty and Studio — the handle carries the brand accent whether on or off. Platform stays a dark neutral (`Surface/Neutral/High_Contrast/Surface_3/Default`) because a red handle on a light track over-signals off. **`Track/Off/Stroke`** darkened per mode: `Stroke_3` in Platform and Product, `Stroke_2` in Lux and Studio, `Stroke/Brand/High_Contrast/Product_Black/Default` in Loyalty. **`Track/Off/Surface`** darkened by one step in Loyalty (`Loyalty Secondary/800`) and Studio (`Neutral/800`) — the earlier open question about semantic parents for the mid-neutral primitives is closed by these edits. |
