# Evals

Regression set for the search pipeline. Run before deploying any change to `interpret-need`, `search-role`, `analyze-actor`, `populate-role`, `axis-*`, `discover-adjacent`, or any ranking RPC.

`queries.json` — 10 queries. Q-G1..G5 are the original Gate 2 queries (should always produce sensible roles + actors). Q-S1..S5 are the serendipity queries from `v3-copilot/serendipity-engine-evaluation-2026-06-18.md` (used to test `discover-adjacent`; also useful as interpretation tests).

Each query has:
- `need` — the Step 1 text
- `expect_roles_min` — interpret-need must return at least this many roles
- `expect_role_keywords` — at least one returned role name/reasoning must mention each keyword group (any-of within group)
- `expect_wow_categories` — for serendipity: adjacent-sector categories `discover-adjacent` should surface (≥3 of these = pass)
- `expect_max_serendipity` — for control query: max adjacent results (restraint test)
- `noise_categories` — what should NOT appear

Runner: `evals/run.ts` (backlog B-17 — not yet written). Until it exists, run manually: call the edge function with each `need`, eyeball against expectations, record in `last-run.md`.

Pass = all Gate queries return ≥ `expect_roles_min` roles hitting all keyword groups. Serendipity queries pass per `expect_wow_categories`. Any regression vs `last-run.md` blocks deploy.
