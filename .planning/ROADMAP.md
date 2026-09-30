# Roadmap: The Pilgrim's Predestined Path

## Overview

The game exists today as one 481-line React component that has never run in production. This roadmap first gets that game live on GitHub Pages, then makes it installable with updates offered only between games, so every later phase ships through a live service worker. Next it pins the race rules with tests and rewrites the jokes that teach fatalism. Then it turns the board into a series of hard questions about Calvinism: first on the 18 special spaces, together with the verification pipeline every later quotation must pass, then on enough new spaces that about one draw in three raises a question, with an optional quiz. The last two phases make the game comfortable on a phone passed around a table or a projector across a room, and let players choose their Bible translation and play with no network. Every phase ends with something a player can see on the live site.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Live on GitHub Pages** - The existing game builds, tests and deploys on every push to `main`
- [ ] **Phase 2: Installable, With Safe Updates** - Install the game on Android, desktop Chromium or iPhone; new versions are offered between games, never mid-game
- [ ] **Phase 3: Honest Copy on a Tested Engine** - Same race, pinned by tests and replayable from a seed, with rules and jokes that no longer teach fatalism
- [ ] **Phase 4: Hard Questions on the Special Spaces** - The 18 named, trap, shortcut and landmark spaces each ask and answer a verified question
- [ ] **Phase 5: A Question Every Third Draw** - New question spaces deal from a verified pool, with an optional quiz and a small bonus
- [ ] **Phase 6: Phone and Projector Play** - Readable on one phone passed around a table and on a screen across a room
- [ ] **Phase 7: Your Translation, Even Offline** - Choose BSB, ESV, KJV or NET with proper credit; play the whole game with no network

## Phase Details

### Phase 1: Live on GitHub Pages

**Goal:** As a player, I want to open the game at its GitHub Pages address, so that I can play the existing race in any browser.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements**: DEPL-01, DEPL-02, DEPL-03
**Success Criteria** (what must be TRUE):

  1. Anyone can open https://avocadopanic.github.io/pilgrims-predestined-path/ and play a 2 to 4 player game from the setup screen through victory at space 133.
  2. `npm run dev`, and `npm run build` followed by `npm run preview`, both open the game with no console errors.
  3. A push to `main` runs the tests, builds and deploys through GitHub Actions with no manual step, and a failing test stops the deploy.
  4. The live page loads every script, style, font and icon from under `/pilgrims-predestined-path/` with no 404s and makes no requests to fonts.googleapis.com.

**Plans:** 1/5 plans executed

Plans:
**Wave 1**

- [x] 01-01-PLAN.md - Walking skeleton: package legitimacy gate, then the tracer (React 19 + Vite 8 build served under the base path, smoke-tested)

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 01-02-PLAN.md - Self-hosted EB Garamond, gold-cross favicon and theme color, build-output gate, scripted games in dev and preview
- [ ] 01-03-PLAN.md - SHA-pinned GitHub Actions workflow gated by npm test; CLAUDE.md stack docs (D-03)

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 01-04-PLAN.md - STOP 1 go-ahead, then push main and confirm CI install, test and build pass

**Wave 4** *(blocked on Wave 3 completion)*

- [ ] 01-05-PLAN.md - STOP 2 go-ahead, then switch Pages to Actions, redeploy and verify the live game

**UI hint**: no

**Notes:**

- USER GO-AHEAD REQUIRED: switching the Pages source from the legacy branch build (`main`, `/`) to GitHub Actions is a repo-setting change. Stop and ask the user before flipping it; research advises flipping only once a building app is on `main`.
- Known breakage to fix (from PROJECT.md Context and `.planning/codebase/`): `src/main.jsx` imports a missing `./App` and calls `ReactDOM.render`; `vite.config.js` has no React plugin; `.github/workflows/deploy.yml` is invalid YAML with no build step and publishes `./docs`; no lockfile or `.gitignore`; `index.html` references an absolute `/vite.svg` icon.
- No gameplay or wording changes here. Do not register a service worker yet (Phase 2). A small smoke test is enough to give CI something to run; the characterization suite arrives in Phase 3.

### Phase 2: Installable, With Safe Updates

**Goal:** As a player, I want to install the game on my phone or computer and get new versions between games, so that it opens like an app and an update never ends a game in progress.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements**: PWA-01, PWA-02, PWA-04
**Success Criteria** (what must be TRUE):

  1. On Android or desktop Chromium, the setup screen shows an Install button; installing puts the game's icon on the device, and the installed app opens the game at https://avocadopanic.github.io/pilgrims-predestined-path/ in its own window, never a 404 or a blank page.
  2. On an iPhone in Safari, the setup screen shows short "Share, then Add to Home Screen" instructions; the Home Screen icon is the game's own icon (not a page screenshot) and opens the game; neither the Install button nor the instructions appear when the game is already running as an installed app.
  3. After a new version is deployed, a returning player is offered the update on the setup or end screen instead of being left on the old version, and accepting it loads the new version.
  4. A game in progress never reloads: if a new version arrives mid-game, play continues to the end screen, where the update is offered.
  5. The live manifest, service worker and icons load from under `/pilgrims-predestined-path/`, and a build test fails if the manifest's `scope`, `start_url` or `id` leaves that path, or if the 192, 512 or separate maskable icon or the 180x180 apple-touch-icon is missing.

**Plans:** TBD
**UI hint**: yes

**Notes:**

- Inserted at the user's request ("Approve, install early") so players can install the game from the start. Offline completeness (PWA-03) and the "Ready to play offline" notice (PWA-05) stay in Phase 7, where the offline check can cover every question, verse and the credits panel.
- What install needs (from research, STACK.md and PITFALLS.md): `vite-plugin-pwa` (`generateSW`) with `registerType: 'prompt'`, decided now because switching away from `autoUpdate` later is painful; manifest `scope`, `start_url` and `id` all under `/pilgrims-predestined-path/` (let the plugin derive `scope` and `start_url` from Vite's `base`; add `id`); `display: standalone`; `theme_color` and `background_color` matching the game's dark background (`#0a0608`, `pilgrims-predestined-path.jsx:390`); icons at 192 and 512 (`purpose: any`), a separate 512 maskable icon (not `"any maskable"`), and an opaque 180x180 apple-touch-icon linked from `index.html`; icon `src` values relative to the manifest.
- Service worker rules: keep the filename (`sw.js`) and scope stable forever once shipped; keep `cleanupOutdatedCaches: true`; document a kill-switch (a self-unregistering `sw.js`) in the repo. Research also recommends a visible build id (for example a short git SHA) so "which version is this?" has an answer during update checks.
- The update offer uses the setup and end screens, which exist from Phase 1. Test the service worker with `npm run build` and `npm run preview`, not `vite dev`.
- The service worker stays live through every later content phase (3 to 7). A plain reload does not activate a waiting worker, so a broken update path shows up as players stuck on an old build. Each later phase's verification therefore includes a two-deploy update check: deploy build A and load it, deploy build B with a visible change, reopen and confirm B is offered on the setup or end screen and loads when accepted (not stale); then start a game on A, deploy B mid-game, and confirm the game is not reloaded.
- Needs real-device tests: install on Android Chrome and desktop Chrome or Edge; Add to Home Screen on an iPhone (icon and launch URL); the two-deploy update check on the live site.

### Phase 3: Honest Copy on a Tested Engine

**Goal:** As a player, I want to play the same race with rules and jokes that no longer teach fatalism, so that the humor is accurate.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements**: ENG-01, ENG-02, ACC-04, ACC-05, ACC-06
**Success Criteria** (what must be TRUE):

  1. The race plays exactly as before (color, double and character cards; traps; shortcuts; deck rebuild; turn order; victory at 133), confirmed by tests written against the current behavior before any refactor and passing in CI.
  2. Starting a game from the same seed replays the identical sequence of cards and moves.
  3. The rules text, TULIP summary, taglines, buttons and end screen no longer say or imply that choices are fake ("There are no decisions", "The outcome is fixed" and "Play Again (as if you had a choice)" are replaced by jokes that are still funny), and a test fails the build if any old fatalist phrase returns.
  4. The setup-screen epigraph is a quotation a player can find at its cited place in a named edition, replacing the line misattributed to Institutes III.21.5.
  5. No screen calls any player elect, reprobate or passed over; the end screen no longer says the others "were never going to arrive".

**Plans:** TBD
**UI hint**: yes

**Notes:**

- Research recommends doing this rewrite early: it has no content dependencies and removes the most visible inaccuracies from the live site.
- Order inside the phase: characterization tests first, then engine extraction with a seeded RNG, then moving all user-facing wording into one copy module so the rewrite touches one file.
- All five TULIP glosses need rewriting (Limited Atonement is currently glossed as reprobation). Research's suggested epigraph is Beveridge, Institutes III.24.5 ("Christ, then, is the mirror..."); confirm it against Beveridge's text. Its formal verification record is added when the Phase 4 pipeline lands.
- Service worker is live (Phase 2): verification includes the two-deploy update check.

### Phase 4: Hard Questions on the Special Spaces

**Goal:** As a player, I want to meet a hard question on each special space, so that I get funny answers I can check.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements**: ACC-01, ACC-02, ACC-03, ACC-07, ACC-08, QST-02, QST-05, QST-06, QST-07, QST-08, QST-09, QST-10
**Success Criteria** (what must be TRUE):

  1. Landing on any of the 18 named, trap, shortcut and landmark spaces opens that space's own question card (e.g. Sea of Providence: "If God has already decided everything, why pray?"), showing a one-line quip, a plain two-to-three sentence answer, and an expandable "Go deeper" with a fuller explanation, citations and a one-line discussion prompt.
  2. Special-space timing is right: a trap asks its question once on landing, not on each turn spent stuck; a shortcut shows its question and then moves the pilgrim; a second landing on an already-asked space shows only the quip and a "Show answer again" button.
  3. Cards are framed as "What Reformed Christians say"; comparison cards state Catholic, Lutheran and Arminian positions from those traditions' own sources; the six character spaces deliver their quip in character with no invented quotation attributed to a real person; ribbing of Catholics stays good-natured and at the level of culture.
  4. Every quotation and citation that ships (including the Phase 3 epigraph) has a verification record with edition, source URL and date checked; the build fails if one is missing; public-domain quotations match their source text word for word; confessions and theologians are quoted from the named public-domain editions.
  5. Quips and plain answers read at about a grade 6 to 8 level; heavy topics use warm, non-graphic wording; the Slough of Despond, Dark Night of the Soul and Valley of the Shadow cards are warm rather than satirical.

**Plans:** TBD
**UI hint**: yes

**Notes:**

- Build the content schema and verifier before authoring; the verifier, reading-level and tone rules then gate all later content, including the Phase 5 pool. The 18 fixed questions are verified first because their spaces are on the board in every game.
- Verses render in BSB (public domain) until Phase 7 adds the translation picker.
- Research gaps to close here: no public-domain Heidelberg Catechism or Luther (Cole) text has been opened yet; WCF references were checked against the American text and must be re-checked against the original 1646/1647 text (chapters 20, 23, 25 and 31 differ); keep the WCF 25.6 "Antichrist" clause out of player-facing text; the "Castle of Rome" framing needs rework so Catholic teaching is stated in the Church's own words.
- Service worker is live (Phase 2): verification includes the two-deploy update check.

### Phase 5: A Question Every Third Draw

**Goal:** As a player, I want to face a question on about one draw in three, with an optional quiz, so that each game covers the core questions.
**Mode:** mvp
**Depends on:** Phase 4
**Requirements**: QST-01, QST-03, QST-04, QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04, QUIZ-05
**Success Criteria** (what must be TRUE):

  1. A seeded simulation test holds the rate at 0.30 to 0.36 questions per draw; question spaces carry a visible marker but keep their color, so card movement is unchanged.
  2. Generic question spaces deal from a pool with no repeats within a game, starting with the core set (fatalism, why pray, why evangelize, how can I know I'm elect, each worded differently from its fixed-space version); if the pool runs out the space acts as a rest stop, and simulation shows fewer than 1% of 4-player games run out.
  3. Setup has a Quiz mode toggle, off by default; with it on, the active player picks one of 3 options or Pass before the answer is revealed, with no timer.
  4. The reveal marks the right option with an icon and text (not color alone) and names the misconception behind each wrong option; a wrong answer or Pass costs nothing and the answer is still shown.
  5. A correct answer moves the pilgrim forward 2 plain spaces, skipping traps, shortcuts and question spaces; the bonus never passes space 132, never triggers another question, and is not given while trapped.

**Plans:** TBD
**UI hint**: yes

**Notes:**

- Pool authoring (40 or more questions, each passing the Phase 4 verifier) is the long tail of the project. Quiz options are also added to the 18 fixed questions.
- Rerun the placement simulation on the real engine to pick question spaces; keep new ones off spaces 126 to 132 (endgame overshoot). Markers are an overlay flag on a space, not a new color or type, or card reachability changes.
- Research found the fixed "why pray?" space is reached in only about 20% of 4-player games, which is why the core set is dealt first.
- Service worker is live (Phase 2): verification includes the two-deploy update check.

### Phase 6: Phone and Projector Play

**Goal:** As a group sharing one phone or a projector, I want to read the board and cards without zooming, so that everyone can follow.
**Mode:** mvp
**Depends on:** Phase 5
**Requirements**: LAY-01, LAY-02, LAY-03, LAY-04, LAY-05, LAY-06
**Success Criteria** (what must be TRUE):

  1. On a phone in portrait, a player can read the board (the view follows the active pilgrim) and the question card (a bottom sheet) without zooming.
  2. On a laptop or projector in landscape, a group can read the board and the question card from across a room.
  3. A player can switch on Large text, and all text meets WCAG AA contrast (4.5:1 for normal text) against its background, checked by a test.
  4. After each turn the screen shows "Pass to [next pilgrim]", and on browsers that support Screen Wake Lock the screen stays awake for the whole game.

**Plans:** TBD
**UI hint**: yes

**Notes:**

- Needs a prototype and a real-device check: a phone in portrait (including iOS Safari's moving toolbars and safe areas, in Safari and in the installed Home Screen app from Phase 2) and a 1080p projector or large display.
- Placed after the question card and quiz exist so the layout is validated against every gameplay screen once.
- Service worker is live (Phase 2): verification includes the two-deploy update check.

### Phase 7: Your Translation, Even Offline

**Goal:** As a player, I want to pick my Bible translation and play with no network, so that I can play anywhere.
**Mode:** mvp
**Depends on:** Phase 6
**Requirements**: BIB-01, BIB-02, BIB-03, BIB-04, BIB-05, BIB-06, PWA-03, PWA-05
**Success Criteria** (what must be TRUE):

  1. A player chooses BSB, ESV, KJV or NET at setup or from an in-game menu; quoted verses switch to that translation with its abbreviation and a "read in context" link; the choice and the Large text setting are remembered on that device under a storage key unique to this game.
  2. A credits panel shows each translation's required notice (the full ESV notice, the NET acknowledgment linking netbible.org, a BSB courtesy credit, a KJV public-domain note); tests enforce the ESV limits (at most 500 verses, no more than half of any book, under 25% of the work) and the linked "(NET)" label; plain answers never depend on one translation's wording, and "Go deeper" notes where translations differ on Acts 13:48, Romans 9:22 and 1 Timothy 2:4.
  3. After one visit, with the network off, the whole game works in a browser tab and in the installed app: all questions, all four translations' verses, fonts, icons and the credits panel.
  4. The player sees a one-time "Ready to play offline" message, and external links are labeled as needing internet.

**Plans:** TBD
**UI hint**: yes

**Notes:**

- Translations and offline completeness share one phase because they share the offline concerns: bundled verse text, a credits panel that works offline, "read in context" links that need a network label, and namespaced storage (GitHub Pages serves all of the user's repos from one origin).
- The service worker has been live since Phase 2; this phase makes sure its precache covers the finished content, so the offline check covers every question, all four verse stores and the credits panel.
- ESV ships on our reading of Crossway's "commentary" clause (user's decision; revisit if Crossway objects). NET is held to the ESV caps as policy. Still unverified: KJV UK Crown patent wording and NET numeric caps.
- Needs real-device tests: an airplane-mode translation switch and credits check, including in iOS installed mode, and the two-deploy update check (service worker live since Phase 2).

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Live on GitHub Pages | 1/5 | In Progress|  |
| 2. Installable, With Safe Updates | 0/TBD | Not started | - |
| 3. Honest Copy on a Tested Engine | 0/TBD | Not started | - |
| 4. Hard Questions on the Special Spaces | 0/TBD | Not started | - |
| 5. A Question Every Third Draw | 0/TBD | Not started | - |
| 6. Phone and Projector Play | 0/TBD | Not started | - |
| 7. Your Translation, Even Offline | 0/TBD | Not started | - |
