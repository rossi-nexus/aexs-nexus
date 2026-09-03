# STATE — what is true right now

_Last updated: 2026-09-03 (session 3) by Cowork. Update at end of every session. Under 150 lines._

## Live

- **App:** https://nexus.aexs.no (Vercel project `aexs-nexus`, team `rossi-nexus-projects`). Auto-deploys from `main`. Also reachable at aexs-nexus.vercel.app and nexus-pulse-palette.vercel.app (legacy, retire later).
- **Backend:** Supabase `nexus-production` (ref `plnwneqqbmtwoaaeirta`, eu-west-1). 22 edge functions ACTIVE. Secrets: GOOGLE_API_KEY, SERPER_API_KEY + Supabase defaults.
- **LLM:** Google Gemini via OpenAI-compat endpoint. Models are env-driven (secrets `LLM_MODEL_REASON` / `LLM_MODEL_FAST` / `LLM_MODEL_LITE`, optional `LLM_REASONING_EFFORT`); defaults `gemini-3.6-flash` / `gemini-3.6-flash` / `gemini-3.1-flash-lite`. No secrets set yet → defaults active. **Decision: stay on Google free tier for now** (Pro models 429). Swapping to Pro or another OpenAI-compat provider = set secret + redeploy.
- **Repo:** github.com/rossi-nexus/aexs-nexus, branch `main`. Last commit: see `git log -1`.
- **DNS:** one.com. `nexus.aexs.no` CNAME → cname.vercel-dns.com. Email = Microsoft 365 (MX/TXT records — do not touch).

## Data (as of 2026-09-03)

- 44 actors in `actors` (42 verified, 2 merged). **26 have zero ontology tags → invisible to DB search.** Searchable universe = 17 actors.
- 613 active ontology entries, 216 used by ≥1 actor.
- `actors.country` mixed format ("Norway"/"NO"/NULL). Saab wrongly = Denmark. Duplicates: Navielektro ×2, Machia/MACHIA.
- 2 programmes, 2 outcomes. E4 outcome signal ≈ zero.
- 46 personal actors (Tore's collection). 4 search sessions total.

## In flight

- Nothing. B-02 (360781d) and B-01 code (29cce1d, 52d043e) shipped; all 13 LLM functions redeployed on env-driven models (interpret-need v8). Awaiting Tore smoke-tests: (a) B-02 — exclude an actor in Step 4, lock, confirm absent from Step 5 + collection; (b) run one interpretation to confirm nothing regressed after the redeploy.

## Blocked

- Nothing hard-blocked. B-01 reasoning-model upgrade is *deferred by decision* (no Google billing for now). Alternative: B-22 second provider (Groq/OpenRouter/DeepSeek) for the REASON tier — needs Tore to create a free key.

## Next (from BACKLOG → Now)

1. B-03 persist unlocked step state
4. B-04 CoverageBanner soft-unlock
5. B-05 country normalisation + dedup
6. B-06 validation prompt: drop incumbent bias, add transferability angle
7. B-07 data-fence scraped content

## Decisions (do not re-litigate)

- Lovable is gone. Vercel + own Supabase + direct Google API. (2026-08-27)
- Verification stays human — agents do candidate harvesting + pre-tagging into a queue, never write to verified actors directly. (2026-09-03, per original design + audit)
- Dual-use / adjacent-sector reasoning (`discover-adjacent`) is the product differentiator and comes *after* the actor universe is ≥75. (2026-09-03)
- Serendipity lane is a separate, labelled surface — never mixed into main ranking. (2026-06-11)
- No WS3 multi-tenancy, no Bucket G totalforsvar adaptation, no Stage 4 Fund until a customer triggers it. (2026-09-03)
- No Google Cloud billing for now; free tier + env-driven model swap. Local Ollama is not viable for hosted edge functions; self-hosted GPU costs more than Gemini at current volume. (2026-09-03)
- Documentation canon = STATE.md + BACKLOG.md + CHANGELOG.md. `v3-copilot/00-project-status.md` is archived history. (2026-09-03)

## Access (for agents)

- Supabase Management API token: in Tore's password manager, name `cowork-fn-deploy-2026-08`, expires 2026-09-26. Rotate before expiry.
- GitHub PAT: `cowork-migration-2026-06`, Contents R/W on aexs-nexus. Does NOT have Administration scope (repo rename etc. via web UI).
- Vercel + one.com + Supabase dashboard: Tore's browser sessions via Chrome MCP.
- Edge function deploy: `POST https://api.supabase.com/v1/projects/plnwneqqbmtwoaaeirta/functions/deploy?slug=<name>` multipart with `metadata` + `file` parts; entrypoint `source/supabase/functions/<name>/index.ts`; include `_shared/*` as extra file parts.

## Open questions for Tore

- Second LLM provider for reasoning tier (B-22)? Groq (free) / OpenRouter / DeepSeek — Tore creates key, I wire it. Or stay Flash-only until actor universe is bigger.
- Retire `nexus-pulse-palette.vercel.app` alias? (harmless to keep)
