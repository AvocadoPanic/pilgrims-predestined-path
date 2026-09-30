# Phase 2: Installable, With Safe Updates - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md. This log preserves the alternatives considered.

**Date:** 2026-09-30
**Phase:** 02-installable-with-safe-updates
**Areas discussed:** Update offer behavior, Install UI on setup, App name and icon art, Version id and kill switch

---

## Todo cross-reference

| Option | Description | Selected |
|--------|-------------|----------|
| Keep deferred (Recommended) | Leave the Game-feel UI pass for after Phase 6 | ✓ |
| Fold into Phase 2 | Do the visual pass now | |

---

## Update offer behavior

**Setup screen when a new version is waiting**

| Option | Description | Selected |
|--------|-------------|----------|
| Show an Update button (Recommended) | Banner with an Update button; reloads only on tap | |
| Apply silently on setup | Reload as soon as detected on setup | |
| Apply on 'Start' | Pressing Start reloads into the new version and starts the game with the chosen player count | ✓ |

**Should setup still say something (PWA-04 "offered")?**

| Option | Description | Selected |
|--------|-------------|----------|
| Small hint line (Recommended) | "A new version will load when you start." | ✓ |
| Fully invisible | Say nothing; reword PWA-04/SC3 | |

**End screen Play Again when an update is waiting**

| Option | Description | Selected |
|--------|-------------|----------|
| Go to setup as today (Recommended) | Start remains the single apply point | ✓ |
| Reload straight to setup | Second apply point | |
| Separate Update button | "Update now" next to Play Again | |

**Extra update checks for long-open installed apps**

| Option | Description | Selected |
|--------|-------------|----------|
| Also on return to foreground (Recommended) | `registration.update()` on visibility, throttled ~30 min | ✓ |
| Only on page load | Browser default | |
| Hourly timer | setInterval every hour | |

**Notes:** User preferred no extra tap over an explicit Update button.

---

## Install UI on setup

**Placement**

| Option | Description | Selected |
|--------|-------------|----------|
| Under the Start button (Recommended) | Quiet secondary row below Start | ✓ |
| Card near the top | Bordered card above the rules | |
| Small footer link | Text link at the bottom | |

**Dismissible?**

| Option | Description | Selected |
|--------|-------------|----------|
| No dismiss, always shown (Recommended) | Hides only when installed; no storage | ✓ |
| Dismissible, remembered | ppp:-prefixed key | |
| Dismissible for this visit | Until next load | |

**Voice**

| Option | Description | Selected |
|--------|-------------|----------|
| Plain now, themed in Phase 3 (Recommended) | Plain wording; Phase 3 copy module may add the joke | ✓ |
| Themed now | Light joke now, avoiding fatalist lines | |
| Themed label, plain instructions | Playful label, literal iOS steps | |

**iOS scope**

| Option | Description | Selected |
|--------|-------------|----------|
| iPhone + iPad, any browser (Recommended) | Generic wording; iPadOS-as-Mac detected by touch | ✓ |
| iPhone Safari only | Narrowest target | |
| Also Mac Safari | Add to Dock wording | |

---

## App name and icon art

**Home-screen label (short_name)**

| Option | Description | Selected |
|--------|-------------|----------|
| Pilgrim's Path (Recommended) | 14 chars; may truncate slightly on some iPhones | ✓ |
| Pilgrim Path | 12 chars, research's suggestion | |
| Predestined | 11 chars, less clear | |

**Icon art**

| Option | Description | Selected |
|--------|-------------|----------|
| Same ✠ as the favicon (Recommended) | favicon.svg unchanged; already fits maskable safe zone | ✓ |
| Bigger ✠ for install icons | ~75% cross except maskable | |
| Add a subtle glow/gradient | Richer art | |

**PNG production**

| Option | Description | Selected |
|--------|-------------|----------|
| Generate once, commit PNGs (Recommended) | One-off npx @vite-pwa/assets-generator | ✓ |
| Script in the repo | npm script plus dev dependency | |
| You decide | Planner picks | |

**Manifest description and screenshots**

| Option | Description | Selected |
|--------|-------------|----------|
| Description only (Recommended) | One plain sentence; no screenshots yet | ✓ |
| Description + screenshots | Richer dialog now, retake later | |
| Neither | Minimal manifest | |

---

## Version id and kill switch

**Where the build id is visible**

| Option | Description | Selected |
|--------|-------------|----------|
| Setup screen footer (Recommended) | Tiny muted text at the bottom of setup | ✓ |
| Setup + end screen | Both screens | |
| Console / title only | Nothing on screen | |

**Kill switch form**

| Option | Description | Selected |
|--------|-------------|----------|
| Documented flag + rehearsal (Recommended) | Doc plus one local rehearsal; nothing deployed | ✓ |
| Documented flag only | No rehearsal | |
| Standby sw.js file | Committed self-unregistering file | |

**Docs home**

| Option | Description | Selected |
|--------|-------------|----------|
| docs/PWA.md (Recommended) | One focused file | ✓ |
| README section | In the README | |
| .planning/ only | With planning docs | |

**Footer id format**

| Option | Description | Selected |
|--------|-------------|----------|
| SHA + build date (Recommended) | "v a1b2c3d · 2026-09-30"; dev shows "dev" | ✓ |
| SHA only | "v a1b2c3d" | |
| package.json version + SHA | "1.0.0 (a1b2c3d)" | |

---

## Claude's Discretion

- Start-after-reload handoff mechanism; where registerSW wiring lives
- Build-id injection mechanics
- Styling of hint, install row and footer within the current look
- Manifest display/orientation/colors/id per roadmap notes; default precache with no offline promise
- Whether to keep favicon.ico and the 64px icon
- Test shape beyond the SC5 build test

## Deferred Ideas

- macOS Safari "Add to Dock" instructions
- Manifest screenshots after the layout and UI passes
- Playful install/update wording in the Phase 3 copy module
- Game-feel UI pass todo (kept deferred to after Phase 6)
