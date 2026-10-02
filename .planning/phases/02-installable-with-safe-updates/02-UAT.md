---
status: testing
phase: 02-installable-with-safe-updates
source: [02-VERIFICATION.md]
started: 2026-10-02T14:10:00Z
updated: 2026-10-02T14:10:00Z
---

## Current Test

number: 1
name: Push and deploy the gap-closure commits, then confirm the live site carries them
expected: |
  origin/main moves past 5ad072d. After the deploy workflow's live PWA smoke step passes, the live JS bundle hash differs from index-CUOxyC5q.js and the setup screen still opens. Until then the live site still has the CR-01 defect even though the codebase does not.
awaiting: user response

## Tests

### 1. Push and deploy the gap-closure commits, then confirm the live site carries them
expected: origin/main moves past 5ad072d. After the deploy workflow's live PWA smoke step passes, the live JS bundle hash differs from index-CUOxyC5q.js and the setup screen still opens.
result: [pending]

### 2. Android Chrome install
expected: Setup screen shows "Install this game"; installing puts the gold cross icon on the device; the installed app opens https://avocadopanic.github.io/pilgrims-predestined-path/ in its own window; the button is gone inside the installed app.
result: [pending]

### 3. Desktop Chrome or Edge install, including the button after a dismissed prompt
expected: Install works from the setup button; after dismissing the browser dialog the "Install this game" button does not return until the browser fires beforeinstallprompt again; the installed app opens in its own window with the gold cross.
result: [pending]

### 4. iPhone or iPad Safari Add to Home Screen (gates PWA-02)
expected: Setup shows "On iPhone or iPad: tap Share, then Add to Home Screen"; the Home Screen icon is the gold cross labelled "Pilgrim's Path" (not a page screenshot); it opens the game; neither the instructions nor the Install button show inside the installed app.
result: [pending]

### 5. Setup-screen device update, including the "Loading the new version..." state
expected: On a device that held an older build, after full close and reopen the setup screen shows "A new version will load when you start."; pressing Submit to Providence shows "Loading the new version..." with Start and the pilgrim buttons disabled, reloads once and begins the game with the chosen pilgrim count; the footer then reads the new build id.
result: [pending]

### 6. In-game device never reloads
expected: On a device with a game in progress on an older build, switching away and back never reloads or shows update text; after Play Again the setup screen shows the hint and Start loads the new build.
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps
