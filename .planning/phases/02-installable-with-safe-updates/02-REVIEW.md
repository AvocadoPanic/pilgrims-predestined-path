---
phase: 02-installable-with-safe-updates
reviewed: 2026-10-02T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - src/App.jsx
  - src/App.smoke.test.jsx
  - src/build-output.test.js
  - src/pwa/install.js
  - src/pwa/startHandoff.js
  - src/pwa/startHandoff.test.js
  - src/pwa/startWithUpdate.js
  - src/pwa/startWithUpdate.test.js
findings:
  critical: 0
  warning: 1
  info: 4
  total: 5
status: issues_found
---

# Phase 2: Code Review Report (re-review after gap plans 02-06 and 02-07)

**Reviewed:** 2026-10-02
**Depth:** standard
**Files Reviewed:** 8 (changes since a8a0d4b, read in full for context; `src/pwa/updates.js` and `src/pwa/store.js` read for call-chain checks)

## Summary

The two gap plans fix the prior Critical and the prior Warnings that were in scope. I traced the new `createStartWithUpdate` helper against `updates.js` and `App.jsx` and found no correctness defect in the start-with-update path: the timer is armed before `apply()`, a throwing save, apply, clear or a non-promise apply result cannot skip the fallback, `setSafeToReload(false)` runs before `begin`, and unmount cancels the timer. I also ran `npx vitest run`: 6 files, 79 tests pass. I built the site and read `sw.js` to check what the build guard can and cannot catch (see WR-01).

One Warning remains: the new build guard for worker takeover only covers `clientsClaim`, not `skipWaiting`. The rest are minor.

No structural findings (fallow) were provided. No external reviewer evidence was provided.

## Prior Findings Status

| Prior finding | Status | Evidence |
|---|---|---|
| CR-01: reading `sessionStorage` outside try/catch crashes mount and wedges Start | **Resolved** | `src/pwa/startHandoff.js:4-11` adds `defaultStorage()`, which wraps the property read in try/catch and returns null. All three functions use it as the default argument (`:13`, `:22`, `:32`) and each guards `if (!storage)` inside its `try` (`:15`, `:24`, `:34`). The wedge is also gone structurally: `App.jsx:341` calls `startFlow.start`, whose `save` call is wrapped in try/catch (`startWithUpdate.js:45-49`). Tests: throwing-getter cases at `startHandoff.test.js:124-132` and the end-to-end case at `startWithUpdate.test.js:171-183`. |
| WR-01: `onStart` update flow untested, magic timeout, no feedback, timer never cleared, count can change during the wait | **Resolved** | Sequence moved to `src/pwa/startWithUpdate.js` with 12 fake-timer tests (`startWithUpdate.test.js:33-183`). Named constant `UPDATE_FALLBACK_MS` (`startWithUpdate.js:2`). Timer cleared on unmount via `cancel()` (`startWithUpdate.js:59-65`, wired at `App.jsx:332`). Feedback: "Loading the new version..." and a disabled, dimmed button (`App.jsx:431-432`). Count locked: pilgrim buttons disabled while applying (`App.jsx:428`), so the stale `numP` closure at `App.jsx:341` cannot differ from the saved count. See IN-01 for a residual wiring-coverage gap. |
| WR-02: build test misses worker takeover and opacity of manifest icons | **Partly resolved** | Opacity: new test over the 192, 512 and maskable icons (`build-output.test.js:113-121`). `clientsClaim` is now asserted absent (`build-output.test.js:145`). `skipWaiting:true` is still not caught (WR-01 below). |
| WR-03: empty catch blocks in `install.js` | **Resolved** | Both catches now carry explanatory comments (`src/pwa/install.js:38-40`, `:65-67`). The `// ignore` at `src/pwa/startHandoff.js:27` is terse but acceptable (see IN-04). |

IN-01 to IN-05 from the prior report were outside the stated focus and are not re-evaluated here. `updates.js:62` (prior IN-01) is still unchanged but is no longer reachable as a crash, because `startWithUpdate.js:53-54` tolerates a non-Promise result.

## Narrative Findings (AI reviewer)

## Warnings

### WR-01: Build guard for worker takeover does not catch `skipWaiting: true`

**File:** `src/build-output.test.js:141-145`
**Issue:** The new assertion forbids only the string `clientsClaim`. The more damaging takeover flag is `workbox: { skipWaiting: true }`, which would let a new worker activate with no Start press and defeat the "update applies only on Start" guarantee. I built the site (`NODE_ENV=production vite build`) and read `sw.js`. In prompt mode the worker contains `self.addEventListener("message", e => { e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting() })`. With `skipWaiting: true`, Workbox's generateSW template emits a bare `self.skipWaiting()` and drops that message listener. The test would still pass in that case: `precacheAndRoute` and `cleanupOutdatedCaches` are present, and `clientsClaim` and `registration.unregister` are absent. The comment at line 144 says only the claim call can be asserted, but the presence of the message handler is a positive signal that distinguishes the two modes.
**Fix:**
```js
// Prompt mode: skipWaiting exists only inside the SKIP_WAITING message handler.
expect(sw, 'prompt-mode SKIP_WAITING handler').toMatch(/"SKIP_WAITING"\s*===\s*\w+\.data\.type/);
expect(sw, 'unconditional skipWaiting is forbidden').not.toMatch(/(^|[;,{}])\s*self\.skipWaiting\(\)/);
```
Adjust the second pattern to the built output (a bare call at statement level). The first pattern alone is enough to catch the flag flip. Rerun the build once with `skipWaiting: true` to confirm the test fails, then revert.

## Info

### IN-01: App-level wiring of the start flow has no test

**File:** `src/App.smoke.test.jsx:6-17`, `src/App.jsx:330-332,341,428-432`
**Issue:** The helper is well covered, but the glue that makes WR-01's fix real is not: `onApplyingChange: setApplying`, the `disabled={applying}` attributes, the "Loading the new version..." text, the unmount `cancel()`, and `getNumP:()=>numP`. The smoke test only does a server render with no update waiting and asserts the absence of these strings. If someone drops `disabled={applying}` from the pilgrim buttons, the stale-count guard disappears and nothing fails. This is a coverage gap, not a present bug.
**Fix:** Optional. Add one jsdom or react-test-renderer test that stubs `updates` and drives Start with an update waiting, or accept the gap and keep the manual two-deploy check in `docs/PWA.md`.

### IN-02: Unit test asserts a behavior the app cannot exercise

**File:** `src/pwa/startWithUpdate.test.js:79-87`, `src/App.jsx:341`
**Issue:** The test "begins with the count current at fallback time" uses a live getter. `App.jsx:341` passes `getNumP:()=>numP`, which closes over the `numP` of the render that handled the click, so it is a constant. The behavior only matches the test because the pilgrim buttons are disabled during the wait. The two facts are coupled by convention, with no comment saying so.
**Fix:** Add a one-line comment at `App.jsx:341` ("numP cannot change while applying; the buttons are disabled"), or pass the saved count to `begin` and drop the getter.

### IN-03: A reload that starts but never completes leaves the setup screen locked

**File:** `src/pwa/startWithUpdate.js:21,41-44`, `src/pwa/updates.js:13-16`
**Issue:** When `isReloading()` is true at fallback time, the helper returns without resetting `applying` and never schedules anything else. `reloading` is set before `window.location.reload()` runs. If that call is blocked or ignored (an embedded webview, or a `beforeunload` handler cancelling it), the Start button and pilgrim buttons stay disabled until the user manually reloads. This is rare and recoverable, so it is Info only.
**Fix:** In the `isReloading()` branch, optionally re-arm one more timer that clears `applying` if the page is still alive.

### IN-04: Duplicate icon-picking and opacity code in the build test

**File:** `src/build-output.test.js:101-121,129`
**Issue:** `icons` and `pick` are defined twice (lines 102-104 and 114-116) and the same size and purpose table is repeated. The apple-touch-icon test re-inlines the opaque predicate (`p.hasTrns || p.colorType === 4 || p.colorType === 6`) at line 129 instead of using the `opaque()` helper defined at line 45. Note also that `opaque()` rejects colorType 6 (RGBA) even when every pixel is fully opaque. That is fine today because the tests pass, but an icon tool that emits opaque RGBA would fail with a misleading "not opaque" message.
**Fix:** Hoist `manifestIcons()` and `pick` to module scope, use `expect(opaque(p)).toBe(true)` at line 129, and say in a comment that RGBA is treated as non-opaque on purpose.

---

_Reviewed: 2026-10-02_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
