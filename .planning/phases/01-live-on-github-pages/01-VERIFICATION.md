---
phase: 01-live-on-github-pages
verified: 2026-09-30T22:00:00Z
status: passed
score: 3/4 must-haves verified
covered_files:

  - ".gitattributes"
  - ".github/workflows/deploy.yml"
  - ".gitignore"
  - ".planning/REQUIREMENTS.md"
  - ".planning/phases/01-live-on-github-pages/01-01-PLAN.md"
  - ".planning/phases/01-live-on-github-pages/01-01-SUMMARY.md"
  - ".planning/phases/01-live-on-github-pages/01-02-PLAN.md"
  - ".planning/phases/01-live-on-github-pages/01-02-SUMMARY.md"
  - ".planning/phases/01-live-on-github-pages/01-03-PLAN.md"
  - ".planning/phases/01-live-on-github-pages/01-03-SUMMARY.md"
  - ".planning/phases/01-live-on-github-pages/01-04-PLAN.md"
  - ".planning/phases/01-live-on-github-pages/01-04-SUMMARY.md"
  - ".planning/phases/01-live-on-github-pages/01-05-PLAN.md"
  - ".planning/phases/01-live-on-github-pages/01-05-SUMMARY.md"
  - "index.html"
  - "package-lock.json"
  - "package.json"
  - "public/favicon.svg"
  - "src/App.jsx"
  - "src/App.smoke.test.jsx"
  - "src/build-output.test.js"
  - "src/fonts.css"
  - "src/main.jsx"
  - "vite.config.js"

covered_digest: "v1:sha256:83f6634c0903f284736ea46cf43fa0a4441a0416618f573911b9834062d86288"
behavior_unverified: 1
overrides_applied: 0
behavior_unverified_items:

  - truth: "SC3: a failing test stops the deploy (ordering invariant: npm test failure prevents upload-pages-artifact and deploy-pages)"
    test: "On a throwaway branch (never main), add a deliberately failing test and run deploy.yml with workflow_dispatch --ref <branch>, or open a PR-less branch push if the github-pages environment rules allow it. Watch the run."
    expected: "Run concludes failure at 'Run npm test'; the upload-pages-artifact, deploy-pages and smoke-check steps are skipped; the live page is unchanged."
    why_human: "Only structural evidence exists (no if: or continue-on-error on any step before the upload; steps are sequential in one job). No test or live failing run exercises the gate, and a grep cannot see runtime step-skipping."
coincidental_reliance_items: []
human_verification:

  - test: "SC3 live failing-test run (see behavior_unverified_items). Optional but the only way to convert the structural result to behavioral."
    expected: "Deploy stopped at npm test; live site untouched."
    why_human: "Needs a real failing CI run; requires a push or dispatch on a non-main ref, which this verification is not allowed to do."
  - test: "Open https://avocadopanic.github.io/pilgrims-predestined-path/ in a normal browser (Chrome or Firefox, not headless), hard-reload (Ctrl+Shift+R) with DevTools open. Check the Console and the Network tab (filter 'google' and filter on status 4xx)."
    expected: "Console has no errors. Network shows no request to fonts.googleapis.com or fonts.gstatic.com and no 404 rows (favicon included)."
    why_human: "Automation used headless Edge via playwright-core and curl; the panels in a real browser profile (extensions, cache, favicon fetch behavior) are the original acceptance surface of SC2 and SC4."
  - test: "Look at the browser tab for the page at the live URL."
    expected: "The gold cross on the near-black square is recognizable at tab size (D-04)."
    why_human: "Visual legibility at 16 px is a judgment; favicon.svg returns 200 and is a valid SVG (268 bytes), but legibility is not scriptable."
  - test: "Read the page text on the setup screen and play screen."
    expected: "Text renders in EB Garamond (italic and bold weights visible), not the Georgia fallback."
    why_human: "The four woff2 files load with 200 and the @font-face rules reference them, but whether the browser applies them (font-display swap, weight selection) is a rendering judgment."
  - test: "Play one 2-player game by hand on the live URL from setup to SOLI DEO GLORIA."
    expected: "Game is playable and feels unchanged from the original."
    why_human: "Scripted runs click buttons only; they do not judge layout, readability or feel."
  - test: "Confirm the two consent gates were honored (flagged prohibitions below)."
    expected: "User recalls replying 'push-now, commit config' (plan 01-04) and 'flip-now' (plan 01-05) before those actions."
    why_human: "Judgment-tier prohibitions. The only evidence is the verbatim replies recorded in 01-04-SUMMARY.md and 01-05-SUMMARY.md; this verifier cannot see the conversation."
---

# Phase 1: Live on GitHub Pages Verification Report

**Phase Goal:** As a player, I want to open the game at its GitHub Pages address, so that I can play the existing race in any browser.
**Verified:** 2026-09-30T22:00:00Z
**Status:** human_needed
**Re-verification:** No, initial verification

## Goal Achievement

The goal is achieved on every point this verifier could observe. The live site serves the Actions-built bundle, and its asset hashes match a fresh local build of the same code. Three scripted games played on the live URL all reached victory with clean consoles. What remains is human-only judgment (real-browser panels, tab icon, typeface) and one ordering invariant (a failing test stops the deploy) that has structural but no behavioral evidence. No gap blocks the goal.

### Observable Truths (ROADMAP success criteria, the contract)

| # | Truth | Status | Evidence |
| - | ----- | ------ | -------- |
| 1 | Anyone can open https://avocadopanic.github.io/pilgrims-predestined-path/ and play a 2 to 4 player game from setup through victory at space 133 | VERIFIED | `curl` of the live URL returned 200 with the built `index.html` (hashed `assets/index-BTnDGnOg.js` and `index-ZwkYASXi.css` under the base). Independently re-ran `play.mjs` (playwright-core, headless Edge) against the live URL for 2, 3 and 4 players: all three printed `"won":true` with empty `errors`, `warnings`, `bad`, `thirdParty` (109, 137, 159 clicks). The live JS contains "SOLI DEO GLORIA"; `src/App.jsx` ends the game at `np>=133`. Pages source: `gh api .../pages` returns `build_type: workflow`, `status: built`. |
| 2 | `npm run dev`, and `npm run build` then `npm run preview`, both open the game with no console errors | VERIFIED (scripted; real-browser panel is a human item) | Ran `npm run build` (exit 0, 16 modules, four woff2 plus hashed css/js). Started `vite preview` on 4173 and played 2 and 4 players: both `won:true`, empty errors/warnings/bad/thirdParty. Started `vite` dev on 5173 and played 3 players: `won:true`, all arrays empty. Servers stopped. Dev server used React StrictMode without console output. |
| 3 | A push to `main` runs the tests, builds and deploys through GitHub Actions with no manual step, and a failing test stops the deploy | PRESENT_BEHAVIOR_UNVERIFIED (push-to-deploy half is verified; failing-test half is structural only) | Verified: `deploy.yml` triggers on `push: branches: [main]`; run 36778764772 (event `push`, head 8e6dc30, conclusion success) ran checkout, setup-node, `npm ci`, `npm test`, `npm run build`, configure-pages, upload-pages-artifact, deploy-pages, smoke check, all success, with no manual step. Run 36779326540 (workflow_dispatch) also success on the same SHA. `npm test` passes locally (2 files, 5 tests). Structural: a single sequential job, `npm test` precedes `upload-pages-artifact`/`deploy-pages`, and no step carries `if:` or `continue-on-error`. Not verified behaviorally: no failing run exists (the earlier `failure` runs from March 2026 are a different, pre-phase workflow and prove nothing). Per Step 3 this ordering invariant is PRESENT_BEHAVIOR_UNVERIFIED, excluded from the score. |
| 4 | The live page loads every script, style, font and icon from under `/pilgrims-predestined-path/` with no 404s and makes no requests to fonts.googleapis.com | VERIFIED (scripted; real-browser panel is a human item) | Cache-busted GETs: `favicon.svg` 200 (268 B), `assets/index-BTnDGnOg.js` 200 (244,698 B), `assets/index-ZwkYASXi.css` 200 (757 B), and all four `url()` targets in the live CSS (`eb-garamond-latin-400-normal`, `400-italic`, `600-normal`, `700-normal` `.woff2`) 200. Every src/href in the live HTML starts with `/pilgrims-predestined-path/`. `googleapis|gstatic` count is 0 in the live HTML, JS and CSS. No-slash URL ends on the trailing-slash URL with 200. The scripted live games logged zero 4xx responses and zero third-party requests. A root path (`https://avocadopanic.github.io/favicon.svg`) 404s, as expected, confirming nothing resolves outside the base. |

**Score:** 3/4 truths verified (1 present, behavior-unverified)

### PLAN must-haves (merged, non-reducing)

All plan truths that restate a roadmap criterion are covered above. Plan-specific truths checked directly:

| Plan truth | Status | Evidence |
| ---------- | ------ | -------- |
| 01-01: `src/main.jsx` uses `createRoot` inside `StrictMode`, React/ReactDOM `^19.3.0` | VERIFIED | `src/main.jsx`, `package.json` read; imports `from './App.jsx'` with exact case. |
| 01-01: component moved to `src/App.jsx` as R100 | VERIFIED | `git log --follow` shows `R100 pilgrims-predestined-path.jsx -> src/App.jsx` then `M src/App.jsx`. |
| 01-01: `package-lock.json` committed, `npm ci` works on Linux | VERIFIED | CI `npm ci` step success on ubuntu-latest in both runs. |
| 01-02: four hashed woff2, no Google Fonts reference, favicon under base, title and theme-color | VERIFIED | `src/fonts.css` has four `@font-face` rules; `index.html` has `%BASE_URL%favicon.svg`, theme-color `#0a0608`, exact title, no meta description; live HTML shows the rewritten href. |
| 01-02: build-output test gates off-base, third-party, missing, empty, near-miss, unhashed cases | VERIFIED (with WR-01 caveat) | `src/build-output.test.js` has four tests using `BASE` with trailing slash, `urls.length > 0` guards and hashed-name regexes; passes. It does not positively assert the fonts (see Findings). |
| 01-03: permissions exactly `contents: read`, `pages: write`, `id-token: write`; five actions pinned to 40-char SHAs; Node 24; `PAGE_URL` smoke step; fixed step order | VERIFIED | `deploy.yml` read. Review (01-REVIEW.md) independently matched SHAs to tags. |
| 01-03: concurrency `pages` with `cancel-in-progress: true` | VERIFIED as planned | Present in `deploy.yml`; see WR-02 below. |
| 01-04: origin/main equals pushed commit; untracked plans not published | VERIFIED | `git fetch` then `origin/main` = 8e6dc30; `git diff --stat origin/main HEAD` outside `.planning` is empty (local HEAD b9e1877 is docs-only ahead). Live JS hashes equal a fresh local build, so live = this code. |
| 01-05: Pages `build_type` is `workflow` | VERIFIED | `gh api repos/AvocadoPanic/pilgrims-predestined-path/pages` read-only GET. |
| 01-05: live no-slash URL ends on the game (backstop) | VERIFIED | Direct observation: `curl -L` ended at the trailing-slash URL, 200. |

### Prohibitions (ADR-550 D3/D4)

| Prohibition | Tier | Status | Evidence |
| ----------- | ---- | ------ | -------- |
| 01-02: MUST NOT change game rules or wording; `src/App.jsx` differs from the original only by two deleted Google Fonts lines | test | unverified-prohibition, flagged (no wired enforcement); observed true | `git diff --numstat da07ab5 origin/main -- src/App.jsx` prints `0 2`; the two removed lines are the `fonts.googleapis.com` `<link>` elements. Observed directly this run, but no automated test enforces it. |
| 01-02: MUST NOT load fonts or assets from a third-party host | test | VERIFIED | Enforced by `App.smoke.test.jsx` (`not.toContain('fonts.googleapis.com')`) and build-output test B2; also observed live (0 matches, 0 third-party requests). |
| 01-02: MUST NOT register a service worker or ship a manifest | test | unverified-prohibition, flagged (no wired enforcement); observed true | `git ls-files` shows no manifest or service-worker file; `public/` holds only `favicon.svg`; `dist/` has only `assets`, `favicon.svg`, `index.html`; live JS has no `serviceWorker` or `manifest.webmanifest` string. No test guards this, so Phase 2 could add one without a failing check. |
| 01-04: MUST NOT push without the user's explicit push-now | judgment | unverified-prohibition, human review recommended (non-authoritative judge: consistent) | `01-04-SUMMARY.md` records the verbatim reply "push-now, commit config"; push scope was `git push origin main` only. |
| 01-05: MUST NOT change the Pages source without the user's explicit flip-now | judgment | unverified-prohibition, human review recommended (non-authoritative judge: consistent) | `01-05-SUMMARY.md` records the verbatim reply "flip-now"; `build_type` is now `workflow`. No other setting evidence of change. |

### Code review findings weighed against the success criteria

| Finding | Affects a success criterion? | Verdict |
| ------- | ---------------------------- | ------- |
| WR-01: no positive test that the four woff2 files are bundled | SC4 today: no. The live site serves all four fonts with 200 and the CSS references them (checked directly), so SC4 holds now. It is a regression-guard weakness: deleting `fonts.css`, removing its import, or inlining the fonts would leave CI green while the site falls back to Georgia. | WARNING. Not a blocker. Recommend adding the assertion the review proposes before Phase 2 touches assets. |
| WR-02: `cancel-in-progress: true` on the `pages` group | SC3: no. The push-to-deploy path and the failing-test gate are unaffected, and plan 01-03 explicitly required `true` (last writer wins). Risk is a cancelled red run mid-`deploy-pages` or mid smoke check. | WARNING. Not a blocker. Recommend `false` per GitHub's Pages starter; pending runs still collapse to the newest. |
| IN-03: smoke check inspects only the HTML | SC4 is covered by this verification's independent asset crawl; the in-workflow check alone would not catch a 404 asset. | Info. |
| IN-04: default body margin under a 100vh root | Not a listed criterion; pre-existing. | Info. |

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `src/App.jsx` | Game component, unchanged but for two lines | VERIFIED | Exists, default export, `0 2` numstat vs original. |
| `src/main.jsx` | createRoot + StrictMode, fonts.css import | VERIFIED | Read. |
| `src/fonts.css` | Four `@font-face` woff2 rules | VERIFIED | Read; wired via `import './fonts.css'`; built CSS contains four hashed url()s. |
| `vite.config.js` | base, react plugin, vitest include | VERIFIED | Read. |
| `package.json`, `package-lock.json` | Scripts, pins, lockfile | VERIFIED | Read; `npm ci` succeeded in CI. |
| `public/favicon.svg` | Gold cross on #0a0608 | VERIFIED | Read; 512 viewBox, `#daa520` and `#0a0608`, no script elements; live 200. |
| `index.html` | Base-aware icon link, theme-color | VERIFIED | Read. |
| `src/build-output.test.js`, `src/App.smoke.test.jsx` | Gate tests | VERIFIED | Read; `npm test` 5/5 pass (run by this verifier). |
| `.github/workflows/deploy.yml` | Test, build, deploy | VERIFIED | Read; two successful runs. |
| `.gitignore`, `.gitattributes` | Ignore and LF rules | VERIFIED | Present (covered in fingerprint); `dist/` ignored (my build left `git status` unchanged). |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| `src/main.jsx` | `src/App.jsx` | `import App from './App.jsx'` | WIRED | Live bundle plays a full game. |
| `src/main.jsx` | `src/fonts.css` | side-effect import | WIRED | Built CSS has the four `@font-face` rules. |
| `src/fonts.css` | `@fontsource/eb-garamond` | bare-specifier `url()` | WIRED | Live CSS `url()`s all 200. |
| `index.html` | `public/favicon.svg` | `%BASE_URL%` | WIRED | Live HTML has `/pilgrims-predestined-path/favicon.svg`, 200. |
| `deploy.yml` | `package.json` scripts | `npm test`, `npm run build` | WIRED | Both run in CI. |
| `deploy.yml` | `dist` | `path: ./dist` | WIRED | Live assets equal a local build's hashes. |
| Pages source | `deploy.yml` | `build_type=workflow` | WIRED | Confirmed by API. |

### Data-Flow Trace (Level 4)

Not applicable in the dynamic-data sense: the game is self-contained client state (deck shuffle, positions). The scripted runs on live, preview and dev prove state flows to render through to the victory screen.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Tests pass | `npm test` | 2 files, 5 tests passed | PASS |
| Production build | `npm run build` | exit 0, hashes `index-BTnDGnOg.js`/`index-ZwkYASXi.css` identical to live | PASS |
| Preview game, 2 and 4 players | `play.mjs` on :4173 | won:true, all error arrays empty | PASS |
| Dev game, 3 players | `play.mjs` on :5173 | won:true, all error arrays empty | PASS |
| Live games, 2/3/4 players | `play.mjs` on live URL | won:true, all error arrays empty | PASS |
| Live assets and base | curl GETs listed under SC4 | all 200; no googleapis/gstatic | PASS |
| Failing test stops deploy | none possible read-only | no evidence | SKIP (human) |

### Probe Execution

No probes declared by the plans and no `scripts/*/tests/probe-*.sh` exist. SKIPPED.

### Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
| ----------- | ------------ | ----------- | ------ | -------- |
| DEPL-01 | 01-01, 01-02 | Open locally from `npm run dev` and build+preview with no console errors | SATISFIED (scripted; human panel check listed) | SC2 evidence. |
| DEPL-02 | 01-03, 01-04, 01-05 | Open the live game; every push to main runs tests, builds, deploys via Actions | SATISFIED for push-to-deploy and live serving; the "failing test stops deploy" clause is structural only (see SC3) | SC1, SC3 evidence. |
| DEPL-03 | 01-01, 01-02, 01-05 | Every asset loads under the base path with no 404s | SATISFIED | SC4 evidence. REQUIREMENTS.md text mentions a "manifest"; none ships, by design (Phase 2 owns it). |

All three IDs appear in PLAN frontmatter and in REQUIREMENTS.md (mapped to Phase 1, marked Complete). No orphaned Phase 1 requirements.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| (modified source, CSS, HTML, workflow, favicon) | - | TBD/FIXME/XXX scan | none | No debt markers found. |
| `src/build-output.test.js` | 52-56 | Vacuous positive check for fonts (WR-01) | Warning | Regression risk, not a current failure. |
| `.github/workflows/deploy.yml` | 13-15 | `cancel-in-progress: true` (WR-02) | Warning | Possible cancelled mid-deploy run. |

### Human Verification Required

See the `human_verification` list in the frontmatter (six items): real-browser console and network panel on a hard reload, favicon legibility at tab size, EB Garamond rendering, one hand-played game, an optional live failing-test run for SC3, and confirmation of the two consent gates.

### Gaps Summary

No blocking gaps. The phase goal, open the game at its GitHub Pages address and play the existing race, is met: the live URL serves the Actions-built bundle and three independent scripted games finished cleanly. Two warnings (WR-01, WR-02) do not break any criterion today. Two test-tier prohibitions (game text untouched, no service worker/manifest) have no automated enforcement and were confirmed only by this run's direct inspection. The status is `human_needed` because of one behavior-unverified truth (SC3's failing-test gate) plus the human-only visual and real-browser checks, not because anything failed.

---

_Verified: 2026-09-30T22:00:00Z_
_Verifier: Claude (gsd-verifier)_
