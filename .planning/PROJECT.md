# The Pilgrim's Predestined Path

## What This Is

A browser board game in the spirit of Candy Land, themed on Reformed (Calvinist) theology: pilgrims race along a 134-space path to Glorification by drawing color, double and character cards, getting stuck in the Slough of Despond and taking the Path of Election. This project gets it running on GitHub Pages and turns its special spaces into stops where the game poses the hard questions people ask about Calvinism ("If the elect are predestined, why do we pray for them?") and answers them in a voice that is funny and theologically accurate. It is for everyone who might sit around one screen: church classes, Reformed friends who enjoy the joke, curious or skeptical outsiders, and families with kids.

## Core Value

Every hard question the game raises gets an answer that is both funny and correct, with Scripture and confession citations anyone can check.

## Requirements

### Validated

<!-- Inferred from existing code (pilgrims-predestined-path.jsx). Implemented, but the app has never run in production. -->

- ✓ Setup screen: choose 2-4 players, read rules and TULIP summary (existing)
- ✓ 134-space winding SVG path with decorative scenery and player tokens (existing)
- ✓ 78-card deck: 60 single color, 12 double color, 6 character (location) cards, shuffled once per game (existing)
- ✓ Movement to next (or second-next) space of the drawn color; character cards teleport forward or back (existing)
- ✓ Trap ("dot") spaces that hold a pilgrim until they draw a specific color (existing)
- ✓ Shortcut spaces: The Narrow Way (48 to 60) and Path of Election (85 to 97) (existing)
- ✓ Named character and landmark spaces with one-line descriptions (existing)
- ✓ Turn rotation, deck rebuild when low, "Book of Life" event log, victory at space 133 (existing)

### Active

<!-- Current scope. Hypotheses until shipped. -->

**Get it running**
- [ ] The game builds with Vite and loads without errors (fix missing `./App` import, add the React plugin, React 18 root API)
- [ ] The game is live at https://avocadopanic.github.io/pilgrims-predestined-path/, deployed by a working GitHub Actions workflow on push to `main`
- [ ] The game is a PWA: installable to a phone or desktop home screen and fully playable offline after the first visit (Bible text and content bundled), with players getting the new version after a deploy rather than a stale cached build
- [ ] Layout works on a phone in portrait (one device passed around) and on a laptop or projector (readable from across a room)

**Hard questions**
- [ ] About one draw in three lands a player on a question space (roughly 40-45 question spaces on the path, per research simulation)
- [ ] The 18 existing named, trap, shortcut and landmark spaces each carry a fixed question that fits the space (e.g. Slough of Despond: "How can I know I'm elect?"; Sea of Providence: "If the elect are predestined, why pray?")
- [ ] New generic question spaces draw from a pool of further questions, with no repeats within a game
- [ ] Each question is layered: a one-line satirical quip, a plain two-to-three sentence answer, and a "Go deeper" section with fuller explanation and citations
- [ ] Optional quiz mode, toggled at setup: a multiple-choice prompt before the answer; a correct answer earns a small movement bonus
- [ ] Players can choose the Bible translation for quoted verses: BSB, ESV, KJV or NET, each shown with a link and the attribution its license requires

**Accuracy and tone**
- [ ] Rules text, TULIP summary, taglines and end screen no longer imply fatalism; jokes are rewritten so they are still funny and doctrinally accurate (e.g. "There are no decisions" and "Play Again (as if you had a choice)")
- [ ] Satire is aimed mainly at Calvinists themselves, with some good-natured poking at Catholics; every tradition's actual position (Catholic, Arminian, Lutheran) is stated accurately, and the ribbing stays affectionate rather than hostile
- [ ] Every quotation and citation (Scripture, Westminster Confession, Canons of Dort, Heidelberg Catechism, Calvin's Institutes, Augustine, Luther) is checked against a primary source, including the Calvin quote on the setup screen currently attributed to Institutes III.21.5
- [ ] Content is suitable for children as well as adults

### Out of Scope

- Hard Questions library or browsable index: not chosen; questions surface only on spaces
- End-of-game theology debrief: not chosen
- Question cards added to the deck: not chosen; questions live on spaces
- Remembering seen questions across games: user chose per-game only
- Online multiplayer, accounts, saved games: the game is hot-seat on one device
- A pastor or elder sign-off step: user chose citation verification against primary sources instead

## Context

- **Codebase:** one 481-line React component, `pilgrims-predestined-path.jsx`, at the repo root, holding all state, logic, SVG rendering and inline styles. `src/main.jsx` imports a nonexistent `./App` and uses `ReactDOM.render`. `vite.config.js` sets `base: '/pilgrims-predestined-path/'` but has no React plugin. No `.gitignore`, no lockfile, no tests, no linting. Full map in `.planning/codebase/`.
- **Deployment today:** GitHub Pages is enabled on AvocadoPanic/pilgrims-predestined-path in legacy mode (branch `main`, path `/`), so it serves the unbuilt `index.html`. `.github/workflows/deploy.yml` contains literal `\n` sequences (invalid YAML), has no build step and publishes `./docs` rather than Vite's `./dist`.
- **Mechanics that shape question placement:** named character spaces are colored pink and can only be reached by the 6 character cards; color cards never land on them. Trap spaces take the color they require, so color cards can land on them. With the current layout a player hits roughly 3 special spaces per game.
- **Theology anchor for the headline question:** Westminster Confession 3.1 (the decree does no "violence ... to the will of the creatures", nor takes away "the liberty or contingency of second causes") and 5.2-5.3 (God ordinarily works through means) are the Reformed answer to "why pray?": God ordains the means along with the ends. This is also why the fatalist jokes are inaccurate.
- **Existing text needing review:** the setup TULIP list glosses Limited Atonement as "Not every pilgrim reaches Glory" (that describes reprobation, not particular redemption); the end screen says "The others were never going to arrive".

## Constraints

- **Hosting:** static site on GitHub Pages with no server, so no secret API keys. Any Bible API key shipped in client JavaScript is public; verse text likely has to be bundled.
- **Licensing:** ESV and NET are copyrighted with quotation allowances and required notices; BSB and KJV are public domain (KJV has Crown patent status in the UK). Exact limits and notice wording must be verified during research, not assumed.
- **Accuracy:** no quotation or citation ships unless checked against a primary source; where a translation of Calvin or Luther is quoted, use one that can be legally reproduced and name it.
- **Audience:** content must work for children, outsiders and theologically literate adults at once, which is the reason for the layered format.
- **Tech stack:** keep React + Vite; the existing game should keep working while it is restructured.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Deploy first, then content | User asked for it running on GitHub Pages first | Pending |
| Satirical but accurate voice | User's choice; keeps the game's character while fixing its theology | Pending |
| Calvinists are the main butt of the satire; good-natured pokes at Catholics allowed | Mixed audience includes Catholics and outsiders; user added on 2026-09-29 that Catholics can be ribbed if good-natured | Pending |
| Rewrite fatalist jokes rather than annotate them | User's choice; Reformed confessions reject fatalism (WCF 3.1) | Pending |
| Hybrid question mapping: 18 fixed themed spaces plus a pool for new spaces | Keeps thematic links (Slough = assurance) and gives replay variety | Pending |
| Layered answers: quip, plain answer, "Go deeper" | One format serves kids, outsiders and seminary grads | Pending |
| Optional quiz with small movement bonus | Adds real decisions to play, which also undercuts the old "no decisions" fatalism joke | Pending |
| Selectable translation: BSB, ESV, KJV, NET with link and attribution | User's choice | Pending |
| Verification by citation checking, no human theology reviewer | User's choice | Pending |
| True 1-in-3 question density (~40-45 spaces), enforced by seeded simulation test | User's choice after research showed 33 spaces gives ~1 in 4 | Pending |
| Core-first pool guarantees headline questions each game | "Why pray?" space alone is reached in only ~20% of 4-player games | Pending |
| Quiz: active player only, 3 options, +2 quiet-walk bonus capped at 132, no penalty | User's choices during requirements | Pending |
| No family filter; heavy topics included with warm wording | User's choice | Pending |
| Ship ESV on our reading of the "commentary" clause | User's choice; ESV notice and verse limits still enforced by tests | ⚠️ Revisit if Crossway objects |
| Quote the original 1646/1647 Westminster Confession | User's choice; research verified refs against the American text, so section numbers need re-checking | Pending |
| Ship as a PWA (installable, offline) | User requirement added 2026-09-29; suits phones passed around in rooms with poor Wi-Fi | Pending |
| Switch GitHub Pages source from legacy branch to GitHub Actions | Legacy mode serves unbuilt source; repo setting change needs user go-ahead when executed | Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check: still the right priority?
3. Audit Out of Scope: reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-09-29 after initialization*
