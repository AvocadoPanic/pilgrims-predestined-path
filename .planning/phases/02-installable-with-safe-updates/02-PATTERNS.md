# Phase 2: Installable, With Safe Updates - Pattern Map

**Mapped:** 2026-09-30
**Files analyzed:** 22 (9 modified, 13 new)
**Analogs found:** 9 with a codebase analog / 22 (the rest are greenfield; RESEARCH.md Code Examples are the pattern source)

All analog paths below were confirmed tracked with `git ls-files` (src/, public/, .github/, index.html, vite.config.js, package.json). No gitignored mirror paths are used. The repo has no `docs/` or `scripts/` directory yet.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `vite.config.js` (modify) | config | build-time | itself (`vite.config.js:1-10`) | exact (extend) |
| `package.json` (modify) | config | n/a | itself | exact (add one devDependency) |
| `index.html` (modify) | config | static | `index.html:5,7` | exact (extend) |
| `src/main.jsx` (modify) | entry | event-driven | itself (`src/main.jsx:1-10`) | exact (extend) |
| `src/App.jsx` (modify) | component | request-response (UI state) | itself (`src/App.jsx:308-423`) | exact (extend) |
| `src/pwa/store.js` (new) | service (singletons) | event-driven | none in repo | no analog |
| `src/pwa/updates.js` (new) | service | event-driven | none in repo | no analog |
| `src/pwa/install.js` (new) | service + pure util | event-driven | none in repo | no analog (pure fn style: `src/App.jsx` util section) |
| `src/pwa/startHandoff.js` (new) | utility | file-I/O (storage) | none in repo | no analog |
| `src/pwa/updates.test.js` (new) | test | event-driven | `src/App.smoke.test.jsx` | role-match |
| `src/pwa/install.test.js` (new) | test | event-driven | `src/App.smoke.test.jsx` | role-match |
| `src/pwa/startHandoff.test.js` (new) | test | file-I/O | `src/App.smoke.test.jsx` | role-match |
| `src/build-output.test.js` (modify) | test | batch (build + walk) | itself (`:1-63`) | exact (extend) |
| `src/App.smoke.test.jsx` (modify) | test | request-response | itself (`:1-11`) | exact (extend) |
| `public/pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png`, `apple-touch-icon-180x180.png` (new, generated) | asset | static | `public/favicon.svg` | role-match |
| `public/favicon.ico` (new, optional) | asset | static | `public/favicon.svg` | role-match |
| `scripts/pwa-assets.config.mjs` (new) | config | batch (author-time) | none | no analog |
| `.github/workflows/deploy.yml` (modify) | config (CI) | batch | itself (`:38-48` smoke step) | exact (extend) |
| `docs/PWA.md` (new) | docs | n/a | none (no README; `.planning/` docs are the only prose) | no analog |

## Pattern Assignments

### `vite.config.js` (config, build-time)

**Analog:** itself. Current whole file, `vite.config.js:1-10`:
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/pilgrims-predestined-path/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{js,jsx}'],
  },
});
```
**Change:** switch to function form `defineConfig(({ command }) => ({...}))`, add `VitePWA({...})` next to `react()`, add `define: { __BUILD_ID__ }`. Keep `base` and `test.include` verbatim. Full validated body: RESEARCH.md Code Examples 1 (lines 290-346). Must keep `cleanupOutdatedCaches: true`; do not set `skipWaiting`, `clientsClaim`, or `autoUpdate`. Style note: the repo's config files use single quotes and semicolons (unlike compact App.jsx).

---

### `index.html` (config, static head links)

**Analog:** `index.html:5-7`:
```html
<link rel="icon" type="image/svg+xml" href="%BASE_URL%favicon.svg" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="theme-color" content="#0a0608" />
```
**Add** (after line 7, same `%BASE_URL%` pattern; the plugin injects the manifest link itself):
```html
<link rel="apple-touch-icon" href="%BASE_URL%apple-touch-icon-180x180.png" />
<meta name="apple-mobile-web-app-title" content="Pilgrim's Path" />
```
The existing test `index.html references only base-prefixed local URLs` (`src/build-output.test.js:38-42`) will cover these hrefs automatically.

---

### `src/main.jsx` (entry, event-driven)

**Analog:** itself, `src/main.jsx:1-10` (imports, then `createRoot(...).render(<StrictMode><App/></StrictMode>)`).
**Change:** add the ONLY `virtual:pwa-register` import in the codebase, before the render:
```js
import { registerSW } from 'virtual:pwa-register';
import { updates } from './pwa/store.js';
updates.start(registerSW);
```
Keep the existing import order (`react`, `react-dom/client`, `./fonts.css`, `./App.jsx`) and the StrictMode render unchanged. No test may import this file (Vitest cannot resolve the virtual module).

---

### `src/App.jsx` (component, UI state)

**Analog:** itself. Existing patterns to copy and the exact seams:

**Imports** (`src/App.jsx:1`, double quotes here, unlike config files):
```js
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
```
Add `useSyncExternalStore` to this list and import `{ updates, installs }` from `./pwa/store.js`, `{ saveStartHandoff, consumeStartHandoff, clearStartHandoff }` from `./pwa/startHandoff.js`.

**State and effect style** (`src/App.jsx:310-323`):
```js
const[phase,setPhase]=useState("setup");
const[numP,setNumP]=useState(2);
...
useEffect(()=>{if(lr.current)lr.current.scrollTop=lr.current.scrollHeight;},[log]);
```
Use the same compact no-space style for new hooks. Every `useSyncExternalStore` call needs the third `getServerSnapshot` argument (smoke test uses `renderToString`).

**start() to split into begin(n) + onStart** (`src/App.jsx:325-330`):
```js
const start=()=>{
  const p=Array.from({length:numP},(_,i)=>({id:i,position:0,color:PC[i],name:PN[i]}));
  setPlayers(p);setDeck(buildDeck());setDi(0);setCur(0);setCard(null);setTs("draw");setStuck({});setWinner(null);setPhase("play");
  setMsg(`The deck is shuffled. The outcome is fixed. ${PN[0]}, submit to Providence.`);
  setLog([{text:"⸭ The decree is sealed. ⸭",type:"system"}]);
};
```
Rename to `begin=(n)=>` using `n` for `numP`. Bound today as `onClick={start}` at `:420`, which would pass the click event, so add a no-arg `onStart` (RESEARCH.md Code Examples 5, lines 422-440). Define `begin` before the handoff-consuming `useEffect`.

**Setup screen seam** (`src/App.jsx:420-421`): start button, then closing `</div>` of the 500px column. Insert hint line, install row and footer between the button and `</div>` at `:421`. Existing button style to match for the secondary row (muted, not gold gradient), `src/App.jsx:420`:
```jsx
<button onClick={start} style={{padding:"11px 32px",borderRadius:"8px",background:"linear-gradient(135deg,#daa520,#c49520)",border:"none",cursor:"pointer",fontFamily:"'EB Garamond',Georgia,serif",fontSize:"14px",fontWeight:700,color:"#1a0a0a",letterSpacing:"2px",textTransform:"uppercase",boxShadow:"0 4px 12px rgba(218,165,32,0.3)"}}>Submit to Providence</button>
```
Secondary text style analog (muted line, `src/App.jsx:403`): `style={{color:"#7a6a5a",fontSize:"10px",lineHeight:1.6,margin:0,fontStyle:"italic"}}`. Secondary button analog (outlined, `src/App.jsx:456`): `background:"rgba(218,165,32,0.15)",border:"1px solid rgba(218,165,32,0.3)",...color:"#daa520"`. Footer id: use the dimmest palette already present (`#4a3a2a` at `:470`, `#6a5a4a` at `:397`), `fontSize` about 9-10px. Use `__BUILD_ID__` (Vite define; Vitest runs under `serve`, so it renders `dev`).

**Guard rule:** `phase` is the safe-to-reload gate; `useEffect(()=>{updates.setSafeToReload(phase==="setup");},[phase])`. Play Again stays `setPhase("setup")` (`:465`), unchanged (D-03). No PWA UI in the play/end return (`:426-478`).

---

### `src/pwa/updates.js` (service, event-driven)

**Analog:** none in repo (no external-store or injected-dependency modules exist). **Use RESEARCH.md Code Examples 3 (lines 355-391) verbatim.** Conventions to follow: factory `createUpdateController({ reload, doc, now })`, no import of `virtual:pwa-register`, no `window`/`document` access at import time, `registration.update().catch(()=>{})`, `onNeedReload` guarded by `safeToReload`, 30-minute throttle, server snapshot `() => false`.

### `src/pwa/install.js` (service + pure function, event-driven)

**Analog:** none. Pure-function style analog is the utility section of `src/App.jsx` (small functions with no side effects, e.g. `cardLabel`, `getAngle`). Use RESEARCH.md Pattern 3 (lines 211-225): `createInstallStore({ target, ... })` attaches `beforeinstallprompt` (`preventDefault`, stash) and `appinstalled`; export pure `installRowMode({ standalone, installed, hasPrompt, isIos })`. Environment probes (`matchMedia`, `navigator.standalone`, UA, `maxTouchPoints`) guarded by `typeof window !== 'undefined'`; server snapshot `() => null`.

### `src/pwa/store.js` (service, singletons)

**Analog:** none. Creates `updates` (`createUpdateController({reload:()=>window.location.reload(), doc:document})`) and `installs` singletons, guarded so importing under Node (smoke test) does not throw. No virtual import here (RESEARCH.md Architecture Patterns, lines 150-157).

### `src/pwa/startHandoff.js` (utility, storage)

**Analog:** none. Use RESEARCH.md Code Examples 4 (lines 399-420): key `ppp:start-after-update`, 2-minute expiry, `try/catch` on every storage call, injected `storage` and `now` parameters. Validate `numP` in `[2,3,4]` at the consumer. Matches the repo's "guard clause, no throw" error style (`src/App.jsx:333`).

---

### `src/pwa/*.test.js` (tests, event-driven / storage)

**Analog:** `src/App.smoke.test.jsx:1-11` (Vitest `describe/it/expect` imports from `'vitest'`, Node environment, no jsdom):
```js
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

describe('App smoke', () => {
  it('renders the setup screen without throwing', () => {
    const html = renderToString(<App />);
```
Copy only the import and `describe/it` layout. Use injected fakes: Node's global `EventTarget`/`Event` for install and visibility tests, a plain object with `getItem/setItem/removeItem` for storage, an injected `now` and fake `registerSW` for updates. Required cases: RESEARCH.md Validation Architecture table (lines 604-621): `installRowMode` for prompt/ios/standalone/Firefox; `onNeedRefresh` sets waiting; `onNeedReload` does not reload unless `setSafeToReload(true)`; pending reload makes `apply()` reload; throttle once per 30 minutes and swallowed rejection; handoff round trip, expiry, bad JSON, bad `numP`.

---

### `src/build-output.test.js` (test, build + walk)

**Analog:** itself. Reuse the single `beforeAll` build (`src/build-output.test.js:11-18`), `BASE` (`:7`), `out`, `walk` (`:22-24`), `htmlUrls` (`:26-29`). Do not add a second build file. New describe block style matches `:37-63`:
```js
describe('production build output', () => {
  it('index.html references only base-prefixed local URLs', () => {
    const urls = htmlUrls();
    expect(urls.length).toBeGreaterThan(0);
    for (const u of urls) expect(u.startsWith(BASE), u).toBe(true);
  });
```
Add `describe('PWA build output', ...)` from RESEARCH.md Code Examples 6 (lines 444-491): scope/start_url resolved against manifest URL, `id` resolved against ORIGIN, icon IHDR size checks, opaque 180x180 apple-touch-icon, `sw.js` real worker (not stub), registration under `${BASE}sw.js` with `scope`. Note the existing test at `:44-50` forbids root-absolute `url(/...)`; the new `id: '/pilgrims-predestined-path/'` lives in JSON, not CSS, so it is unaffected. Also confirm the existing check at `:38-42` tolerates the injected manifest link (research verified it does).

### `src/App.smoke.test.jsx` (test, request-response)

**Analog:** itself (`:5-10`). Add one assertion to the existing `it` or a sibling: `expect(html).toContain('dev')` for the D-14 footer (Vitest runs with `command === 'serve'`, so `__BUILD_ID__` is `"dev"`). The test must stay green, so App must not touch `window`, `document` or `sessionStorage` during render.

---

### `public/*.png` and `scripts/pwa-assets.config.mjs` (assets, one-time generation)

**Analog:** `public/favicon.svg` is the source art (D-11), unchanged. Config: RESEARCH.md Code Examples 7 (lines 498-510), run once with `npx --yes @vite-pwa/assets-generator@1.0.2 --config scripts/pwa-assets.config.mjs`, then commit the PNGs. Plan must include a `checkpoint:human-verify` before the first run (package flagged SUS: too-new) and a visual review of the outputs (no white frame, full-bleed). Keep `favicon.ico` only if `<link rel="icon" ... sizes="48x48">` is added; else remove the `favicons` key.

---

### `.github/workflows/deploy.yml` (config, CI batch)

**Analog:** its own smoke step, `.github/workflows/deploy.yml:38-48`:
```yaml
      - name: Smoke check live page
        env:
          PAGE_URL: ${{ steps.deployment.outputs.page_url }}
        run: |
          for i in 1 2 3 4 5 6; do
            if curl -fsS "${PAGE_URL}?cb=${GITHUB_RUN_ID}" | grep -q '/pilgrims-predestined-path/assets/index-'; then
              echo "live page references built assets"; exit 0
            fi
            sleep 10
          done
```
Append a sibling step per RESEARCH.md Code Examples 8 (lines 515-526): same `env.PAGE_URL`, same 6x10s retry loop, `curl -fsS -o /dev/null`, `?cb=${GITHUB_RUN_ID}`. Keep the SHA-pinned `uses:` lines untouched. `GITHUB_SHA` already reaches `npm run build` (`:31`), so no change is needed for the build id. Open Question 1 (`paths-ignore` for docs-only pushes) and Phase 1 WR-02 (`cancel-in-progress: true`, `:15`) are policy decisions to flag to the user, not to change silently.

---

### `docs/PWA.md` (docs)

**Analog:** none. Content is fixed by D-16 and RESEARCH.md Code Examples 9 and Pitfall 5: kill-switch procedure (flip `KILL_SWITCH`, build, confirm unregister and caches cleared, revert; emergency only, reloads all windows, clears all origin caches), standing rules (never rename `sw.js` or change scope, `ppp:` prefix, `cleanupOutdatedCaches: true`, test with build + preview not `vite dev`), two-deploy update check for Phases 3 to 7, real-device checklist. No README link (D-16). Follow the global writing rules: no em-dashes, ASCII quotes.

## Shared Patterns

### Guard clauses, no throw
**Source:** `src/App.jsx:333` and `:96` (`if(ts!=="draw"||di>=deck.length)return;`)
**Apply to:** all `src/pwa/*.js`. Failure of storage, `matchMedia`, `registration.update()` is swallowed (`try/catch` with empty handler or `.catch(()=>{})`); the game must never break because of PWA code.

### Node-safe module load
**Source:** `src/App.smoke.test.jsx:5-10` (renders App with `renderToString` in Node, no jsdom)
**Apply to:** `src/pwa/store.js`, `updates.js`, `install.js`, `App.jsx`. No `window`/`document`/`sessionStorage` at import or render time; all `useSyncExternalStore` calls pass `getServerSnapshot`.

### Base-path prefixing
**Source:** `index.html:5` (`%BASE_URL%favicon.svg`) and `src/build-output.test.js:7` (`BASE`)
**Apply to:** every new HTML link, manifest icon `src`, test URL assertion. Never a root-absolute path outside `/pilgrims-predestined-path/`.

### Storage and cache naming
**Source:** CONTEXT.md D-01, D-16 (`ppp:` prefix); no existing code uses storage.
**Apply to:** `startHandoff.js` key `ppp:start-after-update`; any future custom cache.

### Inline style palette (UI additions)
**Source:** `src/App.jsx:390-420`. Text `#7a6a5a`/`#6a5a4a`/`#4a3a2a` (muted), accent `#daa520`, font `'EB Garamond',Georgia,serif`, sizes 10-14px, no CSS files.
**Apply to:** hint line, install row, footer build id.

### Build test reuse
**Source:** `src/build-output.test.js:11-18` (one child-process build with `NODE_ENV=production` in a temp dir)
**Apply to:** all SC5 assertions; do not add a second building test file.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/pwa/store.js` | service | event-driven | No external stores or singletons exist; use RESEARCH.md Patterns 1, 3, 4 |
| `src/pwa/updates.js` | service | event-driven | No service worker or injected-dependency code exists; RESEARCH.md Code Examples 3 |
| `src/pwa/install.js` | service | event-driven | Nothing listens to browser events yet; RESEARCH.md Pattern 3 |
| `src/pwa/startHandoff.js` | utility | storage I/O | App uses no storage today; RESEARCH.md Code Examples 4 |
| `scripts/pwa-assets.config.mjs` | config | author-time batch | No `scripts/` directory; RESEARCH.md Code Examples 7 |
| `docs/PWA.md` | docs | n/a | No `docs/` directory or README; content set by D-16 |

## Metadata

**Analog search scope:** `src/`, `public/`, `.github/workflows/`, root config files (tracked files only, via `git ls-files`)
**Files scanned:** 10 tracked source/config files (App.jsx lines 305-480 plus its import line, main.jsx, both tests, vite.config.js, index.html, deploy.yml)
**Pattern extraction date:** 2026-09-30
