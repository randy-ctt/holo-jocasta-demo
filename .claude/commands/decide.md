---
description: Record a decision that departs from the plan
---
# /decide
Start from `.holo/templates/decisions.md`.

Use this when the plan turns out to be wrong, incomplete, or too expensive once you're actually
building — and you're about to do something the plan didn't call for.

Capture, in one line each:
- What the plan said to do.
- What you're doing instead, and why.
- What it costs — rework, risk, scope creep — and whether it's worth it.
- Whether this needs a human's sign-off before proceeding, or is safe to note and continue.

Append a single line to `decisions.md` in the unit's working directory:
`<timestamp> — <what changed> — <why> — <impact>`

Keep the decision log terse and append-only. It is the audit trail for "why does the code not match
the plan," not a place for prose. If the decision is large enough to change the acceptance criteria in
`scope.md`, say so explicitly and flag it for human review rather than silently drifting.
