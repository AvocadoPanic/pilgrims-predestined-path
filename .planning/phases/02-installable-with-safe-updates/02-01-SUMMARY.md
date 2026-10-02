---
phase: 02-installable-with-safe-updates
plan: 01
subsystem: pwa
tags: [vite-plugin-pwa, workbox, service-worker, react, vitest, sessionStorage]

requires:
  - phase: 01-live-on-github-pages
    provides: base path /pilgrims-predestined-path/, build-output test harness, deploy workflow
provides:
  - vite-plugin-pwa generateSW worker in prompt mode with the manifest identity (id, name, short_name, description, colors, display, orientation)
  - update controller that offers a waiting version on the setup screen and applies it only from Start
  - start-after-update handoff (sessionStorage, read once, validated) that starts the chosen game in the new build
  - build id footer on the setup screen (v sha7 date, dev under serve)
  - build gate for manifest identity and the real worker under the base path
affects: [02-02 icons and install row, 02-03 docs/PWA.md and kill-switch rehearsal, 02-04 deploy, 02-05 live checks, phases 3-7 two-deploy update check]

plan_head_before: 2aca45503388045d5c1d8399fe1482e883d43d34

actuals:
  tokens: 5419
  tasks: 3
  commits: 4

tech-stack:
  added: [vite-plugin-pwa ^1.3.0 (devDependency; workbox-build 7.4.1 and workbox-window 7.4.1 as peers)]
  patterns:
    - "Injectable plain-module controller read through useSyncExternalStore with a getServerSnapshot"
    - "Virtual module import confined to src/main.jsx so no test loads it"
    - "Consume-once storage handoff read in a mount effect (StrictMode safe)"

key-files:
  created:
    - src/pwa/updates.js
    - src/pwa/store.js
    - src/pwa/startHandoff.js
    - src/pwa/updates.test.js
    - src/pwa/startHandoff.test.js
  modified:
    - package.json
    - package-lock.json
    - vite.config.js
    - src/main.jsx
    - src/App.jsx
    - src/App.smoke.test.jsx
    - src/build-output.test.js

key-decisions:
  - "Update is applied only by the Start button; onNeedReload reloads only while phase is setup, otherwise marks a pending reload (second-tab hazard from RESEARCH Pitfall 1)"
  - "Handoff is read in a mount effect and validated (numP 2, 3 or 4, at within 2 minutes, key removed on every read); the stored value is only the pilgrim count"
  - "4 second fallback after apply() begins the game if no reload arrives, and defers to a reload already under way via isReloading()"
  - "Build gate keeps a two-key kill switch (KILL_SWITCH in vite.config.js, EXPECT_KILL_SWITCH in the test) so one accidental flip fails CI"

patterns-established:
  - "No window, document or storage access at import or render time in src/pwa (smoke test renders in Node)"
  - "Failures in PWA code are swallowed (try/catch, .catch(() => {})); the game never breaks because of them"

requirements-completed: [PWA-04, PWA-01]

coverage:
  - id: D1
    description: "A waiting new version is offered on the setup screen as one plain hint line; no hint when none waits; no Update button"
    requirement: PWA-04
    verification:
      - kind: e2e
        ref: "node $SCRATCHPAD/ppp-pwacheck/update.mjs tracer (hintShown true; footer v aaaaaaa to v bbbbbbb)"
        status: pass
      - kind: unit
        ref: "src/App.smoke.test.jsx#renders the setup screen without throwing"
        status: pass
    human_judgment: false
  - id: D2
    description: "Start with an update waiting reloads into the new build and starts the game with the chosen pilgrim count; handoff consumed once and validated"
    requirement: PWA-04
    verification:
      - kind: unit
        ref: "src/pwa/startHandoff.test.js (15 cases)"
        status: pass
      - kind: e2e
        ref: "node $SCRATCHPAD/ppp-pwacheck/update.mjs full (three pilgrims on build B)"
        status: pass
    human_judgment: false
  - id: D3
    description: "A game in progress is never reloaded, in this tab or another; no update UI during play; a pending reload is applied only from the next Start"
    requirement: PWA-04
    verification:
      - kind: unit
        ref: "src/pwa/updates.test.js#update controller: never reloads a game in progress"
        status: pass
      - kind: e2e
        ref: "node $SCRATCHPAD/ppp-pwacheck/update.mjs full (page 2 zero navigations; later Start gives two pilgrims on build B)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Visibility check calls registration.update() at most every 30 minutes, no interval timer, offline rejection swallowed"
    requirement: PWA-04
    verification:
      - kind: unit
        ref: "src/pwa/updates.test.js#update controller: visibility check (D-05)"
        status: pass
    human_judgment: false
  - id: D5
    description: "Setup footer shows the build id (v sha7 date), dev under vite dev and Vitest, absent on play and end screens"
    verification:
      - kind: e2e
        ref: "update.mjs tracer footerBefore and footerAfter"
        status: pass
      - kind: unit
        ref: "src/App.smoke.test.jsx (>dev<)"
        status: pass
    human_judgment: false
  - id: D6
    description: "npm test builds the app and fails if manifest scope, start_url or id leave the base, a decided manifest field drifts, or sw.js is not the real worker registered at the base scope"
    requirement: PWA-01
    verification:
      - kind: integration
        ref: "src/build-output.test.js#PWA build output (id mutation to './' fails the gate)"
        status: pass
    human_judgment: false

duration: 25min
completed: 2026-10-02
status: complete
---

# Phase 2 Plan 01: Update Path and Build Gate Summary

**vite-plugin-pwa prompt-mode worker with a setup-screen update hint, a Start button that applies the update and carries the pilgrim count across the reload in sessionStorage, a build id footer, and a build test pinning the manifest identity under the base path**

## Performance

- **Duration:** about 25 min (start time was not captured at executor start; estimated from commit and STATE timestamps)
- **Completed:** 2026-10-02T00:34Z
- **Tasks:** 3 (one tracer, one TDD, one test gate), 4 task commits
- **Files modified:** 12 (5 created, 7 modified)

## Accomplishments

- Tracer proven end to end in real Edge against `vite preview`: a controlled page on build A is offered build B on setup, and Start reloads into B (footer `v aaaaaaa` to `v bbbbbbb`), no console or page errors.
- A game in progress is never reloaded: a second tab mid-game recorded zero navigations when another tab applied the update, and at its own next setup the hint showed and Start loaded build B with the chosen game.
- Build gate: `npm test` fails if the manifest id, scope or start_url resolve outside `https://avocadopanic.github.io/pilgrims-predestined-path/`, or if `sw.js` is not the real generateSW worker; the `id: './'` mutation is caught.

## Task Commits

1. **Task 1: Tracer, offer new versions on setup and apply on Start** - `77deec8` (feat)
2. **Task 2: Start after update begins the chosen game, other tabs never reloaded**
   - RED `3961f2d` (test)
   - GREEN `0d54eeb` (feat)
3. **Task 3: Build gate for manifest identity and the worker** - `5a4adbc` (test)

**Plan metadata:** committed with this SUMMARY (docs: complete plan)

## Registry check (Task 1 step 1)

`npm view <pkg> version` and `npm view <pkg> scripts.preinstall scripts.install scripts.postinstall`:

```
vite-plugin-pwa@1.3.0   version 1.3.0   scripts: (none)
workbox-build@7.4.1     version 7.4.1   scripts: (none)
workbox-window@7.4.1    version 7.4.1   scripts: (none)
playwright-core@1.63.0  version 1.63.0  scripts: (none)
```

`npm ci` after install succeeded with 0 vulnerabilities. `npm ls` shows `workbox-build@7.4.1` and `workbox-window@7.4.1`. `package-lock.json` contains `node_modules/@rollup/rollup-linux-x64-gnu` (1 match) and no `@vite-pwa/assets-generator` entry. playwright-core lives only in the scratchpad.

## Probe output (scratchpad only, never committed)

Tracer:

```json
{"mode":"tracer","ok":true,"footerBefore":"v aaaaaaa · 2026-10-02","hintShown":true,"footerAfter":"v bbbbbbb · 2026-10-02","navigations":3,"errors":[]}
```

Full:

```json
{"mode":"full","ok":true,"page1":{"chips":3,"vessel":0,"entryIsB":true},"page2":{"hintMidGame":false,"navsBeforeOwnStart":0,"stillPlaying":true,"clicksToEnd":62,"hintOnSetup":true,"chips":2,"saint":0,"entryIsB":true},"errors":[]}
```

Id mutation (Task 3): `id: '/pilgrims-predestined-path/'` changed to `id: './'`, `npx vitest run src/build-output.test.js` failed on `PWA build output > manifest scope, start_url and id stay under the base path` ("id: expected false to be true", 1 failed, 6 passed), `vite.config.js` restored and `git diff --quiet -- vite.config.js` clean, output "id mutation caught".

Final `npm test`: 4 files, 36 tests, all passing.

## Files Created/Modified

- `vite.config.js` - function-form config: `KILL_SWITCH`, `buildId(command)`, `define.__BUILD_ID__`, VitePWA prompt mode with manifest identity, `cleanupOutdatedCaches`
- `src/pwa/updates.js` - `createUpdateController` (waiting and pending state, gated `onNeedReload`, throttled visibility check, `apply()`, `isReloading()`)
- `src/pwa/store.js` - Node-safe singleton `updates`
- `src/pwa/startHandoff.js` - save, clear and consume the start-after-update handoff
- `src/main.jsx` - only importer of `virtual:pwa-register`; `updates.start(registerSW)`
- `src/App.jsx` - `begin(n)`, `onStart`, update hint, build id footer, handoff consumption, 4 second fallback
- `src/pwa/updates.test.js`, `src/pwa/startHandoff.test.js` - unit tests with injected fakes
- `src/App.smoke.test.jsx` - asserts `>dev<` and no update hint on server render
- `src/build-output.test.js` - `PWA build output` block, `EXPECT_KILL_SWITCH`
- `package.json`, `package-lock.json` - `vite-plugin-pwa` ^1.3.0

## Decisions Made

- Followed the plan's design (see key-decisions). `updates.apply()` appears once in the codebase, in the Start handler.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Stubs in the RED commit so the RED failures are assertions**
- **Found during:** Task 2 (RED)
- **Issue:** The plan's RED step leaves `src/pwa/startHandoff.js` missing and `isReloading` undefined, so the tests would fail on a module-load error and a TypeError. `references/tdd.md` classifies those as INVALID_RED, which must not authorize GREEN.
- **Fix:** The RED commit also carries a no-behavior `startHandoff.js` stub and `isReloading: () => false` in `updates.js`. Six tests then failed on assertions for the planned behavior (for example `expected null to deeply equal { numP: 3 }`).
- **Files modified:** src/pwa/startHandoff.js, src/pwa/updates.js
- **Verification:** `npx vitest run src/pwa` before GREEN: 6 failed, 22 passed, all six failures `AssertionError`; after GREEN: 28 passed
- **Committed in:** 3961f2d (RED), 0d54eeb (GREEN)

**2. [Rule 2 - Missing critical] Swallow a rejected `updates.apply()` promise**
- **Found during:** Task 2 (App wiring)
- **Issue:** `updateSW()` returns a promise; an unhandled rejection would surface as a console error on the setup screen.
- **Fix:** `updates.apply().catch(()=>{})`; the 4 second fallback still recovers.
- **Files modified:** src/App.jsx
- **Committed in:** 0d54eeb

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing critical)
**Impact on plan:** Both are small and keep the TDD discipline and the "PWA code never breaks the game" rule. No scope creep.

## TDD Gate Compliance

- RED: `3961f2d` `test(02-01)`: six target tests fail on assertions (handoff round trip, key removal, rejected-value removal, exact 2 minute edge, `isReloading` after `apply()` and after a safe `onNeedReload`).
- GREEN: `0d54eeb` `feat(02-01)`: all 28 `src/pwa` tests pass.
- REFACTOR: none needed.
- Note: `workflow.tdd_mode` is false in config. `gsd-tools check tdd-red-evidence` only parses node:test TAP output (Vitest's TAP reporter nests differently and reports zero discovered tests), so the RED evidence is the recorded Vitest assertion output above, not a `RED_EVIDENCE_OK` verdict.

## Issues Encountered

- A `--reporter=json` attempt while exploring the evidence checker wrote `.vitest/json/output.json` into the repo; the file and its directories were removed, nothing was staged.
- `npm install` printed a deprecation warning for `glob@11.1.0`, a transitive dependency of workbox-build. `npm audit` reports 0 vulnerabilities; not acted on (out of scope).
- The tracer `<verify>` is automated only and the run is interactive in `end-of-phase` mode, so the tracer feedback gate re-ran the verify and continued without a checkpoint ("Tracer verified end-to-end, expanding").

## Known Stubs

None. The only stubs were the RED-phase placeholders, replaced in GREEN.

## Threat Flags

None. The sessionStorage handoff, the worker and the npm supply chain are the surfaces already in the plan's threat model (T-02-SC, T-02-01, T-02-02, T-02-03, T-02-05).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 02-02 can add the generated icons to the manifest and the install row; `vite.config.js` deliberately has no `icons` array yet.
- Plan 02-03 writes `docs/PWA.md`, which `vite.config.js` and `src/build-output.test.js` already reference for the two-key kill switch.
- Nothing is pushed; the worker name `sw.js`, its scope and the manifest id become one-way at the plan 02-04 push.
- UAT note (RESEARCH Pitfall 7): a plain browser reload while a worker waits may load the new build, so UAT must not assume a reload keeps the old version.

## Self-Check: PASSED

All ten created or modified source files exist; commits `77deec8`, `3961f2d`, `0d54eeb` and `5a4adbc` exist; the `test(02-01)` RED commit precedes the `feat(02-01)` GREEN commit; all `<acceptance_criteria>` and the plan-level `<verification>` commands were re-run and pass.

---
*Phase: 02-installable-with-safe-updates*
*Completed: 2026-10-02*
