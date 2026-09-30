<!-- GSD:project-start source:PROJECT.md -->

## Project

**The Pilgrim's Predestined Path**

A browser board game in the spirit of Candy Land, themed on Reformed (Calvinist) theology: pilgrims race along a 134-space path to Glorification by drawing color, double and character cards, getting stuck in the Slough of Despond and taking the Path of Election. This project gets it running on GitHub Pages and turns its special spaces into stops where the game poses the hard questions people ask about Calvinism ("If the elect are predestined, why do we pray for them?") and answers them in a voice that is funny and theologically accurate. It is for everyone who might sit around one screen: church classes, Reformed friends who enjoy the joke, curious or skeptical outsiders, and families with kids.

**Core Value:** Every hard question the game raises gets an answer that is both funny and correct, with Scripture and confession citations anyone can check.

### Constraints

- **Hosting:** static site on GitHub Pages with no server, so no secret API keys. Any Bible API key shipped in client JavaScript is public; verse text likely has to be bundled.
- **Licensing:** ESV and NET are copyrighted with quotation allowances and required notices; BSB and KJV are public domain (KJV has Crown patent status in the UK). Exact limits and notice wording must be verified during research, not assumed.
- **Accuracy:** no quotation or citation ships unless checked against a primary source; where a translation of Calvin or Luther is quoted, use one that can be legally reproduced and name it.
- **Audience:** content must work for children, outsiders and theologically literate adults at once, which is the reason for the layered format.
- **Tech stack:** keep React + Vite; the existing game should keep working while it is restructured.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- JavaScript (JSX) - UI components and business logic
- React 19 (`^19.3.0`) - UI framework for component-based architecture
- JavaScript - Build and development configuration

## Runtime

- Node.js `>=22.12.0` (package.json engines); CI pinned to Node 24
- npm - Package management
- Lockfile: `package-lock.json` committed; CI installs with `npm ci`

## Frameworks

- React `^19.3.0` - UI framework for building interactive single-page application
- React-DOM `^19.3.0` - Renders React components to the browser DOM
- Vite `^8.3.1` with `@vitejs/plugin-react` `^6.1.1` - Build tool, dev server, and production bundler with instant hot module replacement
- Vitest `^5.0.2` - Test runner behind `npm test`
- GitHub Actions (`.github/workflows/deploy.yml`, official configure-pages, upload-pages-artifact and deploy-pages actions pinned to commit SHAs) - tests, builds and deploys `dist/` to GitHub Pages on every push to `main`

## Key Dependencies

- `react@^19.3.0` - Core UI library with hooks API (useState, useEffect, useRef, useCallback, useMemo)
- `react-dom@^19.3.0` - DOM rendering layer for React
- `@fontsource/eb-garamond@^5.3.0` - self-hosted EB Garamond woff2 files

## Configuration

- No environment variables currently used
- Single configuration file: `vite.config.js`
- `vite.config.js` - Configures base path for GitHub Pages deployment at `/pilgrims-predestined-path/`; also sets `plugins: [react()]` and `test.include: ['src/**/*.test.{js,jsx}']`
- Entry point: `index.html` references `/src/main.jsx`
- Output directory: `dist/` (standard Vite output)

## Platform Requirements

- Node.js `>=22.12.0` (package.json engines); CI uses Node 24
- npm 
- GitHub Pages hosting
- No server-side runtime required - static site deployment

## Build & Dev Scripts

## Source Structure

- `index.html` - Entry point HTML file
- `src/main.jsx` - React app entry point; renders `App` with `createRoot` inside `StrictMode` and imports `./fonts.css`
- `src/App.jsx` - Main application component (moved from the repo root in Phase 1)
- `src/fonts.css` - Self-hosted EB Garamond `@font-face` rules
- `public/favicon.svg` - Gold-cross favicon
- `src/App.smoke.test.jsx` - App smoke render test
- `src/build-output.test.js` - Production build output check
- `.github/workflows/deploy.yml` - Test, build and deploy workflow for GitHub Pages
- `vite.config.js` - Vite configuration

## Notes

- Vitest 5 runs `src/**/*.test.{js,jsx}` via `npm test` (App smoke render and a production build-output check); no linting or formatting tools configured
- No TypeScript configuration
- No CSS framework or CSS preprocessing tools
- EB Garamond is self-hosted from `@fontsource/eb-garamond` woff2 files via `src/fonts.css`; the page makes no third-party font requests
- No backend dependencies or database libraries
- Minimal dependency footprint - pure client-side React application

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- `.jsx` extension for React components
- `.js` extension for configuration and utilities
- PascalCase for React component files (though most code lives in single `pilgrims-predestined-path.jsx`)
- camelCase for all functions: `buildSpaces()`, `interpPath()`, `getAngle()`, `findNext()`, `cardLabel()`
- Abbreviated function names commonly used: `draw()`, `start()`, `next()`
- camelCase for all variable names: `numP`, `cur`, `card`, `players`, `deck`, `pts`
- Single or double letter abbreviations are common: `p` (player), `c` (card), `i` (index), `n` (number), `s` (space), `t` (tree), `m` (mountain), `d` (distance), `dx`/`dy` (delta x/y), `sp` (space), `np` (new position), `sc` (stuck color), `di` (deck index), `lr` (log ref), `wi` (word index), `li` (line index)
- Short variable names in loops and mathematical calculations
- UPPER_SNAKE_CASE for all module-level constants: `COLORS`, `CHX`, `CDK`, `NAMED_IDX`, `DOT_IDX`, `SHORTCUT_IDX`, `LANDMARK_IDX`, `SPACES`, `WAYPOINTS`, `FLAVORS`, `PC`, `PN`
- Constants are defined at module scope and never reassigned
- PascalCase: `App`, `SVGBoard`, `CardView`
- State variables use camelCase: `phase`, `numP`, `players`, `deck`, `cur`, `card`, `ts` (turn state), `msg`, `stuck`, `log`, `winner`

## Code Style

- No external formatter configured (no Prettier)
- Inline styles used throughout instead of CSS files
- Component JSX intermixed with business logic
- Extensive use of ternary operators for conditional rendering
- Line lengths vary widely; some lines exceed 100 characters
- No linting configuration detected (no .eslintrc)
- Relies on manual code review
- 2-space indentation observed in JSX (line 390-481 in `pilgrims-predestined-path.jsx`)
- Consistent with Vite defaults

## Import Organization

- No path aliases configured
- Relative imports used throughout (`./App`, `./main.jsx`)

## Error Handling

- Guard clauses with early returns: `if(!svgRef.current||!cp)return;` at `pilgrims-predestined-path.jsx:96`
- Conditional checks before operations: `if(ts!=="draw"||di>=deck.length)return;` at line 333
- Boundary checks: `if(np>=133)` at line 356, `np=Math.max(0,Math.min(133,np))` at line 354
- Array bounds checking with conditional access: `SPACES[i]?.color`, `landed.special?.name?.replace()`
- No try-catch blocks; errors assumed not to occur in game logic

## Logging

- Game events logged to `log` state array: `setLog(v=>[...v,{text:...,type:...,color:...}])`
- Log entries have `text`, `type` (e.g., "system", "stuck", "advance", "setback", "shortcut", "victory"), and optional `color`
- Displayed in "Book of Life" section at line 471-476
- Types determine visual styling in log display

## Comments

- Section dividers used for major logical sections: `/* ═══════════════════ SECTION ═══════════════════ */`
- Inline comments for complex calculations or non-obvious logic
- Few comments overall; code relies on clarity and naming conventions
- Not used in this codebase
- No type annotations beyond React prop usage

## Function Design

- Most functions are concise (10-50 lines)
- Longest functions: `App()` component (500+ lines), `SVGBoard()` (200+ lines), `draw()` callback (60 lines)
- Small utility functions preferred: `getAngle()` is 3 lines, `cardLabel()` is 1 line
- Functions take required params only; no options objects
- Destructuring used in React component props: `{spaces, players, cur, pts}` at line 91
- Callbacks passed via onClick handlers
- JSX returns for React components
- Computed values (arrays, objects, strings) for utilities
- `undefined` implicitly returned from procedures that mutate state

## Module Design

- Single default export: `export default function App()` at line 308
- All other code at module scope (not exported)
- Not used; single monolithic component file contains all logic
- Constants defined at top (`COLORS`, color mappings, index objects)
- Utility functions next (`buildSpaces()`, `interpPath()`, `getAngle()`, etc.)
- Component definitions (`SVGBoard`, `CardView`, `App`)
- All in single file `pilgrims-predestined-path.jsx`

## Patterns & Style Notes

- Ternary operators used extensively for inline conditionals and JSX rendering
- Logical operators for conditional rendering: `{stuckColor&&<span>...</span>}`
- Arrow functions for all callbacks: `const draw=useCallback(()=>{...},[...])`
- State updates via setState immutably: `setPlayers(v=>{const u=[...v];u[cur]={...u[cur],position:np};return u;})`
- Spread operator used for cloning: `[...v]`, `{...p}`, `[...wps[0]]`
- Inline styles with `style={}` objects
- No CSS files or classes
- Colors defined in constants: `CHX` (hex colors), `CDK` (dark colors)
- Gradient and filter definitions in SVG `<defs>` within component

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

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

- Single stateful component managing all game phases (setup → play → end)
- No external state management library (Redux, Zustand, Context API)
- Immediate mode rendering (React re-renders on every state change)
- Deterministic game logic: deck shuffled once at start, outcome predetermined
- SVG-based rendering for board visualization with smooth scrolling

## Layers

- Purpose: Render game board, cards, status messages, player tokens
- Location: `pilgrims-predestined-path.jsx`
- Contains: SVG board, card UI, control buttons, game log
- Depends on: Game state from App component, React hooks
- Used by: Browser DOM via React rendering
- Purpose: Handle card draws, movement calculations, turn progression, win conditions
- Location: `pilgrims-predestined-path.jsx` (lines 308–386 for event handlers)
- Contains: `draw()`, `next()`, `start()` functions; turn state machine
- Depends on: Game state (players, deck, current turn, stuck players)
- Used by: UI event handlers (button clicks)
- Purpose: Define board layout, card deck, named locations, special spaces
- Location: `pilgrims-predestined-path.jsx` (lines 3–88)
- Contains: `SPACES`, `WAYPOINTS`, `COLORS`, card definitions, location indices
- Depends on: Math utilities for path interpolation
- Used by: Game logic and rendering
- Purpose: Geometric and algorithmic helpers
- Location: `pilgrims-predestined-path.jsx` (lines 29–75, 78–88)
- Contains: `buildSpaces()`, `interpPath()`, `getAngle()`, `buildDeck()`, `findNext()`, `cardLabel()`
- Depends on: None
- Used by: Game logic and rendering

## Data Flow

### Primary Request Path (Card Draw → Movement → Next Player)

### Secondary Flow (Game Setup)

### End Game Flow

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

- Purpose: Represents one square/space on the 134-space path
- Examples: `SPACES[0]` (start), `SPACES[42]` (Martin Luther named location), `SPACES[133]` (Glorification end)
- Pattern: Array index position maps directly to path coordinate via interpolation
- Purpose: Drawn from deck to determine player movement
- Types:
- Pattern: Cards have type, color (except location), and optional target position
- Purpose: Control points for smooth SVG path curve
- Examples: 50 waypoints from start (75, 1015) to top (480, 60)
- Pattern: Linear path interpolated to 134 points for smooth bezier rendering
- **dot**: Trapping space (Slough of Despond, Dark Night of the Soul, Valley of Shadow) — color-specific escape required
- **named**: Character location (Brother Adam, John Knox, etc.) — landmark with icon and lore
- **landmark**: Geography location (Forest of Scripture, Mount Sinai, etc.) — informational
- **shortcut**: Skip ahead (Narrow Way at 48→60, Path of Election at 85→97) — unblockable advancement
- **final**: Glorification (position 133) — winning space

## Entry Points

- Location: `index.html`
- Triggers: Page load
- Responsibilities: Set up DOM structure (#root div), load fonts, import React entry point
- Location: `src/main.jsx`
- Triggers: React bootstrap
- Responsibilities: Render App component to #root DOM node
- `src/main.jsx` renders the App element from `./App.jsx` with `createRoot` inside `StrictMode`
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

### Monolithic Component

- `<GameSetup>` — player selection and rules (handle phase === "setup")
- `<GameBoard>` — SVG board rendering (accept `spaces`, `players`, `pts` as props)
- `<CardDraw>` — card display and draw button (accept `card`, `onDraw` as props)
- `<GameLog>` — log display (accept `log` as props)
- `<App>` — orchestrate state and pass props to children

### Inline Styling

## Error Handling

- Card draw failure (empty deck) is handled only by deck reshuffle check (line 383)
- No validation of player data
- No recovery from invalid board state
- Defensive programming: Clamp values (`Math.max`, `Math.min` on line 354)
- Guard clauses: Check phase and turn state before processing (e.g., line 332 `if(ts !== "draw" || di >= deck.length) return`)

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
