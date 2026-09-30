---
last_mapped_commit: 55f4cd08ff3960f4504472e8288e1698605bc2d0
last_mapped_at: 2026-09-29
---
<!-- refreshed: 2026-09-29 -->

# Architecture

**Analysis Date:** 2026-09-29

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│              Browser (React 18 + Vite)                       │
├──────────────────┬──────────────────┬───────────────────────┤
│   Game Board     │  Card Display    │   Player Controls     │
│   (SVG Render)   │   UI Component   │   & Status Panel      │
│  `pts, spaces`   │   `CardView`     │  `messages, log`      │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    App Component                             │
│   `pilgrims-predestined-path.jsx` (exported as default)     │
│                                                              │
│   Game State: players, deck, current turn, card drawn       │
│   Game Logic: card draw, movement, collision detection      │
│   UI Rendering: board, cards, controls, logs               │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              React Hooks & Utilities                        │
│   useState, useEffect, useRef, useCallback, useMemo        │
│   Path interpolation, angle calculation, helpers           │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App (main game) | Game state, turn logic, deck shuffling, victory detection | `pilgrims-predestined-path.jsx` (lines 308–481) |
| SVGBoard | Render game board with spaces, players, decorative elements | `pilgrims-predestined-path.jsx` (lines 91–278) |
| CardView | Display current card or draw button | `pilgrims-predestined-path.jsx` (lines 281–302) |
| Setup phase | Player count selection and rules display | `pilgrims-predestined-path.jsx` (lines 389–424) |
| Main entry | Bootstrap React app and mount to #root | `src/main.jsx` |

## Pattern Overview

**Overall:** Monolithic single-page application (all game logic in one React component with local state)

**Key Characteristics:**

- Single stateful component managing all game phases (setup → play → end)
- No external state management library (Redux, Zustand, Context API)
- Immediate mode rendering (React re-renders on every state change)
- Deterministic game logic: deck shuffled once at start, outcome predetermined
- SVG-based rendering for board visualization with smooth scrolling

## Layers

**Presentation (UI Components):**

- Purpose: Render game board, cards, status messages, player tokens
- Location: `pilgrims-predestined-path.jsx`
- Contains: SVG board, card UI, control buttons, game log
- Depends on: Game state from App component, React hooks
- Used by: Browser DOM via React rendering

**Game Logic Layer:**

- Purpose: Handle card draws, movement calculations, turn progression, win conditions
- Location: `pilgrims-predestined-path.jsx` (lines 308–386 for event handlers)
- Contains: `draw()`, `next()`, `start()` functions; turn state machine
- Depends on: Game state (players, deck, current turn, stuck players)
- Used by: UI event handlers (button clicks)

**Data & Constants Layer:**

- Purpose: Define board layout, card deck, named locations, special spaces
- Location: `pilgrims-predestined-path.jsx` (lines 3–88)
- Contains: `SPACES`, `WAYPOINTS`, `COLORS`, card definitions, location indices
- Depends on: Math utilities for path interpolation
- Used by: Game logic and rendering

**Utility Layer:**

- Purpose: Geometric and algorithmic helpers
- Location: `pilgrims-predestined-path.jsx` (lines 29–75, 78–88)
- Contains: `buildSpaces()`, `interpPath()`, `getAngle()`, `buildDeck()`, `findNext()`, `cardLabel()`
- Depends on: None
- Used by: Game logic and rendering

## Data Flow

### Primary Request Path (Card Draw → Movement → Next Player)

1. Player clicks "Draw Card" button → `draw()` handler invoked (line 332)
2. Card popped from deck (`deck[di]`)
3. Check if player is stuck (trapped on dot space)
   - If stuck and card doesn't match required color: stay trapped, log message, end turn
   - If stuck and card matches: remove stuck status, advance movement
4. Calculate new position based on card type:
   - **Color card**: `findNext(position, color, skip)` finds next space of that color (line 351)
   - **Double card**: Same as color but skip to second occurrence (line 351)
   - **Location card**: Teleport to `card.target` position (line 347)
5. Boundary check: clamp position to 0–133 (line 354)
6. Update player position in state (line 355)
7. Check landing conditions:
   - **Shortcut space**: Auto-advance to shortcut destination, end turn (lines 363–368)
   - **Dot space**: Trap player with required color, end turn (lines 370–374)
   - **Normal space**: Show message with location name/description, end turn (lines 375–378)
8. Victory check: if position ≥ 133, set winner and end game (lines 356–361)
9. UI updates: drawn card displayed, message shown, log appended
10. State transition: `ts` changes from "draw" to "next" → next player can advance turn
11. Player clicks "Next Pilgrim" button → `next()` invoked (line 381)
12. Deck reshuffle check: if running low, rebuild deck (line 383)
13. Rotate current player: `cur = (cur + 1) % players.length`
14. Reset for new turn: card cleared, state set to "draw", message updated

### Secondary Flow (Game Setup)

1. Player selects 2–4 players via radio buttons (lines 415–420)
2. Player clicks "Submit to Providence" → `start()` invoked (line 325)
3. Initialize game state:
   - Create player objects with starting position 0, assigned colors/names
   - Build and shuffle deck via `buildDeck()` (line 84)
   - Reset turn markers: `cur=0`, `di=0`, `ts="draw"`
   - Clear stuck players, winner, game log
4. Set phase to "play" to show game board
5. Transition to game play phase

### End Game Flow

1. When player position reaches 133:
   - Detect victory condition (line 356)
   - Set `winner` state (line 357)
   - Set phase to "end" (line 358)
   - Display victory message and "Play Again" button
2. Player clicks "Play Again" → state phase set to "setup" (line 467)
3. UI reverts to setup screen

**State Management:**

All state managed via `useState` hooks in single App component:

- `phase`: "setup", "play", or "end" — controls which UI section renders
- `numP`: 2–4 — number of players selected
- `players`: array of {id, position, color, name} — all player state
- `deck`: shuffled card array — cards to be drawn
- `di`: deck index — position in deck for next draw
- `cur`: current player ID — whose turn it is
- `card`: drawn card object or null — currently displayed card
- `ts`: turn state — "draw" (waiting for card draw) or "next" (waiting for next player)
- `msg`: message string — status/narrative text shown to player
- `stuck`: object mapping player ID → color requiring escape
- `log`: array of game events — history displayed in "Book of Life"
- `winner`: winning player object or null — set when someone reaches 133

## Key Abstractions

**Space (position on board):**

- Purpose: Represents one square/space on the 134-space path
- Examples: `SPACES[0]` (start), `SPACES[42]` (Martin Luther named location), `SPACES[133]` (Glorification end)
- Pattern: Array index position maps directly to path coordinate via interpolation

**Card:**

- Purpose: Drawn from deck to determine player movement
- Types:
  - "single" (60 cards) — move to next space of that color
  - "double" (12 cards) — move to second-next space of that color
  - "location" (6 cards) — teleport to named character location
- Pattern: Cards have type, color (except location), and optional target position

**Waypoint:**

- Purpose: Control points for smooth SVG path curve
- Examples: 50 waypoints from start (75, 1015) to top (480, 60)
- Pattern: Linear path interpolated to 134 points for smooth bezier rendering

**Special Space Types:**

- **dot**: Trapping space (Slough of Despond, Dark Night of the Soul, Valley of Shadow) — color-specific escape required
- **named**: Character location (Brother Adam, John Knox, etc.) — landmark with icon and lore
- **landmark**: Geography location (Forest of Scripture, Mount Sinai, etc.) — informational
- **shortcut**: Skip ahead (Narrow Way at 48→60, Path of Election at 85→97) — unblockable advancement
- **final**: Glorification (position 133) — winning space

## Entry Points

**HTML:**

- Location: `index.html`
- Triggers: Page load
- Responsibilities: Set up DOM structure (#root div), load fonts, import React entry point

**React Entry:**

- Location: `src/main.jsx`
- Triggers: React bootstrap
- Responsibilities: Render App component to #root DOM node
- `src/main.jsx` renders the App element from `./App.jsx` with `createRoot` inside `StrictMode`

**App Component:**

- Location: `src/App.jsx` (default export)
- Triggers: React mounting
- Responsibilities: Initialize game state, render UI, handle all game events

## Architectural Constraints

- **Threading:** Single-threaded JavaScript event loop (browser); all operations synchronous
- **Global state:** None. All state localized to App component via `useState`
- **Circular imports:** None detected
- **Browser APIs:** Uses HTML Canvas-style rendering via SVG (no WebGL/Canvas 2D)
- **Determinism:** Game outcome is predetermined by initial deck shuffle; card order is fixed before first draw
- **Component coupling:** High — SVGBoard, CardView, and event handlers are tightly coupled to App state structure; no prop drilling or composition layers
- **Viewport responsiveness:** Board scales to container width; controls layout switches to wrap on small screens (flex-wrap)

## Anti-Patterns

Resolved in Phase 1: the component lives at `src/App.jsx` and `src/main.jsx` imports it.

### Monolithic Component

**What happens:** All game logic, state, rendering, and styling is in one 482-line component (`pilgrims-predestined-path.jsx`).

**Why it's wrong:** Component is difficult to test, understand, and extend. State is tangled with rendering. Logic for board, cards, setup, and game flow is intermixed. Reusability is zero.

**Do this instead:** Break into smaller components:

- `<GameSetup>` — player selection and rules (handle phase === "setup")
- `<GameBoard>` — SVG board rendering (accept `spaces`, `players`, `pts` as props)
- `<CardDraw>` — card display and draw button (accept `card`, `onDraw` as props)
- `<GameLog>` — log display (accept `log` as props)
- `<App>` — orchestrate state and pass props to children

### Inline Styling

**What happens:** All CSS is inline style objects spread throughout JSX (lines 284–469).

**Why it's wrong:** Hard to maintain, no reuse, no media queries, no shared theme constants. A color change requires editing multiple lines. Theme is partially in constants (`CHX`, `CDK`) but mostly hardcoded.

**Do this instead:** Extract to CSS file or CSS-in-JS library (styled-components, Tailwind); define theme object centrally.

## Error Handling

**Strategy:** None. No try-catch blocks, no error boundaries, no error logging.

**Gaps:**

- Card draw failure (empty deck) is handled only by deck reshuffle check (line 383)
- No validation of player data
- No recovery from invalid board state

**Patterns:**

- Defensive programming: Clamp values (`Math.max`, `Math.min` on line 354)
- Guard clauses: Check phase and turn state before processing (e.g., line 332 `if(ts !== "draw" || di >= deck.length) return`)

## Cross-Cutting Concerns

**Logging:** Game events logged to `log` array state (appended via `setLog`). Types: "system", "stuck", "advance", "setback", "shortcut", "victory". Displayed in "Book of Life" panel.

**Validation:** Minimal. Position clamped to 0–133 range. Stuck status checked before movement. No type validation on cards or players.

**Theming:** Colors defined in `CHX` (hex) and `CDK` (dark variants) constants. Typography uses EB Garamond Google Font loaded inline (line 391). Background gradients hardcoded in style objects.

**Accessibility:** Limited. SVG board lacks alt text. Card buttons lack semantic labels. No keyboard shortcuts. No screen reader support.

---

*Architecture analysis: 2026-09-29*
