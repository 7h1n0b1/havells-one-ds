# Day Picker

| | |
|---|---|
| **Status** | Ready in all five modes for the day letters. The selected chip misses 3:1 as a standalone cue in Loyalty on `Low_Contrast/Surface_1`, and the **weekend tint is invisible in Loyalty and Studio** — see **Where it can ship**. The keyboard focus ring inherits the system-wide `Stroke/Focus/Default` failure in the dark themes. |
| **Figma** | `Day Picker` · set `7765:533` · key `52a588d67a117e96b3ca0d6eee29253d0d599686` · page `Day Picker` `6659:11270` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-30 |

Read `../_FOUNDATIONS.md` first. Token values live in `../foundations/Colour.md`,
sizes in `../foundations/Numbers.md`, text styles in `../foundations/Typography.md`.

## What it is

A row of seven single-letter day chips. The user taps days to choose which ones a
schedule runs on. Any number may be selected, including none.

## When to use

- Setting which days a device repeats an action on — a timer, a schedule, an
  automation.
- The choice is genuinely per-day and the user may pick any combination.
- The row sits inside a form or a sheet, at full content width.

## When not to use

- The user is picking a calendar date. That is Date Picker.
- Exactly one option may be chosen and the options are not days. That is a Radio
  Button group, or Tabs if it switches a view.
- The days are a read-only summary of a schedule. Render them as text; a Day
  Picker implies they are tappable.
- More than a week, or a date range. Day Picker has exactly seven chips and no
  concept of a date.

## Anatomy

```
Day Picker                  the row: seven chips, equal share
└── .Day_Picker_Unit × 7    one per day, Sunday first
```

One unit:

```
Unit                        48 × 48, the touch target; no fill
└── State layer             40 circle, carries the hover and pressed overlay
    └── Day chip            32 circle, filled when Selected = Yes
        └── Day             one letter
```

**The 48 frame is the touch target and the focus ring's home.** The visible
circle stays 32; the frame around it is transparent. This is the pattern
`Numbers.md` §7 describes — the invisible padding is never typed, it falls out of
the two sizes.

### Layout, frame by frame

| Frame | Direction | Width | Height | Alignment | Padding | Gap | Corner radius |
|---|---|---|---|---|---|---|---|
| `Day Picker` | row | fill | hug | left, centre | `Space/Number-12` left and right, `Space/Zero` top and bottom | `Space/Zero` | — |
| `Unit` | row | fill, min `Size/Touch_Target` | fixed `Size/Touch_Target` | centred | `Space/Zero` | `Space/Zero` | `Corner Radius/Zero`, or `Circular` when focused |
| `State layer` | row | 40 fixed | 40 fixed | centred | `Space/Zero` | `Space/Zero` | `Corner Radius/Circular` |
| `Day chip` | row | 32 fixed | 32 fixed | centred | `Space/Zero` | `Space/Zero` | `Corner Radius/Circular` |
| `Day` | — | hug | hug | centred | — | — | — |

**Why the side padding is 12 and not `Space/Medium`.** Seven 48 targets need 336.
At the narrowest supported width, 360, that leaves 24 for padding — 12 a side.
`Space/Medium` would leave each target at 46.9 and break the 48 minimum. The
padding is the thing that gives, not the target.

`Space/Number-12` is in the `Space/Number-*` family that `Numbers.md` marks
legacy, with an open question about whether new work may use it. Day Picker is
the second component to depend on that answer, after Tabs.

### Text style

| Part | Style | Flutter token |
|---|---|---|
| Day letter, every state | `Label/L3 (12) -` | `L3(12)` |

One style throughout. Selection changes the colour, never the weight or the size,
so no chip changes width when it is selected.

### Geometry — generated from Figma, 2026-09-30

| Part | Size |
|---|---|
| Row | fill × 48 |
| Row side padding | 12 |
| Unit, at 360 wide | 48 × 48 |
| State layer | 40 × 40 |
| Day chip | 32 × 32 |
| Focus ring | 2, inside the 48 frame |

Token values: `Size/Touch_Target` 48 · `Space/Number-12` 12 · `Space/Zero` 0 ·
`Corner Radius/Circular` 9999 · `Corner Radius/Zero` 0 · `Stroke Width/Bold` 2.

The 40 and 32 are not tokenised — there is no size token for either, and the same
is true of the Selection Control state layers. Treat them as fixed geometry.

## Properties

The row:

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Type` | Variant | `Default` | `Default` | One form. The axis exists only because a Figma component set must have a variant property. |

One variant. Selection is set on each nested unit, not on the row.

One unit — `.Day_Picker_Unit`, set `6659:11247`,
key `4ab4559e5a63dc77d11a8fafebef9c27573fb2d8`:

| Property | Type | Values | Default |
|---|---|---|---|
| `Selected` | Variant | `Yes`, `No` | `Yes` |
| `State` | Variant | `Enabled`, `Hover`, `Pressed`, `Focused`, `Disabled` | `Enabled` |
| `Day` | Variant | `Other`, `Weekend` | `Other` |
| `Label` | Text | any single letter | `S` |

**20 variants.**

`Day = Weekend` tints the letter when the chip is unselected. It changes nothing
when `Selected = Yes` — the fill and the on-CTA letter win — so the two selected
variants of a state are identical, and the axis exists across them so every
combination resolves.

## States

| State | What changes, relative to Enabled |
|---|---|
| `Hover` | `State layer` fills `Component/Day_Picker/Overlay/Hover` at 10%. Pointer platforms only. |
| `Pressed` | `State layer` fills `Component/Day_Picker/Overlay/Pressed` at 5%. |
| `Focused` | The 48 frame gains `Stroke/Focus/Default` at `Stroke Width/Bold`, drawn inside, with a circular radius. No overlay. |
| `Disabled` | The whole unit drops to 50% opacity. There is no disabled token. |

**Hover is stronger than Pressed** — 10% against 5%, the standing rule for
controls whose surface is transparent.

**The focus ring is on the 48 frame, not the chip**, so it never fights the
circle's own edge and never changes the chip's size.

**Nothing in the unit changes size with `State`.** Geometry depends on nothing at
all — every variant is 48 × 48.

## Behaviour

- **Tap toggles that day.** Days are independent; this is a checkbox group in
  behaviour, not a radio group.
- **Any number may be selected, including none.** There is no "at least one" rule
  in the component. If a screen needs one, the screen enforces it and says so.
- **The row is always seven chips**, Sunday first. It does not reorder for locale
  and does not scroll.
- **The row fills its container's width** and the chips share it equally, so the
  chips are wider than 48 on a wider screen and the circle stays 32 in the middle
  of each.
- **What never happens:** the row does not wrap, does not change height, does not
  collapse to fewer chips, and has no motion specified.

## Tokens

| Part | Token |
|---|---|
| Day chip, selected | `Component/Day_Picker/Surface/Selected` |
| Day letter, unselected | `Component/Day_Picker/Label/Default` |
| Day letter, selected | `Component/Day_Picker/Label/Selected` |
| Day letter, weekend and unselected | `Component/Day_Picker/Label/Weekend` |
| State layer, `Hover` | `Component/Day_Picker/Overlay/Hover`, paint opacity 10% |
| State layer, `Pressed` | `Component/Day_Picker/Overlay/Pressed`, paint opacity 5% |
| Focus ring | `Stroke/Focus/Default`, width `Stroke Width/Bold`, inside the 48 frame |

The row itself has no fill. An unselected chip has no fill either, so whatever is
behind the row shows through both.

`Component/Day_Picker/Surface/Selected` aliases the selection-control colour —
the same value a checked Checkbox, a selected Radio Button and a Filled Button
use. `Component/Day_Picker/Label/Selected` is the matching on-CTA text, so the
pair is the one already proven on Button.

**The overlay tokens carry their alpha in the value.** In code use the token as
it is. In Figma the paint opacity repeats it.

## Accessibility

| Field | Value |
|---|---|
| Role, the row | `group`, labelled with what the days control — "Repeat on". |
| Role, each unit | `checkbox`, because days toggle independently. |
| Label | The full day name, not the letter. "Monday", never "M". |
| State strings | Checked announces as selected. Disabled announces as disabled. |
| Focus order | Each day is its own stop, Sunday to Saturday. |
| Touch target | 48 × 48 on every unit, bound to `Size/Touch_Target`. |
| Colour alone | **Selection** is carried by the fill and the letter colour together. **Weekend is carried by colour alone** — see below. |

**The letter is not the accessible name.** Seven chips reading "S M T W T F S"
give a screen reader two identical "S" and two identical "T". Every unit needs
its full day name supplied.

### Where it can ship

Text takes 4.5:1; the chip and the focus ring are non-text cues and take 3:1.

| Mode | Letter, unselected | Letter, selected | Selected chip vs the page | Weekend tint |
|---|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ |
| Lux | ✅ | ✅ | ✅ | ❌ |
| Loyalty | ✅ | ✅ | ❌ on `Surface_1` | ❌ |
| Studio | ✅ | ✅ | ✅ | ❌ |

**Every letter passes 4.5:1 in every mode**, selected and unselected, on the
canvas and on all three Low Contrast surfaces.

**The weekend tint is not a reliable cue.** Measured against the normal letter it
is 3.60:1 in Platform and Product, 2.47:1 in Lux, and **1.19:1 in Loyalty and
Studio** — indistinguishable. It is also colour alone, which WCAG does not allow
as the only carrier of meaning. Do not rely on it to tell the user which days are
the weekend; if that distinction matters, the screen must carry it another way.
See Open questions.

**The selected chip misses 3:1 against `Low_Contrast/Surface_1` in Loyalty.** The
letter colour changes at the same time, so selection is still carried, but the
chip alone is too quiet there. Place the row on the canvas, `Surface_2` or
`Surface_3` in Loyalty.

### Implementation

Web:

```html
<fieldset class="day-picker">
  <legend>Repeat on</legend>
  <label><input type="checkbox" name="day" value="0"><span aria-hidden="true">S</span><span class="sr-only">Sunday</span></label>
  <label><input type="checkbox" name="day" value="1"><span aria-hidden="true">M</span><span class="sr-only">Monday</span></label>
</fieldset>
```

```css
.day-picker { display: flex; padding-inline: 12px; }
.day-picker label { flex: 1 1 0; min-inline-size: 48px; block-size: 48px;
                    display: grid; place-items: center; }
.day-picker span[aria-hidden] { inline-size: 32px; block-size: 32px; border-radius: 9999px;
                    display: grid; place-items: center; font-size: 12px;
                    color: var(--component-day-picker-label-default); }
input:checked + span[aria-hidden] { background: var(--component-day-picker-surface-selected);
                    color: var(--component-day-picker-label-selected); }
label:hover  span[aria-hidden] { box-shadow: 0 0 0 4px var(--component-day-picker-overlay-hover); }
label:active span[aria-hidden] { box-shadow: 0 0 0 4px var(--component-day-picker-overlay-pressed); }
input:focus-visible + span[aria-hidden] { outline: 2px solid var(--stroke-focus-default); outline-offset: 6px; }
input:disabled + span[aria-hidden] { opacity: .5; }
```

The checkbox input itself is visually hidden; the 48 target is the `label`.

Flutter:

```dart
Row(
  children: List.generate(7, (i) => Expanded(
    child: InkWell(
      customBorder: const CircleBorder(),
      onTap: () => toggle(i),
      child: SizedBox(
        height: 48,                                   // Size/Touch_Target
        child: Center(
          child: Container(
            width: 32, height: 32,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: selected[i] ? HvColors.componentDayPickerSurfaceSelected : null),
            child: Center(child: Text(letters[i],
              style: HvText.l3(12).copyWith(
                color: selected[i]  ? HvColors.componentDayPickerLabelSelected
                     : isWeekend(i) ? HvColors.componentDayPickerLabelWeekend
                     :                HvColors.componentDayPickerLabelDefault)))),
        ),
      ),
    ),
  )),
)
```

Wrap each `InkWell` in a `Semantics(label: fullDayName[i], checked: selected[i])`
so the letter is not what gets read.

## Haptics

| Event | Fires |
|---|---|
| Selecting or clearing a day | Selection changed — `CLOCK_TICK` on Android, `UISelectionFeedbackGenerator` on iOS |
| Tapping a disabled day | none |

This is the one place in the component where something is committed, and it is a
selection rather than a device command, so it fires on the tap. The haptics map
in `_FOUNDATIONS.md` §5 is proposed and unsigned; nothing ships against it until
it is signed off.

## Content

- **One letter per day**, uppercase, in the user's locale. English is
  S M T W T F S.
- **The letters are decoration.** The accessible name is always the full day.
- Do not abbreviate to two or three letters. The chip is 32 wide and a longer
  string will not fit; it is a fixed circle, not a hugging pill.
- Do not put numbers, dates or counts in a day chip. It marks a weekday, not a
  date — that is Date Picker.

## Do

- Give every unit its full day name for assistive technology.
- Let the row fill its container and the chips share the width equally.
- Keep Sunday first and all seven present, even when some are disabled.
- Set selection on the nested unit, not on the row.
- Place the row on the canvas, `Surface_2` or `Surface_3` in Loyalty, where the
  selected chip has enough contrast.

## Don't

- Don't use the weekend tint as the only way a user can tell weekends apart. It
  is invisible in Loyalty and Studio and is colour alone everywhere.
- Don't set `Theme` on the row or a unit. Theme is a `Colours` mode in v1.3 and
  the property no longer exists.
- Don't shrink the unit below 48, or restore `Space/Medium` side padding — at 360
  that drops every tap target under the minimum.
- Don't use Day Picker to choose a date, a range, or a single day out of seven
  where only one may be picked.
- Don't change the letter's weight or size on selection. The chip would change
  width and the row would shift.
- Don't add an eighth chip, a "weekdays" shortcut chip, or a select-all. None is
  specified.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-30 | **Is "weekend in the brand accent" a rule at all?** It was `Day = Sunday` in v1.2 and is kept here as `Day = Weekend`, but it is colour alone and measures 1.19:1 against a normal letter in Loyalty and Studio. Drop the axis, give weekends a non-colour cue, or retune the token? | design owner |
| 2026-09-30 | The v1.2 set marked **Sunday only**; this rebuild marks Sunday and Saturday as `Weekend`. Which is intended? | design owner |
| 2026-09-30 | The selected chip misses 3:1 against `Low_Contrast/Surface_1` in Loyalty. Same `Component/Selection_Control/Icon/Selected/Default` failure already recorded on Checkbox, Radio Button and Check Circle. | design owner |
| 2026-09-30 | `Space/Number-12` is in the family `Numbers.md` marks legacy, with an open question about new work using it. The 48 tap target at 360 wide depends on it. | design owner |
| 2026-09-30 | No minimum or maximum selection is specified. May a user clear every day, and what does the screen do if they do? | design owner |
| 2026-09-25 | The Pending to Failed timeout in `_FOUNDATIONS.md` §2. Inherited, not specific to this component. | design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-30 | First handover. Rebuilt for v1.3 in place, so both keys survive. `Theme` removed as a variant — 5 values on the row and 5 on the unit — and is now a `Colours` mode, taking the unit from 15 variants to 20 and the row from 5 to 1. A junk `Theme5` variant on the row and `Theme4` elsewhere on the page are gone. The interaction axis gained `Hover`, `Pressed`, `Focused` and `Disabled`, none of which existed. The unit grew a 48 × 48 touch target around the 32 circle, which it did not have, and the row's side padding dropped to 12 so seven targets fit at 360. `Day = Sunday` became `Day = Weekend` and the missing `Selected = Yes` weekend variants were added, completing the matrix. Eleven `_deprecated/*` bindings replaced by six `Component/Day_Picker/*` tokens. |
