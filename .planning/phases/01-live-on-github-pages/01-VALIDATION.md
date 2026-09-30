---
phase: "1"
slug: "live-on-github-pages"
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-09-29"
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^5.0.2 (node environment) |
| **Config file** | `vite.config.js` `test.include` (Wave 0 installs) |
| **Quick run command** | `npx vitest run src/App.smoke.test.jsx` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~15 seconds (build-output test spawns `vite build`) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run` on the touched test file
- **After every plan wave:** Run `npm test` and `npm run build`
- **Before `/gsd-verify-work`:** Full suite, preview browser check, workflow structural check, and live checks must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-T1 | 01 | 1 | DEPL-01 | T-01-SC | No install before the user approves; no package has a postinstall script | registry evidence (checkpoint) | `npm view` loop over the 7 pinned packages | n/a | ⬜ pending |
| 01-01-T2 (tracer) | 01 | 1 | DEPL-01, DEPL-03 | T-01-01, T-01-02, T-01-03 | Files staged by name; `.env*` ignored; LF endings | unit + build + preview probe | `npm test`; `npm run build`; node preview probe printing "TRACER OK" | created here (Wave 0) | ⬜ pending |
| 01-02-T1 | 02 | 2 | DEPL-01, DEPL-03 | T-01-04 | No Google Fonts request from the rendered app | unit + build | `npx vitest run src/App.smoke.test.jsx`; build emits 4 woff2, no woff | yes (01-01) | ⬜ pending |
| 01-02-T2 | 02 | 2 | DEPL-01, DEPL-03 | T-01-05, T-01-07 | Favicon holds no script; scratch tool never tracked | build-output + scripted browser | `npx vitest run src/build-output.test.js`; `npm test`; play.mjs on preview (2, 3, 4) and dev (2, 4) | created here (Wave 0) | ⬜ pending |
| 01-03-T1 | 03 | 2 | DEPL-02 | T-01-09, T-01-10, T-01-11, T-01-12 | SHA-pinned actions, least-privilege token, test before upload, page URL via env | structural | Python workflow check printing "workflow ok"; zero-test pass-through check | n/a | ⬜ pending |
| 01-03-T2 | 03 | 2 | (D-03) | none | none | docs check | grep check printing "docs match shipped stack" | n/a | ⬜ pending |
| 01-04-T1 | 04 | 3 | DEPL-02 | T-01-15, T-01-16 | Push only on the user's push-now | evidence (checkpoint) | `git log --oneline origin/main..main` | n/a | ⬜ pending |
| 01-04-T2 | 04 | 3 | DEPL-02 | T-01-15, T-01-16, T-01-17, T-01-18 | Gate on the exact commit before pushing; no destructive recovery without a go-ahead | release gate + CI | pre-push gate; origin/main equals main; `gh run view` step conclusions print `true` | n/a | ⬜ pending |
| 01-05-T1 | 05 | 4 | DEPL-02 | T-01-19 | Pages source changes only on flip-now or flipped | evidence (checkpoint) | `gh api .../pages --jq` build type, branch, path | n/a | ⬜ pending |
| 01-05-T2 | 05 | 4 | DEPL-02, DEPL-03 | T-01-19 to T-01-23 | No third-party requests on the live page; deploy from main only | live checks + scripted browser + human check | build_type is `workflow`; `gh run watch --exit-status`; live asset check; no-trailing-slash check; play.mjs live (2, 3, 4) | n/a | ⬜ pending |

Requirement-level map (from 01-RESEARCH.md § Validation Architecture):

| Req / SC | Behavior | Test Type | Automated Command |
|----------|----------|-----------|-------------------|
| DEPL-01 / SC2 | App renders without throwing; no Google Fonts link in component | unit | `npx vitest run src/App.smoke.test.jsx` |
| DEPL-01 / SC2 | `npm run build` succeeds | build | `npm run build` |
| DEPL-03 / SC4 | Built asset URLs all under `/pilgrims-predestined-path/`; no `fonts.googleapis.com` | build-output | `npx vitest run src/build-output.test.js` |
| DEPL-02 / SC3 | Workflow has test before upload, `path: ./dist`, Pages permissions | structural | pyyaml one-off check in 01-RESEARCH.md |
| DEPL-02 / SC1 / SC4 | Live URL serves built app, all assets 200 | live check | curl snippet in 01-RESEARCH.md (after go-live) |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/App.smoke.test.jsx` — covers DEPL-01, SC2 (and SC4 for in-component font link)
- [ ] `src/build-output.test.js` — covers DEPL-03, SC4
- [ ] `vite.config.js` `test.include` and `"test": "vitest run"` script
- [ ] `npm install -D vitest@^5.0.2`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 2 to 4 player game reaches space 133 on the live URL, no console errors | SC1, SC2 | No browser test dependency this phase (Playwright arrives in Phase 2) | Open the URL, pick player count, Submit to Providence, Draw/Next until "SOLI DEO GLORIA"; or run the scratch Playwright script from 01-RESEARCH.md |
| Failing test blocks deploy (live) | DEPL-02 / SC3 | Needs a throwaway failing push; only with user approval | Structural check covers it by default |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
