# The Gold-Standard Comparison Loop

This is the core mechanic that separates this pipeline from generic "build it, then ask AI to make it better." A single unstructured polish pass is not repeatable and does not converge — asking five times gets five different answers. Judging against a named, fixed bar does.

## Setting the Gold Standard

- Pick ONE reference (from `reference-and-brief.md`'s gathered sites) and explicitly name it as the gold standard — present it as a choice to the user, don't auto-pick.
- Actually inspect it once up front (screenshot/browse it) and note, section by section, what it does well (motion, spacing, copy tone, hierarchy) so there's something concrete to compare against later, not just a vibe.

## Pilot Before Scale

Build and judge one section or one page first. Only once the pilot passes, apply the same loop to the rest of the site. This avoids generating (or regenerating) a full site's worth of content/visuals against a direction that turns out wrong.

## The Judged Comparison Loop

For each section, repeat:
1. Build or update the section per the current brief.
2. Capture the current build (use the `run` skill to launch it, then screenshot) and the matching gold-standard section side by side.
3. Judge explicitly pass/fail against concrete criteria drawn from the brief (not "does it look nice?") — e.g. "does the hero communicate one thing in one screen, the way the gold standard's hero does?"
4. If fail, state the concrete delta (what's missing/off) and revise. If pass, move to the next section.

**Anti-pattern:** replacing this loop with "does this look better now?" or a single revision pass. That is not the loop — it's the exact failure mode this mechanic exists to prevent, and it doesn't give a real pass/fail signal.

## Exit Criteria

- Cap iterations per section (e.g. 3-5 passes). If still failing after the cap, stop and escalate to the human with the specific unresolved delta, rather than looping indefinitely or silently shipping a fail.
- A section is "done" only once it explicitly passes against the gold standard's bar — not once it "seems fine."
- Once every pilot section passes, apply the loop to the remaining sections of the full build.

This same loop applies to copy, not just visuals — see `copywriting-anti-slop.md`'s Output section.
