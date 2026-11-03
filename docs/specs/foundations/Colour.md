# Colour

| | |
|---|---|
| **Figma** | `(Havells One) Component UI v1.3` · key `pgOKFbALAAtm6NX5xTqxHO` |
| **Collections** | `Colours` (221 variables, 5 modes — 220 colours and one stroke width) · `Device Illustration` (7 variables, 3 modes) · `_Base_Semantic_Library` (brand bases) |
| **Primitives** | `Havells Primitive Library` · key `Cee9r9S5ZaSQCE6qBUHV39` · collection `Primitive_Color_Lib`, the only primitive library. Every semantic colour resolves to it |
| **Values read from Figma** | 2026-09-30 |

**How to read this file.** Part A is the model and the rules: ruled by the
design owner, safe to build against. Part B is every token with its alias and
its resolved value in every mode, generated from the Figma variables on the
date above — not typed by hand. Where a value here and the Figma variable
disagree, the variable is right and this file needs regenerating. Anything
under **Not decided** is genuinely undecided: ask, do not infer. A pattern in
the Figma file is not a rule.

**Hex values appear in this file for one reason:** so that the primitive
constants can be written into code once, from here. Hex never appears anywhere
else in code. Everything above the primitive layer is a reference to a name.

---

# Part A — the model

## 1. Three layers, one direction

```
Primitive_Color_Lib               raw values      Red/700 = #BD0010
        ↓ alias
_Base_Semantic_Library            brand bases     Colour/Brand/Havells → Red/650
        ↓ alias
Colours  (5 modes)                semantic roles  Surface/Brand/High_Contrast/Havells_Red/Default
        ↓ alias                                    → Red/700 in Platform, Red/300 in Loyalty
Colours  component layer          Component/Button/Outlined/Stroke/Default
                                                   → Stroke/Brand/High_Contrast/Havells_Red/Default
```

| Layer | Collection | Names look like | Bind it in code? |
|---|---|---|---|
| Primitive | `Primitive_Color_Lib` | `Neutral/900`, `Red/700`, `Lux/600`, `Opacity/Red/5` | **Never.** Exists only as the constants table the semantic layer points at |
| Brand base | `_Base_Semantic_Library` | `Colour/Brand/Havells`, `Colour/Brand_Tints/Lloyd` | **Never.** Internal alias targets |
| Semantic | `Colours` | `Surface/…`, `Text/…`, `Icon/…`, `Stroke/…` | **Yes.** This is the API |
| Component | `Colours` | `Component/Button/…`, `Component/Selection_Control/…` | Yes, inside that component only |

**A semantic token has no value of its own.** In every mode it is an alias —
of a primitive, of a brand base, or of another semantic token. Resolution
follows the alias chain until it reaches a primitive. That is why one token can
be red in Platform and pink in Loyalty without anything in the component
changing: the chain ends somewhere else in each mode.

Worked example, `Component/Button/Outlined/Stroke/Default`:

| Mode | Chain | Value |
|---|---|---|
| Platform | → `Stroke/Brand/High_Contrast/Havells_Red/Default` → `Surface/Brand/High_Contrast/Havells_Red/Default` → `Red/700` | `#BD0010` |
| Product | → `Stroke/Brand/High_Contrast/Product_Black/Default` → `Colour/Brand/Product` → `Neutral/900` | `#181818` |
| Lux | → `Stroke/On_Neutral/Low_Contrast/Stroke_3/Default` → `Lux/700` | `#291E0C` |
| Loyalty | → `Loyalty Primary/Base` | `#DCA434` |
| Studio | → `Gold/350` | `#C6B68D` |

**What this means for code.** Three files, mirroring the three layers:

1. **Primitives** — one constants file, generated from Part B §C. The only
   place a hex literal is legal.
2. **Semantic theme** — one object with the semantic token names as fields,
   and **five instances of it**, one per mode, each field pointing at a
   primitive. Generated from Part B §A.
3. **Components** read semantic fields from whatever instance the ancestor
   provides. They never take a theme parameter and never mention a mode.

The alias column in Part B tells you which semantic tokens are pure aliases of
another semantic token (every `Icon/*`, every role `Stroke/*`). In code those
can be a reference to the other field rather than a second value, so they
cannot drift.

## 2. Themes are modes, not names

The `Colours` collection has **five modes**:

`Platform` · `Product` · `Lux` · `Loyalty` · `Studio`

A retheme is a **mode switch**. It is never a token swap, and no theme name
appears inside a token path. `Basic` is not a mode: it is the informal name for
the Platform/Product pair and must not appear anywhere in code. "IoT theme" is
retired and names nothing.

| Mode | Light or dark | Used for | Neutral ramp | Accent ramp |
|---|---|---|---|---|
| Platform | light | Most of the app | `Neutral/*` | `Red/*` (Havells) |
| Product | light | Product UI | `Neutral/*` | `Neutral/900` (black CTA) |
| Lux | light | Specific new-age products being redesigned in it | `Lux/*` | `Lux/400`–`Lux/700` |
| Loyalty | dark | The Loyalty programme journey. **Never used for products** | `Loyalty Secondary/*` | `Loyalty Primary/*` (gold) |
| Studio | dark | The Havells Studio brand | `Neutral/*` (dark end) | `Gold/*` |

**A theme is not chosen per screen — it follows the journey.** The app
switches to Loyalty when the user enters that programme. Lux applies to
particular products. Nothing lets a screen pick a theme freely. Legacy Havells,
Lloyd, Crabtree and Standard products run in Platform.

**Platform and Product differ in exactly one thing: the CTA colour.**
Platform's is red (`Colour/Brand/Havells`, `Red/650`, with `Red/700` as the
filled surface); Product's is black (`Colour/Brand/Product`, `Neutral/900`).
Every status, AQI, e-commerce and brand value is identical across the two. In
Part B, a row whose Platform and Product cells differ is a CTA-derived token.

**Brand, status and e-commerce keep their own hues in every mode.** Lux does
not turn Havells red brown. Only the *neutral chrome* — canvas, neutral
surfaces, neutral text, neutral strokes — moves onto the theme's own ramp.
Status and brand values still change step between light and dark modes so that
they clear contrast, but they stay in their family.

### Depth works differently in light and dark

- **Light themes (Platform, Product, Lux)** — separation comes from
  **elevation**, or from **surface colour**, or from both together. This is
  why `Low_Contrast/Surface_1` and `Surface_2` can both be `#FFFFFF` in
  Platform: an effect style carries the depth there.
- **Dark themes (Loyalty, Studio)** — separation comes from **colour**. A
  stroke is a conditional addition, not the rule.

A component moving between a light and a dark theme does not merely recolour;
the mechanism carrying its depth changes. The effect styles are listed in §9.

## 3. The four atoms, and the order you reason in

| Atom | Purpose | Token family | Figma scope |
|---|---|---|---|
| **Surface** | background of the app's sections | `Surface/*` | frame fill, shape fill |
| **Text** | readability and hierarchy | `Text/*` | text fill only |
| **Icon** | indicators and navigation aids | `Icon/*` | shape fill **and** stroke colour (Material icons are drawn as strokes) |
| **Stroke** | outlines and borders | `Stroke/*` | stroke colour only |

**Order: Surface, then Text, then Icon and Stroke.** The surface is chosen
first because text contrast is judged against it.

**Text binds `Text/*`. Icons bind `Icon/*`. Strokes bind `Stroke/*`.** Crossing
these is a defect even when the values match — the scopes differ, and the
families are tuned to different contrast floors (4.5:1 for text, 3:1 for
control strokes, none for dividers).

## 4. Surfaces

**The reference for surfaces is `Text x Surface Matrix v1.7`**, frame
`40000114:6620` on the `Color (WIP)` page. The surface prose elsewhere on that
page is being rewritten — do not quote it. The matrix still shows
`Standard_2_Orange` rows; Standard 2 is retired, ignore them.

### Every surface the system has

```
Surface/Neutral/Canvas/Default → Default_2     the backmost surface, a gradient
Surface/Neutral/Low_Contrast/Surface_1..3
Surface/Neutral/High_Contrast/Surface_1..3
Surface/Overlay/Default                        one per theme, 60% dark

Surface/Brand/Low_Contrast/<Brand>_Accent      four brands
Surface/Brand/High_Contrast/<Brand>

Surface/Status/<Success|Error|Warning>/Low_Contrast and High_Contrast
Surface/Status/Information/Low_Contrast        Low Contrast only — no High Contrast
Surface/Status/AQI/<Good|Satisfactory|Moderate|Poor|Very_Poor>

Surface/E_Commerce/Promo_Highlights/Low_Contrast and High_Contrast

Surface/Opacity/Light, Surface/Opacity/Dark    Lux scrims, 50%
```

**`Neutral` is a category**, at the same level as Brand, Status and
E-commerce. Every theme carries all of it.

**Neutral surfaces, for the purpose of text permission, are Canvas plus Low
Contrast 1/2/3.** High Contrast surfaces take their own text pair.

**The numbering rule: a smaller number is lighter on a white background.**
`Surface_1` is the lightest Low Contrast surface, `Surface_3` the darkest, in
every mode. The same rule governs High Contrast surfaces and strokes. In the
dark themes the High Contrast surfaces are *light* (Loyalty
`Loyalty Secondary/100..300`, Studio `Neutral/100..300`), because High
Contrast means "opposite to the canvas", not "dark".

**Lux `High_Contrast/Surface_3` borrows `Neutral/900`** because no Lux step is
darker than `Lux/700`. Deliberate; the only non-Lux neutral in Lux chrome.

**`Status/Information` has no High Contrast surface.** It will be added when a
use case appears. Do not substitute another status surface for it.

**These surface names do not exist and must not be used:** `Large Surface`,
`Small Surface`, `Invert`, `Disabled`, `Light Grey`, `Dark Grey`. Anything
under `_deprecated/` is a staging area, not a keep.

The top bar surface is a real token, `Component/Header/Surface/Default`, and it
aliases `Surface/Neutral/Low_Contrast/Surface_1/Default`. Its shadow is the
`TopBarSurface` effect style in §9.

### Which text goes on which surface

Each matrix cell names the **text token permitted on that surface**.

| # | Pairing |
|---|---|
| 1 | Neutral text on neutral surfaces |
| 2 | Neutral text on High Contrast surfaces |
| 3 | Brand text on neutral surfaces |
| 4 | Brand text on own-brand surfaces |
| 5 | Status text on neutral surfaces |
| 6 | Status text on own-status surfaces — **High Contrast status surfaces take neutral text** |
| 7 | AQI text on neutral surfaces — always neutral Low Contrast |
| 8 | E-commerce text on neutral and own E-commerce surfaces |

### The canvas is always a gradient

So that a mode switch can turn a flat canvas into a travelling one, **the
canvas carries a two-stop linear gradient, top to bottom, in every theme**.
The flat themes set both stops to the same value.

| Stop | Position | Token | Platform | Product | Lux | Loyalty | Studio |
|---|---|---|---|---|---|---|---|
| 1 | 0% | `Surface/Neutral/Canvas/Default` | `#FFFFFF` | `#FFFFFF` | `#E1E1DF` | `#2B2B36` | `#474747` |
| 2 | 100% | `Surface/Neutral/Canvas/Default_2` | `#FFFFFF` | `#FFFFFF` | `#E1E1DF` | `#40404F` | `#181818` |

**Canvas has no text token of its own.** It takes the `On_Low_Contrast` pair.

### Disabled is not a token

**Disabled, in every category and every atom, is the enabled value at 50%
opacity, set at the component.** There is no disabled variable. A disabled
brand button is the enabled brand surface at 50%.

## 5. Text — the name is the permission

**Every text colour passes 4.5:1 against every surface it is permitted on.**
That is a property of the token, checked when the token is defined (575 pairs
measured, 0 fail, matrix v1.7). It is not something a screen has to re-check.

**A text token's name states where it may be used, and it may be used nowhere
else.** `…/On_High_Contrast/…` may only sit on a High Contrast surface.
Putting it anywhere else is a defect even if it happens to look fine.

### The grammar

```
Text/<Role>/On_<Surface>/<Emphasis>/Default
```

| Slot | Values |
|---|---|
| `<Role>` | `Neutral`; `Brand/<Brand>`; `Status/<Status>`; `Status/AQI/<Level>`; `E_Commerce/Promo_Highlights` |
| `On_<Surface>` | `On_Low_Contrast`, `On_High_Contrast`, `On_Neutral/Low_Contrast`, `On_Neutral/High_Contrast`, `On_Brand_Low_Contrast`, `On_Brand_High_Contrast`, `On_Status_Low_Contrast`, `On_Status_High_Contrast` |
| `<Emphasis>` | `High_Emphasis` primary text, `Low_Emphasis` secondary. Brand, AQI and status-on-High-Contrast text carry no emphasis slot |

**Contrast names the surface. Emphasis names the text.** `High_Contrast` says
which surface; `High_Emphasis` says which of the two text options on it. Both
emphasis levels clear 4.5:1 — low emphasis is a step down in prominence, not a
licence to fail contrast.

**There is no `On_White` and no `On_Colour`.** White is not a surface in this
system; Canvas is white only in Platform and Product.

### Two spellings are live — copy token strings exactly

The **neutral** text family puts the category first:
`Text/Neutral/On_Low_Contrast/High_Emphasis/Default`.
The **neutral icon** family puts the permission first:
`Icon/On_Neutral/Low_Contrast/High_Emphasis/Default`.
The **status** families put the permission first:
`Text/Status/Success/On_Neutral/Low_Contrast/High_Emphasis/Default`.

All three are real. **Take exact token strings from Part B**, not from the
grammar. The grammar tells you what a name means; Part B tells you how it is
spelled today.

### Brand text

**One emphasis, three permissions:**

```
Text/Brand/<Brand>/On_Neutral/Low_Contrast/Default      brand text on a neutral surface
Text/Brand/<Brand>/On_Brand_Low_Contrast/Default        on its own accent (tint) surface
Text/Brand/<Brand>/On_Brand_High_Contrast/Default       on its own strong surface
Text/On_Brand_High_Contrast/<Brand>/High_Emphasis/Default   NEUTRAL text on that brand surface
```

Brand text is never placed on neutral High Contrast, AQI or E-commerce
surfaces. **The four brands are** `Havells_Red`, `Lloyd_Blue`,
`Crabtree_Green`, `Standard_Blue`. Lloyd sits on the **Violet** ramp, not Blue.
Standard 2 Orange is retired; every `Standard_2` variable is under
`_deprecated/`. Studio and Product are **themes**, not brands: they have no
brand surface of their own. (`Product_Black` survives only as a stroke role
that Product's CTA needs — see §7.)

### Status and AQI text

**Status text on status surfaces is Low Contrast only.** High Contrast status
surfaces take neutral text, through
`Text/Status/<S>/On_Status_High_Contrast/Default`.

**AQI text carries no emphasis and no surface in its name** —
`Text/Status/AQI/<Level>`. **AQI text is always placed on neutral Low Contrast
surfaces** (canvas, Low Contrast 1/2/3). AQI values are never written in
Success colours. `Surface/Status/AQI/*` are the AQI *accent* colours (scoped
TEXT_FILL in Figma, a scoping quirk — they are surfaces).

### Rules

- **A status or brand text colour never sits on a surface of its own hue.**
  Red on red, green on green, gold on gold. Those surfaces take neutral text.
- Where a brand colour cannot clear 4.5:1 on a surface, that pairing is
  **prohibited**, and the prohibition is written on the Figma page.
- **Lux text is always a `Lux/*` token**, except where no step of the Lux ramp
  reaches 4.5:1 on the target surface. **Pure white is not used in Lux.**

## 6. Icon — the twin of Text

**For every `Text/…` variable an `Icon/…` variable exists, and it is an alias
of the text token, never a value of its own.** 38 pairs, parity checked.

```
Text/Neutral/On_Low_Contrast/High_Emphasis/Default
Icon/On_Neutral/Low_Contrast/High_Emphasis/Default     alias of the line above
```

**An icon colour can never differ from its text colour.** In code, model the
icon field as a reference to the text field.

An icon and a label in one row **share the `On_<Surface>` slot**. Role and
emphasis may differ — a status icon beside a neutral message is fine, a
low-emphasis chevron beside a high-emphasis label is fine.

**An icon with more than one colour is an illustration**, not an icon. The
Havells mark and the Care Plus shields take no colour token and do not
recolour with the theme. **Disabled icons are 50% opacity.**

## 7. Stroke — its own grammar, by job

Strokes separate or they bound. They carry no emphasis pairing and a
different contrast floor from text. Three groups.

### A. Neutral strokes, numbered by lightness

| Token | Job | Floor |
|---|---|---|
| `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default` | divider, card outline | none — decorative, tuned to ~1.5:1 against canvas and `Surface_1` |
| `Stroke/On_Neutral/Low_Contrast/Stroke_2/Default` | input border, chip outline | **3:1** (WCAG non-text) |
| `Stroke/On_Neutral/Low_Contrast/Stroke_3/Default` | selected outline, strong boundary | |
| `Stroke/On_Neutral/High_Contrast/Stroke_1..3/Default` | the same three, for High Contrast surfaces | |

**Never use `Stroke_1` as an input border.** A control boundary must clear
3:1, and only `Stroke_2` does.

### B. Role strokes alias the role's surface, not its text

```
Stroke/Brand/<Brand>/High_Contrast     alias of Surface/Brand/High_Contrast/<Brand>
Stroke/Brand/<Brand>/Low_Contrast      alias of Surface/Brand/Low_Contrast/<Brand>_Accent
Stroke/Status/<S>/High_Contrast        alias of Surface/Status/<S>/High_Contrast    error input border
Stroke/Status/<S>/Low_Contrast         banner border, one step darker than the banner surface
Stroke/E_Commerce/Promo_Highlights/*   same pattern
```

A status border must match the status accent; text tokens are tuned for
legibility and are the wrong reference for a border.

`Stroke/Brand/*/Product_Black/Default` exists so that Product's black CTA has
an outline; it is the one brand stroke with no brand surface behind it.

### C. Focus

`Stroke/Focus/Default` — one token, mode-aware, aliases the CTA colour
(`Component/Button/Filled/Surface/Gradient_1`) so it is red in Platform, black
in Product, gold in Loyalty. **Focus strokes use `Stroke Width/Bold`.**

### Widths

Stroke widths are `Stroke Width/*` tokens — see `Numbers.md`. A 0.5 stroke in
an older design is `Stroke Width/Hairline` (0.2).

### Buttons

**Only Outlined buttons carry a stroke.** Filled and Text buttons have none.

### The one Lux white stroke

Dark Lux controls — segments, bottom navigation, slider handles, dial rings —
use `Stroke/On_Neutral/High_Contrast/Stroke_1/Default` at
`Stroke Width/Hairline`. No other token exists for it.

## 8. Component-layer tokens

`Component/<Component>/<Part>/<State>` tokens exist where a component needs a
colour that is not a plain semantic role — a CTA that is red in one mode and a
gold gradient in another, or a hover tint. They are still aliases: they point
at semantic tokens or at `Opacity/*` primitives, and they theme by mode like
everything else.

| Family | State | Use |
|---|---|---|
| `Component/Button/Filled/*` | built for v1.3 | Filled button fill (two gradient stops — flat in Platform and Product, both stops equal), label, icon, hover overlay |
| `Component/Button/Outlined/*` | built for v1.3 | fill, stroke, label, icon, hover and pressed overlays |
| `Component/Button/Text/*` | built for v1.3 | label, icon, hover and pressed overlays |
| `Component/Selection_Control/*` | built for v1.3 | Checkbox, Radio Button, Check Circle glyph colour and 40px state-layer overlays |
| `Component/Switch/*` | built for v1.3 | Track on / off (surface and stroke), Handle on / off, 40px state-layer overlays. The Off handle aliases the CTA in Product, Lux, Loyalty and Studio, so the handle carries the brand accent whether the switch is on or off; Platform is the exception with a dark neutral Off handle |
| `Component/List_Item/Overlay/*` | built for v1.3 | row tint for hover, pressed, selected. **Role name awaiting the owner's confirmation** |
| `Component/Bottom_Navigation/*` | built for v1.3 | belt surface, selected segment fill, hairline stroke, label and icon in both selections, 10% and 5% state-layer overlays, timer badge. The stroke token is the one in the system that carries **zero alpha outside Lux**, so the hairline renders in Lux only while the geometry stays identical in every mode |
| `Component/Bottom_Navigation/Brand/<Brand>/*` | built for v1.3 | **The one brand-axis family in the system.** Label, icon and stroke of the selected segment, one set per brand. See below |

| `Component/Day_Picker/*` | built for v1.3 | selected chip fill, day letter in three roles (default, selected, weekend), 10% and 5% state-layer overlays |

### Brand as a component variant

`Colours.md` §12 records that whether brand accent is a mode, a collection or a
component variant is undecided in general. **For Bottom Navigation the design
owner has ruled it a component variant**, and it is so far the only component
with one. The ruling does not generalise; ask before giving any other component a
brand axis.

Five brands — `Havells_Red`, `Lloyd_Blue`, `Crabtree_Green`, `Standard_Blue`,
`Product_Black` — each with a `Label/Selected`, an `Icon/Selected` and a
`Stroke/Selected`.

**Brand exists in Platform and Product only.** Each of those tokens resolves to:

| Mode | Label and icon | Stroke |
|---|---|---|
| Platform, Product | the brand's `On_Neutral/Low_Contrast` colour | the brand's `High_Contrast` stroke |
| Lux | the neutral high-emphasis label and icon | the Lux white hairline |
| Loyalty, Studio | the on-CTA label and icon | zero alpha — no stroke |

So a mode switch removes the brand rather than recolouring it: in Lux the segment
returns to the neutral Lux treatment, and in Loyalty and Studio to the
selection-control fill. `Product_Black` has no brand text or icon token —
Product is a theme, not a brand (§5) — so it borrows the neutral pair and only
its stroke is brand-shaped.

**One non-colour variable lives in `Colours`.**
`Component/Bottom_Navigation/Stroke_Width/Selected` is a FLOAT, because the
selected segment's stroke width has to follow the mode — `Stroke Width/Regular`
in Platform and Product, `Stroke Width/Hairline` in the other three — and
`Numbers` has a single mode. It is the only variable in `Colours` that is not a
colour, and it is deliberately not in the Part B colour tables.

**Overlays are the theme hue at 5% or 10%.** Hover and pressed overlays alias
`Opacity/<hue>/5` and `/10`: Red in Platform, Neutral Dark in Product, Lux,
Loyalty gold, Studio gold. There is no semantic overlay family yet; the
component tokens are the contract.

**The CTA colour, by mode**, is the value every filled control shares
(`Component/Button/Filled/Surface/Gradient_1`,
`Component/Selection_Control/Icon/Selected/Default`, `Stroke/Focus/Default`,
`Component/Switch/Track/On/Default`, and `Component/Switch/Handle/Off/Default`
in every mode except Platform):

| Platform | Product | Lux | Loyalty | Studio |
|---|---|---|---|---|
| `Red/700` `#BD0010` | `Neutral/900` `#181818` | `Lux/400` `#AEA28A` | `Loyalty Primary/Base` `#DCA434` | `Gold/350` `#C6B68D` |

## 9. Gradients and effects are styles, not tokens

Gradient surfaces and effects are **Figma styles**, not variables. They do not
switch with the mode; the name says which theme owns them.

**Paint styles for development:**

| Style | What it is |
|---|---|
| `Havells Ai` | AI listening ring gradient — the Agentic Voice identity |
| `Voice mode red` | Voice FAB, red to dark |
| `Lux/CTA Gradient` | Lux control gradient, High Contrast Surface 2 to Surface 1 |
| `Lux/Online Control Page Banner` | Lux control banner, online state |
| `Lux/Offline Control Page Banner` | Lux control banner, offline state |
| `Lux/Toggle Stroke` | Lux toggle border |
| `E-commerce/Plans background - Bronze` | Care+ Explorer plan header |
| `E-commerce/Plans background - Silver` | Care+ Pro plan header |
| `E-commerce/Plans background - Gold` | Care+ Master plan header |
| `Loyalty/Happiness` | Happiness Exclusive card background (radial) |

**Effect styles for development:**

| Style | What it is |
|---|---|
| `Lux/Surface/Surface 1`, `Surface 2`, `Surface 3` | the Lux elevation stack |
| `Lux/Control Raised` | the Lux raised-control effect — with `Lux/CTA Gradient`, the main Lux identity visual |
| `Lux/Button` | Lux button elevation |
| `Lux/Toggle/On`, `Lux/Toggle/Off` | Lux toggle states |
| `Button/Hover` | the hover drop shadow on buttons, pointer platforms only |
| `TopBarSurface` | the drop shadow under a Header whose `Surface` is `Solid` |
| `Studio Overlay Blur`, `Studio Selected Glow` | Studio-only effects |

**A style that is not in these two tables is not for development**, even if it
exists in the Figma file.

`Loyalty/Happiness` is used in Loyalty, and in Platform or Product **only**
where a purchase journey highlights Loyalty benefits to the user.

**Inner shadows are Lux only.** An effect style beginning `Lux/` belongs to
Lux, and **no other theme may use a `Lux/*` effect style**. Lux is the one
theme whose depth model uses inner shadow as well as elevation, because the
theme is meant to give controls a skeuomorphic identity.

AQI backgrounds are not always solid: each level takes a radial gradient from
60% opacity at the centre to 0% at the edge. Those styles have not been named
yet.

## 10. Device state is a second mode axis

A connected-hardware screen colours itself on **two independent dimensions**:
theme, and what the device is actually doing — powered, idle or unreachable.

A second collection, `Device Illustration`, carries modes `On`, `Off`,
`Offline`. It composes with `Colours` because they are separate collections: a
node can pin a theme mode and a device-state mode at once. Values are in
Part B §B.

| Role | What it colours |
|---|---|
| `Illustration/Body_Dark` | the darker body mass of a device illustration |
| `Illustration/Body_Light` | the lighter body mass |
| `Illustration/Accent` | the warm accent that reads as "this thing is running" |
| `Illustration/Shadow` | contact shadow under the device |
| `Illustration/Glow` | light emission. **Zero alpha when Off or Offline** |
| `Illustration/On_Colour` | cut-outs and highlights. Constant across all three states |
| `Surface/Device/Card/Default` | the card ground behind the illustration |

## 11. Hard rules

1. **No hex literal, ever, outside the generated primitives file.** Bind a
   token. A value with no token is a stop sign, not a licence to hardcode.
2. **Never bind a primitive, a brand base, or a `_deprecated/*` variable.**
3. **Text binds `Text/*`. Icons bind `Icon/*`. Strokes bind `Stroke/*`.**
4. **Never put a text token on a surface its name does not permit.**
5. **Never write a theme name into a token path.** Theme is a mode.
6. **Disabled is 50% opacity at the component**, for every atom.
7. **`Lux/*` effect styles are for Lux only.**
8. **Components never take a theme parameter.** The mode is set once, high in
   the tree.

## 12. Not decided — ask, do not infer

| Question | Status |
|---|---|
| Whether a single screen may mix themes, e.g. at a Loyalty journey boundary | `OPEN` |
| Whether brand accent is a mode, a separate collection or a component variant | `NOT YET CAPTURED` |
| Text on Overlay surfaces — overlays are neither Low nor High Contrast, so no text token names them | `OPEN` |
| Whether disabled **text** and **strokes** also use 50% opacity, or keep their own tokens | `OPEN` (the rule in §4 is the working position) |
| What picks between Low and High Contrast, and between levels 1, 2 and 3, at design time | `OPEN` |
| Under what conditions a dark theme uses a stroke to separate surfaces | `NOT YET CAPTURED` |
| Colour rules specific to Loyalty and Studio | `NOT YET CAPTURED`. Only Lux is captured |
| `Lux/500` has no surface role but is used as a stroke in older screens | `OPEN` |
| The name of the AQI radial gradient styles | Not chosen |
| The `Component/List_Item/Overlay/*` role name | Awaiting the owner |
| Studio `Stroke_1` at `Gold/150` reads at text-level contrast; `Gold/700` proposed | `OPEN`, the owner's call |

---

# Part B — the tokens

Generated from the Figma variables on 2026-09-29. Columns: the token; the
semantic token or brand base it aliases in Platform mode (`—` when it aliases a
primitive directly); then, per mode, the primitive it resolves to and that
primitive's value. `@n%` is alpha.

**Do not edit these tables by hand. Regenerate them** — the script is in
`02_Designer Rules/Regenerate Colour tables.md`.

## A. `Colours` collection

### Surface

| Token | Aliases | Platform | Product | Lux | Loyalty | Studio |
|---|---|---|---|---|---|---|
| `Surface/Neutral/Canvas/Default` | — | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/200 `#E1E1DF` | Loyalty Secondary/900 `#2B2B36` | Neutral/800 `#474747` |
| `Surface/Neutral/Canvas/Default_2` | — | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/200 `#E1E1DF` | Loyalty Secondary/800 `#40404F` | Neutral/900 `#181818` |
| `Surface/Neutral/Low_Contrast/Surface_1/Default` | — | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/100 `#F0F0EF` | Loyalty Secondary/600 `#686882` | Neutral/700 `#5E5E5E` |
| `Surface/Neutral/Low_Contrast/Surface_2/Default` | — | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/150 `#EBEBEA` | Loyalty Secondary/700 `#545469` | Neutral/800 `#474747` |
| `Surface/Neutral/Low_Contrast/Surface_3/Default` | — | Neutral/25 `#F7F7F7` | Neutral/25 `#F7F7F7` | Lux/350 `#D9D5CA` | Loyalty Secondary/800 `#40404F` | Neutral/900 `#181818` |
| `Surface/Neutral/High_Contrast/Surface_1/Default` | — | Neutral/700 `#5E5E5E` | Neutral/700 `#5E5E5E` | Lux/600 `#655436` | Loyalty Secondary/100 `#E6E6EB` | Neutral/100 `#E8E8E8` |
| `Surface/Neutral/High_Contrast/Surface_2/Default` | — | Neutral/800 `#474747` | Neutral/800 `#474747` | Lux/700 `#291E0C` | Loyalty Secondary/200 `#CCCCD6` | Neutral/200 `#D1D1D1` |
| `Surface/Neutral/High_Contrast/Surface_3/Default` | — | Neutral/900 `#181818` | Neutral/900 `#181818` | Neutral/900 `#181818` | Loyalty Secondary/300 `#B3B3C2` | Neutral/300 `#BABABA` |
| `Surface/Overlay/Default` | — | Opacity/Neutral - Dark/60 `#181818 @60%` | Opacity/Neutral - Dark/60 `#181818 @60%` | Opacity/Neutral - Dark/60 `#181818 @60%` | Opacity/Neutral - Dark/60 `#181818 @60%` | Opacity/Neutral - Dark/60 `#181818 @60%` |
| `Surface/Opacity/Light/Default` | — | Lux/300-50 `#D1D1D1 @50%` | Lux/300-50 `#D1D1D1 @50%` | Lux/300-50 `#D1D1D1 @50%` | Lux/300-50 `#D1D1D1 @50%` | Lux/300-50 `#D1D1D1 @50%` |
| `Surface/Opacity/Dark/Default` | — | Lux/500-50 `#81745C @50%` | Lux/500-50 `#81745C @50%` | Lux/500-50 `#81745C @50%` | Loyalty Secondary/500 `#808099 @50%` | Lux/500-50 `#81745C @50%` |
| `Surface/Brand/High_Contrast/Havells_Red/Default` | — | Red/700 `#BD0010` | Red/700 `#BD0010` | Red/700 `#BD0010` | Red/300 `#FF7581` | Red/300 `#FF7581` |
| `Surface/Brand/High_Contrast/Lloyd_Blue/Default` | `Colour/Brand/Lloyd` | Violet/750 `#263884` | Violet/750 `#263884` | Violet/750 `#263884` | Violet/400 `#818EC5` | Violet/300 `#A1AAD4` |
| `Surface/Brand/High_Contrast/Crabtree_Green/Default` | — | Green/800 `#226D41` | Green/800 `#226D41` | Green/800 `#226D41` | Green/400 `#73D49B` | Green/400 `#73D49B` |
| `Surface/Brand/High_Contrast/Standard_Blue/Default` | `Colour/Brand/Standard` | Blue/700 `#1871A5` | Blue/700 `#1871A5` | Blue/700 `#1871A5` | Blue/400 `#5EB6E8` | Blue/400 `#5EB6E8` |
| `Surface/Brand/Low_Contrast/Havells_Red_Accent/Default` | `Colour/Brand_Tints/Havells` | Red/100 `#FFD1D5` | Red/100 `#FFD1D5` | Red/100 `#FFD1D5` | Red/100 `#FFD1D5` | Red/100 `#FFD1D5` |
| `Surface/Brand/Low_Contrast/Lloyd_Blue_Accent/Default` | `Colour/Brand_Tints/Lloyd` | Violet/100 `#E0E3F1` | Violet/100 `#E0E3F1` | Violet/100 `#E0E3F1` | Violet/100 `#E0E3F1` | Violet/100 `#E0E3F1` |
| `Surface/Brand/Low_Contrast/Crabtree_Green_Accent/Default` | `Colour/Brand_Tints/Crabtree` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` |
| `Surface/Brand/Low_Contrast/Standard_Blue_Accent/Default` | `Colour/Brand_Tints/Standard` | Blue/200 `#AFDAF4` | Blue/200 `#AFDAF4` | Blue/200 `#AFDAF4` | Blue/200 `#AFDAF4` | Blue/200 `#AFDAF4` |
| `Surface/Status/Success/High_Contrast/Default` | — | Green/750 `#29854F` | Green/750 `#29854F` | Green/750 `#29854F` | Green/600 `#37B36B` | Green/600 `#37B36B` |
| `Surface/Status/Success/Low_Contrast/Default` | — | Green/50 `#EBF9F1` | Green/50 `#EBF9F1` | Green/50 `#EBF9F1` | Green/900 `#174A2C` | Green/900 `#174A2C` |
| `Surface/Status/Error/High_Contrast/Default` | — | Red/600 `#EB0014` | Red/600 `#EB0014` | Red/600 `#EB0014` | Red/600 `#EB0014` | Red/600 `#EB0014` |
| `Surface/Status/Error/Low_Contrast/Default` | — | Red/50 `#FFE5E8` | Red/50 `#FFE5E8` | Red/50 `#FFE5E8` | Red/900 `#610008` | Red/900 `#610008` |
| `Surface/Status/Warning/High_Contrast/Default` | — | Orange/700 `#B2480A` | Orange/700 `#B2480A` | Orange/700 `#B2480A` | Orange/700 `#B2480A` | Orange/700 `#B2480A` |
| `Surface/Status/Warning/Low_Contrast/Default` | — | Orange/50 `#FEEFE7` | Orange/50 `#FEEFE7` | Orange/50 `#FEEFE7` | Orange/900 `#5C2505` | Orange/900 `#5C2505` |
| `Surface/Status/Information/Low_Contrast/Default` | — | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` |
| `Surface/Status/AQI/Good` | — | Green/400 `#73D49B` | Green/400 `#73D49B` | Green/400 `#73D49B` | Green/400 `#73D49B` | Green/400 `#73D49B` |
| `Surface/Status/AQI/Satisfactory` | — | Yellow/400 `#FFC814` | Yellow/400 `#FFC814` | Yellow/400 `#FFC814` | Yellow/400 `#FFC814` | Yellow/400 `#FFC814` |
| `Surface/Status/AQI/Moderate` | — | Orange/300 `#F7AA7D` | Orange/300 `#F7AA7D` | Orange/300 `#F7AA7D` | Orange/300 `#F7AA7D` | Orange/300 `#F7AA7D` |
| `Surface/Status/AQI/Poor` | — | Purple/200 `#E6B1F2` | Purple/200 `#E6B1F2` | Purple/200 `#E6B1F2` | Purple/200 `#E6B1F2` | Purple/200 `#E6B1F2` |
| `Surface/Status/AQI/Very_Poor` | — | Red/200 `#FFA3AB` | Red/200 `#FFA3AB` | Red/200 `#FFA3AB` | Red/200 `#FFA3AB` | Red/200 `#FFA3AB` |
| `Surface/E_Commerce/Promo_Highlights/High_Contrast/Default` | — | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/800 `#68157A` |
| `Surface/E_Commerce/Promo_Highlights/Low_Contrast/Default` | — | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` | Purple/900 `#460E53` | Purple/900 `#460E53` |

### Text

| Token | Aliases | Platform | Product | Lux | Loyalty | Studio |
|---|---|---|---|---|---|---|
| `Text/Neutral/On_Low_Contrast/High_Emphasis/Default` | — | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default` | — | Neutral/700 `#5E5E5E` | Neutral/700 `#5E5E5E` | Lux/600 `#655436` | Loyalty Secondary/50 `#F1F1F4` | Neutral/100 `#E8E8E8` |
| `Text/Neutral/On_High_Contrast/High_Emphasis/Default` | `Colour/Neutral/White` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/0 `#FFFFFF` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Text/Neutral/On_High_Contrast/Low_Emphasis/Default` | — | Neutral/100 `#E8E8E8` | Neutral/100 `#E8E8E8` | Lux/300 `#D1D1D1` | Loyalty Secondary/800 `#40404F` | Neutral/800 `#474747` |
| `Text/Brand/Havells_Red/On_Neutral/Low_Contrast/Default` | — | Red/650 `#DA251D` | Red/650 `#DA251D` | Red/700 `#BD0010` | Red/50 `#FFE5E8` | Gold/100 `#F0EBE0` |
| `Text/Brand/Lloyd_Blue/On_Neutral/Low_Contrast/Default` | — | Violet/750 `#263884` | Violet/750 `#263884` | Violet/750 `#263884` | Violet/50 `#EEEFF7` | Violet/50 `#EEEFF7` |
| `Text/Brand/Crabtree_Green/On_Neutral/Low_Contrast/Default` | — | Green/800 `#226D41` | Green/800 `#226D41` | Green/900 `#174A2C` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` |
| `Text/Brand/Standard_Blue/On_Neutral/Low_Contrast/Default` | — | Blue/700 `#1871A5` | Blue/700 `#1871A5` | Blue/800 `#12567D` | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` |
| `Text/Brand/Havells_Red/On_Brand_Low_Contrast/Default` | — | Red/900 `#610008` | Red/900 `#610008` | Red/900 `#610008` | Red/900 `#610008` | Gold/800 `#5F5230` |
| `Text/Brand/Lloyd_Blue/On_Brand_Low_Contrast/Default` | — | Violet/900 `#1F2542` | Violet/900 `#1F2542` | Violet/900 `#1F2542` | Violet/900 `#1F2542` | Violet/900 `#1F2542` |
| `Text/Brand/Crabtree_Green/On_Brand_Low_Contrast/Default` | — | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/900 `#174A2C` |
| `Text/Brand/Standard_Blue/On_Brand_Low_Contrast/Default` | — | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` |
| `Text/Brand/Havells_Red/On_Brand_High_Contrast/Default` | — | Red/50 `#FFE5E8` | Red/50 `#FFE5E8` | Red/50 `#FFE5E8` | Red/900 `#610008` | Gold/800 `#5F5230` |
| `Text/Brand/Lloyd_Blue/On_Brand_High_Contrast/Default` | — | Violet/50 `#EEEFF7` | Violet/50 `#EEEFF7` | Violet/50 `#EEEFF7` | Violet/900 `#1F2542` | Violet/900 `#1F2542` |
| `Text/Brand/Crabtree_Green/On_Brand_High_Contrast/Default` | — | Green/50 `#EBF9F1` | Green/50 `#EBF9F1` | Green/50 `#EBF9F1` | Green/900 `#174A2C` | Green/900 `#174A2C` |
| `Text/Brand/Standard_Blue/On_Brand_High_Contrast/Default` | — | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` |
| `Text/On_Brand_High_Contrast/Havells_Red/High_Emphasis/Default` | — | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/900 `#181818` | Neutral/900 `#181818` |
| `Text/On_Brand_High_Contrast/Lloyd_Blue/High_Emphasis/Default` | — | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/900 `#181818` | Neutral/900 `#181818` |
| `Text/On_Brand_High_Contrast/Crabtree_Green/High_Emphasis/Default` | — | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/900 `#181818` | Neutral/900 `#181818` |
| `Text/On_Brand_High_Contrast/Standard_Blue/High_Emphasis/Default` | — | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/900 `#181818` | Neutral/900 `#181818` |
| `Text/Status/Success/On_Neutral/Low_Contrast/High_Emphasis/Default` | — | Green/800 `#226D41` | Green/800 `#226D41` | Green/900 `#174A2C` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` |
| `Text/Status/Success/On_Status_Low_Contrast/High_Emphasis/Default` | — | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/200 `#B9E9CD` | Green/200 `#B9E9CD` |
| `Text/Status/Success/On_Status_High_Contrast/Default` | — | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/900 `#181818` | Neutral/900 `#181818` |
| `Text/Status/Error/On_Neutral/Low_Contrast/High_Emphasis/Default` | — | Red/650 `#DA251D` | Red/650 `#DA251D` | Red/700 `#BD0010` | Red/50 `#FFE5E8` | Red/50 `#FFE5E8` |
| `Text/Status/Error/On_Status_Low_Contrast/High_Emphasis/Default` | — | Red/800 `#8F000C` | Red/800 `#8F000C` | Red/800 `#8F000C` | Red/200 `#FFA3AB` | Red/200 `#FFA3AB` |
| `Text/Status/Error/On_Status_High_Contrast/Default` | — | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Text/Status/Warning/On_Neutral/Low_Contrast/High_Emphasis/Default` | — | Orange/700 `#B2480A` | Orange/700 `#B2480A` | Orange/800 `#873608` | Orange/50 `#FEEFE7` | Orange/50 `#FEEFE7` |
| `Text/Status/Warning/On_Status_Low_Contrast/High_Emphasis/Default` | — | Orange/900 `#5C2505` | Orange/900 `#5C2505` | Orange/900 `#5C2505` | Orange/200 `#FAC6A8` | Orange/200 `#FAC6A8` |
| `Text/Status/Warning/On_Status_High_Contrast/Default` | — | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Text/Status/Information/On_Neutral/Low_Contrast/High_Emphasis/Default` | — | Blue/700 `#1871A5` | Blue/700 `#1871A5` | Blue/800 `#12567D` | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` |
| `Text/Status/Information/On_Status_Low_Contrast/High_Emphasis/Default` | — | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` | Blue/200 `#AFDAF4` | Blue/200 `#AFDAF4` |
| `Text/Status/AQI/Good` | — | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/50 `#EBF9F1` | Green/50 `#EBF9F1` |
| `Text/Status/AQI/Satisfactory` | — | Yellow/800 `#5C4600` | Yellow/800 `#5C4600` | Yellow/800 `#5C4600` | Yellow/50 `#FFEDB3` | Yellow/50 `#FFEDB3` |
| `Text/Status/AQI/Moderate` | — | Orange/900 `#5C2505` | Orange/900 `#5C2505` | Orange/900 `#5C2505` | Orange/50 `#FEEFE7` | Orange/50 `#FEEFE7` |
| `Text/Status/AQI/Poor` | — | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` |
| `Text/Status/AQI/Very_Poor` | — | Red/800 `#8F000C` | Red/800 `#8F000C` | Red/800 `#8F000C` | Red/50 `#FFE5E8` | Red/50 `#FFE5E8` |
| `Text/E_Commerce/Promo_Highlights/On_Neutral/Low_Contrast/Default` | — | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` |
| `Text/E_Commerce/Promo_Highlights/On_Neutral/High_Contrast/Default` | — | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` |

### Icon — every row is an alias of its Text twin

| Token | Aliases | Platform | Product | Lux | Loyalty | Studio |
|---|---|---|---|---|---|---|
| `Icon/On_Neutral/Low_Contrast/High_Emphasis/Default` | `Text/Neutral/On_Low_Contrast/High_Emphasis/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Icon/On_Neutral/Low_Contrast/Low_Emphasis/Default` | `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default` | Neutral/700 `#5E5E5E` | Neutral/700 `#5E5E5E` | Lux/600 `#655436` | Loyalty Secondary/50 `#F1F1F4` | Neutral/100 `#E8E8E8` |
| `Icon/On_Neutral/High_Contrast/High_Emphasis/Default` | `Text/Neutral/On_High_Contrast/High_Emphasis/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/0 `#FFFFFF` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Icon/On_Neutral/High_Contrast/Low_Emphasis/Default` | `Text/Neutral/On_High_Contrast/Low_Emphasis/Default` | Neutral/100 `#E8E8E8` | Neutral/100 `#E8E8E8` | Lux/300 `#D1D1D1` | Loyalty Secondary/800 `#40404F` | Neutral/800 `#474747` |
| `Icon/Brand/Havells_Red/On_Neutral/Low_Contrast/Default` | `Text/Brand/Havells_Red/On_Neutral/Low_Contrast/Default` | Red/650 `#DA251D` | Red/650 `#DA251D` | Red/700 `#BD0010` | Red/50 `#FFE5E8` | Gold/100 `#F0EBE0` |
| `Icon/Brand/Havells_Red/On_Brand_High_Contrast/Default` | `Text/Brand/Havells_Red/On_Brand_High_Contrast/Default` | Red/50 `#FFE5E8` | Red/50 `#FFE5E8` | Red/50 `#FFE5E8` | Red/900 `#610008` | Gold/800 `#5F5230` |
| `Icon/Brand/Havells_Red/On_Brand_Low_Contrast/Default` | `Text/Brand/Havells_Red/On_Brand_Low_Contrast/Default` | Red/900 `#610008` | Red/900 `#610008` | Red/900 `#610008` | Red/900 `#610008` | Gold/800 `#5F5230` |
| `Icon/Brand/Lloyd_Blue/On_Neutral/Low_Contrast/Default` | `Text/Brand/Lloyd_Blue/On_Neutral/Low_Contrast/Default` | Violet/750 `#263884` | Violet/750 `#263884` | Violet/750 `#263884` | Violet/50 `#EEEFF7` | Violet/50 `#EEEFF7` |
| `Icon/Brand/Lloyd_Blue/On_Brand_High_Contrast/Default` | `Text/Brand/Lloyd_Blue/On_Brand_High_Contrast/Default` | Violet/50 `#EEEFF7` | Violet/50 `#EEEFF7` | Violet/50 `#EEEFF7` | Violet/900 `#1F2542` | Violet/900 `#1F2542` |
| `Icon/Brand/Lloyd_Blue/On_Brand_Low_Contrast/Default` | `Text/Brand/Lloyd_Blue/On_Brand_Low_Contrast/Default` | Violet/900 `#1F2542` | Violet/900 `#1F2542` | Violet/900 `#1F2542` | Violet/900 `#1F2542` | Violet/900 `#1F2542` |
| `Icon/Brand/Crabtree_Green/On_Neutral/Low_Contrast/Default` | `Text/Brand/Crabtree_Green/On_Neutral/Low_Contrast/Default` | Green/800 `#226D41` | Green/800 `#226D41` | Green/900 `#174A2C` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` |
| `Icon/Brand/Crabtree_Green/On_Brand_High_Contrast/Default` | `Text/Brand/Crabtree_Green/On_Brand_High_Contrast/Default` | Green/50 `#EBF9F1` | Green/50 `#EBF9F1` | Green/50 `#EBF9F1` | Green/900 `#174A2C` | Green/900 `#174A2C` |
| `Icon/Brand/Crabtree_Green/On_Brand_Low_Contrast/Default` | `Text/Brand/Crabtree_Green/On_Brand_Low_Contrast/Default` | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/900 `#174A2C` |
| `Icon/Brand/Standard_Blue/On_Neutral/Low_Contrast/Default` | `Text/Brand/Standard_Blue/On_Neutral/Low_Contrast/Default` | Blue/700 `#1871A5` | Blue/700 `#1871A5` | Blue/800 `#12567D` | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` |
| `Icon/Brand/Standard_Blue/On_Brand_High_Contrast/Default` | `Text/Brand/Standard_Blue/On_Brand_High_Contrast/Default` | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` |
| `Icon/Brand/Standard_Blue/On_Brand_Low_Contrast/Default` | `Text/Brand/Standard_Blue/On_Brand_Low_Contrast/Default` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` |
| `Icon/On_Brand_High_Contrast/Havells_Red/High_Emphasis/Default` | `Text/On_Brand_High_Contrast/Havells_Red/High_Emphasis/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/900 `#181818` | Neutral/900 `#181818` |
| `Icon/On_Brand_High_Contrast/Lloyd_Blue/High_Emphasis/Default` | `Text/On_Brand_High_Contrast/Lloyd_Blue/High_Emphasis/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/900 `#181818` | Neutral/900 `#181818` |
| `Icon/On_Brand_High_Contrast/Crabtree_Green/High_Emphasis/Default` | `Text/On_Brand_High_Contrast/Crabtree_Green/High_Emphasis/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/900 `#181818` | Neutral/900 `#181818` |
| `Icon/On_Brand_High_Contrast/Standard_Blue/High_Emphasis/Default` | `Text/On_Brand_High_Contrast/Standard_Blue/High_Emphasis/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/900 `#181818` | Neutral/900 `#181818` |
| `Icon/Status/Success/On_Neutral/Low_Contrast/High_Emphasis/Default` | `Text/Status/Success/On_Neutral/Low_Contrast/High_Emphasis/Default` | Green/800 `#226D41` | Green/800 `#226D41` | Green/900 `#174A2C` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` |
| `Icon/Status/Success/On_Status_Low_Contrast/High_Emphasis/Default` | `Text/Status/Success/On_Status_Low_Contrast/High_Emphasis/Default` | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/200 `#B9E9CD` | Green/200 `#B9E9CD` |
| `Icon/Status/Success/On_Status_High_Contrast/Default` | `Text/Status/Success/On_Status_High_Contrast/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/900 `#181818` | Neutral/900 `#181818` |
| `Icon/Status/Error/On_Neutral/Low_Contrast/High_Emphasis/Default` | `Text/Status/Error/On_Neutral/Low_Contrast/High_Emphasis/Default` | Red/650 `#DA251D` | Red/650 `#DA251D` | Red/700 `#BD0010` | Red/50 `#FFE5E8` | Red/50 `#FFE5E8` |
| `Icon/Status/Error/On_Status_Low_Contrast/High_Emphasis/Default` | `Text/Status/Error/On_Status_Low_Contrast/High_Emphasis/Default` | Red/800 `#8F000C` | Red/800 `#8F000C` | Red/800 `#8F000C` | Red/200 `#FFA3AB` | Red/200 `#FFA3AB` |
| `Icon/Status/Error/On_Status_High_Contrast/Default` | `Text/Status/Error/On_Status_High_Contrast/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Icon/Status/Warning/On_Neutral/Low_Contrast/High_Emphasis/Default` | `Text/Status/Warning/On_Neutral/Low_Contrast/High_Emphasis/Default` | Orange/700 `#B2480A` | Orange/700 `#B2480A` | Orange/800 `#873608` | Orange/50 `#FEEFE7` | Orange/50 `#FEEFE7` |
| `Icon/Status/Warning/On_Status_Low_Contrast/High_Emphasis/Default` | `Text/Status/Warning/On_Status_Low_Contrast/High_Emphasis/Default` | Orange/900 `#5C2505` | Orange/900 `#5C2505` | Orange/900 `#5C2505` | Orange/200 `#FAC6A8` | Orange/200 `#FAC6A8` |
| `Icon/Status/Warning/On_Status_High_Contrast/Default` | `Text/Status/Warning/On_Status_High_Contrast/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Icon/Status/Information/On_Neutral/Low_Contrast/High_Emphasis/Default` | `Text/Status/Information/On_Neutral/Low_Contrast/High_Emphasis/Default` | Blue/700 `#1871A5` | Blue/700 `#1871A5` | Blue/800 `#12567D` | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` |
| `Icon/Status/Information/On_Status_Low_Contrast/High_Emphasis/Default` | `Text/Status/Information/On_Status_Low_Contrast/High_Emphasis/Default` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` | Blue/900 `#0C3A55` | Blue/200 `#AFDAF4` | Blue/200 `#AFDAF4` |
| `Icon/Status/AQI/Good` | `Text/Status/AQI/Good` | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/900 `#174A2C` | Green/50 `#EBF9F1` | Green/50 `#EBF9F1` |
| `Icon/Status/AQI/Satisfactory` | `Text/Status/AQI/Satisfactory` | Yellow/800 `#5C4600` | Yellow/800 `#5C4600` | Yellow/800 `#5C4600` | Yellow/50 `#FFEDB3` | Yellow/50 `#FFEDB3` |
| `Icon/Status/AQI/Moderate` | `Text/Status/AQI/Moderate` | Orange/900 `#5C2505` | Orange/900 `#5C2505` | Orange/900 `#5C2505` | Orange/50 `#FEEFE7` | Orange/50 `#FEEFE7` |
| `Icon/Status/AQI/Poor` | `Text/Status/AQI/Poor` | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` |
| `Icon/Status/AQI/Very_Poor` | `Text/Status/AQI/Very_Poor` | Red/800 `#8F000C` | Red/800 `#8F000C` | Red/800 `#8F000C` | Red/50 `#FFE5E8` | Red/50 `#FFE5E8` |
| `Icon/E_Commerce/Promo_Highlights/On_Neutral/Low_Contrast/Default` | `Text/E_Commerce/Promo_Highlights/On_Neutral/Low_Contrast/Default` | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` |
| `Icon/E_Commerce/Promo_Highlights/On_Neutral/High_Contrast/Default` | `Text/E_Commerce/Promo_Highlights/On_Neutral/High_Contrast/Default` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` |

### Stroke

| Token | Aliases | Platform | Product | Lux | Loyalty | Studio |
|---|---|---|---|---|---|---|
| `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default` | — | Neutral/200 `#D1D1D1` | Neutral/200 `#D1D1D1` | Neutral/300 `#BABABA` | Neutral/800 `#474747` | Gold/150 `#E5DECF` |
| `Stroke/On_Neutral/Low_Contrast/Stroke_2/Default` | — | Neutral/600 `#757575` | Neutral/600 `#757575` | Lux/600 `#655436` | Loyalty Secondary/100 `#E6E6EB` | Gold/350 `#C6B68D` |
| `Stroke/On_Neutral/Low_Contrast/Stroke_3/Default` | — | Neutral/800 `#474747` | Neutral/800 `#474747` | Lux/700 `#291E0C` | Loyalty Secondary/200 `#CCCCD6` | Neutral/800 `#474747` |
| `Stroke/On_Neutral/High_Contrast/Stroke_1/Default` | — | Neutral/50 `#F2F2F2` | Neutral/50 `#F2F2F2` | Lux/0 `#FFFFFF` | Loyalty Secondary/100 `#E6E6EB` | Neutral/0 `#FFFFFF` |
| `Stroke/On_Neutral/High_Contrast/Stroke_2/Default` | — | Neutral/100 `#E8E8E8` | Neutral/100 `#E8E8E8` | Lux/300 `#D1D1D1` | Loyalty Secondary/800 `#40404F` | Neutral/100 `#E8E8E8` |
| `Stroke/On_Neutral/High_Contrast/Stroke_3/Default` | — | Neutral/700 `#5E5E5E` | Neutral/700 `#5E5E5E` | Lux/600 `#655436` | Neutral/1000 `#000000` | Neutral/800 `#474747` |
| `Stroke/Focus/Default` | `Component/Button/Filled/Surface/Gradient_1` | Red/700 `#BD0010` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Primary/Base `#DCA434` | Gold/600 `#9C864F` |
| `Stroke/Brand/High_Contrast/Havells_Red/Default` | `Surface/Brand/High_Contrast/Havells_Red/Default` | Red/700 `#BD0010` | Red/700 `#BD0010` | Red/700 `#BD0010` | Red/300 `#FF7581` | Red/300 `#FF7581` |
| `Stroke/Brand/High_Contrast/Lloyd_Blue/Default` | `Surface/Brand/High_Contrast/Lloyd_Blue/Default` | Violet/750 `#263884` | Violet/750 `#263884` | Violet/750 `#263884` | Violet/400 `#818EC5` | Violet/300 `#A1AAD4` |
| `Stroke/Brand/High_Contrast/Crabtree_Green/Default` | `Surface/Brand/High_Contrast/Crabtree_Green/Default` | Green/800 `#226D41` | Green/800 `#226D41` | Green/800 `#226D41` | Green/400 `#73D49B` | Green/400 `#73D49B` |
| `Stroke/Brand/High_Contrast/Standard_Blue/Default` | `Surface/Brand/High_Contrast/Standard_Blue/Default` | Blue/700 `#1871A5` | Blue/700 `#1871A5` | Blue/700 `#1871A5` | Blue/400 `#5EB6E8` | Blue/400 `#5EB6E8` |
| `Stroke/Brand/High_Contrast/Product_Black/Default` | `Colour/Brand/Product` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/600 `#655436` | Loyalty Primary/Base `#DCA434` | Loyalty Primary/Base `#DCA434` |
| `Stroke/Brand/Low_Contrast/Havells_Red_Accent/Default` | `Surface/Brand/Low_Contrast/Havells_Red_Accent/Default` | Red/100 `#FFD1D5` | Red/100 `#FFD1D5` | Red/100 `#FFD1D5` | Red/100 `#FFD1D5` | Red/100 `#FFD1D5` |
| `Stroke/Brand/Low_Contrast/Lloyd_Blue_Accent/Default` | `Surface/Brand/Low_Contrast/Lloyd_Blue_Accent/Default` | Violet/100 `#E0E3F1` | Violet/100 `#E0E3F1` | Violet/100 `#E0E3F1` | Violet/100 `#E0E3F1` | Violet/100 `#E0E3F1` |
| `Stroke/Brand/Low_Contrast/Crabtree_Green_Accent/Default` | `Surface/Brand/Low_Contrast/Crabtree_Green_Accent/Default` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` | Green/100 `#DCF4E6` |
| `Stroke/Brand/Low_Contrast/Standard_Blue_Accent/Default` | `Surface/Brand/Low_Contrast/Standard_Blue_Accent/Default` | Blue/200 `#AFDAF4` | Blue/200 `#AFDAF4` | Blue/200 `#AFDAF4` | Blue/200 `#AFDAF4` | Blue/200 `#AFDAF4` |
| `Stroke/Brand/Low_Contrast/Product_Black/Default` | `Colour/Brand/Product` | Neutral/900 `#181818` | Neutral/900 `#181818` | Neutral/900 `#181818` | Neutral/900 `#181818` | Neutral/900 `#181818` |
| `Stroke/Status/Success/High_Contrast/Default` | `Surface/Status/Success/High_Contrast/Default` | Green/750 `#29854F` | Green/750 `#29854F` | Green/750 `#29854F` | Green/600 `#37B36B` | Green/600 `#37B36B` |
| `Stroke/Status/Success/Low_Contrast/Default` | — | Green/100 `#DCF4E6` | Green/300 `#96DFB4` | Green/100 `#DCF4E6` | Green/300 `#96DFB4` | Green/300 `#96DFB4` |
| `Stroke/Status/Error/High_Contrast/Default` | `Surface/Status/Error/High_Contrast/Default` | Red/600 `#EB0014` | Red/600 `#EB0014` | Red/600 `#EB0014` | Red/600 `#EB0014` | Red/600 `#EB0014` |
| `Stroke/Status/Error/Low_Contrast/Default` | — | Red/200 `#FFA3AB` | Red/400 `#FF4757` | Red/200 `#FFA3AB` | Red/400 `#FF4757` | Red/400 `#FF4757` |
| `Stroke/Status/Warning/High_Contrast/Default` | `Surface/Status/Warning/High_Contrast/Default` | Orange/700 `#B2480A` | Orange/700 `#B2480A` | Orange/700 `#B2480A` | Orange/700 `#B2480A` | Orange/700 `#B2480A` |
| `Stroke/Status/Warning/Low_Contrast/Default` | — | Skin/100 `#F9E5D7` | Skin/100 `#F9E5D7` | Skin/100 `#F9E5D7` | Skin/100 `#F9E5D7` | Skin/100 `#F9E5D7` |
| `Stroke/Status/Information/High_Contrast/Default` | — | Blue/800 `#12567D` | Blue/800 `#12567D` | Blue/800 `#12567D` | Blue/800 `#12567D` | Blue/800 `#12567D` |
| `Stroke/Status/Information/Low_Contrast/Default` | — | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` | Blue/50 `#E9F5FC` |
| `Stroke/E_Commerce/Promo_Highlights/High_Contrast/Default` | `Surface/E_Commerce/Promo_Highlights/High_Contrast/Default` | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/800 `#68157A` | Purple/800 `#68157A` |
| `Stroke/E_Commerce/Promo_Highlights/Low_Contrast/Default` | `Surface/E_Commerce/Promo_Highlights/Low_Contrast/Default` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` | Purple/50 `#F8E9FB` | Purple/900 `#460E53` | Purple/900 `#460E53` |

`Stroke/Status/*/Low_Contrast` and `Stroke/Status/Information/*` differ from
the "one step darker than the banner surface" rule in §7B, and
`Stroke/Status/Success|Error/Low_Contrast` differ between Platform and Product
where nothing else does. Both are recorded as needing a ruling. Bind them as
they are.

### Component — Button, Selection Control, List Item, Switch, Header, Tabs, Bottom Navigation, Day Picker (v1.3)

| Token | Aliases | Platform | Product | Lux | Loyalty | Studio |
|---|---|---|---|---|---|---|
| `Component/Button/Filled/Surface/Gradient_1` | `Surface/Brand/High_Contrast/Havells_Red/Default` | Red/700 `#BD0010` | Neutral/900 `#181818` | Lux/400 `#AEA28A` | Loyalty Primary/Base `#DCA434` | Gold/350 `#C6B68D` |
| `Component/Button/Filled/Surface/Gradient_2` | `Surface/Brand/High_Contrast/Havells_Red/Default` | Red/700 `#BD0010` | Neutral/900 `#181818` | Lux/500 `#81745C` | Loyalty Primary/700 `#A0741C` | Loyalty Primary/700 `#A0741C` |
| `Component/Button/Filled/Text/Default` | `Text/Neutral/On_High_Contrast/High_Emphasis/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/0 `#FFFFFF` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Button/Filled/Icon/Default` | `Component/Button/Filled/Text/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/0 `#FFFFFF` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Button/Filled/Overlay/Hover` | — | Opacity/Red/5 `#DA251D @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Button/Outlined/Surface/Default` | — | Opacity/Neutral - Light/5 `#FFFFFF @5%` | Opacity/Neutral - Light/5 `#FFFFFF @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Neutral - Dark/0 `#181818 @0%` | Opacity/Neutral - Dark/0 `#181818 @0%` |
| `Component/Button/Outlined/Stroke/Default` | `Stroke/Brand/High_Contrast/Havells_Red/Default` | Red/700 `#BD0010` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Primary/Base `#DCA434` | Gold/350 `#C6B68D` |
| `Component/Button/Outlined/Text/Default` | `Text/Brand/Havells_Red/On_Neutral/Low_Contrast/Default` | Red/650 `#DA251D` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Primary/Base `#DCA434` | Gold/100 `#F0EBE0` |
| `Component/Button/Outlined/Icon/Default` | `Component/Button/Outlined/Text/Default` | Red/650 `#DA251D` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Primary/Base `#DCA434` | Gold/100 `#F0EBE0` |
| `Component/Button/Outlined/Overlay/Hover` | — | Opacity/Red/10 `#DA251D @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Button/Outlined/Overlay/Pressed` | — | Opacity/Red/5 `#DA251D @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Button/Text/Text/Default` | `Component/Button/Outlined/Text/Default` | Red/650 `#DA251D` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Primary/Base `#DCA434` | Gold/100 `#F0EBE0` |
| `Component/Button/Text/Icon/Default` | `Component/Button/Text/Text/Default` | Red/650 `#DA251D` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Primary/Base `#DCA434` | Gold/100 `#F0EBE0` |
| `Component/Button/Text/Overlay/Hover` | — | Opacity/Red/10 `#DA251D @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Button/Text/Overlay/Pressed` | — | Opacity/Red/5 `#DA251D @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Selection_Control/Icon/Selected/Default` | `Surface/Brand/High_Contrast/Havells_Red/Default` | Red/700 `#BD0010` | Neutral/900 `#181818` | Lux/600 `#655436` | Loyalty Primary/500 `#DDA73C` | Gold/350 `#C6B68D` |
| `Component/Selection_Control/Overlay/Hover` | — | Opacity/Red/10 `#DA251D @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Selection_Control/Overlay/Pressed` | — | Opacity/Red/5 `#DA251D @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/List_Item/Overlay/Hover` | — | Opacity/Red/10 `#DA251D @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/List_Item/Overlay/Pressed` | — | Opacity/Red/5 `#DA251D @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/List_Item/Overlay/Selected` | — | Opacity/Red/10 `#DA251D @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Switch/Track/On/Default` | `Component/Selection_Control/Icon/Selected/Default` | Red/700 `#BD0010` | Neutral/900 `#181818` | Lux/600 `#655436` | Loyalty Primary/500 `#DDA73C` | Gold/350 `#C6B68D` |
| `Component/Switch/Track/Off/Surface/Default` | — | Neutral/200 `#D1D1D1` | Neutral/200 `#D1D1D1` | Lux/350 `#D9D5CA` | Loyalty Secondary/800 `#40404F` | Neutral/800 `#474747` |
| `Component/Switch/Track/Off/Stroke/Default` | `Stroke/On_Neutral/Low_Contrast/Stroke_3/Default` | Neutral/800 `#474747` | Neutral/800 `#474747` | Lux/600 `#655436` | Loyalty Primary/Base `#DCA434` | Gold/350 `#C6B68D` |
| `Component/Switch/Handle/On/Default` | `Component/Button/Filled/Text/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/0 `#FFFFFF` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Switch/Handle/Off/Default` | `Surface/Neutral/High_Contrast/Surface_3/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/600 `#655436` | Loyalty Primary/500 `#DDA73C` | Gold/350 `#C6B68D` |
| `Component/Switch/Overlay/Hover` | `Component/Selection_Control/Overlay/Hover` | Opacity/Red/10 `#DA251D @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Switch/Overlay/Pressed` | `Component/Selection_Control/Overlay/Pressed` | Opacity/Red/5 `#DA251D @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Header/Surface/Default` | `Surface/Neutral/Low_Contrast/Surface_1/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/100 `#F0F0EF` | Loyalty Secondary/600 `#686882` | Neutral/700 `#5E5E5E` |
| `Component/Header/Text/Default` | `Text/Neutral/On_Low_Contrast/High_Emphasis/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Component/Header/Text/Subtitle` | `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default` | Neutral/700 `#5E5E5E` | Neutral/700 `#5E5E5E` | Lux/600 `#655436` | Loyalty Secondary/50 `#F1F1F4` | Neutral/100 `#E8E8E8` |
| `Component/Header/Icon/Default` | `Icon/On_Neutral/Low_Contrast/High_Emphasis/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Component/Header/Overlay/Hover` | — | Opacity/Red/10 `#DA251D @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Header/Overlay/Pressed` | — | Opacity/Red/5 `#DA251D @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Tabs/Surface/Default` | `Surface/Neutral/Low_Contrast/Surface_1/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/100 `#F0F0EF` | Loyalty Secondary/600 `#686882` | Neutral/700 `#5E5E5E` |
| `Component/Tabs/Label/Selected` | `Text/Neutral/On_Low_Contrast/High_Emphasis/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Component/Tabs/Label/Unselected` | `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default` | Neutral/700 `#5E5E5E` | Neutral/700 `#5E5E5E` | Lux/600 `#655436` | Loyalty Secondary/50 `#F1F1F4` | Neutral/100 `#E8E8E8` |
| `Component/Tabs/Icon/Selected` | `Icon/On_Neutral/Low_Contrast/High_Emphasis/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Component/Tabs/Icon/Unselected` | `Icon/On_Neutral/Low_Contrast/Low_Emphasis/Default` | Neutral/700 `#5E5E5E` | Neutral/700 `#5E5E5E` | Lux/600 `#655436` | Loyalty Secondary/50 `#F1F1F4` | Neutral/100 `#E8E8E8` |
| `Component/Tabs/Indicator/Default` | `Component/Selection_Control/Icon/Selected/Default` | Red/700 `#BD0010` | Neutral/900 `#181818` | Lux/600 `#655436` | Loyalty Primary/500 `#DDA73C` | Gold/350 `#C6B68D` |
| `Component/Tabs/Divider/Default` | `Stroke/On_Neutral/Low_Contrast/Stroke_1/Default` | Neutral/200 `#D1D1D1` | Neutral/200 `#D1D1D1` | Neutral/300 `#BABABA` | Neutral/800 `#474747` | Gold/150 `#E5DECF` |
| `Component/Tabs/Overlay/Hover` | — | Opacity/Red/10 `#DA251D @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Tabs/Overlay/Pressed` | — | Opacity/Red/5 `#DA251D @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Bottom_Navigation/Surface/Default` | `Surface/Opacity/Light/Default` | Lux/300-50 `#D1D1D1 @50%` | Lux/300-50 `#D1D1D1 @50%` | Lux/300-50 `#D1D1D1 @50%` | Loyalty Secondary/500 `#808099 @50%` | Lux/500-50 `#81745C @50%` |
| `Component/Bottom_Navigation/Segment/Surface/Selected` | `Surface/Neutral/Low_Contrast/Surface_2/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/150 `#EBEBEA` | Loyalty Primary/500 `#DDA73C` | Gold/350 `#C6B68D` |
| `Component/Bottom_Navigation/Stroke/Default` | `Stroke/On_Neutral/High_Contrast/Stroke_1/Default` | Opacity/Neutral - Dark/0 `#181818 @0%` | Opacity/Neutral - Dark/0 `#181818 @0%` | Lux/0 `#FFFFFF` | Opacity/Neutral - Dark/0 `#181818 @0%` | Opacity/Neutral - Dark/0 `#181818 @0%` |
| `Component/Bottom_Navigation/Label/Selected` | `Text/Neutral/On_Low_Contrast/High_Emphasis/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Label/Unselected` | `Text/Neutral/On_Low_Contrast/Low_Emphasis/Default` | Neutral/700 `#5E5E5E` | Neutral/700 `#5E5E5E` | Lux/600 `#655436` | Loyalty Secondary/50 `#F1F1F4` | Neutral/100 `#E8E8E8` |
| `Component/Bottom_Navigation/Icon/Selected` | `Icon/On_Neutral/Low_Contrast/High_Emphasis/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Icon/Unselected` | `Icon/On_Neutral/Low_Contrast/Low_Emphasis/Default` | Neutral/700 `#5E5E5E` | Neutral/700 `#5E5E5E` | Lux/600 `#655436` | Loyalty Secondary/50 `#F1F1F4` | Neutral/100 `#E8E8E8` |
| `Component/Bottom_Navigation/Overlay/Hover` | `Component/Selection_Control/Overlay/Hover` | Opacity/Red/10 `#DA251D @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Bottom_Navigation/Overlay/Pressed` | `Component/Selection_Control/Overlay/Pressed` | Opacity/Red/5 `#DA251D @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Bottom_Navigation/Badge/Default` | `Component/Selection_Control/Icon/Selected/Default` | Red/700 `#BD0010` | Neutral/900 `#181818` | Lux/600 `#655436` | Neutral/0 `#FFFFFF` | Gold/350 `#C6B68D` |
| `Component/Bottom_Navigation/Brand/Havells_Red/Label/Selected` | `Text/Brand/Havells_Red/On_Neutral/Low_Contrast/Default` | Red/650 `#DA251D` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Brand/Havells_Red/Icon/Selected` | `Icon/Brand/Havells_Red/On_Neutral/Low_Contrast/Default` | Red/650 `#DA251D` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Brand/Havells_Red/Stroke/Selected` | `Stroke/Brand/High_Contrast/Havells_Red/Default` | Red/700 `#BD0010` | Neutral/900 `#181818` | Lux/0 `#FFFFFF` | Opacity/Neutral - Dark/0 `#181818 @0%` | Opacity/Neutral - Dark/0 `#181818 @0%` |
| `Component/Bottom_Navigation/Brand/Havells_Red/Overlay/Hover` | `Component/Selection_Control/Overlay/Hover` | Opacity/Red/10 `#DA251D @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Bottom_Navigation/Brand/Havells_Red/Overlay/Pressed` | `Component/Selection_Control/Overlay/Pressed` | Opacity/Red/5 `#DA251D @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Bottom_Navigation/Brand/Lloyd_Blue/Label/Selected` | `Text/Brand/Lloyd_Blue/On_Neutral/Low_Contrast/Default` | Violet/750 `#263884` | Violet/750 `#263884` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Brand/Lloyd_Blue/Icon/Selected` | `Icon/Brand/Lloyd_Blue/On_Neutral/Low_Contrast/Default` | Violet/750 `#263884` | Violet/750 `#263884` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Brand/Lloyd_Blue/Stroke/Selected` | `Stroke/Brand/High_Contrast/Lloyd_Blue/Default` | Violet/750 `#263884` | Violet/750 `#263884` | Lux/0 `#FFFFFF` | Opacity/Neutral - Dark/0 `#181818 @0%` | Opacity/Neutral - Dark/0 `#181818 @0%` |
| `Component/Bottom_Navigation/Brand/Lloyd_Blue/Overlay/Hover` | `Component/Selection_Control/Overlay/Hover` | Opacity/Violet/10 `#263884 @10%` | Opacity/Violet/10 `#263884 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Bottom_Navigation/Brand/Lloyd_Blue/Overlay/Pressed` | `Component/Selection_Control/Overlay/Pressed` | Opacity/Violet/5 `#263884 @5%` | Opacity/Violet/5 `#263884 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Bottom_Navigation/Brand/Crabtree_Green/Label/Selected` | `Text/Brand/Crabtree_Green/On_Neutral/Low_Contrast/Default` | Green/800 `#226D41` | Green/800 `#226D41` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Brand/Crabtree_Green/Icon/Selected` | `Icon/Brand/Crabtree_Green/On_Neutral/Low_Contrast/Default` | Green/800 `#226D41` | Green/800 `#226D41` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Brand/Crabtree_Green/Stroke/Selected` | `Stroke/Brand/High_Contrast/Crabtree_Green/Default` | Green/800 `#226D41` | Green/800 `#226D41` | Lux/0 `#FFFFFF` | Opacity/Neutral - Dark/0 `#181818 @0%` | Opacity/Neutral - Dark/0 `#181818 @0%` |
| `Component/Bottom_Navigation/Brand/Crabtree_Green/Overlay/Hover` | `Component/Selection_Control/Overlay/Hover` | Opacity/Green/10 `#29854F @10%` | Opacity/Green/10 `#29854F @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Bottom_Navigation/Brand/Crabtree_Green/Overlay/Pressed` | `Component/Selection_Control/Overlay/Pressed` | Opacity/Green/5 `#29854F @5%` | Opacity/Green/5 `#29854F @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Bottom_Navigation/Brand/Standard_Blue/Label/Selected` | `Text/Brand/Standard_Blue/On_Neutral/Low_Contrast/Default` | Blue/700 `#1871A5` | Blue/700 `#1871A5` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Brand/Standard_Blue/Icon/Selected` | `Icon/Brand/Standard_Blue/On_Neutral/Low_Contrast/Default` | Blue/700 `#1871A5` | Blue/700 `#1871A5` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Brand/Standard_Blue/Stroke/Selected` | `Stroke/Brand/High_Contrast/Standard_Blue/Default` | Blue/700 `#1871A5` | Blue/700 `#1871A5` | Lux/0 `#FFFFFF` | Opacity/Neutral - Dark/0 `#181818 @0%` | Opacity/Neutral - Dark/0 `#181818 @0%` |
| `Component/Bottom_Navigation/Brand/Standard_Blue/Overlay/Hover` | `Component/Selection_Control/Overlay/Hover` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Bottom_Navigation/Brand/Standard_Blue/Overlay/Pressed` | `Component/Selection_Control/Overlay/Pressed` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Bottom_Navigation/Brand/Product_Black/Label/Selected` | `Text/Neutral/On_Low_Contrast/High_Emphasis/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Brand/Product_Black/Icon/Selected` | `Icon/On_Neutral/Low_Contrast/High_Emphasis/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Bottom_Navigation/Brand/Product_Black/Stroke/Selected` | `Stroke/Brand/High_Contrast/Product_Black/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/0 `#FFFFFF` | Opacity/Neutral - Dark/0 `#181818 @0%` | Opacity/Neutral - Dark/0 `#181818 @0%` |
| `Component/Bottom_Navigation/Brand/Product_Black/Overlay/Hover` | `Component/Selection_Control/Overlay/Hover` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Bottom_Navigation/Brand/Product_Black/Overlay/Pressed` | `Component/Selection_Control/Overlay/Pressed` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |
| `Component/Day_Picker/Surface/Selected` | `Component/Selection_Control/Icon/Selected/Default` | Red/700 `#BD0010` | Neutral/900 `#181818` | Lux/600 `#655436` | Loyalty Primary/500 `#DDA73C` | Gold/350 `#C6B68D` |
| `Component/Day_Picker/Label/Default` | `Text/Neutral/On_Low_Contrast/High_Emphasis/Default` | Neutral/900 `#181818` | Neutral/900 `#181818` | Lux/700 `#291E0C` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Component/Day_Picker/Label/Selected` | `Component/Button/Filled/Text/Default` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Lux/0 `#FFFFFF` | Loyalty Secondary/900 `#2B2B36` | Neutral/900 `#181818` |
| `Component/Day_Picker/Label/Weekend` | `Text/Brand/Havells_Red/On_Neutral/Low_Contrast/Default` | Red/650 `#DA251D` | Red/650 `#DA251D` | Red/700 `#BD0010` | Red/50 `#FFE5E8` | Gold/100 `#F0EBE0` |
| `Component/Day_Picker/Overlay/Hover` | `Component/Selection_Control/Overlay/Hover` | Opacity/Red/10 `#DA251D @10%` | Opacity/Neutral - Dark/10 `#181818 @10%` | Opacity/Lux/10 `#655436 @10%` | Opacity/Loyalty/10 `#DCA434 @10%` | Opacity/Gold/10 `#C6B68D @10%` |
| `Component/Day_Picker/Overlay/Pressed` | `Component/Selection_Control/Overlay/Pressed` | Opacity/Red/5 `#DA251D @5%` | Opacity/Neutral - Dark/5 `#181818 @5%` | Opacity/Lux/5 `#655436 @5%` | Opacity/Loyalty/5 `#DCA434 @5%` | Opacity/Gold/5 `#C6B68D @5%` |

## B. `Device Illustration` collection

Modes `On` · `Off` · `Offline`. Composes with a `Colours` mode.

| Token | On | Off | Offline |
|---|---|---|---|
| `Illustration/Body_Dark` | Lux/600 `#655436` | Neutral/600 `#757575` | Neutral/500 `#8C8C8C` |
| `Illustration/Body_Light` | Yellow/700 `#8A6A00` | Neutral/500 `#8C8C8C` | Neutral/400 `#A3A3A3` |
| `Illustration/Accent` | Yellow/300 `#FFD342` | Neutral/300 `#BABABA` | Neutral/200 `#D1D1D1` |
| `Illustration/Shadow` | Lux/400 `#AEA28A` | Neutral/300 `#BABABA` | Neutral/300 `#BABABA` |
| `Illustration/Glow` | Blue/200 `#AFDAF4` | Blue/200 `#AFDAF4 @0%` | Blue/200 `#AFDAF4 @0%` |
| `Illustration/On_Colour` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` | Neutral/0 `#FFFFFF` |
| `Surface/Device/Card/Default` | Gold/150 `#E5DECF` | Neutral/100 `#E8E8E8` | Neutral/50 `#F2F2F2` |

The `On` values are nearest-primitive stand-ins for a warm ramp that does not
exist yet; the variable descriptions in Figma record the intended raw values.
Build against the values above.

## C. Primitives referenced by v1.3

Every primitive that some token above resolves to. **This is the only table a
hex literal may be copied from.** The library holds more steps than these; a
step existing there is not permission to use it — if no semantic role resolves
to it, it is not in the system.

| Ramp | Step | Value |
|---|---|---|
| Neutral | 0 | `#FFFFFF` |
| Neutral | 25 | `#F7F7F7` |
| Neutral | 50 | `#F2F2F2` |
| Neutral | 100 | `#E8E8E8` |
| Neutral | 200 | `#D1D1D1` |
| Neutral | 300 | `#BABABA` |
| Neutral | 400 | `#A3A3A3` |
| Neutral | 500 | `#8C8C8C` |
| Neutral | 600 | `#757575` |
| Neutral | 700 | `#5E5E5E` |
| Neutral | 800 | `#474747` |
| Neutral | 900 | `#181818` |
| Neutral | 1000 | `#000000` |
| Red | 50 | `#FFE5E8` |
| Red | 100 | `#FFD1D5` |
| Red | 200 | `#FFA3AB` |
| Red | 300 | `#FF7581` |
| Red | 400 | `#FF4757` |
| Red | 600 | `#EB0014` |
| Red | 650 | `#DA251D` |
| Red | 700 | `#BD0010` |
| Red | 800 | `#8F000C` |
| Red | 900 | `#610008` |
| Orange | 50 | `#FEEFE7` |
| Orange | 200 | `#FAC6A8` |
| Orange | 300 | `#F7AA7D` |
| Orange | 700 | `#B2480A` |
| Orange | 800 | `#873608` |
| Orange | 900 | `#5C2505` |
| Skin | 100 | `#F9E5D7` |
| Yellow | 50 | `#FFEDB3` |
| Yellow | 300 | `#FFD342` |
| Yellow | 400 | `#FFC814` |
| Yellow | 700 | `#8A6A00` |
| Yellow | 800 | `#5C4600` |
| Green | 50 | `#EBF9F1` |
| Green | 100 | `#DCF4E6` |
| Green | 200 | `#B9E9CD` |
| Green | 300 | `#96DFB4` |
| Green | 400 | `#73D49B` |
| Green | 600 | `#37B36B` |
| Green | 750 | `#29854F` |
| Green | 800 | `#226D41` |
| Green | 900 | `#174A2C` |
| Blue | 50 | `#E9F5FC` |
| Blue | 200 | `#AFDAF4` |
| Blue | 400 | `#5EB6E8` |
| Blue | 700 | `#1871A5` |
| Blue | 800 | `#12567D` |
| Blue | 900 | `#0C3A55` |
| Violet | 50 | `#EEEFF7` |
| Violet | 100 | `#E0E3F1` |
| Violet | 300 | `#A1AAD4` |
| Violet | 400 | `#818EC5` |
| Violet | 750 | `#263884` |
| Violet | 900 | `#1F2542` |
| Purple | 50 | `#F8E9FB` |
| Purple | 200 | `#E6B1F2` |
| Purple | 800 | `#68157A` |
| Purple | 900 | `#460E53` |
| Gold | 100 | `#F0EBE0` |
| Gold | 150 | `#E5DECF` |
| Gold | 350 | `#C6B68D` |
| Gold | 600 | `#9C864F` |
| Gold | 800 | `#5F5230` |
| Lux | 0 | `#FFFFFF` |
| Lux | 100 | `#F0F0EF` |
| Lux | 150 | `#EBEBEA` |
| Lux | 200 | `#E1E1DF` |
| Lux | 300 | `#D1D1D1` |
| Lux | 350 | `#D9D5CA` |
| Lux | 400 | `#AEA28A` |
| Lux | 500 | `#81745C` |
| Lux | 600 | `#655436` |
| Lux | 700 | `#291E0C` |
| Lux | 300-50 | `#D1D1D1 @50%` |
| Lux | 500-50 | `#81745C @50%` |
| Loyalty Primary | Base | `#DCA434` |
| Loyalty Primary | 500 | `#DDA73C` |
| Loyalty Primary | 700 | `#A0741C` |
| Loyalty Secondary | 50 | `#F1F1F4` |
| Loyalty Secondary | 100 | `#E6E6EB` |
| Loyalty Secondary | 200 | `#CCCCD6` |
| Loyalty Secondary | 300 | `#B3B3C2` |
| Loyalty Secondary | 500 | `#808099` |
| Loyalty Secondary | 600 | `#686882` |
| Loyalty Secondary | 700 | `#545469` |
| Loyalty Secondary | 800 | `#40404F` |
| Loyalty Secondary | 900 | `#2B2B36` |
| Opacity/Neutral - Dark | 0 | `#181818 @0%` |
| Opacity/Neutral - Dark | 5 | `#181818 @5%` |
| Opacity/Neutral - Dark | 10 | `#181818 @10%` |
| Opacity/Neutral - Dark | 60 | `#181818 @60%` |
| Opacity/Neutral - Light | 5 | `#FFFFFF @5%` |
| Opacity/Red | 5 | `#DA251D @5%` |
| Opacity/Red | 10 | `#DA251D @10%` |
| Opacity/Violet | 5 | `#263884 @5%` |
| Opacity/Violet | 10 | `#263884 @10%` |
| Opacity/Green | 5 | `#29854F @5%` |
| Opacity/Green | 10 | `#29854F @10%` |
| Opacity/Lux | 5 | `#655436 @5%` |
| Opacity/Lux | 10 | `#655436 @10%` |
| Opacity/Loyalty | 5 | `#DCA434 @5%` |
| Opacity/Loyalty | 10 | `#DCA434 @10%` |
| Opacity/Gold | 5 | `#C6B68D @5%` |
| Opacity/Gold | 10 | `#C6B68D @10%` |

Three ramps do not run monotonically — `Loyalty Secondary/1000` is lighter than
`/900`, `Lux/350` is lighter than `/300`, `Loyalty Primary/Base` is darker than
its `/600`. Do not derive "one step darker" from the numbers on those ramps.

## D. `_Base_Semantic_Library` — brand bases

Alias targets only. Single mode.

| Token | Value |
|---|---|
| `Colour/Neutral/White` | Neutral/0 `#FFFFFF` |
| `Colour/Neutral/Black` | Neutral/900 `#181818` |
| `Colour/Brand/Havells` | Red/650 `#DA251D` |
| `Colour/Brand/Lloyd` | Violet/750 `#263884` |
| `Colour/Brand/Crabtree` | Green/750 `#29854F` |
| `Colour/Brand/Standard` | Blue/700 `#1871A5` |
| `Colour/Brand/Studio` | Gold/350 `#C6B68D` |
| `Colour/Brand/Product` | Neutral/900 `#181818` |
| `Colour/Brand_Tints/Havells` | Red/100 `#FFD1D5` |
| `Colour/Brand_Tints/Lloyd` | Violet/100 `#E0E3F1` |
| `Colour/Brand_Tints/Crabtree` | Green/100 `#DCF4E6` |
| `Colour/Brand_Tints/Standard` | Blue/200 `#AFDAF4` |
| `Colour/Brand_Tints/Studio` | Gold/100 `#F0EBE0` |
| `Colour/Brand_Tints/Product` | Neutral/0 `#FFFFFF` |
