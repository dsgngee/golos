---
name: avoiding-ai-website-slop
description: Use when building or redesigning a marketing website, landing page, or product UI and the result must not look like generic AI-generated "slop" (indigo-violet gradients, exactly three feature cards, frosted glass, generic sans-serif, AI-sounding copy) — covers gathering real design references, building a design-system brief, generating custom visuals, running a gold-standard comparison loop before shipping, picking properly licensed fonts, and cleaning AI-sounding copy out of a draft.
---

# Avoiding AI Website Slop

## Overview

Most AI-built websites look the same because they're given a *prompt*, not a *system*. This skill packages a reference-grounded, judged pipeline: ground the build in real design references, codify them into an explicit brief, generate distinctive visuals, and check the result against a named quality bar before calling it done — instead of one-shot generating and polishing.

## When to Use

Use for a new marketing site, landing page, or any UI surface where visual/copy distinctiveness matters. Skip for a narrow component tweak with no new visual surface — use `frontend-design` directly for that instead.

## Core Pattern

| Step | Required? | Read |
|---|---|---|
| 1. Gather real reference sites | Required | `references/reference-and-brief.md` |
| 2. Build a design-system brief from a reference | Required | `references/reference-and-brief.md` |
| 3. Generate distinctive custom visuals | Optional (external tool) | `references/custom-visuals-optional.md` |
| 4. Gold-standard comparison loop before shipping | Required | `references/gold-standard-loop.md` |
| 5. Pick fonts + check licenses | Required | `references/typography-and-licensing.md` |
| 6. Clean AI-sounding copy | Required | `references/copywriting-anti-slop.md` |

## Human Stays Creative Director

AI's job is removing repetitive grunt-work, not making creative calls. Always present as a choice, never auto-decide:
- Which reference site(s) to use as inspiration.
- Any mascot/character/creative concept for custom visuals.
- Which reference becomes the gold standard for the comparison loop.
- Final palette/font direction when more than one good option exists.

## Working With External Tools (Optional)

Nothing in this pipeline requires a tool beyond Claude. Two steps *can* be enhanced by external, paid tools mentioned by the source material this skill is based on:
- A third-party image/video generation service with its own CLI (for step 3) — only use if the user already has an account; otherwise use the Claude-only fallback in `custom-visuals-optional.md`.
- A second, non-Claude model as a copy "humanizer" pass (in step 6) — only use if the user already has that integration configured; otherwise skip it, the checklist-based cleanup still works alone.

Never assume either is available. Never hardcode a specific external product or model version as a requirement.

## Quick Reference

| Need | Do this |
|---|---|
| Reference-site inspection | `WebFetch`/`WebSearch`, or Playwright browser tools if available, to actually look at the site — never guess a design from its name |
| Concrete palette/type-pairing choices | Delegate to `ui-ux-pro-max` (has a tone→pairing selector already) |
| Aesthetic direction, typography personality, brainstorm/critique workflow | Cross-reference `frontend-design` |
| Screenshotting your own build to compare against the gold standard | Use the `run` skill to launch it, then screenshot |
| Pulling a real design system from Figma | `figma:figma-generate-design` / `figma-use` |

## Common Mistakes

- Doing one unstructured "make it better" pass instead of the gold-standard loop — not repeatable, not verifiable.
- Skipping reference-gathering and going straight to a bare prompt.
- Copying a reference site instead of using it as inspiration.
- Treating the external image-gen tool or second model as required rather than optional.
- Skipping the font license check.
- Auto-deciding a creative concept instead of presenting options.
- Falling back into generic AI visual ruts (gradient/three-cards/frosted-glass, or `frontend-design`'s cream+serif+terracotta / near-black+neon / broadsheet-grid) or generic AI copy tells.
