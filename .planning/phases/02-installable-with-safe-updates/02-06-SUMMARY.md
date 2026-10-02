---
phase: 02-installable-with-safe-updates
plan: 06
subsystem: pwa
tags: [react, vitest, service-worker, sessionStorage, playwright-core]

requires:
  - phase: 02-installable-with-safe-updates
    provides: "Update controller (updates.apply, isReloading, setSafeToReload) and the start handoff from plans 02-01 to 02-05"
provides:
  - "startHandoff whose default storage read can never throw (CR-01 closed)"
  - "createStartWithUpdate helper: one-shot guard, handoff save, apply, 4000 ms fallback, cancel (WR-01 closed)"
  - "Start and pilgrim buttons disabled while an update loads, with a Loading the new version... line"
affects: [02-07, phase-2-verification]

plan_head_before: 357d0520dfde733fe2ce9da1852eb8b4faf48f74
actuals:
  tokens: 4961
  tasks: 3
  commits: 5

tech-stack:
  added: []
  patterns:
    - "Module-private defaultStorage() that returns null instead of throwing, with a null guard inside each try"
    - "Timer-driven flow extracted into a factory with injectable timers, tested with vi.useFakeTimers()"

key-files:
  created:
    - src/pwa/startWithUpdate.js
    - src/pwa/startWithUpdate.test.js
  modified:
    - src/pwa/startHandoff.js
    - src/pwa/startHandoff.test.js
    - src/App.jsx
    - src/App.smoke.test.jsx

key-decisions:
  - "No fallback to localStorage or cookies when sessionStorage is blocked: the handoff is simply skipped (D-01, D-07, shared origin)"
  - "The fallback timer is armed before updates.apply() so a throwing apply can never skip it"
  - "The pilgrim buttons are disabled while applying, so the count cannot drift between the press and the fallback"

requirements-completed: [PWA-04, PWA-01, PWA-02]

duration: 9min
completed: 2026-10-02
status: complete

coverage:
  - id: D1
    description: "A browser that blocks site storage opens the game on the setup screen and can start a game (CR-01)"
    requirement: PWA-01
    verification:
      - kind: unit
        ref: "src/pwa/startHandoff.test.js#never throws when reading sessionStorage itself throws (storage blocked)"
        status: pass
      - kind: e2e
        ref: "node gapcheck.mjs blocked (scratch Edge probe)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Start-with-update flow is a tested helper: one-shot, fallback with setSafeToReload(false) before begin, never wedged, cancelled on unmount (WR-01, PWA-04)"
    requirement: PWA-04
    verification:
      - kind: unit
        ref: "src/pwa/startWithUpdate.test.js (13 tests)"
        status: pass
    human_judgment: false
  - id: D3
    description: "With an update waiting, Start shows Loading the new version..., locks the setup choices, and reloads into the new build with the chosen 3-pilgrim game"
    requirement: PWA-04
    verification:
      - kind: unit
        ref: "src/App.smoke.test.jsx#renders the setup screen without throwing"
        status: pass
      - kind: e2e
        ref: "node gapcheck.mjs update (scratch Edge probe, two builds)"
        status: pass
    human_judgment: false
---

# Phase 2 Plan 06: Blocked-storage fix and tested Start-with-update flow Summary

**sessionStorage access that throws no longer blanks the game (CR-01), and the update-on-Start sequence is a fake-timer-tested helper with a visible "Loading the new version..." state (WR-01).**

## Performance

- **Duration:** 9 min
- **Started:** 2026-10-02T13:09:55Z
- **Completed:** 2026-10-02T13:18:01Z
- **Tasks:** 3
- **Files modified:** 6 (2 created, 4 modified)

## Accomplishments

- Task 1 (tracer): a module-private `defaultStorage()` in `src/pwa/startHandoff.js` returns null when reading `sessionStorage` throws, and each handoff function null-guards inside its try. In a real Edge session with sessionStorage access throwing, the production build now shows the setup screen and starts a game; before the fix it was a blank page.
- Task 2: `src/pwa/startWithUpdate.js` holds the Start-with-update flow with a named `UPDATE_FALLBACK_MS = 4000`. Thirteen fake-timer tests cover the reload path, the fallback path (setSafeToReload(false) asserted before begin), count at fallback time, double press, restart after fallback, save and apply failures, cancel, and the CR-01 case with the real handoff functions.
- Task 3: `App.jsx` `onStart` is one line into the helper, the helper is created once per App and cancelled on unmount, the Start and pilgrim buttons are disabled while applying, and the hint reads "Loading the new version...". A two-build Edge probe confirms the page shows the loading line, reloads into build B and begins a 3-pilgrim game.

## Evidence

RED unit output (Task 1, before the fix):

```
FAIL  src/pwa/startHandoff.test.js > start handoff with the default storage > never throws when reading sessionStorage itself throws (storage blocked)
AssertionError: expected [Function] to not throw an error but 'SecurityError: The operation is insec…' was thrown
Tests  1 failed | 17 passed (18)
```

The other two new default-storage tests passed before the fix (an absent or readable storage already worked); only the throwing getter reproduced the defect, as the verifier's Node repro did.

gapcheck `blocked`, pre-fix:

```
{"mode":"blocked","ok":false,"storageBlocked":true,"setupVisible":false,"gameStarted":false,"errors":["p1 pageerror: SecurityError: The operation is insecure."]}
```

gapcheck `blocked`, post-fix (and again after Task 3):

```
{"mode":"blocked","ok":true,"storageBlocked":true,"setupVisible":true,"gameStarted":true,"errors":[]}
```

gapcheck `update` (after Task 3):

```
{"mode":"update","ok":true,"footerBefore":"v aaaaaaa","hintShown":true,"sawLoading":true,"pilgrims":3,"entryIsB":true,"errors":[]}
```

Registry check for the scratch tool (it had to be reinstalled in this session's scratchpad): `npm view playwright-core@1.63.0 version` printed `1.63.0`; `scripts.preinstall`, `scripts.install` and `scripts.postinstall` printed nothing. Installed into `$SCRATCHPAD/ppp-pwacheck` only; `git diff --quiet HEAD -- package.json package-lock.json` exits 0 and `git ls-files` shows no ppp-pwacheck.

Pre-push gate: `npm ci && npm test && npm run build` passed (6 files, 78 tests; PWA build generated sw.js with 8 precache entries). `git diff --quiet HEAD` on tracked source, package files and vite.config.js is clean. The literal `git diff --quiet HEAD` also covers `.planning/STATE.md`, which was already modified by the orchestrator before this plan started and is committed with this plan's metadata. Nothing was pushed: `git status -sb` shows main ahead of origin/main.

## Task Commits

1. **Task 1 (tracer): blocked storage still opens and starts the game** - `8698ed3` (test, RED), `2555600` (fix, GREEN)
2. **Task 2: Start-with-update helper** - `597b3e7` (test, RED), `24c1aab` (feat, GREEN)
3. **Task 3: progress line and locked setup choices** - `04ee760` (feat)

**Plan metadata:** committed separately (docs: complete plan)

## Files Created/Modified

- `src/pwa/startHandoff.js` - `defaultStorage()` plus null guards; exports and validation unchanged
- `src/pwa/startHandoff.test.js` - throwing-getter, readable-getter and absent-storage tests on the default path
- `src/pwa/startWithUpdate.js` - `UPDATE_FALLBACK_MS` and `createStartWithUpdate`
- `src/pwa/startWithUpdate.test.js` - 13 fake-timer tests
- `src/App.jsx` - helper wiring, `applying` state, disabled buttons, loading hint
- `src/App.smoke.test.jsx` - first render has no loading line and no disabled button

## Decisions Made

- When sessionStorage is blocked, the handoff is skipped; no other store is used (D-01, D-07).
- The fallback timer is armed before `updates.apply()` so a synchronous throw cannot skip it.
- Disabling the pilgrim buttons while applying is what keeps the saved count and the fallback count equal, so `getNumP: () => numP` is safe.

## Deviations from Plan

None - plan executed exactly as written.

The plan's TDD RED for Task 2 is "module does not exist", which is a valid RED here (the target tests could not load). Only one of the three Task 1 default-storage tests failed pre-fix, as described above; this is expected given Node 24's behavior and does not change the gate.

## Issues Encountered

None. The scratchpad for this session was empty, so the scratch probe and playwright-core were recreated per the plan (registry check first), reusing the layout of the earlier `update.mjs` probe.

## Known Stubs

None.

## Threat Flags

None. No new network endpoints, auth paths or storage keys; `ppp:start-after-update` is the only key and `localStorage` is not referenced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- CR-01 and WR-01 gaps from 02-VERIFICATION.md are closed in code and in a real Edge session; the verifier should treat the 02-01 source greps on App.jsx (guard ref, literal 4000, `saveStartHandoff({numP})`, single `updates.apply()`) as replaced by this plan's criteria.
- Installed-app launch (PWA-01) and iOS behavior (PWA-02) remain human items in 02-VERIFICATION.md; no push or release was done.

## Self-Check: PASSED

All six files exist on disk; commits 8698ed3, 2555600, 597b3e7, 24c1aab and 04ee760 exist; Task 1, 2 and 3 acceptance criteria re-checked green; `npm test` passes (78 tests).
