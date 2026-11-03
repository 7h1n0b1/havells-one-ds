# Button

| | |
|---|---|
| **Status** | **Ready** in `Platform` and `Product`, every Type. **Outlined and Text only** in `Lux` and `Studio`. **Outlined and Text on Canvas and `Low_Contrast/Surface_3` only** in `Loyalty`. **Filled is blocked** in `Lux`, `Loyalty` and `Studio`. See Accessibility |
| **Figma** | `Button` · set `40000421:3304` · key `d1ba786acb6d7951397d974d73c2f390d2ede8a7` · page `Buttons` `2301:5401` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-29 |

Read `../_FOUNDATIONS.md` first. Theming, tokens, the accessibility baseline and
haptics are defined there and not repeated here. Token values per mode are in
`../foundations/Colour.md` Part B, `../foundations/Numbers.md` and
`../foundations/Typography.md`.

---

## What it is

A labelled control that performs an action. One set covers every theme; colour
comes from the `Colours` modes, so there is no `Theme` property.

## When to use

- Committing an action the user chose: Save, Continue, Turn On, Raise Request.
- Anywhere an action needs a name rather than a symbol.
- Icon-only, by setting `Has Label = false` — the touch target stays 48 × 48.

## When not to use

- **Navigating between sibling views** — that is `Tabs`.
- **Filtering a list** — that is `Chips`.
- **Turning a device on and off from a card or control screen** — that is
  `Power Button`, which carries the device state axis.
- **Choosing one of several modes that stay on screen** — that is a segmented
  control. One does not exist yet; do not fake it with a row of Buttons.

## Anatomy

```
Button                 touch target. Fixed height, hugs width, never narrower than it is tall
└── Visible            the pill the user sees. Hugs its content, centred in Button
    ├── Content        horizontal row: [Leading Icon] [Label] [Trailing Icon]
    │   ├── Leading Icon   optional
    │   ├── Label          text. Opacity 0 in State = Loading
    │   └── Trailing Icon  optional
    ├── Overlay        tint layer over the whole pill. Hover and Pressed only
    └── Loader         spinner, centred in the pill. Loading only
```

The outer frame is bigger than the pill on purpose. It is the touch target. Do
not collapse it to the pill.

### Layout, frame by frame

| Frame | Direction | Width | Height | Alignment | Padding | Gap | Corner radius | Clips |
|---|---|---|---|---|---|---|---|---|
| `Button` | row | hug, **min** `Size/Touch_Target` | fixed `Size/Touch_Target` | pill centred on both axes | 0 | 0 | `Corner Radius/Zero` | yes |
| `Visible` | row | hug | hug | — | 0 | 0 | `Corner Radius/Circular` | yes |
| `Content` | row | hug | hug | start on the main axis, centre on the cross axis | per Size, below | `Space/Small` | none | yes |
| `Overlay` | — | fills `Visible` | fills `Visible` | positioned absolutely over `Visible` | — | — | `Corner Radius/Circular` | yes |
| `Loader` | — | icon size for the Size | icon size for the Size | positioned absolutely, centred in `Visible` | — | — | — | — |

- `Label` is a single line that hugs its text. It never wraps and never truncates.
- Icons are square: width and height both equal the Size's icon token.
- The Outlined stroke sits **inside** the pill edge **and adds to the pill's
  size**: an Outlined pill is one stroke width larger on every side than a
  Filled or Text pill with the same content. In CSS that is a real `border`
  with `box-sizing: content-box`; in Flutter, a `Border` whose width is added
  to the padding. Do not draw it as an overlay that leaves the size unchanged.

### Sizes

| Size | Label text style | Flutter token | Icon and spinner size | Padding, left and right | Padding, top and bottom | Gap |
|---|---|---|---|---|---|---|
| Large | `Heading/H2 (16) -` | `H2(16)` | `Size/Icon/Large` | `Space/Medium` | `Space/Small` | `Space/Small` |
| Medium | `Heading/H3 (14) -` | `H3(14)` | `Size/Icon/Medium` | `Space/Number-12` | `Space/Small` | `Space/Small` |
| Small | `Label/L3 Strong (12) -` | `L3Strong(12)` | `Size/Icon/Small` | `Space/Small` | `Space/XS` | `Space/Small` |

The gap applies only between visible children. An icon that is off takes no
space and leaves no gap.

**Do not hard-code the pill height.** It is the vertical padding twice plus the
label's line box, and it follows from the layout above.

### Geometry — generated from Figma, 2026-09-29

Measured from the component in Figma, for checking a build. The tokens above
are the contract; these numbers are what those tokens produce.

| Size | Touch target | Pill, Filled and Text | Pill, Outlined | Icon-only pill, Filled and Text | Icon-only pill, Outlined |
|---|---|---|---|---|---|
| Large | 48 high, min 48 wide | 34 high | 36 high | 48 × 32 | 50 × 34 |
| Medium | 48 high, min 48 wide | 31 high | 33 high | 38 × 30 | 40 × 32 |
| Small | 48 high, min 48 wide | 21 high | 23 high | 28 × 20 | 30 × 22 |

Token values: `Size/Touch_Target` 48 · `Space/Medium` 16 · `Space/Number-12` 12 ·
`Space/Small` 8 · `Space/XS` 4 · `Size/Icon/Large` 16 · `Size/Icon/Medium` 14 ·
`Size/Icon/Small` 12 · `Stroke Width/Regular` 1 · `Stroke Width/Bold` 2 ·
`Corner Radius/Circular` 9999 · `Corner Radius/Zero` 0. All three label styles
are Inter Semi Bold 600 at line height 110% (`height: 1.1`); `L3Strong(12)`
also carries −1% tracking (`letterSpacing: -0.12`).

## Properties

These mirror the Figma component properties exactly.

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Label` | text | | `Button` | The visible label |
| `Has Label` | boolean | | `true` | `false` gives the icon-only button. Turn on at least one icon |
| `Leading Icon` | boolean | | `false` | Shows the leading slot |
| `Leading Icon Swap` | instance swap | | `Placeholder` | Icon from the DS library only |
| `Trailing Icon` | boolean | | `false` | Shows the trailing slot |
| `Trailing Icon Swap` | instance swap | | `Placeholder` | Icon from the DS library only |
| `Type` | variant | `Filled` · `Outlined` · `Text` | `Filled` | Emphasis |
| `State` | variant | `Enabled` · `Hover` · `Pressed` · `Focused` · `Disabled` · `Loading` | `Enabled` | |
| `Size` | variant | `Large` · `Medium` · `Small` | `Large` | |

54 variants. Every colour, spacing, radius, size, stroke width and text value is
bound to a variable or style; none is raw.

### Type

| Type | Use for |
|---|---|
| `Filled` | The one action the screen is for. One per screen, or one per sheet. |
| `Outlined` | A real alternative to the filled action, on the same screen. |
| `Text` | Low emphasis: cancel, or a tertiary route out. |

`Filled` is a gradient in Lux, Loyalty and Studio and flat in Platform and
Product. Both stops are equal in the flat modes. That is the mode doing its job:
always draw the gradient and let the tokens decide.

## States

| State | What changes, relative to `Enabled` |
|---|---|
| `Enabled` | Resting. |
| `Hover` | `Overlay` shows the Type's hover tint. **Filled only** also gets the `Button/Hover` shadow on `Visible`. Pointer platforms only. |
| `Pressed` | `Overlay` shows the Type's pressed tint. No shadow. |
| `Focused` | Focus ring on the outer `Button` frame, not on the pill. Square corners, the full touch target. |
| `Disabled` | `Visible` at 50% opacity: pill, label and icons together. The touch target is unchanged. |
| `Loading` | Label and icons at opacity 0, spinner shown. Width unchanged. Not tappable. |

### Loading

Exists because the app does not own device state — see `_FOUNDATIONS.md` §2.
A tap sends a command; the device answers later.

**Spinner only. No label.** The label and any icons stay in the layout at zero
opacity, so the pill keeps exactly its resting width and the surrounding layout
does not move when the spinner comes or goes. In code, use `visibility: hidden`
on the web or `Opacity(opacity: 0)` in Flutter. Do not remove them from the tree.

**Hide the label from the eye, not from the screen reader.** The accessible name
stays whatever it was. Do not set `aria-hidden` on the label and do not clear the
Flutter `Semantics` label.

**Loading is not a success state.** Leave it when the device answers, in one of
two directions: success, where the screen reflects the new reality; or failure,
where the button returns to `Enabled` and the reason is shown next to it. It must
not spin forever — see the open timeout question below.

Use `Loading` only while a command is genuinely in flight. Do not use it as a
generic busy indicator for page loads; that is `Loader with Message`.

### The spinner

Draw it in code. There is no image asset.

| Aspect | Specification |
|---|---|
| Box | Square, the Size's icon token. Centred in `Visible`. |
| Ticks | 8 straight bars with fully rounded ends, one every 45°, starting at 12 o'clock and running clockwise. Each bar points at the centre. |
| Tick size | Length 16.4% of the box, thickness 5.3% of the box. Tick centres sit on a circle of radius 21.75% of the box. |
| Colour | Every tick is the Type's label token (table below). No other colour. |
| Frames | 8 per cycle. At each frame, three neighbouring ticks are faded: the most clockwise of the three at 40% opacity, the two behind it at 20%. The other five are at 100%. |
| Motion | The faded group moves one tick clockwise every **300 ms**, cross-fading with ease-out over those 300 ms. A full cycle is 2.4 s. It loops until the button leaves `Loading`. |
| First frame | The 40% tick is at the 10:30 position (the eighth tick); the 20% ticks are at 9:00 and 7:30. |

## Behaviour

- Tap fires once. Ignore repeat taps while in `Loading`.
- `Disabled` and `Loading` are both non-actionable, and they are not the same
  thing. `Disabled` means a precondition is unmet. `Loading` means we asked and
  are waiting.
- On failure: return to `Enabled`, keep the label, surface the reason. Never
  return silently.
- **Width.** The pill hugs its content, and the touch target hugs the pill but is
  never narrower than `Size/Touch_Target`. There is no fixed minimum pill width,
  so a one-word button is legal. There is no full-width button: a Button never
  stretches to fill its container.
- **Icon-only.** `Has Label = false` with one icon on. The pill is not a circle —
  see the geometry table — and the 48 × 48 touch target surrounds it.

## Tokens

Every part, per Type. A cell reading "—" means that part has no paint for that
Type.

| Part | Filled | Outlined | Text |
|---|---|---|---|
| Pill fill | linear gradient, top to bottom: `Component/Button/Filled/Surface/Gradient_1` at 0% → `Component/Button/Filled/Surface/Gradient_2` at 100% | `Component/Button/Outlined/Surface/Default` | — |
| Pill stroke | — | `Component/Button/Outlined/Stroke/Default`, width `Stroke Width/Regular`, inside | — |
| Label | `Component/Button/Filled/Text/Default` | `Component/Button/Outlined/Text/Default` | `Component/Button/Text/Text/Default` |
| Icons | `Component/Button/Filled/Icon/Default` | `Component/Button/Outlined/Icon/Default` | `Component/Button/Text/Icon/Default` |
| Overlay, Hover | `Component/Button/Filled/Overlay/Hover` | `Component/Button/Outlined/Overlay/Hover` | `Component/Button/Text/Overlay/Hover` |
| Overlay, Pressed | `Component/Button/Filled/Overlay/Hover` | `Component/Button/Outlined/Overlay/Pressed` | `Component/Button/Text/Overlay/Pressed` |
| Shadow, Hover | effect style `Button/Hover` | — | — |
| Spinner ticks | `Component/Button/Filled/Text/Default` | `Component/Button/Outlined/Text/Default` | `Component/Button/Text/Text/Default` |
| Focus ring | `Stroke/Focus/Default`, width `Stroke Width/Bold`, outside the touch target | same | same |

Shared by all: touch target `Size/Touch_Target`; pill radius
`Corner Radius/Circular`; touch-target radius `Corner Radius/Zero`.

**Overlay and surface tokens carry their own transparency.** Use the token value
as-is — the 5% or 10% is in its alpha. Do not add a second opacity on top.

**`Button/Hover`** is one drop shadow: x 0, y 1, blur 2, spread 0, colour
`Opacity/Neutral - Dark/10`, drawn behind the pill. Web:
`box-shadow: 0 1px 2px 0 <token>`. Flutter:
`BoxShadow(offset: Offset(0, 1), blurRadius: 2, spreadRadius: 0, color: <token>)`.

**The gradient.** Web:
`linear-gradient(180deg, <Gradient_1> 0%, <Gradient_2> 100%)`. Flutter:
`LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [<Gradient_1>, <Gradient_2>])`.

## Accessibility

| Field | Value |
|---|---|
| Semantic role | button |
| Label | The visible label. For icon-only, the action name — never the icon name |
| State | Disabled when `Disabled`; busy when `Loading`. In `Loading` the label is hidden visually, but the accessible name is unchanged |
| Focus order | One stop. The icons are decorative and must not take focus |
| Touch target | At least 48 × 48 at every size, carried by the outer frame |

### Where it can ship

Label contrast must clear **4.5:1**. None of the three sizes counts as WCAG large
text: all three are Semi Bold 600, at 16, 14 and 12. The pass or fail below is
for the label against the surface under it, in each mode. Icons use the label
colour, so they pass wherever the label passes.

| Mode | Filled | Outlined and Text, on Canvas | on `Low_Contrast/Surface_1` | on `Surface_2` | on `Surface_3` |
|---|:---:|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lux | ❌ | ✅ | ✅ | ✅ | ✅ |
| Loyalty | ❌ | ✅ | ❌ | ❌ | ✅ |
| Studio | ❌ | ✅ | ✅ | ✅ | ✅ |

**Do not ship a ❌ cell.** The fault is in the token values those modes carry,
not in the component: the Button binds the right roles. When the values are
fixed, the component clears with no code change.

**Focus ring.** `Stroke/Focus/Default` needs 3:1 against the surface around the
button. It clears on Canvas and every Low_Contrast surface in Platform, Product
and Studio, and in Loyalty everywhere except `Surface_1`. It does not clear
anywhere in Lux. See the open question.

### Implementation

Web:

```html
<button aria-busy="true" aria-disabled="false">Turn On</button>
```

Flutter:

```dart
Semantics(
  button: true,
  enabled: state != ButtonState.disabled,
  label: hasLabel ? label : actionName,
  child: ...,
)
```

Flutter has no `busy` semantic flag. On entering `Loading`, announce once with
`SemanticsService.announce`, then announce the outcome. **Needs confirmation
from the Flutter developers that this is how they want it done.**

## Haptics

| Event | Fires |
|---|---|
| Tap | Toggle committed — light impact |
| Device confirmed | Success notification |
| Device refused or timed out | Error notification |

For a button that does not touch a device (Save, Continue, Next), fire on tap
only. For a device command, fire on tap and again on the device's answer — the
second one is the one that matters. See `_FOUNDATIONS.md` §5; the haptics map is
still awaiting sign-off.

## Content

- Sentence case. Not Title Case, not ALL CAPS.
- A verb, and the object if it is not obvious: "Turn On", "Raise Request",
  "Save", not "OK" or "Submit".
- Two words is the target, four is the ceiling. Labels do not wrap and do not
  truncate — if it does not fit, the label is too long.
- The label names what happens, not what is happening. It does not change in
  `Loading`.

## Do

- Use one `Filled` button per screen or sheet.
- Keep the 48 × 48 touch target at every size, including icon-only.
- Draw the Outlined stroke inside the pill and let it add to the pill's size.
- Use overlay and surface token values as-is — the transparency is in the token.
- Return to `Enabled` and show a reason when a command fails.
- Use `Has Label = false` for the icon-only button, so the touch target comes for
  free.

## Don't

- Don't build an icon-only button by deleting the label from a normal one.
- Don't use `Loading` for page or screen loads.
- Don't dim a button to show it is loading — dimming reads as disabled.
- Don't let the button change width when it enters or leaves `Loading`.
- Don't put the hover shadow on Outlined or Text buttons.
- Don't put the focus ring on the pill. It goes on the touch target.
- Don't stretch a Button to fill its container.
- Don't use a row of Buttons as a mode picker.
- Don't use `[DEPRECATED] Common Button`, `[DEPRECATED] Circular Button` or
  `[DEPRECATED] Circular Label Button`. All three are replaced by this set.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-25 | How long may `Loading` last before it becomes a failure? One number, applied to every device-bound control. | Design owner |
| 2026-09-25 | Is the Flutter busy announcement acceptable, or do you want a different mechanism? | Flutter developers |
| 2026-09-29 | Spinner tail opacities: are 40% and 20% right for the faded ticks? | Design owner |
| 2026-09-29 | With reduced motion on, does the spinner stop, slow down, or keep turning? | Design owner |
| 2026-09-29 | The focus ring is below 3:1 in Lux and on Loyalty `Surface_1`. Which token value changes? Until answered, the focus ring cannot ship in those places. | Design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-29 | Touch target is at least 48 wide as well as 48 high, at every size. |
| 2026-09-29 | Outlined and Text icons use their own Type's icon token, matching their label. |
| 2026-09-29 | In `Loading`, icons stay in the layout at opacity 0, like the label, so the width never changes. |
| 2026-09-29 | Overlay and Outlined surface tokens are used as-is; the token carries the transparency. |
| 2026-09-29 | Spinner specified: geometry, colour and motion. |
| 2026-09-29 | Where it can ship is stated per surface. Outlined and Text ship in Lux; in Loyalty only on Canvas and `Surface_3`. |
