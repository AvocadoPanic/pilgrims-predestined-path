# Phase 1: Live on GitHub Pages - Context

**Gathered:** 2026-09-29
**Status:** Ready for planning

<domain>
## Phase Boundary

The existing race, unchanged in rules and wording, builds with current Vite, runs locally (`npm run dev`, `npm run build` + `npm run preview`) with no console errors, and deploys through GitHub Actions on every push to `main`, gated by a test. The live page at https://avocadopanic.github.io/pilgrims-predestined-path/ loads every asset from under `/pilgrims-predestined-path/` with no 404s and no requests to fonts.googleapis.com.

Not in this phase: gameplay or copy changes (Phase 3), service worker, manifest or install icons (Phase 2), layout work (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### React version
- **D-01:** Ship on React 19 (`react` and `react-dom` ^19.3.0), not 18. Nothing is installed yet and research trial-built React 19.3 + Vite 8 cleanly; the component uses only hooks.
- **D-02:** `src/main.jsx` uses `createRoot` from `react-dom/client` and wraps `<App />` in `<StrictMode>`. Both effects in the component (`pilgrims-predestined-path.jsx:95`, `:323`) only scroll, so double-invocation in dev is safe.
- **D-03:** Update the React 18 references in `.claude/CLAUDE.md` (Technology Stack section) to match what ships.

### Tab icon and head
- **D-04:** Replace the broken `/vite.svg` link with a hand-made `favicon.svg`: the gold cross ✠ (`#daa520`) on the game's dark background (`#0a0608`), matching the setup-screen emblem (`pilgrims-predestined-path.jsx:393`, `:431`). Put it in `public/` and reference it base-relative (no leading slash) so it resolves under `/pilgrims-predestined-path/`.
- **D-05:** This SVG is the source artwork Phase 2 renders its 192, 512, maskable and 180x180 PNG install icons from, so keep it simple and legible at 16px and with padding suitable for later maskable export.
- **D-06:** Keep `<title>` exactly "The Pilgrim's Predestined Path". Add `<meta name="theme-color" content="#0a0608">`. No meta description yet (wording belongs to Phase 3).

### Claude's Discretion
User did not select these areas; the planner decides within the constraints below.
- **CI test content.** Something must run in `npm test` so a failing test stops the deploy (SC3). A small Vitest smoke test is enough (roadmap note); the characterization suite is Phase 3. Exporting pure helpers (`buildSpaces`, `buildDeck`, etc.) for testing is acceptable if behavior does not change. Consider a build-output check that enforces SC4 (built `dist/index.html` and assets reference only `/pilgrims-predestined-path/` paths and nothing on fonts.googleapis.com), since that is cheaper than a live post-deploy check. A post-deploy smoke check against the live URL is optional.
- **Go-live handoff and ordering.** Follow research order: land the building app and fixed workflow on `main`, then flip the Pages source to GitHub Actions, then re-run via `workflow_dispatch`. Two hard stops for the user: (1) before any `git push` (global rule: no push unless asked), and (2) before flipping the Pages source (`gh api -X PUT repos/AvocadoPanic/pilgrims-predestined-path/pages -f build_type=workflow` or Settings > Pages). The live URL is already broken in legacy mode, so there is no working version to protect during the switch.
- **Font self-hosting method.** `@fontsource/eb-garamond` or woff2 files in `public/fonts`, planner's choice. Weights in use today: 400, 600, 700 and italic 400 (from the Google Fonts URL at `:391`/`:429`). Load once from a global stylesheet or `main.jsx`, `font-display: swap`, Georgia fallback; remove both `<link>` elements.
- Action pinning (tags vs SHAs), exact Vitest config, `.gitattributes` contents.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and requirements
- `.planning/ROADMAP.md` § "Phase 1: Live on GitHub Pages" — goal, 4 success criteria, notes (go-ahead rule, known breakage list, no SW yet)
- `.planning/REQUIREMENTS.md` — DEPL-01, DEPL-02, DEPL-03
- `.planning/PROJECT.md` § Context, Constraints, Key Decisions — deploy-first, Pages source switch needs go-ahead

### Stack and deploy recipe
- `.planning/research/STACK.md` § "Core Framework and Build", "Testing and Content Validation", "Hosting and Deploy", "Minimal package.json Changes to Get a Clean Build" — versions (Vite ^8.3.1, @vitejs/plugin-react ^6.1.1, React ^19.3.0, Vitest ^5.0.2, Node 24 pinned), reference workflow YAML, drop `gh-pages`, lockfile, `.gitignore`, the five non-package changes
- `.planning/research/PITFALLS.md` Pitfalls 25-29 — legacy Pages absolute paths, workflow/lockfile traps (Windows lockfile vs Linux optional bindings), version mismatches, Windows quirks (`core.autocrlf=true`, case-insensitive FS, use `git mv`), Google Fonts self-hosting

### Current codebase maps
- `.planning/codebase/CONCERNS.md`, `.planning/codebase/STACK.md`, `.planning/codebase/STRUCTURE.md` — the broken entry point and config as found

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `pilgrims-predestined-path.jsx:308` already has `export default function App()`; `git mv` it to `src/App.jsx` and import `./App.jsx` (exact case; Linux CI is case-sensitive).
- Module-level pure functions (`buildSpaces` :29, `interpPath` :52, `getAngle` :72, `buildDeck` :78, `cardLabel` :86, `findNext` :88) are natural smoke-test targets if exported.

### Established Patterns
- Single monolithic component with inline styles; do not restructure in this phase (Phase 3 extracts the engine).
- Colors: dark background `#0a0608` (:390), gold `#daa520` used for the ✠ emblem.

### Integration Points
- `src/main.jsx`: imports nonexistent `./App`, uses removed `ReactDOM.render`.
- `vite.config.js`: keeps `base: '/pilgrims-predestined-path/'`, needs `plugins: [react()]`.
- `index.html`: `/vite.svg` link (missing file, absolute path); `/src/main.jsx` script is fine for Vite dev/build.
- `package.json`: react ^18, vite ^3, `gh-pages` + `deploy` script to remove; add `"type": "module"`, `engines`, `test` script.
- `.github/workflows/deploy.yml`: literal `\n` sequences, no build, `publish_dir: ./docs`; replace wholesale.
- Google Fonts `<link>` rendered inside setup screen (:391) and play screen (:429).
- Repo has no `.gitignore`, `.gitattributes`, lockfile or `public/`. Local Node is v24.15.0; `core.autocrlf=true`.

</code_context>

<specifics>
## Specific Ideas

- Favicon: the gold ✠ on `#0a0608`, the same mark the setup screen shows at 42px.

</specifics>

<deferred>
## Deferred Ideas

- Meta description / link-preview text: revisit with the Phase 3 copy rewrite.
- PNG install icons, manifest, service worker: Phase 2 (will derive from the D-04 SVG).

</deferred>

---

*Phase: 01-live-on-github-pages*
*Context gathered: 2026-09-29*
