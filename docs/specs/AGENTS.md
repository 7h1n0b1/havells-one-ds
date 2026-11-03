# AGENTS.md

Read this before using anything else in this folder. It is also the file to
re-read if you are about to state a design-system rule you cannot point at.

This is the specification for the **Havells One** design system, v1.3, written
for the people and the tools that build the app. It is not marketing copy and it
is not a style guide to be interpreted. Treat it as an API contract.

---

## 1. The one rule that matters

**If it is not written down here, it does not exist. Ask.**

Every file ends with a section called **Not decided — ask, do not infer**, or
marks an item `OPEN` / `NOT YET CAPTURED` inline. Those are not gaps waiting for
a sensible default. They are questions nobody has answered yet.

You will be able to guess. A value in the Figma file will suggest a rule, a
neighbouring component will suggest a pattern, and the guess will usually look
right. **Do not.** A rule invented once gets copied into the next screen, the
next component and the next conversation, and by the time anyone notices it is
indistinguishable from a decision.

If you need an answer that is marked open, say so and stop. That is the correct
outcome, not a failure.

**A pattern in the Figma file is not a rule.** It is one designer's choice on one
day, unless a file here says otherwise.

---

## 2. Authority order

Different questions have different sources of truth. Getting this wrong is the
most common way to end up confidently incorrect.

| Question | Read |
|---|---|
| **What is the value?** A token's colour, a style's size, a component's variants | **The Figma file objects** — variables, text styles, components. Never a documentation page. `Colour.md` Part B is a dated, script-generated snapshot of those objects; use it when you have no Figma access, and treat the object as right if the two disagree. |
| **What is the rule?** When to use which, what is permitted where | **These files** |
| **Anything else** — why, or a case these files do not cover | **Ask the design owner** |

### Figma documentation pages are not authoritative

The Figma file contains documentation pages — Colour, Typography, Spaces, and per
component. They are being brought in line with these files, and some still lag.
**Where a page and a file here disagree, follow the file** and tell the design
owner.

This is not a general licence to ignore Figma. It is specific:
**objects yes, prose maybe.**

---

## 3. Hard rules

These are settled. They do not need re-deriving and they are not negotiable
without the design owner.

1. **No hex literal, ever. No raw pixel value, ever.** Bind a variable or a text
   style. A value with no token is a stop sign, not a licence to hardcode.
2. **Never bind a `_deprecated/*` variable.** That prefix is a staging area so
   old bindings survive until they are re-pointed. It is not a keep.
3. **Theme is a mode, not a name.** Five modes: `Platform`, `Product`, `Lux`,
   `Loyalty`, `Studio`. A theme name never appears inside a token path, and
   `Basic` is not a mode.
4. **Text binds `Text/*`. Icons bind `Icon/*`. Strokes bind `Stroke/*`.**
   Crossing these is a defect even when the values match.
5. **A text token's name states where it may be used, and it may be used nowhere
   else.**
6. **Disabled is 50% opacity at the component.** There is no disabled token.
7. **Every tap target is at least 48 x 48**, even when the visible control is
   smaller.
8. **Bind a text style, never a font size.** 22 styles exist; one of them fits.
9. **Icons come from the design-system library only.** No drawn glyphs, no
   external icon sets, no emoji.

---

## 4. What is in here

| Path | What it is |
|---|---|
| `README.md` | What is specified, what is not, and what is coming |
| `_FOUNDATIONS.md` | Read first. Theming, the two state axes, accessibility baseline, haptics. Every component file assumes it. |
| `foundations/Colour.md` | Theme modes, surfaces, the text permission rule, icon colour, stroke grammar, styles, device state |
| `foundations/Typography.md` | The 22 styles with real values and their Flutter tokens, Label versus Body |
| `foundations/Numbers.md` | Space, corner radius, stroke width, type size and size tokens; tap targets |
| `foundations/Icons.md` | The Material Symbols render configuration |
| `components/*.md` | One file per component, same headings in the same order |

A component with no file here is **not ready to build**, whatever it looks like
in Figma. The `Component Status` page in the Figma file says what is in flight.

---

## 5. Working with these files

**Status lines are per mode.** A component can be Ready in Platform and blocked
in Lux. "Ready" without a mode means nothing — read the whole line.

**Open questions carry a date and an owner.** They are not decoration. If you are
about to build something an open question covers, that question is now blocking.

**Contrast figures are measured, not estimated.** Where a file gives a ratio, it
came from resolving the token in that mode and computing it. If you change a
token value, those numbers are stale and the file needs re-measuring.

**Do not tidy token names.** Several are inconsistent at source — `D1(51)`
carries parentheses, the serif Display styles are tokenised `Title1serif` to
`Title3serif`, and one colour family spells its surface permission differently
from the rest (`Colour.md` §4). They are printed exactly as they exist. Copy them
verbatim. A rename of the Flutter tokens is being discussed with the development
team; until it is agreed, the names in `Typography.md` are the names.

---

## 6. When you are blocked

Say which file, which section, and what the missing answer would change. That is
enough for the design owner to answer in one line.

Do not:

- infer the rule from token values
- copy the pattern from a similar component
- pick the option that matches the platform's default
- proceed with a placeholder and a TODO

Any of those produces work that looks finished and has to be redone.
