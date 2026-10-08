---
description: Distill durable learnings from this session into team instincts
---
# /remember
Turn what this session actually taught you into durable, team-shared instincts, so the next
person (or session) starts ahead. A good time to run this is after a meaningful chunk of work,
before `/handoff`.

## Workflow
1. **Reflect** on the session: decisions you made and why, corrections the human gave you,
   gotchas you hit, and conventions you had to follow. Optionally skim the unit's recent commits
   for what changed.
2. **Check for duplicates:** run `holo instincts --json` and see whether a learning is already
   recorded.
3. **Record each durable learning:**
   - New learning → `holo remember "<rule>" --trigger "when <situation>" --domain <area> --confidence <0..1>`.
   - Already recorded, and this session confirms it → `holo instincts update <id> --confidence <higher>`
     (and refine the wording with `--trigger`/`--body` if you can state it better).

## Quality rules
- Record only **durable, generalizable** learnings — not one-off facts about this specific
  ticket. "This repo runs tests with `bun test`" is an instinct; "TKT-4471 needed a null check"
  is not.
- Keep each instinct **atomic** — one rule per instinct.
- **Never** record secrets, credentials, tokens, or PII.
- Set `confidence` to how *proven* the learning is: a first observation is low (~0.3–0.5); a
  pattern you've confirmed repeatedly is high (~0.8–0.9).
- Instincts are committed and team-shared — write them for a teammate, not just yourself.
