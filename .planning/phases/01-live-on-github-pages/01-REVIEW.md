---
phase: 01-live-on-github-pages
reviewed: 2026-09-30T00:00:00Z
depth: standard
files_reviewed: 13
files_reviewed_list:
  - .claude/CLAUDE.md
  - .gitattributes
  - .github/workflows/deploy.yml
  - .gitignore
  - index.html
  - package.json
  - public/favicon.svg
  - src/App.jsx
  - src/App.smoke.test.jsx
  - src/build-output.test.js
  - src/fonts.css
  - src/main.jsx
  - vite.config.js
findings:
  critical: 0
  warning: 2
  info: 4
  total: 6
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-09-30
**Depth:** standard
**Files Reviewed:** 13
**Status:** issues_found

## Summary

Reviewed the Pages deploy workflow, Vite/React config, self-hosted font wiring, the two test files, and the 2-line App.jsx change (Google Fonts `<link>` removal, confirmed via `git diff f30f4fc..HEAD -M`). `npm test` passes locally (5/5) and a build produces the four woff2 files plus hashed JS/CSS in `dist/assets`. All five action SHAs in `deploy.yml` were checked against the upstream tags and match the version comments (checkout v7.0.1, setup-node v7.0.0, configure-pages v6.0.0, upload-pages-artifact v5.0.0, deploy-pages v5.0.1). Permissions are least-privilege. No security issues found. The defects are in test strength and deploy-workflow robustness.

## Warnings

### WR-01: Build-output test does not prove the fonts are bundled

**File:** `src/build-output.test.js:52-56`
**Issue:** The test "every base-prefixed URL ... names a file" passes as long as `index.html` references its own JS/CSS, because those always produce base-prefixed URLs. The `urls.length > 0` guard is therefore vacuous with respect to fonts. If `fonts.css` were deleted, its import removed from `src/main.jsx`, or Vite began inlining the woff2 files as data URIs, every test here would still pass while the deployed site silently fell back to Georgia. The phase goal (self-hosted EB Garamond, no Google Fonts) is only negatively asserted (`fonts.googleapis.com` absent, `src/App.smoke.test.jsx:9`), never positively.
**Fix:** Add an explicit assertion, e.g.
```js
it('bundles the four EB Garamond woff2 files and references them from CSS', () => {
  const woff2 = walk(out).filter((p) => p.endsWith('.woff2'));
  expect(woff2.length).toBe(4);
  const css = cssUrls().filter((u) => u.endsWith('.woff2'));
  expect(css.length).toBe(4);
  for (const u of css) expect(u.startsWith(BASE + 'assets/'), u).toBe(true);
});
```

### WR-02: `cancel-in-progress: true` on the Pages deploy concurrency group

**File:** `.github/workflows/deploy.yml:13-15`
**Issue:** GitHub's own Pages starter workflow sets `cancel-in-progress: false` for this group. With `true`, a second push to `main` can cancel a run that is mid-`deploy-pages` or mid-smoke-check, leaving a cancelled (red) run for a commit that may have deployed, and a rapid push sequence can cancel the run for the commit that is actually live. The smoke check for the cancelled run never reports. Since every push to `main` deploys, the last-writer-wins behaviour is wanted, but it should come from queueing rather than cancelling an in-flight deployment.
**Fix:**
```yaml
concurrency:
  group: pages
  cancel-in-progress: false
```
(Pending runs are still collapsed to the newest by GitHub; only the running one is allowed to finish.)

## Info

### IN-01: Build failure in the build-output test is undiagnosable

**File:** `src/build-output.test.js:14-17`
**Issue:** `--logLevel silent` suppresses Vite's error output, so if the production build fails, `execFileSync` throws a bare "Command failed" with an empty stderr and the developer or CI log has no cause.
**Fix:** Use `--logLevel error` so failures surface while warnings stay quiet.

### IN-02: Vite binary resolved via `process.cwd()`

**File:** `src/build-output.test.js:8`
**Issue:** `join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js')` breaks if vitest is invoked from a subdirectory, and the `--outDir` build also relies on cwd being the project root for `index.html`/config discovery.
**Fix:** Derive from the test file: `fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))` and pass `cwd` to `execFileSync`.

### IN-03: Post-deploy smoke check only inspects the HTML

**File:** `.github/workflows/deploy.yml:38-48`
**Issue:** The check greps the page HTML for the `assets/index-` prefix but never requests the referenced JS, CSS or woff2 files, so a deploy with a 404 asset would still pass. The pipe `curl ... | grep -q` also relies on the default shell not having `pipefail` (GitHub's implicit `bash -e {0}`); if someone later sets `shell: bash`, `grep -q` closing the pipe early can make curl exit 23 and fail the step spuriously.
**Fix:** Extract the asset paths from the HTML, `curl -fsSI` each (at least the JS, CSS and one woff2), and capture the body to a variable before grepping.

### IN-04: Default body margin under a `100vh` root (pre-existing, surfaced by the new index.html)

**File:** `index.html:10-13`, `src/App.jsx:390,427`
**Issue:** No CSS reset exists (the old Google `<link>` was the only stylesheet-ish element). The app root is `min-height:100vh` inside a `<body>` with the default 8px margin, producing a permanent vertical scrollbar and a white gutter around the dark gradient. The 2-line App.jsx removal did not cause this; noted because `index.html` and `src/fonts.css` are now the natural place to fix it.
**Fix:** Add `html,body{margin:0;background:#0a0608}` to `src/fonts.css` (or a new `base.css`) imported from `main.jsx`.

---

_Reviewed: 2026-09-30_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
