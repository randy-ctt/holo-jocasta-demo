---
description: Run an AI-aware review checklist before handing work to a human
---
# /verify
Before declaring this done, review the diff the way you'd review a coworker's PR if you suspected —
not assumed maliciously, just suspected — that some of it might be subtly wrong in ways generic code
review misses. Specifically check for the failure modes that AI-assisted changes are prone to:
- **Invented APIs.** Does every function, method, and module referenced actually exist in this
  codebase or its dependencies, at the version in use? Don't trust that it "looks right."
- **Phantom dependencies.** Is everything imported actually installed and declared? Would a clean
  checkout build?
- **Over-broad error handling.** Are `catch` blocks swallowing errors they shouldn't, or catching
  exceptions far broader than the failure being handled?
- **Missing edge cases.** Empty input, null/undefined, concurrent access, partial failure — are these
  handled or silently assumed away?
- **Pattern mismatch.** Does this match the codebase's existing conventions (naming, error handling,
  layering), or does it quietly introduce a new pattern alongside the old one?
- **Silent scope expansion.** Does the diff do only what `scope.md` and `plan.md` called for, or has
  it crept into unrelated files or behaviors?
- **Test quality.** Do the tests assert real behavior, or do they assert that the implementation does
  whatever the implementation does (tautological tests)? Would they fail if the logic were wrong?
- **Data handling.** Does anything here log, cache, or persist guest PII, payment data, or data
  belonging to minors in a way the Data classification section of `CLAUDE.md` (canonical source in the Holocron repo's `core/context/knowledge/data-classification.md`) prohibits?

Produce a findings list (blocking vs. non-blocking) rather than a pass/fail verdict. A human is
accountable for the merge decision — this checklist surfaces what they need to see, it doesn't replace
their judgment.
