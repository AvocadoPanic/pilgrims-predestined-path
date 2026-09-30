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
| (filled by planner / validate-phase) | | | | | | | | | ⬜ pending |

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
