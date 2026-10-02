---
phase: 02-installable-with-safe-updates
plan: 03
subsystem: infra
tags: [pwa, kill-switch, github-actions, github-pages, vite-plugin-pwa, docs]

requires:
  - phase: 02-installable-with-safe-updates
    provides: "plan 02-01 worker, KILL_SWITCH and EXPECT_KILL_SWITCH keys, build gate; plan 02-02 icons and install row"
provides:
  - docs/PWA.md with standing PWA rules, build id, deploy policy, icon regeneration, two-deploy update check, real-device checklist, two-key kill switch procedure and the rehearsal record
  - a kill switch rehearsed once locally (one-key flip fails the build test; stub unregisters, clears caches and navigates once; revert restores the real worker)
  - deploy.yml that skips docs-only pushes, queues deploys, and smoke-checks the live manifest, sw.js and four icons
affects: [02-04 deploy as build A, 02-05 deploy as build B, phases 3-7 two-deploy update check]

plan_head_before: 91373a0927b2ea702b67f2ff36d7f0fe9d19cb0c

actuals:
  tokens: 2400
  tasks: 2
  commits: 2

tech-stack:
  added: []
  patterns:
    - "Emergency switch guarded by two keys in two files so one accidental flip fails CI"
    - "Rehearse destructive config locally from a scratch script that restores the file byte for byte"
    - "Workflow inputs from step outputs go through env, never into script text"

key-files:
  created:
    - docs/PWA.md
  modified:
    - .github/workflows/deploy.yml

key-decisions:
  - "Rehearsal script lives only in the session scratchpad; vite.config.js ends byte-identical to HEAD (D-15)"
  - "Smoke step normalizes page_url with ${PAGE_URL%/}/ so either form of the URL works (Assumption A6)"
  - "The ci(02-03) commit is the last commit of the plan touching anything outside .planning/, docs/ and Markdown, so 02-04 can release its parent as build A and 02-05 can release it as build B"

patterns-established:
  - "Phases 3 to 7 repeat the two-deploy update check recorded in docs/PWA.md"
  - "Storage keys and custom caches start with ppp:"

requirements-completed: [PWA-04, PWA-01]

coverage:
  - id: D1
    description: "Kill switch rehearsed locally: the one-key flip fails the build test, the self-destroying build leaves zero registrations and zero caches at 12 s and 20 s after exactly one navigation, and the revert restores the real worker with vite.config.js byte-identical"
    requirement: PWA-04
    verification:
      - kind: e2e
        ref: "node $SCRATCHPAD/ppp-pwacheck/killswitch.mjs (ok true, guardFailed true, navigations 1)"
        status: pass
      - kind: other
        ref: "git diff --quiet HEAD -- vite.config.js && grep -c 'const KILL_SWITCH = false;' vite.config.js (1)"
        status: pass
    human_judgment: false
  - id: D2
    description: "docs/PWA.md records the standing rules, build id, deploy policy, icon regeneration, two-deploy update check, real-device checklist and the two-key kill switch procedure with side effects; no README; no em-dashes or curly quotes"
    requirement: PWA-04
    verification:
      - kind: other
        ref: "required-phrase grep loop (doc sections ok); LC_ALL=C grep -c for em-dashes and curly quotes (0); test ! -e README.md"
        status: pass
    human_judgment: true
    rationale: "Whether the prose is clear and complete enough for the owner to follow in an emergency is a reading judgment; the automated checks only prove the required phrases and character rules"
  - id: D3
    description: "deploy.yml skips pushes whose changed files all match .planning/**, docs/**, **/*.md or .claude/**, keeps workflow_dispatch, and queues deploys (cancel-in-progress false)"
    requirement: PWA-04
    verification:
      - kind: other
        ref: "python workflow structural check (workflow ok)"
        status: pass
    human_judgment: true
    rationale: "GitHub's **/*.md filter matching root-level Markdown is confirmed live only by the first docs-only push (flagged assumption); the structural check proves the file, not GitHub's matching"
  - id: D4
    description: "After each deploy, CI fetches manifest.webmanifest, sw.js and the four icon PNGs from the live base with a cache-buster and fails if one is not served within six tries"
    requirement: PWA-01
    verification:
      - kind: other
        ref: "npm run build then test -f for the six files (smoke list matches build); extracted step run locally against vite preview with and without a trailing slash on PAGE_URL (all six live file ok, exit 0); bash -n"
        status: pass
    human_judgment: true
    rationale: "The step first runs against the real GitHub Pages URL at the plan 02-04 deploy; a local preview stands in until then"

duration: 15min
completed: 2026-10-02
status: complete
---

# Phase 2 Plan 03: Kill Switch Rehearsal, PWA Docs and Deploy Policy Summary

**Kill switch rehearsed once against a local vite-plugin-pwa self-destroying build (one-key flip fails CI, stub unregisters and clears caches with a single reload, revert restores the worker), docs/PWA.md written, and deploy.yml changed to skip docs-only pushes, queue deploys and smoke-check the live manifest, worker and icons**

## Performance

- **Duration:** about 15 min (start time was not captured at spawn; estimated from commit timestamps)
- **Completed:** 2026-10-02T01:10Z
- **Tasks:** 2, one commit each
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments

- The kill switch works as documented, proven in real Edge against `vite preview`: before, one registration and one precache; flipping only `KILL_SWITCH` makes `src/build-output.test.js` fail; after the self-destroying build the page navigated once and left zero registrations and zero caches at 12 s and 20 s; after the revert the real worker registered again; `vite.config.js` equals HEAD.
- `docs/PWA.md` holds the standing rules (never rename `sw.js` or change scope or manifest id, `ppp:` prefix, `cleanupOutdatedCaches: true`, prompt mode only, test with build plus preview), the build id, the deploy policy, icon regeneration, the two-deploy update check for Phases 3 to 7, the real-device checklist, and the emergency procedure with its side effects (every open window reloads, all Cache Storage on avocadopanic.github.io is deleted).
- `deploy.yml`: `paths-ignore` for `.planning/**`, `docs/**`, `**/*.md`, `.claude/**` (D-17); `cancel-in-progress: false` (D-18, closes Phase 1 review item WR-02); a last step "Smoke check live PWA files" with six files, six tries, 10 s apart, cache-busted with `GITHUB_RUN_ID`.

## Task Commits

1. **Task 1: Rehearse the kill switch locally and write docs/PWA.md** - `82e2eac` (docs)
2. **Task 2: Deploy policy** - `5d1bb46` (ci)

**Plan metadata:** committed with this SUMMARY (docs: complete plan)

`5d1bb46` is the last commit of this plan outside `.planning/`, `docs/` and Markdown, as plan 02-04 and 02-05 expect: its parent is the code state to release as build A, itself the state for build B.

## Rehearsal output (killswitch.mjs, scratchpad only, never committed)

```json
{"ok":true,"before":{"regs":1,"caches":1,"precache":true},"guardFailed":true,"after12":{"regs":0,"caches":0},"after20":{"regs":0,"caches":0},"navigations":1,"restored":true,"configRestored":true,"errors":[]}
```

Exit 0 on the first run. Afterwards `git diff --quiet HEAD -- vite.config.js` exited 0, `grep -c 'const KILL_SWITCH = false;' vite.config.js` printed 1, and `git status` showed only the user's untracked paths.

## Workflow check output

```
workflow ok
smoke list matches build
bash syntax ok
```

The extracted smoke step was also run against `vite preview` with `PAGE_URL` both with and without a trailing slash: six `live file ok` lines and exit 0 each time.

## Acceptance criteria re-run

- No em-dashes or curly quotes in `docs/PWA.md` (count 0); none of "load-bearing", "quietly", "in real time", "not just" appear.
- `test ! -e README.md` exits 0; `ppp-pwacheck` is not tracked.
- Task 1 commit changes only `docs/PWA.md`; Task 2 commit changes only `.github/workflows/deploy.yml` and has the exact subject `ci(02-03): skip docs-only deploys, queue deploys, smoke-check live PWA files`.
- The ci commit leaves `src`, `public`, `index.html`, `vite.config.js`, `package.json`, `package-lock.json` and `scripts` unchanged, and removes no `uses:` line (count 0).

## Files Created/Modified

- `docs/PWA.md` - standing PWA rules, procedures and rehearsal record
- `.github/workflows/deploy.yml` - `paths-ignore`, queued deploys, live PWA file smoke step

## Decisions Made

- Followed the plan. Rehearsal date is recorded as the UTC date 2026-10-02 (the machine's local date was still 2026-10-01).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

None.

## Threat Flags

None. The surfaces touched (kill-switch stub, workflow trigger, PAGE_URL in the smoke step, action pins) are T-02-09 to T-02-13 in the plan. Mitigations held: both kill-switch keys documented and the one-key flip proven to fail CI; `cancel-in-progress: false` asserted; `PAGE_URL` passed through `env` and the structural check confirms the expression text is not in the script; every `uses:` still pinned to a 40-character SHA and none removed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 02-04 can release `5d1bb46^` as build A (everything before the `ci(02-03)` commit) behind its user stop; nothing is pushed yet.
- The first docs-only push after the phase should show no deploy run (`gh run list --workflow deploy.yml`); that is where GitHub's `**/*.md` matching at the repo root is confirmed live (flagged assumption).
- The smoke step has only run against a local preview; its first real run is at the plan 02-04 or 02-05 deploy.

## Self-Check: PASSED

`docs/PWA.md` and `.github/workflows/deploy.yml` exist with the planned content; commits `82e2eac` and `5d1bb46` exist; every task `<verify>` and `<acceptance_criteria>` command and the plan-level `<verification>` were re-run and pass; `vite.config.js` equals HEAD.

---
*Phase: 02-installable-with-safe-updates*
*Completed: 2026-10-02*
