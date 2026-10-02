# Requirements: The Pilgrim's Predestined Path

**Defined:** 2026-09-29
**Core Value:** Every hard question the game raises gets an answer that is both funny and correct, with Scripture and confession citations anyone can check.

## v1 Requirements

Requirements for the initial release. Each maps to a roadmap phase.

### Deploy

- [x] **DEPL-01**: Player can open the game locally from `npm run dev` and a production build (`npm run build` then `npm run preview`) with no console errors
- [x] **DEPL-02**: Player can open the live game at https://avocadopanic.github.io/pilgrims-predestined-path/; every push to `main` runs tests, builds and deploys through GitHub Actions (Pages source switched to Actions only with the user's go-ahead)
- [x] **DEPL-03**: Every asset the page references (scripts, icons, fonts, manifest) loads under the `/pilgrims-predestined-path/` base path with no 404s

### Engine

- [ ] **ENG-01**: Existing race rules (color, double and character cards; traps; shortcuts; deck rebuild; turn order; victory at 133) behave as before, confirmed by automated tests written against the current behavior before any refactor
- [ ] **ENG-02**: A game can be replayed exactly from a seed, so tests and simulations are reproducible

### PWA

- [x] **PWA-01**: Player on Android or desktop Chromium can install the game from an Install button on the setup screen
- [x] **PWA-02**: Player on an iPhone sees short "Share, then Add to Home Screen" instructions on the setup screen
- [ ] **PWA-03**: After the first visit, the whole game works with no network: all questions, all four translations' verses, fonts, icons and the credits panel
- [x] **PWA-04**: When a new version is deployed, player is offered the update on the setup or end screen, and the game never reloads during play
- [ ] **PWA-05**: Player sees a one-time "Ready to play offline" confirmation, and external links are labeled as needing internet while offline

### Layout

- [ ] **LAY-01**: Player on a phone in portrait can read the board (the view follows the active pilgrim) and the question card (bottom sheet) without zooming
- [ ] **LAY-02**: A group can read the board and question card from across a room on a laptop or projector in landscape
- [ ] **LAY-03**: Player can switch on Large text
- [ ] **LAY-04**: All text meets WCAG AA contrast (4.5:1 for normal text) against its background
- [ ] **LAY-05**: After each turn the screen shows "Pass to [next pilgrim]"
- [ ] **LAY-06**: The screen stays awake during a game on browsers that support Screen Wake Lock

### Questions

- [ ] **QST-01**: About one draw in three lands on a question space (a seeded simulation test enforces 0.30 to 0.36 questions per draw); question spaces carry a visible marker and keep their color, so card movement is unchanged
- [ ] **QST-02**: Each of the 18 named, trap, shortcut and landmark spaces shows its own themed question (e.g. Sea of Providence: "If God has already decided everything, why pray?"; Slough of Despond: "How can I know I'm elect?")
- [ ] **QST-03**: Generic question spaces draw from a pool with no repeats within a game; each game deals a core set first (fatalism, why pray, why evangelize, how can I know I'm elect, each worded differently from its fixed-space version); if the pool runs out the space acts as a rest stop
- [ ] **QST-04**: The pool is large enough that fewer than 1% of 4-player games run out (simulation-checked; expected 40 or more questions)
- [ ] **QST-05**: Every question card shows a one-line quip, a plain two-to-three sentence answer, and an expandable "Go deeper" with fuller explanation, citations and a one-line discussion prompt
- [ ] **QST-06**: Cards are framed as "What Reformed Christians say"; comparison cards state Catholic, Lutheran and Arminian positions from those traditions' own sources
- [ ] **QST-07**: A second landing on an already-asked fixed space shows the quip and a "Show answer again" button, with no quiz and no bonus
- [ ] **QST-08**: A trap space's question appears once when the pilgrim lands there, not on each turn spent stuck
- [ ] **QST-09**: Landing on a shortcut shows that space's question first, then moves the pilgrim along the shortcut
- [ ] **QST-10**: The six character spaces (Brother Adam, John Knox, Martin Luther, Augustine, Lady Geneva, Queen Wisdom) deliver their quip in character, and no invented quotation is attributed to a real person

### Quiz

- [ ] **QUIZ-01**: Setup has a Quiz mode toggle, off by default
- [ ] **QUIZ-02**: In quiz mode the active player picks one of 3 options (or Pass) before the answer is revealed; there is no timer
- [ ] **QUIZ-03**: The reveal marks the right option with an icon and text (not color alone) and says which misconception each wrong option represents
- [ ] **QUIZ-04**: A correct answer moves the active pilgrim forward 2 plain spaces, skipping traps, shortcuts and question spaces; the bonus never goes past space 132, never triggers another question, and is not given while trapped
- [ ] **QUIZ-05**: A wrong answer or Pass has no penalty; the answer is still shown

### Bible

- [ ] **BIB-01**: Player chooses BSB, ESV, KJV or NET on the setup screen and can change it mid-game from a menu
- [ ] **BIB-02**: Quoted verses appear in the chosen translation followed by its abbreviation, with a "read in context" link when online
- [ ] **BIB-03**: A credits panel, reachable offline, shows each translation's required notice (the full ESV notice; the NET acknowledgment linking netbible.org; a BSB courtesy credit; KJV public-domain note)
- [ ] **BIB-04**: Bundled ESV text stays within Crossway's limits (at most 500 verses, no more than half of any book, under 25% of the work) and NET quotations are followed by "(NET)" linked to netbible.org, both enforced by automated tests
- [ ] **BIB-05**: The chosen translation and Large text setting are remembered between visits on the same device, under a storage key unique to this game
- [ ] **BIB-06**: Plain answers do not depend on one translation's wording; where translations differ on a key verse (Acts 13:48, Rom 9:22, 1 Tim 2:4) "Go deeper" says so

### Accuracy and tone

- [ ] **ACC-01**: Every quotation and citation in shipped content has a verification record (edition, source URL, date checked), and the build fails if any is missing
- [ ] **ACC-02**: Quotations from public-domain texts are checked mechanically against the source text (exact substring match)
- [ ] **ACC-03**: Confessions and theologians are quoted from named public-domain editions: Westminster Confession original 1646/1647 text, a public-domain English Canons of Dort, a public-domain Heidelberg Catechism translation, Calvin's Institutes in Beveridge's 1845 translation, Luther in Cole's translation
- [ ] **ACC-04**: The setup-screen epigraph (currently misattributed to Institutes III.21.5) is replaced with a verified quotation
- [ ] **ACC-05**: Rules text, TULIP summary, taglines, buttons and end screen no longer imply fatalism, and a test blocks the old fatalist phrases from returning
- [ ] **ACC-06**: No screen labels a real player as elect, reprobate or passed over
- [ ] **ACC-07**: Quips and plain answers are readable by children (about grade 6 to 8); heavy topics (reprobation, infants who die, people who never hear) use warm, non-graphic wording; quips on doubt and suffering spaces are warm rather than satirical
- [ ] **ACC-08**: Satire is aimed mainly at Calvinists; ribbing of Catholics stays good-natured and at the level of culture, never the Mass, Mary or the pope as a person, and never misstates Catholic teaching

## v2 Requirements

Deferred. Tracked but not in the current roadmap.

- **V2-01**: Read-aloud button for question cards (Web Speech API)
- **V2-02**: Parallel view comparing a verse in two translations

## Out of Scope

| Feature | Reason |
|---------|--------|
| Hard Questions library or index | User chose questions on spaces only |
| End-of-game theology debrief | Not chosen |
| Question cards in the deck | Questions live on spaces |
| Remembering seen questions across games | User chose per-game only |
| Family filter for heavy topics | User chose to include all topics, warmly worded |
| Pastor or elder sign-off step | User chose citation verification against primary sources |
| Online multiplayer, accounts, saved games, cloud sync | Hot-seat on one device; static host |
| Timers, buzzers, scores, leaderboards, wrong-answer penalties | Punishes kids and slow readers; turns doctrine into a contest |
| Runtime Bible API calls | Breaks offline play and would expose an API key |
| Live AI answers | Accuracy rule requires verified, static content |
| Push notifications, background sync, app-store wrapper | No server; not needed for a hot-seat game |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEPL-01 | Phase 1 | Complete |
| DEPL-02 | Phase 1 | Complete |
| DEPL-03 | Phase 1 | Complete |
| ENG-01 | Phase 3 | Pending |
| ENG-02 | Phase 3 | Pending |
| PWA-01 | Phase 2 | Complete |
| PWA-02 | Phase 2 | Complete |
| PWA-03 | Phase 7 | Pending |
| PWA-04 | Phase 2 | Complete |
| PWA-05 | Phase 7 | Pending |
| LAY-01 | Phase 6 | Pending |
| LAY-02 | Phase 6 | Pending |
| LAY-03 | Phase 6 | Pending |
| LAY-04 | Phase 6 | Pending |
| LAY-05 | Phase 6 | Pending |
| LAY-06 | Phase 6 | Pending |
| QST-01 | Phase 5 | Pending |
| QST-02 | Phase 4 | Pending |
| QST-03 | Phase 5 | Pending |
| QST-04 | Phase 5 | Pending |
| QST-05 | Phase 4 | Pending |
| QST-06 | Phase 4 | Pending |
| QST-07 | Phase 4 | Pending |
| QST-08 | Phase 4 | Pending |
| QST-09 | Phase 4 | Pending |
| QST-10 | Phase 4 | Pending |
| QUIZ-01 | Phase 5 | Pending |
| QUIZ-02 | Phase 5 | Pending |
| QUIZ-03 | Phase 5 | Pending |
| QUIZ-04 | Phase 5 | Pending |
| QUIZ-05 | Phase 5 | Pending |
| BIB-01 | Phase 7 | Pending |
| BIB-02 | Phase 7 | Pending |
| BIB-03 | Phase 7 | Pending |
| BIB-04 | Phase 7 | Pending |
| BIB-05 | Phase 7 | Pending |
| BIB-06 | Phase 7 | Pending |
| ACC-01 | Phase 4 | Pending |
| ACC-02 | Phase 4 | Pending |
| ACC-03 | Phase 4 | Pending |
| ACC-04 | Phase 3 | Pending |
| ACC-05 | Phase 3 | Pending |
| ACC-06 | Phase 3 | Pending |
| ACC-07 | Phase 4 | Pending |
| ACC-08 | Phase 4 | Pending |

**Coverage:**

- v1 requirements: 45 total
- Mapped to phases: 45
- Unmapped: 0

---
*Requirements defined: 2026-09-29*
*Last updated: 2026-09-29 after roadmap revision (install phase inserted as Phase 2)*
