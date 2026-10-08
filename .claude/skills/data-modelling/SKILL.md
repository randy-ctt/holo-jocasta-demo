---
name: data-modelling
description: Schema design, normalization vs. denormalization, migrations, and PII/data-classification-aware modelling.
---
# Data modelling

Use this skill when designing a new schema or table, adding/changing columns, planning a migration, or deciding how to store data that might include guest PII.

## Schema design fundamentals

- Model the domain first, storage second: identify entities, their identity (what makes a row unique), and the relationships between them before picking column types.
- Every table has a stable primary key that never changes meaning; prefer a surrogate key (UUID or auto-increment) over a natural key that might legitimately change (email, username).
- Foreign keys are enforced at the database level, not just in application code — a constraint that only application code checks will eventually be bypassed by a script, a migration, or a second consumer of the same database.
- Name tables and columns for what they hold (`customer_email`, not `data` or `value`) — the naming standard in the Holocron standards (CLAUDE.md) applies to schemas exactly as it does to code.

## Normalization vs. denormalization

- Start normalized (3NF): each fact lives in exactly one place, updates never require touching multiple rows to stay consistent. This is the default for transactional (OLTP) data — orders, accounts, entitlements.
- Denormalize deliberately, not by accident, and only after a normalized model has a proven read-latency or join-fanout problem. Denormalization trades write complexity and staleness risk for read speed — document *why* a field is duplicated and *how* it's kept in sync (trigger, event, batch job) whenever you do it.
- Read-heavy reporting/analytics tables (OLAP) are the one place denormalization (star schema, wide tables) is the default, not the exception — that's a different workload from the transactional store and should usually live in a separate table or warehouse, not bolted onto the OLTP schema.

## Migrations

- Every schema change is a migration file, checked into version control, applied in order, and re-runnable in a fresh environment — never a manual `ALTER TABLE` run by hand against production.
- Migrations are backward-compatible during rollout: adding a column is safe only if it's nullable or has a default; making a column `NOT NULL` or dropping/renaming a column requires an expand-migrate-contract sequence (add the new shape, backfill, switch reads/writes, only then remove the old shape) so mid-deploy old and new code can both run against the same schema.
- Large backfills run in batches with throttling, not a single unbounded `UPDATE` — an unbatched migration against a hot table is exactly the kind of change that trips the Gate 2 performance-baseline check (a >10% regression fails the gate).
- Every migration has a tested rollback path. If the change can't be cleanly reversed (e.g. a destructive drop), that's called out explicitly and gated behind extra review.

## Data classification and PII-aware modelling

- Classify every new column at design time, not after an incident: is it **PII, payment data, or data relating to minors**? Per the standards, all three are restricted-tier.
- Restricted-tier columns belong in tables (or a physically separate store) that use KMS/HSM-backed encryption at rest, with access limited to named individuals — don't mix a restricted column into a general-purpose table just because it's convenient to join.
- Never let restricted data leak sideways: it must not end up in logs, error messages, test fixtures, seed data, or ad hoc diffs/exports. If a model needs realistic-looking test data, generate synthetic values — never copy production restricted fields into fixtures.
- Secrets, API keys, and tokens are never modelled as plaintext columns — reference a secrets manager, or store only a hashed/encrypted value with the key held externally.
- All access paths to restricted data go through parameterized queries — never string-interpolate identifiers or values into SQL, in application code or in migration scripts.
- Design retention intentionally: a restricted-tier column needs a documented retention/deletion rule *(fill per org for Holocron's exact tiers and periods)* rather than accumulating indefinitely by default.
