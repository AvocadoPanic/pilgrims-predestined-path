---
gsd_state_version: "1.0"
current_phase: 02
current_phase_name: Installable, With Safe Updates
status: verifying
stopped_at: Completed 02-05-PLAN.md
last_updated: "2026-10-02T03:45:27.813Z"
last_activity: 2026-10-01
last_activity_desc: Phase 02 execution started
state_head: 5ad072d5e925918f4f10c1057251d4e781df0892
progress:
  total_phases: 7
  completed_phases: 1
  total_plans: 10
  completed_plans: 10
  percent: 14
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-30)

**Core value:** Every hard question the game raises gets an answer that is both funny and correct, with Scripture and confession citations anyone can check.
**Current focus:** Phase 02 — Installable, With Safe Updates
**Current focus:** Phase 01 — Live on GitHub Pages

## Current Position

Phase: 02 (Installable, With Safe Updates) — EXECUTING
Plan: 5 of 5
Status: Phase complete — ready for verification
Last activity: 2026-10-01 — Phase 02 execution started

Progress: [█░░░░░░░░░] 14%

## Performance Metrics

**Velocity:**

- Total plans completed: 5
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 5 | - | - |

**Recent Trend:**

- Last 5 plans: none yet
- Trend: -

*Updated after each plan completion*
**Per-Plan Metrics:**

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 01 P01 | 2 min | 2 tasks | 8 files |
| Phase 01 P02 | 4 min | 2 tasks | 7 files |
| Phase 01 P03 | 2 min | 2 tasks | 4 files |
| Phase 01 P04 | 15min | 2 tasks | 0 files |
| Phase 01 P05 | 5 min | 2 tasks | 0 files |
| Phase 02 P01 | 25 min | 3 tasks | 12 files |
| Phase 02 P02 | 12 min | 3 tasks | 13 files |
| Phase 02 P03 | 15 min | 2 tasks | 2 files |
| Phase 02 P04 | 8 min | 2 tasks | 0 files |
| Phase 02 P05 | 10 min | 2 tasks | 0 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: Vertical MVP slicing, 7 phases; deploy first, then install with safe updates, honest copy, fixed-space questions, pool and quiz, layout, translations plus offline.
- [Roadmap]: Verification pipeline (ACC-01..03) ships with the 18 fixed questions in Phase 4, before bulk pool authoring in Phase 5.
- [Roadmap]: Install and safe updates (PWA-01, PWA-02, PWA-04) moved to Phase 2 at the user's request ("Approve, install early"); offline completeness and the offline notice (PWA-03, PWA-05) stay in Phase 7 with translations so the offline check covers all content, verses and credits.
- [Roadmap]: Service worker uses `registerType: 'prompt'` and is live from Phase 2; verification for Phases 3 to 7 includes a two-deploy update check (new version offered, not stale; no reload mid-game).
- [Phase 01]: 01-01: react and react-dom pinned ^19.3.0 (user approved Task 1 gate: 'approved') — Package legitimacy gate passed; registry showed no postinstall scripts
- [Phase 01]: 01-01: git.allow_default_branch_commits=true; commits land on main — User chose 'Allow commits on main (Recommended)' after protected-branch HEAD guard halted executors
- [Phase 01]: D-04: favicon linked as %BASE_URL%favicon.svg (Vite rewrites it under the base; a bare relative path is not rewritten and fails the build-output gate) — Keeps every built reference under /pilgrims-predestined-path/
- [Phase 01]: EB Garamond self-hosted via own woff2-only fonts.css over @fontsource files (four files, no .woff duplicates) — Avoids dead weight in dist and Phase 2 precache
- [Phase 01]: Deploy workflow keeps the live smoke check; actions SHA-pinned, Node 24, PAGE_URL passed via env
- [Phase 01]: 01-04: user answered 'push-now, commit config'; main pushed (8e6dc30) with config commit; Pages settings untouched
- [Phase 01]: 01-04: first deploy.yml run passed all steps incl. deploy-pages under legacy Pages source (A1 not as predicted); live URL still serves raw source, recheck in 01-05
- [Phase 01]: Pages source switched to GitHub Actions (build_type workflow) only after the user's verbatim flip-now; deployed via workflow_dispatch run 36779326540; live site verified; no rollback needed
- [Phase 02]: 02-01: update applied only from Start; onNeedReload reloads only on the setup screen (second-tab hazard); handoff in sessionStorage ppp:start-after-update read once and validated — A game in progress must never reload in any tab; storage on the shared origin is untrusted
- [Phase 02]: 02-01: two-key kill switch (KILL_SWITCH in vite.config.js plus EXPECT_KILL_SWITCH in build-output.test.js) — A single accidental flip must fail CI
- [Phase 02]: 02-02: no favicon.ico; SVG icon link covers browsers (D-11 discretion) — No success criterion needs an .ico
- [Phase 02]: 02-02: install store never calls prompt() itself; one use per offered event; row falls back to the iOS line on iOS after use — PWA-01 prohibition and T-02-06
- [Phase 02]: 02-03: kill switch rehearsed locally only; two-key procedure and standing PWA rules recorded in docs/PWA.md — Emergency recovery must be tested before any worker ships; one-key flip fails the build test
- [Phase 02]: 02-03: deploy.yml skips docs-only pushes, queues deploys, smoke-checks live PWA files; ci(02-03) commit is the last non-docs commit of the plan — D-17, D-18, SC5; lets 02-04 release its parent as build A and 02-05 release it as build B
- [Phase 02]: 02-04: pushed release A (82e2eac) alone by SHA to origin/main after the user's reply 'push' (read as push-a); C and later commits stay local for 02-05
- [Phase 02]: 02-05: release B (5ad072d) pushed to origin/main after the user's 'push' reply (read as push-b); live two-deploy check passed on GitHub Pages — Proves PWA-04 on the real host: update offered on setup, Start loads B, game in progress never reloaded, B deploy incl. live PWA smoke step succeeded

### Pending Todos

- [2026-09-29] [ui] Game-feel UI pass with Fable 5.1 — [todo file](.planning/todos/pending/2026-09-29-game-feel-ui-pass-with-fable-5-1.md) — Needs TBD. Direction from the user:.

### Blockers/Concerns

- [Phase 1]: Code review warnings open: WR-01 (no test proves the fonts are bundled) and WR-02 (`cancel-in-progress: true` can cancel a deploy mid-run); see 01-REVIEW.md, fix with `/gsd-code-review 01 --fix`.
- [Phase 1]: "A failing test stops the deploy" is verified by step order only, not by a live failing run; 4 of 6 UAT checks were waived by the user at phase close (01-UAT.md).
- [Phase 1]: `.planning/codebase/` map predates Phase 1 (drift gate advisory); refresh with `/gsd-map-codebase` before planning leans on it.
- [Phase 4]: Public-domain Heidelberg Catechism and Luther (Cole) texts not yet located; WCF references must be re-checked against the 1646/1647 original.
- [Phase 7]: ESV ships on our reading of Crossway's "commentary" clause; revisit if Crossway objects.

## Deferred Items

Items acknowledged and deferred at milestone close, most recent first:

| Category | Item | Status | Deferred At | Milestone |
|----------|------|--------|-------------|-----------|
| *(none)* | | | | |

## Session Continuity

Last session: 2026-10-02T03:45:27.597Z
Stopped at: Completed 02-05-PLAN.md
Resume file: None
