# Havells One — design system handoff

Specification for the Havells One component library, v1.3, written for
developers and for the tools they build with.

**Read [`AGENTS.md`](AGENTS.md) first.** It carries the authority order, the
hard rules, and the one thing that matters most: *if a rule is not written down
here, it does not exist — ask, do not infer.*

Then read [`_FOUNDATIONS.md`](_FOUNDATIONS.md). Theming, the two state axes, the
accessibility baseline and the haptics map live there, and every component file
assumes it.

## Foundations

| File | Covers |
|---|---|
| [`foundations/Colour.md`](foundations/Colour.md) | Theme modes, surfaces, the text permission rule, icon colour, stroke grammar, styles, device state |
| [`foundations/Typography.md`](foundations/Typography.md) | The 22 text styles with real values and their Flutter tokens, Label versus Body |
| [`foundations/Numbers.md`](foundations/Numbers.md) | Space, corner radius, stroke width, type size and size tokens; tap targets |
| [`foundations/Icons.md`](foundations/Icons.md) | The Material Symbols render configuration |

**Each of those files ends with what is *not* decided.** That section is as
important as the rules.

## Where the truth lives

- **Values** — token colours, style sizes, variant properties — come from the
  **Figma file objects**. Read the variable, read the style.
- **Rules** — when to use which, what is permitted where — come from **these
  files**.
- **Anything neither answers** — ask the design owner.

Figma file: `Havells One — Component UI v1.3`, key `pgOKFbALAAtm6NX5xTqxHO`.

**Progress is tracked on the `Component Status` page** in that file, page
`40000582:2494`, root frame `40000582:2495`.

## Components — specified

| Component | Status | File |
|---|---|---|
| Button | Ready (Platform, Product); Outlined and Text only in Lux, Studio and Loyalty (Loyalty on Canvas and Surface_3 only); Filled blocked in Lux, Loyalty, Studio | [Button.md](components/Button.md) |
| Checkbox | Ready (Platform, Product, Studio); Loyalty on Canvas, Surface_2 and Surface_3 only; blocked in Lux | [Checkbox.md](components/Checkbox.md) |
| Radio Button | Ready (Platform, Product, Studio); Loyalty on Canvas, Surface_2 and Surface_3 only; blocked in Lux | [Radio Button.md](components/Radio%20Button.md) |
| Check Circle | Ready (Platform, Product, Studio); Loyalty on Canvas, Surface_2 and Surface_3 only; blocked in Lux | [Check Circle.md](components/Check%20Circle.md) |
| Switch | Ready (Platform, Product, Studio); Loyalty on Canvas, Surface_2 and Surface_3 only; blocked in Lux. `Has Label` must not be enabled in production until the `ON` / `OFF` a11y question is resolved | [Switch.md](components/Switch.md) |
| Action List_Item | Ready (Platform, Product, Studio); Loyalty on Canvas, Surface_2 and Surface_3 only; blocked in Lux | [Action List_Item.md](components/Action%20List_Item.md) |
| Selection List_Item | Ready (Platform, Product, Studio); Loyalty on Canvas, Surface_2 and Surface_3 only; blocked in Lux. Inherits the trailing atom's ship matrix (Checkbox, Radio Button or Check Circle) | [Selection List_Item.md](components/Selection%20List_Item.md) |
| Switch List_Item | Ready (Platform, Product, Studio); Loyalty on Canvas, Surface_2 and Surface_3 only; blocked in Lux. Device axis (Sending / Failed / Offline) documented but not yet a Figma variant | [Switch List_Item.md](components/Switch%20List_Item.md) |
| Read-only List_Item | Ready (Platform, Product, Studio); Loyalty on Canvas, Surface_2 and Surface_3 only; blocked in Lux. No interactive states. Trailing Tag row will land when Tag is built | [Read-only List_Item.md](components/Read-only%20List_Item.md) |
| Header | Ready in all five modes for title, subtitle and icons. The keyboard focus ring fails 3:1 in Loyalty (Solid, Surface_1) and Studio (Solid, Canvas, Surface_1, Surface_2); touch-only builds are unaffected. Action icons are swapped on the nested `.Header_Action`, not on the Header | [Header.md](components/Header.md) |
| Tabs | Ready in all five modes for labels and icons. The indicator fails 3:1 in Loyalty and the keyboard focus ring fails it in Loyalty and Studio; touch-only builds are affected only by the Loyalty indicator. Pill-shaped predecessors are deprecated. Label, icon and state are set on the nested tab | [Tabs.md](components/Tabs.md) |
| Bottom Navigation | Ready in all five modes for labels, icons and all five brands. **The only component with a `Brand` axis** — Havells, Lloyd, Crabtree, Standard, Product — which exists in Platform and Product only, and carries the stroke, the label, the icon and the hover / pressed overlay. Havells follows the platform CTA like Button: red in Platform, black in Product. Standard's overlay is a neutral tint until an `Opacity/Blue` ramp exists. The keyboard focus ring fails 3:1 in Loyalty and Studio and is invisible on a focused selected segment there; the badge fails on an unselected segment in Loyalty. The belt must sit over the canvas, `Surface_2` or `Surface_3`, never `Surface_1`. Lux is the only mode that draws the shadow and the hairline; Loyalty and Studio select with the selection-control colour and take the on-CTA label. Icon above label, and the icon is optional (`Has Icon`). Nothing holds a fixed height: the belt hugs its segments, so it is 57 high with icons and 48 without, the tap-target minimum. Brand, label, icon, badge, selection and state are set on the nested segment. Four v1.2 predecessors are superseded | [Bottom Navigation.md](components/Bottom%20Navigation.md) |

| Day Picker | Ready in all five modes for the day letters, which pass 4.5:1 everywhere. The selected chip misses 3:1 on `Surface_1` in Loyalty (inherited), and the **weekend tint is invisible in Loyalty and Studio** and is colour alone everywhere — do not rely on it. Each day is a 48 × 48 target around a 32 circle; the row's side padding is 12 so seven targets fit at 360. Selection is set on the nested unit | [Day Picker.md](components/Day%20Picker.md) |

## Built in Figma, specification not written yet

**Do not build from these.** They exist as components and are awaiting the design
owner's review; no file here means no agreed contract.

Dialog · Inline Message · Empty State

## Coming, in this order

Tag (new — blocks the Read-only List_Item trailing status slot) · Device Card ·
Mode selector (does not exist yet, needs a name) · Sliders

## Conventions

One file per component, same headings in the same order, so you can skim to the
section you need. Shared rules are stated once in `_FOUNDATIONS.md` rather than
repeated, so they cannot drift apart.

Open questions carry a date and an owner. If a file says something is not
decided, treat it as not decided.
