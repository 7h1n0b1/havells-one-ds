# Typography

| | |
|---|---|
| **Figma** | `(Havells One) Component UI v1.3` · key `pgOKFbALAAtm6NX5xTqxHO` · `Typography` page `2132:103` |
| **Last updated** | 2026-09-28 |

**How to read this file.** Rules below are ruled by the design owner. Anything
under **Not decided** is genuinely undecided — ask rather than infer. A pattern
in the Figma file is not a rule.

---

## 1. The rules

1. **Bind a text style. Never set a font size.** A number with no style is a
   violation, not a gap to fill.
2. **10 is the floor.** Nothing smaller, anywhere.
3. **Only the styles in §3 count.** Styles from v1.2 or earlier are ignored, not
   migrated.
4. **Two font families only: Inter and Libre Baskerville.** No other family in
   product UI.

---

## 2. Label or Body

Both families exist at 16, 14 and 12, and this is the choice you hit on every
screen.

**`Label` is text that belongs to a control.**
Button labels · chip text · list item titles · form field labels · table headers.

**`Body` is running prose the user reads.**
Descriptions · help text · empty states · paragraphs.

The choice is made by **what the text is attached to**, not by how long it is or
how big it is. A list item title stays a `Label` when it wraps.

| Size | Label | Body |
|---:|---|---|
| 16 | `Label/L1 (16) -` | `Body/B1 (16) =` |
| 14 | `Label/L2 (14) -` | `Body/B2 (14) =` |
| 12 | `Label/L3 (12) -` and `Label/L3 Strong (12) -` | `Body/B3 (12) =` |

---

## 3. The 22 styles

Read from the text style objects. **Every style name ends in `-` or `=`, and that
character is part of the name** — a lookup without it fails. `-` means 110% line
height, `=` means 150%.

The **Flutter token** is the name used in code. It is printed exactly as the
Figma `Typography` page prints it.

| Figma text style | Flutter token | Family | Weight | Size | Line height | Tracking | Case |
|---|---|---|---|---:|---:|---:|---|
| `Display/D1 (51) -` | `D1(51)` | Inter | Bold 700 | 51 | 110% | 0 | — |
| `Display/D2 (40) -` | `D2(40)` | Inter | Bold 700 | 40 | 110% | 0 | — |
| `Display/D3 (32) -` | `D3(32)` | Inter | Bold 700 | 32 | 110% | 0 | — |
| `Display/D4 (25) -` | `D4(25)` | Inter | Bold 700 | 25 | 110% | 0 | — |
| `Heading/H1 (18) -` | `H1(18)` | Inter | **Bold 700** | 18 | 110% | 0 | — |
| `Heading/H2 (16) -` | `H2(16)` | Inter | Semi Bold 600 | 16 | 110% | 0 | — |
| `Heading/H3 (14) -` | `H3(14)` | Inter | Semi Bold 600 | 14 | 110% | 0 | — |
| `Heading/Overline -` | `Overline` | Inter | Semi Bold 600 | 10 | 110% | **+12% (+1.20)** | **UPPERCASE** |
| `Label/L1 (16) -` | `L1(16)` | Inter | Regular 400 | 16 | 110% | 0 | — |
| `Label/L2 (14) -` | `L2(14)` | Inter | Regular 400 | 14 | 110% | 0 | — |
| `Label/L3 Strong (12) -` | `L3Strong(12)` | Inter | Semi Bold 600 | 12 | 110% | **−1% (−0.12)** | — |
| `Label/L3 (12) -` | `L3(12)` | Inter | Regular 400 | 12 | 110% | **−1% (−0.12)** | — |
| `Label/L4 Strong (10) -` | `L4Strong(10)` | Inter | Semi Bold 600 | 10 | 110% | 0 | — |
| `Label/L4 (10) -` | `L4(10)` | Inter | Regular 400 | 10 | 110% | **−1% (−0.10)** | — |
| `Body/B1 (16) =` | `B1(16)` | Inter | Regular 400 | 16 | 150% | 0 | — |
| `Body/B2 (14) =` | `B2(14)` | Inter | Regular 400 | 14 | 150% | 0 | — |
| `Body/B3 (12) =` | `B3(12)` | Inter | Regular 400 | 12 | 150% | 0 | — |
| `Serif/Heading/Heading 2 Serif -` | `Heading2serif` | Libre Baskerville | Regular 400 | 16 | 110% | 0 | — |
| `Serif/Heading/Heading 1 Serif -` | `Heading1serif` | Libre Baskerville | Regular 400 | 18 | 110% | 0 | — |
| `Serif/Display/Display 3 Serif -` | `Title3serif` | Libre Baskerville | Regular 400 | 20 | 110% | 0 | — |
| `Serif/Display/Display 2 Serif -` | `Title2serif` | Libre Baskerville | Regular 400 | 25 | 110% | 0 | — |
| `Serif/Display/Display 1 Serif -` | `Title1serif` | Libre Baskerville | Regular 400 | 32 | 110% | 0 | — |

**Weights are 400, 600 and 700 only.** There is no 500 and no 800. `Strong`
exists at L3 and L4 only. Every serif style is Regular 400.

**Legal sizes are 51 · 40 · 32 · 25 · 20 · 18 · 16 · 14 · 12 · 10.** 20 is used by
`Serif/Display/Display 3 Serif -` only.

Every token name above is unique, and each maps to exactly one style.

### Button labels

There is no reserved button text style. Buttons use:

| Button size | Text style | Flutter token |
|---|---|---|
| Large | `Heading/H2 (16) -` | `H2(16)` |
| Medium | `Heading/H3 (14) -` | `H3(14)` |
| Small | `Label/L3 Strong (12) -` | `L3Strong(12)` |

---

## 4. Converting to code

### Letter spacing is a percentage in Figma, absolute in code

Figma stores tracking as a **percentage of the font size**. Flutter's
`letterSpacing` is absolute, so convert: the values in brackets in §3 are already
converted. `−1%` at 12 is `−0.12`, at 10 is `−0.10`, `+12%` at 10 is `+1.20`.

### Line height is a ratio, and there are exactly two

| Ratio | Where | Flutter |
|---|---|---|
| 110% | every style ending in `-` | `height: 1.1` |
| 150% | every style ending in `=` (Body only) | `height: 1.5` |

The Figma API reads 110% as `110.00000238418579`. That is float noise — use
`1.1`.

### Overline uppercases the text

`Heading/Overline -` sets `textCase: UPPER` on the style, so Figma renders
capitals from a sentence-case string. Flutter's `TextStyle` has no text
transform, so:

- **Keep the source string in sentence case.** Do not store `"DEVICE STATUS"`.
- **Uppercase for display only** — `text.toUpperCase()` in Flutter,
  `text-transform: uppercase` on the web.
- **Leave the accessible name un-transformed.** Some screen readers spell
  all-caps strings letter by letter.

The +12% tracking exists because the text is uppercase. They go together.

```dart
static const overline = TextStyle(
  fontFamily: 'Inter',
  fontSize: 10,
  fontWeight: FontWeight.w600,
  height: 1.1,
  letterSpacing: 1.2,
);
// Text(label.toUpperCase(), style: AppText.overline)
```

---

## 5. The variables behind the styles

Each style is built from variables. **Bind the style, not these** — a family on
its own has no size and no line height.

| Property | Variable | Values |
|---|---|---|
| Size | `Text Size/<n>` in the `Numbers` collection | `51` … `10`, one per legal size |
| Family | `font/family/Sans-Serif`, `font/family/Serif` | Inter, Libre Baskerville |
| Weight | `font/weight/Regular`, `font/weight/Semi Bold`, `font/weight/Bold` | 400, 600, 700 |
| Line height | none — a ratio, see §4 | 110%, 150% |
| Tracking | none — carried by the style | see §3 |

Figma holds weight as a name (`Semi Bold`), not a number. The numbers in the table
are for code.

---

## 6. Serif — Loyalty only, for now

The five serif styles are published, but **do not use a Serif style outside
Loyalty** until the usage rule is ruled. The current working position is "serifs
in Loyalty only for now".

---

## 7. A contrast rule that bites on small text

Text contrast is 4.5:1 (see `Colour.md` §4). The relaxed 3:1 threshold applies
only to **WCAG large text**: 18.66px, or 14px at weight **700**.

**Semi Bold (600) does not count as bold.** A 14px Semi Bold label is normal text
and needs the full 4.5:1.

---

## 8. Not decided — ask, do not infer

| Question | Status |
|---|---|
| Does typography change across themes, or is it theme-invariant? | `OPEN` |
| When is the serif family used, and in which themes? | `OPEN` — see §6 |
| Line-length limits | `NOT YET CAPTURED` |
| Truncation and wrapping rules | `NOT YET CAPTURED` |
| Which style to use in which context, beyond Label versus Body | Partly captured. The split in §2 is ruled; the rest is not |
| Renaming the Flutter tokens to one consistent pattern | Under discussion with the development team. **Until agreed, the names in §3 are the names** |
