---
phase: 02-installable-with-safe-updates
verified: 2026-10-02T04:10:00Z
status: gaps_found
score: 5/6 must-haves verified
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
  - docs/PWA.md
  - index.html
  - scripts/pwa-assets.config.mjs
  - src/App.jsx
  - src/build-output.test.js
  - src/main.jsx
  - src/pwa/install.js
  - src/pwa/startHandoff.js
  - src/pwa/store.js
  - src/pwa/updates.js
  - vite.config.js
covered_digest: "v1:sha256:62e7de45e750d70b0d48944b8766cb058edf7a2900443bc789bac7d1b61946b6"
behavior_unverified: 0
overrides_applied: 0
gaps:
  - truth: "The existing game keeps opening for every player after the update path was added (an update path must not blank the app); implied by the phase goal 'it opens like an app' and the project constraint that the existing game keeps working"
    status: failed
    reason: "CR-01 is real and reproduced. src/pwa/startHandoff.js reads globalThis.sessionStorage in default parameters, which are evaluated before each function's try block. With a throwing sessionStorage getter (Chrome or Firefox with all site data or cookies blocked, some sandboxed or embedded contexts), consumeStartHandoff() and saveStartHandoff() both throw SecurityError. consumeStartHandoff() runs in a mount useEffect (src/App.jsx:337) and the repo has no error boundary, so React unmounts the tree and the player gets a blank page. Before Phase 2 the game did not touch storage and worked in those browsers."
    artifacts:
      - path: "src/pwa/startHandoff.js"
        issue: "Lines 4, 12, 21: storage = globalThis.sessionStorage as default parameter, outside try"
      - path: "src/pwa/startHandoff.test.js"
        issue: "Only a throwing storage object is tested, never a throwing property getter"
    missing:
      - "defaultStorage() helper that wraps the globalThis.sessionStorage read in try/catch and returns null"
      - "Use it as the default in saveStartHandoff, clearStartHandoff and consumeStartHandoff, with a null guard inside each try"
      - "A test that installs a throwing getter via Object.defineProperty(globalThis, 'sessionStorage', ...) and asserts none of the three functions throws"
deferred: []
advisory: []
human_verification:
  - test: "Android Chrome install (02-04 pending UAT item)"
    expected: "Setup screen shows 'Install this game'; installing puts the gold cross icon on the device; the installed app opens https://avocadopanic.github.io/pilgrims-predestined-path/ in its own window; the button is gone inside the installed app"
    why_human: "Real install dialog, launcher icon and standalone window cannot be driven from the repo or Edge automation"
  - test: "Desktop Chrome or Edge install, including the button returning after a dismissed prompt (02-04 pending UAT item)"
    expected: "Install works from the setup button; after dismissing the browser dialog the 'Install this game' button does not return until the browser fires beforeinstallprompt again (promptInstall drops the held event); installed app opens in its own window with the gold cross"
    why_human: "Browser-owned install UI and its re-offer timing"
  - test: "iPhone or iPad Safari Add to Home Screen (02-04 pending UAT item)"
    expected: "Setup shows 'On iPhone or iPad: tap Share, then Add to Home Screen'; the Home Screen icon is the gold cross labelled 'Pilgrim's Path' (not a page screenshot); it opens the game; neither the instructions nor the Install button show inside the installed app (navigator.standalone)"
    why_human: "Only a real iOS device shows the actual icon rendering, label and launch behaviour"
  - test: "Setup-screen device update offer (02-05 pending UAT item)"
    expected: "On a device that held an earlier build, after full close and reopen the setup screen shows 'A new version will load when you start.'; Submit to Providence reloads once and begins the game with the chosen pilgrim count; footer then reads the new build id"
    why_human: "Real-device service worker lifecycle (waiting worker after a full close) differs from a scripted Edge profile. Needs a device that held a build older than the live one"
  - test: "In-game device never reloads (02-05 pending UAT item)"
    expected: "On a device with a game in progress on an older build, switching away and back never reloads or shows update text; after Play Again the setup screen shows the hint and Start loads the new build"
    why_human: "Mobile app switching and background throttling behaviour is not reproducible from the repo"
---

# Phase 2: Installable, With Safe Updates Verification Report

**Phase Goal:** As a player, I want to install the game on my phone or computer and get new versions between games, so that it opens like an app and an update never ends a game in progress.
**Verified:** 2026-10-02T04:10:00Z
**Status:** gaps_found
**Re-verification:** No, initial verification

## Goal Achievement

The install, update-offer and "never reload mid-game" machinery all exist, are wired, and are live. One verified defect (CR-01) can blank the whole app on mount for players whose browser blocks site storage. That is a regression of "the game opens", so it is recorded as a gap even though it is narrow and a few lines to close. Everything else verifies; five real-device checks remain for a human.

### Observable Truths (ROADMAP success criteria are the contract)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| SC1 | Android or desktop Chromium: setup screen shows Install button; installed app opens the game under the base path, never 404 or blank | VERIFIED in code and live; device install pending human | `src/App.jsx:440` renders "Install this game" when `installMode==="prompt"`; `src/pwa/install.js` holds `beforeinstallprompt`, calls `prompt()` once per event (tests install.test.js:102-165). Live manifest (fetched today) has `start_url`, `scope`, `id` all `/pilgrims-predestined-path/`, display standalone, 192/512 any and separate 512 maskable icons; all return 200 with correct content types. Edge installability was checked in 02-04 (summary). Actual install and standalone window: human item 1 and 2 |
| SC2 | iPhone Safari: Share, then Add to Home Screen instructions; own icon; hidden when running installed | VERIFIED in code; device check pending human | `src/App.jsx:441` shows the line for `installMode==="ios"`; `isIosDevice` covers iPhone, iPad and iPadOS Mac UA with touch; `installRowMode` returns null for standalone or `navigator.standalone` (install.test.js:18-35, 183-199). `index.html` links `%BASE_URL%apple-touch-icon-180x180.png` (live HTML shows `/pilgrims-predestined-path/apple-touch-icon-180x180.png`, 200 image/png); build test asserts 180x180 and no transparency; title meta "Pilgrim's Path" present. Icon rendering on iOS: human item 3 |
| SC3 | After a deploy, a returning player is offered the update on the setup screen and accepting loads the new version | VERIFIED | `vite.config.js` `registerType: 'prompt'`; `src/main.jsx` calls `updates.start(registerSW)`; `src/App.jsx:326,439` shows the hint from `useSyncExternalStore(updates...)`; `onStart` (App.jsx:338-348) saves the handoff, calls `updates.apply()`, and `consumeStartHandoff` on mount restores the pilgrim count (App.jsx:337). Unit tests updates.test.js and startHandoff.test.js pass. Live: HTML now references `index-CUOxyC5q.js`, matching the B entry in the 02-05 live check JSON, and live footer carries B's SHA per that run. D-03 wording note: the offer is on setup only (Play Again returns to setup), consistent with the CONTEXT decision that the end screen has no update UI |
| SC4 | A game in progress never reloads; play continues to the end screen where the update is offered | VERIFIED (behavioral evidence: unit tests plus recorded live run) | `src/App.jsx:328` `setSafeToReload(phase==="setup")`; `updates.js` `onNeedReload` only reloads when `safeToReload`, else sets `pendingReload`. Named tests updates.test.js:53-80 cover "never reloads a game in progress" (reload not called, pending flag set, later apply reloads once). Code review independently read `registerSW` in vite-plugin-pwa 1.3.0 and confirmed `onNeedReload` suppresses the plugin's own reload. Live sw.js has `skipWaiting` only as the plugin's `SKIP_WAITING` message handler (1 occurrence each), no `clientsClaim`. 02-05 live Edge run: mid-game tab had 0 navigations and no hint while the other tab applied B. I could not re-run a live two-deploy check without deploying; that evidence is from the summary, corroborated by the live HTML now serving B. Real-device version: human items 4 and 5 |
| SC5 | Live manifest, worker and icons load under the base; a build test fails if scope, start_url or id leaves the path or any required icon is missing | VERIFIED | All six files fetched live today: 200 (manifest `application/manifest+json`, sw.js `application/javascript`, PNGs `image/png`). `src/build-output.test.js:96-160` asserts underBase for scope, start_url, id, icons 192/512/maskable with real PNG dimensions, 180x180 apple-touch-icon opaque, sw.js real generateSW and registration under the base. `npm test` run by me now: 5 files, 62 tests pass. `public/` holds all four PNGs |
| CR | Truth added by this verification: the update/install code must not stop the game opening in any browser the game opened in before | FAILED | CR-01 reproduced (see Behavioral Spot-Checks) |

**Score:** 5/6 truths verified (0 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `vite.config.js` | VitePWA prompt mode, manifest identity, KILL_SWITCH false, `__BUILD_ID__` | VERIFIED | Read in full; `registerType: 'prompt'`, `cleanupOutdatedCaches: true`, `selfDestroying: KILL_SWITCH` (false) |
| `src/pwa/updates.js` | Gated update controller | VERIFIED | Substantive, wired via store.js, main.jsx, App.jsx |
| `src/pwa/store.js` | `updates` and `installs` singletons | VERIFIED | Module-scope, Node-safe |
| `src/pwa/startHandoff.js` | Validated one-shot handoff | VERIFIED but defective | Logic and validation correct; default-parameter storage read is the CR-01 gap |
| `src/pwa/install.js` | Install row mode, iOS detection, prompt store | VERIFIED | 20+ tests |
| `src/main.jsx` | Starts controller with `registerSW` | VERIFIED | `updates.start(registerSW)` |
| `src/App.jsx` | Hint, install row, build id footer, handoff wiring | VERIFIED | Lines 326-348, 439-442 |
| `index.html` | apple-touch-icon and iOS title | VERIFIED | |
| `public/*.png` (4) | Own-icon PNGs | VERIFIED | Present, served live |
| `scripts/pwa-assets.config.mjs`, `docs/PWA.md` | Generator config, standing rules, kill switch | VERIFIED | Present; docs checklist matches the human items |
| `.github/workflows/deploy.yml` | paths-ignore, queued deploys, live PWA smoke | VERIFIED | Read; `cancel-in-progress: false`, six-file smoke step; runs 36954506320 (82e2eac) and 36961311133 (5ad072d) both `success` per `gh run view` today |
| `src/build-output.test.js` | SC5 gate | VERIFIED | Passes |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| main.jsx | virtual:pwa-register | `updates.start(registerSW)` | WIRED | main.jsx:6-9 |
| App.jsx | store.js updates | `useSyncExternalStore(updates.subscribe,...)` | WIRED | App.jsx:326 |
| App.jsx | updates gating | `setSafeToReload(phase==="setup")` | WIRED | App.jsx:328 |
| App.jsx | startHandoff | `consumeStartHandoff()` mount effect, `saveStartHandoff` before `apply` | WIRED (not defensive, CR-01) | App.jsx:337, 342 |
| store.js | install.js | `createInstallStore(...)` module scope | WIRED | store.js |
| App.jsx | installs | `useSyncExternalStore(installs.subscribe,...)`, `onClick={installs.promptInstall}` | WIRED | App.jsx:327, 440 |
| index.html | apple-touch-icon | `%BASE_URL%` link | WIRED | live HTML confirms |
| vite.config.js | maskable icon | manifest icons entry | WIRED | live manifest confirms |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| Update hint (App.jsx:439) | `updateWaiting` | `updates.getSnapshot` driven by workbox `onNeedRefresh`/`onNeedReload` callbacks | Yes, real service worker lifecycle (recorded live) | FLOWING |
| Install row (App.jsx:440-441) | `installMode` | `beforeinstallprompt`, `appinstalled`, matchMedia, navigator | Yes | FLOWING |
| Build id footer (App.jsx:442) | `__BUILD_ID__` | `vite.config.js` define from `GITHUB_SHA` or `git rev-parse` | Yes (live footer shows the SHA per 02-05 run) | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full test suite | `npm test` | 5 files, 62 tests passed | PASS |
| Build output | `npm test` builds via child process and `dist/` exists | passes | PASS |
| Live PWA files | `curl -w '%{http_code} %{content_type}'` for six files | all 200, correct types | PASS |
| Live manifest identity | `curl manifest.webmanifest` | scope, start_url, id under base | PASS |
| Live worker has no takeover | `curl sw.js` and count tokens | `precacheAndRoute`, `cleanupOutdatedCaches`, `SKIP_WAITING` handler once each, no `clientsClaim` | PASS |
| Remote head | `git ls-remote origin main` | 5ad072d, equals B; app files unchanged between 82e2eac and HEAD (`git diff --stat` empty) | PASS |
| CR-01 repro | Node script defining a throwing `globalThis.sessionStorage` getter, then calling `consumeStartHandoff()` and `saveStartHandoff()` | Both print `THROWS SecurityError` | FAIL |

### Probe Execution

Step 7c: SKIPPED. No `probe-*.sh` files exist and no plan declares one.

### Requirements Coverage

Requirement IDs from PLAN frontmatter: 02-01 [PWA-04, PWA-01], 02-02 [PWA-01, PWA-02], 02-03 [PWA-04, PWA-01], 02-04 [PWA-01, PWA-02], 02-05 [PWA-04]. Union: PWA-01, PWA-02, PWA-04, which matches the ROADMAP Phase 2 list and the verifier prompt. All three appear in REQUIREMENTS.md (lines 23, 24, 26) and in its traceability table mapped to Phase 2. PWA-03 and PWA-05 are mapped to Phase 7, so none is orphaned for Phase 2.

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|--------------|-------------|--------|----------|
| PWA-01 | 02-01, 02-02, 02-03, 02-04 | Install from an Install button on setup (Android or desktop Chromium) | SATISFIED in code and live; real-device install pending human | App.jsx:440, install.js, live manifest and icons |
| PWA-02 | 02-02, 02-04 | iPhone "Share, then Add to Home Screen" instructions | SATISFIED in code; iOS device check pending human | App.jsx:441, install.js, apple-touch-icon live |
| PWA-04 | 02-01, 02-03, 02-05 | Update offered on setup or end screen; game never reloads during play | SATISFIED by tests plus recorded live Edge run; real-device pending human. CR-01 is a robustness defect in the handoff, not a break of this rule | updates.js, App.jsx:326-348, tests |

REQUIREMENTS.md already marks all three `[x]` / Complete. That stays accurate for the mechanisms; the CR-01 closure is a hardening fix and does not need the checkbox reverted.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| src/pwa/startHandoff.js | 4, 12, 21 | Storage read in default parameter outside try (CR-01) | Blocker | Blank page on mount for storage-blocked browsers |
| src/App.jsx | 338-348 | Untested inline update flow, magic 4000 ms, timer not cleared on unmount, silent dead button for up to 4 s, `numP` captured at click (WR-01) | Warning | Usability and testability; not a goal break |
| src/build-output.test.js | 112-139 | No `clientsClaim` assertion; opacity checked only for apple-touch-icon (WR-02) | Warning | A future takeover edit would pass CI. I confirmed the live worker currently has none |
| src/pwa/install.js | 38, 63 | Empty `catch {}` without comment (WR-03) | Warning | Debuggability only |
| src/pwa/updates.js | 62 | `apply()` may return a non-Promise from a stubbed `registerSW` (IN-01) | Info | Latent; production returns an async function |
| docs/PWA.md, updates.js | n/a | A setup-screen tab can reload when another window applies the update (IN-02); future lazy chunks could 404 in old in-game windows (IN-03); `.md` content will not deploy under paths-ignore (IN-04); peer deps undeclared (IN-05) | Info | Notes for Phases 3 to 7 |

No `TBD`, `FIXME` or `XXX` markers in files this phase touched.

### Human Verification Required

See the `human_verification` frontmatter list. Five items, all carried from the 02-04 and 02-05 summaries and confirmed as genuinely non-automatable:

1. **Android Chrome install.** Test: open the live URL, tap "Install this game", install, launch from the home screen. Expected: gold cross icon, opens the live URL in its own window, no install button inside.
2. **Desktop Chrome or Edge install, including button return after dismissal.** Test: install from the setup button; separately, dismiss the browser dialog. Expected: install opens a standalone window; after dismissal the button stays hidden until the browser offers the prompt again (by design, no storage flag).
3. **iPhone or iPad Add to Home Screen.** Test: Safari, Share, Add to Home Screen. Expected: gold cross icon labelled "Pilgrim's Path", opens the game, no install row inside.
4. **Setup-screen device update.** Test: on a device that held an older build, fully close and reopen. Expected: "A new version will load when you start.", Start reloads once into the new build with the chosen pilgrim count. Note the live site is already on B (5ad072d); the device must have loaded an older build, or a later release is needed to exercise this.
5. **In-game device never reloads.** Test: keep a game going on an older build, switch away and back, finish, press Play Again. Expected: no reload or update text during play; hint on setup afterwards.

### Weighing CR-01

Does CR-01 block the goal? I reproduced it, so it is a defect rather than a reviewer theory. Two consequences:

- Mount crash: `consumeStartHandoff()` runs in a mount effect with no error boundary, so any player whose browser throws on `sessionStorage` access gets a blank page. That population is small (all-site-data blocked, some sandboxed embeds) but it is a regression: the game worked for them before Phase 2, and the project constraint says the existing game keeps working. This is a hit on "it opens", so I treat it as a gap and set `gaps_found` rather than `human_needed`.
- Wedged Start: needs a waiting update, which needs a working service worker, which those browsers generally block. Close to unreachable, so it does not threaten "an update never ends a game in progress".

It does not weaken the main promise for ordinary players, and no PWA requirement is broken for them. The closure is small and local (three default parameters plus one test), so a gap-closure plan should be quick. After it lands, the five human items are what remain before the phase is fully accepted.

### Gaps Summary

One gap: harden `src/pwa/startHandoff.js` against a throwing `sessionStorage` getter (details in frontmatter `gaps`). Review warnings WR-01 to WR-03 are worth folding into the same closure plan (extract `startWithUpdate`, add a `clientsClaim` assertion, comment the empty catches) but they do not block the goal on their own.

---

_Verified: 2026-10-02T04:10:00Z_
_Verifier: Claude (gsd-verifier)_
