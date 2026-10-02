---
phase: 02-installable-with-safe-updates
plan: 07
subsystem: testing
tags: [vitest, workbox, service-worker, pwa, png, build-test]
requires:
  - phase: 02-installable-with-safe-updates
    provides: build-output test, install store, docs/PWA.md standing rules (plans 02-01 to 02-06)
provides:
  - build test that fails when sw.js contains clientsClaim (standing rule 4)
  - build test that fails when the 192, 512 or maskable manifest icon is transparent
  - one-line reasons in the two formerly empty catch blocks of src/pwa/install.js
affects: [every later phase that edits vite.config.js or the icons]
actuals:
  tokens: 450
  tasks: 2
  commits: 2
plan_head_before: 7c03e3a26c70870f88ac87b685f27f63c379ab9d
tech-stack:
  added: []
  patterns:
    - "Guard tests are proven by a caught mutation (backup, mutate, run, restore, git diff --quiet) before commit"
key-files:
  created: []
  modified:
    - src/build-output.test.js
    - src/pwa/install.js
key-decisions:
  - "Asserted only clientsClaim absent from sw.js; no assertion on skipWaiting because the prompt-mode worker legitimately carries the SKIP_WAITING message handler"
  - "docs/PWA.md left unchanged: all three icons are opaque, so its 'check sizes and opacity (the build test does this)' sentence is now true"
requirements-completed: [PWA-01, PWA-04]
duration: 5 min
completed: 2026-10-02
status: complete
coverage:
  - id: D1
    description: "npm test fails if the built sw.js contains clientsClaim (worker takeover forbidden by docs/PWA.md rule 4)"
    requirement: PWA-04
    verification:
      - kind: unit
        ref: "src/build-output.test.js#sw.js is the real generateSW worker and registers under the base scope"
        status: pass
      - kind: other
        ref: "mutation: clientsClaim: true added to vite.config.js workbox options, build test failed with 'worker takeover is forbidden', file restored"
        status: pass
    human_judgment: false
  - id: D2
    description: "npm test fails if the 192x192 any, 512x512 any or 512x512 maskable icon is transparent (alpha color type or tRNS chunk)"
    requirement: PWA-01
    verification:
      - kind: unit
        ref: "src/build-output.test.js#manifest icons 192, 512 and maskable are opaque"
        status: pass
      - kind: other
        ref: "mutation: tRNS bytes appended to public/pwa-192x192.png, build test failed on 'pwa-192x192.png opaque', file restored"
        status: pass
    human_judgment: false
  - id: D3
    description: "Both empty catch blocks in install.js carry a one-line comment saying what is ignored and why that is safe; behavior unchanged"
    verification:
      - kind: unit
        ref: "src/pwa/install.test.js (24 tests pass unchanged)"
        status: pass
    human_judgment: false
---

# Phase 02 Plan 07: Build-test guards for worker takeover and transparent icons Summary

**The build test now fails on a clientsClaim worker or a transparent 192/512/maskable install icon (each proven by a caught mutation), and the two empty catch blocks in install.js explain what they ignore.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-10-02T13:21:27Z
- **Completed:** 2026-10-02T13:27Z (approx)
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Rule 4 guard: `expect(sw, 'worker takeover is forbidden (docs/PWA.md rule 4)').not.toContain('clientsClaim')` in the non-kill-switch branch of the sw.js test, with a comment on why the SKIP_WAITING handler is not asserted.
- Opacity guard: file-scoped `opaque(p)` helper (same predicate as the apple-touch-icon test) and a new test `manifest icons 192, 512 and maskable are opaque`.
- WR-03: both formerly empty `catch {}` blocks in `isStandalone` and `promptInstall` now hold a one-line reason; behavior is identical.

## Icon header check (Task 1 step 1, expected branch)

```
pwa-192x192.png colorType 3 tRNS false opaque
pwa-512x512.png colorType 3 tRNS false opaque
maskable-icon-512x512.png colorType 3 tRNS false opaque
icons checked 3
```

All three opaque, so the expected branch was taken: the opacity test covers all three icons and docs/PWA.md is unchanged (`git diff --quiet 93fd368 -- docs/PWA.md` exits 0).

## Mutation results

- `clientsClaim: true` added to the workbox options in vite.config.js: build test failed with "worker takeover is forbidden"; output "clientsClaim mutation caught"; vite.config.js restored and `git diff --quiet` clean. The name did survive minification in sw.js, so no extension to a workbox-*.js chunk was needed.
- `tRNS` bytes appended to public/pwa-192x192.png: build test failed on "pwa-192x192.png opaque"; output "opacity mutation caught"; PNG restored and `git diff --quiet` clean.
- After both, `git diff --quiet 93fd368 -- vite.config.js public` exits 0.

## Comment-only check

`comment-only ok`, both before the commit (diff against HEAD) and after it (fallback to the last commit touching install.js). `npx vitest run src/pwa/install.test.js`: 24 passed, unchanged.

## Pre-push gate

`npm ci && npm test && npm run build && git diff --quiet HEAD` printed `pre-push gate ok`. npm test: 6 files, 79 tests passed. Nothing was pushed; main is ahead of origin/main by 15 commits (13 before this plan plus the two task commits).

## Task Commits

1. **Task 1: tracer, CI refuses a takeover worker or a transparent install icon** - `bed6b7f` (test)
2. **Task 2: comment the two ignored errors in install.js** - `d9206c0` (chore)

**Plan metadata:** committed separately (docs: complete plan).

## Files Created/Modified

- `src/build-output.test.js` - clientsClaim absence assertion, `opaque` helper, manifest icon opacity test (added lines only; zero removed lines)
- `src/pwa/install.js` - one comment line in each of two catch blocks

## Decisions Made

- Only `clientsClaim` is asserted absent. `skipWaiting` is not asserted because the prompt-mode worker carries a legitimate SKIP_WAITING message handler (review WR-02).
- docs/PWA.md stays as is; its opacity sentence is now accurate.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Requirements note

`requirements: [PWA-01, PWA-04]` are copied into the frontmatter as the template requires, but REQUIREMENTS.md was deliberately not touched. Both still carry human device checks in 02-VERIFICATION.md and the phase verifier decides their status.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None.

## Threat Flags

None.

## Next Phase Readiness

Gap-closure plans 02-06 and 02-07 are done; the phase is ready for re-verification. A release still needs the user's explicit go-ahead; no push happened.

## Self-Check: PASSED

- src/build-output.test.js and src/pwa/install.js modified and present.
- Commits `bed6b7f` and `d9206c0` found in git log.
- Acceptance criteria re-run: required strings present, zero skipWaiting assertions, zero removed lines in the build-test commit, vite.config.js and public/ byte-identical to 93fd368, docs/PWA.md unchanged, both mutation lines printed.

---
*Phase: 02-installable-with-safe-updates*
*Completed: 2026-10-02*
