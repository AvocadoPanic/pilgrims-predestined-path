---
phase: "01"
slug: "live-on-github-pages"
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: "2026-09-30"
---

# Phase 01 - Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| npm registry to developer machine | Third-party package code enters node_modules and the committed lockfile | package code (executable) |
| npm package files to built assets | Font binaries from @fontsource/eb-garamond are copied into dist | woff2 font data |
| executor scratchpad to repo | The throwaway playwright-core tool must never enter git | tooling files |
| working tree to git history | Whatever is staged is published when main is pushed | source, planning docs |
| local repository to public origin | Everything pushed becomes public and permanent | full commit history |
| origin/main to Actions runner | A push to main runs the workflow with a token that can publish the site | source, GITHUB_TOKEN |
| third-party action code to Actions runner | Action repositories run with the job's token and can publish the site | job token, build artifact |
| workflow expression to shell | Step outputs interpolated into run scripts become shell code | page_url string |
| Actions runner to GitHub Pages | The job's OIDC token and pages: write permission can replace the live site | OIDC token, site artifact |
| repository settings to the public URL | The Pages source decides what everyone on the internet is served | Pages build_type setting |
| public internet to the live site | Every visitor's browser loads the page and its assets | static HTML/JS/CSS/fonts (public) |
| player's browser to third-party font host | Loading fonts from Google would send each player's IP and referrer to Google | visitor IP, referrer (removed this phase) |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-01-SC | Tampering | npm installs (react, react-dom, vite, vitest, @vitejs/plugin-react, @fontsource/eb-garamond; scratch-only playwright-core) | high | mitigate | Blocking-human legitimacy gate with registry evidence approved ("approved", 01-01-SUMMARY); no postinstall in package.json; playwright-core absent from package.json; package-lock.json tracked and proven with `npm ci` locally and in CI run 36778764772 | closed |
| T-01-01 | Information disclosure | staging of untracked `.claude/plans/`, `.planning/intel/` | medium | mitigate | `git ls-files .claude/plans .planning/intel node_modules dist` prints nothing | closed |
| T-01-02 | Information disclosure | secrets committed to the public repo | low | mitigate | `.gitignore` has `.env*` and `*.local`; app reads no environment variables | closed |
| T-01-03 | Tampering | CRLF endings breaking Linux CI | low | mitigate | `.gitattributes` is `* text=auto eol=lf`; Linux `npm ci` passed in CI | closed |
| T-01-04 | Information disclosure | Google Fonts stylesheet links | medium | mitigate | No fonts.googleapis/gstatic reference in `src/` or `index.html`; asserted by `src/App.smoke.test.jsx` and `src/build-output.test.js` | closed |
| T-01-05 | Tampering | `public/favicon.svg` (SVG can carry script) | low | mitigate | 0 `script`/`text`/`foreignObject` elements in `public/favicon.svg` | closed |
| T-01-06 | Tampering | @fontsource woff2 binaries | low | accept | Package vetted at 01-01 Task 1 and pinned in the lockfile; OFL-1.1 font data, not executable code | closed |
| T-01-07 | Tampering | scratch playwright-core tool | low | mitigate | No playcheck path in `git ls-files` | closed |
| T-01-08 | Denial of service | build-output test temp directories | low | accept | `afterAll` removes the mkdtemp directory in `src/build-output.test.js` | closed |
| T-01-09 | Tampering | the five `uses:` actions | high | mitigate | All 5 `uses:` in `.github/workflows/deploy.yml` pinned to 40-char SHAs with version comments (SHAs matched upstream tags in 01-REVIEW.md) | closed |
| T-01-10 | Elevation of privilege | GITHUB_TOKEN scope | high | mitigate | Top-level `permissions:` is exactly `contents: read`, `pages: write`, `id-token: write` | closed |
| T-01-11 | Tampering | deploying a build whose tests failed | high | mitigate | `npm test` (line 30) precedes build, `upload-pages-artifact` (33) and `deploy-pages` (37) in one job; 0 `if:`/`continue-on-error` in the workflow. Structural evidence only; no live failing run (UAT item 6 waived) | closed |
| T-01-12 | Tampering | smoke-check shell script | low | mitigate | `page_url` reaches the script only via `env: PAGE_URL`; no `${{ }}` inside the run block | closed |
| T-01-13 | Tampering | deployment from a non-main branch | medium | accept | github-pages environment uses a custom branch policy; workflow triggers only on push to main and workflow_dispatch | closed |
| T-01-14 | Information disclosure | secrets in workflow logs | low | accept | Workflow references no `secrets.`; only the automatic OIDC token | closed |
| T-01-15 | Repudiation | push without the user's consent | high | mitigate | Blocking-human STOP 1; user replied "push-now, commit config" before the push (recorded verbatim in 01-04-SUMMARY; witnessed by the orchestrator) | closed |
| T-01-16 | Information disclosure | publishing unintended files or commits | medium | mitigate | Exact unpushed commit list shown at STOP 1; `.claude/plans` returns Not Found on GitHub | closed |
| T-01-17 | Tampering | pushing a commit that fails its own gate | medium | mitigate | Pre-push gate (npm ci, test, build, structural check, clean tree) passed on 8e6dc30 before the push (01-04-SUMMARY) | closed |
| T-01-18 | Denial of service | unapproved destructive recovery after CI failure | medium | mitigate | No force push, tags, deletions or re-pushes (01-04-SUMMARY) | closed |
| T-01-19 | Elevation of privilege | Pages source changed without consent | high | mitigate | Blocking-human STOP 2; PUT ran only after the user replied "flip-now" (01-05-SUMMARY; witnessed by the orchestrator) | closed |
| T-01-20 | Spoofing | transport for the live site | low | accept | `https_enforced: true` on the Pages API (checked 2026-09-30) | closed |
| T-01-21 | Information disclosure | third-party requests from the live page | medium | mitigate | Live HTML has 0 googleapis references; scripted live games and the verifier's asset crawl saw no third-party requests | closed |
| T-01-22 | Tampering | deploying from a non-main ref | medium | mitigate | Redeploy run 36779326540 ran on `main`; github-pages environment has a custom branch policy | closed |
| T-01-23 | Denial of service | unapproved rollback or setting churn | low | mitigate | No rollback run; the legacy undo command was never executed (01-05-SUMMARY) | closed |

*Status: open · closed · open - below high threshold (non-blocking)*
*Severity: critical > high > medium > low - only open threats at or above workflow.security_block_on count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-01 | T-01-06 | Font binaries are data (OFL-1.1) from a package vetted at the 01-01 gate and pinned by lockfile | plan 01-02 threat model | 2026-09-29 |
| AR-02 | T-01-08 | Temp build directories are cleaned in `afterAll`; one build per test run | plan 01-02 threat model | 2026-09-29 |
| AR-03 | T-01-13 | Pages environment restricts deploy branches; workflow triggers only on main and manual dispatch | plan 01-03 threat model | 2026-09-29 |
| AR-04 | T-01-14 | Workflow uses no repository secrets | plan 01-03 threat model | 2026-09-29 |
| AR-05 | T-01-20 | GitHub Pages enforces HTTPS for the site | plan 01-05 threat model | 2026-09-29 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-09-30 | 24 | 24 | 0 | /gsd-secure-phase orchestrator (ASVS L1 grep-depth; auditor skipped per short-circuit: register authored at plan time, 0 open) |

Notes: code review warnings WR-01 (no positive test that fonts are bundled) and WR-02 (`cancel-in-progress: true`) in 01-REVIEW.md are quality/reliability issues, not open threats against this register.

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-09-30
