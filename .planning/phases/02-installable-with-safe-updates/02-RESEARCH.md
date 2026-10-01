# Phase 2: Installable, With Safe Updates - Research

**Researched:** 2026-09-30
**Domain:** Progressive Web App install and update flow on a static GitHub Pages project site (vite-plugin-pwa 1.3.0 on Vite 8, React 19)
**Confidence:** HIGH for the build, manifest, icon, kill-switch and update mechanics (all run in a scratch copy of this repo in this session); MEDIUM for iOS and real-device behavior (no device available here)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Update behavior**
- **D-01:** A waiting update is applied when the player presses the setup screen's start button ("Submit to Providence" today). Pressing it calls `updateSW()` (the page reloads into the new build) and the game then starts with the settings the player chose (player count today; later phases add more settings). Carry the choice across the reload in memory-safe form (e.g. `sessionStorage` under a `ppp:`-prefixed key, cleared once read); planner decides the mechanism. With no update waiting, Start behaves exactly as today.
- **D-02:** While an update is waiting, the setup screen shows one small plain hint line under the start button, e.g. "A new version will load when you start." This is how PWA-04 and SC3's "offered" are met; no extra tap or Update button.
- **D-03:** The end screen gets no update UI. "Play Again" keeps going to setup (`setPhase("setup")`, `src/App.jsx:465`), where D-01/D-02 apply. Start is the single apply point.
- **D-04:** Mid-game, nothing reloads and nothing is shown; the waiting worker simply waits (SC4). The game never calls `updateSW()` outside the start button.
- **D-05:** Besides the browser's own checks on page load, the app calls `registration.update()` when the page becomes visible again (`visibilitychange`), throttled to at most about once every 30 minutes, so an installed app left open overnight notices a new deploy. No interval timer.

**Install UI on setup**
- **D-06:** The Install button (Chromium, shown only after `beforeinstallprompt` fires; clicking calls `prompt()`) and the iOS instructions sit in one quiet secondary row directly under the start button. Same spot on every device.
- **D-07:** The row cannot be dismissed. It disappears only when the game runs as an installed app (`display-mode: standalone` or `navigator.standalone`) and after `appinstalled` fires. No storage key.
- **D-08:** Wording is plain now (e.g. "Install this game"; "On iPhone or iPad: tap Share, then Add to Home Screen"). The Phase 3 copy module may make it playful later, under its fatalism test.
- **D-09:** The iOS instructions show on iPhone and iPad in any browser (Safari, Chrome, Edge on iOS 16.4+), with generic wording. iPadOS that reports as a Mac is detected by touch support (e.g. `navigator.maxTouchPoints > 1`). Browsers that support neither route (e.g. desktop Firefox) show nothing.

**App name and icons**
- **D-10:** Manifest `name`: "The Pilgrim's Predestined Path"; `short_name`: "Pilgrim's Path" (also the iOS home-screen title, e.g. via `apple-mobile-web-app-title`). Reversibility: costly, iOS captures the label when a user adds the app to the Home Screen (inferred); changing it later needs users to re-add.
- **D-11:** Every icon uses `public/favicon.svg` unchanged: the gold cross `#daa520` on a full-bleed `#0a0608` square. Its farthest point is about 165px from center, inside the maskable safe circle (about 205px at 512), and the background is opaque, so the same art serves the 192/512 `any` icons, the separate 512 `maskable` icon and the opaque 180x180 apple-touch-icon.
- **D-12:** PNGs are generated once with `npx @vite-pwa/assets-generator` (not added as a dependency; research found a peer-range mismatch with the plugin) and committed to `public/`. A build test checks that each exists at the right size (SC5).
- **D-13:** Manifest includes a one-sentence plain `description` (e.g. "A board game of Reformed theology for 2 to 4 players on one screen"). No `screenshots` yet; every screen changes in Phases 3 to 6.

**Build id and kill switch**
- **D-14:** The setup screen footer shows a tiny muted build id: short git SHA plus build date, e.g. "v a1b2c3d · 2026-09-30"; local dev shows "dev". Not shown during play or on the end screen.
- **D-15:** Kill switch = the plugin's self-destroying mode (believed to be `selfDestroying: true`; research must confirm the option and its behavior in vite-plugin-pwa 1.3). Document the procedure (flip the flag, deploy, confirm the worker unregisters and caches clear, then revert) and rehearse it once locally with `npm run build` + `npm run preview`. Nothing self-destroying is deployed.
- **D-16:** The procedure and the standing PWA rules (never rename `sw.js` or change its scope; `ppp:` prefix for storage keys and custom caches; `cleanupOutdatedCaches: true`; test with build + preview, not `vite dev`; the two-deploy update check for Phases 3 to 7) live in `docs/PWA.md`. The repo has no README today; don't create one only to link this.

### Claude's Discretion
- How the start-after-reload handoff is stored and consumed (D-01), and where the `registerSW` wiring lives (e.g. a small hook or module used by `App`).
- Build-id injection mechanics (Vite `define`, `GITHUB_SHA` in CI vs `git rev-parse` locally).
- Exact hint, button and footer styling within the existing inline-style look (muted gold/brown on dark, EB Garamond). No broader visual work (see Deferred).
- `display: 'standalone'`, `orientation: 'any'`, `theme_color`/`background_color` `#0a0608` and the manifest `id` under the base, per the roadmap notes; precache whatever `generateSW` includes by default for the built app, but make no offline promise or notice until Phase 7.
- Whether a `favicon.ico` and 64px icon from the generator's `minimal-2023` preset are kept.
- Automated test shape: the SC5 build test (manifest `scope`/`start_url`/`id` under the base; 192, 512, maskable and 180 icons present), plus unit tests for install-row visibility and the start/apply logic where practical.

### Deferred Ideas (OUT OF SCOPE)
- macOS Safari "File -> Add to Dock" instructions: beyond PWA-02.
- Manifest `screenshots` for Chrome's richer install dialog: after the layout (Phase 6) and UI passes.
- Playful install/update wording: Phase 3 copy module.
- Reviewed todo not folded: Game-feel UI pass with Fable 5.1 (after Phase 6). Phase 2 adds only the install row, hint and footer in the current style.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PWA-01 | Player on Android or desktop Chromium can install the game from an Install button on the setup screen | Manifest + icons + generateSW worker verified to build under the base (see Standard Stack, Code Examples 1-2); `beforeinstallprompt` capture at module scope (Pattern 3); `prompt()` is once-per-event and user-gesture only [CITED: developer.mozilla.org BeforeInstallPromptEvent/prompt] |
| PWA-02 | Player on an iPhone sees short "Share, then Add to Home Screen" instructions on the setup screen | Pure `installRowMode()` decision (Pattern 3); apple-touch-icon takes precedence over manifest icons and third-party iOS browsers can Add to Home Screen from 16.4 [CITED: webkit.org/blog/13878]; opaque 180x180 icon generated and inspected (Icons section) |
| PWA-04 | New version is offered on setup or end screen; the game never reloads during play | Prompt-mode worker verified in Edge: waiting worker does not apply until `updateSW()`; a SECOND open tab is reloaded unasked unless `onNeedReload` is guarded (Pitfall 1, verified); update controller (Pattern 1); handoff across reload verified (Pattern 2) |
</phase_requirements>

## Summary

The whole phase is buildable with one new devDependency, `vite-plugin-pwa@^1.3.0` (peer-compatible with Vite 8, 0 vulnerabilities, no install scripts). I installed it in a scratch copy of this repo (not the real repo), built it, served it with `vite preview`, and drove Microsoft Edge with `playwright-core` through the full update path (deploy v1, load, deploy v2, detect waiting worker, apply, reload) and through the kill-switch rehearsal. Everything the CONTEXT asks research to confirm was confirmed by running it, with four corrections to CONTEXT assumptions that the planner must absorb (below).

Corrections and surprises that change the plan:
1. **D-11 / D-12 icons are NOT full-bleed with the generator's default preset.** `minimal-2023` pads the art (0.05 on `any`, 0.3 on maskable and apple) and fills padding with white. The 180x180 and maskable icons came out as a small cross on a dark square floating in a white frame. A custom plain-object config with `padding: 0` and `background: '#0a0608'` produces correct full-bleed icons (inspected visually; palette PNGs with no `tRNS` chunk, so opaque). Config and exact command are in Code Examples.
2. **Second-tab reload hazard.** In the plugin's `prompt` mode, when one tab calls `updateSW()`, every other open tab of the game also reloads at once (verified with two tabs in Edge). A game in progress in another tab or window (installed app plus browser tab) would be wiped. Fix verified: pass `onNeedReload` and reload only when the screen is `setup`.
3. **Kill switch behavior.** `selfDestroying: true` is confirmed (vite-plugin-pwa 1.3.0). The generated `sw.js` unregisters itself, calls `client.navigate(client.url)` on every controlled window (so it reloads all open windows, mid-game included), and deletes ALL Cache Storage entries for the origin, not only this app's. In the rehearsal it caused exactly one reload per window, no reload loop, and left zero registrations and zero caches.
4. **Vitest cannot import `virtual:pwa-register` as is** (fails with `The argument 'filename' must be a file URL object...`). The cleanest fix is architectural: keep the virtual import in one file that only `main.jsx` imports, so no test ever loads it. A `test.alias` stub was also verified to work if a test must import it.

**Primary recommendation:** Add `vite-plugin-pwa` (`generateSW`, `registerType: 'prompt'`), keep all `virtual:pwa-register` use in `src/main.jsx` only, put install/update logic in plain injectable modules under `src/pwa/` read by `App` through `useSyncExternalStore` (with `getServerSnapshot`, because the smoke test uses `renderToString`), guard `onNeedReload` on the `setup` phase, generate icons from a committed custom generator config at `@1.0.2`, and extend the existing `src/build-output.test.js` with the SC5 assertions (validated in the scratch copy, including a negative test).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Manifest, icons, `sw.js`, precache list | CDN / Static (GitHub Pages files emitted by `vite build`) | Browser / Client (worker runs here) | No server exists; every PWA artifact is a static file under `/pilgrims-predestined-path/` |
| Service worker registration, update detection, `registration.update()` | Browser / Client | CDN / Static (serves new `sw.js`) | The browser compares the served `sw.js` bytes; app code only wires events |
| Install prompt capture and Install button | Browser / Client | none | `beforeinstallprompt` and `appinstalled` are browser events; capture at module scope before React mounts |
| iOS instructions, standalone detection | Browser / Client | none | Pure client-side environment detection (UA, `maxTouchPoints`, `display-mode`, `navigator.standalone`) |
| Start-after-update handoff | Browser / Client (`sessionStorage`) | none | Tab-scoped, survives reload, never shared across tabs |
| Build id (SHA + date) | Build (Vite `define`) | Browser / Client (renders it) | Resolved at build time from `GITHUB_SHA` or git; static string in the bundle |
| Manifest/icon/scope correctness gate | Build/Test (Vitest on a real `vite build`) | CI (`npm test` before deploy) | Static artifacts can be asserted without a browser |
| Live-file verification after deploy | CI (curl smoke step) | Manual real-device check | SC5's "live" clause needs the deployed URL |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite-plugin-pwa | ^1.3.0 (latest, 1.3.0, modified 2026-09-30 per `npm view`) | Manifest generation, Workbox `generateSW`, `virtual:pwa-register` | Peer `vite: ^3.1.0 \|\| ... \|\| ^8.0.0` includes Vite 8; clean install and build on Vite 8.3.1 here; `npm audit` 0 vulnerabilities [VERIFIED: npm registry + scratch build] |
| workbox-build, workbox-window | 7.4.1 (peers `^7.4.1`) | Precache generation (build) and registration client (bundled) | Required peers; npm 11 auto-installed both: `npm ls` shows `workbox-build@7.4.1` and `workbox-window@7.4.1` under the plugin [VERIFIED: npm ls in scratch copy] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vite-pwa/assets-generator | 1.0.2 via `npx`, NOT a dependency | One-time PNG generation from `public/favicon.svg` | Author-time only (D-12). Pin `@1.0.2`: it satisfies the plugin's optional peer `^1.0.0`, is older than the 2026-09-12 releases the legitimacy gate flags as too new, and produced byte-identical PNGs to 1.0.4 in this session [VERIFIED: ran both, md5 match] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `registerType: 'prompt'` | `autoUpdate` | Reloads open pages and wipes an in-progress game; rejected by project decision and Pitfall 31 |
| `generateSW` | `injectManifest` | Only needed for custom fetch logic; this app has none |
| `useRegisterSW` hook from `virtual:pwa-register/react` | Module-level `registerSW` | The hook calls `registerSW` inside a `useState` initializer (verified in `dist/client/build/react.js`), which StrictMode double-invokes in dev; module-level registration runs exactly once |
| Playwright in the repo | Manual real-device and DevTools checks | A Playwright dependency is not needed for Phase 2; I used `playwright-core` + installed Edge only in the scratch directory |

**Installation:**
```bash
npm install --save-dev vite-plugin-pwa@^1.3.0
```
(`workbox-build` and `workbox-window` arrive as auto-installed peers; run `npm ls workbox-window workbox-build` after install to confirm both are present in `package-lock.json`.)

**Version verification:** `npm view vite-plugin-pwa version` returned `1.3.0` and `dist-tags = { latest: '1.3.0' }`; `npm view workbox-build version` and `workbox-window` returned `7.4.1`; `npm view @vite-pwa/assets-generator versions` shows 1.0.2 (2025-10-14), 1.0.3 and 1.0.4 (2026-09-12) and 2.0.0 (2026-09-12) [VERIFIED: npm registry, 2026-09-30].

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| vite-plugin-pwa | npm | multi-year; 1.3.0 published 2026-05-05 | 5,580,677/wk | github.com/vite-pwa/vite-plugin-pwa | OK | Approved |
| workbox-build | npm | multi-year; 7.4.1 published 2026-05-04 | 10,619,652/wk | github.com/googlechrome/workbox | OK | Approved (peer) |
| workbox-window | npm | multi-year; 7.4.1 published 2026-05-04 | 10,742,056/wk | github.com/googlechrome/workbox | OK | Approved (peer) |
| @vite-pwa/assets-generator | npm | created 2023-06; `latest` 2.0.0 published 2026-09-12 | 328,211/wk | github.com/vite-pwa/assets-generator | SUS (reason: `too-new`, a verdict on the latest publish date) | Flagged: use only via `npx ...@1.0.2` (2025-10-14 release), never added to `package.json`; planner adds a `checkpoint:human-verify` before its first run |

All four ran through `gsd-tools query package-legitimacy check --ecosystem npm` this session; `npm view <pkg> scripts.postinstall scripts.install scripts.preinstall` returned empty for all four [VERIFIED: gsd-tools + npm registry]. The repository for the plugin is the `vite-pwa` org (also the author of the generator), and it matches the official vite-pwa documentation site used throughout this research.

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** `@vite-pwa/assets-generator` (planner inserts `checkpoint:human-verify` before the one-time `npx` run; it executes only on the developer machine and writes files the developer then reviews and commits)

## Architecture Patterns

### System Architecture Diagram

```
 BUILD TIME (npm run build, in CI and locally)
 ---------------------------------------------
 vite.config.js
   |-- base '/pilgrims-predestined-path/'
   |-- define __BUILD_ID__  <- GITHUB_SHA | git rev-parse | 'dev' (serve)
   `-- VitePWA(generateSW, prompt, selfDestroying: KILL_SWITCH const)
          |
          v
 dist/  index.html (+ manifest link) | manifest.webmanifest | sw.js + workbox-*.js
        pwa-192/512, maskable-512, apple-touch-icon-180 (copied from public/)
          |
          v   (src/build-output.test.js asserts scope/start_url/id, icons, sw.js real, URLs under base)
 GitHub Pages: https://avocadopanic.github.io/pilgrims-predestined-path/

 RUN TIME (browser)
 ------------------
 page load -> src/main.jsx
     |-- imports src/pwa/store.js  -> installs listeners at module scope:
     |        beforeinstallprompt (preventDefault, stash event) | appinstalled
     |-- virtual:pwa-register -> updates.start(registerSW)   (ONLY file with the virtual import)
     |        |-- onNeedRefresh      -> waiting = true  --> subscribers
     |        |-- onNeedReload       -> reload only if screen === 'setup', else mark pendingReload
     |        `-- onRegisteredSW     -> keep registration; visibilitychange -> update() (throttle 30 min)
     `-- createRoot(<App/>)  (StrictMode)
              |
   App (useSyncExternalStore, with getServerSnapshot)
     setup screen:  [Start] -- waiting? --yes--> saveHandoff({numP}) -> updates.apply() -> reload -> new page
              |                              `--> consumeHandoff() in effect -> begin(numP)
              |-- hint line when update waiting (D-02)
              |-- install row: 'prompt' -> Install button -> event.prompt()
              |                'ios'    -> Share / Add to Home Screen text
              |                null     -> nothing (standalone, installed, or unsupported browser)
              `-- footer build id (D-14)
     play / end screens: no PWA UI, never reloads (SC4)
```

### Recommended Project Structure
```
public/
  favicon.svg                      # unchanged; source art
  favicon.ico                      # 48x48 from generator (optional keep)
  pwa-192x192.png                  # generated, committed
  pwa-512x512.png                  # generated, committed
  maskable-icon-512x512.png        # generated, committed
  apple-touch-icon-180x180.png     # generated, committed
scripts/
  pwa-assets.config.mjs            # committed plain-object config (no package import); doc of how PNGs were made
src/
  main.jsx                         # imports virtual:pwa-register, calls updates.start(registerSW)
  pwa/
    store.js                       # singletons: updates, installs (no virtual import; Node-safe)
    updates.js                     # createUpdateController({ reload, doc, now })
    install.js                     # createInstallStore + pure installRowMode()
    startHandoff.js                # save/consume sessionStorage handoff
    *.test.js                      # unit tests, injected fakes, no jsdom
  App.jsx                          # reads stores via useSyncExternalStore
docs/
  PWA.md                           # D-16 rules + kill-switch procedure
```

### Pattern 1: Update controller with injected dependencies (PWA-04, D-04, D-05)
**What:** A factory holding `waiting`, `pendingReload`, `safeToReload`, the registration, and a throttled `visibilitychange` handler. `registerSW` is passed in by `main.jsx` via `start()`, so the module never imports the virtual module and unit tests inject fakes.
**When to use:** The only place update logic lives.
**Example:** see Code Examples 3. Key rules, each verified in the scratch run:
- `onNeedReload` decides reloads. Without it the plugin reloads EVERY open tab on `controlling`.
- `apply()` calls the function returned by `registerSW`. In 1.3.0 that function ignores its `_reloadPage` argument and just posts `SKIP_WAITING`; the reload comes from the `controlling` event, which calls your `onNeedReload` [VERIFIED: `node_modules/vite-plugin-pwa/dist/client/build/register.js`].
- `registration.update()` must be `.catch(() => {})`: it rejects when offline.

### Pattern 2: Start-after-reload handoff (D-01)
**What:** Before calling `apply()`, write `{ at, settings }` to `sessionStorage` under `ppp:start-after-update`; the next page load reads and removes it once, validates it, and starts the game.
**Verified:** in a single tab, `updateSW()` reloaded into the new build and `sessionStorage` kept the value across the reload (Edge, scratch run: handoff `{"numP":3}` present after reload, build changed v1 to v2).
**Rules:**
- Consume in a `useEffect(() => {...}, [])`, not in a `useState` initializer. React StrictMode double-invokes initializers in dev and may discard one result; a read-and-clear side effect there can lose the value. An effect that reads and clears is safe: the second (simulated) run finds nothing and the state set by the first run is retained.
- Validate on read: `JSON.parse` in `try/catch`, `numP` must be one of `[2,3,4]`, `at` must be within about 2 minutes. Anything else is ignored.
- Add a fallback timer (about 4 s) after `apply()`: if the page is still alive, clear the handoff and call `begin(numP)`. A late `controlling` event after the game has started is harmless because `onNeedReload` is guarded.
- `start()` currently takes no argument and is bound as `onClick={start}` (`src/App.jsx:420`), which would pass the click event. Split into `begin(n)` (the game setup) and a no-arg `onStart` handler.

### Pattern 3: Install store with module-scope capture (PWA-01, PWA-02, D-06 to D-09)
**What:** `createInstallStore({ target, ... })` attaches `beforeinstallprompt` (call `preventDefault()`, stash the event) and `appinstalled` listeners when created. The singleton is created in `src/pwa/store.js`, which `App` imports, so listeners attach during module evaluation before React renders. Install eligibility is a pure function:
```js
// installRowMode: 'prompt' | 'ios' | null
export function installRowMode({ standalone, installed, hasPrompt, isIos }) {
  if (standalone || installed) return null;   // D-07
  if (hasPrompt) return 'prompt';             // Chromium, after beforeinstallprompt
  if (isIos) return 'ios';                    // D-09
  return null;                                // e.g. desktop Firefox, desktop Safari
}
```
**Environment helpers** (client only; guard with `typeof window !== 'undefined'`):
- `standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true` [CITED: web.dev/articles/customize-install]
- `isIos = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)` (D-09; iPadOS 13+ reports a Mac UA) [ASSUMED]
**`prompt()` handling:** call it inside the click handler, once per event, then drop the stored event; the browser fires `beforeinstallprompt` again later if the player dismissed [CITED: developer.mozilla.org BeforeInstallPromptEvent/prompt; web.dev/articles/customize-install: "If the user dismisses it, you'll need to wait until the `beforeinstallprompt` event fires again"]. After a dismissal the button therefore disappears until the browser re-fires the event (see Open Question 2).

### Pattern 4: Plain stores read with `useSyncExternalStore` plus `getServerSnapshot`
`src/App.smoke.test.jsx` uses `renderToString(<App />)`. React 19 throws `Missing getServerSnapshot, which is required for server-rendered content` when a component uses `useSyncExternalStore` with two arguments only [VERIFIED: ran `renderToString` in the scratch copy; with a third argument it rendered `<p>0</p>`]. Every store hook in `App` must pass a server snapshot (`() => false` / `() => null`). Stores must also not touch `window`, `document`, or `sessionStorage` at import or render time (the test runs in Node).

### Anti-Patterns to Avoid
- **`useRegisterSW` in a component:** StrictMode double-registration; use module-level `registerSW` through `updates.start`.
- **`autoUpdate`, `skipWaiting: true`, or `clientsClaim: true` in `workbox` options:** any of these can swap the worker or controller under an open game.
- **`onClick={start}` with a new optional parameter:** passes the click event as the argument.
- **Calling `updateSW()` from anywhere but the start button path (D-04).**
- **Editing `dist` or renaming `sw.js`** (D-16).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Service worker with precache and navigation fallback | A hand-written `sw.js` and cache list | `vite-plugin-pwa` `generateSW` | Emitted `sw.js` already contains `precacheAndRoute`, `cleanupOutdatedCaches` and a `NavigationRoute` bound to `index.html` [VERIFIED: read `dist/sw.js`] |
| Worker registration state machine (installed/waiting/controlling events) | Raw `navigator.serviceWorker` event wiring | `registerSW` from `virtual:pwa-register` (wraps `workbox-window`) | Handles `isUpdate`/`isExternal` cases and the `SKIP_WAITING` message |
| Manifest file and `<link rel="manifest">` | Hand-written `manifest.webmanifest` | The plugin's `manifest` option | Derived `scope` and `start_url` from Vite `base` were verified in the build output |
| Icon PNGs | Manually resized screenshots | `@vite-pwa/assets-generator` via `npx` with the custom config | Deterministic output (same md5 across 1.0.2 and 1.0.4) |
| Kill switch worker | A custom unregistering `sw.js` | `selfDestroying: true` | Plugin emits a worker that unregisters, reloads clients and clears caches (verified) |
| PNG dimension/opacity check in tests | An image library | Read the IHDR bytes (`readUInt32BE(16)`/`(20)`, color type at byte 25) and look for the `tRNS` chunk | Needs no dependency; validated in the scratch test run |

**Key insight:** every piece of PWA plumbing here exists as a reviewed generator. The project's own code is limited to deciding WHEN to apply an update and what UI to show.

## Common Pitfalls

### Pitfall 1: A second open tab reloads when the first one applies an update
**What goes wrong:** Tab A presses Start with an update waiting; tab B (installed app window or another browser tab, mid-game) reloads by itself and loses the game.
**Why it happens:** In prompt mode the plugin's `controlling` listener calls `window.location.reload()` in EVERY tab that is showing the prompt state.
**How to avoid:** Pass `onNeedReload` and reload only on the setup screen. Verified in Edge with two tabs: unguarded, tab B reloaded unasked (marker lost, build v1 to v2); with `window.__inGame` guard, tab B kept its state (marker `alive`, still v1) and tab A reloaded to v2.
**Warning signs:** a game vanishing while another window was used to start a new game.

### Pitfall 2: Icons come out padded and white-framed
**What goes wrong:** `npx @vite-pwa/assets-generator --preset minimal-2023 public/favicon.svg` (the command in STACK.md) pads the art. Viewing the output showed the 180x180 and 512 maskable icons as a small dark square inside a white border; the 192/512 `any` icons had a thin transparent margin.
**Why it happens:** The preset defaults: padding 0.05 (any), 0.3 (maskable and apple) and a white `resizeOptions.background`.
**How to avoid:** Use the custom config in Code Examples (`padding: 0`, `background: '#0a0608'`). Output was inspected: full-bleed dark square with the gold cross; IHDR color type 3 (palette) and no `tRNS` chunk, so opaque.
**Warning signs:** a white halo on the iOS Home Screen icon; a tiny cross on Android adaptive shapes.

### Pitfall 3: Manifest `id` resolved against the wrong base
**What goes wrong:** `id: './'` or `'.'` resolves to the site root, outside the game's path.
**Why it happens:** The spec parses `id` "with base origin as the base URL" (the origin of `start_url`), not against the manifest or `start_url` path [CITED: w3.org/TR/appmanifest/#id-member]. `start_url` and `scope` resolve against the manifest URL; `id` against the origin.
**How to avoid:** Use the absolute-path form `id: '/pilgrims-predestined-path/'`. The plugin emits it unchanged (verified). The test must resolve `id` against the ORIGIN (`new URL(m.id, ORIGIN)`) and `scope`/`start_url` against the manifest URL; the negative test with `id: './'` failed as intended.
**Warning signs:** DevTools Application > Manifest shows an Identity of `https://avocadopanic.github.io/`.

### Pitfall 4: `useSyncExternalStore` without a server snapshot breaks the existing smoke test
See Pattern 4. Also: `start()` and any store read must not touch `window` or `sessionStorage` during render.

### Pitfall 5: Kill switch side effects are larger than they look
**What goes wrong:** Flipping `selfDestroying` reloads every open window (mid-game too) and deletes ALL Cache Storage caches for `avocadopanic.github.io`, including caches of other project sites on the same origin (Pitfall 33 of the project research).
**How to avoid:** Document in `docs/PWA.md` as emergency-only, and note the shared-origin side effect. Do not use `ppp:` caches as a reason to expect isolation: the stub deletes everything. Rehearsal result: after the kill build, one navigation, `getRegistrations()` empty, `caches.keys()` empty, no loop at 12 s and 20 s.
**Also:** the plugin docs say to change nothing else in the plugin config while the stub is deployed and to keep it deployed indefinitely because "you don't know what version the users of your application have installed" [CITED: vite-pwa-org.netlify.app/guide/unregister-service-worker.html]. Reverting to a real worker later is just setting the flag back.

### Pitfall 6: Every deploy now produces an update prompt, including docs-only pushes
**What goes wrong:** `deploy.yml` runs on every push to `main`, and D-14 puts the SHA and date in the bundle, so the JS hash and `sw.js` change on every push, even for `.planning/` commits. Returning players then see the "new version" hint after commits that change nothing they can see.
**How to avoid:** Decide explicitly (Open Question 1). Cheapest fix is a `paths-ignore` filter on the push trigger for `.planning/**`, `docs/**`, `*.md`, `.claude/**`.

### Pitfall 7: Plain reload applies the update in a single-tab case
In the single-tab run, a plain `page.reload()` while a worker was waiting loaded the NEW build (the earlier project research observed the opposite). Browser behavior here is not something the app controls and it only happens on a user-initiated reload, so it does not violate SC4, but UAT must not assume "reload keeps the old version".

### Pitfall 8: Docs/commit hygiene around the SW filename
Never rename `sw.js`, change `scope`, or switch to a different registration URL after launch (D-16). Add a test assertion that `sw.js` exists and registration points to `${BASE}sw.js` with `scope: BASE` (done in Code Examples 6).

## Code Examples

### 1. `vite.config.js` (validated in a scratch build; Vite 8.3.1 + vite-plugin-pwa 1.3.0)
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Kill switch: see docs/PWA.md. Must stay false on main (the build test fails otherwise).
const KILL_SWITCH = false;

function buildId(command) {
  if (command === 'serve') return 'dev';                      // vite dev and Vitest
  let sha = (process.env.GITHUB_SHA || '').slice(0, 7);
  if (!sha) {
    try { sha = execSync('git rev-parse --short=7 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); }
    catch { sha = 'unknown'; }
  }
  return `v ${sha} \u00b7 ${new Date().toISOString().slice(0, 10)}`;   // "v a1b2c3d · 2026-09-30"
}

export default defineConfig(({ command }) => ({
  base: '/pilgrims-predestined-path/',
  define: { __BUILD_ID__: JSON.stringify(buildId(command)) },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      selfDestroying: KILL_SWITCH,
      manifest: {
        id: '/pilgrims-predestined-path/',
        name: "The Pilgrim's Predestined Path",
        short_name: "Pilgrim's Path",
        description: 'A board game of Reformed theology for 2 to 4 players on one screen',
        theme_color: '#0a0608',
        background_color: '#0a0608',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { cleanupOutdatedCaches: true },
    }),
  ],
  test: {
    include: ['src/**/*.test.{js,jsx}'],
    // Only needed if a test imports a file that imports 'virtual:pwa-register' (verified working):
    // alias: { 'virtual:pwa-register': fileURLToPath(new URL('./src/test/pwa-register-stub.js', import.meta.url)) },
  },
}));
```
Emitted `dist/manifest.webmanifest` (verbatim from the scratch build): `"start_url":"/pilgrims-predestined-path/"`, `"scope":"/pilgrims-predestined-path/"`, `"id":"/pilgrims-predestined-path/"`, `"display":"standalone"`, `"lang":"en"`, and the three icons above. `scope` and `start_url` were NOT set in config; the plugin derived them from `base` [VERIFIED: scratch build output]. Emitted `index.html` gained `<link rel="manifest" href="/pilgrims-predestined-path/manifest.webmanifest">`; no `registerSW.js` is emitted when `virtual:pwa-register` is imported (the registration URL `/pilgrims-predestined-path/sw.js` and `scope:` base are inlined in the app chunk). `sw.js` precached 8 entries (about 249 KiB): `index.html`, hashed JS and CSS, the three icon PNGs, `manifest.webmanifest` and the workbox-window chunk; the four woff2 fonts and `favicon.svg` are NOT precached by the defaults, which fits "no offline promise until Phase 7".

If `vite.config.js` keeps `defineConfig({...})` (object form) the `command` parameter is unavailable; use the function form above.

### 2. `index.html` additions (validated; Vite rewrote both hrefs under the base)
```html
<link rel="apple-touch-icon" href="%BASE_URL%apple-touch-icon-180x180.png" />
<meta name="apple-mobile-web-app-title" content="Pilgrim's Path" />
```
Place next to the existing `theme-color` meta (`index.html:7`). The `%BASE_URL%` pattern matches the existing favicon link (Phase 1 decision). `apple-mobile-web-app-title` as the source of the iOS label is [ASSUMED] (WebKit's iOS 16.4 post does not say which field supplies the label); confirm on a real iPhone.

### 3. Update controller (`src/pwa/updates.js`), plain module, Node-safe
```js
const THROTTLE_MS = 30 * 60 * 1000;

export function createUpdateController({ reload, doc, now = () => Date.now() }) {
  let waiting = false;        // a new worker is installed and waiting
  let pendingReload = false;  // another tab applied an update while we were mid-game
  let safeToReload = false;   // true only on the setup screen
  let registration = null;
  let lastCheck = now();
  let updateSW = null;
  const listeners = new Set();
  const emit = () => listeners.forEach((l) => l());

  doc?.addEventListener('visibilitychange', () => {            // D-05, no interval timer
    if (doc.visibilityState !== 'visible' || !registration) return;
    if (now() - lastCheck < THROTTLE_MS) return;
    lastCheck = now();
    registration.update().catch(() => {});                      // rejects when offline
  });

  return {
    start(registerSW) {                                         // called once from main.jsx
      updateSW = registerSW({
        onNeedReload() { if (safeToReload) reload(); else { pendingReload = true; emit(); } },
        onNeedRefresh() { waiting = true; emit(); },
        onRegisteredSW(_url, reg) { registration = reg ?? null; },
      });
    },
    subscribe(l) { listeners.add(l); return () => listeners.delete(l); },
    getSnapshot: () => waiting || pendingReload,
    getServerSnapshot: () => false,
    setSafeToReload(v) { safeToReload = v; },                   // App: phase === 'setup'
    apply() { if (pendingReload) { reload(); return Promise.resolve(); } return updateSW ? updateSW() : Promise.resolve(); },
  };
}
```
`pendingReload` covers the case where another tab already activated the new worker while this tab was mid-game: the hint shows on setup and Start reloads into the new build. `main.jsx`:
```js
import { registerSW } from 'virtual:pwa-register';
import { updates } from './pwa/store.js';
updates.start(registerSW);
```

### 4. Handoff (`src/pwa/startHandoff.js`)
```js
const KEY = 'ppp:start-after-update';
const MAX_AGE_MS = 2 * 60 * 1000;

export function saveStartHandoff(settings, storage = globalThis.sessionStorage, now = Date.now) {
  try { storage.setItem(KEY, JSON.stringify({ at: now(), settings })); } catch { /* private mode: update still applies */ }
}
export function clearStartHandoff(storage = globalThis.sessionStorage) {
  try { storage.removeItem(KEY); } catch { /* ignore */ }
}
export function consumeStartHandoff(storage = globalThis.sessionStorage, now = Date.now) {
  try {
    const raw = storage.getItem(KEY);
    storage.removeItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (!v || typeof v.at !== 'number' || now() - v.at > MAX_AGE_MS) return null;
    return v.settings ?? null;
  } catch { return null; }
}
```

### 5. App integration sketch (existing lines: `phase` state at `src/App.jsx:310`, `start` at `:325`, start button at `:420`)
```jsx
const updateWaiting = useSyncExternalStore(updates.subscribe, updates.getSnapshot, updates.getServerSnapshot);
useEffect(() => { updates.setSafeToReload(phase === "setup"); }, [phase]);
useEffect(() => {                                   // consume once per page load; safe under StrictMode
  const h = consumeStartHandoff();
  if (h && [2,3,4].includes(h.numP)) { setNumP(h.numP); begin(h.numP); }
}, []);
const begin = (n) => { /* body of today's start(), using n instead of numP */ };
const onStart = () => {
  if (!updateWaiting) { begin(numP); return; }
  saveStartHandoff({ numP });
  updates.apply();
  setTimeout(() => { clearStartHandoff(); begin(numP); }, 4000);   // fallback if no reload arrives
};
// <button onClick={onStart}> ... Submit to Providence </button>
// {updateWaiting && <p style={...}>A new version will load when you start.</p>}
```
Define `begin` before the effect that uses it (it is a `const` arrow function). Use `phase === "setup"` as the ONLY safe-to-reload state: `"end"` also holds a winner screen, and a reload there is unnecessary (D-03 sends players to setup first).

### 6. SC5 build assertions (extend `src/build-output.test.js`; ran green in the scratch copy: 8/8, and the `id: './'` mutation failed the id test)
```js
const ORIGIN = 'https://avocadopanic.github.io';
const MANIFEST_URL = `${ORIGIN}${BASE}manifest.webmanifest`;
const readManifest = () => JSON.parse(readFileSync(join(out, 'manifest.webmanifest'), 'utf8'));
const underBase = (u) => u.origin === ORIGIN && u.pathname.startsWith(BASE);
const png = (file) => {
  const b = readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), colorType: b[25], hasTrns: b.includes(Buffer.from('tRNS')) };
};
const fileUnderBase = (url) => join(out, decodeURIComponent(new URL(url).pathname.slice(BASE.length)));

describe('PWA build output', () => {
  it('manifest scope, start_url and id stay under the base path', () => {
    const m = readManifest();
    expect(underBase(new URL(m.scope, MANIFEST_URL)), 'scope').toBe(true);
    expect(underBase(new URL(m.start_url, MANIFEST_URL)), 'start_url').toBe(true);
    expect(underBase(new URL(m.id, ORIGIN)), 'id').toBe(true);   // id resolves against the ORIGIN
    expect(m.display).toBe('standalone');
  });
  it('manifest declares 192, 512 any and a separate 512 maskable icon at the right size', () => {
    const icons = readManifest().icons.map((i) => ({ ...i, url: new URL(i.src, MANIFEST_URL) }));
    for (const i of icons) expect(underBase(i.url), i.src).toBe(true);
    const pick = (size, purpose) => icons.find((i) => i.sizes === size && (i.purpose ?? 'any') === purpose);
    for (const [size, purpose] of [['192x192', 'any'], ['512x512', 'any'], ['512x512', 'maskable']]) {
      const i = pick(size, purpose);
      expect(i, `${size} ${purpose}`).toBeTruthy();
      const p = png(fileUnderBase(i.url));
      expect(`${p.w}x${p.h}`, i.src).toBe(size);
    }
  });
  it('index.html links a 180x180 opaque apple-touch-icon and the manifest under the base', () => {
    const html = readFileSync(join(out, 'index.html'), 'utf8');
    const href = html.match(/<link[^>]+rel="apple-touch-icon"[^>]+href="([^"]+)"/)?.[1];
    expect(href?.startsWith(BASE)).toBe(true);
    const p = png(join(out, href.slice(BASE.length)));
    expect([p.w, p.h]).toEqual([180, 180]);
    expect(p.hasTrns || p.colorType === 4 || p.colorType === 6).toBe(false);
    expect(html).toContain(`rel="manifest" href="${BASE}manifest.webmanifest"`);
  });
  it('sw.js is the real generateSW worker (not the self-destroying stub) and registers under the base scope', () => {
    const sw = readFileSync(join(out, 'sw.js'), 'utf8');
    expect(sw).toContain('precacheAndRoute');
    expect(sw).toContain('cleanupOutdatedCaches');
    expect(sw).not.toContain('registration.unregister');
    const js = walk(join(out, 'assets')).filter((f) => f.endsWith('.js')).map((f) => readFileSync(f, 'utf8')).join(' ');
    expect(js).toContain(`${BASE}sw.js`);
    expect(js).toContain(`scope:\`${BASE}\``);
  });
});
```
Reuse the file's existing single `beforeAll` build (it runs once; a second test file that also builds would double the roughly 10 to 15 second build). In the existing file `BASE` is declared at `src/build-output.test.js:7`: `const BASE = '/pilgrims-predestined-path/';` and `walk`/`out` are file-scoped helpers. The existing four tests still pass with the plugin enabled (verified).

### 7. Icon generation (D-12; run once, review, commit PNGs and the config)
`scripts/pwa-assets.config.mjs` (plain object, no package import, so no dependency is needed for the config to load):
```js
// One-time author tool; NOT a project dependency. Re-run only if public/favicon.svg changes:
//   npx --yes @vite-pwa/assets-generator@1.0.2 --config scripts/pwa-assets.config.mjs
// The default minimal-2023 preset pads and fills white; padding 0 keeps the full-bleed art (D-11).
const opaque = { background: '#0a0608' };
export default {
  preset: {
    transparent: { sizes: [192, 512], favicons: [[48, 'favicon.ico']], padding: 0, resizeOptions: opaque },
    maskable: { sizes: [512], padding: 0, resizeOptions: opaque },
    apple: { sizes: [180], padding: 0, resizeOptions: opaque },
  },
  images: ['public/favicon.svg'],
};
```
Verified output (run from a repo-shaped scratch dir, written next to the source in `public/`): `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png`, `apple-touch-icon-180x180.png`, `favicon.ico` (48x48). 192, 512 and the maskable 512 are the manifest set above; there is no 64x64 in this config (D-discretion: dropped). `pwa-512x512.png` and `maskable-icon-512x512.png` are byte-identical (same md5), which is expected because the art is already full-bleed and safe-zone-clean. Keep the `favicon.ico` only if you also add `<link rel="icon" href="%BASE_URL%favicon.ico" sizes="48x48" />`; otherwise drop it from the config (`favicons: []` is not needed, just delete the key).

### 8. Live smoke step to add to `.github/workflows/deploy.yml` (SC5 "live" clause)
```yaml
      - name: Smoke check live PWA files
        env:
          PAGE_URL: ${{ steps.deployment.outputs.page_url }}
        run: |
          for f in manifest.webmanifest sw.js pwa-192x192.png pwa-512x512.png maskable-icon-512x512.png apple-touch-icon-180x180.png; do
            ok=0
            for i in 1 2 3 4 5 6; do
              if curl -fsS -o /dev/null "${PAGE_URL}${f}?cb=${GITHUB_RUN_ID}"; then ok=1; break; fi
              sleep 10
            done
            [ "$ok" = 1 ] || { echo "live file missing: $f"; exit 1; }
          done
```
This assumes `page_url` ends with a slash, as the existing step's `"${PAGE_URL}?cb=${GITHUB_RUN_ID}"` already implies [ASSUMED; the existing step passed live in Phase 1]. `GITHUB_SHA` is a default Actions environment variable, so `deploy.yml` needs no change for the build id [CITED: docs.github.com default environment variables; ASSUMED not re-fetched this session].

### 9. Kill-switch rehearsal (D-15), as run
1. Build normal and serve: `npm run build && npm run preview` (serves `http://localhost:4173/pilgrims-predestined-path/`). Open in Edge or Chrome, reload once so the page is controlled. DevTools Application > Service Workers shows one worker; Cache Storage shows `workbox-precache-v2-http://localhost:4173/pilgrims-predestined-path/`.
2. Set `KILL_SWITCH = true`, run `npm run build` again while preview keeps serving `dist`.
3. In the page, `registration.update()` (or reload). Expect one navigation, Application > Service Workers empty, Cache Storage empty. In the scratch automation: `regs: []`, `caches: []`, one navigation, no further navigation after 12 s and 20 s.
4. Set `KILL_SWITCH = false`, rebuild, reload: the real worker registers again.
The generated stub (read from `dist/sw.js`) contains `self.registration.unregister()`, `client.navigate(client.url)` and `self.caches.delete(cacheName)` for every cache name. Deploying it would reload every open window, so it is emergency-only.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `apple-touch-icon` only for iOS | iOS 16.4+ also reads the manifest with `display: standalone`; `apple-touch-icon` still wins when both exist | iOS 16.4 | Keep the 180x180 link; the manifest alone is not enough for a correct icon [CITED: webkit.org/blog/13878] |
| Safari-only Add to Home Screen | Third-party iOS browsers can offer it from the Share menu | iOS 16.4 | D-09 shows the same instructions in any iOS browser [CITED: webkit.org/blog/13878] |
| Manifest `id` absent | Chrome 96+ generates an `id` from `start_url` when omitted; explicit `id` future-proofs a later `start_url` change | Chrome 96 | Set it now at no cost [CITED: developer.chrome.com/docs/capabilities/pwa-manifest-id] |
| `beforeinstallprompt` | Still non-standard, Chromium only | n/a | iOS and desktop Safari/Firefox never fire it; the iOS row is the fallback [CITED: developer.mozilla.org] |

**Deprecated/outdated:**
- `--preset minimal-2023` for this art: pads and fills white (Pitfall 2).
- `useRegisterSW` for this app: double registration risk under StrictMode.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `apple-mobile-web-app-title` supplies the iOS Home Screen label (WebKit's post does not say which of title/name/short_name is used) | Code Examples 2, D-10 | Label could be "The Pilgrim's Predestined Path" or truncated; costly to change later per D-10. Confirm on a real iPhone before launch |
| A2 | `beforeinstallprompt` can fire before React mounts, so capture at module scope | Pattern 3 | If wrong, effect-based capture would also work; low cost |
| A3 | iPadOS reporting a Mac user agent is detected by `/Macintosh/` plus `maxTouchPoints > 1` | Pattern 3 | iPad users in desktop-class mode would not see instructions; confirm on an iPad if available |
| A4 | Chrome re-fires `beforeinstallprompt` after a dismissal (web.dev says to wait for it), but when is not specified | Pattern 3, Open Question 2 | Install button may stay hidden for a long time after a dismissal |
| A5 | Browsers bypass the HTTP cache (`max-age=600` on GitHub Pages) when checking the `sw.js` script, so updates are not delayed up to 10 minutes | Pitfall 6/D-05 context | New deploys may appear up to 10 minutes late; only affects timing, not safety |
| A6 | `page_url` output ends with a slash so `${PAGE_URL}${f}` is a valid URL | Code Examples 8 | Smoke step would 404; the planner can print and check the value in the first run |
| A7 | `GITHUB_SHA` is available to the build step in Actions | Code Examples 1 | Falls back to `git rev-parse`; the actions/checkout step provides the repo so this also works |
| A8 | Real Android/iPhone/desktop install dialogs behave as documented (not testable here) | Validation Architecture | Manual UAT is mandatory; no automated substitute exists |

## Open Questions

1. **Should docs-only pushes to `main` avoid triggering an update prompt?**
   - What we know: `deploy.yml` triggers on every push; the build id (SHA and date, D-14) is inside the bundle, so every deploy changes `sw.js`.
   - What's unclear: whether the owner minds "new version" hints after `.planning/` commits.
   - Recommendation: add `paths-ignore` for `.planning/**`, `docs/**`, `*.md`, `.claude/**` on the push trigger, or accept the churn. Changing the workflow trigger is a deployment-policy change; flag it for the user rather than deciding silently. Also consider the open Phase 1 review item WR-02 (`cancel-in-progress: true` can cancel a deploy mid-run); not required for Phase 2.

2. **What should the Install row do after the player dismisses the native install dialog?**
   - What we know: the stored event is single-use, and the row appears only while an event is held (D-06/D-07), so after a dismissal the row disappears until Chrome fires the event again.
   - What's unclear: how soon Chrome re-fires on Android and desktop.
   - Recommendation: accept the disappearance for Phase 2 (plain and simple) and verify the behavior on a real device during UAT; revisit only if it feels broken.

3. **Does the committed `favicon.ico` earn its place?** Recommendation: keep it only with an explicit `<link rel="icon" ... sizes="48x48">`; otherwise omit it (it is not required by anything in SC1 to SC5).

4. **Real-device checks cannot be automated here.** The plan needs a human checkpoint after the user approves a push (PROJECT.md: release pushes wait for an explicit go-ahead). List in Validation Architecture.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | build, tests | yes | v24.15.0 | none needed (engines `>=22.12.0`) |
| npm | install | yes | 11.12.1 | none needed |
| git | build id fallback | yes | present (repo works) | `GITHUB_SHA` in CI |
| Microsoft Edge (headless automation) | optional update-flow rehearsal | yes | `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` | manual DevTools |
| Google Chrome | optional | no (`chrome.exe` not found) | none | Edge (Chromium) covers install and SW behavior |
| `npx` registry access | one-time icon generation | yes (ran during research) | n/a | none |
| Android device / iPhone / iPad | SC1, SC2 real-device checks | unknown | none | none; requires the owner |

**Missing dependencies with no fallback:** physical Android phone, iPhone and iPad for SC1/SC2 acceptance (owner-provided).
**Missing dependencies with fallback:** Chrome (Edge is Chromium and works).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 5.0.2 (`^5.0.2` in `package.json`), Node environment (no jsdom) |
| Config file | `vite.config.js` `test.include: ['src/**/*.test.{js,jsx}']` |
| Quick run command | `npx vitest run src/pwa` (unit tests, about 1 s) |
| Full suite command | `npm test` (includes the production-build test, about 10 to 15 s) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PWA-01 / SC1 | Manifest has name, icons 192, 512 any, 512 maskable, standalone, start_url and scope under base | build | `npx vitest run src/build-output.test.js` | extend existing file |
| PWA-01 / SC1 | Install row mode `prompt` only when an event is held and not standalone/installed | unit | `npx vitest run src/pwa/install.test.js` | Wave 0 |
| PWA-01 | `beforeinstallprompt` is `preventDefault`ed and stashed; `appinstalled` clears it; `prompt()` called once | unit (EventTarget fake, Node has global `EventTarget`/`Event`) | `npx vitest run src/pwa/install.test.js` | Wave 0 |
| PWA-02 / SC2 | `installRowMode` returns `ios` for iPhone/iPad/Mac-UA-with-touch, `null` for standalone and desktop Firefox | unit | `npx vitest run src/pwa/install.test.js` | Wave 0 |
| PWA-02 / SC2 | 180x180 opaque apple-touch-icon linked from `index.html` under base | build | `npx vitest run src/build-output.test.js` | extend existing file |
| PWA-02 / SC2 | Icon shows game art (not screenshot), label text, hidden when installed | manual real device | iPhone Safari: Share > Add to Home Screen | manual |
| PWA-04 / SC3 | `onNeedRefresh` sets waiting; snapshot true; subscribers notified | unit (fake `registerSW`) | `npx vitest run src/pwa/updates.test.js` | Wave 0 |
| PWA-04 / SC3 | Handoff round trip, expiry, invalid JSON, `numP` validation | unit | `npx vitest run src/pwa/startHandoff.test.js` | Wave 0 |
| PWA-04 / SC4 | `onNeedReload` does NOT call `reload` unless `setSafeToReload(true)`; `pendingReload` makes `apply()` reload | unit | `npx vitest run src/pwa/updates.test.js` | Wave 0 |
| PWA-04 | `visibilitychange` calls `update()` at most once per 30 minutes; swallows rejection | unit (fake clock and doc) | `npx vitest run src/pwa/updates.test.js` | Wave 0 |
| SC5 | `sw.js` real worker; registration URL and scope under base; kill switch not deployed | build | `npx vitest run src/build-output.test.js` | extend existing file |
| SC5 (live) | manifest, sw.js and icons return 200 on the deployed URL | CI | deploy.yml smoke step (Code Examples 8) | add to workflow |
| Existing | App still renders on the setup screen under `renderToString` | smoke | `npx vitest run src/App.smoke.test.jsx` | exists; must stay green (`getServerSnapshot`) |
| D-14 | Footer shows build id string; `dev` under Vitest | unit/smoke | assert `renderToString` html contains `dev` | extend smoke test |
| D-15 | Kill switch rehearsal | manual (build + preview + DevTools) | steps in Code Examples 9 | manual |
| PWA-04 / SC3 / SC4 | Two-deploy update check on the live site: install, deploy a change, see the hint on setup, Start loads the new build, game in progress never reloads | manual real device and desktop | `docs/PWA.md` checklist | manual |

### Sampling Rate
- **Per task commit:** `npx vitest run src/pwa src/App.smoke.test.jsx`
- **Per wave merge:** `npm test`
- **Phase gate:** `npm test` green, then local `npm run build && npm run preview` DevTools check (Application > Manifest shows no errors, Identity under the base), then the real-device checklist after the owner approves a push.

### Wave 0 Gaps
- [ ] `src/pwa/install.test.js` covers PWA-01, PWA-02
- [ ] `src/pwa/updates.test.js` covers PWA-04 (SC3, SC4, D-05)
- [ ] `src/pwa/startHandoff.test.js` covers D-01
- [ ] Extend `src/build-output.test.js` with the SC5 assertions (Code Examples 6)
- [ ] Extend `src/App.smoke.test.jsx` to assert the build id footer
- No new test framework needed. No jsdom: stores take injected targets, and Node provides `EventTarget` and `Event` globally.

## Security Domain

`security_enforcement` is enabled (absent/true) with ASVS level 1 in `.planning/config.json`.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No accounts or server |
| V3 Session Management | no | No sessions; `sessionStorage` holds only a player count |
| V4 Access Control | no | Static public site |
| V5 Input Validation | yes | Validate the `sessionStorage` handoff on read (`JSON.parse` in `try/catch`, `numP` in `[2,3,4]`, age check); treat storage as untrusted because the origin is shared with other project sites |
| V6 Cryptography | no | None; HTTPS provided by GitHub Pages |
| V14 Configuration / Supply chain | yes | Package legitimacy gate run; `package-lock.json` committed; actions already SHA-pinned; service worker served from the same origin and scope-limited to the base path |

### Known Threat Patterns for static PWA on a shared github.io origin

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Another project on `avocadopanic.github.io` reads or writes this app's storage or caches | Tampering / Information disclosure | `ppp:` prefix for every storage key and custom cache name; store only preferences and the transient handoff; scope limited to `/pilgrims-predestined-path/` |
| A broken or malicious worker persisting on users' devices | Tampering / DoS | Stable `sw.js` name, documented `selfDestroying` kill switch, and a build test that fails if the stub or an unexpected worker ships |
| Kill-switch stub clears other projects' caches on the shared origin | DoS (collateral) | Document as emergency only (Pitfall 5) |
| Supply-chain: slopsquatted or newly published package | Tampering | Legitimacy gate; `@vite-pwa/assets-generator` only via a pinned `npx @1.0.2`, never in `package.json`, human-verify checkpoint |
| Stale `index.html` served from cache after a fix | Tampering / DoS | `cleanupOutdatedCaches: true`, visible build id, update hint at Start |

## Project Constraints (from CLAUDE.md)

Extracted from `./.claude/CLAUDE.md` and the user's global `CLAUDE.md`:
- Keep React + Vite; the existing game must keep working while restructured. Static GitHub Pages hosting, no server and no secrets.
- Everything is inline-styled JSX in `src/App.jsx`; no CSS framework, no linter or formatter configured; naming and compact style as already used (camelCase, short names). New UI follows the inline-style look (muted gold/brown on dark, EB Garamond).
- Source layout is `src/` (App moved there in Phase 1); `src/main.jsx` renders `App` inside `StrictMode`.
- Tests run with `npm test` (Vitest 5, `src/**/*.test.{js,jsx}`); CI runs `npm test` before build and deploy.
- Start work through a GSD command; do not make direct repo edits outside a GSD workflow.
- Do not commit, push, or amend unless explicitly asked; release pushes need the owner's explicit go-ahead (PROJECT.md Key Decisions).
- Windows/Git Bash rules: never `sed -i`; never `find`/`grep -r`/`du` rooted at `/`, `/c` or a drive root; use the Edit/Write tools for files. (Research note: one `sed -i` was run inside the throwaway scratch copy in this session before noticing the rule; it only touched a scratch file.)
- Writing rules for documents: no em-dashes, ASCII quotes, avoid the listed AI-isms.
- Pitfall 33 convention: `ppp:` prefix for storage keys and custom caches.

## Sources

### Primary (HIGH confidence)
- Scratch copy of this repo (`...\scratchpad\trial`, outside the project): `npm ci` plus `npm i -D vite-plugin-pwa@1.3.0`; `vite build`, `vite preview`, Vitest runs, and Edge automation via `playwright-core@1.63.0` for the update path, two-tab behavior, single-tab handoff, kill switch and dev-mode load (no console errors, 0 registrations in dev).
- `node_modules/vite-plugin-pwa/dist/index.js` (self-destroying worker source, `generateRegisterSW`) and `dist/client/build/register.js`, `react.js` (registration state machine, `onNeedReload`, `useRegisterSW` initializer).
- npm registry via `npm view` and `gsd-tools query package-legitimacy check` (2026-09-30).
- `src/App.jsx`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/build-output.test.js`, `src/App.smoke.test.jsx`, `public/favicon.svg`, `.github/workflows/deploy.yml` read this session.

### Secondary (MEDIUM confidence)
- https://vite-pwa-org.netlify.app/guide/unregister-service-worker.html (selfDestroying behavior and warnings)
- https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/ (apple-touch-icon precedence, third-party iOS browsers, manifest display standalone)
- https://www.w3.org/TR/appmanifest/#id-member (id resolution against the start_url origin, fragment stripped, fallback to start_url)
- https://developer.chrome.com/docs/capabilities/pwa-manifest-id
- https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent/prompt (user gesture, once per event, non-standard)
- https://web.dev/articles/customize-install (stash event, appinstalled, display-mode and navigator.standalone, re-fire after dismissal)

### Tertiary (LOW confidence)
- iOS label source and iPadOS detection details (see Assumptions A1, A3); no iOS device available.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH, installed, built and audited in a scratch copy; legitimacy gate run.
- Architecture: HIGH for update, handoff, kill switch and test gates (executed); MEDIUM for install-event timing and iOS (documented, not device-tested).
- Pitfalls: HIGH for 1, 2, 3, 4, 5 (reproduced or read from source); MEDIUM for 6 and 7 (product behavior and browser variance).

**Research date:** 2026-09-30
**Valid until:** 2026-10-30 (vite-plugin-pwa and the assets generator shipped several releases in September 2026; re-check versions before executing if the plan sits longer)
