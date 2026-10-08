---
name: golden-path-scaffolding
description: The approved way to stand up a service, pipeline, or front end at Holocron — feature-based layout, dependency inversion, and feature-flag + canary rollout.
---
# Golden-path scaffolding

Use this skill when standing up a brand-new service, data pipeline, or front end, or when scaffolding a substantial new feature inside an existing one — the point where architectural decisions get baked in and are expensive to unwind later.

## Match ceremony to risk before scaffolding anything

- Run `/scope` before building features, greenfield work, spikes, and migrations. Run `/plan` before features, refactors, and migrations. Hotfixes skip both, but the unit of work is still recorded.
- A scope or plan written in ninety seconds with no open questions is theatre, not thinking — the AI-aware review checklist (`/verify`) exists specifically to catch that. If scaffolding a new service and the scope has zero open questions, that's a signal to look harder before writing code, not a sign of readiness.
- Before scaffolding a new service or capability, check the **service catalogue** for something that already does this — reinventing an existing Holocron service (auth, payments, entitlements, guest profile, notifications) instead of integrating with it is a review-blocking finding.

## Feature-based layout

- Organize by feature, not by layer: co-locate the model, service, repository, and handler for a feature in one place. Do not scatter one feature's code across top-level `models/`, `services/`, `repositories/` directories — that forces a reader to open five folders to understand one capability.
- One concept per file — one class, one module, one component — and keep files under roughly 300 lines. A new service's scaffold should start as a handful of small, feature-named files, not one large entry-point file that accretes everything.
- New front-end work follows the same rule: a feature's components, hooks, and local state live together under that feature's folder, not split into global `components/` and `hooks/` trees keyed by technical role.

## Dependency inversion from the start

- High-level modules (handlers, orchestrators, business logic) take their dependencies as parameters/constructor injection — they do not construct concrete implementations (a specific DB client, a specific HTTP client, a specific queue) internally.
- Scaffold the seam on day one: define the interface/port the feature depends on (e.g. `OrderRepository`), inject a concrete adapter at the composition root, and let tests substitute a fake. Retrofitting this after the service has grown is far more expensive than starting with it — it's the difference between a unit test and a mandatory integration test for every code path.
- This is also what makes the 75/20/5 test pyramid achievable: without inverted dependencies, "unit" tests can't isolate a single function without dragging in a real database or network call.

## Feature flags and canary rollout

- Anything guest-facing or revenue-affecting rolls out behind a **feature flag**, then a **canary** (a small percentage of real traffic), then a full deploy. Scaffold the flag check at the entry point of the new capability from the start, rather than retrofitting it once the feature is "done."
- State the rollback plan in the scope before building — how the flag gets flipped back off, and what (if anything) needs cleanup if it does. A golden-path service that can't be safely disabled by flipping one flag isn't following the golden path yet.
- Canary rollout depends on the observability skill's boundary metrics (error rate, latency) to decide whether to proceed to full deploy or roll back — scaffold those metrics alongside the flag, not after the canary is already running.

## Gate awareness while scaffolding

- Design the new service/pipeline/front end so it can pass all three gates without special-casing: Gate 1 (unit tests, lint, coverage, no high/critical security issues), Gate 2 (integration/contract tests, performance baseline), Gate 3 (e2e on staging, accessibility, sign-off). A golden-path scaffold that can't produce a meaningful unit test suite, or has no integration test surface, is a sign the dependency-inversion step above was skipped.
- Guest-facing accessibility standards are enforced at Gate 3 and are non-negotiable — scaffold accessible markup/components from the start rather than treating accessibility as a pre-release pass.
