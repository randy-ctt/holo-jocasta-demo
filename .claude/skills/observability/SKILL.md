---
name: observability
description: Structured logging (levels, correlation ids, never log PII), metrics/traces at operation boundaries, and health signals.
---
# Observability

Use this skill when adding logging, metrics, or tracing to a service, or reviewing whether a change gives on-call enough signal to diagnose a failure without reproducing it locally.

## Structured logging

- Log structured (JSON) key-value fields, not interpolated strings — `log.info("order.created", { orderId, customerId, amountCents })`, not `log.info(\`Order ${orderId} created for ${amountCents}\`)`. Structured fields are queryable and aggregable; interpolated strings force someone to write a regex at 3am.
- Use levels with intent, not by feel:
  - `error` — something failed and needs attention; an operation could not complete.
  - `warn` — recovered automatically, or degraded but still functioning (a retry succeeded, a fallback kicked in).
  - `info` — a significant, expected business or lifecycle event (order created, deployment started, a request boundary was crossed).
  - `debug` — detail useful for local/dev troubleshooting; noisy, and off by default in production.
- Every log line inside a request/job carries a **correlation id** (a.k.a. trace/request id) that is generated or propagated at the entry point and threaded through every downstream call and log line for that unit of work. Without it, tying five services' logs back to one guest-facing request is guesswork.
- **Never log restricted-tier data**: no passwords, tokens, API keys, PII, payment/card numbers, or data relating to minors — in any log level, including `debug`. This is the same data-classification rule that governs fixtures and error messages; logs are not exempt. Log an opaque identifier (`customerId`) instead of the person's name/email/payment details.

## Metrics and traces at operation boundaries

- Instrument at **operation boundaries** — where a request enters/leaves a service, where a call crosses to another service or the database, where a queue message is consumed/produced — not inside every internal function. Boundary instrumentation is where latency, error rate, and volume actually mean something to an operator.
- Minimum metrics per boundary: request count, error count/rate, and latency (ideally as a histogram so p50/p95/p99 are all available — an average alone hides the tail that guests actually feel).
- Traces propagate the same correlation id as logs and span each boundary crossing, so a single slow guest request can be followed across every service it touched, not just the one that happened to log first.
- Emit metrics/traces for the *outcome* of the operation (success, expected client error, unexpected server error) as a labelled dimension — folding all three into one "requests" counter makes it impossible to alert on the thing that matters (rising server error rate) without also being deafened by normal 4xx traffic.

## Health signals

- Expose a liveness signal ("is the process up") separate from a readiness signal ("is this instance able to serve traffic right now — DB reachable, dependencies healthy, warm-up complete"). Conflating the two causes an orchestrator to either kill a healthy-but-still-starting instance, or keep routing traffic to one that can't actually serve it.
- Readiness checks should verify the dependencies the service actually needs to function (DB connection, required downstream service reachability) — not become a second, slower copy of the business logic.
- Alert on the signals that map to guest impact — error rate and latency at the boundary, not on internal implementation counters that don't predict guest-visible failure. This mirrors Gate 2's performance-baseline check (a >10% latency regression is a release-blocking signal, not a shrug).
