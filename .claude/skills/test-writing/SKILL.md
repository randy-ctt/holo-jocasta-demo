---
name: test-writing
description: The unit/integration/e2e test pyramid, naming convention, behaviour-not-implementation assertions, and the coverage-doesn't-decrease gate.
---
# Test writing

Use this skill whenever you are writing new tests, deciding what level to test something at, or reviewing whether a test actually proves anything.

## The pyramid: ~75% unit / ~20% integration / ~5% e2e

- **Unit** — one function or class in isolation, external dependencies (network, DB, filesystem, other services) mocked or faked. Runs in milliseconds and executes on every commit. Cover every public function that has non-trivial logic — a pure getter or trivial pass-through doesn't need its own test.
- **Integration** — two or more components exercised together, with real dependencies where practical (a real test database, a local queue) rather than mocks standing in for the whole world. Runs in seconds, on every PR. This is the level for API endpoints, service↔repository interactions, and message-flow correctness — the things a unit test can't see because it mocks the boundary away.
- **End-to-end** — a full user workflow driven through the deployed or containerised stack. Runs in minutes, before release. **Cap at roughly 20–30 e2e tests** — needing more is a signal that integration coverage is missing, not that e2e coverage is. Scope e2e to the critical journeys only: login, core CRUD, payment.
- If a bug fix or feature seems to want a 31st e2e test, look one level down first — the missing case is almost always expressible as a faster integration or unit test.

## Naming

- Name every test `test_[function]_[scenario]_[expected_result]` — e.g. `test_calculateShippingCost_freeShippingThreshold_returnsZero`, `test_cancelOrder_alreadyCancelled_returnsConflict`. The name alone should tell a reader what broke, without opening the test body.
- One scenario per test. If a test's name needs "and" to describe it, split it into two tests, same as the "small functions" rule for production code.

## Assert behaviour, not implementation

- A test proves what the *caller* can observe: return value, thrown error, state change, message emitted, HTTP status/body. It does not assert on private internals, call counts on a mock as the entire point of the test, or restate the implementation's control flow in test form.
- A test that only checks "the mock was called with X" and nothing about the resulting behaviour is not coverage — it will stay green through a refactor that breaks the feature, and go red on a refactor that doesn't change behaviour at all. Mock interactions are acceptable as a *secondary* assertion (e.g. "and it published exactly one event") but the primary assertion is the observable outcome.
- Prefer real collaborators over mocks whenever the real thing is fast and deterministic (in-memory implementations, a real pure function). Reach for a mock/fake specifically at the boundary to the outside world — network calls, clocks, randomness, other services.
- Write the test from the test-driven-development discipline where practical: red (failing test that expresses the requirement) → green (minimum code to pass) → refactor. A test written after the implementation to match whatever the code already does is prone to encoding the implementation's accidents as "expected" behaviour.

## Coverage doesn't decrease

- Gate 1 (code review) requires all unit tests pass, no new linter warnings, **code coverage does not decrease**, and no high/critical security issues. A PR that adds code without adding proportional test coverage fails this gate — coverage is a floor, not a target to game with trivial assertions.
- When touching existing code with thin coverage, add the missing unit tests for the lines you're changing as part of the same change, rather than carrying the gap forward.
- Gate 2 additionally requires integration and contract tests to pass and the performance baseline to hold (a >10% regression fails the gate) — a change that is "covered" by unit tests alone but breaks a real integration path is still a gate failure.
