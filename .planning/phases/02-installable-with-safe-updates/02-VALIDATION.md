---
phase: "2"
slug: "installable-with-safe-updates"
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-09-30"
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 5.0.2, Node environment (no jsdom) |
| **Config file** | `vite.config.js` (`test.include: ['src/**/*.test.{js,jsx}']`) |
| **Quick run command** | `npx vitest run src/pwa src/App.smoke.test.jsx` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~15 seconds (full suite includes the production-build test) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/pwa src/App.smoke.test.jsx`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green, then `npm run build && npm run preview` DevTools check (Application > Manifest: no errors, identity under the base)
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| (filled from PLAN.md tasks during execution) | | | | | | | | | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/pwa/install.test.js`: covers PWA-01, PWA-02 (install row mode, beforeinstallprompt stash, appinstalled)
- [ ] `src/pwa/updates.test.js`: covers PWA-04 (SC3, SC4, D-05 visibility throttle, onNeedReload gating)
- [ ] `src/pwa/startHandoff.test.js`: covers D-01 (round trip, expiry, invalid JSON, numP validation)
- [ ] Extend `src/build-output.test.js` with the SC5 manifest, sw.js and icon assertions
- [ ] Extend `src/App.smoke.test.jsx` to assert the build id footer (`dev` under Vitest)

No new test framework needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Install on Android Chrome and desktop Chrome/Edge opens the game at the live URL in its own window | PWA-01 / SC1 | Needs a real browser install flow on the live site | Visit live URL, click Install on setup, launch the installed app |
| iPhone/iPad Home Screen icon is the game art, label "Pilgrim's Path", opens the game; row hidden when launched from Home Screen | PWA-02 / SC2 | No iOS device in automation | Safari: Share > Add to Home Screen, launch from icon |
| Two-deploy update check: hint on setup after a new deploy, Start loads the new build, mid-game deploy never reloads | PWA-04 / SC3 / SC4 | Requires two real deploys | Checklist in `docs/PWA.md` |
| Kill-switch rehearsal (`selfDestroying: true`) unregisters the worker and clears caches, one reload per window | D-15 | DevTools inspection on a local build + preview | Steps in `docs/PWA.md`; nothing self-destroying is deployed |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
