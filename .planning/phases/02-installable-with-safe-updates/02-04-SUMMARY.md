---
phase: 02-installable-with-safe-updates
plan: 04
subsystem: infra
tags: [pwa, github-pages, github-actions, release, service-worker, manifest]

requires:
  - phase: 02-installable-with-safe-updates
    provides: "plans 02-01 to 02-03: worker, update path, build gate, icons, install row, kill switch docs, and the ci(02-03) commit that marks the release split"
provides:
  - "Release A (82e2eac) live on origin/main: the first service worker and the web manifest are served under /pilgrims-predestined-path/"
  - "A passing deploy run for A (every step success, including the live page smoke check)"
  - "Live proof of PWA file availability, manifest identity, Edge installability, the install row, the iPhone instructions and the build SHA footer"
  - "Three real-device install checks queued as pending end-of-phase UAT items"
affects: [02-05 deploy as build B and the live two-deploy update check, 02-VERIFICATION, 02-UAT]

plan_head_before: a8f1a169155629f73535a2356c0ff929bddb4aff

actuals:
  tokens: 0
  tasks: 2
  commits: 0

tech-stack:
  added: []
  patterns:
    - "Push a single SHA to the remote ref (git push origin <A>:refs/heads/main) so later local commits cannot leak into a release"
    - "Re-run the full pre-push gate and re-confirm the approved commit list after a fresh fetch immediately before a one-way push"

key-files:
  created: []
  modified: []

key-decisions:
  - "The user's reply 'push' was treated as 'push-a', the only push option offered; the orchestrator told the user so before dispatching this continuation"
  - "Only release A was pushed; local main (a8f1a16), C (5d1bb46) and every later commit stay local until STOP B in plan 02-05"

requirements-completed: [PWA-01, PWA-02]

coverage:
  - id: D1
    description: "Release A is on origin/main and its deploy.yml run concluded success on every step"
    requirement: PWA-01
    verification:
      - kind: other
        ref: "git fetch origin && git rev-parse origin/main (82e2eacd0a20e8321ac50a7ebde3f0c1b0c90431)"
        status: pass
      - kind: other
        ref: "gh run view 36954506320 (conclusion success, all 13 steps success)"
        status: pass
    human_judgment: false
  - id: D2
    description: "The live manifest, sw.js and four icon PNGs return 200 under /pilgrims-predestined-path/ and the manifest id, scope and start_url resolve under that path"
    requirement: PWA-01
    verification:
      - kind: other
        ref: "node fetch probe (plan verify command 4): LIVE PWA OK, identity ok"
        status: pass
    human_judgment: false
  - id: D3
    description: "Edge finds the live app installable with no manifest or installability errors; the install row, the iPhone instructions and the build SHA footer behave as decided"
    requirement: PWA-02
    verification:
      - kind: e2e
        ref: "node $SCRATCHPAD/ppp-pwacheck/install.mjs installable <live url> (ok true, no errors)"
        status: pass
      - kind: e2e
        ref: "node $SCRATCHPAD/ppp-pwacheck/install.mjs row <live url> (ok true, footer v 82e2eac)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Real-device installs (Android Chrome, desktop Chrome or Edge, iPhone or iPad) give the gold cross icon, open the game in its own window and hide the install row inside the installed app"
    requirement: PWA-01
    verification: []
    human_judgment: true
    rationale: "Real install dialogs, launcher icons, Home Screen labels and OS app windows cannot be driven by automation on this machine; queued as end-of-phase UAT"

duration: 8min
completed: 2026-10-01
status: complete
---

# Phase 2 Plan 04: Release A Summary

**Release A (82e2eac, every Phase 2 change except the deploy.yml policy commit) pushed alone to origin/main after the owner's go-ahead; its deploy passed and the live manifest, service worker, icons, Edge installability, install row and build SHA footer all check out under /pilgrims-predestined-path/.**

## Performance

- **Duration:** about 8 min for this continuation (Task 1 preparation was done by the previous executor, with no repository changes)
- **Completed:** 2026-10-02T02:14Z (2026-10-01 local)
- **Tasks:** 2 of 2 (Task 1 resolved by the user's reply, Task 2 executed)
- **Files modified:** 0 repository files (this plan publishes commits; it changes none)

## Accomplishments

- STOP A answered by the user; release A pushed with `git push origin 82e2eacd0a20e8321ac50a7ebde3f0c1b0c90431:refs/heads/main` (no force, no tags, no other ref). origin/main moved 8e6dc30 -> 82e2eac.
- The deploy.yml run for A succeeded on every step, including the live page smoke check.
- Live checks passed against https://avocadopanic.github.io/pilgrims-predestined-path/ (outputs below).
- Three real-device checks are recorded as pending UAT items (below).

## Task 1: STOP A (blocking-human decision)

- **User reply, verbatim:** `push` (typed by the user in the orchestrator session on 2026-10-01).
- **Interpretation:** the options offered were `push-a` (push release A only) and `hold`. The orchestrator read "push" as `push-a`, the only push option offered, and told the user so. The approval covers release A only.
- **Acceptance note:** the plan's acceptance criterion asks for the literal "push-a" or "hold". The reply was "push" and was mapped to "push-a" by the orchestrator as above. Both the raw reply and the mapping are recorded here.
- **A:** `82e2eacd0a20e8321ac50a7ebde3f0c1b0c90431` (7-char `82e2eac`), the parent of C.
- **C:** `5d1bb466ee11aa6c7cf4c96179a428c3b99d52d8` (`ci(02-03)`), changes only `.github/workflows/deploy.yml` ("split ok").

### Commits published by the push (27, `git log --oneline origin/main..A` after a fresh fetch, identical to the list the user approved)

```
82e2eac docs(02-03): document the PWA rules and the kill switch
91373a0 docs(02-02): complete icons and install row plan
048dc7f feat(02-02): show Install on Chromium and Share instructions on iPhone and iPad
9759554 test(02-02): add failing tests for the install row
31f4261 feat(02-02): make the game installable with its own icons
4fbd875 docs(02-01): update state and roadmap after plan completion
70d545e docs(02-01): complete update path and build gate plan
5a4adbc test(02-01): fail the build if the manifest or worker leaves the base path
0d54eeb feat(02-01): start the chosen game after an update and never reload a game in progress
3961f2d test(02-01): add failing tests for the start handoff and update controller
77deec8 feat(02-01): offer new versions on the setup screen and apply them on Start
2aca455 docs(02): create phase plan
9079f8a docs(phase-2): pattern map and deploy-policy decisions D-17, D-18
bb61a09 docs(phase-2): research and validation strategy
4afd779 docs(state): record phase 2 context session
1577bbe docs(02): capture phase context
ae7f013 docs(phase-01): add/update security threat verification
b1c58ea docs(phase-01): evolve PROJECT.md and STATE.md after phase 1
846c9bd docs(phase-01): complete phase execution
46ea281 docs(phase-01): add security threat verification
d74d5a9 test(01): complete UAT - 2 passed, 0 issues, 4 waived
7a03b97 test(01): persist human verification items as UAT
688916a docs(todo): add desktop readability feedback to UI pass todo
e491aea docs(01): add code review report
993a64a docs(01-05): update state, roadmap and requirements for plan 01-05
39bb07f docs(01-05): record Pages switch and live verification
30b7472 docs(01-04): record push of main and first CI run
```

## Task 2: Push, deploy watch, live checks

### Pre-push gate (run again immediately before the push)

- Precondition: `gh auth status` showed AvocadoPanic active with repo and workflow scopes; Edge present at `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`.
- `npm ci` (0 vulnerabilities), `npm test` (5 files, 62 tests passed), `npm run build` (built; PWA v1.3.0 generateSW, 8 precache entries, dist/sw.js generated), `git diff --quiet HEAD` (tracked tree clean), `git diff --quiet A HEAD -- src public index.html vite.config.js package.json package-lock.json scripts` (A's app files equal HEAD's), C changes only deploy.yml.
- Output: `split ok` and `pre-push gate ok`.
- Just before pushing, after a second `git fetch origin`: origin/main was still `8e6dc30c7dce9fdc573decf8ad30ada4ec90de51`, A still `82e2eacd...`, and the unpushed list was still 27 commits ("recheck ok").

### Push

```
To https://github.com/AvocadoPanic/pilgrims-predestined-path
   8e6dc30..82e2eac  82e2eacd0a20e8321ac50a7ebde3f0c1b0c90431 -> main
```

- After a fetch: `origin/main` = `82e2eacd0a20e8321ac50a7ebde3f0c1b0c90431` ("origin/main is A"). Local `main` unchanged at `a8f1a169155629f73535a2356c0ff929bddb4aff` (C and later commits still unpushed).

### Deploy run

- Run: https://github.com/AvocadoPanic/pilgrims-predestined-path/actions/runs/36954506320 (event push, headSha A, conclusion success). It had already finished when first listed after about 30 s; `gh run watch --exit-status` returned 0.
- Steps (job `deploy`, all success): Set up job; actions/checkout; actions/setup-node; npm ci; npm test; npm run build; actions/configure-pages; actions/upload-pages-artifact; actions/deploy-pages; Smoke check live page; Post setup-node; Post checkout; Complete job.
- A ran the pre-02-03 workflow. Its "Smoke check live page" step passed on the page alone; the manifest, worker and icon smoke checks arrive with build B.

### Live checks (https://avocadopanic.github.io/pilgrims-predestined-path/)

Command 4, files and identity:

```
200 manifest.webmanifest
200 sw.js
200 pwa-192x192.png
200 pwa-512x512.png
200 maskable-icon-512x512.png
200 apple-touch-icon-180x180.png
id /pilgrims-predestined-path/ scope /pilgrims-predestined-path/ start_url /pilgrims-predestined-path/ short_name Pilgrim's Path identity ok
LIVE PWA OK
```

Command 5, installability in Edge (headless):

```
{"mode":"installable","url":"https://avocadopanic.github.io/pilgrims-predestined-path/","headless":true,"ok":true,"manifestUrl":"https://avocadopanic.github.io/pilgrims-predestined-path/manifest.webmanifest","manifestErrors":[],"installabilityErrors":[],"icons":[{"src":"pwa-192x192.png","purpose":"any","status":200,"type":"image/png"},{"src":"pwa-512x512.png","purpose":"any","status":200,"type":"image/png"},{"src":"maskable-icon-512x512.png","purpose":"maskable","status":200,"type":"image/png"}],"errors":[]}
```

Command 6, install row, iPhone instructions and footer:

```
{"mode":"row","url":"https://avocadopanic.github.io/pilgrims-predestined-path/","headless":true,"ok":true,"desktop":{"prevented":true,"shown":true,"prompted":1,"backAgain":true,"stayedGone":true,"promptedAfter":1,"iosOnDesktop":false},"iphone":{"iosShown":true,"installButtons":0,"ua":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Mobile/15E148 Safari/604.1"},"footer":"v 82e2eac · 2026-10-02","errors":[]}
live footer shows A
```

- The live footer shows A's SHA `82e2eac` (RESEARCH A7 confirmed: GITHUB_SHA reaches the build step). The footer date is the UTC build date (2026-10-02), one day ahead of local time.
- Acceptance: `gh api repos/AvocadoPanic/pilgrims-predestined-path/contents/.claude/plans` returned HTTP 404, so the untracked plans folder was not pushed.

## Pending real-device checks (end-of-phase UAT items)

The game is now installable at https://avocadopanic.github.io/pilgrims-predestined-path/. Installing it on a phone before plan 02-05 lets the live two-deploy update check include that phone.

1. **Android Chrome install (SC1, D-07, D-11).** Open the live URL, tap "Install this game" on the setup screen, install, launch from the new icon. Expected: gold cross on a dark square; opens the setup screen at the live URL in its own window (no address bar), never a 404 or blank page; the install row is not shown inside the installed app. Status: pending.
2. **Desktop Chrome or Edge install (SC1, D-11, RESEARCH A4).** Open the live URL, click "Install this game", install, launch the installed app. Expected: own window with the gold cross icon in the title bar or taskbar; install row hidden inside it. After dismissing the install dialog once (a second browser profile is fine), note how long the button takes to come back (RESEARCH A4). Status: pending.
3. **iPhone or iPad Add to Home Screen (SC2, D-07, D-09, D-10, RESEARCH A1 and A3).** In Safari, read the setup screen ("On iPhone or iPad: tap Share, then Add to Home Screen"), then Share, Add to Home Screen, launch from the icon. Expected: gold cross on a dark square with no white frame (not a page screenshot); label "Pilgrim's Path"; opens the game; instructions hidden inside the Home Screen app. On an iPad, the instructions should also show when Safari requests the desktop site (A3). Status: pending.

## Task Commits

No task commits. This plan changes no repository files (`files_modified: []`); its only effect is the push of the existing commits. `plan_head_before` is the local HEAD at the start (`a8f1a16`) and `git rev-list --count a8f1a16..HEAD` was 0 before this SUMMARY commit, which is a docs-only close-out, not a code change.

**Plan metadata:** the `docs(02-04)` commit that adds this SUMMARY plus STATE.md and ROADMAP.md updates. It is a local commit only and is NOT part of the approved push.

## Decisions Made

- "push" was accepted as "push-a" on the orchestrator's stated interpretation; scope limited to release A, per the continuation instructions.
- Pushed by explicit SHA to `refs/heads/main` so nothing after A (including this plan's own docs commit) could ride along.

## Deviations from Plan

None - plan executed exactly as written. The one wording difference (the user typed "push", not the literal "push-a") is explained under Task 1, and the orchestrator resolved it before this continuation started.

## Issues Encountered

None. The deploy run had already completed by the time it was first queried, so no watching time was needed.

## Known Stubs

None. No files were created or modified. `.planning/WINDOWS.md` does not exist in this project, so nothing was appended to the broken-windows ledger; the three pending device checks are tracked above as UAT items.

## Threat Flags

None. No files were created or modified, and the push added no new endpoints or trust boundaries beyond those in the plan's threat model (T-02-14 to T-02-17 were each handled: blocking-human stop with a recorded reply and A-only scope; pre-push gate and identity check; commit list and `git status --short` shown and `.claude/plans` confirmed absent on GitHub; every live file fetched and probed).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for 02-05: C (`5d1bb46`, the deploy.yml policy commit) and the later local commits are the unpushed build B. Plan 02-05 has its own STOP B and the first live two-deploy update check, which will use the worker now installed from A.
- Pending: the three real-device checks above, to be run by the user as part of end-of-phase UAT.

## Self-Check: PASSED

- origin/main equals A (`82e2eacd0a20e8321ac50a7ebde3f0c1b0c90431`); local main unchanged at `a8f1a16`.
- Run 36954506320 concluded success on every step.
- All live probes reported ok; `.claude/plans` returned 404 on GitHub.
- No repository files were created or modified by the plan itself apart from this SUMMARY.

---
*Phase: 02-installable-with-safe-updates*
*Completed: 2026-10-01*
