# Walking Skeleton - The Pilgrim's Predestined Path

**Phase:** 1
**Generated:** 2026-09-29

## Capability Proven End-to-End

A player opens https://avocadopanic.github.io/pilgrims-predestined-path/ and plays the existing race from the setup screen to "SOLI DEO GLORIA" at space 133, served from a Vite production build that GitHub Actions tested, built and deployed from `main`.

The tracer (plan 01-01, Task 2) proves the same path locally as far as it can go without a user go-ahead: source, toolchain, production build, `vite preview` serving the game under `/pilgrims-predestined-path/`. Plans 01-04 and 01-05 carry it the rest of the way to GitHub Pages after the two user stops.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | React ^19.3.0 + react-dom ^19.3.0, `createRoot` inside `StrictMode` (D-01, D-02) | Nothing was installed yet; research trial-built React 19.3 with Vite 8 cleanly; the component uses only hooks and its two effects only scroll. |
| Build tool | Vite ^8.3.1 with `@vitejs/plugin-react` ^6.1.1 | Current major; plugin-react 6 requires Vite 8; default target is Baseline Widely Available (Chrome/Edge 111+, Firefox 114+, Safari 16.4+). |
| Routing | None. One page; `App` switches between setup, play and end screens with `phase` state | The game is a single-screen state machine. Every URL the site serves lives under the Vite `base` `/pilgrims-predestined-path/`. |
| Data layer | None this phase. All game state lives in `App` `useState` | The game has no persistence yet. Phase 7 adds `localStorage` under a storage key unique to this game (GitHub Pages serves every repo of the user from one origin). |
| Auth | None | Hot-seat play on one device; no accounts (REQUIREMENTS Out of Scope). |
| Asset base path | Vite `base: '/pilgrims-predestined-path/'`; HTML references use `%BASE_URL%`; CSS `url()` values are resolved by Vite | Pages serves the project under a sub-path; Vite rewrites script, stylesheet, `public/` and CSS URLs at build time. A bare relative `favicon.svg` is not rewritten (RESEARCH Pitfall 1). |
| Fonts | EB Garamond 400, 400 italic, 600, 700 self-hosted as woff2 from `@fontsource/eb-garamond` via `src/fonts.css` | No third-party request (privacy), assets hashed under the base path, and ready for Phase 7 offline precache. |
| Static assets | `public/favicon.svg` (gold cross on `#0a0608`, 512 viewBox, drawn path, full-bleed background) | D-04/D-05: the source artwork Phase 2 renders its 192, 512, maskable and 180x180 PNG icons from. |
| Test runner | Vitest ^5.0.2, node environment, `test.include: ['src/**/*.test.{js,jsx}']` | `npm test` is the deploy gate. `renderToString` smoke test plus a child-process `vite build` output test (in-process builds ship the dev bundle, RESEARCH Pitfall 2). |
| Deployment target | GitHub Pages, source = GitHub Actions; single-job workflow: checkout, setup-node 24, `npm ci`, `npm test`, `npm run build`, configure-pages, upload-pages-artifact (`./dist`), deploy-pages, live smoke check; actions pinned to full commit SHAs | Official Pages route; a failing test stops the job before upload. Node pinned to 24 (not `lts/*`, which moves to 26 on 2026-10-28). |
| Repo hygiene | Committed `package-lock.json`; `.gitignore` (`node_modules/`, `dist/`, `.env*`, `*.log`, `*.local`); `.gitattributes` `* text=auto eol=lf` | `npm ci` needs the lockfile; `core.autocrlf=true` on the dev machine would otherwise risk CRLF YAML and lockfiles reaching Linux CI. |
| Directory layout | `index.html`, `vite.config.js`, `package.json` at root; `src/main.jsx` entry; `src/App.jsx` single component (moved from the root `pilgrims-predestined-path.jsx`); tests beside source in `src/` | Keep the monolith as-is this phase. Phase 3 extracts the engine and copy module. |

## Stack Touched in Phase 1

- [x] Project scaffold: Vite 8 build, Vitest 5 test runner (plans 01-01, 01-02). No linter: none is configured and none was requested.
- [x] Routing: N/A (single page). The one served route is the base path `/pilgrims-predestined-path/`, checked locally (01-01, 01-02) and live (01-05).
- [ ] Database: N/A this phase. No persistence exists; Phase 7 adds namespaced `localStorage`.
- [x] UI: the existing interactive flow (player count, "Submit to Providence", "Draw Card", "Next Pilgrim") played end to end by a scripted browser in dev, preview (01-02) and live (01-05).
- [x] Deployment: GitHub Pages via GitHub Actions on every push to `main` (01-03 workflow; 01-04 push; 01-05 Pages source switch and live verification).

## Out of Scope (Deferred to Later Slices)

- Service worker, web manifest, PNG install icons, update prompts: Phase 2 (derived from `public/favicon.svg`).
- Characterization tests, engine extraction, seeded RNG, copy rewrite, meta description: Phase 3.
- Question cards, verification pipeline: Phases 4 and 5.
- Layout work for phone and projector: Phase 6.
- Translations, offline completeness, `localStorage` settings: Phase 7.
- Playwright as a repo dependency: expected in Phase 2. This phase runs a throwaway `playwright-core` script from the executor's scratchpad only.
- Any change to game rules, deck behavior or player-facing wording.

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: install the game (Install button, iPhone Add to Home Screen) with updates offered between games; `vite-plugin-pwa` `registerType: 'prompt'`, manifest scope under the base path.
- Phase 3: same race pinned by characterization tests and a seeded RNG; rules and jokes rewritten so they no longer teach fatalism.
- Phase 4: a verified hard question on each of the 18 special spaces, with the citation verification pipeline.
- Phase 5: question spaces on about one draw in three, dealt from a verified pool, with an optional quiz.
- Phase 6: readable on one phone passed around a table and on a projector across a room.
- Phase 7: choose BSB, ESV, KJV or NET with proper credit; the whole game works offline.
