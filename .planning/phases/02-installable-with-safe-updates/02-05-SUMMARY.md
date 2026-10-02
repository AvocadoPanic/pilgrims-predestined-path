---
phase: 02-installable-with-safe-updates
plan: 05
subsystem: infra
tags: [pwa, github-pages, github-actions, release, service-worker, update-flow, playwright, edge]

requires:
  - phase: 02-installable-with-safe-updates
    provides: "plan 02-04: release A (82e2eac) live, holding the first service worker; plans 02-01 to 02-03: update path, build gate, deploy policy commit"
provides:
  - "Release B (5ad072d) on origin/main: the deploy.yml policy commit (paths-ignore D-17, cancel-in-progress false D-18, live PWA smoke step) plus documentation commits"
  - "First live two-deploy update check on GitHub Pages: A held in Edge, B deployed, update offered on setup, Start loads B, game in progress never reloaded"
  - "A passing deploy run for B including the new 'Smoke check live PWA files' step"
  - "Two real-device update checks queued as pending end-of-phase UAT items"
affects: [02-VERIFICATION, 02-UAT, phase 3 deploys]

plan_head_before: 5ad072d5e925918f4f10c1057251d4e781df0892

actuals:
  tokens: 0
  tasks: 2
  commits: 0

tech-stack:
  added: []
  patterns:
    - "Scripted live update check: hold build A in a persistent Edge profile (one tab mid-game, one on setup), push from inside the script only after A-READY is printed, poll the live index.html module script src to detect B, then assert offer, Start apply and the untouched game"
    - "Re-fetch origin and compare short SHAs inside the script immediately before the one-way push"

key-files:
  created: []
  modified: []

key-decisions:
  - "The user's reply 'push' was treated as 'push-b', the push option offered at this stop (the other was 'hold'); the orchestrator told the user so before dispatching this continuation"
  - "Pushed with the plan's command, git push origin main, after a fresh fetch confirmed origin/main = 82e2eac and local main = 5ad072d (exactly the 3 approved commits)"

requirements-completed: [PWA-04]

coverage:
  - id: D1
    description: "Release B is on origin/main and its deploy.yml run concluded success on every step, including the Smoke check live PWA files step"
    requirement: PWA-04
    verification:
      - kind: other
        ref: "git fetch origin && test origin/main = main (5ad072d5e925918f4f10c1057251d4e781df0892), printed 'origin/main is B'"
        status: pass
      - kind: other
        ref: "gh run view 36961311133 (conclusion success, 14 steps success, Smoke check live PWA files == [success] printed true)"
        status: pass
    human_judgment: false
  - id: D2
    description: "On the live GitHub Pages host a tab on setup holding A is offered B ('A new version will load when you start.'), Start loads B and begins a 3 pilgrim game, and a game in progress on another tab has zero navigations and no update text until its own Start"
    requirement: PWA-04
    verification:
      - kind: e2e
        ref: "node $SCRATCHPAD/ppp-pwacheck/live-update.mjs 82e2eac 5ad072d (ok true, errors [])"
        status: pass
    human_judgment: false
  - id: D3
    description: "After the first game ends, Play Again shows the update hint on setup and Start loads B with a 2 pilgrim game; a fresh setup page shows B's SHA in the footer"
    requirement: PWA-04
    verification:
      - kind: e2e
        ref: "node $SCRATCHPAD/ppp-pwacheck/live-update.mjs 82e2eac 5ad072d (page2.hintOnSetup true, chips 2, saint 0, entryIsB true, page3Footer v 5ad072d)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Real installed apps and mobile browsers behave the same: the setup screen offers B after a full close and reopen, Start loads B, and a game in progress on another device is never reloaded or interrupted by the app switch"
    requirement: PWA-04
    verification: []
    human_judgment: true
    rationale: "Real devices decide when they check for a new worker and show background and resume behavior; automation here covers desktop Edge only. Queued as end-of-phase UAT"

duration: 10min
completed: 2026-10-01
status: complete
---

# Phase 2 Plan 05: Release B and Live Two-Deploy Check Summary

**Release B (5ad072d, the deploy.yml policy commit plus docs) pushed to origin/main on the owner's go-ahead; on the live GitHub Pages site a scripted Edge session holding build A was offered B on the setup screen, Start loaded B and began the chosen game, the game in progress was never reloaded, and B's deploy run passed including the new live PWA smoke step.**

## Performance

- **Duration:** about 10 min for this continuation (Task 1 preparation was done by the previous executor, with no repository changes); the push-to-live wait was 37 s
- **Completed:** 2026-10-02T03:46Z (2026-10-01 local)
- **Tasks:** 2 of 2 (Task 1 resolved by the user's reply, Task 2 executed)
- **Files modified:** 0 repository files (this plan publishes commits; it changes none)

## Accomplishments

- STOP B answered by the user; release B pushed once with `git push origin main` (no force, no tags, no other ref). origin/main moved 82e2eac -> 5ad072d.
- The deploy.yml run for B succeeded on every step, including the new "Smoke check live PWA files" step.
- The first live two-deploy update check passed (JSON below): D-01, D-02, D-03, D-04 and D-14 hold on the real host.
- Two real-device checks are recorded as pending UAT items (below).

## Task 1: STOP B (blocking-human decision)

- **User reply, verbatim:** `push` (typed by the user in the orchestrator session on 2026-10-01).
- **Interpretation:** the options offered were `push-b` (push B and run the live update check) and `hold`. The orchestrator read "push" as `push-b`, the only push this stop could authorize (release A was already pushed in 02-04), and told the user so before dispatching this continuation. The approval covers the 3 listed commits only.
- **Acceptance note:** the plan's acceptance criterion asks for the literal "push-b" or "hold". The reply was "push" and was mapped to "push-b" by the orchestrator as above. Both the raw reply and the mapping are recorded here.

### Unpushed commits shown to the user (`git log --oneline origin/main..main` after a fresh fetch)

```
5ad072d docs(02-04): complete release A push and live verification plan
a8f1a16 docs(02-03): complete kill switch, PWA docs and deploy policy plan
5d1bb46 ci(02-03): skip docs-only deploys, queue deploys, smoke-check live PWA files
```

### Changed files (`git diff --name-only origin/main main`)

```
.github/workflows/deploy.yml
.planning/REQUIREMENTS.md
.planning/ROADMAP.md
.planning/STATE.md
.planning/phases/02-installable-with-safe-updates/02-03-SUMMARY.md
.planning/phases/02-installable-with-safe-updates/02-04-SUMMARY.md
```

Every path matches the plan's allow-list (deploy.yml, `.planning/**`, `docs/**`, `*.md`), so no app file changed after A.

## Task 2: Pre-push gate, push, live check

### Pre-push gate (re-run before the push)

- Precondition: `gh auth status` showed AvocadoPanic logged in and active; the live footer showed A's SHA (the script re-verified it before pushing).
- Re-confirmed after `git fetch origin`: origin/main was still `82e2eacd0a20e8321ac50a7ebde3f0c1b0c90431`, local main `5ad072d5e925918f4f10c1057251d4e781df0892`, and `origin/main..main` was exactly the 3 approved commits. No commit was created before the push (B7 = 5ad072d).
- `npm ci` (0 vulnerabilities), `npm test` (5 files, 62 tests passed), `npm run build` (PWA v1.3.0 generateSW, 8 precache entries, dist/sw.js generated), `git diff --quiet HEAD` (tracked tree clean). Output: `pre-push gate ok`.

### live-update.mjs

Written to `$SCRATCHPAD/ppp-pwacheck/live-update.mjs` (scratchpad only, never committed). Run from the repo root as `node live-update.mjs 82e2eac 5ad072d` against https://avocadopanic.github.io/pilgrims-predestined-path/. Before the push it loaded A in a fresh persistent Edge profile, left page 2 mid-game (2 pilgrims, one card drawn) and page 1 on setup with 3 pilgrims selected, then fetched origin once more and checked origin/main = A7 and main = B7 before running the push itself.

Output:

```
A-READY
PUSH exit=0
To https://github.com/AvocadoPanic/pilgrims-predestined-path
   82e2eac..5ad072d  main -> main

B-LIVE
{"ok":true,"a7":"82e2eac","b7":"5ad072d","pushed":true,"bLiveAfterSec":37,"page1":{"entryA":"/pilgrims-predestined-path/assets/index-CqCguTM6.js","entryB":"/pilgrims-predestined-path/assets/index-CUOxyC5q.js","footerA":"v 82e2eac · 2026-10-02","hintShown":true,"chips":3,"vessel":0,"entryIsB":true},"page2":{"hintMidGame":false,"navsBeforeOwnStart":0,"navsAtOfferTime":0,"stillPlaying":true,"entryStillA":true,"clicksToEnd":138,"hintOnSetup":true,"chips":2,"saint":0,"entryIsB":true},"page3Footer":"v 5ad072d · 2026-10-02","errors":[]}
```

Reading of the result:

- Page 1 (setup, holding A): the hint "A new version will load when you start." appeared after B went live; Start reloaded onto B's entry with three pilgrims ("The Saint" present, "The Vessel" absent) (D-01, D-02).
- Page 2 (mid-game on A): zero main-frame navigations at offer time and 8 s after page 1's Start, no hint in its body, still on A's entry and still playing (D-04). It finished in 138 clicks, Play Again showed the hint on setup (D-03), and Start loaded B's entry with two pilgrims ("The Pilgrim" present, "The Saint" absent).
- Page 3 (fresh load): footer `v 5ad072d` equals B7 (D-14).
- No pageerror or console errors on any page.

### Deploy run for B

- Run: https://github.com/AvocadoPanic/pilgrims-predestined-path/actions/runs/36961311133 (event push, headSha `5ad072d5e925918f4f10c1057251d4e781df0892`, conclusion success). The push touched `.github/workflows/deploy.yml` (in commit 5d1bb46), so the paths-ignore filter did not skip it; the run is titled after the head commit.
- Steps (job `deploy`, all success): Set up job; actions/checkout; actions/setup-node; npm ci; npm test; npm run build; actions/configure-pages; actions/upload-pages-artifact; actions/deploy-pages; Smoke check live page; Smoke check live PWA files; Post setup-node; Post checkout; Complete job.
- Verify command 3 printed `true` for the "Smoke check live PWA files" conclusion. B ran the new workflow, so D-17 (paths-ignore) and D-18 (cancel-in-progress false) are in the deployed file.
- Verify command 4: after a fetch, `origin/main` = `main` = `5ad072d5e925918f4f10c1057251d4e781df0892` ("origin/main is B").
- Acceptance: `gh api repos/AvocadoPanic/pilgrims-predestined-path/contents/.claude/plans` returned HTTP 404, so the untracked plans folder was not pushed.

### Process cleanup

The script closes its Edge context in a finally block. A process snapshot taken before and after the run (Get-Process msedge, node) showed no new Edge or node processes; the many Edge processes already running on the machine (the user's own) were left alone. The only scratchpad leftovers are the throwaway Edge profile folders in `ppp-pwacheck/`, outside the repository.

## Pending real-device checks (end-of-phase UAT items)

Both items assume the device held build A before this push. The live site is now on B, so a device that has not yet loaded the site since the push will fetch B directly and cannot show the A-to-B offer; run these only on a device that was on A (for example an install made after plan 02-04).

1. **Setup-screen device (SC3, D-01, D-02, D-14).** On a phone or tablet that opened the game (installed app or browser tab) on A and was left on setup before the push: close the app fully and reopen it (or reload the tab) and look at the setup screen. Expected: "A new version will load when you start." appears under the start button; Submit to Providence reloads once and begins the game with the chosen pilgrim count; later on setup the footer reads `v 5ad072d`. Status: pending.
2. **In-game device (SC4, D-03, D-04).** On a device where a game on A was in progress before the push: keep playing, switch away from the app and back once, then finish and press Play Again. Expected: the game never reloads or shows update text during play; after Play Again the setup screen shows the hint, and Start loads B. Status: pending.

## Task Commits

No task commits. This plan changes no repository files (`files_modified: []`); its only effect is the push of the existing commits. `plan_head_before` is the local HEAD at the start (`5ad072d`) and `git rev-list --count 5ad072d..HEAD` was 0 before this SUMMARY commit, which is a docs-only close-out.

**Plan metadata:** the `docs(02-05)` commit that adds this SUMMARY plus STATE.md, ROADMAP.md and REQUIREMENTS.md updates. It is a local commit only and was NOT pushed (origin/main stays at 5ad072d).

## Decisions Made

- "push" was accepted as "push-b" on the orchestrator's stated interpretation; scope limited to the 3 listed commits.
- The script pushes with `git push origin main` as the plan specifies, gated on a fresh fetch showing origin/main = A and main = B, so nothing beyond the approved list could go.

## Deviations from Plan

None - plan executed exactly as written. The one wording difference (the user typed "push", not the literal "push-b") is explained under Task 1 and was resolved by the orchestrator before this continuation started.

## Issues Encountered

None. B was live 37 s after the push (the deploy run took about 30 s), so the script's 9 minute and 2 minute waits were not needed.

## Known Stubs

None. No files were created or modified in the repository. `.planning/WINDOWS.md` does not exist in this project, so nothing was appended to the broken-windows ledger; the two pending device checks are tracked above as UAT items.

## Threat Flags

None. No repository files changed and the push added no new endpoints or trust boundaries beyond the plan's threat model. T-02-18 (consent): blocking-human stop with the reply recorded and the scope limited to the 3 commits. T-02-19 (game reload): the live script showed zero navigations on the mid-game tab across the deploy. T-02-20 (early or repeated push): one `git push origin main` after A-READY, gated on a fresh fetch, and `origin/main is B` confirmed. T-02-21 (untracked files): changed-file list shown and `.claude/plans` returned 404 on GitHub.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 2 plans are all executed. The phase needs verification, with the five pending real-device checks (three install checks from 02-04, two update checks above) as end-of-phase UAT items.
- The live site is on B; the deploy policy (D-17, D-18) and the live PWA smoke step are enforced by CI from this deploy on.
- The docs-only `docs(02-05)` commit created by this plan is local only; pushing it is a later decision for the owner.

## Self-Check: PASSED

- origin/main equals main at push time (`5ad072d5e925918f4f10c1057251d4e781df0892`); this plan's own docs commit stays local.
- Run 36961311133 concluded success on every step including "Smoke check live PWA files".
- live-update.mjs printed A-READY and B-LIVE and `"ok":true` with an empty errors array; `.claude/plans` returned 404 on GitHub.
- No repository files were created or modified by the plan itself apart from this SUMMARY.

---
*Phase: 02-installable-with-safe-updates*
*Completed: 2026-10-01*
