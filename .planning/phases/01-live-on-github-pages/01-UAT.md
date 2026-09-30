---
status: testing
phase: 01-live-on-github-pages
source: [01-VERIFICATION.md]
started: 2026-09-30T08:10:00Z
updated: 2026-09-30T08:10:00Z
---

## Current Test

number: 1
name: Real-browser hard reload with DevTools open
expected: |
  Console has no errors. Network shows no request to fonts.googleapis.com or fonts.gstatic.com and no 404 rows (favicon included).
awaiting: user response

## Tests

### 1. Real-browser hard reload with DevTools open
Open https://avocadopanic.github.io/pilgrims-predestined-path/ in a normal browser (Chrome or Firefox, not headless) and hard-reload (Ctrl+Shift+R) with DevTools open. Check the Console, and the Network tab filtered on "google" and on 4xx status.
expected: Console has no errors. Network shows no request to fonts.googleapis.com or fonts.gstatic.com and no 404 rows (favicon included).
result: [pending]

### 2. Favicon legibility at tab size
Look at the browser tab for the live URL.
expected: The gold cross on the near-black square is recognizable at tab size (D-04).
result: [pending]

### 3. EB Garamond renders
Read the page text on the setup screen and the play screen.
expected: Text renders in EB Garamond (italic and bold weights visible), not the Georgia fallback.
result: [pending]

### 4. One hand-played live game
Play one 2-player game by hand on the live URL from setup to SOLI DEO GLORIA.
expected: Game is playable and feels unchanged from the original.
result: [pending]

### 5. Consent gates honored
Confirm the two consent gates were honored.
expected: User recalls replying "push-now, commit config" (plan 01-04) and "flip-now" (plan 01-05) before those actions.
result: [pending]

### 6. Optional: SC3 live failing-test run
Dispatch deploy.yml on a throwaway non-main branch that contains a deliberately failing test.
expected: Run concludes failure at "Run npm test"; upload-pages-artifact, deploy-pages and the smoke check are skipped; the live page is unchanged.
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps
