---
phase: 01-live-on-github-pages
plan: 04
subsystem: infra
tags: [github-actions, github-pages, ci, git-push, consent-gate]

requires:
  - phase: 01-live-on-github-pages
    provides: "deploy.yml workflow and stack docs (plan 01-03); build-output gate and self-hosted assets (plan 01-02); React 19 + Vite 8 app, lockfile and tests (plan 01-01)"
provides:
  - "origin/main equals local main at 8e6dc30 (27 commits published with the user's explicit push-now)"
  - "First deploy.yml run on GitHub: npm ci, npm test and npm run build all succeeded on ubuntu-latest (RESEARCH A5 settled: Windows-made lockfile installs under Linux npm ci)"
  - "RESEARCH A1 outcome: the Pages steps also succeeded while the repo Pages source was still legacy (see Issues Encountered)"
affects: [01-05 Pages source switch and live verification]

actuals:
  tokens: 0
  tasks: 2
  commits: 0
plan_head_before: 8e6dc30c7dce9fdc573decf8ad30ada4ec90de51

tech-stack:
  added: []
  patterns:
    - "Push only after a verbatim consent reply recorded in SUMMARY; pre-push gate run on the exact commit"

key-files:
  created: []
  modified: []

key-decisions:
  - "User answered push-now with config committed first: 8e6dc30 (.planning/config.json allowing commits on main) was committed by the orchestrator and published with the rest"
  - "No GitHub repository or Pages settings were changed; the Pages source switch stays with plan 01-05 STOP 2"

requirements-completed: [DEPL-02]

duration: 15min
completed: 2026-09-30
status: complete
---

# Phase 1 Plan 04: Push main and first CI run Summary

**Local main (27 commits ahead of origin) pushed to origin/main on the user's "push-now, commit config" go-ahead; the first deploy.yml run passed npm ci, npm test, npm run build on ubuntu-latest, and every other step too.**

## Performance

- **Duration:** about 15 min (continuation agent)
- **Completed:** 2026-09-30
- **Tasks:** 2 (Task 1 checkpoint answered, Task 2 executed)
- **Files modified:** 0 (remote state only)

## User reply at Task 1 checkpoint (verbatim)

> "push-now, commit config"

Meaning (as relayed by the orchestrator): push-now, option (a) for the `.planning/config.json` gate issue: commit the config change first. The orchestrator made that commit (`8e6dc30 chore(config): allow commits on main for phase 1 execution`) before this continuation started. The reply contains "push-now", so the hold branch did not apply. The plan's acceptance wording asked for exactly "push-now" or "hold"; the reply was "push-now" plus an instruction about the config commit, and it is recorded in full here. Push scope was `git push origin main` only: no force, no tags, no other branch.

## Unpushed commit list (git fetch origin; git log --oneline origin/main..main; count 27)

```
8e6dc30 chore(config): allow commits on main for phase 1 execution
4e6f8dd docs(01-03): complete Actions deploy workflow and stack docs plan
592ec7a docs(01-03): record the shipped React 19, Vite 8 and Actions stack (D-03)
293089c ci(01-03): test, build and deploy to GitHub Pages with SHA-pinned actions
156762f docs(01-02): update state and roadmap for completed plan
58c1186 docs(01-02): add plan summary for font, favicon and build gate
eb67e64 feat(01-02): gold-cross favicon and theme color under the base path
0496007 test(01-02): gate the production build on base-path, local-only assets
3dd5f64 feat(01-02): self-host EB Garamond and drop the Google Fonts stylesheet
963bdd3 test(01-02): forbid the Google Fonts stylesheet in the rendered app
89dbc1a docs(01-01): update state and roadmap for completed plan
2943951 docs(01-01): add plan summary for walking skeleton tracer
eeba8e5 feat(01-01): build and serve the game with React 19 and Vite 8
da07ab5 refactor(01-01): move App component to src/App.jsx
bc88cc1 docs(01): create phase plan
b8e3f9a docs(phase-1): add research and validation strategy
844cd6e docs: capture todo - Game-feel UI pass with Fable 5.1
5b12cf7 docs(state): record phase 1 context session
b0ed791 docs(01): capture phase context
f30f4fc docs: create roadmap (7 phases)
e155196 docs: define v1 requirements
4599c82 docs: complete project research
d2359ec docs: add PWA requirement
07e25ae docs: allow good-natured satire of Catholics
d6a0768 chore: add project config
cc92979 docs: initialize project
447241d docs: map existing codebase
```

Untracked local files (never staged, never pushed): `.claude/plans/`, `.gsd/`, `.planning/intel/`, `.planning/milestone.lock`, `.planning/state.json`, `WORKLOG.md`.

## Pre-push gate (on commit 8e6dc30, immediately before the push)

| Check | Result |
| ----- | ------ |
| `npm ci` | passed, 0 vulnerabilities |
| `npm test` | vitest 5.0.2: 2 test files passed, 5 tests passed |
| `npm run build` | built in 514 ms (16 modules, dist/index.html, 4 woff2 fonts, index css and js) |
| workflow structural check (01-03 Task 1 verify block) | printed `workflow ok` |
| empty-test-run check (no passWithNoTests) | printed `empty test run still fails the gate` |
| `git diff --quiet HEAD` | clean; final line `pre-push gate ok` |

## Push

- Command: `git push origin main`
- Output: `55f4cd0..8e6dc30  main -> main`
- Pushed SHA: `8e6dc30c7dce9fdc573decf8ad30ada4ec90de51`
- After `git fetch origin`: `git rev-parse origin/main` and `git rev-parse main` both `8e6dc30c7dce9fdc573decf8ad30ada4ec90de51`.
- `gh api repos/AvocadoPanic/pilgrims-predestined-path/contents/.claude/plans` returned HTTP 404: the untracked plans were not pushed.
- gh active account: AvocadoPanic (scopes include repo and workflow).

## CI result: first deploy.yml run

- Run: https://github.com/AvocadoPanic/pilgrims-predestined-path/actions/runs/36778764772 (id 36778764772)
- Event: push, head SHA 8e6dc30c7dce9fdc573decf8ad30ada4ec90de51, created 2026-09-30T21:20:13Z, finished about 23 s later. Overall conclusion: success.

| Step | Conclusion |
| ---- | ---------- |
| Set up job | success |
| Run actions/checkout@3d3c42e | success |
| Run actions/setup-node@8207627 | success |
| Run npm ci | success |
| Run npm test | success |
| Run npm run build | success |
| Run actions/configure-pages@45bfe01 | success |
| Run actions/upload-pages-artifact@fc324d3 | success |
| Run actions/deploy-pages@368f825 | success |
| Smoke check live page | success |
| Post Run actions/setup-node | success |
| Post Run actions/checkout | success |
| Complete job | success |

Third verify command (npm ci, npm test, npm run build all success): printed `true`.

## Accomplishments

- DEPL-02 CI half: a push to main ran the tests and the build through GitHub Actions with no manual step, on the user's explicit go-ahead.
- RESEARCH A5 settled: the Windows-generated lockfile installs with Linux `npm ci` on ubuntu-latest; no Pitfall 4 fallback needed.
- Nothing destructive ran: no force push, no tags, no deletions, no GitHub settings changed.

## Task Commits

1. **Task 1: STOP 1 go-ahead** - no commit (checkpoint; answered "push-now, commit config")
2. **Task 2: gate, push, CI confirmation** - no repository files changed, so no task commit. The push published the existing commits above.

**Plan metadata:** the docs commit for this SUMMARY, STATE.md and ROADMAP.md is made locally after the push and is intentionally left unpushed.

## Decisions Made

- Config commit 8e6dc30 was published together with the phase work, per the user's "commit config" choice.
- The Pages source switch was not touched; push-now does not approve it.

## Deviations from Plan

None in execution. One context note: before the continuation, the orchestrator committed `.planning/config.json` (8e6dc30) so the working tree was clean and `git diff --quiet HEAD` could pass; that added one commit (27 instead of the 26 shown at the checkpoint).

## Issues Encountered

- **RESEARCH A1 did not hold as predicted.** The plan expected configure-pages or deploy-pages to fail because the Pages source was legacy. Both succeeded, as did the smoke check. `gh api repos/AvocadoPanic/pilgrims-predestined-path/pages` still reports `build_type: legacy`, `source: {branch: main, path: /}`, `status: built` (read-only query). The GitHub deployments list shows two `github-pages` deployments for 8e6dc30 (created 21:20:14Z and 21:20:39Z); the first matches the legacy "pages build and deployment" run 36778762514 (dynamic, success, 21:20:12Z), the second the Actions deploy.
- **The live URL still served the raw source page** when fetched with `curl` about a minute after the run and again 15 s later: https://avocadopanic.github.io/pilgrims-predestined-path/ returned `index.html` containing `%BASE_URL%favicon.svg` and `/src/main.jsx`, and zero `assets/index-` matches. So the Actions deployment succeeded but the legacy branch build (or a cache) is what currently serves the site. Cause not established (I infer either the legacy build taking precedence or CDN caching). Plan 01-05 should re-check after the source switch and treat the current live content as unverified. The smoke step passing is also not proof of the live content given this result; it should be reviewed in 01-05.
- Nothing was changed to address this (out of scope for 01-04; Pages settings are STOP 2 in 01-05).

## User Setup Required

None in this plan. Plan 01-05 STOP 2 (switch the Pages source to GitHub Actions) remains.

## Next Phase Readiness

- origin/main holds the Phase 1 work; CI proved install, test and build on Linux.
- Plan 01-05 can start: switch Pages source to Actions (user stop), then verify the live URL serves the built app (assets/index-*, favicon under the base path) and the game works. Carry forward the A1 surprise and the raw-source live page above.

## Known Stubs

None.

---
*Phase: 01-live-on-github-pages*
*Completed: 2026-09-30*
