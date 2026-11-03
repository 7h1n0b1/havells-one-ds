# Header

| | |
|---|---|
| **Status** | Ready in Platform, Product, Lux, Loyalty and Studio. The keyboard focus ring fails contrast in Loyalty and Studio on some surfaces — see **Where it can ship**. Touch platforms are unaffected. |
| **Figma** | `Header` · set `4520:27614` · key `2c29fbc46c5f938dd0d64c80140ef68b9882242e` · page `Header 📄 👋` `1902:2196` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-30 |

Read `../_FOUNDATIONS.md` first. Token values live in `../foundations/Colour.md`,
sizes in `../foundations/Numbers.md`, text styles in `../foundations/Typography.md`.

## What it is

The top bar of a screen: it renders the phone status bar, a leading action, the
screen title, and up to two trailing actions.

## When to use

- On any screen that has a title and a way back.
- On a screen the user reached from somewhere else, where the leading action is
  the back arrow.
- On a top-level screen with no back arrow: set `Leading = false` and the title
  aligns to the screen margin.
- When the user selects items on the screen: set `Mode = Selection`, and the
  leading action becomes a close and a **Select all** button appears.

## When not to use

- For a bar that scrolls away with the content, or one that collapses on scroll.
  Neither is specified; raise it rather than improvising.
- For tabs under the title — that is `Tabs`, pinned below the Header.
- For a bar at the foot of the screen — that is the bottom navigation, and its
  shadow is the `BottomBarSurface` effect style, not this one.
- For a title inside a sheet or a dialog — `Dialog` carries its own title.
- For a search field in the bar. Not specified. Ask.

## Anatomy

```
Header                          fill on Solid; TopBarSurface on Shadow = Yes
├── Status bar                  swapped by Device; drawn art, not interactive
└── Header contents            row, fixed 48 high — this is the touch-target row
    ├── Leading                .Header_Action, arrow_back or close
    ├── Title block            column, fills the remaining width
    │   ├── Title              one line, truncates with an ellipsis
    │   └── Subtitle           hidden unless Subtitle = true
    └── Trailing               row, hugs
        ├── Action 1           .Header_Action        Mode = Default
        ├── Action 2           .Header_Action        Mode = Default
        └── Select all         Button, Type = Text   Mode = Selection
```

**The touch targets are the three `.Header_Action` frames and the Select all
button, each 48 × 48.** The `Header contents` row is fixed at `Size/Touch_Target`
so the targets never shrink. The status bar carries no interaction.

`.Header_Action` is internal to Header: set `40000778:3445`, key
`9d0289a20e71140ce3bc7246f7028475abbf35be`. Do not use it anywhere else.

```
.Header_Action                  48 × 48, transparent, focus ring on Focused
└── State layer                 40 × 40, circular, carries the overlay
    └── Icon                    24 × 24, instance swap
```

### Layout, frame by frame

| Frame | Direction | Width | Height | Alignment | Padding | Gap | Corner radius | Clips |
|---|---|---|---|---|---|---|---|---|
| `Header` | column | fill | hug | top-left | `Space/Zero` all round | `Space/XS` | `Corner Radius/Zero` | no |
| `Status bar` | — | fill | fixed per device | — | none | — | — | no |
| `Header contents` | row | fill | fixed `Size/Touch_Target` | vertically centred | `Space/XS` left and right, `Space/Zero` top and bottom | `Space/Zero` | `Corner Radius/Zero` | no |
| `Leading` | row | fixed `Size/Touch_Target` | fixed `Size/Touch_Target` | centred both axes | `Space/XS` all round | `Space/Zero` | `Corner Radius/Zero` | no |
| `State layer` | row | fixed 40 | fixed 40 | centred both axes | `Space/Small` all round | `Space/Zero` | `Corner Radius/Circular` | no |
| `Title block` | column | fill | hug | left, vertically centred | `Space/Zero` | `Space/XXS` | `Corner Radius/Zero` | no |
| `Title` | — | fill | hug | left | — | — | — | truncates |
| `Subtitle` | — | fill | hug | left | — | — | — | truncates |
| `Trailing` | row | hug | hug | centred both axes | `Space/Zero` | `Space/Zero` | `Corner Radius/Zero` | no |
| `Action 1`, `Action 2` | row | fixed `Size/Touch_Target` | fixed `Size/Touch_Target` | centred both axes | `Space/XS` all round | `Space/Zero` | `Corner Radius/Zero` | no |

**The trailing actions sit flush against each other**, gap `Space/Zero`. Their
48 targets touch, so the icons read 24 apart. The same rule puts 12 between the
leading icon and the title. Do not add a gap to "fix" the spacing — it would
push the icons off the screen margin.

### Text styles

| Part | Style | Flutter token |
|---|---|---|
| Title | `Heading/H1 (18) -` | `H1(18)` |
| Subtitle | `Label/L3 Strong (12) -` | `L3Strong(12)` |
| Select all label | `Label/L3 Strong (12) -` | `L3Strong(12)` |
| Status bar clock | set by the device, not by the app | — |

### Geometry — generated from Figma, 2026-09-30

Measured from the component, for checking a build. The tokens above are the
contract; these numbers are what those tokens produce.

| Device | Header width | Header height | Status bar height |
|---|---|---|---|
| Android | 360 | 80 | 28 |
| Notch | 393 | 96 | 44 |
| Dynamic Island | 393 | 106 | 54 |

| Part | Value, Android at 360 wide |
|---|---|
| Content row | 48 high, full width |
| Leading target | x 4, 48 × 48 |
| Leading icon | x 16, 24 × 24 |
| Title | x 52, 208 wide, 20 high |
| Title, one action | x 52, 256 wide |
| Title, no leading action | x 4, 256 wide |
| Subtitle | x 52, 13 high, 2 below the title |
| Title block with subtitle | 35 high |
| Trailing, two actions | x 260, 96 wide |
| Trailing, one action | x 308, 48 wide |
| Action 2 icon right edge | x 344, i.e. 16 from the right edge |
| Select all | x 288, 68 wide, 48 high |

Token values: `Size/Touch_Target` 48 · `Size/Icon/XL` 24 · `Space/Small` 8 ·
`Space/XS` 4 · `Space/XXS` 2 · `Space/Zero` 0 · `Stroke Width/Bold` 2 ·
`Corner Radius/Circular` circular.

**Header height does not change when the subtitle appears.** The title block is
35 high with a subtitle, which still fits the 48 row. Do not reserve extra
height for it.

## Properties

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Surface` | Variant | `Solid`, `Transparent` | `Solid` | `Solid` paints `Component/Header/Surface/Default`. `Transparent` paints nothing. |
| `Shadow` | Variant | `Yes`, `No` | `Yes` | Only built for `Surface = Solid`. |
| `Mode` | Variant | `Default`, `Selection` | `Default` | |
| `Device` | Variant | `Android`, `Notch`, `Dynamic Island` | `Android` | Changes the status bar only. |
| `Leading` | Boolean | true / false | `true` | `false` hides the leading action and the title moves to the screen margin. |
| `Title` | Text | any | `Sample text for header` | One shared default across every variant. |
| `Subtitle` | Boolean | true / false | `false` | |
| `Subtitle Text` | Text | any | `2 Devices` | |
| `Action 1` | Boolean | true / false | `true` | `Mode = Default` only. |
| `Action 2` | Boolean | true / false | `true` | `Mode = Default` only. |

**18 variants**: `Solid × (Shadow Yes, No) × Mode × Device` is 12, plus
`Transparent × Shadow No × Mode × Device` is 6. `Transparent` with a shadow is
not built, because a transparent bar has no surface to cast one.

None of these values is raw. Every fill, stroke, padding, gap, radius, size and
stroke weight in the set is bound to a variable.

**The action icon is swapped on the nested instance**, not on the Header. Select
the `Leading`, `Action 1` or `Action 2` instance and set its `Icon` property.
The Header has no icon-swap property of its own; there is one place to set the
icon and one place to set the state.

### `.Header_Action`

| Property | Type | Values | Default |
|---|---|---|---|
| `State` | Variant | `Enabled`, `Hover`, `Pressed`, `Focused`, `Disabled` | `Enabled` |
| `Icon` | Instance swap | any 24 icon from the library | `more_vert` |

**5 variants.**

## States

The Header is a container, not a control, so it has no state axis. Interaction
lives on each action, which is why the actions are their own component. Set the
state on the `.Header_Action` instance you mean.

| State | What changes, relative to Enabled |
|---|---|
| `Hover` | `State layer` fills `Component/Header/Overlay/Hover` at 10%. Pointer platforms only. |
| `Pressed` | `State layer` fills `Component/Header/Overlay/Pressed` at 5%. |
| `Focused` | The 48 target gains `Stroke/Focus/Default` at `Stroke Width/Bold`, drawn inside. The state layer keeps its resting fill. |
| `Disabled` | The whole action drops to 50% opacity. There is no disabled token. |

**No shadow in any state.** The action's surface is transparent, so per the
2026-09-18 ruling it carries an overlay only, never an elevation.

The Select all button is a `Button`, `Type = Text`: it carries Button's own five
states and Button's tokens. Do not restyle it here.

## Behaviour

- **Leading action, `Mode = Default`.** Pops the current screen. It is a back
  arrow, never a chevron.
- **Leading action, `Mode = Selection`.** Cancels the selection and returns the
  screen to `Mode = Default`. It does not pop the screen.
- **Select all.** Selects every item currently in the list. It does not change
  the leading action or the title; the screen updates the title count itself.
- **Trailing actions** do whatever the screen assigns. The Header does not know.
- **Width.** The Header fills the screen. The title block takes whatever the
  leading and trailing actions leave. At the smallest supported width the title
  truncates; the actions never shrink and never wrap.
- **The title is always one line.** A longer string truncates with an ellipsis.
  The Header height never changes because of the title.
- **The subtitle is always one line**, and truncates the same way.
- **The status bar is drawn art.** It does not read the real clock, battery or
  signal. On device, the platform draws the real status bar in that space; the
  layer is there so a design shows the correct height. Do not ship the drawn
  glyphs as a status bar.
- **What never happens:** the Header does not scroll, collapse, change height
  between states, or animate between `Default` and `Selection`. No motion is
  specified. Do not invent a transition.

## Tokens

| Part | Token |
|---|---|
| Surface, `Surface = Solid` | `Component/Header/Surface/Default` |
| Surface, `Surface = Transparent` | none — no paint |
| Shadow, `Shadow = Yes` | effect style `TopBarSurface` |
| Title | `Component/Header/Text/Default` |
| Subtitle | `Component/Header/Text/Subtitle` |
| Leading and trailing icons | `Component/Header/Icon/Default` |
| Status bar glyphs | `Component/Header/Icon/Default` |
| Status bar clock | `Component/Header/Text/Default` |
| Action state layer, `Hover` | `Component/Header/Overlay/Hover`, paint opacity 10% |
| Action state layer, `Pressed` | `Component/Header/Overlay/Pressed`, paint opacity 5% |
| Action focus ring | `Stroke/Focus/Default`, width `Stroke Width/Bold`, drawn inside the 48 target |
| Select all | Button's own `Type = Text` tokens |

`Component/Header/Surface/Default` aliases
`Surface/Neutral/Low_Contrast/Surface_1/Default`, and the title, subtitle and
icon tokens alias the matching `On_Low_Contrast` families. That pairing is why
a Transparent Header is legible on Canvas and on `Low_Contrast/Surface_1..3`
without changing token: the same text token is correct on all of them.

**The overlay tokens carry their alpha in the value.** In code use the token as
it is. In Figma the paint opacity repeats it, because Figma renders a bound fill
with the variable's RGB and the paint's opacity.

**`TopBarSurface`** is one drop shadow: x 0, y 4, blur 8, spread 0, colour
`Opacity/Neutral - Dark/10`, drawn behind the bar. Web:
`box-shadow: 0 4px 8px 0 <token>`. Flutter:
`BoxShadow(offset: Offset(0, 4), blurRadius: 8, spreadRadius: 0, color: <token>)`.

Use the shadow when the Header sits on a screen whose background is the plain
canvas and nothing else separates the bar from the content. Turn it off when the
screen already provides separation, as a registration or onboarding flow does.
A Transparent Header never takes it.

## Accessibility

| Field | Value |
|---|---|
| Role, the bar | `banner` on web; a header landmark on native. |
| Role, each action | `button`. |
| Label, title | The title is the screen's heading. Expose it as a level-1 heading, not as a label on the bar. |
| Label, leading, `Default` | "Back". |
| Label, leading, `Selection` | "Cancel selection". |
| Label, Select all | "Select all". |
| Label, trailing | Named by the screen. An icon-only button must carry a text label; never ship one without. |
| State strings | Disabled actions announce as disabled. The Header has no state of its own to announce. |
| Focus order | Leading, then the title heading, then Action 1, then Action 2 or Select all. Left to right, which matches the visual order. |
| Touch target | 48 × 48 on every action, carried by the `.Header_Action` frame. |
| Colour alone | Nothing in the Header is distinguished by colour alone. |

### Where it can ship

Two thresholds apply: 4.5:1 for the title, subtitle and icons, and 3:1 for the
focus ring. `Component/Header/Icon/Default` is an alias of
`Component/Header/Text/Default`, so the icons score exactly as the title does.

**Title, subtitle and icons — every mode, every surface:**

| Mode | Solid | Canvas | `Surface_1` | `Surface_2` | `Surface_3` |
|---|:---:|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lux | ✅ | ✅ | ✅ | ✅ | ✅ |
| Loyalty | ✅ | ✅ | ✅ | ✅ | ✅ |
| Studio | ✅ | ✅ | ✅ | ✅ | ✅ |

**Keyboard focus ring:**

| Mode | Solid | Canvas | `Surface_1` | `Surface_2` | `Surface_3` |
|---|:---:|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lux | ✅ | ✅ | ✅ | ✅ | ✅ |
| Loyalty | ❌ | ✅ | ❌ | ✅ | ✅ |
| Studio | ❌ | ❌ | ❌ | ❌ | ✅ |

**Do not ship a ❌ cell on a platform that has keyboard focus.** The failing
token is `Stroke/Focus/Default`, which aliases the theme CTA colour; the Header
does not set it. A single value change there clears every ❌ above, and clears
the same cells on Button, Checkbox, Radio Button, Check Circle and Switch at the
same time. No Header change would fix it. On touch-only builds the focus ring
never renders and the Header ships everywhere.

### Implementation

Web:

```html
<header class="hdr">
  <button class="hdr-action" aria-label="Back">…</button>
  <h1 class="hdr-title">Devices</h1>
  <button class="hdr-action" aria-label="Notifications">…</button>
</header>
```

```css
.hdr { background: var(--component-header-surface-default);
       box-shadow: 0 4px 8px 0 var(--opacity-neutral-dark-10); }
.hdr-action { inline-size: 48px; block-size: 48px; background: none; border: 0; }
.hdr-action:hover  > .layer { background: var(--component-header-overlay-hover); }
.hdr-action:active > .layer { background: var(--component-header-overlay-pressed); }
.hdr-action:focus-visible { outline: 2px solid var(--stroke-focus-default); outline-offset: -2px; }
.hdr-action:disabled { opacity: .5; }
```

Flutter:

```dart
AppBar(
  toolbarHeight: 48,
  backgroundColor: HvColors.componentHeaderSurfaceDefault,
  elevation: 0,
  flexibleSpace: const DecoratedBox(
    decoration: BoxDecoration(boxShadow: [
      BoxShadow(offset: Offset(0, 4), blurRadius: 8, spreadRadius: 0,
                color: HvColors.opacityNeutralDark10),
    ]),
  ),
  leading: IconButton(
    constraints: const BoxConstraints.tightFor(width: 48, height: 48),
    icon: const Icon(Icons.arrow_back, size: 24,
                     color: HvColors.componentHeaderIconDefault),
    tooltip: 'Back',
    onPressed: () => Navigator.of(context).pop(),
  ),
  titleSpacing: 0,
  title: Text('Devices', style: HvText.h1(18),
               maxLines: 1, overflow: TextOverflow.ellipsis),
)
```

`toolbarHeight` is the content row only. Add the status bar height with
`SafeArea` or `MediaQuery.padding.top` — do not hard-code 28, 44 or 54, which
are design figures for the three reference devices, not a device list.

## Haptics

| Event | Fires |
|---|---|
| Leading action, `Default` | none — navigation is not a haptic event |
| Leading action, `Selection` | none |
| Select all | none |
| Trailing actions | whatever the screen's action specifies, not the Header |

The haptics map in `_FOUNDATIONS.md` §5 is proposed and unsigned. Nothing in the
Header fires a haptic until it is signed off.

## Content

- The title is the screen's name, in sentence case. Not the app's name, not a
  greeting.
- Keep it short enough to survive at 360 wide with two actions, which is roughly
  20 characters. Longer titles truncate, they do not wrap.
- In `Selection` the title is the count: "1 selected", "12 selected". The screen
  sets it; the component ships one shared default.
- The subtitle is a short qualifier, such as a device count or a room name. It
  is not a description and never a second sentence.
- Trailing icons must be recognisable without a label in the bar, because there
  is no room for one. If an action needs a word, it does not belong here.

## Do

- Put the Header at the very top of the screen, above everything including tabs.
- Use `Surface = Solid` with `Shadow = Yes` on a plain canvas screen, so the bar
  separates from the content that scrolls under it.
- Use `Surface = Transparent` in a theme whose screen already has its own
  background, so the bar takes that background.
- Set the leading action to the back arrow on any screen the user navigated into.
- Set `Leading = false` on a top-level destination, so the title starts at the
  screen margin instead of being indented by an empty target.
- Swap the icon on the nested `.Header_Action`, and set its `State` there too.

## Don't

- Don't use a chevron for back. The leading action is `arrow_back`.
- Don't put three or more trailing actions in the bar. Two is the maximum; the
  third goes behind an overflow action.
- Don't add a gap between the trailing actions. Their targets are meant to touch.
- Don't shrink an action below 48 × 48 to fit a long title. Truncate the title.
- Don't turn the shadow on for a Transparent Header. There is no surface to
  raise, and the variant is not built.
- Don't bind `_deprecated/Surface/Invert/Default` to the title or the icons. It
  was the old header's text colour and it does not follow the mode.
- Don't use the old `State` values `On Color`, `FileManagement`, `Groups` or
  `Global`. They are replaced by `Surface = Transparent`, `Mode = Selection`,
  `Subtitle = true` and `Leading = false` respectively.
- Don't treat the drawn status bar as a real one, and don't hard-code its height.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-30 | Title truncation and wrapping are `NOT YET CAPTURED` in `Typography.md`. This file states one line with an ellipsis, which is what the component does. Confirm it as the rule. | design owner |
| 2026-09-30 | Safe-area insets are not specified anywhere. The three device heights are drawn art. Confirm that a build takes the inset from the platform. | design owner |
| 2026-09-30 | `Component/Header/Text_And_Icons/Device/Default` names text and icons but paints nothing now. Retire it, or give it a role? | design owner |
| 2026-09-30 | The focus ring fails 3:1 in Loyalty and Studio on some surfaces. Retune `Stroke/Focus/Default`, or accept the ❌ cells? | design owner |
| 2026-09-30 | Is a scrolling or collapsing Header ever needed? Nothing specifies one, and screens will ask. | design owner |
| 2026-09-25 | The Pending to Failed timeout in `_FOUNDATIONS.md` §2. Inherited, not Header-specific. | design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-30 | First handover. Axes changed from `State × Shadow × Device Property` to `Surface × Shadow × Mode × Device`. `On Color` became `Surface = Transparent`, `FileManagement` became `Mode = Selection`, `Groups` became `Subtitle`, `Global` became `Leading = false`. Actions gained 48 × 48 targets and the five interaction states through the new `.Header_Action`. The Header-level icon-swap properties were removed; the icon is set on the nested action. `Header Text Visibility` and `Selected Text` were removed. Six `Component/Header/*` tokens added. |
