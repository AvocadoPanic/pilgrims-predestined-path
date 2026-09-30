---
gsd_state_version: "1.0"
current_phase: 2
current_phase_name: Installable, With Safe Updates
status: planning
stopped_at: Phase 01 complete, ready to plan Phase 2
last_updated: "2026-09-30T21:52:03.514Z"
last_activity: 2026-09-30
last_activity_desc: Phase 01 complete, transitioned to Phase 2
state_head: 46ea2812db52f4f26cd0a8310c95f57cc707fa1f
progress:
  total_phases: 7
  completed_phases: 1
  total_plans: 5
  completed_plans: 5
  percent: 14
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-30)

**Core value:** Every hard question the game raises gets an answer that is both funny and correct, with Scripture and confession citations anyone can check.
**Current focus:** Phase 2: Installable, With Safe Updates
**Current focus:** Phase 01 — Live on GitHub Pages

## Current Position

Phase: 2 — Installable, With Safe Updates
Plan: Not started
Status: Ready to plan
Last activity: 2026-09-30 — Phase 01 complete, transitioned to Phase 2

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

Last session: 2026-09-30T21:29:35.910Z
Stopped at: Phase 01 complete, ready to plan Phase 2
Resume file: None
