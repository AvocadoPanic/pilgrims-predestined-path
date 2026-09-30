---
phase: 01-live-on-github-pages
plan: 05
subsystem: infra
tags: [github-pages, github-actions, live-verification, consent-gate, playwright-core]

requires:
  - phase: 01-live-on-github-pages
    provides: "origin/main at 8e6dc30 with deploy.yml and a green first CI run (plan 01-04); self-hosted fonts and build-output gate (plan 01-02); workflow and stack docs (plan 01-03)"
provides:
  - "GitHub Pages source switched from legacy branch build to GitHub Actions (build_type workflow), with the user's verbatim go-ahead"
  - "Live game at https://avocadopanic.github.io/pilgrims-predestined-path/ served from the Actions-built dist/"
  - "Live evidence: every asset 200 under the base path, no Google Fonts traffic, no-slash URL lands on the game, scripted 2/3/4-player games reach victory with clean consoles"
affects: [phase 1 verification, phase 2 and later (live deploy is the delivery path)]

actuals:
  tokens: 0
  tasks: 2
  commits: 0
plan_head_before: 30b7472947b847abc8448f5fa4a86e6913a32125

tech-stack:
  added: []
  patterns:
    - "Repository settings change only after a verbatim consent reply recorded in SUMMARY"
    - "Live verification by cache-busted asset crawl plus scripted whole-game runs in Edge via playwright-core (scratchpad only)"

key-files:
  created: []
  modified: []

key-decisions:
  - "Switched Pages build_type to workflow only after the user replied flip-now at the STOP 2 checkpoint; no other repository setting was touched"
  - "Redeployed from main with workflow_dispatch; no rollback was needed, so the unverified legacy undo command (RESEARCH A2) was never run"
  - "30b7472 and this plan's tracking commits stay local and unpushed, per the user's scope limit"

requirements-completed: [DEPL-02, DEPL-03]

duration: 5min
completed: 2026-09-30
status: complete

coverage:
  - id: D1
    description: "GitHub Pages source is GitHub Actions (build_type workflow)"
    requirement: DEPL-02
    verification:
      - kind: other
        ref: "gh api repos/AvocadoPanic/pilgrims-predestined-path/pages --jq .build_type -> workflow"
        status: pass
    human_judgment: false
  - id: D2
    description: "workflow_dispatch run of deploy.yml on main succeeds through deploy-pages and the live smoke step"
    requirement: DEPL-02
    verification:
      - kind: integration
        ref: "gh run watch 36779326540 --exit-status -> success"
        status: pass
    human_judgment: false
  - id: D3
    description: "Every asset the live page references loads under /pilgrims-predestined-path/ with 200, no Google Fonts references"
    requirement: DEPL-03
    verification:
      - kind: integration
        ref: "live asset check node one-liner -> live assets ok"
        status: pass
    human_judgment: false
  - id: D4
    description: "Scripted 2-, 3- and 4-player games on the live URL reach SOLI DEO GLORIA with zero errors, failed responses or third-party requests"
    requirement: DEPL-03
    verification:
      - kind: e2e
        ref: "scratchpad ppp-playcheck/play.mjs against the live URL, players 2, 3, 4 -> won:true, empty errors/bad/thirdParty"
        status: pass
    human_judgment: false
  - id: D5
    description: "Favicon recognizable at tab size, EB Garamond rendering, and a human-played game on the live site"
    verification: []
    human_judgment: true
    rationale: "Tab-size legibility of the icon and typeface look are visual judgments no script asserts; the plan queues them for the end-of-phase human check"
---

# Phase 01 Plan 05: Pages source switch and live verification Summary

**GitHub Pages now serves the Actions-built game at https://avocadopanic.github.io/pilgrims-predestined-path/ after the user's flip-now go-ahead; all seven live assets return 200 under the base path with no Google Fonts traffic, and scripted 2-, 3- and 4-player games reach SOLI DEO GLORIA with clean consoles.**

## Performance

- **Duration:** 5 min in this continuation (plus the earlier checkpoint stop)
- **Started:** 2026-09-30T21:25:18Z (continuation, Task 2)
- **Completed:** 2026-09-30T21:28:24Z
- **Tasks:** 2 (Task 1 checkpoint answered, Task 2 executed)
- **Files modified:** 0 repository source files (remote setting change only)

## Accomplishments

- Task 1 consent recorded. User reply at the STOP 2 checkpoint, verbatim: "flip-now".
- Pre-switch setting (verify output at the checkpoint): `legacy main /`. The live URL then served the raw source index.html (%BASE_URL%, /src/main.jsx, no assets/index-*).
- Post-switch setting: `gh api repos/AvocadoPanic/pilgrims-predestined-path/pages --jq .build_type` prints `workflow` (the PUT exited 0; https_enforced is still true).
- Redeploy: `gh workflow run deploy.yml --ref main` produced run 36779326540, https://github.com/AvocadoPanic/pilgrims-predestined-path/actions/runs/36779326540, conclusion `success`. Every step succeeded: checkout, setup-node, `npm ci`, `npm test`, `npm run build`, configure-pages, upload-pages-artifact, deploy-pages, "Smoke check live page". The only annotation is GitHub's notice that ubuntu-latest moves to Ubuntu 26 on 2026-10-19.
- Live asset check printed `live assets ok` (cache-busted fetch; every src/href starts with /pilgrims-predestined-path/; every url() in the stylesheet resolved; no fonts.googleapis.com in the page or assets):

```
200 /pilgrims-predestined-path/favicon.svg
200 /pilgrims-predestined-path/assets/index-BTnDGnOg.js
200 /pilgrims-predestined-path/assets/index-ZwkYASXi.css
200 /pilgrims-predestined-path/assets/eb-garamond-latin-400-normal-BCNrxLz_.woff2
200 /pilgrims-predestined-path/assets/eb-garamond-latin-400-italic-DSEbMgZu.woff2
200 /pilgrims-predestined-path/assets/eb-garamond-latin-600-normal-DHwxsLHv.woff2
200 /pilgrims-predestined-path/assets/eb-garamond-latin-700-normal-D7LhwqnD.woff2
live assets ok
```

- No-trailing-slash check (backstop truth): `200 https://avocadopanic.github.io/pilgrims-predestined-path/ no-slash ok`. Requesting the URL without the slash ends on the trailing-slash URL and the page contains the built /pilgrims-predestined-path/assets/index- reference.
- Live scripted games (play.mjs, playwright-core in Microsoft Edge, run from the scratchpad against the live URL):

```
{"players":2,"clicks":153,"won":true,"errors":[],"warnings":[],"bad":[],"thirdParty":[]}
{"players":3,"clicks":95,"won":true,"errors":[],"warnings":[],"bad":[],"thirdParty":[]}
{"players":4,"clicks":67,"won":true,"errors":[],"warnings":[],"bad":[],"thirdParty":[]}
```

## Task Commits

No per-task commits: this plan changes a remote repository setting and verifies the live site, and its frontmatter lists no modified files.

1. **Task 1: STOP 2 checkpoint** - no commit (answered "flip-now")
2. **Task 2: Switch Pages, redeploy, verify live** - no commit (remote setting change and read-only checks)

**Plan metadata:** recorded in the docs(01-05) commit that adds this SUMMARY (local only, not pushed). `plan_head_before` is 30b7472, the unpushed 01-04 tracking commit.

## Files Created/Modified

- None in the repository. Scratchpad only, never committed: `ppp-playcheck/play.mjs` (reused from plan 01-02).

## Decisions Made

- Changed the Pages source only after the verbatim "flip-now" reply, and changed no other repository setting (threat T-01-19 mitigated).
- Deployed with `--ref main` only (T-01-22). No rollback was run, so the legacy undo form from RESEARCH A2 remains unverified.
- Left 30b7472 and the plan tracking commits local; nothing was pushed.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. RESEARCH A3 (page_url trailing slash) and A6 (propagation delay) did not bite: the in-workflow smoke step and the cache-busted live check both passed on the first run. The earlier 01-04 observation that Pages steps succeeded under the legacy source is now moot.

## Human check (queued for end-of-phase review)

Not performed by the executor. Open https://avocadopanic.github.io/pilgrims-predestined-path/ in a normal browser, hard-reload, and confirm: the gold-cross-on-dark-square tab icon is recognizable at tab size; title and text render in EB Garamond, not Georgia; a 2-player game reaches SOLI DEO GLORIA; the Network tab filtered on "google" shows no fonts.googleapis.com or fonts.gstatic.com and no 404 rows; the Console shows no errors. Reply "approved" or describe what differs.

## Known Stubs

None. No source files were created or modified.

## Threat Flags

None. No new network endpoints, auth paths or schema changes were introduced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 1 plans are all executed; the live site is up and every push to main will deploy through Actions.
- Pending: the end-of-phase human check above, then phase verification.
- Local main is ahead of origin/main by 30b7472 and the 01-05 tracking commits (docs only). Pushing them needs the user's go-ahead.

## Self-Check: PASSED

- `gh api .../pages --jq .build_type` printed `workflow`.
- Run 36779326540 concluded `success`; live assets ok; no-slash ok; three play.mjs lines with `"won":true` and empty errors, bad and thirdParty.
- `git rev-list --count 30b7472..HEAD` was 0 before this SUMMARY, consistent with `actuals.commits: 0` and no code changes.
- No local servers started; play.mjs closes its Edge instance (`browser.close()`).

---
*Phase: 01-live-on-github-pages*
*Completed: 2026-09-30*
