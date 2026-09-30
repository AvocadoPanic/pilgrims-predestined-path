---
phase: 01-live-on-github-pages
plan: 01
subsystem: infra
tags: [react, vite, vitest, npm, github-pages, walking-skeleton]

requires: []
provides:
  - "Game builds with Vite 8 on React 19 and is served by vite preview under /pilgrims-predestined-path/"
  - "npm test (Vitest smoke test) as the gate later plans extend"
  - "Committed package-lock.json proven with npm ci, including the Linux rolldown binding"
  - "src/App.jsx moved from the repo root in a rename-only commit (R100)"
affects: [01-02 fonts and favicon, 01-03 CI workflow, 01-04 go-live, 01-05 browser play-through]

actuals:
  tokens: 9820
  tasks: 2
  commits: 2
plan_head_before: bc88cc13d7f4d74ef1948200c671c40fbf2c9b61

tech-stack:
  added: [react@19.3.0, react-dom@19.3.0, vite@8.3.1, vitest@5.0.2, "@vitejs/plugin-react@6.1.1", "@fontsource/eb-garamond@5.3.0"]
  patterns:
    - "ESM package (type: module), Node >=22.12.0"
    - "createRoot inside StrictMode entry (D-02)"
    - "Vitest node environment with renderToString smoke test, no jsdom"
    - "LF line endings enforced via .gitattributes"

key-files:
  created:
    - src/App.smoke.test.jsx
    - package-lock.json
    - .gitignore
    - .gitattributes
  modified:
    - src/App.jsx
    - src/main.jsx
    - vite.config.js
    - package.json

key-decisions:
  - "Pins approved as listed at the Task 1 gate: react and react-dom ^19.3.0"
  - "Allow commits on main: git.allow_default_branch_commits set to true (user decision after the protected-branch HEAD guard halted earlier executors)"

patterns-established:
  - "Rename-only commit before any edit to a moved file so history reports R100"
  - "Stage files by name; never touch .claude/plans/, .planning/intel/, WORKLOG.md"

requirements-completed: [DEPL-01, DEPL-03]

coverage:
  - id: D1
    description: "Production build of the unchanged game builds with Vite 8 on React 19 and is served by vite preview under /pilgrims-predestined-path/ with its entry bundle returning 200"
    requirement: DEPL-03
    verification:
      - kind: e2e
        ref: "node preview probe from 01-01-PLAN.md Task 2 verify block (prints TRACER OK: preview serves /pilgrims-predestined-path/assets/index-Cu9knHx5.js)"
        status: pass
      - kind: other
        ref: "npm run build (dist/index.html and dist/assets/index-Cu9knHx5.js written)"
        status: pass
    human_judgment: false
  - id: D2
    description: "npm test runs Vitest and the App smoke test passes (setup screen renders HTML containing 'Predestined Path')"
    requirement: DEPL-01
    verification:
      - kind: unit
        ref: "src/App.smoke.test.jsx#App smoke renders the setup screen without throwing"
        status: pass
    human_judgment: false
  - id: D3
    description: "Lockfile committed with the Linux binding and npm ci succeeds against it"
    verification:
      - kind: other
        ref: "npm ci exit 0 after npm install; grep -c @rolldown/binding-linux-x64-gnu package-lock.json prints 3"
        status: pass
    human_judgment: false
  - id: D4
    description: "Game plays in a real browser from the production build with no console errors (DEPL-01 wording) and every referenced asset loads (DEPL-03 wording)"
    requirement: DEPL-01
    verification: []
    human_judgment: true
    rationale: "This plan proves the served bundle over HTTP and a server-side render only; no browser was run. The scripted browser play-through and the font and favicon assets belong to plans 01-02 and 01-05."

duration: 2min (continuation from Task 2; Task 1 checkpoint time not included)
completed: 2026-09-30
status: complete
---

# Phase 1 Plan 01: Walking Skeleton Summary

**Unchanged game now builds with Vite 8 on React 19 (createRoot inside StrictMode), is gated by a Vitest smoke test, and is served by vite preview under /pilgrims-predestined-path/ from a committed, npm-ci-proven lockfile.**

## Performance

- **Duration:** about 2 min for the continuation (Task 2 only)
- **Started:** 2026-09-30T06:35:13Z
- **Completed:** 2026-09-30T06:37:06Z (work finished; SUMMARY written after)
- **Tasks:** 2 (Task 1 checkpoint, Task 2 tracer)
- **Files modified:** 8 (1 rename, 3 rewritten, 4 new)

## Task 1 checkpoint reply

Package legitimacy gate (blocking-human). Registry query output shown to the user: react@19.3.0 ok, react-dom@19.3.0 ok, vite@8.3.1 ok, vitest@5.0.2 ok, @vitejs/plugin-react@6.1.1 ok, @fontsource/eb-garamond@5.3.0 ok, playwright-core@1.63.0 ok (none has a postinstall script; playwright-core is scratchpad only and never enters package.json).

User reply, verbatim: "approved"

Meaning: pins as listed, react and react-dom ^19.3.0. `node_modules/` did not exist when the reply was received (verified at continuation start: `ls node_modules` failed before `npm install`).

## Accomplishments

- Moved the game component to `src/App.jsx` in its own commit; git reports `R100` (byte-identical), and the second commit leaves `src/App.jsx` untouched.
- Replaced the legacy React 18 entry with `createRoot` inside `StrictMode` importing `./App.jsx` (exact case and extension for the case-sensitive Linux CI).
- Replaced package.json with the D-01 stack (React 19.3.0, Vite 8.3.1, Vitest 5.0.2, plugin-react 6.1.1, EB Garamond fontsource); dropped the old `deploy` script and its branch-publishing dependency.
- Added `vite.config.js` React plugin and `test.include`; one Vitest smoke test passes (`1 passed`, Vitest 5.0.2).
- `npm run build` writes `dist/index.html` and `dist/assets/index-Cu9knHx5.js` (244.98 kB, 76.33 kB gzip); the preview probe printed `TRACER OK`.
- `npm install` then `npm ci` both succeeded with 0 vulnerabilities; the lockfile lists `@rolldown/binding-linux-x64-gnu` (3 mentions).

Tracer feedback gate: the tracer's `<verify>` carries only `<automated>` checks and the phase runs in the default `end-of-phase` verify mode, so the three checks were re-run end to end (npm test, npm run build, preview probe) and all passed; expansion is unblocked.

## Task Commits

1. **Task 1: Package legitimacy gate** - no commit (checkpoint only, approved)
2. **Task 2: Tracer, rename step** - `da07ab5` (refactor) `refactor(01-01): move App component to src/App.jsx`, R100
3. **Task 2: Tracer, toolchain step** - `eeba8e5` (feat) `feat(01-01): build and serve the game with React 19 and Vite 8`

**Plan metadata:** committed separately (docs: complete plan)

## Files Created/Modified

- `src/App.jsx` - the existing game component, moved unchanged (default export `App`)
- `src/main.jsx` - React 19 entry: `createRoot` + `StrictMode`
- `vite.config.js` - base path, `@vitejs/plugin-react`, Vitest `test.include`
- `package.json` - ESM package, engines, dev/build/preview/test scripts, pinned majors
- `package-lock.json` - lockfile for `npm ci`, includes Linux rolldown binding
- `src/App.smoke.test.jsx` - renderToString smoke test
- `.gitignore` - node_modules, dist, env, log, local files
- `.gitattributes` - `* text=auto eol=lf`

## Decisions Made

- Task 1: user approved the pins as listed (react and react-dom ^19.3.0), not the ^19.2.8 fallback.
- Branch guard: earlier executors halted on the protected-branch HEAD guard because HEAD was on `main`. The user chose "Allow commits on main (Recommended)", which sets `git.allow_default_branch_commits` to `true` in `.planning/config.json` (verified: `config-get` returns `true`, and `git.base-branch --is-protected main` returns `false`). All commits for this plan are on local `main`; nothing was pushed.

## Deviations from Plan

### Process deviation (not a code deviation)

**1. [Rule 3 - Blocking] Protected-branch HEAD guard halted earlier executor runs before Task 2**
- **Found during:** Task 2 start (previous executor attempts)
- **Issue:** The pre-commit assertion refuses commits on `main`; the plan and the orchestrator run sequentially on `main` with no worktree.
- **Fix:** User decision above (allow commits on main). No code change by the executor.
- **Files modified:** `.planning/config.json` (user change; deliberately not staged by this plan)
- **Verification:** guard query now reports `main` as not protected; both task commits succeeded.

Code deviations: none. The plan's Task 2 steps were followed as written; the acceptance check `git show --numstat --format= HEAD -- src/App.jsx` prints nothing after the second commit (confirmed).

**Total deviations:** 1 process deviation, 0 auto-fixed code issues.
**Impact on plan:** none on scope.

## Issues Encountered

- `gsd-tools` prints two config warnings on every call (unknown key `quick_branch_template` in `.planning/config.json`; global defaults ignored under #3532). Not caused by this plan; left alone.
- The Bash tool's `git status` shows pre-existing, unrelated working-tree changes (`.planning/config.json`, `.planning/state.json`, `.planning/intel/`, `.planning/milestone.lock`, `.gsd/`, `.claude/plans/`, `WORKLOG.md`). None were staged.

## Known Stubs

None.

## Threat Flags

None. Threat register T-01-SC (Task 1 gate, exact pins, npm ci, playwright-core kept out of package.json), T-01-01 (`git ls-files .claude/plans .planning/intel node_modules dist` prints nothing), T-01-02 (`.gitignore` covers `.env*` and `*.local`) and T-01-03 (`.gitattributes` `eol=lf`) are all mitigated as planned.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for plan 01-02 (self-hosted EB Garamond font and favicon; it removes the two font link elements from `src/App.jsx` in a later commit and adds the font-host assertion red-then-green to the smoke test).
- Flagged assumption RESEARCH A5 is not yet proven: `npm ci` on ubuntu-latest accepting this Windows-generated lockfile. Only the first CI run in plan 01-04 proves it; the Linux binding entry is present.
- DEPL-01 ("no console errors" in a browser) and DEPL-03 ("every asset loads, including icons and fonts") are only partly evidenced here (HTTP probe and server render). The browser play-through and asset work land in 01-02 and 01-05.

## Self-Check: PASSED

- Files present: `src/App.jsx`, `src/main.jsx`, `src/App.smoke.test.jsx`, `vite.config.js`, `package.json`, `package-lock.json`, `.gitignore`, `.gitattributes`; `pilgrims-predestined-path.jsx` absent.
- Commits present: `da07ab5`, `eeba8e5`; `git rev-list --count bc88cc13d7f4d74ef1948200c671c40fbf2c9b61..HEAD` prints 2 (measured from the persisted ledger at `.git/gsd-plan-head-before-01-01`).
- Acceptance criteria re-run: rename R100 PASS; package.json field check PASS; react 19.3.0 PASS; lockfile binding 3 mentions and `npm ci` exit 0 PASS; main.jsx contents and no legacy `ReactDOM` PASS; vite.config.js contents PASS; .gitattributes and .gitignore contents PASS; `git ls-files .claude/plans .planning/intel node_modules dist` empty PASS.
- Plan-level verification: `npm test` green, `npm run build` exit 0, preview probe `TRACER OK`, `npm ci` succeeded.

---
*Phase: 01-live-on-github-pages*
*Completed: 2026-09-30*
