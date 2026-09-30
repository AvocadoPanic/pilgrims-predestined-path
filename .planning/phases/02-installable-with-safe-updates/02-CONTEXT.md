# Phase 2: Installable, With Safe Updates - Context

**Gathered:** 2026-09-30
**Status:** Ready for planning

<domain>
## Phase Boundary

The live game at https://avocadopanic.github.io/pilgrims-predestined-path/ becomes installable and updates itself safely: a web app manifest, install icons and a `vite-plugin-pwa` (`generateSW`, `registerType: 'prompt'`) service worker, all under `/pilgrims-predestined-path/`; an Install button on the setup screen for Android and desktop Chromium (PWA-01); "Share, then Add to Home Screen" instructions for iPhone and iPad (PWA-02); and new deploys applied only between games, never mid-game (PWA-04). Offline completeness (PWA-03) and the "Ready to play offline" notice (PWA-05) stay in Phase 7. No gameplay changes and no rewrite of existing game copy (Phase 3).

</domain>

<decisions>
## Implementation Decisions

### Update behavior
- **D-01:** A waiting update is applied when the player presses the setup screen's start button ("Submit to Providence" today). Pressing it calls `updateSW()` (the page reloads into the new build) and the game then starts with the settings the player chose (player count today; later phases add more settings). Carry the choice across the reload in memory-safe form (e.g. `sessionStorage` under a `ppp:`-prefixed key, cleared once read); planner decides the mechanism. With no update waiting, Start behaves exactly as today.
- **D-02:** While an update is waiting, the setup screen shows one small plain hint line under the start button, e.g. "A new version will load when you start." This is how PWA-04 and SC3's "offered" are met; no extra tap or Update button.
- **D-03:** The end screen gets no update UI. "Play Again" keeps going to setup (`setPhase("setup")`, `src/App.jsx:465`), where D-01/D-02 apply. Start is the single apply point.
- **D-04:** Mid-game, nothing reloads and nothing is shown; the waiting worker simply waits (SC4). The game never calls `updateSW()` outside the start button.
- **D-05:** Besides the browser's own checks on page load, the app calls `registration.update()` when the page becomes visible again (`visibilitychange`), throttled to at most about once every 30 minutes, so an installed app left open overnight notices a new deploy. No interval timer.

### Install UI on setup
- **D-06:** The Install button (Chromium, shown only after `beforeinstallprompt` fires; clicking calls `prompt()`) and the iOS instructions sit in one quiet secondary row directly under the start button. Same spot on every device.
- **D-07:** The row cannot be dismissed. It disappears only when the game runs as an installed app (`display-mode: standalone` or `navigator.standalone`) and after `appinstalled` fires. No storage key.
- **D-08:** Wording is plain now (e.g. "Install this game"; "On iPhone or iPad: tap Share, then Add to Home Screen"). The Phase 3 copy module may make it playful later, under its fatalism test.
- **D-09:** The iOS instructions show on iPhone and iPad in any browser (Safari, Chrome, Edge on iOS 16.4+), with generic wording. iPadOS that reports as a Mac is detected by touch support (e.g. `navigator.maxTouchPoints > 1`). Browsers that support neither route (e.g. desktop Firefox) show nothing.

### App name and icons
- **D-10:** Manifest `name`: "The Pilgrim's Predestined Path"; `short_name`: "Pilgrim's Path" (also the iOS home-screen title, e.g. via `apple-mobile-web-app-title`). — **Reversibility:** costly — iOS captures the label when a user adds the app to the Home Screen (inferred); changing it later needs users to re-add.
- **D-11:** Every icon uses `public/favicon.svg` unchanged: the gold ✠ `#daa520` on a full-bleed `#0a0608` square. Its farthest point is about 165px from center, inside the maskable safe circle (about 205px at 512), and the background is opaque, so the same art serves the 192/512 `any` icons, the separate 512 `maskable` icon and the opaque 180x180 apple-touch-icon.
- **D-12:** PNGs are generated once with `npx @vite-pwa/assets-generator` (not added as a dependency; research found a peer-range mismatch with the plugin) and committed to `public/`. A build test checks that each exists at the right size (SC5).
- **D-13:** Manifest includes a one-sentence plain `description` (e.g. "A board game of Reformed theology for 2 to 4 players on one screen"). No `screenshots` yet; every screen changes in Phases 3 to 6.

### Build id and kill switch
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and requirements
- `.planning/ROADMAP.md` §"Phase 2: Installable, With Safe Updates": goal, SC1-SC5, and notes (plugin config, manifest paths, icon set, SW rules, two-deploy check, real-device tests)
- `.planning/REQUIREMENTS.md`: PWA-01, PWA-02, PWA-04 (and PWA-03/PWA-05 for what is deliberately left to Phase 7)
- `.planning/PROJECT.md`: Key Decisions (PWA, release pushes behind an explicit go-ahead, commits on `main`)

### PWA research
- `.planning/research/STACK.md` §"PWA: Installable and Offline-Capable": vite-plugin-pwa 1.3 on Vite 8 (trial-built), manifest derivation from `base`, icon table, prompt vs autoUpdate, iOS notes, test layers
- `.planning/research/PITFALLS.md` Pitfalls 31-35: stale builds and mid-game reloads, scope/start_url on project Pages, shared-origin storage prefix, iOS standalone quirks, offline completeness

### Prior phase
- `.planning/phases/01-live-on-github-pages/01-CONTEXT.md`: D-04/D-05 (favicon.svg is the install-icon source art), D-06 (theme-color meta)
- `.planning/phases/01-live-on-github-pages/01-REVIEW.md`: open WR-02 (`cancel-in-progress: true` can cancel a deploy mid-run), relevant once deploys carry a service worker

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `public/favicon.svg`: source art for every PNG icon (D-11).
- `src/build-output.test.js`: already builds to a temp dir in a child process with `NODE_ENV=production` and walks the output; extend it (or add a sibling) for the manifest, `sw.js` and icon assertions (SC5).
- `index.html`: already has the `theme-color` meta and the `%BASE_URL%favicon.svg` pattern for base-prefixed head links; the apple-touch-icon link follows the same pattern.

### Established Patterns
- Everything is inline-styled JSX in one component, `src/App.jsx`; setup screen at `:389-424`, start button at `:420`, end screen at `:459-467`.
- `start()` at `src/App.jsx:325` sets up the game and `setPhase("play")`; D-01 hooks in here.
- `phase` state (`"setup" | "play" | "end"`) already tells us whether a game is in progress, which is what gates the apply.
- Build tests guard the `/pilgrims-predestined-path/` base; CI runs `npm test` before build and deploy.

### Integration Points
- `vite.config.js`: add `VitePWA({...})` next to `react()`.
- `src/main.jsx` or a new module: `registerSW` from `virtual:pwa-register` (the Vitest config may need to stub that virtual module for the smoke test).
- `index.html`: apple-touch-icon link and iOS title meta; the plugin injects the manifest link.
- `.github/workflows/deploy.yml`: provides the SHA for the build id.

</code_context>

<specifics>
## Specific Ideas

- Hint wording along the lines of "A new version will load when you start."
- Footer format "v a1b2c3d · 2026-09-30".
- Install row mock agreed in discussion:
  ```
          [ SUBMIT TO PROVIDENCE ]

     Install the game on this device
       (iPhone: tap Share → Add to Home Screen)

                v a1b2c3d · 2026-09-30
  ```

</specifics>

<deferred>
## Deferred Ideas

- macOS Safari "File → Add to Dock" instructions: beyond PWA-02.
- Manifest `screenshots` for Chrome's richer install dialog: after the layout (Phase 6) and UI passes.
- Playful install/update wording: Phase 3 copy module.

### Reviewed Todos (not folded)
- **Game-feel UI pass with Fable 5.1** (`.planning/todos/pending/2026-09-29-game-feel-ui-pass-with-fable-5-1.md`): user kept it deferred; the todo itself targets after Phase 6, once every screen exists. Phase 2 adds only the install row, hint and footer in the current style.

</deferred>

---

*Phase: 02-installable-with-safe-updates*
*Context gathered: 2026-09-30*
