# Tabs

| | |
|---|---|
| **Status** | Ready in Platform, Product, Lux, Loyalty and Studio. Two non-text cues miss 3:1 in the dark themes: the indicator in Loyalty, and the keyboard focus ring in Loyalty and Studio. See **Where it can ship**. |
| **Figma** | `Tabs` · set `18824:1587` · key `f137a1d527c1b3491e7c9c125ba6b2811fdb13de` · page `Tabs` `4236:941` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-30 |

Read `../_FOUNDATIONS.md` first. Token values live in `../foundations/Colour.md`,
sizes in `../foundations/Numbers.md`, text styles in `../foundations/Typography.md`.

## What it is

A row of tabs that switches which view fills the screen below it. Exactly one
tab is always selected.

## When to use

- The user is switching between views that each stand on their own, and tapping
  a tab replaces the whole content area.
- Exactly one of the options is always active. There is no "nothing selected".
- The row is pinned under the Header, or under a section title, and does not
  scroll away with the content.
- Two to five destinations. More than five needs `Scrolling = Yes`.

## When not to use

- The user is narrowing a list that stays on screen. That is a Filter Chip: the
  view stays, only its contents change, and zero to many can be selected.
- The options are facts about an object and touching them does nothing. That is
  a Chip.
- The user is choosing a value the device will act on, such as a mode, a speed
  or a programme. That is a Button group; every option commands the device
  rather than navigating.
- The user is moving between the top-level areas of the whole app. That is
  Bottom Navigation. Tabs move between views inside one screen.
- Nothing can be selected. Tabs have no zero state; use a Filter Chip row.

## Anatomy

```
Tabs                        surface fill; the whole row
├── Tab group               row of 2 to 5 tabs
│   ├── Tab01               always shown
│   ├── Tab02               always shown
│   ├── Tab03               shown when Tab 3 = true
│   ├── Tab04               shown when Tab 4 = true
│   └── Tab05               shown when Tab 5 = true
└── Divider                 1dp hairline under the whole row
```

Each `TabNN` is an instance of one of five building blocks, picked by `Type` and
`Configuration`:

```
.Tabs/Building Blocks/Primary/Text Only        set 18809:1726
.Tabs/Building Blocks/Primary/Text + Icon      set 18809:1369
.Tabs/Building Blocks/Primary/Icon Only        set 18800:822
.Tabs/Building Blocks/Secondary/Text Only      set 18809:1951
.Tabs/Building Blocks/Secondary/Text + Icon    set 18809:1960
```

One tab:

```
Tab                         48 high (64 for Primary Text + Icon)
└── State-layer             carries the hover and pressed overlay
    └── Tab Contents        label, or icon, or icon and label
        └── Indicator       shown when Selected = Yes
```

**The tab itself is the touch target**, at least 48 high and, in the fixed
layout, at least 72 wide. The row carries the surface; each tab is transparent
so the overlay reads against it.

### The two types

**Primary** has an indicator the width of its label, and sits directly under the
Header. Its Text + Icon form stacks the icon above the label, which is why that
row is taller.

**Secondary** has an indicator the full width of the tab, and sits inside the
content, under a Primary row or a section title. Its Text + Icon form puts the
icon beside the label.

Icon Only exists for Primary only.

### Layout, frame by frame

| Frame | Direction | Width | Height | Alignment | Padding | Gap | Corner radius |
|---|---|---|---|---|---|---|---|
| `Tabs` | column | fill | hug | top-left | `Space/Zero` | `Space/Zero` | `Corner Radius/Zero` |
| `Tab group` | row | fill | hug | left | `Space/Zero` | `Space/Zero` | `Corner Radius/Zero` |
| `TabNN`, `Scrolling = No` | — | fill, equal share | fixed | — | — | — | `Corner Radius/Zero` |
| `TabNN`, `Scrolling = Yes` | — | hug | fixed | — | — | — | `Corner Radius/Zero` |
| `State-layer` | column | fill | fill | centred | `Space/Large` left and right | `Space/Zero` | `Corner Radius/Zero` |
| `Tab Contents` | column or row | hug | hug | centred | see below | see below | `Corner Radius/Zero` |
| `Divider` | — | fill | 1dp | — | — | — | — |

`Tab Contents` padding and gap, by building block. Left and right padding is
`Space/Zero` throughout; the side padding lives on `State-layer`.

| Block | Direction | Padding top | Padding bottom, unselected | Padding bottom, selected | Gap |
|---|---|---|---|---|---|
| Primary / Text Only | column | `Space/Zero` | `Space/Number-14` | `Space/Zero` | `Space/Zero` |
| Primary / Text + Icon | column | `Space/Number-10` | `Space/Small` | `Space/Zero` | `Space/XXS` |
| Primary / Icon Only | column | `Space/Zero` | `Space/Number-12` | `Space/Zero` | `Space/XS` |
| Secondary / Text Only | row | `Space/Number-14` | `Space/Number-14` | `Space/Number-14` | `Space/Zero` |
| Secondary / Text + Icon | row | `Space/Zero` | `Space/Number-12` | `Space/Number-12` | `Space/Small` |

**A Primary tab swaps padding for its indicator.** Unselected, the contents
carry bottom padding exactly where the indicator would sit. Selected, the
indicator takes that space instead. The label does not move, and the tab does
not change height.

**Secondary padding does not change with selection**, because its indicator sits
outside the contents, along the bottom edge of the whole tab.

**Nothing in `Tab Contents` changes with `State`.** Geometry depends on
`Selected` only. A tab must not shift when it is hovered or focused.

### Text styles

| Part | Style | Flutter token |
|---|---|---|
| Label, selected | `Heading/H3 (14) -` | `H3(14)` |
| Label, unselected | `Label/L2 (14) -` | `L2(14)` |

Selection changes the weight from regular to semibold. `Heading/H3 (14) -` is
the only semibold 14 in the scale; there is no `Label/L2 Strong`.

### Geometry — generated from Figma, 2026-09-30

Measured from the component, for checking a build. The tokens above are the
contract; these numbers are what those tokens produce, at 360 wide with three
tabs.

| Variant | Row height | Tab height | Tab width |
|---|---|---|---|
| Primary, Text Only, fixed | 49 | 48 | 120 |
| Primary, Text Only, scrolling | 49 | 48 | 90, hugs |
| Primary, Text + Icon, fixed | 65 | 64 | 120 |
| Primary, Text + Icon, scrolling | 65 | 64 | 90, hugs |
| Primary, Icon Only, fixed | 49 | 48 | 88, hugs |
| Primary, Icon Only, scrolling | 49 | 48 | 88, hugs |
| Secondary, Text Only, fixed | 49 | 48 | 120 |
| Secondary, Text Only, scrolling | 49 | 48 | 90, hugs |
| Secondary, Text + Icon, fixed | 49 | 48 | 120 |
| Secondary, Text + Icon, scrolling | 49 | 48 | 122, hugs |

Row height is the tab plus the 1dp divider.

| Part | Size |
|---|---|
| Indicator, Primary Text Only and Text + Icon | 22 × 3, centred under the label |
| Indicator, Primary Icon Only | 20 × 3, centred under the icon |
| Indicator, Secondary | full tab width × 2 |
| Icon | 24 × 24 |
| State layer side padding | 32 |
| Divider | 1 |

Token values: `Size/Touch_Target` 48 · `Size/Icon/XL` 24 · `Space/Large` 32 ·
`Space/Number-14` 14 · `Space/Number-12` 12 · `Space/Number-10` 10 ·
`Space/Small` 8 · `Space/XS` 4 · `Space/XXS` 2 · `Space/Zero` 0 ·
`Stroke Width/Regular` 1 · `Stroke Width/Bold` 2.

## Properties

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Type` | Variant | `Primary`, `Secondary` | `Primary` | |
| `Configuration` | Variant | `Text Only`, `Text + Icon`, `Icon Only` | `Text Only` | `Icon Only` is built for `Primary` only. |
| `Scrolling` | Variant | `No`, `Yes` | `No` | `No` shares the width equally; `Yes` hugs and scrolls. |
| `Tab 3` | Boolean | true / false | `true` | |
| `Tab 4` | Boolean | true / false | `false` | |
| `Tab 5` | Boolean | true / false | `false` | |

**10 variants.** Tabs 1 and 2 always show, so a row is two to five tabs.

Each tab's label, icon, `State` and `Selected` are set on its own nested
instance. The row does not own them, because five tabs would otherwise need
five copies of every property.

### One tab

| Property | Type | Values | Default |
|---|---|---|---|
| `State` | Variant | `Enabled`, `Hover`, `Pressed`, `Focused`, `Disabled` | `Enabled` |
| `Selected` | Variant | `Yes`, `No` | `No` |
| `Label` | Text | any | `Tab` |
| `Icon` | Instance swap | any 24 icon from the library | placeholder |

**10 variants per building block.**

## States

| State | What changes, relative to Enabled |
|---|---|
| `Hover` | `State-layer` fills `Component/Tabs/Overlay/Hover` at 10%. Pointer platforms only. |
| `Pressed` | `State-layer` fills `Component/Tabs/Overlay/Pressed` at 5%. |
| `Focused` | The tab gains `Stroke/Focus/Default` at `Stroke Width/Bold`, drawn inside. No overlay. |
| `Disabled` | The whole tab drops to 50% opacity. There is no disabled token. |

**Hover is stronger than Pressed.** That is the standing rule for components
whose surface is transparent: hover 10%, pressed 5%.

**No tab carries a shadow in any state**, for the same reason.

`Selected = Yes` shows the indicator, switches the label to
`Component/Tabs/Label/Selected` and to the semibold style, and switches the icon
to `Component/Tabs/Icon/Selected`.

## Behaviour

- **Tap** selects the tab and replaces the content area. Nothing else on screen
  survives the change.
- **Exactly one tab is selected at all times.** Set `Selected = Yes` on one tab
  and `No` on the rest. A row with none selected, or two selected, is a bug.
- **A disabled tab cannot be selected.** If the selected tab becomes disabled,
  the screen must move the selection, not leave it stranded.
- **Fixed rows**, `Scrolling = No`: every tab takes an equal share of the width
  and all of them must fit. At 360 wide, five tabs give 72 each, which is the
  floor. Six tabs do not fit; switch to scrolling.
- **Scrolling rows**, `Scrolling = Yes`: each tab hugs its label and the row
  scrolls horizontally. The row starts flush at the left edge. The selected tab
  should be scrolled into view when the screen opens.
- **The selected tab is one pixel wider than the same tab unselected**, because
  semibold is wider than regular. In a fixed row this is absorbed. In a
  scrolling row the tabs after it shift by one pixel as selection moves. Do not
  try to correct it per tab; if it matters, reserve the semibold width.
- **The label never wraps and never truncates by design.** Keep labels short
  enough to fit; see Content.
- **What never happens:** the row does not change height between states, does
  not reorder itself, and has no motion specified. Do not invent a sliding
  indicator animation.

## Tokens

| Part | Token |
|---|---|
| Row surface | `Component/Tabs/Surface/Default` |
| Divider | `Component/Tabs/Divider/Default`, width `Stroke Width/Regular` |
| Label, selected | `Component/Tabs/Label/Selected` |
| Label, unselected | `Component/Tabs/Label/Unselected` |
| Icon, selected | `Component/Tabs/Icon/Selected` |
| Icon, unselected | `Component/Tabs/Icon/Unselected` |
| Indicator | `Component/Tabs/Indicator/Default` |
| State layer, `Hover` | `Component/Tabs/Overlay/Hover`, paint opacity 10% |
| State layer, `Pressed` | `Component/Tabs/Overlay/Pressed`, paint opacity 5% |
| Focus ring | `Stroke/Focus/Default`, width `Stroke Width/Bold`, inside the tab |

The tab itself has no fill. The row carries the surface and the tab is
transparent over it, which is what lets the overlay read.

`Component/Tabs/Surface/Default` aliases the same surface as the Header, because
the row is pinned under it and the two must not show a seam.

`Component/Tabs/Indicator/Default` aliases the theme CTA colour, the same value
that drives the Button fill, the focus ring and the Switch track. One value
change moves all of them.

**The overlay tokens carry their alpha in the value.** In code use the token as
it is. In Figma the paint opacity repeats it.

## Accessibility

| Field | Value |
|---|---|
| Role, the row | `tablist`. |
| Role, each tab | `tab`, owning the panel it reveals. |
| Role, the content area | `tabpanel`, labelled by its tab. |
| Label | The tab's own text. An Icon Only tab has no text, so the screen must supply the name; without one the tab is unusable by a screen reader. |
| State strings | Selected announces as selected. Disabled announces as disabled. |
| Focus order | One stop for the whole row. Arrow keys move between tabs; Tab key leaves the row. |
| Touch target | At least 48 high, and at least 72 wide in the fixed layout. |
| Colour alone | Selection is carried by the indicator, the label weight and the label colour together, so it survives when colour does not. |

### Where it can ship

Text takes 4.5:1; the indicator and the focus ring are non-text cues and take
3:1. The icon tokens alias the label tokens, so icons score as labels do.

**Labels and icons, on the tab surface:**

| Mode | Selected | Unselected |
|---|:---:|:---:|
| Platform | ✅ | ✅ |
| Product | ✅ | ✅ |
| Lux | ✅ | ✅ |
| Loyalty | ✅ | ✅ |
| Studio | ✅ | ✅ |

**Non-text cues, on the tab surface:**

| Mode | Indicator | Focus ring |
|---|:---:|:---:|
| Platform | ✅ | ✅ |
| Product | ✅ | ✅ |
| Lux | ✅ | ✅ |
| Loyalty | ❌ | ❌ |
| Studio | ✅ | ❌ |

**Do not ship a ❌ cell.** Both failures come from one token,
`Component/Selection_Control/Icon/Selected/Default`, which the indicator aliases
and which `Stroke/Focus/Default` resolves through. The Tabs component does not
set either. One value change clears these cells and the matching cells on
Button, Checkbox, Radio Button, Check Circle, Switch and Header. On a touch-only
build the focus ring never renders, which leaves only the Loyalty indicator.

Where the indicator fails, selection is still carried by the label weight and
the label colour, so the row remains usable. It is the indicator alone that is
too quiet.

### Implementation

Web:

```html
<div role="tablist" aria-label="Views">
  <button role="tab" aria-selected="true"  aria-controls="p1" id="t1">Overview</button>
  <button role="tab" aria-selected="false" aria-controls="p2" id="t2" tabindex="-1">Usage</button>
</div>
<div role="tabpanel" id="p1" aria-labelledby="t1">…</div>
```

```css
[role="tab"] { min-block-size: 48px; background: none; border: 0;
               color: var(--component-tabs-label-unselected); }
[role="tab"][aria-selected="true"] { color: var(--component-tabs-label-selected);
               font-weight: 600; box-shadow: inset 0 -3px 0 var(--component-tabs-indicator-default); }
[role="tab"]:hover  { background: var(--component-tabs-overlay-hover); }
[role="tab"]:active { background: var(--component-tabs-overlay-pressed); }
[role="tab"]:focus-visible { outline: 2px solid var(--stroke-focus-default); outline-offset: -2px; }
[role="tab"]:disabled { opacity: .5; }
```

Only the selected tab is in the tab order. Arrow keys move the selection.

Flutter:

```dart
TabBar(
  isScrollable: false,                       // Scrolling = Yes -> true
  indicatorSize: TabBarIndicatorSize.label,  // Secondary -> TabBarIndicatorSize.tab
  indicatorColor: HvColors.componentTabsIndicatorDefault,
  indicatorWeight: 3,                        // Secondary -> 2
  labelColor: HvColors.componentTabsLabelSelected,
  unselectedLabelColor: HvColors.componentTabsLabelUnselected,
  labelStyle: HvText.h3(14),
  unselectedLabelStyle: HvText.l2(14),
  overlayColor: WidgetStateProperty.resolveWith((s) =>
      s.contains(WidgetState.pressed) ? HvColors.componentTabsOverlayPressed
    : s.contains(WidgetState.hovered) ? HvColors.componentTabsOverlayHover
    : null),
  tabs: const [Tab(text: 'Overview'), Tab(text: 'Usage')],
)
```

`indicatorSize` is what separates the two types: `label` is Primary, `tab` is
Secondary.

## Haptics

| Event | Fires |
|---|---|
| Selecting a tab | none — navigation is not a haptic event |
| Tapping the already-selected tab | none |
| Tapping a disabled tab | none |

The haptics map in `_FOUNDATIONS.md` §5 is proposed and unsigned. Nothing in
Tabs fires a haptic until it is signed off.

## Content

- A tab label is one or two words, in sentence case. It names a view, not an
  action.
- Keep every label in a fixed row short enough that the longest one fits its
  share: about 12 characters at 360 wide with three tabs, about 8 with five.
- Labels do not wrap and are not truncated by the component. If a label does not
  fit, shorten it or switch to scrolling.
- Do not number the tabs. If order matters that much, it is a stepper, not tabs.
- Icon Only tabs must still have a name for assistive technology, and the icons
  must be distinguishable without it.

## Do

- Pin the row directly under the Header for Primary, so the two surfaces meet
  with no seam.
- Use Secondary only inside content, and only under something that already
  establishes where you are.
- Keep exactly one tab selected at every moment, including on first paint.
- Switch to `Scrolling = Yes` as soon as the labels stop fitting, rather than
  shortening a label past the point where it says anything.
- Set the label, icon and state on the nested tab instance.
- Scroll the selected tab into view when a scrolling row first appears.

## Don't

- Don't use pill or chip shapes for tabs. They read as Buttons and Chips, and
  the pill sets are deprecated: `[DEPRECATED] Tabs — pill` `4569:6998`,
  `[DEPRECATED] Tabs1` `9869:18870`, and both `[DEPRECATED] .Tabs_States`
  `4236:955` and `9869:18859`. Do not instance any of them.
- Don't put more than five tabs in a fixed row, or fewer than two in any row.
- Don't use Tabs where nothing can be selected. Tabs have no zero state.
- Don't mix Primary and Secondary in the same row.
- Don't set `Theme` on a tab. Theme is a Colours mode in v1.3; the property no
  longer exists.
- Don't animate the indicator between tabs. No motion is specified.
- Don't rely on the indicator alone in Loyalty; the label weight and colour are
  doing the work there.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-30 | The indicator misses 3:1 in Loyalty and the focus ring misses it in Loyalty and Studio. Retune `Component/Selection_Control/Icon/Selected/Default`, or accept the ❌ cells? | design owner |
| 2026-09-30 | Should Secondary get an Icon Only configuration? It is the one gap in the matrix, and was left out deliberately. | design owner |
| 2026-09-30 | `Tab Contents` padding uses `Space/Number-10`, `-12` and `-14`, which `Numbers.md` marks legacy and off-scale. Whether new work may use them is already OPEN there; Tabs is now the component that depends on the answer. | design owner |
| 2026-09-30 | Tabs have no motion. Every platform animates the indicator by default. Specify a curve and duration, or state that the default is accepted. | design owner |
| 2026-09-25 | The Pending to Failed timeout in `_FOUNDATIONS.md` §2. Inherited, not Tabs-specific. | design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-30 | First handover. `Theme` removed as a variant and is now a Colours mode, taking the set from 50 variants to 10 and each building block from 40 to 10. `Type = Fancy / Standard` renamed to `Primary / Secondary`, matching the building blocks. `Disabled` added to every tab. `Focus` renamed `Focused`. Focus now draws a ring instead of an overlay, and the hover and pressed overlays were corrected to 10% and 5%. Added `Tab 3`, `Tab 4` and `Tab 5` booleans; the row was previously fixed at three. Nine `Component/Tabs/*` tokens added. Four pill-shaped predecessors deprecated. |
