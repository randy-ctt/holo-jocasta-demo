## Summary

<!-- what and why -->

### AI-aware review checklist
- [ ] Every external call exists with those parameters
- [ ] No phantom dependencies
- [ ] Error handling is not swallowing exceptions
- [ ] Edge cases: empty, null, boundary, concurrent
- [ ] Diff does no more than the scope asked for
- [ ] Tests assert behaviour, not the implementation back to itself
- [ ] A human is accountable for this change regardless of what wrote it
