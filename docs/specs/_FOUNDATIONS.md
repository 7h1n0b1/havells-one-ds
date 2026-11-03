# Foundations

Shared rules every component in this folder depends on. Read this once. The
component files assume it and do not repeat it.

**Source of truth:** Figma file `Havells One — Component UI v1.3`, key
`pgOKFbALAAtm6NX5xTqxHO`. **Values** come from the Figma file objects — where a
value here disagrees with the variable or style it names, the object is right and
this document is a bug. **Rules** come from these files. Report any disagreement.

**Status vocabulary** used in every component file:

| Status | Means |
|---|---|
| `Ready` | Meets the design team's Definition of Ready and is signed off by the design owner. Build against it. |
| `In progress` | Being worked on. Do not build against it yet. |
| `Legacy` | Still published, still used, not rebuilt for v1.3. Shape will change. |
| `Deprecated` | Do not use in new work. The file names the replacement. |

---

## 1. Theming

v1.3 themes by **variable mode**, not by name prefix. The `Colours` collection
has five modes:

`Platform` · `Product` · `Lux` · `Loyalty` · `Studio`

A component binds the theme-free variable name. Switching the mode on an
ancestor retheme everything beneath it. This is the opposite of v1.2, where the
theme was baked into the variable name.

**Consequence for code:** theme is a context value set once high in the tree.
Components must not take a theme parameter. A component that still exposes a
`Theme` variant property has not been rebuilt for v1.3 yet — its component file
will say `Legacy`.

Other collections: `Numbers` (space, radius, stroke width, type size, size),
`Typography` (font family and weight), `_Base_Semantic_Library` (primitives —
never bind one directly), and `Device Illustration` (device state).

---

## 2. State: two axes, not one

The app does not own device state. The device does. A tap is a request that may
take seconds, fail, or be overtaken by someone pressing a physical button.

So device-bound components carry **two** independent state axes:

| Axis | Values | Comes from |
|---|---|---|
| Interaction | `Default` · `Hover` · `Pressed` · `Focused` · `Disabled` | the user's finger |
| Device | `On` · `Off` · `Offline` · `Pending` · `Failed` | the device |

`Power Button` and `Device Card 2.0` already work this way. Components that are
not device-bound (Checkbox, Radio, Text Field) carry the interaction axis only.

Three rules that follow:

**Offline is not Disabled.** Disabled means *you may not*. Offline means *we
cannot reach it*. They get different colour, different copy, and Offline gets a
recovery affordance. An offline control keeps showing the last value the device
reported, marked as last known — it does not fall back to zero or empty.

**Absent is a third thing.** A capability the hardware does not have is not
rendered at all. It is not disabled and not offline.

**A revert must carry a reason.** If the device refuses, the control returns to
its confirmed value *and* says why. A control that silently snaps back is a
defect.

**Open:** the timeout after which `Pending` becomes `Failed` is not decided. One
number, applied everywhere. Flagged for the design owner 2026-09-25.

---

## 3. Tokens

Never hardcode a colour, a spacing value, a radius or a font size. Every one of
them is a variable or a style in the Figma file and should be a named constant
in code.

The full scales, and the rules for choosing between them, live in
`foundations/`:

| File | Covers |
|---|---|
| [`foundations/Colour.md`](foundations/Colour.md) | The five theme modes, the four atoms, surfaces, the text permission rule, icon colour, stroke grammar, gradients and effects, device state |
| [`foundations/Typography.md`](foundations/Typography.md) | The 22 styles with weights, line heights and Flutter tokens, the Label-versus-Body rule, the 10 floor |
| [`foundations/Numbers.md`](foundations/Numbers.md) | Space, corner radius, stroke width, type size and size tokens, tap targets |
| [`foundations/Icons.md`](foundations/Icons.md) | The Material Symbols render configuration |

Those four state the design owner's rulings. **Each of them marks what is still
undecided.**
Where a file says a rule is not captured, it is not captured — ask, rather than
inferring one from the values you can see in Figma.

---

## 4. Accessibility

Baseline is WCAG 2.1 AA. The full guidance lives on the `Accessibility
Guideline` page of the Figma file; the parts that bind every component:

**Touch target** — minimum 48dp on Android, 44pt on iOS. In this library the
touch target is usually a transparent outer frame larger than the visible
control. Do not shrink it to the visible bounds.

**Contrast** — 4.5:1 for normal text, 3:1 for large text (18pt, or 14pt bold),
3:1 for any visual cue that carries meaning. Logos and decorative images are
exempt. Check every state in every mode the component supports.

**Never rely on colour alone.** Every state that matters must also be carried by
an icon, a label or a shape. This bites hardest on device state, where colour is
the obvious choice.

**Text spacing must survive** line height 1.5x, paragraph spacing 2x, letter
spacing 0.12x and word spacing 0.16x the font size, with no loss of content.

**Screen reader.** Every component file states four things, because together
they are what gets read aloud:

| Field | Question it answers |
|---|---|
| Label | what is this |
| Semantic role | what kind of thing is it (button, link, checkbox) |
| State | disabled, checked, collapsed, busy |
| Focus order | in what order the parts are read |

Screens are annotated in Figma with the *A11y Focus order* plugin before
handover. Component files carry the component's internal focus order; the screen
annotation carries the rest.

---

## 5. Haptics — PROPOSED, not yet signed off

No haptics rules exist in the design system today. Rather than invent a
vocabulary, map five events onto the platform APIs that already exist. Nothing
custom, nothing to maintain.

| Event | Android | iOS | Example |
|---|---|---|---|
| Selection changed | `CLOCK_TICK` | `UISelectionFeedbackGenerator` | slider tick, mode change |
| Toggle committed | `VIRTUAL_KEY` | `UIImpactFeedbackGenerator` light | switch, checkbox, power |
| Device confirmed the command | `CONFIRM` | `UINotificationFeedbackGenerator` success | fan actually turned on |
| Device refused or failed | `REJECT` | `UINotificationFeedbackGenerator` error | command timed out |
| Drag started | `LONG_PRESS` | `UIImpactFeedbackGenerator` medium | temperature dial grabbed |

Rules: haptics confirm, they do not announce. Fire on the *device's* answer, not
on the tap, for anything device-bound — otherwise we buzz for something that has
not happened. Never fire more than one per gesture. Always respect the system
haptics setting.

**Needs the design owner's sign-off before any component ships against it.**

---

## 6. What a component file gives you

Every file in `components/` has the same headings in the same order, so you can
skim to the one you need. `Properties` mirrors the Figma variant properties
exactly — if it disagrees with Figma, Figma wins.
