# Typography & Licensing

## Selecting Typefaces

Font choice is one of the single biggest levers on how "generic" a design feels, but this skill doesn't reimplement font selection from scratch:
- Delegate concrete tone→pairing shortlisting to `ui-ux-pro-max` (it already has a font-pairing database and a tone-based selector — e.g. "modern SaaS" → pairings that read as trustworthy, with sensible kerning).
- Cross-reference `frontend-design`'s typography-pairing discipline (display + body + optional utility face, used with restraint, not the same families reached for on every project).

## Checking Licenses (the actual net-new step here)

Before finalizing any non-default/non-Google-Fonts typeface, explicitly check and state its license terms:
- Many "free" fonts are free for personal use only, not commercial use — confirm which applies before shipping.
- If the license is unclear or restrictive, say so and propose a properly-licensed alternative rather than shipping ambiguous risk.
- Community font-pairing/usage galleries (e.g. fontsinuse.com) are useful for seeing how a face reads in a real layout — but they show usage examples, not licensing; still check the type foundry's own terms.

## Output

Record the final chosen faces plus their confirmed license status back into the design-system brief (`reference-and-brief.md`'s brief), so it's not re-decided per section.
