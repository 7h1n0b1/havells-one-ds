# Read-only List_Item

| | |
|---|---|
| **Status** | **Ready** in `Platform`, `Product` and `Studio` on every surface; **Loyalty** on Canvas, `Low_Contrast/Surface_2` and `Surface_3`; **Lux** blocked. See Accessibility |
| **Figma** | `Read-only List_Item` · set `40000602:10098` · page `Lists` `4258:8723` |
| **Platforms** | Flutter, Web |
| **Last updated** | 2026-09-29 |

Read `../_FOUNDATIONS.md` first.

## What it is

A row that states a fact. Nothing about it is tappable. No hover, no press, no
focus, no disabled — a row nobody can act on cannot be in a disabled state
either.

## When to use

- Property lists — spec sheets, device info, "about" screens, account details.
- Detail rows on a card or bottom sheet where the caller has already put the
  actions elsewhere.
- Table-like layouts where the row is one field of a record.

## When not to use

- The row navigates or fires an action — that is an **Action List_Item**.
- The row toggles a setting or selects itself — that is a **Switch** or
  **Selection List_Item**.
- The row carries a status that needs a Tag visual — see Open questions
  (Tag doesn't exist yet).

## Anatomy

```
Read-only List_Item     outer frame, hug × hug
├── State layer         no fill, no overlay
│   ├── Leading         optional icon (24) or media (40 slot)
│   ├── Content         Overline · Title · Supporting text
│   └── Trailing        None or Value (right-aligned text)
└── Divider             1 dp LINE, fills row width, flush against State layer, optional
```

**The divider is a `LINE` node**, not a rectangle or bordered frame. It sits
as a sibling of `State layer` inside the outer VERTICAL auto-layout with
`gap = 0` and `padding = 0`.

`State layer` is present as a structural layer so the row's frame stack
matches the other List_Item components — it just never fills.

### Layout, frame by frame

| Frame | Direction | Width | Height | Padding | Gap | Fill at rest |
|---|---|---|---|---|---|---|
| `Read-only List_Item` | col | fill | hug, min `Size/Touch_Target` | `Space/Zero` | `Space/Zero` | none |
| `State layer` | row | fill | hug | `Space/Small` vertical, `Space/Medium` horizontal | `Space/Medium` | none, **always** |
| `Leading` | row | hug | hug | `Space/Zero` | `Space/Zero` | none |
| `Content` | col | fill | hug | `Space/Zero` | `Space/XXS` | none |
| `Trailing` | row | hug | hug | `Space/Zero` | `Space/Small` | none |
| `Divider` | LINE | fill | `Stroke Width/Regular` | — | — | stroke `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default`, weight `Stroke Width/Regular`, stroke align CENTER, visibility toggled by the `Divider` boolean |

Row height is content-driven, with a `Size/Touch_Target` floor kept for
optical consistency with tappable rows on the same screen.

### Geometry — generated from Figma, 2026-09-29

| Case | Height |
|---|---|
| Title only | 48 |
| Title + Supporting | 52 |
| Title + Overline + Supporting | 65 |

## Properties

| Property | Type | Values | Default | Notes |
|---|---|---|---|---|
| `Leading Element` | variant | `None` · `Icon` · `Media` | `None` | |
| `Trailing Element` | variant | `None` · `Value` | `None` | `Value` is right-aligned plain text (see Content) |
| `Title` | text | any | `Primary text` | |
| `Overline` | text | any | `Label` | Shown only when `Has Overline = true` |
| `Supporting text` | text | any | `Supporting text` | Shown only when `Has Supporting text = true` |
| `Has Overline` | boolean | `true` · `false` | `false` | |
| `Has Supporting text` | boolean | `true` · `false` | `true` | |
| `Divider` | boolean | `true` · `false` | `true` | |
| `Leading Icon` | instance swap | any 24×24 Material Symbols icon | placeholder | Used when `Leading Element = Icon` |
| `Media` | instance swap | any 40×40 media | placeholder | Used when `Leading Element = Media` |

**No `State` variant.** No `Selected`. No hover, pressed, focused or disabled
states — the row is not interactive.

6 variants (3 Leading × 2 Trailing). Every colour, spacing, radius, stroke
width and text uses a token or a text style.

## States

None. This is the point of the component.

If the row must react to being touched — even to say "not tappable" — it is
the wrong row. Use one of the other three list items and set its State to
`Disabled`.

## Behaviour

None. The row does not respond to tap, hover, focus or keyboard.

Screen readers still read it (see Accessibility), because the fact it states
is content, not chrome.

## Tokens

| Part | Token |
|---|---|
| Overline text | `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default`, style `Heading/Overline -` |
| Title text | `Text/Neutral/On_Low_Contrast/High_Emphasis/Default`, style `Label/L2 (14) -` |
| Supporting text | `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default`, style `Body/B3 (12) =` |
| Trailing Value text | `Text/Neutral/On_Low_Contrast/High_Emphasis/Default`, style `Label/L2 (14) -` |
| Leading Icon | `Icon/On_Neutral/Low_Contrast/High_Emphasis/Default`, size `Size/Icon/XL` |
| `Divider` LINE | `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default`, weight `Stroke Width/Regular` |
| Row minimum height | `Size/Touch_Target` |
| State-layer padding | `Space/Small` vertical, `Space/Medium` horizontal |
| Content gap | `Space/XXS` |
| Leading / Trailing outer gap | `Space/Medium` |

**No overlay or focus tokens on this row.** The State layer is present
structurally, and always transparent.

## Accessibility

| Field | Value |
|---|---|
| Semantic role | not a control — expose as content (`term`/`description` pair when the row is a property + value, or plain text otherwise) |
| Label | not applicable — screen readers read the row as content |
| State | not applicable |
| Focus order | **skipped**. The row is not focusable |
| Touch target | not applicable — the row is not a target |

### Where it can ship

Text contrast is 4.5:1 (WCAG 1.4.3) against the surface the row sits on.
Verified against Canvas and `Low_Contrast/Surface_1..3` in every mode.

| Mode | Canvas | `Low_Contrast/Surface_1` | `Surface_2` | `Surface_3` |
|---|:---:|:---:|:---:|:---:|
| Platform | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ | ✅ | ✅ |
| Lux | ❌ | ❌ | ❌ | ❌ |
| Loyalty | ✅ | ❌ | ✅ | ✅ |
| Studio | ✅ | ✅ | ✅ | ✅ |

The Read-only row has no CTA glyph and no focus ring, so its failure
surface is smaller than the other list items. The ❌ cells are all
low-emphasis text on the given surface — same body text token that fails
elsewhere in the file at those cells.

### Implementation

Web (property/value pair):

```html
<dl class="list-item">
  <dt class="title">Serial number</dt>
  <dd class="value">HAV-1032-8871</dd>
</dl>
```

Web (fact row):

```html
<div class="list-item">
  <div class="content">
    <span class="overline">Warranty</span>
    <span class="title">Expires 12 April 2027</span>
    <span class="supporting">Covered under standard cover</span>
  </div>
</div>
```

Flutter:

```dart
ListTile(
  title: Text('Serial number'),
  trailing: Text('HAV-1032-8871'),
  onTap: null,             // ← not a control
  enabled: true,           // ← keep the text at full colour
)
```

**Never bind `onTap`.** `onTap: null` with `enabled: true` is the pattern.
`enabled: false` would render at 50% opacity, which is wrong: this row is not
disabled, it is stating a fact.

## Haptics

None.

## Content

- Title states the property or fact. Sentence case. No trailing punctuation.
- Trailing `Value` states the value, right-aligned. Prefer numbers, dates,
  short identifiers.
- Supporting text is for a caveat or context — "Applied last night", "Expires soon".
- If the Value is more than three words, put it in Supporting text and set
  `Trailing Element = None`.

## Do

- Group Read-only rows into a section with a header outside the row.
- Keep Value right-aligned and short.
- Use a Divider between adjacent Read-only rows to make the list scannable.
- When many rows share a Leading icon, hide it — repetition adds noise.

## Don't

- Don't stack a Read-only row next to an interactive row without a visual break — users tap what looks tappable.
- Don't use a Read-only row for a status that would benefit from colour or a badge. That is a Tag, and Tag doesn't exist yet — see Open questions.
- Don't use `Trailing Element = Value` for a paragraph. Move it to Supporting text.
- Don't fake a State by lowering opacity. The row has no States.

## Open questions

| Raised | Question | Owner |
|---|---|---|
| 2026-09-29 | Trailing status slot: this row cannot currently show a Tag ("Online", "Low battery"), because Tag doesn't exist. Adding a Tag trailing option is the next step for this component. | Design owner |
| 2026-09-29 | Lux failures on every surface, Loyalty `Surface_1` failure — same shared body-text tokens as the other list items. Fix is a token retune. | Design owner |

## Changelog

| Date | Change |
|---|---|
| 2026-09-29 | Divider redesigned to a `LINE` node named `Divider`, stroke `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default` at `Stroke Width/Regular` (1 dp), sibling of `State layer` inside the outer VERTICAL auto-layout with `gap = 0` and `padding = 0`. Visibility bound to the `Divider` boolean. |
| 2026-09-26 | Built in Figma. |
