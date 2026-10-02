---
phase: 02-installable-with-safe-updates
plan: 02
subsystem: pwa
tags: [pwa, manifest, icons, apple-touch-icon, beforeinstallprompt, ios, react, vitest]

requires:
  - phase: 02-installable-with-safe-updates
    provides: "plan 02-01 manifest identity, store.js singleton pattern, setup screen hint and footer, PWA build-test block"
provides:
  - four full-bleed PNG icons generated once from public/favicon.svg (192, 512, maskable 512, apple-touch 180)
  - manifest icons array (192 any, 512 any, separate 512 maskable) and apple-touch-icon plus apple-mobile-web-app-title in index.html
  - build test assertions for icon presence, size, base path and 180x180 opacity
  - install store (beforeinstallprompt held, prompt() only from the button, one use per event) and the install row on the setup screen
  - iOS Share instructions row for iPhone and iPad, including iPadOS with a Mac user agent
affects: [02-03 docs/PWA.md, 02-04 deploy and real-device checks, 02-05 live checks]

plan_head_before: 4fbd8751985386d74284d0107494be0133fe4813

actuals:
  tokens: 3700
  tasks: 3
  commits: 3

tech-stack:
  added: []
  patterns:
    - "Install store created at module scope in store.js so beforeinstallprompt is captured before React mounts"
    - "Closure-only store methods so onClick={installs.promptInstall} works unbound"
    - "One-time author tool run through npx with --ignore-scripts, never a project dependency"

key-files:
  created:
    - scripts/pwa-assets.config.mjs
    - public/pwa-192x192.png
    - public/pwa-512x512.png
    - public/maskable-icon-512x512.png
    - public/apple-touch-icon-180x180.png
    - src/pwa/install.js
    - src/pwa/install.test.js
  modified:
    - vite.config.js
    - index.html
    - src/build-output.test.js
    - src/pwa/store.js
    - src/App.jsx
    - src/App.smoke.test.jsx

key-decisions:
  - "No favicon.ico: the SVG icon link already covers browsers and no success criterion needs an .ico (Claude's Discretion, decided)"
  - "The install button is wired only to onClick; the store never calls prompt() itself and drops the event after one use (T-02-06)"
  - "After the prompt is used on an iOS device that was also offered the event, the row falls back to the Share line, not nothing (follows installRowMode)"

patterns-established:
  - "Generated assets are committed; the generator is not in package.json or the lockfile (D-12)"
  - "Build test reads PNG IHDR and tRNS directly, so no image dependency is needed"

requirements-completed: [PWA-01, PWA-02]

coverage:
  - id: D1
    description: "Manifest lists 192 any, 512 any and a separate 512 maskable icon, all under the base path, with PNGs of exactly those sizes"
    requirement: PWA-01
    verification:
      - kind: integration
        ref: "src/build-output.test.js#manifest declares 192, 512 any and a separate 512 maskable icon at the right size (missing-icon mutation fails the build test)"
        status: pass
      - kind: e2e
        ref: "node $SCRATCHPAD/ppp-pwacheck/install.mjs installable (no manifest errors, no installability errors, three icons 200 image/png)"
        status: pass
    human_judgment: false
  - id: D2
    description: "index.html links an opaque 180x180 apple-touch-icon under the base and sets apple-mobile-web-app-title to Pilgrim's Path"
    requirement: PWA-02
    verification:
      - kind: integration
        ref: "src/build-output.test.js#index.html links a 180x180 opaque apple-touch-icon and the manifest under the base"
        status: pass
    human_judgment: false
  - id: D3
    description: "All four PNGs are full-bleed gold cross on #0a0608 from the unchanged favicon.svg, no white frame, no transparency"
    requirement: PWA-01
    verification:
      - kind: other
        ref: "IHDR check: all four colorType 3, tRNS false, exact sizes; Read-tool visual check of each PNG"
        status: pass
    human_judgment: false
  - id: D4
    description: "On Chromium the setup screen shows Install this game once the browser offers installation; click calls prompt() exactly once; hides until the browser offers again; stays hidden after appinstalled and in the installed app"
    requirement: PWA-01
    verification:
      - kind: unit
        ref: "src/pwa/install.test.js (24 cases)"
        status: pass
      - kind: e2e
        ref: "node $SCRATCHPAD/ppp-pwacheck/install.mjs row (desktop prompted 1, backAgain, stayedGone)"
        status: pass
    human_judgment: true
    rationale: "A real beforeinstallprompt from a deployed Chromium browser is only confirmed on a real device in plan 02-04; the probe uses a synthetic event"
  - id: D5
    description: "On iPhone and iPad (including iPadOS with a Mac user agent) the setup screen shows the Share, Add to Home Screen line; browsers with neither route show nothing"
    requirement: PWA-02
    verification:
      - kind: unit
        ref: "src/pwa/install.test.js#isIosDevice and installRowMode"
        status: pass
      - kind: e2e
        ref: "install.mjs row iPhone 13 context (iosShown true, no Install button)"
        status: pass
    human_judgment: true
    rationale: "Detection rests on user agent and touch points (RESEARCH A3); confirmed on a real iPhone or iPad in plan 02-04. The iOS Home Screen label (A1) also needs a real device"

duration: 12min
completed: 2026-10-02
status: complete
---

# Phase 2 Plan 02: Icons and Install Row Summary

**Four full-bleed gold-cross PNGs generated once with a pinned, scripts-disabled npx run; manifest icons and apple-touch-icon wired under the base path; an install store that holds beforeinstallprompt and prompts only from the "Install this game" button, plus an iOS Share line on the setup screen**

## Performance

- **Duration:** about 12 min for this continuation (the first executor stopped at the Task 1 gate and generated nothing; start time of this run was not captured at spawn, so this is estimated)
- **Completed:** 2026-10-02T00:55Z
- **Tasks:** 3 (one blocking-human gate, one tracer, one TDD), 3 task commits (the tracer, plus RED and GREEN for the TDD task)
- **Files modified:** 13 (7 created, 6 modified)

## Task 1: Package legitimacy gate (resolved)

The first executor stopped at this `gate="blocking-human"` checkpoint and returned it. The user's reply, verbatim:

> approved

(typed by the user in the orchestrator session on 2026-10-01). Scope of the approval: run the exact pinned command once with `--ignore-scripts`; if sharp could not load without its install script, stop and return a checkpoint; never add the generator to package.json or the lockfile.

Registry output the user saw before approving:

```
@vite-pwa/assets-generator@1.0.2 version 1.0.2
@vite-pwa/assets-generator@1.0.2 ok (no install scripts)
sharp@0.33.5 version 0.33.5
scripts in sharp@0.33.5: node install/check
sharp-ico@0.1.5 version 0.1.5
sharp-ico@0.1.5 ok (no install scripts)
repo: git+https://github.com/vite-pwa/assets-generator.git
```

Extra: 1.0.2 was published 2025-10-14 by maintainers antfu and userquin; the too-new flag referred to 2.0.0 (2026-09-12), not the pinned 1.0.2.

Acceptance: `test ! -e public/pwa-192x192.png` exited 0 at the start of this continuation, immediately before the generator ran. sharp loaded with scripts disabled, so no second checkpoint was needed.

## Accomplishments

- The generator ran once (`npx --yes --ignore-scripts @vite-pwa/assets-generator@1.0.2 --config scripts/pwa-assets.config.mjs`, exit 0) and wrote exactly the four expected PNGs; it also printed suggested head links and manifest icons, which were not used (the plan's `%BASE_URL%` links and relative `src` values are the ones committed). No `favicon.ico`; `public/favicon.svg`, `package.json` and `package-lock.json` are unchanged since plan start.
- A local production build is installable in Edge: `Page.getAppManifest` returned no errors and `Page.getInstallabilityErrors` returned none, headless on the first run, so the headed re-run in the plan was not needed.
- The setup screen shows "Install this game" only while the browser holds an offer, prompts once per offer, and shows "On iPhone or iPad: tap Share, then Add to Home Screen" on iOS; nothing in the installed app, after `appinstalled`, or on browsers with neither route.
- `npm test` fails if an icon is missing, the wrong size, outside the base, or the 180x180 is transparent. The missing-icon mutation (move `maskable-icon-512x512.png` away) failed the build test, and the file was restored.

## PNG header check (Task 2 verify)

```
pwa-192x192.png 192x192 colorType 3 tRNS false ok
pwa-512x512.png 512x512 colorType 3 tRNS false ok
maskable-icon-512x512.png 512x512 colorType 3 tRNS false ok
apple-touch-icon-180x180.png 180x180 colorType 3 tRNS false ok
icons ok
```

## Visual check (Read tool, all four PNGs)

All four are a full-bleed near-black square (#0a0608) with the gold cross centered and large; no white frame, no margin, no transparency. The 512 any and maskable renders look identical (the art already sits inside the maskable safe zone). The 192 and 180 renders show the same cross at proportionally the same size.

## Probe output (scratchpad only, never committed)

`installable`:

```json
{"mode":"installable","url":"http://localhost:4173/pilgrims-predestined-path/","headless":true,"ok":true,"manifestUrl":"http://localhost:4173/pilgrims-predestined-path/manifest.webmanifest","manifestErrors":[],"installabilityErrors":[],"icons":[{"src":"pwa-192x192.png","purpose":"any","status":200,"type":"image/png"},{"src":"pwa-512x512.png","purpose":"any","status":200,"type":"image/png"},{"src":"maskable-icon-512x512.png","purpose":"maskable","status":200,"type":"image/png"}],"errors":[]}
```

`row`:

```json
{"mode":"row","url":"http://localhost:4173/pilgrims-predestined-path/","headless":true,"ok":true,"desktop":{"prevented":true,"shown":true,"prompted":1,"backAgain":true,"stayedGone":true,"promptedAfter":1,"iosOnDesktop":false},"iphone":{"iosShown":true,"installButtons":0,"ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Mobile/15E148 Safari/604.1"},"footer":"v 9759554 · 2026-10-02","errors":[]}
```

Final `npm test`: 5 files, 62 tests, all passing. `npx vitest run src/pwa src/App.smoke.test.jsx`: 4 files, 53 tests.

## Task Commits

1. **Task 1: Package legitimacy gate** - no commit (checkpoint; resolved by the user's "approved")
2. **Task 2 (tracer): installable with its own icons** - `31f4261` (feat)
3. **Task 3: install row**
   - RED `9759554` (test)
   - GREEN `048dc7f` (feat)

**Plan metadata:** committed with this SUMMARY (docs: complete plan)

## Files Created/Modified

- `scripts/pwa-assets.config.mjs` - plain-object generator config: padding 0, #0a0608 background, no .ico; documents the one-time command
- `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/maskable-icon-512x512.png`, `public/apple-touch-icon-180x180.png` - generated icons
- `vite.config.js` - manifest `icons` array only
- `index.html` - apple-touch-icon link and `apple-mobile-web-app-title`
- `src/build-output.test.js` - `png` and `fileUnderBase` helpers, icon and apple-touch-icon tests
- `src/pwa/install.js` - `installRowMode`, `isIosDevice`, `createInstallStore`
- `src/pwa/install.test.js` - 24 unit tests with Node's EventTarget, no jsdom
- `src/pwa/store.js` - `installs` singleton next to `updates`
- `src/App.jsx` - `installMode` and the install row
- `src/App.smoke.test.jsx` - server render contains neither install text

## Decisions Made

- No `favicon.ico` (see key-decisions).
- The `row` probe uses a synthetic `beforeinstallprompt` with a counting `prompt()`, so "exactly once" is proven against the store, not against Edge's own dialog.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] No-behavior stub in the RED commit so the RED failures are assertions**
- **Found during:** Task 3 (RED)
- **Issue:** The plan's RED step leaves `src/pwa/install.js` missing, so the tests would fail on a module-load error, which `references/tdd.md` classifies as INVALID_RED. Same situation as plan 02-01 Task 2.
- **Fix:** The RED commit carries an inert `install.js` stub (`installRowMode` returns null, `isIosDevice` returns false, an inert store). Eleven tests then failed on assertions for the planned behavior (for example `expected null to be 'prompt'`, `expected "vi.fn()" to be called 1 times, but got 0 times`); the other 13 passed against the inert stub, which is expected (null-returning cases).
- **Files modified:** src/pwa/install.js
- **Verification:** `npx vitest run src/pwa/install.test.js` before GREEN: 11 failed, 13 passed, all 11 `AssertionError`; after GREEN all 24 pass
- **Committed in:** 9759554 (RED), 048dc7f (GREEN)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** None on behavior; keeps the TDD discipline. No scope creep.

## TDD Gate Compliance

- RED: `9759554` `test(02-02)`: eleven target tests fail on assertions.
- GREEN: `048dc7f` `feat(02-02)`: all 24 install tests pass; `npm test` 62 passed.
- REFACTOR: none needed.
- `workflow.tdd_mode` is false; `gsd-tools check tdd-red-evidence` only parses node:test TAP (see the 02-01 SUMMARY note), so the RED evidence is the recorded Vitest assertion output above.

## Issues Encountered

- The generator printed suggested head links and manifest entries using root-absolute paths (`/favicon.svg`, `/apple-touch-icon-180x180.png`). These were deliberately not used; the committed head link uses `%BASE_URL%` and the manifest `src` values are relative.
- Git warns that CRLF will be replaced by LF in `index.html` and `src/App.jsx` on commit; pre-existing line-ending setup, no content impact.

## Known Stubs

None. The only stub was the RED-phase placeholder, replaced in GREEN.

## Threat Flags

None. The npm supply chain (T-02-SC2), unprompted install (T-02-06), UA detection (T-02-07, accepted: read locally, nothing stored or sent) and icon URL base (T-02-08) are all in the plan's threat model. T-02-SC2 mitigations held: gate approved with registry evidence, exact pin, `--ignore-scripts`, package.json and lockfile unchanged, outputs size-, opacity- and visually checked before commit.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 02-03 can write `docs/PWA.md`; `vite.config.js` and the build test already reference it.
- Plan 02-04 (the push) is where the real-device checks happen: a real Chromium install from the button (RESEARCH A4: the button hides after a dismissal until the browser re-offers), and a real iPhone or iPad for the Share line (A3) and the Home Screen label from `apple-mobile-web-app-title` (A1; costly to change after players add the app).
- Nothing is pushed. `install.mjs <mode> <url>` accepts the live URL for plan 02-04/02-05.

## Self-Check: PASSED

Created files exist (`scripts/pwa-assets.config.mjs`, the four PNGs, `src/pwa/install.js`, `src/pwa/install.test.js`); modified files carry the planned strings; commits `31f4261`, `9759554` and `048dc7f` exist; the `test(02-02)` RED commit precedes the `feat(02-02): show Install` commit; the Task 2 and Task 3 acceptance criteria and the plan-level verification (`npm test`, both probe modes, package.json, lockfile and favicon.svg unchanged, no favicon.ico) were re-run and pass.

---
*Phase: 02-installable-with-safe-updates*
*Completed: 2026-10-02*
