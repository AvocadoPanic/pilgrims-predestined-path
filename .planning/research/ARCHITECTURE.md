# Architecture Patterns

**Domain:** Browser hot-seat board game (React + Vite, static hosting) gaining a theology Q&A content system, an optional quiz and Bible-translation selection
**Researched:** 2026-09-29
**Mode:** Ecosystem/integration (how the target features fit the existing code)
**Overall confidence:** HIGH for structure and state machine (derived from reading the code); MEDIUM for layout (needs a rendered prototype); MEDIUM for content/licensing schema (license terms are another researcher's job)

Line citations below are to `pilgrims-predestined-path.jsx` (the "monolith") unless another file is named. Numbers marked "(sim)" come from a Monte Carlo re-implementation of the existing rules that I wrote and ran during this research (scratch script, not committed; 20,000 to 30,000 games per figure). It reproduces lines 4-40, 78-88 and 332-379. Treat the exact values as indicative and re-derive them with the real engine once it exists (see Build Order, step 1).

---

## Recommended Architecture

Three layers with one-way imports, plus a composition root.

```
                       main.jsx  (createRoot, styles)
                          |
                       App.jsx   (composition root: wires engine + content + settings)
        +-----------------+------------------+-------------------+
        |                                    |                   |
   components/  (React, presentation)     hooks/             content/  (data + pure helpers)
   Setup, Board, CardView, PlayerStrip,   useSettings,       questions/, bible/, sources.js,
   QuestionPanel, Quiz, Verse, Citation,  useBoardView       copy.js
   GameLog, EndScreen
        |  props/callbacks only
        v
   game/  (pure JS, zero React/DOM/content imports)
   board.js, deck.js, rng.js, engine.js, reducer.js, narrate.js*

   * narrate.js may live in content/ if it holds user-facing wording (recommended, see Pattern 5)
```

Import rules (enforce with a lint rule or a one-line test that greps imports):

1. `game/*` imports nothing from `components/`, `content/`, `hooks/`, React or the DOM. It talks to content only through a small **catalog** object passed in at game creation (ids, not text).
2. `content/*` imports nothing from `game/` or React. It is plain data plus pure helpers (`parseRef`, `formatRef`, `gradeQuiz`).
3. `components/*` may import `content/*` (to render text) and receive game state as props. They never import `game/engine.js`; only `App.jsx` dispatches actions.
4. `App.jsx` is the only place that joins the layers (builds the catalog from content, owns `useReducer`, owns settings).

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `game/board.js` | Board constants (`COLORS`, `NAMED_IDX`, `DOT_IDX`, `SHORTCUT_IDX`, `LANDMARK_IDX`, new `POOL_QUESTION_IDX`, new fixed-question id per special space), `buildSpaces()`, `SPACES`. Currently lines 4-40. | Imported by `engine.js`, `Board` (read-only) |
| `game/rng.js` | Seedable functional PRNG: `next(seed) -> [float, seed']`, `shuffle(arr, seed) -> [arr', seed']`. | `deck.js`, `engine.js` |
| `game/deck.js` | `buildDeck(seed)`, `cardLabel`. Lines 78-86 with `Math.random` replaced by `rng`. | `engine.js` |
| `game/engine.js` | Pure rules: `createGame`, `drawCard`, `answerQuiz`, `advanceTurn`, `findNext`, `quietBonusTarget`. No I/O, no randomness except via `state.seed`. Replaces the body of `draw()`/`next()`/`start()` (lines 325-386). | `reducer.js` |
| `game/reducer.js` | Thin `(state, action) -> state` over `engine.js`; action types `START`, `DRAW`, `ANSWER_QUIZ`, `SKIP_QUIZ`, `NEXT`, `RESET`. | `App.jsx` (`useReducer`) |
| `content/questions/{fixed,pool,index}.js` | Question objects (see Content Data Model), lookup by id, `toEngineCatalog()`. | `App.jsx`, `QuestionPanel`, tests |
| `content/bible/refs.js` | Canonical reference grammar, `parseRef`, `formatRef`, `countVerses`, book table. | `Verse`, tests, translation registry |
| `content/bible/verses/{bsb,esv,kjv,net}.js` | `{ [refId]: text }` per translation with a provenance header. | `Verse` only (via `content/bible/index.js`) |
| `content/bible/translations.js` | Attribution registry: name, license class, notice text, link builder, limits. | `Verse`, `TranslationPicker`, footer, tests |
| `content/sources.js` | Registry of non-Scripture sources (WCF, Dort, Heidelberg, Institutes, Augustine, Luther) with edition, primary URL, license. | `Citation`, tests |
| `content/copy.js` | Every rules/TULIP/tagline/end-screen/log string, keyed. Fatalism rewrite touches only this file. | `Setup`, `EndScreen`, `narrate` |
| `hooks/useSettings.js` | `{translation, quiz}` state, localStorage persistence, validation. | `App.jsx`, provides context to `Verse` |
| `hooks/useBoardView.js` | Computes the SVG camera (viewBox) from current token, container size and layout mode. | `Board` |
| `components/Board/SVGBoard.jsx` | Lines 91-278 made prop-driven: `spaces`, `players`, `cur`, `pts`, plus `view`, `labelScale`, question markers. | `App.jsx` |
| `components/QuestionPanel.jsx` (+ `Quiz`, `Verse`, `Citation`, `Deeper`) | Renders `pending` question in quiz or reveal mode; emits `onAnswer(choice)`, `onSkip()`. | `App.jsx`, `content/*` |
| `components/{Setup,CardView,PlayerStrip,GameLog,EndScreen}.jsx` | Existing UI carved out of lines 280-302 and 389-480. | `App.jsx` |
| `styles/{theme,layout}.css` | CSS variables, grid layout, media queries (inline styles cannot express these; ARCHITECTURE.md in `.planning/codebase/` already flags this). | `main.jsx` import |

### Data Flow

```
UI event --dispatch(action)--> reducer --> engine (pure) --> new game state + structured events
                                                                   |
   settings (translation, quiz) --------------------------+        v
   content (questions, verses, copy) ---read-only-----> components render(state, settings, content)
```

- **Down:** `App` passes `game` state slices and content lookups to components as props.
- **Up:** components call `onDraw`, `onAnswer(choiceIndex)`, `onSkip`, `onNext`, `onSettingsChange`. `App` translates these to reducer actions.
- **Sideways:** none. Components never talk to each other; `QuestionPanel` and `SVGBoard` both read `game`.
- **Randomness** enters only through `createGame(opts, seed)` and the `state.seed` the engine threads forward. Reducers stay deterministic, which matters because React 18 `StrictMode` (and `createRoot` dev double-invocation) runs reducers twice; a `Math.random()` inside a reducer would give inconsistent results and make tests non-repeatable. The existing code already avoids this by shuffling in `start()` (line 327), but the mid-game reshuffle calls `buildDeck()` inside `next()` (line 383); in the new engine that call must use `state.seed`.

---

## Q1. Module Split (what talks to what)

Proposed tree (new files marked +; `git mv` the monolith to `src/App.jsx` in step 0 so history follows):

```
src/
  main.jsx                       createRoot(...).render(<StrictMode><App/></StrictMode>)
  App.jsx                        state wiring only; no rules, no long JSX
  game/
    board.js        +            lines 4-40 (+ question markers)
    rng.js          +
    deck.js         +            lines 78-86
    engine.js       +            findNext (88) + draw/next/start logic (325-386)
    reducer.js      +
    engine.test.js  +
    board.test.js   +            structural invariants + density check
  content/
    questions/fixed.js, pool.js, index.js   +
    bible/refs.js, translations.js, index.js, verses/{bsb,esv,kjv,net}.js   +
    sources.js      +
    copy.js         +
    content.test.js +            validation (Q2)
  components/
    Setup.jsx, EndScreen.jsx, PlayerStrip.jsx, GameLog.jsx, CardView.jsx
    Board/SVGBoard.jsx, Board/geometry.js      (WAYPOINTS, interpPath, getAngle: lines 43-75, view-only)
    QuestionPanel.jsx, Quiz.jsx, Verse.jsx, Citation.jsx, TranslationPicker.jsx
  hooks/useSettings.js, useBoardView.js
  styles/theme.css, layout.css
scripts/simulate.mjs             +   Monte Carlo (heat map, density, pool sizing); runs on the real engine
```

Why these seams and not others:

- **Geometry (`WAYPOINTS`, `interpPath`, `getAngle`) is view code**, not rules. The engine never needs pixel coordinates (it only uses indices), so keep it in `components/Board/`. This keeps `game/` free of anything visual.
- **`board.js` in `game/`** because `findNext` (line 88) scans `SPACES[i].color`, so the color layout is a rule, not decoration.
- **Content is addressed by id**, never imported by the engine. The engine needs only: which space has which fixed question id, the pool of ids, and which ids have quizzes. Pass those as a catalog:

```js
// content/questions/index.js
export function toEngineCatalog() {
  return { poolIds: POOL.map(q => q.id), quizIds: new Set(ALL.filter(q => q.quiz).map(q => q.id)) };
}
// App.jsx
dispatch({ type: "START", players: numP, quiz: settings.quiz, seed: freshSeed(), catalog: toEngineCatalog() });
```

  Engine tests can then pass a three-question fake catalog; content tests never boot the engine.
- **Do not put translation in game state.** Translation changes how a verse renders, not what happens. Mid-game switching is then free (re-render only).

---

## Q2. Content Data Model

### Question object

```js
// content/questions/fixed.js  (18 entries)   |   pool.js  (>= 30 entries, see sizing below)
{
  id: "fixed.providence",            // "fixed.<slug>" | "pool.<slug>"; unique, stable, never reused
  category: "providence",            // one of a closed list; used for pool balance and lint
  ask: "If the elect are predestined, why do we pray for them?",
  quip: "One-line satirical hook (<= ~140 chars, lint-enforced).",
  answer: "Plain answer, two to three sentences.",       // layer 2
  verses: ["matt.6.9-13", "phil.4.6"],                   // quoted under the answer, translation-selectable
  deeper: {                                              // layer 3, "Go deeper"
    body: ["Paragraph.", "Paragraph."],                  // plain strings, NO inline markup
    verses: ["prov.16.9", "acts.27.22-25"],
    citations: [                                         // non-Scripture sources
      { src: "wcf", loc: "3.1", quote: "...violence is offered to the will of the creatures...", verifiedAt: "YYYY-MM-DD" },
      { src: "wcf", loc: "5.3", verifiedAt: "YYYY-MM-DD" }
    ]
  },
  quiz: {                                                // optional; absent => no quiz for this question
    prompt: "Which statement best matches WCF 3.1?",
    options: ["...", "...", "...", "..."],               // 3-4, authored with correct one FIRST or flagged
    correct: 0,
    explanation: "One or two sentences shown after answering."
  }
}
```

Design choices and reasons:

- **Placement is not in the question.** The board owns the mapping (`game/board.js`: `NAMED_IDX[8].q = "fixed.adam"`, `DOT_IDX[35].q = "fixed.slough"`, ...; pool spaces carry `question: {pool: true}`). A content author edits text without knowing space numbers, and a re-layout of the board never touches content. A test cross-checks the two (below).
- **Plain strings, no markup language.** Verses are separate structured references, not `{{verse:...}}` tokens inside prose. Nothing to parse, nothing to break, easy to lint, safe for kids' content.
- **Authored `correct` index, shuffled at display.** Store the authored order; the engine shuffles a permutation into `pending.optionOrder` using `state.seed` so position is not a tell, and grading maps the displayed index back. `gradeQuiz(question, displayedIndex, optionOrder)` lives in `content/` and is unit-tested.
- **Citations carry `verifiedAt`** so the project rule "no quotation ships unless checked against a primary source" (PROJECT.md, Constraints) becomes a failing test, not a checklist.

### Verse store and reference grammar

- Canonical id, OSIS-style lowercase: `book.chapter.verse` or `book.chapter.start-end`. Examples: `rom.9.18`, `eph.1.4-6`. Single-chapter ranges only (cross-chapter quotations cite two entries). `content/bible/refs.js` owns the book table (code, display name, order) and `parseRef`/`formatRef`/`countVerses`.
- Per translation file, keyed by the exact id used in questions:

```js
// content/bible/verses/bsb.js
export const meta = { source: "Berean Standard Bible, <url>", retrievedAt: "YYYY-MM-DD", method: "script|manual" };
export const verses = { "rom.9.18": "So then, God has mercy on whom He wants ...", "eph.1.4-6": "..." };
```

  Keying by cited passage (not by single verse) means ranges render exactly as quoted and no runtime verse-joining logic is needed. The price is that all four files must contain the same keys (enforced by test).
- **Static import of all four files** initially. Verse volume is small (dozens of passages times four); dynamic `import()` per translation is an optimization only if the bundle grows large. It would force `Verse` to be async and is not worth it now.

### Attribution registry

```js
// content/bible/translations.js
export const TRANSLATIONS = {
  bsb: { id: "bsb", abbr: "BSB", name: "Berean Standard Bible", licenseClass: "public-domain",
         notice: "<exact required text, filled from license research>", noticePlacement: "footer",
         link: (refId) => "<verified URL pattern>", maxVerses: null },
  esv: { ..., licenseClass: "quotation-license", noticePlacement: "with-quote", maxVerses: <cap from license research> },
  kjv: { ... }, net: { ... }
};
export const DEFAULT_TRANSLATION = "bsb";   // public domain: no notice friction on first load
```

Field values (notice wording, verse caps, link patterns, KJV Crown-patent handling) must come from the license research; this registry is shaped to hold whatever it finds. I have not verified any license terms and do not assert any here.

### Validation at test/build time

Run as Vitest tests in `content/content.test.js` (and `game/board.test.js`), executed by CI before `vite build`, so a bad ref or unverified quote blocks the deploy. All checks are pure Node, no jsdom.

| Check | Fails when |
|-------|-----------|
| Ref grammar | any `verses[]` or `deeper.verses[]` entry does not parse, book code unknown, `start > end` |
| Translation coverage | a ref used by any question is missing from **any** of the four verse files; a verse text is empty or contains stray markers (`{{`, `[TODO`) |
| Orphans | a verse key exists in a file but no question uses it (warning) |
| License caps | `sum(countVerses(distinct refs))` for a translation exceeds `TRANSLATIONS[t].maxVerses` |
| Citation gate | a `citations[]` entry has unknown `src`, or `quote` present without `verifiedAt`, or `sources[src].primaryUrl` missing |
| Quiz shape | 3-4 options, all distinct, `0 <= correct < options.length`, `explanation` non-empty |
| Length lint | `quip` over the length budget; `answer` not 2-3 sentences (heuristic on `.?!`) |
| Ids | duplicate ids; id prefix does not match its file (`fixed.` vs `pool.`) |
| Board mapping | every special space (6 named, 3 dot, 2 shortcut, 7 landmark = 18, lines 8-27) has exactly one fixed question id that resolves; every `fixed.*` question is referenced by exactly one space; pool size >= `MIN_POOL` |
| Fatalism regression | a banned-phrase list ("no decisions", "never going to arrive", "as if you had a choice", ...) is absent from `copy.js` and all question text |

Provenance for verse text: prefer a dev-time script (`scripts/`) that writes `verses/*.js` from an authoritative source so text is not retyped by hand. Whether the ESV/NET sources permit scripted retrieval and local storage is a licensing question for the STACK/PITFALLS researcher; do not assume it.

---

## Q3. Turn State Machine

### Today

`ts` is `"draw"` -> `"next"` (and `"done"` on victory). All effects of a draw resolve synchronously inside `draw()` (lines 332-379): stuck gate, movement, victory, shortcut, trap, message. `next()` (lines 381-386) rotates the player and reshuffles at `di >= deck.length - 2` (line 383).

### Proposed

Add **one** state, `"quiz"`, and one payload, `pending`. The existing `"next"` state keeps its meaning ("waiting for Next Pilgrim"); a question with no quiz simply lands in `"next"` with `pending` set, and the UI shows the answer in reveal mode.

```
                       DRAW
   draw ------------------------------------------+
     | (stuck, not freed)  -> next                  |
     | (victory)           -> done  [phase = end]   |
     | (landing has question):                      |
     |     quiz on AND question has quiz  -> quiz --+-- ANSWER_QUIZ(choice) / SKIP_QUIZ --> next  (pending.revealed = true)
     |     else                           -> next   (pending.revealed = true)
     | (no question)       -> next
   next --NEXT--> draw   (clears pending, rotates cur, reshuffles deck if low)
```

`pending` shape (null when no question this turn):

```js
{ qid, spaceIndex, kind: "fixed" | "pool", optionOrder: [2,0,3,1] | null,
  picked: null | displayedIndex, correct: null | boolean, bonus: 0 | n, revealed: boolean }
```

Guards: `DRAW` only from `draw`; `ANSWER_QUIZ`/`SKIP_QUIZ` only from `quiz`; `NEXT` only from `next` (so a quiz cannot be skipped by clicking Next). Because the quiz toggle is snapshotted into `game.config.quiz` at `START`, it cannot change mid-question.

### Precedence when a draw resolves (highest first)

| # | Rule | Notes |
|---|------|-------|
| 1 | **Stuck gate.** Trapped player who does not draw the required color stays put. No landing, so **no question** and no bonus. | Existing lines 336-341. A player redrawing in the Slough does not re-trigger its question. |
| 2 | **Movement** (color, double, or character teleport), clamped to 0-133. | Lines 345-354. |
| 3 | **Victory** (`np >= 133`). Ends the game. **Suppresses question, quiz and bonus.** | Existing order: victory before shortcut/trap (lines 356-361). Keep it. |
| 4 | **Shortcut jump** if landed space is a shortcut and the card is not a character card. Applied immediately, as today. | Lines 363-368. Note characters do not trigger shortcuts. The question (rule 6) still belongs to the **origin** space (e.g. Path of Election), shown while the token is already at the destination. |
| 5 | **Trap** if landed space is a dot: set `stuck`. | Lines 370-374. |
| 6 | **Question trigger** for the landed space (pre-shortcut index): fixed id if the space has one, or the next unused pool id if the space is a pool space. Character teleports onto a named space trigger that space's fixed question, forward or backward. Character card whose target equals current position (`dir === "nowhere"`, line 348) still counts as a landing. | Fixed questions may repeat within a game (different player, or after a deck cycle). Pool questions never repeat. |
| 7 | **Quiz bonus** (only if the quiz is on, the answer is correct, and the player is **not trapped**). | See below. |

Bonus rules, chosen to make the reward never a penalty and never a rules exploit:

- **Size:** `QUIZ_BONUS_STEPS = 2` constant in `engine.js`. From my sim (about 6.7 question landings per player per 2-player game), a perfect quizzer gains about 13 steps (roughly 10% of 133, about 3 of about 23 turns). That is "small"; tune the constant with `scripts/simulate.mjs`.
- **Step definition:** walk forward `n` "quiet" spaces, where quiet means `type === "normal"` and no question marker. Skipping dot, shortcut, named, landmark and question spaces means the bonus can never land in a trap, trigger a shortcut, or chain into another question.
- **No chaining:** bonus movement triggers nothing (no shortcut, trap, question, victory).
- **Cap at 132:** the bonus cannot win the game; victory still requires a card. (Product decision to confirm; the alternative is to let the bonus win. Capping is the safer default because it keeps the win condition purely card-driven and the victory check single-sourced.)
- **Trapped player:** if rule 5 set `stuck`, the quiz (if any) is still shown for the learning value but the bonus is voided, with a narrated line. Do not let a correct answer free a trap: with about a 15% chance per draw of drawing the escape color (12 of 78 cards match a given color: 10 single plus 2 double, lines 80-81) the traps are a designed cost and freeing them would dominate everything else. (Product decision to confirm.)
- **Anti-farm:** award at most once per `(playerId, qid)` (tracked in `state.quizEarned`); pool questions never repeat, so this only bites on fixed questions revisited by teleport.

### How new question spaces interact with the color cycle and `findNext`

- The existing recoloring chain in `buildSpaces()` (lines 30-38) is mutually exclusive on `type`: named spaces become `"pink"` (line 32), which no card matches, so color cards can never land on them (`findNext` line 88 tests `SPACES[i].color === color`); dots take their trap color (line 33); shortcuts and landmarks keep the cycle color (lines 34-35).
- **Do not add a `"question"` type or a question color.** Make `question` an **orthogonal field** on the space object (`s.question = { id } | { pool: true }`), leaving `color` and `type` untouched. Then:
  - `findNext` needs no change; which spaces cards can land on is unchanged.
  - Pool spaces are ordinary colored spaces; any color card that lands there triggers the pool draw.
  - Special spaces keep their `type` for rendering and get a `?` marker from `question`.
  - If a question type were pink like named spaces, it would become unreachable except by character cards; if it had a new color, it would need cards and would distort deck distribution.
- Exclude from pool placement: index 0, 133, and the shortcut destinations 60 and 97 (so the "jump" never lands on a question), and any space in the 18 specials. Keep pool spaces at least 2 away from labelled specials for board legibility (labels at lines 227-252 already crowd; e.g. index 41 sits next to Luther at 42).

### Placement and density (important: two requirements disagree)

Findings from the sim on the current board (2 to 4 players):

- **Landing frequency is far from uniform.** Among the 114 plain spaces the chance a 2-player game lands on a given space ranges from 0.19 to 0.67 (mean 0.32). The recolored named spaces and dots leave gaps in each color's cycle, and the space after a gap absorbs the traffic (e.g. indices 30, 14, 41 are the busiest). Placing pool spaces by even index spacing is therefore a poor way to control frequency.
- **Named spaces are hit often** (0.52 to 0.63 per 2-player game each) because six character cards live in a 78-card deck that is drawn 1.0 to 1.5 times per game.
- **"About one turn in three" versus "about 33 question spaces"**: 18 fixed + 15 pool placed at evenly spaced indices gives about **0.25 questions per draw** (sim). Placing the 15 pool spaces at the busiest plain space in each equal slice of the path gives about **0.29 per draw** (about 1 in 3.4). Candidate set from my sim, to be recomputed on the real engine: `6, 14, 20, 30, 41, 47, 54, 64, 71, 81, 86, 96, 104, 114, 120`. Reaching a true 1/3 by index count alone would need about 45 question spaces. **Recommendation:** define the target as a measured rate (0.28 to 0.36 per draw) enforced by a seeded Monte Carlo test in `board.test.js`, and choose pool indices with `scripts/simulate.mjs` (heat map), not by hand.
- The density test must be re-run whenever `NAMED_IDX`, `DOT_IDX`, `SHORTCUT_IDX`, or the deck composition changes, since those shift traffic.
- Expect about 13 questions per 2-player game and about 20 in a 4-player game in total (sim), so the game is question-heavy; check that a 20-minute session with kids is acceptable.

### Pool draw without repeats

- At `START`: `pool = { order: shuffle(catalog.poolIds, seed), next: 0 }`. Landing on a pool space consumes `order[next++]`. Deterministic, StrictMode-safe, unit-testable.
- **Draw is per landing, not per space.** Two players landing on the same pool space get two different questions. So the pool must be larger than the space count. Sim, 15 pool spaces at the busy positions, pool draws per game: mean 6.6 (2 players) to 10.1 (4 players); P(more than 20) is 0.17% to 1.96%; P(more than 25) is 0.03% to 0.29%; P(more than 30) is about 0.01% to 0.03%. **Author at least 30 pool questions** (25 leaves about a 1 in 350 chance of exhaustion in a 4-player game).
- **Exhaustion fallback (must exist, must not crash):** no question that landing, narrate a "rest stop" line. Do not silently reshuffle, because that would break the "no repeats" requirement.
- Fixed questions are not in the pool and are unaffected by it.

---

## Q4. Settings

| Setting | Scope | Lives in | Persisted |
|---------|-------|----------|-----------|
| Quiz on/off | Per game (rule) | Setup form state, then snapshotted into `game.config.quiz` at `START` | Yes, as the default for the next setup screen (facilitators replay). Not required by scope; cheap. |
| Translation | Presentation, any time | `useSettings` hook (React context) | **Yes**, localStorage |
| Player count | Per game | Setup form state (`numP`, line 311) | No |

- `useSettings`: lazy initial state from `localStorage`, wrapped in try/catch (Safari private mode and blocked storage throw), validated against `Object.keys(TRANSLATIONS)` and booleans, falling back to `DEFAULT_TRANSLATION = "bsb"`.
- **Key must be namespaced** and versioned: `pilgrims-predestined-path:v1:settings`. GitHub Pages serves every repo of `avocadopanic` from one origin (`avocadopanic.github.io`), and `localStorage` is per-origin, so a generic key like `settings` can collide with other projects.
- Expose a small `TranslationPicker` on the setup screen and inside `QuestionPanel` so a table can flip translations while reading. Changing it never touches game state.
- Cross-game memory of seen questions is out of scope; keep `seen`, `pool`, and `quizEarned` inside game state only.

---

## Q5. Responsive Layout

### What the code does today (and why it does not meet the phone/projector goals)

- The board is a single SVG with `viewBox="0 0 920 1080"` and `width:100%` (line 130), inside a scroll container capped at `maxWidth:560px` and `maxHeight:calc(100vh - 140px)` (line 446). An effect auto-scrolls the container to the current token (lines 95-103).
- All layout is inline styles with `flex-wrap` (lines 428-478); no media queries are possible, and heights use `100vh` (lines 390, 428, 446), which misbehaves under mobile browser chrome.
- **Legibility arithmetic:** board labels are 7 to 8.5 SVG units (lines 231, 234, 243, 250) and tokens have radius 8 (line 265). On a 390 px phone the board renders at 390/920 = 0.42x, so labels are about 3 px and tokens about 3.4 px radius. At the 560 px cap it is 0.61x (labels about 4 px). On a 1280x720 projector with the board height-fit (720/1080 = 0.67x) labels are about 5 px. The board is decorative at these scales; tokens and question markers must be readable, and text must move to the panel.
- Nested scrolling (page plus board container) is a touch-scroll trap on phones.

### Recommended approach

1. **CSS, not inline styles, for layout.** `styles/layout.css` with CSS Grid, custom properties and three modes; components keep inline styles for cosmetics initially and gain class names for containers. Use `dvh` with a `vh` fallback.
2. **Board "camera" instead of scroll container.** `useBoardView(cp.position, containerSize, mode)` returns `{x, y, w, h}` for the SVG `viewBox`, centered on the active token and clamped to 0..920 by 0..1080. Phone: window width of about 500 to 560 units (about 0.7 to 0.8x on a 390 px screen); projector: full width with height derived from the container aspect. Add an "Overview" toggle showing the whole path. Replaces the scroll effect at lines 95-103 and removes nested scrolling. Add a `labelScale` prop so named/landmark/dot labels can be drawn larger on big screens. Animate with a short `requestAnimationFrame` tween or accept a jump; do not rely on CSS transitions (they do not animate `viewBox`).
3. **Three layout modes** via media queries on one `<div class="game">`:

| Mode | Trigger | Board | Question panel | Other |
|------|---------|-------|----------------|-------|
| Phone portrait | `max-width: 700px` or `orientation: portrait` | Top region, camera zoomed on token | **Bottom sheet** (`position: fixed; max-height: 70dvh; overflow: auto`) that overlays the lower board when `pending` exists; quiz options as large full-width buttons; "Go deeper" as `<details>` | Card and message in a bottom dock; Book of Life behind a toggle |
| Laptop / landscape | `min-width: 900px` | Left, full height, camera or overview | **Docked in the right column** in place of the card area while `pending` exists | Log below |
| Projector (large) | fluid root size, optional "Large text" setting | Same as landscape | Same; type scales | Root `font-size: clamp(14px, 1.1vw, 30px)` plus optional `data-scale="lg"` (x1.35) |

   A laptop and a projector cannot be told apart by media query, so use fluid type via root `font-size` plus an optional persisted "Large text" toggle. New components should size text in `rem` from the start; migrate existing `px` sizes (8 to 11 px throughout, e.g. lines 453, 472, 474) when the shell is converted.
4. **Question panel content order** (both layouts): question (`ask`), quip, [quiz if `ts === "quiz"`], plain answer plus quoted verses with translation abbreviation and link, "Go deeper" disclosure (body, more verses, citations), then the persistent "Next Pilgrim" button. `pending` drives everything.
5. **Accessibility basics in the new UI:** panel as `role="dialog"` with focus moved to it when `pending` appears, `aria-live="polite"` on the message region, quiz options as a radio group. (Current accessibility is minimal: see `.planning/codebase/ARCHITECTURE.md`.)

Confidence: MEDIUM. The zoom and camera numbers are arithmetic from the code; the exact window sizes and the bottom-sheet behavior need a rendered prototype and real-device check (suggest `/gsd-ui-phase` for the layout phase).

---

## Patterns to Follow

### Pattern 1: Pure engine returning events, reducer as a thin shell

**What:** `engine.drawCard(state) -> { state, events }`. Events are structured (`{type:"move", playerId, card, from, to}`, `{type:"trapped", ...}`, `{type:"question", qid, spaceIndex}`), never strings.
**When:** always for rules; it is what makes tests possible. Today's `draw()` interleaves 3 to 6 `setState` calls and string building (lines 332-379).
**Example:**
```js
// game/engine.js
export function drawCard(s) {
  if (s.ts !== "draw") return { state: s, events: [] };
  const card = s.deck[s.di];
  const p = s.players[s.cur];
  // 1 stuck gate, 2 movement, 3 victory, 4 shortcut, 5 trap, 6 question, per the precedence table
  ...
  return { state: next, events };
}
```

### Pattern 2: Functional seeded RNG threaded through state

**What:** `state.seed` advanced by `rng.next`; deck build, pool shuffle, quiz option shuffle and mid-game reshuffle all use it.
**When:** all randomness. Enables reproducible bugs, seeded Monte Carlo tests, StrictMode safety.

### Pattern 3: Catalog injection

**What:** the engine receives ids and flags (`poolIds`, `quizIds`), never text.
**When:** at `START`. Keeps `game/` free of content imports and content free of the engine.

### Pattern 4: Data-driven validation instead of review checklists

**What:** the Q2 test table. Accuracy rules from PROJECT.md become failing tests.

### Pattern 5: All user-facing wording in `content/`

**What:** `content/copy.js` holds rules, TULIP lines, taglines, end screen, and event-to-string templates (`narrate(events)`), so a tone change or the fatalism rewrite does not touch engine or components. Lines needing rewrite today: 328 and 385 (start/turn messages), 404 ("There are no decisions"), 408-412 (TULIP glosses; "L" at 410 describes reprobation), 466-467 ("never going to arrive", "as if you had a choice"), 398 (Calvin attribution to check), and the "Castle of Rome" framing at line 25.

### Pattern 6: Characterization tests before refactor

**What:** before moving `draw()`, write tests that encode current behavior (stuck gate, double card, character backward move, shortcut not triggered by character card, victory before shortcut, deck reshuffle threshold), then refactor to green.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: A `"question"` space type or color
**What:** adding `type:"question"` in the `buildSpaces()` chain (lines 32-36) with its own color.
**Why bad:** either unreachable by color cards (pink) or a 7th color that breaks the deck (`COLORS`, lines 80-81) and `findNext`.
**Instead:** orthogonal `question` field on the space.

### Anti-Pattern 2: Content imported into the engine
**What:** `engine.js` importing question text to check quiz answers.
**Why bad:** couples rules tests to authoring, and makes every content edit a rules-module change.
**Instead:** catalog injection, `gradeQuiz` in `content/`.

### Anti-Pattern 3: Random calls inside a reducer or `setState` updater
**What:** `Math.random()` in `useReducer` (or mid-`next()` as at line 383).
**Why bad:** StrictMode double-invocation and non-reproducible tests.
**Instead:** seed in state.

### Anti-Pattern 4: Per-space pre-assigned pool questions
**What:** assigning pool questions to spaces at game start.
**Why bad:** two players landing on the same space see the same question, violating "no repeats within a game"; a pool the same size as the space count then looks sufficient but is not the right model.
**Instead:** draw per landing from a shuffled order, with a larger pool.

### Anti-Pattern 5: Bonus movement that runs the full landing pipeline
**What:** applying the bonus as an ordinary move.
**Why bad:** a reward can land in a trap (line 370), fire a shortcut (line 363), win the game, or chain another question.
**Instead:** quiet-space walk capped at 132.

### Anti-Pattern 6: Storing translation in game state, or unnamespaced localStorage keys
**Why bad:** translation is presentation; shared `github.io` origin makes generic keys collide.

### Anti-Pattern 7: Verse text fetched at runtime with an API key
**Why bad:** no secrets on a static site (PROJECT.md Constraints); network failure mid-game; license terms differ per API. Bundle vetted text.

---

## Scalability Considerations

The relevant axes here are content and players, not users.

| Concern | Now | Growth | Approach |
|---------|-----|--------|----------|
| Questions | 18 fixed + 30 pool | 100+ | Fixed ids + closed `category` list; balance pool draw by category only if playtests show clumping |
| Verse text bundle | dozens of passages x 4 translations | hundreds | Static import first; per-translation dynamic `import()` only if gzip size becomes an issue |
| Players | 2-4 hot-seat, one device | n/a | Out of scope: no multiplayer or saves |
| Game length | about 17 to 23 turns per player, about 46 to 67 draws total (sim) | With 0.29 questions per draw the session is question-dominated | Tune density/bonus with `simulate.mjs`; keep "Go deeper" collapsed by default |
| Deck cycles | 1.0 to 1.5 per game (sim) | n/a | Mid-game reshuffle must use `state.seed` |

---

## Suggested Build Order (dependencies)

```
0 Deploy fix -> 1 Test harness + engine extraction -> 2 UI carve-out + copy.js ----+
                          |                                                        |
                          +--> 3 Content model + validators (schema freeze) --+    |
                                                                              v    v
                                                        4 Question state in engine + panel (reveal mode, BSB)
                                                                              |
                          +---------------------------+-----------------------+
                          v                           v
                  5 Quiz (engine + UI + toggle)   6 Translations (settings, picker, attribution, full verse stores)
                          |                           |
                          +-------------+-------------+
                                        v
                       7 Layout/projector pass   8 Accuracy gate + copy rewrite completion
        (Content authoring for fixed and pool questions runs in parallel from step 3 onward.)
```

1. **Step 0: Get it running.** `git mv pilgrims-predestined-path.jsx src/App.jsx` (fixes the missing `./App` import at `src/main.jsx:3`); `createRoot` (main.jsx line 5 uses removed `ReactDOM.render` semantics); add `@vitejs/plugin-react` and a version-compatible Vite (package.json currently `vite ^3`; versions belong to STACK.md); commit a lockfile and `.gitignore`; rewrite `.github/workflows/deploy.yml` (`npm ci`, build, upload `dist`, deploy-pages); switch Pages source to Actions (needs user go-ahead). No logic changes. **Gate:** live URL plays a full game.
2. **Step 1: Test harness and engine extraction.** Vitest (node environment); create `game/{board,rng,deck,engine,reducer}.js`; characterization tests (Pattern 6); `App` uses `useReducer`. Add CI `npm test` before build. **Gate:** behavior unchanged; tests green in CI. Depends on step 0. Build `scripts/simulate.mjs` here; reuse it in steps 3 and 4.
3. **Step 2: UI carve-out and `copy.js`.** Mechanical extraction of `Setup`, `EndScreen`, `PlayerStrip`, `GameLog`, `CardView`, `SVGBoard`, and move strings to `content/copy.js` unchanged. Depends on step 1 (prop shapes). This makes step 8 a one-file diff.
4. **Step 3: Content model and validators.** Schema freeze, `refs.js`, `sources.js`, `translations.js` with placeholders, validation tests, 2 to 3 sample questions with real verses in all four translations to prove the pipeline. Depends only on the Q2 schema, not on the engine, so it can start right after step 0 and run parallel to steps 1-2. **Freeze the schema before bulk authoring starts.** Authoring 18 fixed and 30+ pool questions with citations is the long tail; start it here.
5. **Step 4: Question state.** `board.js` gains question markers and `POOL_QUESTION_IDX` (chosen by `simulate.mjs`), engine gains `pending`, pool draw, exhaustion fallback, density test; `QuestionPanel` in reveal mode with `Verse` (BSB default). Depends on 1, 2, 3. Precedence tests 1 to 6 land here.
6. **Step 5: Quiz.** Engine `quiz` state, `ANSWER_QUIZ/SKIP_QUIZ`, bonus rules and tests (rule 7), `Quiz` component, setup toggle. Depends on 4. Independent of translations.
7. **Step 6: Translations.** `useSettings`, `TranslationPicker`, full verse stores for ESV/KJV/NET, attribution footer/with-quote notices, license-cap test. Depends on 3 and 4; can run parallel with step 5. Start license research early: it is the highest-uncertainty item, and BSB-only can ship first (public domain).
8. **Step 7: Layout and projector pass.** `layout.css`, `useBoardView`, bottom sheet vs docked panel, fluid type. It can begin after step 2 (shell) but must be revalidated once the panel exists (step 4). Real-device test on a phone and a 1080p projector or large display.
9. **Step 8: Accuracy gate and copy rewrite.** Fatalism rewrite in `copy.js` (cheap after step 2; consider doing it right after step 2 so the deployed game stops shipping the inaccurate jokes early), primary-source verification of every quote (including the setup-screen Calvin attribution at line 398), banned-phrase test, "Castle of Rome" reframing, child-suitability read-through. Enforced by the Q2 validators.

### Research flags for the roadmap

| Phase | Flag | Reason |
|-------|------|--------|
| Translations (step 6) | **Needs deeper research** | Notice wording, verse caps, link patterns, KJV Crown patent, whether ESV/NET text may be bundled in a public repo; registry schema is ready but values are unverified |
| Layout (step 7) | Needs a prototype and real-device check | Camera window sizes, bottom sheet behavior on iOS Safari (dynamic toolbars), projector legibility |
| Question density/pool (step 4) | Resolved in outline (this doc) | Re-run on the real engine; decide 1-in-3 target vs 33 spaces |
| Content authoring (step 3+) | High effort, not a tech risk | 48+ questions with verified citations; schedule as its own phase(s) |
| Engine extraction (step 1) | Standard | Pure refactor with characterization tests |
| Deploy (step 0) | Standard | Known-issues list is in PROJECT.md Context |

---

## Product Decisions Surfaced (need confirmation before planning)

1. **Density target:** "about one turn in three" vs "roughly 30-35 question spaces" are inconsistent on this board (0.25 per draw with even spacing, about 0.29 with heat-mapped placement, about 45 spaces for a true 1/3). Recommend the measured-rate definition.
2. **Bonus rules:** size 2 steps, quiet-space walk, cap at 132, voided while trapped, once per player per question. Alternatives noted above.
3. **Pool size:** at least 30, not 15.
4. **Fixed questions can repeat** within a game when a different player lands there; only pool questions are guaranteed unique.
5. **Large-text setting:** include as a persisted toggle, or rely on fluid type only.

## Sources

- `pilgrims-predestined-path.jsx` (read in full; line numbers cited inline). HIGH.
- `.planning/PROJECT.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/TESTING.md`, `src/main.jsx`, `vite.config.js`, `package.json`, `index.html` (read). HIGH.
- Monte Carlo re-implementation of the existing rules (scratch script during this research, not committed): landing heat map, density, pool-draw distribution, game length. MEDIUM (faithful re-implementation of lines 4-88 and 332-379, but a separate codebase; rerun on the extracted engine).
- General React 18 behavior (StrictMode double-invoking reducers and updaters in development; `createRoot` replacing `ReactDOM.render`): established React 18 semantics from my own knowledge, not re-fetched in this session. MEDIUM.
- License and attribution requirements for ESV, NET, BSB, KJV: **not researched here**; deferred to the STACK/PITFALLS researcher.
