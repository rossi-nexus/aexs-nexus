# NEXUS — session protocol for AI agents

You are working on NEXUS (ÆXS): an AI-native platform that turns a described *effect* ("I need X to happen") into a ranked, verified list of actors who can deliver it — including non-obvious dual-use actors from adjacent sectors. Product owner: Tore Rosland. Live: https://nexus.aexs.no

This file is read at the start of every session. Follow it.

## 1. Start of session — always

1. Read `STATE.md`. It is the only source of truth for what is live, in flight, blocked, and next. If it contradicts anything else (including docs in `v3-copilot/`), `STATE.md` wins.
2. Read `BACKLOG.md`. Pick from **Now**, not from **Later**, unless Tore says otherwise.
3. If you're about to touch an edge function or a prompt: read `evals/README.md`. You will run evals before deploying.
4. Do not re-read all of `v3-copilot/`. It is history. `v3-copilot/audit-complete-2026-09-03.md` is the last full-state audit; use it for context, not for decisions.

## 2. Doing the work

- **One backlog item at a time.** Finish it (acceptance criteria met), log it, then take the next.
- **Small commits, descriptive messages**, prefixed with the backlog ID: `[B-07] data-fence scraped content in search-role`.
- **Push to `main`** for anything additive or cosmetic. **Use a branch + preview URL** for anything that changes ranking, interpretation prompts, DB schema, or auth. Tore reviews the preview before merge.
- **Edge functions deploy via the Supabase Management API** (see `STATE.md` → Access). Frontend deploys automatically on push to `main` via Vercel.
- **Never** modify: DNS for `nexus.aexs.no` / email records at one.com, the `aexs-nexus` Vercel project's domain config, `nexus-production` Supabase secrets without telling Tore first.

## 3. Before deploying any edge function or prompt change

Run the eval set (`evals/`) against the current deployed version *and* your change. Compare. If any query regresses on its expected categories, do not deploy — fix or escalate. The Gemini 2.5→3.6 regression in Aug 2026 went unnoticed because this didn't exist. It exists now.

## 4. End of session — always

1. Update `STATE.md`: what changed, what's now in flight, what's blocked, what's next. Keep it under 150 lines. Delete stale lines.
2. Append to `CHANGELOG.md`: one line per shipped change. `YYYY-MM-DD [B-xx] what — why`.
3. Update `BACKLOG.md`: move done items to Done (keep the last 20, prune older), adjust Now/Next if priorities shifted.
4. Commit these three files together: `[ops] session close YYYY-MM-DD`.

If you ran out of time mid-item, say so in `STATE.md` under **In flight** with exactly where you stopped and what the next command is.

## 5. Sub-agents

When spawning sub-agents (research, audit, parallel builds): give each one `STATE.md` + the specific backlog item as context. They write to files, never to `STATE.md` directly — the orchestrating session merges. Sub-agents don't deploy.

## 6. When unsure

Ask Tore. One question, with a recommended default. He prefers concise. Do not ask about things already decided in `STATE.md` → Decisions.

## 7. Language

Code, commits, backlog, state: English. Conversation with Tore: whichever language he's using. UI copy: English for now (Norwegian localisation is a backlog item).
