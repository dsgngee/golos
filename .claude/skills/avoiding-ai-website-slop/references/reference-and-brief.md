# Gathering References & Building the Design-System Brief

## Gathering Reference Sites

- Ask the user for 2-3 real websites in or near their niche that they consider genuinely well-designed. Never invent or guess a URL for a "curated gallery" — if you don't have one on hand, ask the user for direct links instead.
- Actually inspect each reference — use `WebFetch`/`WebSearch`, or Playwright browser tools (`browser_navigate`, `browser_take_screenshot`, `browser_snapshot`) if available — rather than assuming what a well-known brand's site looks like from memory or its name alone.
- For each reference, extract concrete tokens, not vibes: hex colors actually used, typeface(s) and how they're paired, spacing/layout rhythm, what motion exists and where, and the "personality" of any illustration/graphic style.

## Building the Design-System Brief

Prompt pattern to use (adapt to the actual product):

> "Look at [reference]'s design system. Use it as inspiration, not something to copy directly, to design [product]. Keep [whatever should stay constant] as-is."

- Expect the model to ask clarifying questions (product name, color direction, tone). Answer them, or ask the user to.
- The deliverable is a **fully codified design system**, not a single page: named hex palette (4-6 colors), 2+ typeface roles, button/component states, and key flows (e.g. sign-up/login) if the product has them. Cross-reference `frontend-design` for the palette/type token conventions.
- If a second reference is available, it can be layered in as a secondary influence — the goal is an original combination, not a clone of any one source.

## Handoff

The brief is the source of truth for every later step (custom visuals, the gold-standard loop, typography, copy). Don't re-derive design decisions per section — extend the brief instead, and keep it updated as choices are finalized.
