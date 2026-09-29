# Technology Stack

**Project:** The Pilgrim's Predestined Path (static React + Vite board game on GitHub Pages)
**Researched:** 2026-09-29
**Mode:** Ecosystem (stack dimension), subsequent milestone
**Overall confidence:** HIGH for tooling, deploy and PWA (executed in a scratch build); iOS PWA behavior MEDIUM to LOW; MEDIUM for Bible license interpretation (legal text read, but not legal advice); HIGH for primary-source availability

How to read the confidence tags: HIGH = read from the official registry, repo or publisher page during this session. MEDIUM = read from an official page but the conclusion is my interpretation. LOW = could not verify. "(inferred)" marks anything I reasoned to rather than read.

## Recommended Stack

### Core Framework and Build

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js (CI and local) | 24.x, pinned (`node-version: 24`) | Build and test runtime | Vitest 5 requires `^22.12.0 \|\| ^24.0.0 \|\| >=26`; Vite 8 requires `^20.19.0 \|\| >=22.12.0`, so Node 20 is out. Node 24 is Active LTS until 2026-10-20, then Maintenance to 2028-04-30; Node 26 becomes LTS 2026-10-28. Do NOT use `lts/*` in CI: it will silently flip from 24 to 26 a month from now. Local machine already runs v24.15.0. HIGH (npm engines fields, nodejs/Release schedule.json) |
| Vite | ^8.3.1 (latest, published 2026-09-24) | Dev server and bundler | Current major. Vite 8 replaces esbuild/Rollup with Rolldown/Oxc. The existing `vite ^3` is five majors behind and is not compatible with current plugin-react. `base: '/pilgrims-predestined-path/'` stays as is (matches Vite's own GitHub Pages guide). HIGH |
| @vitejs/plugin-react | ^6.1.1 | JSX transform (automatic runtime), Fast Refresh | Peer dependency is `vite ^8`. Fixes the "React is not defined" risk noted in CONCERNS.md. Use this, not `@vitejs/plugin-react-swc` (4.3.3), which is the Vite 7-era route. HIGH |
| React and react-dom | ^19.3.0 (latest, 19.x) | UI | See "React 18 vs 19" below. Upgrade now. HIGH |

**React 18 vs 19: upgrade.** Verified against the code: `pilgrims-predestined-path.jsx` imports only hooks (`useState, useEffect, useRef, useCallback, useMemo`) and uses none of the APIs React 19 removed (`ReactDOM.render`, `defaultProps` on function components, `propTypes`, string refs, `findDOMNode`, legacy context). There is no lockfile and nothing installed, so an upgrade costs zero migration work today and avoids a forced upgrade later. `src/main.jsx` must move to `createRoot` under either version. I ran a trial install and `vite build` in a scratch copy with React 19.3.0 (see "Verified trial build"). Staying on 18 is defensible but has no upside. HIGH for the compatibility claim on this codebase; the 19 removal list is from training knowledge (MEDIUM), but the trial build and the hooks-only import line are evidence.

### Testing and Content Validation

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vitest | ^5.0.2 (latest, published 2026-09-25) | Unit tests for game logic AND content validation | Shares Vite config and transform, so no separate Jest/Babel setup. Requires Vite >=6.4 and Node >=22.12 (both met). Default `node` environment is right for pure logic. I ran a smoke test on Vite 8.3.1 + Vitest 5.0.2 + Zod 4.6.5: passes. HIGH |
| Zod | ^4.6.5 | Schema for authored content | devDependency only. Import it from tests and scripts, never from `src/` runtime code, so it is not in the shipped bundle. Gives precise error paths ("questions[12].citations[1].locator: Required"). HIGH (registry, smoke test) |
| @testing-library/react | NOT now | Component tests | Not warranted for this milestone. The risk is in game rules and content accuracy, not widget wiring. If a render smoke test is wanted later: `@testing-library/react` 16.3.3 + `@testing-library/dom` ^10 + `jsdom` 30.x, one test that renders `<App />` and clicks Start. HIGH that it works with React 19 (peer range `^18 \|\| ^19`); recommendation to defer is my judgment |

### Hosting and Deploy

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| GitHub Pages, source = "GitHub Actions" | (repo setting) | Static hosting | Vite's official guide says to select Settings > Pages > Source > GitHub Actions because Vite needs a build step. Repo is currently `build_type: legacy` (verified via `gh api repos/AvocadoPanic/pilgrims-predestined-path/pages`). HIGH |
| actions/checkout | v7 (v7.0.1, 2026-07-20) | Checkout | Current per GitHub releases API and Vite's own sample. HIGH |
| actions/setup-node | v7 (v7.0.0, 2026-07-14) | Node + npm cache | Same. HIGH |
| actions/configure-pages | v6 (v6.0.0, 2026-03-25) | Pages metadata | Same. Runs on `node24`. Optional for a hard-coded `base`, but Vite's sample includes it; keep for parity. HIGH |
| actions/upload-pages-artifact | v5 (v5.0.0, 2026-04-10) | Package `./dist` | Default `path` is `_site/`, so `path: ./dist` MUST be set. Dotfiles are excluded by default. HIGH |
| actions/deploy-pages | v5 (v5.0.1, 2026-09-01) | Publish artifact | Needs `pages: write` and `id-token: write`. HIGH |
| gh-pages (npm) | REMOVE | | See below. |

**Drop the `gh-pages` npm package and the `deploy` script.** Reasons: (1) with Source = GitHub Actions, Pages ignores any `gh-pages` branch; (2) two deploy paths that disagree are the current bug; (3) `gh-pages ^4` is stale (6.3.0 is current); (4) it needs push credentials on a dev machine. No `gh-pages` branch exists on the remote today (`git branch -a` shows only `main`), so there is nothing to clean up. HIGH.

**Reference workflow** (mirrors Vite's official `static-deploy-github-pages.yaml`, verified from vitejs/vite `main`; adds a test gate and pins Node 24). Actions are shown by tag; Vite's sample pins full SHAs, which is the stricter option if you want it:

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
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test            # content validation + game logic gate the deploy
      - run: npm run build
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v5
```

**Repo setting change** (needs the user's go-ahead per PROJECT.md; it changes what is live):
- UI: Settings > Pages > Build and deployment > Source > "GitHub Actions".
- CLI equivalent, verified against GitHub's REST schema (`build_type` enum `legacy | workflow`): `gh api -X PUT repos/AvocadoPanic/pilgrims-predestined-path/pages -f build_type=workflow`. I did NOT run it. HIGH that the field exists; not executed.
- Order: land the fixed workflow and a building app first, flip the setting, then re-run the workflow (`workflow_dispatch`). Flipping first leaves the live URL serving nothing until a run succeeds (inferred).

**`npm ci` needs a committed `package-lock.json`.** The repo has none. Run `npm install` once and commit the lockfile, or the first CI run fails. Also add a `.gitignore` (`node_modules/`, `dist/`, `.env*`, `scripts/.cache/`). HIGH.

### Styling (not asked, but the responsive requirement forces the decision)

| Technology | Purpose | Why |
|------------|---------|-----|
| Plain CSS files (imported in JSX), with CSS custom properties, `clamp()`, `dvh`/`svh` units, `@media (min-width)` and `@media (orientation)` | Phone portrait plus projector layout | The current code uses inline `style={{}}` everywhere, and inline styles cannot express media queries or `:focus-visible`. Vite supports plain CSS and CSS Modules with zero config. Do not add Tailwind or a CSS-in-JS library for a 500-line game. Vite 8's default `build.target` is Baseline Widely Available (Safari 16.4+, Chrome 111+), fine for phones and current projectors' browsers. MEDIUM (design judgment; Vite target change is in the official v8 migration guide, HIGH) |

## Minimal package.json Changes to Get a Clean Build

Verified by trial: copied the repo files to a scratch directory, applied the changes below, ran `npm install` (0 vulnerabilities) then `npm run build`: 15 modules transformed, `dist/index.html` + one 245 kB JS bundle (76 kB gzip), built in under 1 s. HIGH.

```jsonc
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
    // "deploy": REMOVED
  },
  "dependencies": { "react": "^19.3.0", "react-dom": "^19.3.0" },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.1.1",
    "vite": "^8.3.1",
    "vitest": "^5.0.2",
    "zod": "^4.6.5"
    // "gh-pages": REMOVED
  }
}
```

Non-package changes required for the same clean build (the trial used exactly these):
1. `vite.config.js`: add `import react from '@vitejs/plugin-react'` and `plugins: [react()]`; keep `base`.
2. `git mv pilgrims-predestined-path.jsx src/App.jsx` (it already has `export default function App`, verified at line 308).
3. `src/main.jsx`: `createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)` from `react-dom/client`; import `./App.jsx`.
4. `index.html` links `/vite.svg`, which does not exist (no `public/` directory). Add a favicon or delete the `<link>` to avoid a 404 in the console. Minor.
5. Later, once tests exist, add `test: { include: ['src/**/*.test.js', 'scripts/**/*.test.js'] }` to `vite.config.js`.

## Content Storage and Validation

**Recommendation: plain JS modules for authored content, JSON for verse text, Zod schema enforced by Vitest.** Not MDX, not YAML.

| Option | Verdict | Why |
|--------|---------|-----|
| JS modules (`src/content/questions/*.js` exporting arrays) | USE for questions, quips, answers, citations, quiz items | Allows comments (authoring notes, verification notes), template literals for multi-line text, trailing commas, and no build plugin. Tree-shakes and needs no runtime parser. One file per topic (assurance, prayer, election, atonement, ...) keeps diffs reviewable. |
| JSON (`src/content/verses/{bsb,kjv,esv,net}.json`) | USE for verse text only | Machine-generated by a script, never hand-edited, so JSON's strictness is a feature. Vite imports JSON natively. |
| YAML | Do NOT use | Nicer for long prose, but needs `yaml`/`js-yaml` plus a Vite plugin (compatibility with Vite 8 unverified) and its implicit typing (`no`, `1.10`, `on`) can silently corrupt reference strings. |
| MDX | Do NOT use | The content is structured records (quip / answer / deeper / citations / quiz), not free-form documents. MDX adds a compiler and React-component-in-content coupling for nothing. |
| Headless CMS or runtime fetch of content | Do NOT use | Static site, no server; content must be diffable and testable in git. |

**Question record shape** (Zod-validated; illustrative, the shape is a recommendation not a verified standard):

```js
{
  id: 'why-pray',
  space: 'sea-of-providence',      // fixed spaces reference a board space id; pool questions omit it
  quip: '...',
  answer: '...',                   // 2 to 3 sentences
  deeper: '...',
  verses: ['ROM.8.28', ['MAT.6.9', 'MAT.6.13']],   // ids or [start, end] ranges; text comes from the translation files
  sources: [{ work: 'wcf', locator: '3.1', quote: '...', translation: 'Schaff 1877 (1647 text)', url: '...', verifiedOn: '2026-10-01' }],
  quiz: { prompt: '...', choices: ['...', '...', '...'], correct: 1 },
}
```

**What the tests must assert (these are the "broken references fail the build" gates):**
1. Every question passes the Zod schema (`.strict()` so typos in field names fail; quip/answer/deeper non-empty; quiz has 3 or 4 choices and `correct` is in range).
2. IDs are unique; every `space` id exists in the board's space table; every fixed board space has a question; pool size >= (number of generic question spaces) so "no repeats within a game" is satisfiable.
3. Every verse id used anywhere exists in ALL four translation files (fail rather than fall back silently; see verse-numbering pitfall in PITFALLS).
4. Every `sources[].work` is in a registry of allowed primary sources, each entry with `translation`, `publicDomain: true`, and `url`; every quote carries `verifiedOn`.
5. License caps: ESV unique verse count <= 500 (hard gate); NET count reported and held to the same cap as policy; ESV words < 25% of total authored words (my reading of the "25% of the work" rule, MEDIUM).
6. A translation registry test: each translation has `name`, `attribution` string, `url`, and `license` fields non-empty, so the UI cannot render a translation without its notice.

**Quote verification as a script, not just a schema.** Zod proves shape, not truth. Add `scripts/verify-quotes.mjs` (run by hand and before releases, not in the deploy gate, to avoid network flakiness): download the plain-text editions listed under "Primary Sources" into `scripts/.cache/` (gitignored), normalize whitespace and curly quotes, split each authored `quote` on ellipses, and assert each fragment is a substring of the cited work. I demonstrated the technique by hand: the setup screen quote ("God preordained, for his own glory and the display of His attributes of mercy and justice ... to eternal damnation", attributed to Calvin, Institutes III.21.5) does NOT appear in the Beveridge text on CCEL (grep for "display of his attributes", "without any merit of their own" in context, and "preordained" finds no match for that sentence). Beveridge's actual III.21.5 reads "By predestination we mean the eternal decree of God, by which he determined with himself whatever he wished to happen with regard to every man. All are not created on equal terms, but some are preordained to eternal life, others to eternal damnation..." HIGH (CCEL text file, grep). The setup-screen quote must be replaced or re-attributed; it reads like a summary from a later author, not Calvin (inferred).

## Bible Text: Sources, Formats, Licensing

**Overall approach: bundle, do not fetch at runtime.** Extract only the verses the game cites (author-time script `scripts/build-verses.mjs`), commit the JSON, and load the chosen translation lazily with dynamic `import()`. Reasons: works offline in a classroom or on a projector with bad Wi-Fi; no keys shipped; text is diffable in git; the ESV and NET caps are enforceable by a test. Estimated size: roughly 300 verses x 4 translations, well under 200 kB uncompressed (inferred from ~150 bytes per verse).

| Translation | Status | Bundleable? | Source to pull from | Format |
|-------------|--------|-------------|---------------------|--------|
| BSB | Public domain, dedicated 2023-04-30 ("Licensing is not required for any use", berean.bible/licensing.htm). File header: "This text of God's Word has been dedicated to the public domain." | Yes, in full or excerpt | `https://bereanbible.com/bsb.txt` (verified 200, 4.3 MB, updated 2026-07-31). Also USFM/USJ/USX from https://berean.bible/downloads.htm | Tab-separated: `Genesis 1:1<TAB>text`, curly quotes. Easiest parse of all four. |
| KJV | Public domain outside the UK. UK: Crown letters patent (Cambridge UP, Oxford UP, Collins) give exclusive rights to PRINT or import printed copies in the UK. | Yes (US-hosted static site; UK patent concerns print, low risk, inferred) | `https://ebible.org/Scriptures/eng-kjv_usfm.zip` (verified 200, 2.7 MB; 1769 text, with Apocrypha). Copyright page: https://ebible.org/kjv/copr.htm. Cross-check: `https://bible-api.com/romans+8:28?translation=kjv` (works, JSON) | USFM. bible-api.com text contains stray `\n` mid-verse; normalize whitespace. |
| ESV | Copyrighted, Crossway. Standard guidelines at https://www.crossway.org/permissions/ (read raw): quote up to 500 verses without a license, provided the quotes are not more than one-half of any one book, are not 25% or more of the total text of the work, and are not "in a commentary or other biblical reference work". | Yes, within caps, no license needed | The API https://api.esv.org/ (needs a key) used ONCE at author time, or copy from esv.org by hand. Never call it from the browser. | API returns plain text or HTML. |
| NET | Copyrighted, Biblical Studies Press. https://netbible.com/?p=530 (page dated 2026-04-16): text WITHOUT NET notes may be quoted "in any form" for non-commercial publication without written permission. | Yes for a free, non-commercial game | `https://labs.bible.org/api/?passage=Romans%208:28&type=json` (verified working, `Access-Control-Allow-Origin: *`; use at author time, not runtime, because "labs" carries no uptime promise). Bulk downloads at bible.org/downloads returned 403 to my fetcher: unverified. | JSON array of `{bookname, chapter, verse, text}`; trailing spaces. |

**Required notices and links (implement as data in the translation registry so the UI cannot omit them):**
- **ESV.** Verbatim from Crossway's permissions page: "Scripture quotations are from the ESV(R) Bible (The Holy Bible, English Standard Version(R)), (c) 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated in whole or in part into any other language. Used by permission. All rights reserved." Label each quotation "ESV". Link to https://www.esv.org (the API terms require it on each page using the text; adopt it regardless). Re-check the "ESV Text Edition" year when building; it changes. HIGH that this is the current published wording; MEDIUM on which of Crossway's two alternative notices applies to a web app (the API page offers a variant ending "Users may not copy or download more than 500 verses of the ESV Bible or more than one half of any book of the ESV Bible", which is designed for sites that let users copy text; use the longer variant to be safe).
- **NET.** After each quotation put "(NET)"; for internet apps, hyperlink "NET" to http://netbible.org (page text, HIGH). Copyright acknowledgment: "Scripture quoted by permission. Quotations designated (NET) are from the NET Bible(R) copyright (c)1996, 2019 by Biblical Studies Press, L.L.C. http://netbible.com All rights reserved." HIGH that this is on the page; the page says "may not be bundled with anything sold", so the game must stay free and unsold.
- **BSB.** No notice legally required. Courtesy line: "Berean Standard Bible, public domain, https://berean.bible". (The requested link satisfies the project's "link and attribution" requirement.)
- **KJV.** No notice required in the US. Courtesy line: "King James Version (1769 text), public domain in the US; Crown patent applies to printing in the UK" with a link to https://ebible.org/kjv/copr.htm.

**ESV API and the "public key" concern.** Crossway's API page (https://api.esv.org/) says the service "requires that you have access to a programming language on your web server", forbids you to "sell, share, or publish your access key", limits you to 5,000 queries/day, 1,000/hour, 60/minute, and lets you cache at most 500 verses. Conclusion: shipping a key in client JS violates the terms and would also burn the shared quota; a purely static site should not call the API at runtime at all. Using the API once at author time to build a committed JSON of at most 500 verses stays inside the cache cap (MEDIUM: the cap is written for caching, not for bundling; the same 500-verse ceiling appears in the permissions guidelines, which do allow bundling in a published work). The API is also restricted to "non-commercial" use consistent with a stated statement of faith; a free church-teaching game fits (inferred).

**Risks to flag to the user (could not fully verify):**
1. **ESV "not in a commentary or other biblical reference work."** The "Go deeper" sections explain doctrine around verses. Whether a game counts as a commentary is a judgment call I cannot resolve from the text; if there is doubt, email licensing@crossway.org (address is on the API page). LOW on the outcome.
2. **ESV "25% of the total text of the work."** The "work" is the whole game. Keep ESV words well under 25% of all authored text; the test above approximates this. MEDIUM.
3. **NET verse cap.** A search-result summary said NET permits up to 500 verses / 25% of a work; the current netbible.com page I read states no verse count for non-commercial use. Conflict unresolved; adopt the ESV limits for NET as policy. LOW on the exact NET numeric limit.
4. **Bulk NET download and BSB/KJV "official" APIs** I did not verify beyond the URLs above.
5. **Verse-numbering and omitted verses differ across translations** (e.g. verses absent from BSB/ESV/NET but present in KJV). The "every ref exists in all four files" test surfaces these; resolve by choosing a different verse rather than special-casing (inferred).

## Primary Sources (legally reproducible, with URLs)

All URLs below returned HTTP 200 and real content when fetched on 2026-09-29. Text-file URLs are handy for `verify-quotes.mjs`.

| Work | Reproducible edition | URL | Notes |
|------|----------------------|-----|-------|
| Calvin, Institutes | Henry Beveridge, 1845 (Calvin Translation Society). Public domain (CCEL: Beveridge "died in 1863"). | Work page https://ccel.org/ccel/calvin/institutes ; plain text https://ccel.org/ccel/c/calvin/institutes/cache/institutes.txt (4.6 MB, verified) | Book/chapter/section refs (e.g. III.21.5) match the classic numbering used by Beveridge. Do NOT quote Battles (1960, Westminster John Knox) unless permission is obtained; it is still in copyright (inferred, not verified). John Allen's 1813 translation is also public domain but I did not locate a verified online text; use Beveridge. |
| Westminster Confession of Faith (1647) | Schaff, Creeds of Christendom vol. 3 (1877), English text of the 1647 edition with spelling modernized; American revisions marked in italics | https://ccel.org/ccel/schaff/creeds3 ; plain text https://ccel.org/ccel/s/schaff/creeds3/cache/creeds3.txt (4.5 MB). Section header "THE WESTMINSTER CONFESSION OF FAITH. A.D. 1647." | WCF 3.1 verified there word for word: "neither is God the author of sin, nor is violence offered to the will of the creatures, nor is the liberty or contingency of second causes taken away, but rather established." Trap: the same volume also contains a shortened Cumberland-style revision of "Chapter III" that omits sections and adds an "official explanation"; do not quote that. Schaff prints Latin alongside English, so extraction needs care. |
| Canons of Dort (1618-19) | English text of the Canons "as held by the Reformed [Dutch] Church in America" in Schaff vol. 3 | Same volume as above | This English version is ABRIDGED: positive articles only; omits the Preface, the Rejection of Errors and the Conclusion (stated in Schaff's own note). Fine for "what Dort teaches"; it cannot be used to quote what Dort rejects. A full public-domain English text with Rejections was not verified here. |
| Heidelberg Catechism (1563) | Schaff vol. 3, German and English side by side (Q1 verified: "What is thy only comfort in life and in death?") | Same volume as above | Modern editions (for example the 1988 CRC/RCA translation, the 2011 CRC edition) are copyrighted or permissions-controlled; not verified, so avoid them. |
| Augustine | Nicene and Post-Nicene Fathers, series 1 (Schaff, 1887). Public domain. | NPNF1-05 (Anti-Pelagian Writings, includes On the Predestination of the Saints and On the Gift of Perseverance): https://ccel.org/ccel/schaff/npnf105 ; text https://ccel.org/ccel/s/schaff/npnf105/cache/npnf105.txt. NPNF1-01 (Confessions): https://ccel.org/ccel/schaff/npnf101. New Advent also hosts the same translations, e.g. https://www.newadvent.org/fathers/1513.htm (On Rebuke and Grace) | Use CCEL as the citation of record (stable section anchors). |
| Luther, The Bondage of the Will | Henry Cole translation (1823 English), as published on CCEL | Work page https://www.ccel.org/ccel/luther/bondage ; text https://ccel.org/ccel/l/luther/bondage/cache/bondage.txt | The CCEL file includes a preface by Henry Atherton (Sovereign Grace Union, 20th century) that may not be public domain; quote Cole's body text only, never the preface (inferred, not verified). Do NOT quote the Packer and Johnston 1957 translation (copyrighted; not verified). Name the translator in every citation. |

Citation hygiene rule for the schema: every primary-source quote records `work`, `locator` (chapter/section or question number), `translation` (named translator and year), and `url`, so the UI can print "Calvin, Institutes III.21.5 (trans. Beveridge, 1845)".

## PWA: Installable and Offline-Capable (added 2026-09-29, new requirement)

**Recommendation: `vite-plugin-pwa` with the default `generateSW` strategy, `registerType: 'prompt'` (with a safe-moment auto-apply), all four verse files as dynamically imported JSON so Workbox precaches them, and a two-layer test (build assertions in Vitest plus a Playwright offline smoke test).** I built and ran all of this in a scratch copy (see "PWA trial results"); nothing was changed in the repo.

### Packages and compatibility

| Package | Version (npm, 2026-09-29) | Notes |
|---------|---------------------------|-------|
| vite-plugin-pwa | ^1.3.0 (latest; last modified 2026-05-05) | Peer `vite` range is `^3.1.0 \|\| ... \|\| ^7.0.0 \|\| ^8.0.0`, so **Vite 8 is explicitly supported; no alternative needed**. Node engine `>=16`. HIGH (registry, plus a clean install and build on Vite 8.3.1) |
| workbox-build, workbox-window | 7.4.1 | Both are required peers (`^7.4.1`). npm 7+ installs them automatically; the trial install pulled them in with 0 vulnerabilities. If a strict package manager is ever used, add them explicitly. HIGH |
| @vite-pwa/assets-generator | 2.0.0 is latest, but the plugin's optional peer range is `^1.0.0` (latest 1.0.x is 1.0.4) | Mismatch. Do not add it as a dependency. Use it once as a throwaway author-time command (`npx @vite-pwa/assets-generator --preset minimal-2023 public/favicon.svg`, engines `>=20.19.0`) and COMMIT the generated PNGs. If a permanent devDependency is wanted, pin `^1.0.4` to match the plugin peer. MEDIUM (I did not run the generator) |
| Playwright (only if the browser smoke test is adopted) | 1.63.0 (`playwright` and `@playwright/test`) | Dev only; see testing. HIGH (registry) |

Do NOT use `@vite-pwa/nuxt`, the Workbox CLI directly, or a hand-written service worker: `generateSW` already produces a correct precache and navigation fallback, and the game has no custom fetch logic. Use `injectManifest` only if a custom SW becomes necessary (inferred).

### Config that was verified to build

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/pilgrims-predestined-path/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        id: '/pilgrims-predestined-path/',      // my addition; the plugin did not emit an id in the trial
        name: "The Pilgrim's Predestined Path",
        short_name: 'Pilgrim Path',              // keep short for home-screen labels
        description: 'A board game of Reformed theology for the whole table.',
        theme_color: '#1a1a2e',                  // MUST match <meta name="theme-color"> in index.html
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'any',                      // phone portrait AND projector landscape; do not lock
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Only widen the default (js,css,html) if static files live in public/. NEVER drop js,css,html:
        // that causes "WorkboxError non-precached-url index.html".
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
```

### Manifest, scope and start_url under `/pilgrims-predestined-path/`

- **Verified in the trial build:** with `base: '/pilgrims-predestined-path/'` and no explicit `scope` or `start_url`, the plugin emitted `"scope":"/pilgrims-predestined-path/"` and `"start_url":"/pilgrims-predestined-path/"`, and injected `<link rel="manifest" href="/pilgrims-predestined-path/manifest.webmanifest">`. The service worker registered with scope `http://localhost:4173/pilgrims-predestined-path/`. So: do not hard-code scope or start_url; let the plugin derive them from `base`. HIGH.
- **Icon `src` values stay relative** (`pwa-192x192.png`, no leading slash); they resolve against the manifest URL, which is under the base. Files live in `public/`. HIGH (they appear in the trial precache list).
- **`<head>` links to files in `public/` written as `/favicon.svg` are rewritten with the base** (verified: became `/pilgrims-predestined-path/favicon.svg`). But a link to a file that does not exist in `public/`, such as the current `/vite.svg`, is left as a root path and 404s (the trial logged exactly that one 404). Replace it with the real favicon. HIGH.
- Required `<head>` entries for installability: viewport, title, description, `apple-touch-icon` (180x180), and a `theme-color` matching the manifest, per the vite-pwa minimal-requirements guide. HIGH.
- `id` is my addition; it gives the installed app a stable identity if `start_url` ever changes (inferred, standard manifest practice, MEDIUM). Origin caveat: all `avocadopanic.github.io/*` project sites share one origin, so keep this app's scope path-restricted (already the case). Workbox prefixes its precache name with the scope, which should avoid collisions with other project sites (inferred, MEDIUM).

### Icon set

| File | Size | Purpose | Notes |
|------|------|---------|-------|
| `favicon.ico` | 48x48 | Browser tab | From the `minimal-2023` preset; register `<link rel="icon" href="/favicon.ico" sizes="48x48">` plus the SVG |
| `favicon.svg` | vector | Modern tabs | Also the source image for the generator |
| `pwa-64x64.png` | 64 | Windows/Edge | Suggested by the generator docs |
| `pwa-192x192.png` | 192 | Manifest, REQUIRED | Chrome installability |
| `pwa-512x512.png` | 512 | Manifest `purpose: any`, REQUIRED | Splash and listings |
| `maskable-icon-512x512.png` | 512 | Manifest `purpose: maskable` | Full-bleed art with the important artwork inside the central safe zone (commonly cited as a circle of radius 40% of the icon size; from web.dev, not re-fetched: MEDIUM). Declare it as a separate icon, not `purpose: "any maskable"`; the vite-pwa docs advise avoiding the combined value |
| `apple-touch-icon-180x180.png` | 180 | iOS Home Screen icon | Opaque, no transparency (iOS fills transparent pixels with black; training knowledge, MEDIUM). Linked from `index.html`, not the manifest |

### Precache strategy for the bundled verse JSON

- Load each translation with `import('./content/verses/bsb.json')` and so on. Vite turns each into a small hashed JS chunk under `dist/assets/`. **Verified:** both `bsb-*.js` and `kjv-*.js` chunks appeared in the `sw.js` precache list (17 entries, 248 KiB total in the trial), because the default `globPatterns` is `**/*.{js,css,html}`.
- **Consequence:** all four translations are available offline after the first load, including ones the user has not selected yet. That suits a classroom or projector setting and costs little, since the extraction script keeps each file to the cited verses only.
- **Do NOT `fetch()` verse JSON from `public/`** unless `json` is added to `globPatterns`; otherwise it is not precached and switching translation offline breaks. Keep JSON inside `src/` and import it.
- **Size guard:** Workbox skips files over 2 MiB by default (`maximumFileSizeToCacheInBytes`); since plugin v0.20.2 the build throws when this happens (per the vite-pwa FAQ). The cited-verses-only approach stays far below it. A whole-Bible file would hit it (the BSB text file alone is 4.3 MB).
- **No runtime caching rules are needed.** The game makes no API calls. The only external request is the Google Fonts stylesheet (see next bullet).
- **Fonts:** the codebase map says EB Garamond is loaded from Google Fonts. An external stylesheet is not part of the file-based precache, so offline the game would silently fall back to a system serif. Self-host the font (add `woff2` to `globPatterns` if it sits in `public/`, or import it from `src/`), or accept and design for the fallback. Self-hosting is recommended. HIGH that precache is built from files in `dist` (vite-pwa docs); the recommendation is mine.
- **License notices are part of the bundle**, so attribution stays visible offline. Precached ESV and NET text stays within the same 500-verse cap already enforced by the content tests.

### Update strategy: `prompt` (recommended) vs `autoUpdate`

| | `prompt` | `autoUpdate` |
|--|----------|--------------|
| Behavior | New service worker installs and WAITS. The old page keeps running the old bundle until the app calls `updateSW()` (skipWaiting plus reload) | The plugin forces `skipWaiting` and `clientsClaim`; the new SW takes over once installed; pages reload only if you call `registerSW({ immediate: true })` |
| Risk here | The user may see an old build until they accept | An unprompted reload mid-game destroys the in-memory game (no saved games, per PROJECT.md). The vite-pwa docs warn autoUpdate can lose in-progress user data |
| Other hazard | None new | The new SW can delete the old precache while an OLD page is still open; that page's later lazy `import()` of an old-hash verse chunk then fails (inferred from how precache cleanup works, MEDIUM) |

**Choose `prompt`.** The vite-pwa docs say changing from `autoUpdate` to `prompt` later "can be a pain", so decide now. Implementation shape:

```js
// src/main.jsx (sketch)
import { registerSW } from 'virtual:pwa-register';
const updateSW = registerSW({
  onNeedRefresh() { window.dispatchEvent(new Event('pwa-need-refresh')); },   // App shows a banner
  onOfflineReady() { window.dispatchEvent(new Event('pwa-offline-ready')); }, // App shows "Ready to play offline"
  onRegisteredSW(_url, reg) { if (reg) setInterval(() => reg.update(), 60 * 60 * 1000); }, // long-open projector tab
});
// Expose updateSW to App. In App: if the phase is 'setup' (no game in progress), call updateSW(true) at once;
// mid-game, show a small "New version ready: reload after this game" banner instead.
```

The "apply automatically on the setup screen, ask mid-game" rule is my design (inferred). It keeps the safety of `prompt` and removes most of the stale-build exposure. The `registerSW`, `onNeedRefresh`, `onOfflineReady` and `updateSW` names are from the vite-pwa prompt-for-update guide (HIGH); `onRegisteredSW` I did not run in the trial (MEDIUM).

### The stale-bundle pitfall (demonstrated, not only documented)

I reproduced it in the trial with `registerType: 'prompt'`: installed v1, rebuilt with a real code change, reloaded twice while online. Result: `registration.waiting === true` and the page kept loading the v1 bundle on BOTH reloads. A plain reload does not activate a waiting worker while a client is open. Consequences and mitigations:
1. **Users think a fix did not ship.** Always surface `onNeedRefresh` (banner) or auto-apply on the setup screen. Add a visible build id (for example a short git SHA injected via Vite `define`) in the footer or rules dialog so "what version does it say?" is answerable (inferred practice).
2. **GitHub Pages sets `Cache-Control: max-age=600`** (verified on the live URL today), so HTML and assets can be HTTP-cached for up to 10 minutes. Browsers normally bypass the HTTP cache when checking the SW script itself, so update detection should not be delayed by this (training knowledge, MEDIUM); a visit right after a deploy can still see a mix for a few minutes.
3. **The precached `index.html` references hashed chunks.** Keep `cleanupOutdatedCaches: true` (verified present in the generated `sw.js`), and wrap the dynamic verse `import()` in a catch that shows "Please reload to update" instead of a blank state.
4. **Never rename the service worker file or change its scope after launch**; users on an old registration would be orphaned. If a broken SW is ever shipped, a self-destroying SW is the escape hatch (vite-pwa has an "unregister service worker" guide; not exercised here).
5. **Every deploy is a fresh `npm ci` and `vite build`,** so precache revisions always match shipped files. Never hand-edit `dist`.

### iOS install limitations (secondary sources; MEDIUM to LOW)

- **No install prompt.** Safari does not implement `beforeinstallprompt`. Install is manual: Share, then Add to Home Screen. Build a small dismissible "How to install" hint for iOS Safari users (detect via user agent plus `navigator.standalone` or `display-mode: standalone`); Chromium browsers can use the native prompt.
- **The Home Screen icon comes from `apple-touch-icon`,** so the 180x180 opaque PNG in `<head>` matters more than manifest icons on iOS.
- **Offline works** (service workers and Cache Storage are supported). Safari may evict script-writable storage after about 7 days without use of a site opened in a Safari tab; apps added to the Home Screen are described as having their own usage counter and are intended to be exempt. Storage can also be purged under device storage pressure. Design consequence: after a long gap the first launch may need a network to re-download (about 250 KB), so UI copy should say "works offline after your first visit", not "works offline forever".
- **No push or background sync** is needed here; ignore.
- **Orientation:** set `orientation: 'any'`; iOS largely ignores manifest orientation anyway (inferred).
- Sources: MagicBell's iOS PWA limitations guide and WebKit bug tracker threads surfaced by search, not primary Apple documentation. I have no iOS device here, so exact behaviors (especially eviction timing) need a real-device check before promising anything.

### Testing the service worker

**Locally (manual and scripted):**
- Use `npm run build && npm run preview`. **Do not test the SW in `vite dev`;** its behavior differs (`devOptions.enabled` exists but is not the real precache). Preview serves `dist` at `http://localhost:4173/pilgrims-predestined-path/`, and localhost counts as a secure context, so the SW registers without HTTPS. HIGH (trial).
- In Edge or Chrome DevTools: Application > Service Workers (state, "Update on reload", offline checkbox), Application > Cache Storage (look for the `workbox-precache-v2-...` cache), Application > Manifest (installability warnings), plus Lighthouse. To simulate a new deployment: change code, rebuild while the preview server runs (it serves from disk), reload, and watch the waiting worker appear.
- Use a fresh browser profile or "Clear site data" between experiments; a stuck older SW is the most common source of confusion.

**Automated, layer 1 (fast, no browser; requires a prior build):** a Vitest file that reads `dist/manifest.webmanifest` and `dist/sw.js` and asserts: `scope` and `start_url` equal `/pilgrims-predestined-path/`; icons include 192, 512 `any` and 512 `maskable`; every `dist/assets/*.js` file appears in the precache list (guaranteeing all four verse chunks are offline-ready); `sw.js` contains `cleanupOutdatedCaches`. In CI run `npm run build` before this test file, or have it skip with a clear message when `dist` is absent locally. (The layer is my design; the assertions match what I inspected in the trial `sw.js` and manifest.)

**Automated, layer 2 (real offline behavior; recommended once):** a Playwright test against `vite preview`. I ran this exact flow locally with `playwright-core` and Microsoft Edge (`channel: 'msedge'`): load, wait for `navigator.serviceWorker.ready`, check the registration scope, `context.setOffline(true)`, reload, assert `#root` is populated, and assert a lazily imported verse chunk still loads. All passed (the offline reload rendered 4,843 characters of app HTML; the KJV chunk resolved offline). In CI use `@playwright/test` 1.63.0 with `npx playwright install --with-deps chromium` on `ubuntu-latest` and a `webServer` entry that starts `vite preview` (standard Playwright setup; the CI variant itself was not executed by me). Keep it to one or two tests to bound flakiness. CI step order inside the existing deploy job:

```yaml
      - run: npm ci
      - run: npm test                                  # game logic + content validation
      - run: npm run build
      - run: npx vitest run src/pwa-build.test.js      # layer 1 assertions against dist (hypothetical file name)
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test                       # layer 2 offline smoke against vite preview
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with: { path: ./dist }
```

Note that `npm test` runs `vitest run` over everything by default, so the layer 1 file should either skip when `dist` is missing or be excluded from the default include pattern; otherwise `npm test` before the build fails on a clean CI checkout. If CI time or flakiness is unwelcome, layer 1 alone plus a manual pre-release offline check on one Android and one iOS device is acceptable (opinion).

### PWA trial results (2026-09-29, scratch directory only)

- `npm install -D vite-plugin-pwa@^1.3.0` on the Vite 8.3.1 / React 19.3.0 project: 0 vulnerabilities; build output `PWA v1.3.0, mode generateSW, precache 17 entries (248.45 KiB)`; generated `dist/sw.js`, `dist/workbox-*.js`, `dist/manifest.webmanifest`.
- The manifest derived `scope` and `start_url` from `base` as described.
- Playwright on Edge against `vite preview`: SW active with the correct scope; offline reload rendered the app; the lazily imported JSON chunk loaded offline.
- Update test: rebuilt after a real code change; with `prompt` the new worker sat in `waiting` and the old bundle kept serving across two reloads (the stale-bundle pitfall). A first attempt that only appended a comment produced an identical bundle hash and therefore no update, which is also worth knowing when testing.
- Not verified: iOS Safari or Android Chrome hardware behavior; the Lighthouse installability audit; the CI Playwright job; how maskable icons render (the trial used empty placeholder PNGs, so icons were checked only for presence in the precache, not for visual quality).

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Deploy | Official Pages actions | `peaceiris/actions-gh-pages` (in the broken workflow) or `gh-pages` npm | Extra branch, extra tokens, two sources of truth; official actions are what Vite documents. |
| Deploy | Official Pages actions | Netlify/Cloudflare Pages | Project constraint is GitHub Pages at a fixed URL. |
| React | 19.3 | 18.3 | No compatibility reason to stay; fresh lockfile makes 19 free. |
| Vite plugin | plugin-react 6 | plugin-react-swc | SWC plugin targets older Vite majors; plugin-react 6 targets Vite 8's Oxc. |
| Test runner | Vitest 5 | Jest | Needs Babel/ESM config for Vite-style imports. |
| Component tests | None now | RTL + jsdom | Low value for this milestone; add one smoke test later if wanted. |
| Content format | JS modules + JSON | YAML / MDX | See table above. |
| Validation | Zod 4 in tests | Ajv 8 with JSON Schema; hand-rolled asserts | Ajv is fine but needs a separate schema language; hand-rolled asserts give poorer error paths. Zod also documents the shape in plain JS. |
| Language | JavaScript | TypeScript | A rewrite for a small game; Zod schemas already give runtime checking. Reasonable to revisit if the codebase grows (opinion). |
| Bible text at runtime | Bundled JSON | Runtime API calls (ESV/NET/bible-api) | Key exposure (ESV forbids publishing the key), CORS/uptime risk, no offline, unverifiable text. |
| State/routing | Existing `useState` (extract pure reducer for tests) | Redux, Zustand, React Router | Single-screen hot-seat game; no need. |
| Styling | Plain CSS | Tailwind, styled-components | Weight and churn for little gain; inline styles specifically must go because they block media queries. |
| PWA | vite-plugin-pwa 1.3 (`generateSW`) | Hand-written service worker; `injectManifest`; Workbox CLI | More code and more ways to ship a stale or broken SW for no benefit; the game has no custom fetch logic. |
| SW updates | `prompt` plus auto-apply on the setup screen | `autoUpdate` | An unprompted reload mid-game loses the in-memory game state. |

## Installation

```bash
# Runtime
npm install react@^19.3.0 react-dom@^19.3.0

# Dev
npm install -D vite@^8.3.1 @vitejs/plugin-react@^6.1.1 vitest@^5.0.2 zod@^4.6.5 vite-plugin-pwa@^1.3.0

# Optional, only if the browser offline smoke test is adopted
npm install -D @playwright/test@^1.63.0

# Remove the old deploy path
npm uninstall gh-pages

# Commit the generated package-lock.json (CI uses `npm ci`)
```

## Verified Trial Build (2026-09-29, scratch directory, not the repo)

- `npm install` with the versions above: 0 vulnerabilities; resolved react 19.3.0, react-dom 19.3.0, vite 8.3.1, @vitejs/plugin-react 6.1.1, vitest 5.0.2, zod 4.6.5.
- `npm run build`: success, 15 modules, 244.98 kB JS (76.33 kB gzip).
- `vitest run` with a Zod-validated content test: 1 passed.
- Not verified: `vite dev` in a browser, the game's runtime behavior, or an actual Pages deployment. PWA-specific trial results are in the PWA section.

## Sources

- npm registry, queried 2026-09-29 via `npm view`: vite 8.3.1 (engines `^20.19.0 || >=22.12.0`), @vitejs/plugin-react 6.1.1 (peer `vite ^8.0.0`), react/react-dom 19.3.0, vitest 5.0.2 (engines `^22.12.0 || ^24.0.0 || >=26.0.0`), zod 4.6.5, @testing-library/react 16.3.3, jsdom 30.1.1, gh-pages 6.3.0. HIGH.
- Vite official GitHub Pages guide and sample workflow (vitejs/vite `docs/guide/static-deploy.md`, `static-deploy-github-pages.yaml`); Vite v8 migration guide (`docs/guide/migration.md`). HIGH.
- GitHub releases API for actions/checkout v7.0.1, setup-node v7.0.0, configure-pages v6.0.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1; their `action.yml` files (upload path default `_site/`; configure/deploy run on node24) and https://github.com/actions/deploy-pages README (permissions). HIGH.
- GitHub REST API description (`repos/update-information-about-pages-site`, `build_type` enum). `gh api repos/AvocadoPanic/pilgrims-predestined-path/pages` showing `build_type: legacy`. HIGH.
- Vitest guide https://vitest.dev/guide/ ("requires Vite >=v6.4.0 and Node >=v22.12.0"). Node release schedule https://github.com/nodejs/Release (schedule.json). HIGH.
- BSB: https://berean.bible/licensing.htm, https://berean.bible/downloads.htm, https://bereanbible.com/bsb.txt. HIGH.
- KJV: https://ebible.org/kjv/copr.htm, https://ebible.org/find/details.php?id=eng-kjv. HIGH.
- ESV: https://www.crossway.org/permissions/, https://api.esv.org/ (raw HTML read; an automated summarizer of the api.esv.org/docs and esv.org/permissions pages returned nothing useful, so only the raw-HTML reads are relied on). HIGH for wording, MEDIUM for interpretation.
- NET: https://netbible.com/?p=530 and ?p=532 ("NET Bible Copyright", page dated 2026-04-16); https://labs.bible.org/api/ (tested). MEDIUM (numeric cap conflict noted above).
- CCEL and mirrors for primary sources: URLs in the table above, each fetched and inspected 2026-09-29. HIGH for existence and translator identity; MEDIUM for the copyright status of translators' later editions (inferred).
- PWA: npm registry (`vite-plugin-pwa` 1.3.0 and peers, `workbox-build`/`workbox-window` 7.4.1, `@vite-pwa/assets-generator` 2.0.0, `playwright` 1.63.0); vite-pwa docs read from the vite-pwa/docs repo (`guide/auto-update.md`, `guide/prompt-for-update.md`, `guide/pwa-minimal-requirements.md`, `guide/static-assets.md`, `guide/faq.md`, `guide/testing-service-worker.md`, `assets-generator/index.md`, `assets-generator/cli.md`); live response headers of https://avocadopanic.github.io/pilgrims-predestined-path/ (`Cache-Control: max-age=600`); a scratch build plus Playwright/Edge offline and update tests. HIGH for tooling behavior I executed. iOS behavior from MagicBell's PWA iOS limitations guide (https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide) and WebKit Bugzilla threads surfaced by search: MEDIUM to LOW.
- Not used: Context7 and the `research-plan` seam (direct registry, GitHub and publisher-page reads were more authoritative for version and license facts).
