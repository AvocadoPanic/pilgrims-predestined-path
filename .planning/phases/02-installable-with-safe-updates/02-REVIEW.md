---
phase: 02-installable-with-safe-updates
reviewed: 2026-10-01T00:00:00Z
depth: standard
files_reviewed: 17
files_reviewed_list:
  - .github/workflows/deploy.yml
  - docs/PWA.md
  - index.html
  - package.json
  - scripts/pwa-assets.config.mjs
  - src/App.jsx
  - src/App.smoke.test.jsx
  - src/build-output.test.js
  - src/main.jsx
  - src/pwa/install.js
  - src/pwa/install.test.js
  - src/pwa/startHandoff.js
  - src/pwa/startHandoff.test.js
  - src/pwa/store.js
  - src/pwa/updates.js
  - src/pwa/updates.test.js
  - vite.config.js
findings:
  critical: 1
  warning: 3
  info: 5
  total: 9
status: issues_found
---

# Phase 2: Code Review Report

**Reviewed:** 2026-10-01
**Depth:** standard
**Files Reviewed:** 17

## Summary

The update path is well reasoned. I read `registerSW` in vite-plugin-pwa 1.3.0 (`node_modules/vite-plugin-pwa/dist/client/build/register.js`) and confirmed that `onNeedReload` is honored. With it set, the plugin does not reload by itself, so the controller's "never reload a game in progress" logic holds. A late `controlling` event after the 4 s fallback is also safe, because `setSafeToReload(false)` is called first. The one-way-door values (sw.js name, scope, manifest id) are untouched.

One real defect: the session-storage handoff is not as defensive as it claims. In browsers that block storage, it can blank the whole game. The remaining findings are robustness and test-coverage gaps.

No structural findings (fallow) were provided. No external reviewer evidence was provided.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: Reading `sessionStorage` outside the try/catch can crash the app on mount and wedge the Start button

**File:** `src/pwa/startHandoff.js:4,12,21` (callers `src/App.jsx:337,342`)
**Issue:** All three functions default their argument with `storage = globalThis.sessionStorage`. Default parameters are evaluated at call time, before the function's `try` block. In browsers where storage access itself throws (Chrome with "Block all cookies", some sandboxed or embedded contexts), the property read raises `SecurityError`. The "private mode" `try/catch` therefore never gets a chance to run.
- `consumeStartHandoff()` is called from a mount `useEffect` (`App.jsx:337`). An uncaught throw in an effect, with no error boundary, unmounts the whole tree. Affected players get a blank page, a regression of the existing game for them.
- `saveStartHandoff({numP})` is called in `onStart` (`App.jsx:342`) after `applyingRef.current=true` is set. A throw there leaves the ref stuck at true, so every later Start click returns early at `App.jsx:340`. The player is stuck until they reload, and only when an update is waiting.

The tests pass a fake storage and a "throwing" storage object. Neither reproduces a throwing property getter, so this path is untested.

**Fix:**
```js
const defaultStorage = () => {
  try { return globalThis.sessionStorage; } catch { return null; }
};

export function consumeStartHandoff(storage = defaultStorage(), now = Date.now) {
  try {
    if (!storage) return null;
    const raw = storage.getItem(KEY);
    ...
```
Do the same in `saveStartHandoff` and `clearStartHandoff`, with a null guard inside each `try`. Add a test that stubs `globalThis.sessionStorage` with a throwing getter via `Object.defineProperty`.

## Warnings

### WR-01: `onStart` update flow is untested, uses a magic timeout, and gives no feedback

**File:** `src/App.jsx:338-348`
**Issue:** This is the most intricate part of the phase (guard ref, handoff save, apply, 4 s fallback to start without the update). It lives inline in the component, and no test exercises it. The smoke test only renders to a string. Specific gaps:
- `4000` is an unexplained constant.
- The `setTimeout` is never cleared if the component unmounts.
- For up to 4 s after the click the button does nothing visible, and a second click is silently swallowed (`applyingRef`). On a slow device this reads as a dead button.
- The fallback calls `begin(numP)` with the `numP` captured at click time. The player can still change the pilgrim count during the 4 s, so the game can start with a different count than the one shown selected.

**Fix:** Move the sequence into a testable helper, for example `startWithUpdate({ updates, save, clear, begin, numP, timeoutMs, setTimeoutFn })`, and cover it with fake timers (reload path, fallback path, double click). Name the constant. Show a short "Loading the new version..." line or disable the button while `applyingRef` is set. Clear the timer in a cleanup.

### WR-02: Build test does not enforce standing rule 4 and does not check what `docs/PWA.md` says it checks

**File:** `src/build-output.test.js:112-139`, `docs/PWA.md:47`
**Issue:**
- Rule 4 says never add `skipWaiting` or `clientsClaim` takeover. The test asserts only `precacheAndRoute`, `cleanupOutdatedCaches` and the absence of `registration.unregister`. A future edit adding `clientsClaim: true` to the workbox options, which would break the "update applies only on Start" guarantee, would pass CI.
- `docs/PWA.md:47` says "check sizes and opacity (the build test does this)". The test checks opacity (no `tRNS`, no alpha color type) only for the apple-touch-icon. The 192, 512 and maskable icons are checked for dimensions only. A transparent maskable icon would pass.

**Fix:** Add `expect(sw).not.toContain('clientsClaim')` for the non-kill branch. Do not assert on `skipWaiting`: the prompt-mode worker legitimately contains a `SKIP_WAITING` message handler, so a naive check would fail. Run the existing `png()` opacity check over all three manifest icons, or correct the doc sentence.

### WR-03: Install and handoff code swallow errors with empty `catch {}` blocks

**File:** `src/pwa/install.js:38,63`, `src/pwa/startHandoff.js:14-16`
**Issue:** The empty catches in `install.js` hide a real `matchMedia` failure and any exception from `e.prompt()`, with no comment explaining why. `startHandoff.js` at least has comments. The `prompt()` swallow is deliberate (tests assert it) but undocumented in the code. Low blast radius, but it makes future debugging harder.
**Fix:** Add a one-line comment to each empty catch, as `startHandoff.js` does, saying what failure is being ignored and why it is safe.

## Info

### IN-01: `updates.apply()` can return a non-Promise

**File:** `src/pwa/updates.js:62`, `src/App.jsx:343`
**Issue:** `updateSW ? updateSW() : Promise.resolve()` assumes `registerSW` returns an async function. In a build or dev configuration where the virtual module is a stub (`() => {}`), `updateSW()` returns `undefined` and `App.jsx` calls `.catch` on it, throwing `TypeError`. Production returns an async function, and dev never has an update waiting, so this is latent.
**Fix:** `return Promise.resolve(updateSW?.())` (or make `apply` `async`).

### IN-02: A setup-screen window can reload without the player pressing Start

**File:** `src/pwa/updates.js:34-41`, `src/App.jsx:328`
**Issue:** When another tab applies the update, every tab that showed the waiting prompt gets `controlling`. If that tab sits on the setup screen (`safeToReload` true), it reloads on its own and loses the chosen pilgrim count. No game is lost, so this is consistent with the design, but it contradicts the wording of `docs/PWA.md` rule 4 ("applies only when the player presses Start"). A window in progress is never reloaded, which is the guarantee that matters.
**Fix:** Soften the doc wording to say a game in progress is never reloaded and a setup screen may refresh when another window applies the update.

### IN-03: Future lazy chunks in an old window will 404 after another window applies an update

**File:** `docs/PWA.md:48-59` (two-deploy check), `vite.config.js:45`
**Issue:** `cleanupOutdatedCaches` removes the old precache on activation, and GitHub Pages deletes old hashed files. Today the game is one bundle, so a game left running in an old window is fine. Once later phases add code-split or lazily loaded chunks, an in-progress game in an old window can request a chunk that no longer exists.
**Fix:** Add a note to `docs/PWA.md` for Phase 3 and later: no lazy chunks on the in-game path, or handle chunk-load failure by offering a reload only at the next setup or end screen.

### IN-04: Deploy workflow notes and gaps

**File:** `.github/workflows/deploy.yml:6-10,54-71`, `docs/PWA.md:31`
**Issue:**
- `paths-ignore: '**/*.md'` means any future game content stored as Markdown (for example imported with `?raw`) will not deploy on a push. The doc says to use "Run workflow", but this is an easy trap in the content phases.
- GitHub keeps only one pending run per concurrency group and cancels older pending ones, so "deploys queue" is not strictly true. The newest wins, which is fine, but the doc wording is loose.
- The PWA smoke check only asserts HTTP 200 on the six files. It does not check that `sw.js` is JavaScript or that the manifest parses.

**Fix:** Mention the `.md` content trap next to the deploy policy. Optionally add `curl ... | grep -q precacheAndRoute` for `sw.js` and `jq -e .id` for the manifest.

### IN-05: Runtime dependency on peer packages that are not declared

**File:** `package.json:19-25`
**Issue:** `vite-plugin-pwa` 1.3.0 lists `workbox-build` and `workbox-window` as peer dependencies. The built client does `import("workbox-window")`. They resolve today only because npm auto-installs peers (they are in the lockfile at about lines 6272 and 6460). A different install tool or `--legacy-peer-deps` would break the build or the registration. `npm ci` is used in CI, so it works now.
**Fix:** Optionally add `workbox-window` and `workbox-build` (`^7.4.1`) to `devDependencies` so the dependency is explicit.

---

_Reviewed: 2026-10-01_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
