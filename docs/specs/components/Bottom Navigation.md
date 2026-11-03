# Bottom Navigation

| | |
|---|---|
| **Status** | Ready in all five modes for labels, icons and all five brands. The icon is optional (`Has Icon`); the belt hugs its content, so it is 57 high with icons and 48 without. The selected segment carries a `Brand` axis, which exists in Platform and Product only. **Do not put a timer badge on a selected segment in Loyalty or Studio** — it is one token for both selections and disappears on the selected fill there. Lux is the only mode that draws the shadow and the hairline; Loyalty and Studio select with the selection-control colour instead of a neutral surface. The keyboard focus ring misses 3:1 in Loyalty and Studio and is invisible on a focused selected segment there; the timer badge misses it on an unselected segment in Loyalty. Touch-only builds are unaffected by the focus ring. The belt must sit over the canvas, `Low_Contrast/Surface_2` or `Surface_3` — **not over `Surface_1`**. See **Where it can ship**. |
| **Figma** | `Bottom Navigation` · set `40000825:3886` · key `116c5684b2ac589b0be7cc6308be8c482e426f1c` · page `Bottom Navigation` `2301:4536` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-30 |

Read `../_FOUNDATIONS.md` first. Token values live in `../foundations/Colour.md`,
sizes in `../foundations/Numbers.md`, text styles in `../foundations/Typography.md`.

## What it is

A pill-shaped belt of segments that switches which set of controls fills the
screen below it. Exactly one segment is always selected. Also called the
Navigation belt.

## When to use

- A connected device exposes several groups of controls — control, timer,
  schedule, energy — and the screen shows one group at a time. This is the
  component's main job: almost every IoT and Bluetooth device screen uses it to
  segment its controls.
- Exactly one of the groups is always active. There is no "nothing selected".
- The belt floats near the bottom of a device screen, over the page, and stays
  put while the controls above it change.
- Two to seven groups. More than seven does not fit the pattern; see Behaviour.

## When not to use

- The user is moving between the top-level areas of the whole app. That is
  Global Navigation, not this.
- The row is pinned under the Header and switches whole views inside one screen.
  That is Tabs — it sits at the top, spans the full width and has a divider.
- The user is narrowing a list that stays on screen. That is a Filter Chip: zero
  to many can be selected.
- The user is choosing a value the device acts on immediately, such as a speed or
  a programme. That is a Button group; every option commands the device rather
  than changing which controls are shown.
- The options are facts about an object and touching them does nothing. That is a
  Chip.

## Anatomy

```
Bottom Navigation           the belt: surface, hairline, full-round radius
└── Viewport                clips; scrolls horizontally
    └── Segment row         2 to 7 segments, no gap
        ├── .Bottom_Nav_Segment    Selected = Yes
        ├── .Bottom_Nav_Segment    Selected = No
        └── …
```

One segment:

```
Segment                     minimum 48 high and 82 wide; the touch target
└── State layer             carries the hover and pressed overlay and the padding
    └── Content             icon above label
        ├── Icon            24, shown when Has Icon = true
        └── Label row       label, and the badge when Has Badge = true
            ├── Label
            └── Badge       8 dot, hidden by default
```

**The segment itself is the touch target.** Its height is bound to a minimum of
`Size/Touch_Target`, so a label-only segment still clears 48 × 48 once the icon
is gone. There is no separate a11y frame.

**The icon is optional.** `Has Icon = false` hides it and the segment collapses to
the label alone. The label is what carries the meaning either way, so nothing else
changes — same tokens, same states, same brand behaviour.

The belt carries the surface. An unselected segment has no fill and no stroke, so
the belt shows through it; the selected segment has both.

### Layout, frame by frame

Every frame in the belt hugs vertically; none carries a fixed height.

| Frame | Direction | Width | Height | Alignment | Padding | Gap | Corner radius | Clips |
|---|---|---|---|---|---|---|---|---|
| `Bottom Navigation` | row | fill | hug | left, centre | `Space/Zero` | `Space/Zero` | `Corner Radius/Circular` | no |
| `Viewport` | row | fill | hug | left, centre | `Space/Zero` | `Space/Zero` | `Corner Radius/Circular` | **yes**, horizontal |
| `Segment row`, 2–3 segments | row | fill | hug | left, centre | `Space/Zero` | `Space/Zero` | — | no |
| `Segment row`, 4–7 segments | row | hug | hug | left, centre | `Space/Zero` | `Space/Zero` | — | no |
| `Segment`, 2–3 segments | — | fill, equal share | hug, min `Size/Touch_Target` | — | `Space/Zero` | `Space/Zero` | `Corner Radius/Circular` | yes |
| `Segment`, 4–7 segments | — | hug, min 82 | hug, min `Size/Touch_Target` | — | `Space/Zero` | `Space/Zero` | `Corner Radius/Circular` | yes |
| `State layer` | row | hug | fill | centre, centre | see below | `Space/Zero` | `Corner Radius/Circular` | no |
| `Content` | column | hug | hug | centre, centre | `Space/Zero` | `Space/XS` | — | no |
| `Label row` | row | hug | hug | centre, centre | `Space/Zero` | `Space/XXS` | — | no |

`State layer` padding, which is what makes a selected segment wider:

| Selection | Padding top and bottom | Padding left and right |
|---|---|---|
| `Selected = Yes` | `Space/Small` | `Space/Large` |
| `Selected = No` | `Space/Small` | `Space/Medium` |

**Two to three segments share the width equally and do not scroll. From four up
the segments hug and the row scrolls.** That switch is the only structural
difference between the variants.

**Nothing in `Content` changes with `State`.** Geometry depends on `Selected`
only, so a segment must not move when it is hovered, pressed or focused.

### Text styles

| Part | Style | Flutter token |
|---|---|---|
| Label, selected | `Label/L3 Strong (12) -` | `L3Strong(12)` |
| Label, unselected | `Label/L3 (12) -` | `L3(12)` |

Selection changes the weight from regular to semibold. Both carry −1% tracking at
12, so only the weight and the colour change.

### Geometry — generated from Figma, 2026-09-30

Measured from the component at a 328 belt, which is a 360 screen less
`Space/Medium` each side. The tokens above are the contract; these numbers are
what those tokens produce, with the default `Label` string.

Widths are with the default `Label` string; heights are with `Has Icon = true`.

| Variant | Belt | Viewport | Row | Overflow | Segment widths |
|---|---|---|---|---|---|
| `Segments=2` | 328 × 57 | 328 | 328 | 0 | 164, 164 |
| `Segments=3` | 328 × 57 | 328 | 328 | 0 | 110, 109, 109 |
| `Segments=4` | 328 × 57 | 328 | 337 | 9 | 96, 82, 82, 82 |
| `Segments=5` | 328 × 57 | 328 | 419 | 91 | 96, 82, 82, 82, 82 |
| `Segments=6` | 328 × 57 | 328 | 501 | 173 | 96, 82, 82, 82, 82, 82 |
| `Segments=7` | 328 × 57 | 328 | 583 | 255 | 96, 82, 82, 82, 82, 82, 82 |

Overflow is how much of the row is hidden, and therefore how far it can scroll.

**Nothing in the belt has a fixed height.** The segment hugs its content with a
`Size/Touch_Target` floor, and the segment row, the viewport and the belt all hug
in turn, so one number travels the whole way up:

| `Has Icon` | Segment | Row | Viewport | Belt |
|---|---|---|---|---|
| `true` | 57 | 57 | 57 | **57** |
| `false` | 48 | 48 | 48 | **48** |

Turning the icon off shortens the whole belt to the tap-target minimum. Do not
pin any of the four to a number.

| Part | Size |
|---|---|
| Segment height, `Has Icon = true` | **57** — `Space/Small` ×2 + 24 icon + `Space/XS` + 13 label |
| Segment height, `Has Icon = false` | **48** — the content needs 29, so `Size/Touch_Target` sets the floor |
| Segment minimum height | 48, bound to `Size/Touch_Target` |
| Segment minimum width | 82 |
| Selected segment, hugging, with icon | 96 |
| Icon | 24 × 24 |
| Badge | 8 × 8 |

**Both heights are computed, not authored.** The segment hugs its content with a
48 floor, so turning the icon off shortens it to exactly the tap-target minimum,
and the belt hugs the segment.
| Selected stroke, Platform and Product | 1, inside, excluded from layout |
| Selected stroke, Lux | 0.2, inside, excluded from layout |
| Selected stroke, Loyalty and Studio | none |
| Focus ring | 2, inside, excluded from layout |

Every stroke is drawn inside and excluded from layout, so the segment is the
same size in all five modes and in every state despite the width changing.

Token values: `Size/Icon/XL` 24 · `Space/Large` 32 · `Space/Medium` 16 ·
`Space/Small` 8 · `Space/XS` 4 · `Space/XXS` 2 · `Space/Zero` 0 ·
`Corner Radius/Circular` 9999 · `Stroke Width/Hairline` 0.2 ·
`Stroke Width/Bold` 2 · `Size/Touch_Target` 48.

**The height is not a typed number.** It falls out of the padding, the icon and
the label: 57 with an icon, and the `Size/Touch_Target` floor of 48 without one.
Do not round either to 56.

## Properties

The belt:

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Segments` | Variant | `2`, `3`, `4`, `5`, `6`, `7` | `2` | 2 and 3 share the width; 4 and up hug and scroll. |

**6 variants.**

Each segment's label, icon, badge, selection and state are set on its own nested
instance. The belt does not own them, because seven segments would otherwise need
seven copies of every property.

One segment — `.Bottom_Nav_Segment`, set `40000824:3695`,
key `cf63f61d7144eca22b1993ec343646effdb97365`:

| Property | Type | Values | Default |
|---|---|---|---|
| `Brand` | Variant | `Havells`, `Lloyd`, `Crabtree`, `Standard`, `Product` | `Havells` |
| `Selected` | Variant | `Yes`, `No` | `Yes` |
| `State` | Variant | `Enabled`, `Hover`, `Pressed`, `Focused`, `Disabled` | `Enabled` |
| `Label` | Text | any | `Label` |
| `Has Icon` | Boolean | true / false | `true` |
| `Has Badge` | Boolean | true / false | `false` |
| `Icon` | Instance swap | any 24 icon from the library | placeholder |

**50 variants.**

**`Brand` reaches an unselected segment through its hover and pressed overlay
only.** At rest an unselected segment looks the same in every brand. Set all the
segments in one belt to the same brand.

## States

| State | What changes, relative to Enabled |
|---|---|
| `Hover` | `State layer` fills `Component/Bottom_Navigation/Overlay/Hover` at 10%. Pointer platforms only. |
| `Pressed` | `State layer` fills `Component/Bottom_Navigation/Overlay/Pressed` at 5%. |
| `Focused` | The segment's stroke becomes `Stroke/Focus/Default` at `Stroke Width/Bold`, drawn inside. No overlay. |
| `Disabled` | The whole segment drops to 50% opacity. There is no disabled token. |

**Hover is stronger than Pressed** — 10% against 5%. That is the standing rule
for components whose segments are transparent over a surface.

**Focus replaces the hairline rather than adding to it.** Both are drawn inside
and both are excluded from layout, so the segment does not change size when it
takes focus, in any mode.

`Selected = Yes` adds the fill and the hairline, switches the label to
`Component/Bottom_Navigation/Label/Selected` and to the semibold style, and
switches the icon to `Component/Bottom_Navigation/Icon/Selected`.

## Behaviour

- **Tap** selects the segment and replaces the controls above the belt. The belt
  itself does not move.
- **Exactly one segment is selected at all times.** Set `Selected = Yes` on one
  and `No` on the rest. A belt with none selected, or two selected, is a bug.
- **A disabled segment cannot be selected.** If the selected segment becomes
  disabled, the screen must move the selection rather than leave it stranded.
- **Two or three segments** share the width equally and the belt does not scroll.
- **Four or more segments** hug their content and the row scrolls horizontally
  inside `Viewport`. This is the normal case on a device screen.

### Scrolling, and centring the selection

This is the part Figma cannot show. The prototype clips the row; it does not
scroll it.

**On selection, the chosen segment scrolls to the centre of the belt**, which is
what reveals the segments hidden past the right edge. The offset is clamped at
both ends:

```
target = segmentCentre - viewportWidth / 2
offset = clamp(target, 0, rowWidth - viewportWidth)
```

The clamp is what makes it feel right rather than mechanical:

- Selecting a segment at the **left** end gives a negative target, which clamps
  to 0. The row does not move. The first segments never slide off to the left to
  centre themselves.
- Selecting a segment in the **middle** centres it, so hidden segments on both
  sides come into view.
- Selecting a segment near the **right** end clamps to the maximum offset, so the
  row stops with the last segment flush against the right edge and never
  over-scrolls into empty space.

Further rules:

- **Animate the scroll** when the user selects; **jump without animation** when
  the belt first paints with a selection already made.
- **The user may also scroll the row by hand.** Doing so does not change the
  selection. A manual scroll is not overridden until the next selection.
- **The row starts flush at the left edge.** There is no leading or trailing
  padding inside `Viewport`; the belt's own full-round radius is what softens the
  ends.
- Scrolling is horizontal only, and the belt never grows taller than 55.

**Consequence in Lux, worth knowing before you build it:** `Viewport` clips, so
the selected segment's drop shadow is cut off where the segment meets the left or
right edge of the belt. That is unavoidable with a scrolling row inside a clipped
box, and it is why the shadow is specified on the segment rather than on the row.
At 3dp offset and 9dp blur against a full-round edge it is not noticeable in
practice.

- **What never happens:** the belt does not change height between states, does not
  reorder itself, does not wrap onto a second line, and does not collapse a
  segment to an icon when space is short. It scrolls instead.

## Tokens

| Part | Token |
|---|---|
| Belt surface | `Component/Bottom_Navigation/Surface/Default` |
| Belt and selected-segment hairline | `Component/Bottom_Navigation/Stroke/Default`, width `Stroke Width/Hairline`, inside |
| Selected segment fill | `Component/Bottom_Navigation/Segment/Surface/Selected` |
| Selected segment stroke | `Component/Bottom_Navigation/Brand/<Brand>/Stroke/Selected`, width `Component/Bottom_Navigation/Stroke_Width/Selected`, inside |
| Label, selected | `Component/Bottom_Navigation/Brand/<Brand>/Label/Selected` |
| Label, unselected | `Component/Bottom_Navigation/Label/Unselected` |
| Icon, selected | `Component/Bottom_Navigation/Brand/<Brand>/Icon/Selected` |
| Icon, unselected | `Component/Bottom_Navigation/Icon/Unselected` |
| State layer, `Hover` | `Component/Bottom_Navigation/Brand/<Brand>/Overlay/Hover`, paint opacity 10% |
| State layer, `Pressed` | `Component/Bottom_Navigation/Brand/<Brand>/Overlay/Pressed`, paint opacity 5% |
| Badge | `Component/Bottom_Navigation/Badge/Default` — one value for both selections |
| Focus ring | `Stroke/Focus/Default`, width `Stroke Width/Bold`, inside the segment |

An unselected segment has no fill token and no stroke at all. The belt shows
through it.

**The belt surface is translucent in every mode** — a 50% scrim, light over the
light themes and dark over Loyalty and Studio. Both values carry the same alpha,
which is what lets one paint opacity be correct in all five modes.

Because it is translucent, what it reads against depends on what is behind it:

- **Place the belt over the canvas, `Low_Contrast/Surface_2` or
  `Low_Contrast/Surface_3`.**
- **Not over `Low_Contrast/Surface_1`.** In Loyalty and Studio the unselected
  label lands just under 4.5:1 there.
- Not over a photograph, a brand surface or a status surface. The contrast is not
  defined and the component is not specified for it.

### The badge

`Component/Bottom_Navigation/Badge/Default` aliases the CTA colour of the mode —
the same value that drives the Button fill, the Tabs indicator and the Switch
track — **except in Loyalty**, where it aliases
`Icon/On_Neutral/Low_Contrast/High_Emphasis/Default` and reads white. The CTA
gold would otherwise sit on a gold selected segment and vanish.

**One token serves both selections, and it does not cover both.** On the belt,
behind an unselected segment, it clears 3:1 in all five modes. On the selected
segment it clears 3:1 in Platform, Product and Lux, and fails in the dark themes:
white on Loyalty's gold, and in Studio the badge and the selected fill resolve to
the *same* primitive, so the badge is invisible. **Do not put a badge on a
selected segment in Loyalty or Studio** until the token is split — see Open
questions.

### Brand is a variant, and it exists in Platform and Product only

The selected segment carries a **brand**. This is the only component in the
library with a brand axis — `foundations/Colour.md` §12 records that brand accent
is undecided in general, and the ruling here does not generalise.

Brand changes three things: the selected segment's **stroke**, its **label and
icon** colour, and the **hover and pressed overlay** on any segment. It never
changes the fill or the geometry.

| `Brand` | Token family | Platform | Product | Overlay hue |
|---|---|---|---|---|
| `Havells` | `Component/Bottom_Navigation/Brand/Havells_Red/*` | red | **black** | red, then neutral in Product |
| `Lloyd` | `…/Brand/Lloyd_Blue/*` | violet | violet | violet |
| `Crabtree` | `…/Brand/Crabtree_Green/*` | green | green | green |
| `Standard` | `…/Brand/Standard_Blue/*` | blue | blue | **neutral — see below** |
| `Product` | `…/Brand/Product_Black/*` | black | black | neutral |

**`Havells` follows the platform CTA, exactly as Button does** — red in Platform
and black in Product. It is the house brand, so it tracks the theme rather than
pinning a hue. The other four keep their own hue in both modes; only Havells
changes between them.

**The overlay follows the brand family.** A Crabtree segment tints green on hover
and pressed, Lloyd violet, and so on — the same 10% and 5% steps every other
control uses, on the brand's own hue.

**`Standard` tints neutral, not blue, and that is the decision.** The primitive
library has Red, Violet, Green, Lux, Loyalty, Gold and two neutrals but no
`Opacity/Blue` ramp, and the design owner accepted the neutral rather than adding
one. Do not substitute another hue for it.

**Lloyd sits on the Violet ramp** despite the `Lloyd_Blue` token name. Copy the
token strings verbatim; `AGENTS.md` §5 covers why the names are not tidied.

**Outside those two modes the brand disappears.** It is not recoloured — it is
replaced by the mode's own treatment, which is why the tokens are component-level
rather than the plain semantic brand tokens:

| Mode | Selected label and icon | Selected stroke | Width | Overlay |
|---|---|---|---|---|
| Platform, Product | the brand colour | the brand stroke | `Stroke Width/Regular` | the brand hue |
| Lux | neutral high-emphasis | the Lux white hairline | `Stroke Width/Hairline` | the Lux hue |
| Loyalty, Studio | the on-CTA pair | **none** — zero alpha | n/a | the Loyalty / Studio hue |

So a user switching to Lux, Loyalty or Studio sees that theme's normal selected
segment, with no trace of the brand. Switching back restores it.

**The stroke width is a token too**,
`Component/Bottom_Navigation/Stroke_Width/Selected`, because it has to follow the
mode and `Numbers` has only one. It is the one non-colour variable in the
`Colours` collection.

**Focus overrides the brand stroke.** `State = Focused` replaces it with
`Stroke/Focus/Default` at `Stroke Width/Bold`, in every brand and every mode.

### The dark themes select with the selection-control colour

In Loyalty and Studio the selected segment is not a neutral surface. It takes the
**selection-control colour** — the same value that fills a checked Checkbox, a
selected Radio Button, a Check Circle and a Filled Button — so the selection
reads as a filled control against the dark belt rather than as a slightly lighter
patch of it.

That changes what the label and icon on it must be. On that fill they take the
**on-CTA** pair, exactly as a Filled Button's label does:

| Token | Platform, Product, Lux | Loyalty, Studio |
|---|---|---|
| `Component/Bottom_Navigation/Segment/Surface/Selected` | `Surface/Neutral/Low_Contrast/Surface_2/Default` | `Component/Selection_Control/Icon/Selected/Default` |
| `Component/Bottom_Navigation/Label/Selected` | `Text/Neutral/On_Low_Contrast/High_Emphasis/Default` | `Component/Button/Filled/Text/Default` |
| `Component/Bottom_Navigation/Icon/Selected` | `Icon/On_Neutral/Low_Contrast/High_Emphasis/Default` | `Component/Button/Filled/Icon/Default` |

**The label and the icon are always the same colour as each other**, in every
mode and both selections. Bind them as one value in code.

**The three move together.** The fill is a strong accent, so the neutral
high-emphasis label that works on a neutral surface is unreadable on it — white
on Loyalty's gold is 2.2:1. Changing the fill without the label, or the other way
round, breaks the contrast in one step.

Nothing in the component branches on any of this. The three tokens resolve
differently in the two dark modes and the component is identical in all five.

**A second effect, worth knowing:** in the light themes the selected fill is a
quiet neutral that does not reach 3:1 against the belt, so selection leans on the
label weight and colour. In the dark themes the accent fill clears 3:1 on its own,
so selection is carried twice over.

**The overlay tokens carry their alpha in the value.** In code use the token as
it is. In Figma the paint opacity repeats it.

### The hairline is Lux-only, and it is the token that does it

`Component/Bottom_Navigation/Stroke/Default` resolves to the Lux white in the
`Lux` mode and to a **zero-alpha** value in Platform, Product, Loyalty and
Studio. The stroke is therefore present on the node in every mode and invisible
in four of them.

This is deliberate. The alternative — adding the stroke only in Lux — changes
the rendered geometry between themes wherever a stroke participates in layout.
Binding a transparent value keeps one component, one geometry, no branch.

### Elevation is Lux-only, and it is not a token

Effects are Figma styles, not variables, and they do not follow the mode
(`Colour.md` §9). **Apply them only when the mode is `Lux`:**

| Node | Effect style | Drop shadow | Inner shadow |
|---|---|---|---|
| `Bottom Navigation` | `Lux/Surface/Surface 1` | x 1, y 1, blur 5, spread 0, `#746545 @10%` | — |
| Selected segment | `Lux/Surface/Surface 2` | x 3, y 3, blur 9, spread 0, `#181818 @10%` | x 3, y 3, blur 9, spread 0, `#FFFFFF @25%` |

No other mode draws a shadow on this component, and no other theme may use a
`Lux/*` effect style.

Web:

```css
/* Lux only */
.nav-belt          { box-shadow: 1px 1px 5px rgba(116,101,69,.10); }
.nav-segment.is-selected {
  box-shadow: 3px 3px 9px rgba(24,24,24,.10),
              inset 3px 3px 9px rgba(255,255,255,.25);
}
```

Flutter — the outer shadows are `BoxShadow`; the inner highlight has no Flutter
equivalent and needs an `innerShadow`-style painter or a package:

```dart
// Lux only
const beltShadow = BoxShadow(
  color: Color(0x1A746545), offset: Offset(1, 1), blurRadius: 5);
const segmentShadow = BoxShadow(
  color: Color(0x1A181818), offset: Offset(3, 3), blurRadius: 9);
// plus an inner shadow: offset (3,3), blur 9, Color(0x40FFFFFF)
```

## Accessibility

| Field | Value |
|---|---|
| Role, the belt | `tablist`. |
| Role, each segment | `tab`, owning the control group it reveals. |
| Role, the controls below | `tabpanel`, labelled by its segment. |
| Label | The segment's own text. The icon is decorative and must be hidden from assistive technology, because the label already names the group. A segment with `Has Icon = false` reads identically. |
| State strings | Selected announces as selected. Disabled announces as disabled. A visible badge must be announced too — see Open questions. |
| Focus order | One stop for the whole belt. Arrow keys move between segments; Tab leaves the belt. |
| Touch target | At least 48 high — bound to `Size/Touch_Target` — and at least 82 wide, so it clears 48 × 48 with or without the icon, and needs no separate a11y frame. |
| Colour alone | Selection is carried by the fill, the label weight, the label colour and the icon colour together, so it survives when colour does not. |
| Scrolling | Moving the selection with the keyboard must scroll the new segment into view by the same centring rule as a tap. |

**In the light themes the selected fill alone is too quiet to be the cue** — it
does not reach 3:1 against the belt in Platform, Product or Lux. That is
acceptable only because the label weight and colour change at the same time. In
Loyalty and Studio the accent fill does clear 3:1 on its own. Either way, do not
build a variant that drops the label.

### Where it can ship

Labels and icons take 4.5:1; the focus ring is a non-text cue and takes 3:1. The
icon token always equals the label token, so icons score exactly as labels do.
Measured with the belt over the canvas, `Low_Contrast/Surface_2` and
`Surface_3` — its permitted grounds — worst case.

| Mode | Label, selected | Label, unselected | Selected stroke | Focus ring | Badge, on the belt | Badge, on the selected segment |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lux | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Loyalty | ✅ | ✅ | n/a | ❌ | ✅ | ❌ |
| Studio | ✅ | ✅ | n/a | ❌ | ✅ | ❌ |

**The selected label passes in all five brands**, measured on the selected fill.
Havells is the tightest at just under 5:1 in Platform and Product; the other four
have more headroom. The brand strokes all clear the 3:1 non-text floor against
the belt, Standard Blue the tightest.

The selected stroke is `n/a` in Loyalty and Studio because there is no stroke
there, by design — the fill carries the selection instead, and it clears 3:1 on
its own in both.

**Text and icons pass in every mode.** Two things make that true and both are
load-bearing: the belt scrim is dark in the dark themes, and those themes select
with the selection-control colour and take the on-CTA label. Revert either and
the dark themes fail.

**Do not ship a ❌ cell.** The focus ring failure is not this component's: it is
`Stroke/Focus/Default`, the same token and the same failure already recorded on
Button, Header, Tabs and every selection control. Bottom Navigation does not set
it, and one value change clears it everywhere at once.

It is worse here than elsewhere for a specific reason: in Loyalty and Studio the
focus ring and the selected segment now resolve to **neighbouring steps of the
same ramp** — a `Loyalty Primary/Base` ring on a `Loyalty Primary/500` fill is
1.03:1, and Studio's gold-on-gold is 1.76:1. A focused selected segment is
effectively unmarked in the dark themes. The ring is fine on the belt in the
light themes and on the unselected segments.

**On a touch-only build the focus ring never renders, so the component is clear
in all five modes.** The ❌ cells matter only where a keyboard or a pointer is
attached.

**`Surface_1` is excluded on purpose.** On that ground the unselected label falls
to just under 4.5:1 in Loyalty and Studio. It is a placement rule, not a token
failure, which is why it is stated in Tokens rather than shown as a ❌ here.

### Implementation

Web:

```html
<div role="tablist" aria-label="Controls" class="nav-belt">
  <button role="tab" aria-selected="true"  aria-controls="p1" id="s1">
    <svg aria-hidden="true">…</svg><span>Control</span>
  </button>
  <button role="tab" aria-selected="false" aria-controls="p2" id="s2" tabindex="-1">
    <svg aria-hidden="true">…</svg><span>Timer</span>
  </button>
</div>
<div role="tabpanel" id="p1" aria-labelledby="s1">…</div>
```

```css
.nav-belt { display: flex; overflow-x: auto; scrollbar-width: none;
            border-radius: 9999px; background: var(--component-bottom-navigation-surface-default);
            border: .2px solid var(--component-bottom-navigation-stroke-default); }
[role="tab"] { flex: 0 0 auto; min-inline-size: 82px; block-size: 55px;
               display: flex; flex-direction: column; align-items: center; justify-content: center;
               gap: 4px; padding: 8px 16px; border: 0; background: none;
               border-radius: 9999px; color: var(--component-bottom-navigation-label-unselected); }
[role="tab"][aria-selected="true"] { padding-inline: 32px; font-weight: 600;
               color: var(--component-bottom-navigation-label-selected);
               background: var(--component-bottom-navigation-segment-surface-selected);
               border: .2px solid var(--component-bottom-navigation-stroke-default); }
[role="tab"]:hover  { background: var(--component-bottom-navigation-overlay-hover); }
[role="tab"]:active { background: var(--component-bottom-navigation-overlay-pressed); }
[role="tab"]:focus-visible { outline: 2px solid var(--stroke-focus-default); outline-offset: -2px; }
[role="tab"]:disabled { opacity: .5; }
```

Only the selected segment is in the tab order. Arrow keys move the selection.
Centring on selection:

```js
tab.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
```

`inline: 'center'` already clamps at both ends, so it implements the rule above
without any arithmetic. Use `behavior: 'auto'` on first paint.

Flutter:

```dart
TabBar(
  isScrollable: true,                 // Segments 2-3 -> false
  tabAlignment: TabAlignment.start,
  indicator: const BoxDecoration(),   // no indicator; the selected segment has a fill
  dividerColor: Colors.transparent,
  labelColor: HvColors.componentBottomNavigationLabelSelected,
  unselectedLabelColor: HvColors.componentBottomNavigationLabelUnselected,
  labelStyle: HvText.l4Strong(10),
  unselectedLabelStyle: HvText.l4(10),
  overlayColor: WidgetStateProperty.resolveWith((s) =>
      s.contains(WidgetState.pressed) ? HvColors.componentBottomNavigationOverlayPressed
    : s.contains(WidgetState.hovered) ? HvColors.componentBottomNavigationOverlayHover
    : null),
  tabs: const [
    Tab(height: 55, icon: Icon(Icons.tune), text: 'Control'),
    Tab(height: 55, icon: Icon(Icons.alarm), text: 'Timer'),
  ],
)
```

`TabBar` scrolls the selected tab towards the centre and clamps at both ends on
its own, which matches the rule. The selected segment's pill fill is not a
`TabBar` indicator — build it in the `Tab`, or use a custom row, because an
`indicator` is painted behind the label and cannot take the segment's padding
change.

## Haptics

| Event | Fires |
|---|---|
| Selecting a segment | none |
| Tapping the already-selected segment | none |
| Tapping a disabled segment | none |
| Reaching either end of the scroll | none |

The belt changes which controls are shown; it does not command the device, so
nothing has happened that needs confirming. The haptics map in
`_FOUNDATIONS.md` §5 is proposed and unsigned, and nothing here fires until it is
signed off.

## Content

- A segment label is **one word**, in sentence case. It names a group of
  controls — Control, Timer, Schedule, Energy — not an action.
- Keep labels short enough that a segment stays near its 82 minimum. At 10px a
  label has roughly 9 characters before the segment starts growing and pushing
  its neighbours out of view.
- Labels do not wrap and are not truncated by the component. If a label does not
  fit, shorten it.
- **Every segment has a label. The icon is optional and decorative.** Turn it off
  with `Has Icon = false`. There is no icon-only form — the label always carries
  the meaning, which is why dropping the icon costs nothing for assistive
  technology.
- **Use the icon consistently across one belt.** Either every segment has one or
  none does; a mixed row gives segments of two different heights.
- Do not number the segments. If the order matters that much, it is a stepper.
- The badge is a state marker, not a count. It has no number inside it.

## Do

- Float the belt near the bottom of a device control screen, over the canvas or a
  neutral Low Contrast surface.
- Keep exactly one segment selected at every moment, including on first paint.
- Scroll the selected segment to the centre on selection, clamped at both ends,
  and jump without animation on first paint.
- Set the label, icon, badge, selection and state on the nested
  `.Bottom_Nav_Segment` instance, not on the belt.
- Apply `Lux/Surface/Surface 1` and `Lux/Surface/Surface 2` when, and only when,
  the mode is Lux.
- Let the row scroll when the labels stop fitting, rather than shortening a label
  past the point where it says anything.

## Don't

- Don't set `Theme` on the belt or on a segment. Theme is a `Colours` mode in
  v1.3 and the property no longer exists on this component.
- Don't instance any of the v1.2 predecessors on the same page. They carry a
  `Theme` variant and `_deprecated/*` bindings and are superseded by this set:
  `.Segment` `18649:6094`, `.Bottom Navigation Segments` `18649:6174`,
  `.Bottom navigation horizontal list` `18649:6125` and
  `Bottom Navigation Belt` `18649:6203`. The Lux study in the
  `For Cluade reference` section — `.Segment` `40000813:37862` and
  `Lux/Navigation belt` `40000813:37872` — is a reference, not a component to
  instance.
- Don't put the belt over a photograph, a brand surface or a status surface. Its
  surface is translucent and the label contrast is only specified over the canvas
  and neutral Low Contrast surfaces.
- Don't give a segment a shadow in any mode except Lux, and don't give the belt
  one in Lux's place — the two effect styles are different and not
  interchangeable.
- Don't place the belt over `Low_Contrast/Surface_1`. The unselected label falls
  under 4.5:1 there in the dark themes.
- Don't put a timer badge on a selected segment in Loyalty or Studio. The badge
  is one token for both selections and it disappears on the selected fill there.
- Don't mix brands inside one belt. Every segment carries the product's brand.
- Don't set a brand expecting it to show in Lux, Loyalty or Studio. It is removed
  there, not recoloured, and that is deliberate.
- Don't give any other component a brand axis on the strength of this one. The
  general question is still open in `foundations/Colour.md` §12.
- Don't give Loyalty or Studio a neutral selected fill. They select with the
  selection-control colour, and their label and icon are the on-CTA pair because
  of it — changing one without the other breaks the contrast in a single step.
- Don't scroll a left-end selection into the centre. The clamp exists so the
  first segments stay where they are.
- Don't drop the label to save width. Selection would then rest on the fill
  alone, which does not reach 3:1 in any mode.
- Don't use more than seven segments, or fewer than two.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-30 | `Stroke/Focus/Default` misses 3:1 on the belt in Loyalty and Studio. Inherited — the same token fails the same way on Button, Header, Tabs and every selection control. Retune it, or accept the ❌ on keyboard and pointer builds? | design owner |
| 2026-09-30 | **New, and specific to this component.** Now that the dark themes select with the selection-control colour, the focus ring and the selected fill resolve to neighbouring steps of one ramp — 1.03:1 in Loyalty, 1.76:1 in Studio — so a focused *selected* segment has no visible ring. Retuning `Stroke/Focus/Default` does not necessarily fix this, because the two tokens track each other. Does the focused selected segment need a different ring colour, an offset ring drawn outside, or is this accepted on touch-first products? | design owner |
| 2026-09-30 | **The badge fails on an unselected segment in Loyalty.** `Component/Bottom_Navigation/Badge/Default` now follows the selected icon in Loyalty, which is correct on the gold selected segment but leaves a dark dot on the dark belt at 1.93:1 when the segment is unselected. The badge can appear on any segment. Does it need a selected and an unselected value, like the label and icon already have? | design owner |
| 2026-09-30 | Brand is a component variant here, which `foundations/Colour.md` §12 still records as undecided system-wide. Does this ruling settle the general question, or is Bottom Navigation a deliberate exception? | design owner |
| 2026-09-30 | **The badge is invisible on a selected segment in the dark themes.** It is one token for both selections, so the value that makes it legible on the belt fails on the selected fill: white on Loyalty's gold is 2.17:1, and in Studio the badge and the selected fill resolve to the *same* primitive, `Gold/350`, giving 1.00:1. Split it into `Badge/Selected` and `Badge/Unselected`, mirroring the label and icon pair? | design owner |
| 2026-09-30 | The Lux shadow is applied as a mode branch, because effect styles do not follow the mode. Binding the effect colour to a mode-aware token with zero alpha outside Lux would remove the branch, the way the hairline already does. Adopt that, or keep effects as styles per `Colour.md` §9? | design owner |
| 2026-09-30 | The badge colour. The v1.2 predecessor used the brand red; the Lux study used a muted low-emphasis tone. This file binds the CTA colour of the mode. Which is right? | design owner |
| 2026-09-30 | The badge carries no label, shape or number, so it says "something is running here" by colour alone. What must a screen reader announce when it is visible, and does it need a non-colour cue? | design owner |
| 2026-09-30 | No motion is specified for the scroll. Both platforms have a sensible default and the file says "animate", which is not a duration or a curve. Specify them, or state that the platform default is accepted? | design owner |
| 2026-09-30 | Seven segments is the cap because the variant set stops there. Is seven a real product limit, or should the belt take any number and simply scroll? | design owner |
| 2026-09-30 | The four v1.2 predecessors are still published. Mark them `[DEPRECATED]` in Figma, or delete them once the app no longer instances them? | design owner |
| 2026-09-25 | The Pending to Failed timeout in `_FOUNDATIONS.md` §2. Inherited, not specific to this component. | design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-30 | Owner rulings: **`Standard`'s neutral overlay is accepted** rather than adding an `Opacity/Blue` ramp to the primitive library. **The badge in Loyalty now aliases `Icon/On_Neutral/Low_Contrast/High_Emphasis/Default`** and reads white, which clears it against the belt where the previous dark value did not. Known limit recorded: the badge is still a single token for both selections, so it fails on the selected segment in Loyalty and Studio. |
| 2026-09-30 | Owner change: **the icon is optional** — a `Has Icon` boolean, default true — and the segment's minimum height is bound to `Size/Touch_Target`, so a label-only segment still clears 48. **The label moved from 10 to 12**: `Label/L3 Strong (12) -` selected and `Label/L3 (12) -` unselected, replacing the L4 pair. **No frame in the belt holds a fixed height any more**: the segment, row, viewport and belt all hug, so the belt is 57 with icons and 48 without. The previous fixed 55 predated the 12 label and clipped the content by 2dp. |
| 2026-09-30 | Owner corrections to the brand axis. **The hover and pressed overlays follow the brand family** — Crabtree tints green, Lloyd violet — so 10 `Brand/<Brand>/Overlay/Hover\|Pressed` tokens were added and the state layers rebound; brand now reaches unselected segments through the overlay. **`Havells` follows the platform CTA like Button**: red in Platform, black in Product, rather than red in both. `Opacity/Violet/*` and `Opacity/Green/*` were imported from the primitive library, where they existed but had never been pulled into this file. `Standard` has no blue overlay because the library has no `Opacity/Blue` ramp; a neutral tint stands in. |
| 2026-09-30 | Owner ruling: **the selected segment gains a `Brand` axis** — Havells, Lloyd, Crabtree, Standard, Product — taking the segment set from 10 variants to 50. The brand carries the selected stroke and the selected label and icon, in Platform and Product only; Lux, Loyalty and Studio replace it with their own treatment. 15 `Component/Bottom_Navigation/Brand/*` tokens added, plus `Stroke_Width/Selected`, the first non-colour variable in the `Colours` collection, because the stroke width is Regular in Platform and Product and Hairline elsewhere. This is the only component in the library with a brand axis. |
| 2026-09-30 | Owner ruling extended to Loyalty: **both dark themes now select with the selection-control colour**, the value a checked Checkbox, a Radio Button and a Filled Button share, and their selected label and icon are the on-CTA pair. The selected fill now clears 3:1 against the belt on its own in those two modes. Known consequence: the focus ring and the selected fill are neighbouring steps of one ramp there, so a focused selected segment has no visible ring. |
| 2026-09-30 | Owner ruling: **Studio selects with the CTA fill**, matching the legacy Studio belt, and its selected label and icon became the on-CTA pair. The belt scrim became **dark in Loyalty and Studio** and stays light in the three light themes; both scrims are 50%, so the paint opacity is still uniform. Together these cleared the unselected label in both dark themes, taking the component from Ready in three modes to Ready in five for text and icons. Placement narrowed: not over `Low_Contrast/Surface_1`. |
| 2026-09-30 | First handover. Rebuilt for v1.3. `Theme` removed as a variant — it was 7 values on the segment and 3 on the belt — and is now a `Colours` mode, taking the segment set from a Theme × State matrix to 10 variants and the belt to 6. Every `_deprecated/*` and remote v1.2 binding replaced; 10 `Component/Bottom_Navigation/*` tokens added. The interaction axis gained `Hover`, `Pressed`, `Focused` and `Disabled`, which did not exist before. Content form fixed as icon above label at 55 high, replacing the 48 label-only and 50 Lux label-only forms. The hairline moved to a token that is zero-alpha outside Lux so the geometry no longer changes with the theme. Horizontal scroll with centre-on-selection specified. |
