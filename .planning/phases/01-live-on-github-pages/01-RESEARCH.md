# Phase 1: Live on GitHub Pages - Research

**Researched:** 2026-09-29
**Domain:** Vite 8 + React 19 static build, GitHub Pages deploy via Actions, Vitest gate, self-hosted font
**Confidence:** HIGH (every recommended change was executed in a scratch copy on this machine; the two items that need the user's go-ahead were deliberately not executed)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**React version**
- **D-01:** Ship on React 19 (`react` and `react-dom` ^19.3.0), not 18. Nothing is installed yet and research trial-built React 19.3 + Vite 8 cleanly; the component uses only hooks.
- **D-02:** `src/main.jsx` uses `createRoot` from `react-dom/client` and wraps `<App />` in `<StrictMode>`. Both effects in the component (`pilgrims-predestined-path.jsx:95`, `:323`) only scroll, so double-invocation in dev is safe.
- **D-03:** Update the React 18 references in `.claude/CLAUDE.md` (Technology Stack section) to match what ships.

**Tab icon and head**
- **D-04:** Replace the broken `/vite.svg` link with a hand-made `favicon.svg`: the gold cross ✠ (`#daa520`) on the game's dark background (`#0a0608`), matching the setup-screen emblem (`pilgrims-predestined-path.jsx:393`, `:431`). Put it in `public/` and reference it base-relative (no leading slash) so it resolves under `/pilgrims-predestined-path/`.
- **D-05:** This SVG is the source artwork Phase 2 renders its 192, 512, maskable and 180x180 PNG install icons from, so keep it simple and legible at 16px and with padding suitable for later maskable export.
- **D-06:** Keep `<title>` exactly "The Pilgrim's Predestined Path". Add `<meta name="theme-color" content="#0a0608">`. No meta description yet (wording belongs to Phase 3).

### Claude's Discretion
User did not select these areas; the planner decides within the constraints below.
- **CI test content.** Something must run in `npm test` so a failing test stops the deploy (SC3). A small Vitest smoke test is enough (roadmap note); the characterization suite is Phase 3. Exporting pure helpers (`buildSpaces`, `buildDeck`, etc.) for testing is acceptable if behavior does not change. Consider a build-output check that enforces SC4 (built `dist/index.html` and assets reference only `/pilgrims-predestined-path/` paths and nothing on fonts.googleapis.com), since that is cheaper than a live post-deploy check. A post-deploy smoke check against the live URL is optional.
- **Go-live handoff and ordering.** Follow research order: land the building app and fixed workflow on `main`, then flip the Pages source to GitHub Actions, then re-run via `workflow_dispatch`. Two hard stops for the user: (1) before any `git push` (global rule: no push unless asked), and (2) before flipping the Pages source (`gh api -X PUT repos/AvocadoPanic/pilgrims-predestined-path/pages -f build_type=workflow` or Settings > Pages). The live URL is already broken in legacy mode, so there is no working version to protect during the switch.
- **Font self-hosting method.** `@fontsource/eb-garamond` or woff2 files in `public/fonts`, planner's choice. Weights in use today: 400, 600, 700 and italic 400 (from the Google Fonts URL at `:391`/`:429`). Load once from a global stylesheet or `main.jsx`, `font-display: swap`, Georgia fallback; remove both `<link>` elements.
- Action pinning (tags vs SHAs), exact Vitest config, `.gitattributes` contents.

### Deferred Ideas (OUT OF SCOPE)
- Meta description / link-preview text: revisit with the Phase 3 copy rewrite.
- PNG install icons, manifest, service worker: Phase 2 (will derive from the D-04 SVG).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DEPL-01 | Player can open the game locally from `npm run dev` and a production build (`npm run build` then `npm run preview`) with no console errors | Trial project (React 19.3.0, Vite 8.3.1, plugin-react 6.1.1) built in ~1.2-3 s; Edge/Playwright loaded both `vite` dev (:5199) and `vite preview` (:4173) with zero console errors/warnings, zero >=400 responses, and played full 2- and 4-player games to "SOLI DEO GLORIA" (201 and 411 clicks). See Code Examples 1-5 and Validation Architecture. |
| DEPL-02 | Live game at https://avocadopanic.github.io/pilgrims-predestined-path/; every push to `main` runs tests, builds and deploys via GitHub Actions (source switched only with user go-ahead) | Workflow recipe (Code Example 6) uses the official Pages actions at verified current versions/SHAs, `npm test` before build, single-job so a failing test skips upload/deploy. `github-pages` environment already allows branch `main` (verified). Go-live sequence with two user stops in Architecture Patterns. |
| DEPL-03 | Every asset the page references loads under `/pilgrims-predestined-path/` with no 404s | Verified how Vite rewrites each reference kind (script, css, `public/` link, font url()). One trap found: a no-leading-slash `href="favicon.svg"` is NOT rewritten (Pitfall 1); use `%BASE_URL%favicon.svg`. Build-output Vitest test (Code Example 5) fails on any non-base URL or googleapis reference. |
</phase_requirements>

## Summary

The repo is five small, well-understood breakages away from a clean deploy: no React plugin and Vite 3, `src/main.jsx` importing a file that does not exist and using a removed React API, an invalid workflow, no lockfile, and a dead icon link. I reproduced the whole fix in a scratch copy under the session scratchpad (never touching the repo): `npm install` gave 0 vulnerabilities, `vite build` succeeded, 3 Vitest tests passed, and a real Edge browser played complete 2- and 4-player games on the production preview and on the dev server with no console errors and no failed requests. The recipe in `.planning/research/STACK.md` holds; this document adds the details that only showed up when executing it.

Four findings change or sharpen the plan. (1) A plain relative `href="favicon.svg"` (the literal reading of D-04) is left untouched by Vite and only works when the page URL is the base itself; `%BASE_URL%favicon.svg` is rewritten correctly and satisfies D-04's intent. (2) An in-process `vite.build()` call inside Vitest ships the development React bundle (461 kB instead of 245 kB) because Vitest sets `NODE_ENV=test`; the build-output test must spawn `vite build` as a child process with `NODE_ENV=production`. (3) `@fontsource/eb-garamond`'s own CSS lists both woff2 and woff, so Vite emits 8 font files; a 4-line own `@font-face` file that points at the package's woff2 files emits only 4 (bare-specifier `url()` works in both dev and build). (4) The Windows-generated lockfile already contains the `@rolldown/binding-linux-x64-gnu` entry, which lowers the Linux `npm ci` risk flagged in Pitfall 26, although only the first CI run can prove it.

The go-live is the only irreversible-feeling step: flipping Pages from the legacy branch build to Actions. Live state today: `build_type: legacy`, source `main` `/`, and the site serves the raw source `index.html` (script at `/src/main.jsx`), so nothing working is at risk. Two hard stops for the user (push, and the Pages flip) are mapped into the plan sequence below.

**Primary recommendation:** Do the repair in one wave of small commits (rename alone first, then edits), gate it with two Vitest files (App render smoke + child-process build-output check), write the single-job workflow with SHA-pinned official actions, then stop and ask before the push and again before `gh api -X PUT .../pages -f build_type=workflow`.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Game rules, deck, board, rendering | Browser / Client | — | Entire game is one React component with `useState`; no server exists. Unchanged this phase. |
| Asset URL rewriting under `/pilgrims-predestined-path/` | Build (Vite `base`) | CDN / Static | `base` rewrites script, css, `public/` links and CSS `url()` at build time; GitHub Pages only serves files. |
| Font delivery | CDN / Static (own origin) | Browser (font-display swap) | Self-hosted woff2 hashed under `dist/assets/`; removes third-party request. |
| Test gate | CI (GitHub Actions runner) | Local `npm test` | Same command locally and in CI; failing step skips later steps. |
| Build and publish | CI (Actions) | CDN / Static (Pages) | Official Pages actions upload `dist` and deploy it. |
| Pages source setting | GitHub repo settings (external service config) | — | Lives in GitHub, not in git; needs user go-ahead. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite | ^8.3.1 (8.3.1, published 2026-09-24) | Dev server, bundler | Current major; engines `^20.19.0 \|\| >=22.12.0` [VERIFIED: npm registry] |
| @vitejs/plugin-react | ^6.1.1 (2026-08-28) | JSX transform, Fast Refresh | peer `vite ^8.0.0` [VERIFIED: npm registry] |
| react, react-dom | ^19.3.0 (19.3.0, published 2026-09-09) | UI | Locked by D-01; 19.2.8 is the previous patch line if 19.3.0 misbehaves [VERIFIED: npm registry] |
| vitest | ^5.0.2 (2026-09-25) | `npm test` | engines `^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`, peer `vite ^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0` [VERIFIED: npm registry] |
| @fontsource/eb-garamond | ^5.3.0 (2026-07-19), OFL-1.1 | Source of the four woff2 files | Latin-subset woff2 for 400, 400-italic, 600, 700 exist under `files/` [VERIFIED: node_modules listing in trial] |

Node: pin `node-version: 24` in CI; local is v24.15.0, npm 11.12.1 [VERIFIED: `node --version`, `npm --version`]. Do not use `lts/*` (Vite's own sample uses it, but it will move from 24 to 26 on 2026-10-28 per STACK.md).

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | | | No jsdom, no Testing Library, no zod, no Playwright this phase. `react-dom/server` `renderToString` renders the whole App in Vitest's default `node` environment. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Own woff2-only `fonts.css` over the package files | `@fontsource/eb-garamond/latin-400.css` imports | Package CSS lists woff2 AND woff, so Vite emits 4 extra `.woff` files (~120 kB dead weight, and Phase 2's precache would carry them). Works, just heavier. |
| Own woff2-only CSS | Commit woff2 to `public/fonts/` | Puts binaries in git plus an OFL license file to maintain; `public/` files are not hashed. Dependency route is cleaner. |
| Single-job workflow (below) | Split build and deploy jobs | Split is GitHub's starter shape and allows a PR trigger; unnecessary for a solo `main`-only repo. Single job is what Vite documents. |
| Vitest build-output test | Node script run after `npm run build` | Script needs a prior build to exist; the child-process test makes `npm test` self-contained. |
| `yaml` devDependency to test workflow structure | one-off `python -c "import yaml"` check | Extra dependency for one file; use the one-off (pyyaml 6.0.3 is installed locally). |

**Installation (Git Bash or PowerShell; no inline env vars needed):**
```bash
npm install react@^19.3.0 react-dom@^19.3.0
npm install -D vite@^8.3.1 @vitejs/plugin-react@^6.1.1 vitest@^5.0.2 @fontsource/eb-garamond@^5.3.0
npm uninstall gh-pages
# commit the generated package-lock.json
```
(`npm uninstall gh-pages` is a no-op error-free path if the package.json is rewritten wholesale first; either order is fine. Rewrite `package.json` per Code Example 1, then run `npm install` once to create the lockfile.)

**Version verification (run 2026-09-29):** `npm view <pkg> version` returned vite 8.3.1, @vitejs/plugin-react 6.1.1, react 19.3.0, react-dom 19.3.0, vitest 5.0.2, @fontsource/eb-garamond 5.3.0. A real `npm install` of exactly these produced "found 0 vulnerabilities". [VERIFIED: npm registry, trial install]

## Package Legitimacy Audit

Seam run: `gsd_run query package-legitimacy check --ecosystem npm ...`. The only reason the seam gave for every SUS is `too-new` (a release within roughly the last 30 days); download counts and source repos are all mainstream. No package has a `postinstall` script (`postinstall: null` in every signal).

| Package | Registry | Latest published | Downloads/wk | Source Repo | Verdict | Disposition |
|---------|----------|------------------|--------------|-------------|---------|-------------|
| react | npm | 2026-09-09 | 207,637,325 | github.com/react/react (repo exists, 250,829 stars via `gh api repos/react/react`) | SUS (too-new) | Approved by locked decision D-01; consolidated checkpoint below |
| react-dom | npm | 2026-09-09 | 195,895,413 | github.com/react/react | SUS (too-new) | Same |
| vite | npm | 2026-09-24 | 213,984,910 | github.com/vitejs/vite | SUS (too-new) | Same |
| vitest | npm | 2026-09-25 | 126,594,893 | github.com/vitest-dev/vitest | SUS (too-new) | Same |
| @vitejs/plugin-react | npm | 2026-08-28 | 108,558,470 | github.com/vitejs/vite-plugin-react | OK | Approved |
| @fontsource/eb-garamond | npm | 2026-07-19 | 414,352 | github.com/fontsource/font-files | OK | Approved (name confirmed in fontsource.org install docs: `@fontsource/` scheme, per-weight `*.css` imports) |

**Packages removed due to SLOP verdict:** none.
**Packages flagged SUS:** react, react-dom, vite, vitest (recency only). Because the protocol requires a checkpoint for SUS, the planner should add ONE consolidated `checkpoint:human-verify` before the first `npm install`: "confirm the four pinned majors in package.json (react/react-dom ^19.3.0, vite ^8.3.1, vitest ^5.0.2); fall back to react ^19.2.8 if desired." The trial install already ran clean, so this is a formality the user can approve in one line. `yaml` was also checked (SUS, too-new, 247M/wk) and is NOT recommended (not needed).

Package-name provenance: react, react-dom, vite, @vitejs/plugin-react and vitest are confirmed by the Vite/Vitest official docs read in this and the prior research session (vite.dev guides, vitest.dev/guide); @fontsource/eb-garamond by fontsource.org docs.

## Architecture Patterns

### System Architecture Diagram

```
 developer (Windows, Git Bash/PowerShell)
    | npm run dev  --------------------->  Vite dev server  http://localhost:5173/pilgrims-predestined-path/
    | npm test  ------------------------>  Vitest (node env)
    |                                        |- App.smoke.test.jsx: renderToString(<App/>) must not throw,
    |                                        |    must not contain "fonts.googleapis.com"
    |                                        `- build-output.test.js: child-process `vite build` (NODE_ENV=production)
    |                                             -> tmp dir; every src/href in index.html starts with base;
    |                                                no built file mentions googleapis or a root-absolute url()
    | npm run build && npm run preview -->  dist/ served at http://localhost:4173/pilgrims-predestined-path/
    |
    | git push origin main   (USER STOP 1: ask first)
    v
 GitHub Actions: deploy.yml  (push to main, workflow_dispatch)
    checkout -> setup-node(24, cache npm) -> npm ci -> npm test --(fail)--> job stops, nothing published
                                                          |
                                                          v (pass)
    npm run build -> configure-pages -> upload-pages-artifact(path ./dist) -> deploy-pages
                                                          |
                     Pages source must be "GitHub Actions"  <-- USER STOP 2: ask first
                                                          v
    https://avocadopanic.github.io/pilgrims-predestined-path/  (every asset under /pilgrims-predestined-path/)
                                                          |
    optional post-deploy step: curl page_url, assert script src starts /pilgrims-predestined-path/assets/
```

### Recommended Project Structure
```
.
├── .github/workflows/deploy.yml      # replaced wholesale (LF endings)
├── .gitattributes                    # * text=auto eol=lf
├── .gitignore                        # node_modules/, dist/, .env*, *.log, *.local
├── index.html                        # %BASE_URL%favicon.svg, theme-color meta, no font link
├── package.json / package-lock.json  # committed lockfile (npm ci needs it)
├── vite.config.js                    # base + react() + test.include
├── public/favicon.svg                # D-04 artwork, 512x512 viewBox
└── src/
    ├── main.jsx                      # createRoot + StrictMode + './fonts.css'
    ├── App.jsx                       # git mv from pilgrims-predestined-path.jsx (Google <link>s removed)
    ├── fonts.css                     # 4 @font-face rules, woff2 only
    ├── App.smoke.test.jsx
    └── build-output.test.js
```

### Pattern 1: Base-aware head references
**What:** Reference `public/` files from `index.html` with `%BASE_URL%` (Vite replaces it at dev and build time), never a hard-coded root path and never a bare relative name.
**When to use:** favicon now; manifest and apple-touch-icon in Phase 2.
**Example:** see Code Example 3. Verified output: `href="/pilgrims-predestined-path/favicon.svg"`.

### Pattern 2: Vitest tests that build like production
**What:** Run `vite build` in a child process with `NODE_ENV=production` into an OS temp dir, then assert on the emitted files.
**When to use:** any test about dist contents (SC4 now; PWA manifest checks in Phase 2).
**Example:** Code Example 5.

### Pattern 3: Go-live sequence (two user stops)
1. Local: repair app, tests green, `npm run build && npm run preview` clean (no push yet).
2. Commit on `main` locally (commits are fine; the global rule bans push, not commit, but confirm the user wants commits as the phase executes).
3. **STOP 1 (ask):** "Ready to `git push origin main`?" The push triggers the new workflow. Expected: the test and build steps pass; the configure-pages/deploy steps probably fail while Pages is still `legacy` (see Assumption A1). Legacy Pages also rebuilds from `main`/`/` and still serves the raw source page. This is harmless (the live URL is already broken).
4. **STOP 2 (ask):** "Flip Pages source to GitHub Actions?" Command: `gh api -X PUT repos/AvocadoPanic/pilgrims-predestined-path/pages -f build_type=workflow` (or Settings > Pages > Source). NOT run in research.
5. Re-run: `gh workflow run deploy.yml` (or Actions tab > Run workflow; the `workflow_dispatch` trigger exists), then `gh run watch`.
6. Verify live (Validation Architecture, live checks).
Rollback if ever needed (Assumption A2): `gh api -X PUT repos/AvocadoPanic/pilgrims-predestined-path/pages -f build_type=legacy -f "source[branch]=main" -f "source[path]=/"`.

### Anti-Patterns to Avoid
- **`href="favicon.svg"` (bare relative) in `index.html`:** not rewritten by Vite; works only when the document URL is the base itself.
- **`vite.build()` called in-process from a Vitest test:** builds the development bundle under `NODE_ENV=test`.
- **`@fontsource/.../latin-400.css` imports when dist weight matters:** drags in woff duplicates.
- **`node-version: lts/*`:** silently moves to 26.
- **Editing files with `sed -i`:** banned on this machine (truncation bug). Use the Edit/Write tools or Node.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Base-path rewriting of assets | Manual string concatenation of `/pilgrims-predestined-path/` in code | Vite `base` + `%BASE_URL%` in HTML + relative `url()` in CSS | Verified that Vite rewrites script, css, `public/` links with a leading slash, and CSS font `url()`. |
| Publishing to Pages | `gh-pages` npm package, `peaceiris/actions-gh-pages`, a `gh-pages` branch | `actions/configure-pages` + `upload-pages-artifact` + `deploy-pages` | Two competing deploy paths is the current bug; Pages ignores a `gh-pages` branch once source = Actions. |
| Rendering the App in a test | jsdom + Testing Library | `react-dom/server` `renderToString` | Works in the default node environment; verified to render the full setup screen. |
| Font hosting | Hand-downloading from Google Fonts | `@fontsource/eb-garamond` woff2 files (OFL-1.1) | Reproducible, versioned, lockfile-pinned. |
| Line-ending safety | Per-developer git config | `.gitattributes` `* text=auto eol=lf` | `core.autocrlf=true` here; YAML/lockfile with CRLF breaks Linux CI. |

**Key insight:** every problem in this phase has a stock answer. The only custom code is two small test files and a 4-rule CSS file.

## Common Pitfalls

### Pitfall 1: The bare-relative favicon path is not rewritten
**What goes wrong:** With `<link href="favicon.svg">` the built `dist/index.html` still says `href="favicon.svg"`. It resolves against the page URL, so it works at `/pilgrims-predestined-path/` and `/pilgrims-predestined-path/index.html` but a strict SC4 check ("every reference under the base") fails and any future deep URL would 404.
**Why it happens:** Vite only rewrites root-absolute references to `public/` files (and `%BASE_URL%`).
**How to avoid:** `<link rel="icon" type="image/svg+xml" href="%BASE_URL%favicon.svg" />`. Verified output `href="/pilgrims-predestined-path/favicon.svg"`. This keeps D-04's intent (no hard-coded leading slash, resolves under the base). `href="/favicon.svg"` also gets rewritten (verified with an apple-touch-icon link) and is what the Vite docs show; either passes the build-output test, the planner should pick one and note the choice against D-04.
**Warning signs:** built `index.html` contains an `href` that does not start with `/pilgrims-predestined-path/`.

### Pitfall 2: In-process build inside Vitest ships the dev bundle
**What goes wrong:** `import { build } from 'vite'` in a test produced a 460,978-byte JS file (development React) versus 244,698 bytes in a real build. `mode: 'production'` did not fix it; setting `process.env.NODE_ENV = 'production'` did.
**Why it happens:** Vitest sets `NODE_ENV=test` and Vite honors an already-set value.
**How to avoid:** child process with `env: { ...process.env, NODE_ENV: 'production' }` (Code Example 5).
**Warning signs:** dist JS around 460 kB in a test but 245 kB from `npm run build`.

### Pitfall 3: Google Fonts `<link>` lives inside the React component
**What goes wrong:** There are two `<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:...">` elements inside the JSX (setup screen line 391, play screen line 429), so removing them from `index.html` is not enough; they are in the JS bundle.
**How to avoid:** delete both from `src/App.jsx`; the smoke test asserts `renderToString(<App />)` has no `fonts.googleapis.com` and the build-output test asserts the same over all built files. I confirmed both tests FAIL against the unmodified component and PASS after removal (a real red-then-green).
**Warning signs:** Network panel shows `fonts.googleapis.com` and `fonts.gstatic.com` requests (observed in the stale-dist run).

### Pitfall 4: Windows-made lockfile on Linux CI
**What goes wrong:** `npm ci` fails on `ubuntu-latest` with a missing platform binding (npm/cli#4828).
**Status:** the lockfile generated here (npm 11.12.1) lists `node_modules/@rolldown/binding-linux-x64-gnu` (and 14 other platform bindings) and `lightningcss-linux-x64-gnu` [VERIFIED: grep of trial `package-lock.json`]. Risk is low but only the first CI run proves it.
**Fallback:** delete `node_modules` and `package-lock.json`, reinstall, recommit; or add explicit `optionalDependencies`. Docker is not available locally to pre-test.

### Pitfall 5: Merged rename and edit hides history and confuses reviewers
**What goes wrong:** `git mv pilgrims-predestined-path.jsx src/App.jsx` plus removing the two `<link>` lines in one commit can drop git's rename detection.
**How to avoid:** commit the `git mv` alone, then edit `src/App.jsx` in a second commit. Case-insensitive FS: `core.ignorecase=true` here [VERIFIED: `git config core.ignorecase`], so import `./App.jsx` with exact case; Linux CI is the case-sensitivity test.

### Pitfall 6: `github-pages` environment branch policy
**What goes wrong:** `workflow_dispatch` from any branch other than `main` is rejected by the environment.
**Status:** the environment `github-pages` exists with custom branch policies; the only allowed branch is `main` [VERIFIED: `gh api .../environments/github-pages/deployment-branch-policies`]. Run all deploys from `main`.

### Pitfall 7: Stale HTTP cache after deploy
Pages sends `Cache-Control: max-age=600`; the pre-flip `index.html` can be cached up to 10 minutes. A post-deploy curl should retry and add a cache-buster query, and a human check should hard-reload.

## Code Examples

Each example below was run in the scratch trial unless noted.

### 1. package.json (replace wholesale)
```json
{
  "name": "pilgrims-predestined-path",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": { "react": "^19.3.0", "react-dom": "^19.3.0" },
  "devDependencies": {
    "@fontsource/eb-garamond": "^5.3.0",
    "@vitejs/plugin-react": "^6.1.1",
    "vite": "^8.3.1",
    "vitest": "^5.0.2"
  }
}
```
Replaces the current single-line file whose scripts include `"deploy":"gh-pages -d dist"` and whose deps are `"react":"^18.0.0"`, `"vite":"^3.0.0"`, `"gh-pages":"^4.0.0"` [VERIFIED: package.json:1]. Run `npm install` once, commit `package-lock.json`, then run `npm ci` locally once to prove the lockfile is consistent.

### 2. vite.config.js
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/pilgrims-predestined-path/',
  plugins: [react()],
  test: { include: ['src/**/*.test.{js,jsx}'] },
});
```
Current file has only `base: '/pilgrims-predestined-path/'` and a comment [VERIFIED: vite.config.js:3-6]. Phase 3's planned include (`src/**/*.test.js`, `scripts/**/*.test.js`) is compatible; widen then.

### 3. index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="%BASE_URL%favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0a0608" />
    <title>The Pilgrim's Predestined Path</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```
Built output (verified): `href="/pilgrims-predestined-path/favicon.svg"`, script `src="/pilgrims-predestined-path/assets/index-<hash>.js"`, stylesheet `href="/pilgrims-predestined-path/assets/index-<hash>.css"`. Current file: icon `href="/vite.svg"` at line 5, script `/src/main.jsx` at line 11 [VERIFIED: index.html:5,11]. Root `/` of dev and preview both answer 302 (redirect to the base) [VERIFIED: curl in trial].

### 4. src/main.jsx and src/fonts.css
```jsx
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```
```css
/* src/fonts.css  (bare-specifier url() resolves in dev and build; woff2 only) */
@font-face{font-family:'EB Garamond';font-style:normal;font-weight:400;font-display:swap;src:url(@fontsource/eb-garamond/files/eb-garamond-latin-400-normal.woff2) format('woff2');}
@font-face{font-family:'EB Garamond';font-style:italic;font-weight:400;font-display:swap;src:url(@fontsource/eb-garamond/files/eb-garamond-latin-400-italic.woff2) format('woff2');}
@font-face{font-family:'EB Garamond';font-style:normal;font-weight:600;font-display:swap;src:url(@fontsource/eb-garamond/files/eb-garamond-latin-600-normal.woff2) format('woff2');}
@font-face{font-family:'EB Garamond';font-style:normal;font-weight:700;font-display:swap;src:url(@fontsource/eb-garamond/files/eb-garamond-latin-700-normal.woff2) format('woff2');}
```
Build emitted exactly four `assets/eb-garamond-latin-{400-normal,400-italic,600-normal,700-normal}-<hash>.woff2` (23.8 to 25.4 kB each). In dev the requests go to `/pilgrims-predestined-path/node_modules/@fontsource/eb-garamond/files/...woff2` and returned no errors. The component already sets `fontFamily:"'EB Garamond',Georgia,serif"` everywhere, so Georgia remains the fallback with no change. Latin subset covers all text; emoji, arrows and ✠ come from system fonts exactly as they do today. Fallback if a bare-specifier `url()` ever breaks: copy the four files to `src/fonts/` and use `url(./fonts/...)` (also verified to build).

### 5. Tests (both green in trial; the App test failed before the `<link>` removal)
```jsx
// src/App.smoke.test.jsx
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

describe('App smoke', () => {
  it('renders the setup screen without throwing', () => {
    const html = renderToString(<App />);
    expect(html).toContain('Predestined Path');
    expect(html).not.toContain('fonts.googleapis.com');
  });
});
```
```js
// src/build-output.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = '/pilgrims-predestined-path/';
const VITE_BIN = join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
let out;

beforeAll(() => {
  out = mkdtempSync(join(tmpdir(), 'ppp-dist-'));
  // Child process, not vite.build(): Vitest sets NODE_ENV=test, which would ship the dev React bundle.
  execFileSync(process.execPath, [VITE_BIN, 'build', '--outDir', out, '--emptyOutDir', '--logLevel', 'silent'], {
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'pipe',
  });
}, 120_000);

afterAll(() => rmSync(out, { recursive: true, force: true }));

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);

describe('production build output', () => {
  it('index.html references only base-prefixed local URLs', () => {
    const html = readFileSync(join(out, 'index.html'), 'utf8');
    const urls = [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThan(0);
    for (const u of urls) expect(u.startsWith(BASE), u).toBe(true);
  });

  it('no built file mentions fonts.googleapis.com or a root-absolute asset URL', () => {
    for (const f of walk(out).filter((p) => /\.(html|css|js)$/.test(p))) {
      const t = readFileSync(f, 'utf8');
      expect(t.includes('fonts.googleapis.com'), f).toBe(false);
      expect(/url\(\s*["']?\/(?!pilgrims-predestined-path\/)/.test(t), f).toBe(false);
    }
  });
});
```
Run took about 2.6 s total. `process.cwd()` is the repo root because `npm test` runs from there. Optional extras the planner may add (Phase 3 territory, not required): export and unit-test `buildSpaces`/`buildDeck` (`pilgrims-predestined-path.jsx:29,78`).

### 6. .github/workflows/deploy.yml (replace wholesale; write with the Write tool so it is LF)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6.0.0
      - uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5.0.0
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@368f82528645a54fb793d4d04e342629a3f51346 # v5.0.1
      - name: Smoke check live page
        run: |
          url="${{ steps.deployment.outputs.page_url }}"
          for i in 1 2 3 4 5 6; do
            if curl -fsS "${url}?cb=${GITHUB_RUN_ID}" | grep -q '/pilgrims-predestined-path/assets/index-'; then
              echo "live page references built assets"; exit 0
            fi
            sleep 10
          done
          echo "live page does not reference built assets"; exit 1
```
Versions and SHAs: `gh api repos/<r>/releases/latest` gave checkout v7.0.1 (2026-07-20), setup-node v7.0.0 (2026-07-14), configure-pages v6.0.0 (2026-03-25), upload-pages-artifact v5.0.0 (2026-04-10), deploy-pages v5.0.1 (2026-09-01); `gh api repos/<r>/commits/<tag>` returned the SHAs above, which are identical to the SHAs in Vite's own sample workflow read from `vitejs/vite` `main` (`docs/guide/static-deploy-github-pages.yaml`) [VERIFIED: GitHub API, vitejs/vite raw file]. `setup-node` and `configure-pages`/`deploy-pages` run on `node24` (`using: 'node24'` seen in setup-node `action.yml`). `upload-pages-artifact` default `path` is `_site/`, so `path: ./dist` is required, and it excludes dotfiles by default [VERIFIED: action.yml]. The smoke-check step is optional (discretion); drop it if it proves flaky. `page_url` trailing slash is assumed (A3).

### 7. Files to add
```
# .gitattributes
* text=auto eol=lf

# .gitignore
node_modules/
dist/
.env*
*.log
*.local
```
Do not ignore `.planning/` or `.claude/`. `.claude/plans/` is currently untracked (`?? .claude/plans/`) and is the user's; leave it alone. Tracked index files are already LF (`git ls-files --eol` shows `i/lf`), so no renormalize commit is needed; working copies stay CRLF until re-checkout, which is harmless.

### 8. favicon.svg (D-04/D-05; rendered in Edge at 256, 32 and 16 px and viewed: recognizable ✠ at all three)
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#0a0608"/><path fill="#daa520" d="M216 96 256 128 296 96 276 236 416 216 384 256 416 296 276 276 296 416 256 384 216 416 236 276 96 296 128 256 96 216 236 236Z"/></svg>
```
A drawn path, not a `<text>` glyph, because a favicon renders without the page's fonts and ✠ (U+2720) is not in EB Garamond. Farthest point is about 165 px from center (32% of 512), inside the ~40% radius maskable safe zone commonly cited for Phase 2 (STACK.md, MEDIUM). Background is full-bleed so Phase 2 can reuse it for the maskable export; cross could be scaled up to about 1.2x if a bolder tab icon is wanted (still inside the safe zone).

### 9. CLAUDE.md update (D-03)
`.claude/CLAUDE.md` currently says React 18.0.0 (line 28), `React ^18.0.0` and `React-DOM ^18.0.0` (39-40), `Vite ^3.0.0` (41), `gh-pages ^4.0.0` (42, 48), `react@^18.0.0`/`react-dom@^18.0.0` (46-47), "Lockfile: missing" (35), `pilgrims-predestined-path.jsx ... not currently imported` (71), `./App` import example (119), and a "Missing App.jsx File" anti-pattern (294) [VERIFIED: grep of .claude/CLAUDE.md this session]. D-03 names React; the Vite, gh-pages, lockfile and App.jsx lines become false in the same change, so update them together in the Technology Stack, Source Structure and Anti-Patterns text (do not touch the GSD-managed markers).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `ReactDOM.render` | `createRoot` from `react-dom/client` | React 18/19 (render removed in 19) | `src/main.jsx` rewrite |
| `peaceiris/actions-gh-pages` + `docs/` | `configure-pages` + `upload-pages-artifact` + `deploy-pages` | official since 2022 | Vite's documented route |
| Vite 3 (esbuild/Rollup) | Vite 8 (Rolldown/Oxc); default target Baseline Widely Available (Chrome >=111, Edge >=111, Firefox >=114, Safari >=16.4) | Vite 8 | `plugin-react` 6 needs Vite 8 [CITED: vite.dev/guide/build] |
| Google Fonts `<link>` | self-hosted woff2 | privacy and offline | Needed for SC4 and Phase 7 offline |

**Deprecated/outdated:** `gh-pages` npm package and the `deploy` script (remove); `actions/checkout@v2` in the current workflow.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The first workflow run after the push (Pages still `legacy`) will pass test/build and fail at configure-pages or deploy-pages | Pattern 3 | Low. If it instead succeeds, the site goes live before the flip; still fine because nothing works today. |
| A2 | Rollback form `gh api -X PUT .../pages -f build_type=legacy -f "source[branch]=main" -f "source[path]=/"` is accepted | Pattern 3 | Low. Settings UI is the fallback. Not executed. |
| A3 | `steps.deployment.outputs.page_url` ends with a trailing slash so `${url}?cb=...` is valid | Code Example 6 | Low. Smoke step would fail and can be dropped or adjusted after the first run. |
| A4 | A failing `npm test` step stops later steps in the job (default Actions behavior, no `if: always()`) | SC3 | Low. Standard behavior; validate structurally (Validation Architecture) and optionally with one throwaway failing-test run after the user approves a push. |
| A5 | `npm ci` on `ubuntu-latest` succeeds with the Windows-generated lockfile | Pitfall 4 | Medium. Lockfile contains the linux bindings, but only the first CI run proves it; fallback documented. |
| A6 | GitHub Pages serves the fresh `index.html` within about a minute of deploy (curl loop retries 6 x 10 s) | Code Example 6 | Low. Increase retries or drop the step. |

## Open Questions

1. **Does the user want commits made during execution?**
   - Known: global rule says do not commit/push unless asked; GSD phase execution normally commits per task.
   - Unclear: whether that standing GSD behavior counts as "asked".
   - Recommendation: plan commits as part of GSD execution (config has `commit_docs: true`), but keep push and Pages flip as explicit user stops.
2. **`%BASE_URL%favicon.svg` vs `/favicon.svg` vs the literal D-04 wording.**
   - Known: literal bare `favicon.svg` is not rewritten (Pitfall 1).
   - Recommendation: use `%BASE_URL%favicon.svg`; record it as satisfying D-04's intent.
3. **Keep or drop the post-deploy curl step?** Optional per CONTEXT. Recommendation: keep; it is the only automatic check of the live URL (SC4), and it fails loudly if the source flip was forgotten.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node | build, test, dev | yes | v24.15.0 | — |
| npm | install, lockfile | yes | 11.12.1 | — |
| git | commits, `git mv` | yes | `core.autocrlf=true`, `core.ignorecase=true` | — |
| gh CLI | Pages flip, workflow runs | yes | 2.92.0, authenticated as AvocadoPanic | Settings UI |
| Microsoft Edge (Playwright `channel: 'msedge'`) | optional browser playthrough | yes | worked in trial | manual browser check |
| python + pyyaml | one-off workflow YAML parse | yes | pyyaml 6.0.3 | manual read |
| Docker / act / actionlint | local CI rehearsal | no | — | first CI run is the test |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** Docker/act/actionlint (rely on the first Actions run).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^5.0.2 (node environment) |
| Config file | `vite.config.js` `test.include` (created in Wave 0) |
| Quick run command | `npx vitest run src/App.smoke.test.jsx` |
| Full suite command | `npm test` |

### Phase Requirements to Test Map
| Req / SC | Behavior | Test Type | Automated Command | File Exists? |
|----------|----------|-----------|-------------------|-------------|
| DEPL-01 / SC2 | App renders without throwing; no Google Fonts link in component | unit | `npx vitest run src/App.smoke.test.jsx` | Wave 0 |
| DEPL-01 / SC2 | `npm run build` succeeds | build | `npm run build` (exit 0) | n/a |
| DEPL-01 / SC2 | No console errors in dev and preview, game plays to victory | browser (scripted, not committed) | scratch Playwright/Edge script, see below | manual or scratch |
| DEPL-03 / SC4 | Every `src`/`href` in built `index.html` starts with `/pilgrims-predestined-path/`; no built file mentions `fonts.googleapis.com` or a root-absolute `url()` | build-output | `npx vitest run src/build-output.test.js` | Wave 0 |
| DEPL-03 / SC4 | Live page asset URLs return 200 | live check | bash snippet below | after go-live |
| DEPL-02 / SC3 | Workflow parses, has test before upload, `path: ./dist`, required permissions, no `publish_dir`, no `gh-pages` script | structural | `python -c` snippet below | after Wave 1 |
| DEPL-02 / SC3 | Failing test blocks deploy | structural + optional live | same structural check (test step precedes upload/deploy with no `continue-on-error`/`if: always()`); optional throwaway failing-test push ONLY with user approval | n/a |
| DEPL-02 / SC1, SC3 | Live URL serves the built app after flip | live check | `gh run watch` then curl snippet | after STOP 2 |
| SC1 | 2 to 4 player game reaches space 133 on the live URL | manual UAT (end-of-phase) or scratch script | see below | after go-live |

Workflow structural check (one-off, uses local pyyaml):
```bash
python -c "
import yaml,sys
w=yaml.safe_load(open('.github/workflows/deploy.yml'))
on=w.get('on', w.get(True)); s=w['jobs']['deploy']['steps']
runs=[x.get('run') for x in s]; uses=[x.get('uses','') for x in s]
assert 'main' in on['push']['branches'] and 'workflow_dispatch' in on
assert w['permissions']['pages']=='write' and w['permissions']['id-token']=='write'
i_test=runs.index('npm test'); i_up=[i for i,u in enumerate(uses) if 'upload-pages-artifact' in u][0]
assert i_test < i_up and not any(x.get('continue-on-error') or x.get('if') for x in s[:i_up])
assert s[i_up]['with']['path']=='./dist'
assert 'publish_dir' not in open('.github/workflows/deploy.yml').read()
print('workflow ok')"
```
(YAML 1.1 parses the bare key `on` as boolean `True`, hence `w.get(True)`; run once and adjust if pyyaml returns the string key.)

Scripted browser check (proven in research, `playwright-core` 1.63.0 with `channel: 'msedge'`; keep it in the scratchpad or a throwaway install, do not add a dependency this phase; Phase 2 is expected to add Playwright): open the URL, click the player-count button (name "2", "3" or "4", exact), click "Submit to Providence", then loop clicking "Draw Card" and "Next Pilgrim →" until text "SOLI DEO GLORIA" appears; collect `console` warnings/errors, `pageerror`, and responses with status >= 400. Result in trial on production preview: 2 players 201 clicks, 4 players 411 clicks, zero errors, zero bad responses; dev server: zero errors.

Live asset check (after go-live):
```bash
url=https://avocadopanic.github.io/pilgrims-predestined-path/
curl -fsS "$url" | grep -o '\(src\|href\)="[^"]*"' | sed 's/.*="\(.*\)"/\1/' | while read -r p; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://avocadopanic.github.io$p"); echo "$code $p"; done
```
(Run with the Bash tool's plain `sed` reading stdin only; it is `sed -i` that is banned.) Every line should print `200` and every path should begin `/pilgrims-predestined-path/`. Also fetch the linked CSS and confirm its font URLs resolve, and confirm `curl -s "$url" | grep -c googleapis` prints 0.

### Sampling Rate
- **Per task commit:** `npx vitest run` on the touched test file (under 5 s).
- **Per wave merge:** `npm test` and `npm run build`.
- **Phase gate:** `npm test`, `npm run build && npm run preview` browser check, workflow structural check, then live checks after the go-live, all green before `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] `src/App.smoke.test.jsx` covers DEPL-01, SC2 (and SC4 for the in-component link)
- [ ] `src/build-output.test.js` covers DEPL-03, SC4
- [ ] `vite.config.js` `test.include` and `"test": "vitest run"` script
- [ ] Framework install: `npm install -D vitest@^5.0.2` (part of Code Example 1)

## Security Domain

`security_enforcement` is enabled (ASVS level 1, block on high). The surface is a static, client-only site with no accounts, inputs, cookies or secrets.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | no users |
| V3 Session Management | no | no sessions |
| V4 Access Control | no | public static content; CI access via `permissions:` block |
| V5 Input Validation | no | the game takes no free-text input this phase |
| V6 Cryptography | no | HTTPS is enforced by Pages (`https_enforced: true`, verified via `gh api .../pages`); nothing hand-rolled |
| V10/V14 Build and dependency integrity | yes | committed lockfile + `npm ci`; SHA-pinned actions; least-privilege workflow permissions |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Compromised or moved action tag | Tampering | Pin the five actions to full commit SHAs (recorded above; repo setting `sha_pinning_required` is false, so this is voluntary) |
| Over-broad `GITHUB_TOKEN` | Elevation | `permissions:` limited to `contents: read`, `pages: write`, `id-token: write`; repo default is read [VERIFIED: `gh api .../actions/permissions/workflow` returned `default_workflow_permissions: read`] |
| Malicious or typosquatted npm package | Tampering | Only the six vetted packages; lockfile; no `postinstall` scripts in any of them; consolidated human-verify checkpoint for the SUS-by-recency four |
| Third-party request leaks visitor IP (Google Fonts) | Information disclosure | Self-host font; tests forbid `fonts.googleapis.com` |
| Secrets in repo | Information disclosure | None used; `.gitignore` covers `.env*` |
| Unreviewed deploy from a feature branch | Tampering | `github-pages` environment allows only `main` [VERIFIED] |

## Sources

### Primary (HIGH confidence)
- npm registry via `npm view` (2026-09-29): vite, @vitejs/plugin-react, react, react-dom, vitest, @fontsource/eb-garamond, yaml, jsdom versions, engines, peers, publish times.
- `gsd_run query package-legitimacy check --ecosystem npm ...` verdicts (react, react-dom, vite, vitest, yaml = SUS too-new; plugin-react, fontsource = OK).
- GitHub API via `gh`: releases/latest and commit SHAs for the five actions; `repos/AvocadoPanic/pilgrims-predestined-path/pages` (`build_type: legacy`, `source main /`, `https_enforced: true`); environments/github-pages and its branch policy (`main` only); actions/permissions (`sha_pinning_required: false`, default token permission read); prior workflow runs (both `deploy.yml` runs failed).
- vitejs/vite raw files: `docs/guide/static-deploy-github-pages.yaml` (workflow, SHAs), `docs/guide/static-deploy.md` (Pages: Settings > Pages > Source > GitHub Actions; `base` `/<REPO>/`), `docs/guide/build.md` (base rewrite, default target), `docs/guide/assets.md` (`public/` referenced with root absolute path).
- `actions/setup-node` and `actions/upload-pages-artifact` `action.yml` (node24, `_site/` default, dotfile exclusion).
- fontsource.org install docs (`@fontsource/` naming, per-weight CSS imports).
- The repo's own files, read this session: `index.html`, `src/main.jsx`, `package.json`, `vite.config.js`, `pilgrims-predestined-path.jsx` (lines 388-391, 456-467), `.planning/research/STACK.md`, `PITFALLS.md` 25-29, `01-CONTEXT.md`, `REQUIREMENTS.md`, `STATE.md`.
- Trial project executed in the session scratchpad (not the repo): install, build, Vitest, dev and preview under Edge/Playwright, favicon render.

### Secondary (MEDIUM confidence)
- `.planning/research/STACK.md` for the maskable safe-zone figure and Node 24/26 schedule (carried forward, not re-verified).

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH, versions read from the registry and installed clean.
- Architecture: HIGH, workflow mirrors Vite's official sample with verified SHAs; the untestable parts (first CI run, Pages flip) are in the Assumptions Log.
- Pitfalls: HIGH for 1-3, 5-6 (reproduced or read directly); MEDIUM for 4 (lockfile contents verified, Linux install not run).

**Research date:** 2026-09-29
**Valid until:** about 2026-10-13 (Vite, Vitest and React all released within the last month; re-check `npm view` versions and action releases if planning slips past two weeks, and Node 26 becomes LTS on 2026-10-28 but the pin to 24 makes that irrelevant).
