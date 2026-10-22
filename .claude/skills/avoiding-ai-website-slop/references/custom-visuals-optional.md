# Custom Visuals (Optional)

## Why Custom Visuals Matter

Stock AI-generated imagery (generic 3D blobs, the same illustration style everyone gets from the same prompt) is one of the strongest "slop" tells. A distinctive, custom graphic style — a mascot, character, or illustration system inspired by (not copying) a reference's graphic personality — is one of the highest-leverage ways to make a site feel designed rather than generated.

## External Image/Video-Gen Tool (Optional)

A third-party paid image/video-generation service with its own CLI can be connected to generate a large volume of on-brand custom visuals once a creative concept is chosen. This is genuinely optional and external:
- Only use it if the user already has an account and access set up.
- Never present it as a required step or block on it if unavailable.
- If used, generate a small pilot batch first to confirm the direction before generating everything at full scale (see `gold-standard-loop.md` for the same pilot-first principle applied to the whole build).

## Claude-Only Fallback

Without an external tool, still give the user a real creative choice instead of silently picking one direction:
- Sketch 2-3 distinct visual/character concepts in words (or via the `design` skill for actual mockups) grounded in the brief's subject matter — not a generic mascot.
- Let the user pick or refine before generating final assets.
- Keep the chosen concept's personality consistent across every section it appears in (same character, same illustration rules), rather than a different generic image per section.
