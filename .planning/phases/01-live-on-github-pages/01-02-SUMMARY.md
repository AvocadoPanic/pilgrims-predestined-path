---
phase: 01-live-on-github-pages
plan: 02
subsystem: infra
tags: [vite, vitest, fontsource, eb-garamond, favicon, svg, base-path, playwright-core, github-pages]

requires:
  - phase: 01-live-on-github-pages
    provides: "Vite 8 + React 19 build, src/App.jsx, Vitest smoke test, committed lockfile (plan 01-01)"
provides:
  - "EB Garamond 400, 400 italic, 600, 700 served as four hashed woff2 files under /pilgrims-predestined-path/assets/, no request to Google"
  - "Gold-cross favicon (public/favicon.svg) and theme-color #0a0608 in the page head, base-relative via %BASE_URL%"
  - "npm test build-output gate: base-path-only, local-only, existing, content-hashed assets on a real production build"
  - "Scripted Edge play-through evidence for DEPL-01 in dev and preview"
affects: [01-03 CI workflow, 01-04 go-live, 01-05 live browser play-through, 02 PWA icons (source art)]

actuals:
  tokens: 1300
  tasks: 2
  commits: 4
plan_head_before: 89dbc1a755e8dac495ef608c2069d4652f8ef56d

tech-stack:
  added: []
  patterns:
    - "Woff2-only own @font-face file with bare-specifier url() into @fontsource, rewritten by Vite under the base"
    - "%BASE_URL% for public/ files referenced from index.html"
    - "Build-output tests spawn vite build as a child process with NODE_ENV=production into an OS temp dir"
    - "Scratchpad-only playwright-core play-through script; never enters package.json or git"

key-files:
  created:
    - src/fonts.css
    - public/favicon.svg
    - src/build-output.test.js
  modified:
    - src/App.jsx
    - src/main.jsx
    - src/App.smoke.test.jsx
    - index.html

key-decisions:
  - "D-04 recorded: icon link uses %BASE_URL%favicon.svg (no literal leading slash in source; Vite writes /pilgrims-predestined-path/favicon.svg). A bare relative favicon.svg is not rewritten and fails the build-output test."
  - "Fonts come from the four woff2 files of @fontsource/eb-garamond via own fonts.css, not the package CSS, so no duplicate .woff files are emitted."

patterns-established:
  - "RED commit (test) before GREEN commit (feat) for each task, RED failure quoted in the SUMMARY"
  - "Stage by name only; pre-existing working-tree changes (.planning/config.json, .planning/state.json, .planning/intel/, .planning/milestone.lock, .gsd/, .claude/plans/, WORKLOG.md) left untouched"

requirements-completed: [DEPL-01, DEPL-03]

coverage:
  - id: D1
    description: "Rendered app contains no Google Fonts stylesheet; App.jsx differs from the moved original by exactly the two deleted link lines"
    requirement: DEPL-03
    verification:
      - kind: unit
        ref: "src/App.smoke.test.jsx#App smoke renders the setup screen without throwing"
        status: pass
      - kind: other
        ref: "git show --numstat --format= 3dd5f64 -- src/App.jsx prints 0 2 src/App.jsx"
        status: pass
    human_judgment: false
  - id: D2
    description: "EB Garamond 400, 400 italic, 600 and 700 ship as exactly four hashed woff2 files and no .woff"
    requirement: DEPL-03
    verification:
      - kind: other
        ref: "npm run build && ls dist/assets (prints 'fonts ok: 4 woff2, no woff')"
        status: pass
      - kind: unit
        ref: "src/build-output.test.js#every base-prefixed URL in index.html and built CSS names a file in the build output"
        status: pass
    human_judgment: false
  - id: D3
    description: "Build gate: every index.html src/href is under /pilgrims-predestined-path/, no Google Fonts host or root-absolute url(), base-prefixed references exist, script and stylesheet are content-hashed"
    requirement: DEPL-03
    verification:
      - kind: unit
        ref: "src/build-output.test.js (4 tests)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Gold-cross favicon on #0a0608 loads from /pilgrims-predestined-path/favicon.svg, theme-color #0a0608 present, title unchanged, no description, no manifest, no service worker"
    requirement: DEPL-03
    verification:
      - kind: unit
        ref: "src/build-output.test.js#every base-prefixed URL in index.html and built CSS names a file in the build output"
        status: pass
      - kind: other
        ref: "acceptance greps on public/favicon.svg, index.html and dist (all pass, see Self-Check)"
        status: pass
    human_judgment: false
  - id: D5
    description: "Scripted 2-, 3- and 4-player games on npm run preview and 2- and 4-player games on npm run dev reach SOLI DEO GLORIA with zero console errors, page errors, responses of 400 or above and Google Fonts requests"
    requirement: DEPL-01
    verification:
      - kind: e2e
        ref: "scratchpad ppp-playcheck/play.mjs, five runs, all exit 0 (JSON lines below)"
        status: pass
    human_judgment: false
  - id: D6
    description: "The favicon glyph is recognizable and the typeface looks like EB Garamond to a person in a real tab"
    verification: []
    human_judgment: true
    rationale: "Automated checks prove the files load with 200 and the requests stay on the origin; they do not judge how the cross or the type looks. Plan 01-05 covers the live-page look."

duration: 4min
completed: 2026-09-30
status: complete
---

# Phase 1 Plan 02: Self-hosted Font, Favicon and Build-Output Gate Summary

**EB Garamond now loads as four hashed woff2 files from the game's own origin, the tab shows the gold-cross favicon under the base path, and `npm test` fails any build that leaves `/pilgrims-predestined-path/` or touches Google Fonts; five scripted Edge games finish with zero errors in dev and preview.**

## Performance

- **Duration:** about 4 min
- **Started:** 2026-09-30T06:39:49Z
- **Completed:** 2026-09-30T06:43:38Z (work finished; SUMMARY written after)
- **Tasks:** 2 (both TDD: RED commit, then GREEN commit)
- **Files modified:** 7 (3 new, 4 edited)

## Accomplishments

- Removed the two Google Fonts stylesheet link elements from `src/App.jsx` (lines 391 and 429); `git show --numstat` prints `0	2	src/App.jsx`, so nothing else in the component changed.
- Added `src/fonts.css` with four woff2-only `@font-face` rules (`font-display: swap`) and imported it from `src/main.jsx` before the App import. The build emits exactly `eb-garamond-latin-400-normal`, `-400-italic`, `-600-normal`, `-700-normal` (23.8 to 25.4 kB each), no `.woff`.
- Added `public/favicon.svg` (gold cross path `#daa520` on full-bleed `#0a0608`, 512 viewBox, no text, script or foreignObject) and pointed the icon link at `%BASE_URL%favicon.svg`; built HTML carries `href="/pilgrims-predestined-path/favicon.svg"`. Added `theme-color #0a0608`; title unchanged; no description, manifest, apple-touch-icon or service worker.
- Added `src/build-output.test.js`: a child-process production build (NODE_ENV=production) checked for base-prefixed URLs, no Google Fonts host, no root-absolute `url()`, existing files for every base-prefixed reference, and content-hashed `index-HASH.js` / `index-HASH.css`.
- Proved DEPL-01 with scripted Edge games: preview 2, 3, 4 players; dev 2, 4 players.

## TDD Evidence

### Task 1 RED (commit `963bdd3`)

`npx vitest run src/App.smoke.test.jsx`, exit 1, target test failed on the new assertion:

```
FAIL  src/App.smoke.test.jsx > App smoke > renders the setup screen without throwing
AssertionError: expected '<div style="min-height:100vh;backgrou…' not to contain 'fonts.googleapis.com'
 ❯ src/App.smoke.test.jsx:9:22
      9|     expect(html).not.toContain('fonts.googleapis.com');
```

The received HTML contained `<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:...` from the setup screen.

### Task 1 GREEN (commit `3dd5f64`)

Smoke test passes (`Tests 1 passed`); `npm run build` prints `fonts ok: 4 woff2, no woff`.

### Task 2 RED (commit `0496007`)

`npx vitest run src/build-output.test.js`, exit 1, 1 failed and 3 passed, target test failed on the icon link:

```
FAIL  src/build-output.test.js > production build output > index.html references only base-prefixed local URLs
AssertionError: /vite.svg: expected false to be true // Object.is equality
 ❯ src/build-output.test.js:41:57
     41|     for (const u of urls) expect(u.startsWith(BASE), u).toBe(true);
```

Vite left the root path `/vite.svg` unrewritten (built HTML: `<link rel="icon" ... href="/vite.svg" />`), which is the B1 case named in the plan's flagged assumption. The other three tests were already green at RED; B3 guards the favicon from the GREEN step on.

### Task 2 GREEN (commit `eb67e64`)

`npx vitest run src/build-output.test.js`: 4 passed. `npm test`: 2 files, 5 tests passed.

## Scripted play-through (DEPL-01)

Tool: `playwright-core@1.63.0` with `channel: 'msedge'`, headless, installed only under the session scratchpad (`ppp-playcheck/`), never in the repo. Preview ran on `http://localhost:4173/pilgrims-predestined-path/` after `npm run build`; dev ran on `http://localhost:5173/pilgrims-predestined-path/`. Both servers were stopped afterwards (no listener remains on 4173 or 5173). Warnings arrays are empty in every run.

Preview:

```
{"players":2,"clicks":103,"won":true,"errors":[],"warnings":[],"bad":[],"thirdParty":[]}
{"players":3,"clicks":73,"won":true,"errors":[],"warnings":[],"bad":[],"thirdParty":[]}
{"players":4,"clicks":125,"won":true,"errors":[],"warnings":[],"bad":[],"thirdParty":[]}
```

Dev:

```
{"players":2,"clicks":81,"won":true,"errors":[],"warnings":[],"bad":[],"thirdParty":[]}
{"players":4,"clicks":45,"won":true,"errors":[],"warnings":[],"bad":[],"thirdParty":[]}
```

Click counts differ per run because the deck is shuffled each game.

## Task Commits

1. **Task 1 RED:** `963bdd3` (test) `test(01-02): forbid the Google Fonts stylesheet in the rendered app`
2. **Task 1 GREEN:** `3dd5f64` (feat) `feat(01-02): self-host EB Garamond and drop the Google Fonts stylesheet`
3. **Task 2 RED:** `0496007` (test) `test(01-02): gate the production build on base-path, local-only assets`
4. **Task 2 GREEN:** `eb67e64` (feat) `feat(01-02): gold-cross favicon and theme color under the base path`

**Plan metadata:** committed separately (docs: complete plan)

## Files Created/Modified

- `src/fonts.css` - four woff2-only `@font-face` rules for EB Garamond
- `public/favicon.svg` - gold cross on #0a0608, source art for Phase 2 icons
- `src/build-output.test.js` - production-build gate (constants `BASE`, `VITE_BIN`; helpers `walk`, `htmlUrls`, `cssUrls`)
- `src/App.jsx` - two Google Fonts link elements removed, nothing else
- `src/main.jsx` - side-effect `import './fonts.css'` before the App import
- `src/App.smoke.test.jsx` - adds `not.toContain('fonts.googleapis.com')`
- `index.html` - `%BASE_URL%favicon.svg` icon link and theme-color meta

## Decisions Made

- D-04 record: the icon link is `%BASE_URL%favicon.svg`. The source has no literal leading slash and Vite writes `/pilgrims-predestined-path/favicon.svg` in dev and build; the RED run showed a root path fails the gate.
- Fonts use the package's woff2 files through an own `fonts.css` rather than the package CSS, avoiding four dead `.woff` files. The bare-specifier `url()` resolved in both dev and build, so the `src/fonts/` fallback was not needed.

## Deviations from Plan

None - plan executed exactly as written. The plan's flagged assumption held: the old icon link turned the build-output test RED at the first check (B1).

Minor implementation notes, not deviations: `src/build-output.test.js` adds helpers `htmlUrls()` and `cssUrls()` to share URL extraction between tests; `src/App.jsx` line endings in the working copy are CRLF (Windows checkout), which git normalizes to LF on commit, and the numstat confirms only two lines changed.

## Issues Encountered

- None blocking. `git` prints a CRLF-to-LF warning for `src/App.jsx` and `index.html` working copies on every add; expected with `core.autocrlf=true` and `.gitattributes` `eol=lf`.
- Not run (out of plan scope): a human look at the favicon and the typeface in a tab (see coverage D6); the live-page checks belong to plan 01-05.

## Known Stubs

None.

## Threat Flags

None. T-01-04 (Google Fonts leak) is mitigated by the smoke assertion, gate test B2 and the zero third-party requests in all five games; T-01-05 (SVG script) by the acceptance grep (0 text/script/foreignObject elements); T-01-07 (scratch tool in git) by `git ls-files` showing no `playcheck` path; T-01-06 and T-01-08 accepted as planned (the build-output test removes its temp directory in `afterAll`).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for plan 01-03 (CI workflow): `npm test` now runs the smoke test and the four build-output tests, so the workflow's test step gates on real base-path and font checks.
- DEPL-01 boundary: covered are the minimum and maximum player counts (2 and 4, plus 3 on preview) in dev and preview on Edge only; browsers below Vite 8's default target are neither supported nor checked. The verifier should treat any other DEPL-01 boundary as open.
- The live-site half of DEPL-03 (200s on the deployed URL, zero Google Fonts requests there) is still to be proven by plan 01-05 after the user-approved push and Pages switch.

## Self-Check: PASSED

- Files present: `src/fonts.css`, `public/favicon.svg`, `src/build-output.test.js`, `src/App.jsx`, `src/main.jsx`, `src/App.smoke.test.jsx`, `index.html`.
- Commits present: `963bdd3`, `3dd5f64`, `0496007`, `eb67e64`; `git rev-list --count 89dbc1a755e8dac495ef608c2069d4652f8ef56d..HEAD` printed 4 (measured from the persisted ledger `.git/gsd-plan-head-before-01-02`).
- Task 1 acceptance: numstat `0 2 src/App.jsx` PASS; `grep -v '^\s*//' src/App.jsx | grep -c googleapis` = 0 PASS; `@font-face` 4, `font-display: swap` 4, `format('woff2')` 4 PASS; fonts.css import (line 3) precedes App import (line 4) PASS; `not.toContain(` present and the RED assertion quoted above PASS.
- Task 2 acceptance: favicon `viewBox`, both fills present and 0 text/script/foreignObject PASS; index.html link, theme-color and title present, 0 vite.svg, 0 description, 0 manifest PASS; dist has `href="/pilgrims-predestined-path/favicon.svg"`, `dist/favicon.svg`, 0 `sw.js`/manifest files PASS; test file contains `const BASE = '/pilgrims-predestined-path/'`, `NODE_ENV: 'production'`, `toBeGreaterThan(0)`, `existsSync` PASS; five play.mjs JSON lines each `"won":true` with empty errors, bad and thirdParty PASS; `git ls-files` has no `playcheck` path PASS.
- Plan-level verification: `npm test` green (2 files, 5 tests); `npm run build` emits four EB Garamond woff2 files and `favicon.svg` under dist.

---
*Phase: 01-live-on-github-pages*
*Completed: 2026-09-30*
