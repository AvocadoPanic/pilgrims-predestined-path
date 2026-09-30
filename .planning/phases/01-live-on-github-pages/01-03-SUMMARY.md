---
phase: 01-live-on-github-pages
plan: 03
subsystem: infra
tags: [github-actions, github-pages, ci, vitest, sha-pinning, claude-md]

requires:
  - phase: 01-live-on-github-pages
    provides: "npm test and npm run build scripts, committed lockfile, Vite base path (plan 01-01); build-output gate inside npm test (plan 01-02)"
provides:
  - "Single-job GitHub Actions workflow: npm ci, npm test, npm run build, then official Pages actions and a live smoke check"
  - "CLAUDE.md and the codebase maps it is generated from describe React 19, Vite 8, Vitest 5, the committed lockfile, self-hosted fonts, src/App.jsx and the Actions deploy (D-03)"
affects: [01-04 push to main, 01-05 Pages source switch and live checks]

actuals:
  tokens: 2700
  tasks: 2
  commits: 2
plan_head_before: 156762f836813f49a5bb019d094b68447a28d5fb

tech-stack:
  added: []
  patterns:
    - "Every workflow action pinned to a full 40-character commit SHA with a version comment"
    - "Workflow step outputs reach shell scripts through env, never interpolated into script text"
    - "Edits to CLAUDE.md marker blocks are mirrored into the .planning/codebase source maps"

key-files:
  created: []
  modified:
    - .github/workflows/deploy.yml
    - .claude/CLAUDE.md
    - .planning/codebase/STACK.md
    - .planning/codebase/ARCHITECTURE.md

key-decisions:
  - "Smoke check step kept (research Open Question 3): it is the only automatic check of the live URL; page_url is passed via env PAGE_URL"
  - "Node pinned to 24 in CI, not lts/*"
  - "npm run deploy line in the STACK.md scripts block replaced by npm test (the deploy script was dropped in plan 01-01)"

patterns-established:
  - "Deploy gate: npm test precedes build, upload and deploy with no if: or continue-on-error before the upload"

requirements-completed: [DEPL-02]

coverage:
  - id: D1
    description: "Workflow file is valid YAML with LF endings, push-to-main and workflow_dispatch triggers, exact least-privilege permissions, concurrency group pages with cancel-in-progress, and the fixed nine-step order"
    requirement: DEPL-02
    verification:
      - kind: other
        ref: "python structural check from 01-03-PLAN.md Task 1 verify block (prints 'workflow ok')"
        status: pass
    human_judgment: false
  - id: D2
    description: "A failing npm test stops the job before upload and deploy: no step before the upload has if: or continue-on-error, and no Vitest pass-with-no-tests option is enabled"
    requirement: DEPL-02
    verification:
      - kind: other
        ref: "python structural check (conditional-step assertion) and the passWithNoTests grep ('empty test run still fails the gate')"
        status: pass
    human_judgment: true
    rationale: "Proven structurally only. A live failing-test run needs a separate user-approved push and is not planned (flagged assumption A4)."
  - id: D3
    description: "All five actions are pinned to 40-character SHAs with version comments; the smoke step reads PAGE_URL from env and has no expression in its script"
    requirement: DEPL-02
    verification:
      - kind: other
        ref: "grep -E 'uses: actions/[a-z-]+@[0-9a-f]{40} # v[0-9]' deploy.yml | wc -l prints 5; python structural check"
        status: pass
    human_judgment: false
  - id: D4
    description: "CLAUDE.md, STACK.md and ARCHITECTURE.md name the shipped stack with no React 18 versions left and all 14 GSD markers intact"
    verification:
      - kind: other
        ref: "docs check from 01-03-PLAN.md Task 2 verify block (prints 'docs match shipped stack'); grep -o '<!-- GSD:' .claude/CLAUDE.md | wc -l prints 14"
        status: pass
    human_judgment: false
  - id: D5
    description: "The workflow runs green on GitHub (npm ci accepts the lockfile, tests pass on Linux, deploy and smoke check succeed)"
    requirement: DEPL-02
    verification: []
    human_judgment: true
    rationale: "The workflow cannot run before plan 01-04 pushes it and plan 01-05 switches the Pages source; nothing was pushed here."

duration: 2min
completed: 2026-09-30
status: complete
---

# Phase 1 Plan 03: Actions Deploy Workflow and Stack Docs Summary

**Broken one-line deploy file replaced by a single-job GitHub Actions pipeline (npm ci, npm test, npm run build, SHA-pinned official Pages actions, live smoke check) under least-privilege permissions, and CLAUDE.md plus its source maps now describe React 19, Vite 8, Vitest 5 and the Actions deploy.**

## Performance

- **Duration:** about 2 min
- **Started:** 2026-09-30T06:45:58Z
- **Completed:** 2026-09-30T06:47:32Z (work finished; SUMMARY written after)
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- `.github/workflows/deploy.yml` rewritten with the Write tool (LF, `git ls-files --eol` shows `i/lf`). Triggers: push to `main` and `workflow_dispatch`. Permissions exactly `contents: read`, `pages: write`, `id-token: write`. Concurrency group `pages` with `cancel-in-progress: true`. One job `deploy` on ubuntu-latest, Node 24 with npm cache, steps in the fixed order checkout, setup-node, `npm ci`, `npm test`, `npm run build`, configure-pages, upload-pages-artifact (`./dist`), deploy-pages (id `deployment`), "Smoke check live page".
- All five actions pinned to full SHAs with version comments (checkout v7.0.1, setup-node v7.0.0, configure-pages v6.0.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1); the grep count is 5.
- Smoke step retries up to 6 times at 10 s intervals against `${PAGE_URL}?cb=${GITHUB_RUN_ID}` and needs `/pilgrims-predestined-path/assets/index-` in the body. `PAGE_URL` arrives via `env`; the script contains no `${{ }}` expression (T-01-12).
- Neither `vite.config.js` nor `package.json` enables `passWithNoTests`, so an empty test run fails the gate.
- `.claude/CLAUDE.md` stack block and architecture block updated (React `^19.3.0`, Vite `^8.3.1` with plugin-react `^6.1.1`, Vitest `^5.0.2`, `package-lock.json` with `npm ci`, Node `>=22.12.0` and CI Node 24, self-hosted `@fontsource/eb-garamond`, `src/App.jsx`, the Actions deploy); the resolved "Missing App.jsx File" anti-pattern heading deleted. All 14 GSD marker lines survive.
- `.planning/codebase/STACK.md` and `ARCHITECTURE.md` mirrored so a `generate-claude-md` rebuild keeps D-03.

## Task Commits

1. **Task 1: Test, build and deploy workflow** - `293089c` (ci) `ci(01-03): test, build and deploy to GitHub Pages with SHA-pinned actions`
2. **Task 2: Shipped stack in CLAUDE.md and source maps** - `592ec7a` (docs) `docs(01-03): record the shipped React 19, Vite 8 and Actions stack (D-03)`

**Plan metadata:** committed separately (docs: complete plan)

## Files Created/Modified

- `.github/workflows/deploy.yml` - replaced; single-job test, build, deploy and smoke-check workflow
- `.claude/CLAUDE.md` - stack and architecture marker blocks updated
- `.planning/codebase/STACK.md` - source of the stack block, same facts
- `.planning/codebase/ARCHITECTURE.md` - source of the architecture block, same facts; resolved anti-pattern replaced by one line

## Decisions Made

- Kept the smoke check: it is the only automatic check that the live URL serves the built assets, and it fails loudly if the Pages source switch (plan 01-05) was forgotten.
- Node stays pinned to 24 rather than `lts/*`.
- Used `^19.3.0` (user approved the pins as listed in plan 01-01, not the 19.2.8 fallback).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Stale `npm run deploy` line in the STACK.md scripts block**
- **Found during:** Task 2
- **Issue:** The "Build & Dev Scripts" block in `.planning/codebase/STACK.md` still listed `npm run deploy`, a script plan 01-01 removed; the plan's list of stale lines did not name it.
- **Fix:** Replaced it with `npm test` and a note that deploys go through GitHub Actions. STACK.md is a listed file; no other file touched.
- **Files modified:** `.planning/codebase/STACK.md`
- **Committed in:** `592ec7a`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** none on scope; the file was already in the task.

## Issues Encountered

- The plan's scope leaves some other stale text in place on purpose: the CLAUDE.md architecture component table and Layers lists still cite `pilgrims-predestined-path.jsx` line numbers, the Conventions block still mentions `./App` and the old filename, and ARCHITECTURE.md's HTML entry-point bullet still says "load fonts". They are outside Task 2's list and the `<action>` says to touch nothing else; a later codebase re-map (`/gsd-map-codebase`) will refresh them.
- `gsd-tools` prints config warnings on every call (pre-existing, from earlier plans); not caused by this plan.

## Known Stubs

None.

## Threat Flags

None. T-01-09 (SHA pins), T-01-10 (exact permissions), T-01-11 (test before deploy, no conditional step before upload) and T-01-12 (env PAGE_URL) are mitigated and asserted by the structural check; T-01-13 and T-01-14 accepted as planned.

## User Setup Required

None - no external service configuration required. The push and the Pages source switch are user stops in plans 01-04 and 01-05; nothing was pushed and no repository setting was changed.

## Next Phase Readiness

- Ready for plan 01-04 (push to `main`, which triggers the first real run of this workflow).
- Still unproven until that run: RESEARCH A3 (`page_url` ends with a slash so `?cb=` is valid), A5 (`npm ci` on ubuntu-latest accepts the Windows-generated lockfile), A6 (Pages serves the new index.html within about a minute). If the smoke step fails on A3, adjust the smoke step, not the deploy.
- A live failing-test run was not planned; the test gate is verified structurally only.

## Self-Check: PASSED

- Files present: `.github/workflows/deploy.yml`, `.claude/CLAUDE.md`, `.planning/codebase/STACK.md`, `.planning/codebase/ARCHITECTURE.md`.
- Commits present: `293089c`, `592ec7a`; `git rev-list --count 156762f836813f49a5bb019d094b68447a28d5fb..HEAD` printed 2 (measured from the persisted ledger `.git/gsd-plan-head-before-01-03`).
- Task 1: `workflow ok` PASS; "empty test run still fails the gate" PASS; `git ls-files --eol` `i/lf` PASS; five pinned `uses:` lines PASS; smoke script has no `${{` PASS.
- Task 2: "docs match shipped stack" PASS; 14 GSD markers PASS; one `GSD:stack-start source:codebase/STACK.md` line PASS; CLAUDE.md contains `^19.3.0`, `^8.3.1`, `^5.0.2`, `package-lock.json`, `deploy.yml` PASS; `git show --stat --format= HEAD` lists exactly the three files PASS.
- Nothing pushed.

---
*Phase: 01-live-on-github-pages*
*Completed: 2026-09-30*
