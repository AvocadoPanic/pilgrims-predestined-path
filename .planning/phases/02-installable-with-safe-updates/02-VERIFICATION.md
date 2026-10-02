---
phase: 02-installable-with-safe-updates
verified: 2026-10-02T14:00:00Z
status: human_needed
score: 6/6 must-haves verified
covered_files:
  - .github/workflows/deploy.yml
  - .planning/REQUIREMENTS.md
  - .planning/ROADMAP.md
  - .planning/phases/02-installable-with-safe-updates/02-01-PLAN.md
  - .planning/phases/02-installable-with-safe-updates/02-01-SUMMARY.md
  - .planning/phases/02-installable-with-safe-updates/02-02-PLAN.md
  - .planning/phases/02-installable-with-safe-updates/02-02-SUMMARY.md
  - .planning/phases/02-installable-with-safe-updates/02-03-PLAN.md
  - .planning/phases/02-installable-with-safe-updates/02-03-SUMMARY.md
  - .planning/phases/02-installable-with-safe-updates/02-04-PLAN.md
  - .planning/phases/02-installable-with-safe-updates/02-04-SUMMARY.md
  - .planning/phases/02-installable-with-safe-updates/02-05-PLAN.md
  - .planning/phases/02-installable-with-safe-updates/02-05-SUMMARY.md
  - .planning/phases/02-installable-with-safe-updates/02-06-PLAN.md
  - .planning/phases/02-installable-with-safe-updates/02-06-SUMMARY.md
  - .planning/phases/02-installable-with-safe-updates/02-07-PLAN.md
  - .planning/phases/02-installable-with-safe-updates/02-07-SUMMARY.md
  - docs/PWA.md
  - index.html
  - scripts/pwa-assets.config.mjs
  - src/App.jsx
  - src/App.smoke.test.jsx
  - src/build-output.test.js
  - src/main.jsx
  - src/pwa/install.js
  - src/pwa/startHandoff.js
  - src/pwa/startHandoff.test.js
  - src/pwa/startWithUpdate.js
  - src/pwa/startWithUpdate.test.js
  - src/pwa/store.js
  - src/pwa/updates.js
  - vite.config.js
covered_digest: "v1:sha256:f0e56b4fe3629df3ae685bfdf3da5feefe4c7b28ddc1e1b2eedd4f625f83ddb8"
behavior_unverified: 0
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 5/6
  gaps_closed:
    - "CR (storage-blocked blank page, CR-01): update/install code must not stop the game opening in any browser it opened in before"
  gaps_remaining: []
  regressions: []
gaps: []
deferred: []
advisory: []
coincidental_reliance_items: []
human_verification:
  - test: "Push and deploy the gap-closure commits, then confirm the live site carries them"
    expected: "origin/main moves past 5ad072d (HEAD 372265f is 18 commits ahead, unpushed). After the deploy workflow's live PWA smoke step passes, the live JS bundle hash differs from index-CUOxyC5q.js and the setup screen still opens. Until then the live site still has the CR-01 defect even though the codebase does not"
    why_human: "Pushing to main is the user's decision; the verifier does not push. Live state cannot be asserted before the push"
  - test: "Android Chrome install (02-04 pending UAT item)"
    expected: "Setup screen shows 'Install this game'; installing puts the gold cross icon on the device; the installed app opens https://avocadopanic.github.io/pilgrims-predestined-path/ in its own window; the button is gone inside the installed app"
    why_human: "Real install dialog, launcher icon and standalone window cannot be driven from the repo or Edge automation"
  - test: "Desktop Chrome or Edge install, including the button returning after a dismissed prompt (02-04 pending UAT item)"
    expected: "Install works from the setup button; after dismissing the browser dialog the 'Install this game' button does not return until the browser fires beforeinstallprompt again; installed app opens in its own window with the gold cross"
    why_human: "Browser-owned install UI and its re-offer timing"
  - test: "iPhone or iPad Safari Add to Home Screen (02-04 pending UAT item)"
    expected: "Setup shows 'On iPhone or iPad: tap Share, then Add to Home Screen'; the Home Screen icon is the gold cross labelled 'Pilgrim's Path' (not a page screenshot); it opens the game; neither the instructions nor the Install button show inside the installed app (navigator.standalone)"
    why_human: "Only a real iOS device shows the actual icon rendering, label, launch behaviour and whether the UA detection fires. This is the check PWA-02 still depends on"
  - test: "Setup-screen device update, now including the 'Loading the new version...' state (02-05 pending UAT item, flow changed by 02-06)"
    expected: "On a device that held an older build, after full close and reopen the setup screen shows 'A new version will load when you start.'; pressing Submit to Providence shows 'Loading the new version...' with Start and the pilgrim buttons disabled, reloads once and begins the game with the chosen pilgrim count; footer then reads the new build id"
    why_human: "Real-device service worker lifecycle differs from a scripted Edge profile. Needs a device holding a build older than the one live after the push above. The 02-06 two-build Edge probe is summary evidence only; I did not re-run it"
  - test: "In-game device never reloads (02-05 pending UAT item)"
    expected: "On a device with a game in progress on an older build, switching away and back never reloads or shows update text; after Play Again the setup screen shows the hint and Start loads the new build"
    why_human: "Mobile app switching and background throttling behaviour is not reproducible from the repo"
---

# Phase 2: Installable, With Safe Updates Verification Report

**Phase Goal:** As a player, I want to install the game on my phone or computer and get new versions between games, so that it opens like an app and an update never ends a game in progress.
**Verified:** 2026-10-02T14:00:00Z
**Status:** human_needed
**Re-verification:** Yes, after gap closure (plans 02-06 and 02-07)

## Re-verification Summary

The one recorded gap (CR-01, and the added truth CR) is closed in the codebase. I re-ran the reproduction that failed last time and it now passes. Every previously verified item had a regression check and none regressed. The remaining open work is human: the live site does not yet carry the fix because nothing has been pushed, and the real-device install and iOS checks are still outstanding.

### Previously recorded gap

| Gap | Previous | Now | Evidence |
|-----|----------|-----|----------|
| CR: storage-blocked browser gets a blank page (CR-01 in `src/pwa/startHandoff.js`) | FAILED | CLOSED | `src/pwa/startHandoff.js:4-11` adds `defaultStorage()`, a try/catch around the `globalThis.sessionStorage` read that returns null. `saveStartHandoff`, `clearStartHandoff` and `consumeStartHandoff` use it as the default (lines 13, 22, 32) and guard `if (!storage)` inside their `try` (15, 24, 34). I installed a throwing `sessionStorage` getter on `globalThis` in a Node script and called all three: `consume returns null`, `save returns undefined`, `clear returns undefined`. The same script threw `SecurityError` in the first verification. Tests added: throwing-getter cases in `startHandoff.test.js` and an end-to-end case in `startWithUpdate.test.js` |

### Observable Truths (ROADMAP success criteria are the contract)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| SC1 | Android or desktop Chromium: setup screen shows Install button; installed app opens the game under the base path | VERIFIED in code; device install pending human | Regression check: `src/App.jsx:440` still renders "Install this game" for `installMode==="prompt"`; `install.js` unchanged except two comments; `install.test.js` passes. `vite.config.js` manifest keeps `id`, scope and start_url under the base; built `dist/manifest.webmanifest` checked by the build test |
| SC2 | iPhone Safari: Share, Add to Home Screen instructions; own icon; hidden when installed | VERIFIED in code; device check pending human | `App.jsx:441` shows the line for `installMode==="ios"`; `index.html` apple-touch-icon; build test asserts 180x180 opaque. Unchanged since the first verification |
| SC3 | After a deploy, a returning player is offered the update on setup and accepting loads the new version | VERIFIED | The start flow moved into `src/pwa/startWithUpdate.js` (read in full). Sequence: lock the UI (`onApplyingChange(true)`), save handoff in try/catch, arm the 4000 ms fallback timer before `updates.apply()`, apply wrapped in try/catch with a rejected-promise swallow. `App.jsx:341` calls `startFlow.start`; `App.jsx:439` shows "A new version will load when you start." or "Loading the new version..." while applying. `consumeStartHandoff` on mount (`App.jsx:337`) restores the pilgrim count. 13 fake-timer tests in `startWithUpdate.test.js` pass (reload path, fallback path, double press, save and apply failure, cancel) |
| SC4 | A game in progress never reloads; update offered at setup instead | VERIFIED | `App.jsx:328` `setSafeToReload(phase==="setup")`; `updates.js` unchanged and gating tests in `updates.test.js` pass. Fallback path calls `updates.setSafeToReload(false)` before `begin`, asserted in tests, so a late controlling event cannot reload the game that just began. Built `dist/sw.js` contains `skipWaiting` once, only inside the `SKIP_WAITING` message handler, and `clientsClaim` zero times (I grepped it). Real-device version is human items 5 and 6 |
| SC5 | Live manifest, worker and icons under the base; build test fails if scope, start_url, id leave the path or any required icon is missing | VERIFIED | `src/build-output.test.js` passes in my run (see Behavioral Spot-Checks). 02-07 added tests for worker takeover (`clientsClaim`) and for opacity of the 192, 512 and maskable icons (lines 113-121, 145). The live fetch result from the first verification (all six files 200, correct types) still holds for build B at 5ad072d; the new commits are not live (see human item 1) |
| CR | Update/install code must not stop the game opening in any browser the game opened in before | VERIFIED | The CR-01 gap above is closed. Mount effect `consumeStartHandoff()` at `App.jsx:337` can no longer throw. The wedged-Start consequence is also gone structurally because `startWithUpdate.js` wraps `save` in try/catch. The 02-06 summary also reports a real Edge probe with a throwing storage getter ending in a working setup screen and game start; I did not re-run it |

**Score:** 6/6 truths verified (0 present, behavior-unverified). The device-only parts of SC1, SC2, SC3 and SC4 are routed to human verification, not scored as unverified truths, because the code paths and gating logic are covered by passing tests.

### The review warning: does it block anything?

02-REVIEW.md reports 0 Critical and 1 Warning (WR-01): `src/build-output.test.js:141-145` forbids `clientsClaim` but would not fail if `workbox.skipWaiting: true` were added to `vite.config.js`.

Decision: it does not block any must-have or success criterion, so it is recorded here and not as a gap. Reasons:

1. Every truth is about the code as it stands. `vite.config.js` has no `skipWaiting` or `clientsClaim`, and the built `dist/sw.js` (fresh build from my `npm test`) carries `skipWaiting` only once, inside the `SKIP_WAITING` message handler. SC3 and SC4 hold today.
2. SC5 requires a build test that fails on scope, start_url, id or a missing icon. It does not require guarding worker-takeover flags. The `clientsClaim` guard is an extra from the 02-07 plan, and its absence of a sibling for `skipWaiting` is a hardening gap in a regression guard, not a missing deliverable.
3. The standing rule is written down (`docs/PWA.md:19` rule 4, which names both flags) and the regression risk is future edits to `vite.config.js`, which the first two phases after this one will touch.

Recommend folding the fix into the next phase that edits `vite.config.js` or `build-output.test.js` (assert the `"SKIP_WAITING"` handler is present and no bare `self.skipWaiting()`), or a one-line quick task. Not worth a gap-closure round on its own. The review's four Info items (no App-level wiring test, unit test coupled to disabled buttons, a blocked `reload()` leaves setup locked, duplicate icon code in the build test) are also non-blocking.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/pwa/startHandoff.js` | Validated one-shot handoff that cannot throw | VERIFIED | Defect from first verification fixed; validation logic unchanged |
| `src/pwa/startWithUpdate.js` (new) | Tested start-with-update helper | VERIFIED | 68 lines, substantive, wired at `App.jsx:331,341` and cancelled on unmount `App.jsx:332` |
| `src/pwa/startWithUpdate.test.js` (new) | Fake-timer tests | VERIFIED | Passes in the suite |
| `src/pwa/startHandoff.test.js` | Includes throwing-getter case | VERIFIED | Passes |
| `src/App.jsx` | Applying state, disabled buttons, loading line | VERIFIED | `App.jsx:428,431,439` |
| `src/build-output.test.js` | SC5 gate plus takeover and icon-opacity guards | VERIFIED | Passes; WR-01 above is a coverage note |
| `src/pwa/install.js` | Install row mode, comments on two ignored errors | VERIFIED | `install.js:38-40`, `65-67` carry reasons; behavior unchanged |
| `vite.config.js`, `src/pwa/updates.js`, `src/pwa/store.js`, `src/main.jsx`, `index.html`, `public/*.png`, `docs/PWA.md`, `scripts/pwa-assets.config.mjs`, `.github/workflows/deploy.yml` | As in first verification | VERIFIED (regression check) | Files present; `git diff 5ad072d HEAD` shows no change to `vite.config.js`, `index.html`, `public/` or `.github/` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| App.jsx | startWithUpdate | `createStartWithUpdate({updates, save: saveStartHandoff, clear: clearStartHandoff, onApplyingChange: setApplying})` | WIRED | `App.jsx:331` |
| App.jsx | startFlow | `onStart = () => startFlow.start({waiting, getNumP, begin})` | WIRED | `App.jsx:341` |
| App.jsx | startFlow.cancel | unmount cleanup effect | WIRED | `App.jsx:332` |
| startWithUpdate | updates | `updates.apply`, `isReloading`, `setSafeToReload` | WIRED | `startWithUpdate.js:25,51,32` |
| App.jsx | startHandoff | `consumeStartHandoff()` mount effect | WIRED and now safe | `App.jsx:337` |
| All first-verification links (main.jsx to registerSW, installs and updates stores, apple-touch-icon, maskable icon) | | | WIRED (regression check) | Files unchanged since |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| Update hint (App.jsx:439) | `updateWaiting`, `applying` | `updates.getSnapshot` from workbox callbacks; `applying` from the helper's `onApplyingChange` | Yes | FLOWING |
| Install row (App.jsx:440-441) | `installMode` | `beforeinstallprompt`, `appinstalled`, matchMedia, navigator | Yes | FLOWING |
| Build id footer (App.jsx:442) | `__BUILD_ID__` | `vite.config.js` define | Yes | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full test suite (run once) | `npm test` | 6 files, 79 tests passed | PASS |
| Build output (inside the suite) | `src/build-output.test.js` builds and inspects `dist/` | passes; `dist/` has sw.js, manifest, 4 PNGs | PASS |
| CR-01 repro, previously FAIL | Node script with a throwing `globalThis.sessionStorage` getter, calling `consumeStartHandoff`, `saveStartHandoff`, `clearStartHandoff` | `null`, `undefined`, `undefined`; no throw | PASS |
| Worker takeover tokens in built worker | `grep -o` on `dist/sw.js` | `skipWaiting` x1 (inside `SKIP_WAITING` handler), `clientsClaim` x0 | PASS |
| Pushed state | `git ls-remote origin main` vs `git rev-parse HEAD` | origin 5ad072d, local 372265f, `main...origin/main [ahead 18]` | NOT DEPLOYED (human item 1) |

### Probe Execution

Step 7c: SKIPPED. No `probe-*.sh` files exist and no plan declares one.

### Requirements Coverage

Requirement IDs in PLAN frontmatter: 02-01 [PWA-04, PWA-01], 02-02 [PWA-01, PWA-02], 02-03 [PWA-04, PWA-01], 02-04 [PWA-01, PWA-02], 02-05 [PWA-04], 02-06 [PWA-04, PWA-01, PWA-02], 02-07 [PWA-01, PWA-04]. Union is PWA-01, PWA-02, PWA-04, matching the ROADMAP Phase 2 list and the prompt. All three are in REQUIREMENTS.md (lines 23, 24, 26) and in its traceability table mapped to Phase 2. PWA-03 and PWA-05 map to Phase 7. No orphaned requirements.

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|--------------|-------------|--------|----------|
| PWA-01 | 02-01, 02-02, 02-03, 02-04, 02-06, 02-07 | Install from an Install button on setup (Android or desktop Chromium) | SATISFIED in code; real-device install pending human | App.jsx:440, install.js, manifest and icon build tests, 02-07 opacity guard |
| PWA-02 | 02-02, 02-04, 02-06 | iPhone "Share, then Add to Home Screen" instructions | SATISFIED in code; iPhone check pending human | App.jsx:441, install.js UA logic and unit tests, apple-touch-icon build test |
| PWA-04 | 02-01, 02-03, 02-05, 02-06, 02-07 | Update offered on setup or end screen; never reloads during play | SATISFIED by tests plus recorded Edge runs; real-device pending human | updates.js, startWithUpdate.js, App.jsx:326-348, tests |

### REQUIREMENTS.md status of PWA-02: premature

REQUIREMENTS.md currently shows `[x] PWA-02` (line 24) and `PWA-02 | Phase 2 | Complete` (line 114), while PWA-01 and PWA-04 are unchecked and read "Gaps Found". The executor ran `requirements.mark-complete PWA-02` during 02-06. I judge that **premature, and the orchestrator should revert it** (I did not edit REQUIREMENTS.md):

- The only thing proving the iPhone branch is UA-sniffing unit tests. Whether the instruction line appears on a real iPhone or iPad, and whether the Home Screen icon is the gold cross rather than a page screenshot (ROADMAP SC2 says so explicitly), can only be seen on a device. That is human item 4, still open.
- The same standard keeps PWA-01 and PWA-04 unchecked pending device checks. PWA-02 should not be held to a looser one.
- Plan 02-06 did not touch the iOS branch, so nothing in 02-06 earns PWA-02 a completion that 02-04 did not already leave pending.

Recommended REQUIREMENTS.md state until the human items pass: all three unchecked. Revert PWA-02 to `[ ]` and "Pending". Because the CR-01 and WR-01 gaps are now closed, PWA-01 and PWA-04 in the traceability table no longer need "Gaps Found"; "Pending device verification" is accurate. Flip all three to Complete together once UAT items 2 to 6 are signed off.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| src/build-output.test.js | 141-145 | Guard forbids `clientsClaim` but not `skipWaiting: true` (review WR-01) | Warning | Future-edit regression guard gap; current code is correct. Not blocking, reasoning above |
| src/App.jsx, src/pwa/startWithUpdate.js | 341, 21 | App-level wiring of the start flow untested; getter semantics rely on disabled buttons; a blocked `reload()` leaves setup locked (review IN-01 to IN-03) | Info | Robustness and coverage notes |
| src/build-output.test.js | 101-129 | Duplicated icon code (review IN-04) | Info | Cleanup |

The first verification's WR-01 (untested inline flow), WR-02 (guards) and WR-03 (empty catches) are resolved or reduced per the review's status table; I spot-checked each (helper file exists with tests, `clientsClaim` assertion at build-output.test.js:145, comments at install.js:38 and 65). No `TBD`, `FIXME` or `XXX` markers in the files this phase touched (grep).

### Human Verification Required

See the `human_verification` frontmatter list. Six items:

1. **Push and deploy the gap-closure commits.** `main` is 18 commits ahead of origin. Until pushed, the live site is build B (5ad072d) and still has the blank-page defect. After the deploy workflow passes its live PWA smoke step, load the live URL once.
2. **Android Chrome install.** Open the live URL, tap "Install this game", launch from the home screen. Expected: gold cross icon, own window at the live URL, no install button inside.
3. **Desktop Chrome or Edge install and dismissal.** Expected: standalone window; after dismissing the browser dialog the button stays hidden until the browser re-offers the prompt.
4. **iPhone or iPad Add to Home Screen.** Expected: instruction line shown, gold cross icon labelled "Pilgrim's Path", opens the game, no install row inside. Gates PWA-02.
5. **Device update with the new loading state.** Needs a device holding an older build than the one live after item 1. Expected: hint, then "Loading the new version..." with locked setup buttons, one reload, game starts with the chosen pilgrim count.
6. **In-game device never reloads.** Expected: no reload or update text mid-game; hint on setup after Play Again.

### Gaps Summary

No open gaps. Status is `human_needed` rather than `passed` because six human items remain, including the unpushed deploy. The phase goal is met in the codebase: install affordances, own icons, update offer on setup, and no mid-game reload all exist, are wired and are covered by a passing 79-test suite, and the storage-blocked blank page is fixed. Accepting the phase should wait on the device checks above.

---

_Verified: 2026-10-02T14:00:00Z_
_Verifier: Claude (gsd-verifier)_
