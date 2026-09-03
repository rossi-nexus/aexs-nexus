# CHANGELOG

One line per shipped change. Newest first. Format: `YYYY-MM-DD [ID] what — why`.

- 2026-09-03 [B-01] LLM models now env-driven (LLM_MODEL_REASON/FAST/LITE, LLM_REASONING_EFFORT) across 13 functions; redeployed — model swaps no longer need code edits. Pro upgrade deferred (no billing).
- 2026-09-03 [B-02] Step 4 exclusions now persisted on lock and respected by Step 5 + collection save — excluded actors were leaking through
- 2026-09-03 [ops] Created STATE.md, BACKLOG.md, CHANGELOG.md, CLAUDE.md, evals/ — operating system so sessions don't lose the thread
- 2026-09-03 [ops] Full audit delivered (v3-copilot/audit-complete-2026-09-03.md + 3 appendices) — code vs intent, data quality, search quality
- 2026-08-27 [migration] Purged Lovable branding: new SVG favicon, correct meta/og tags — no Lovable references remain in DOM
- 2026-08-27 [migration] Custom domain nexus.aexs.no live (CNAME at one.com, Let's Encrypt auto) — permanent URL
- 2026-08-27 [migration] Renamed repo + Vercel project nexus-pulse-palette → aexs-nexus — drop Lovable naming
- 2026-08-27 [fix] All edge functions: gemini-2.5-* → gemini-3.6-flash / 3.1-flash-lite — Google deprecated 2.5-x for new keys (404). NOTE: interpret-need lost reasoning capability; see B-01.
- 2026-08-27 [fix] interpret-need: removed `reasoning` field — Google OpenAI-compat rejects it (400)
- 2026-08-27 [fix] Vercel env vars recreated as Config (were Secret → empty at build) — app was crashing on "supabaseUrl is required"
- 2026-08-27 [migration] Frontend deployed to Vercel, backend on own Supabase nexus-production, all 22 edge functions deployed, DB restored from pg_dump (44 actors, 618 ontology entries, 10 users) — Lovable → owned infra
