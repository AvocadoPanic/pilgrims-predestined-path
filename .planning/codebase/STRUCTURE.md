---
last_mapped_commit: 55f4cd08ff3960f4504472e8288e1698605bc2d0
last_mapped_at: 2026-09-29
---
# Codebase Structure

**Analysis Date:** 2026-09-29

## Directory Layout

```
pilgrims-predestined-path/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions: build and deploy to GitHub Pages
├── .git/                        # Git repository (local)
├── .planning/
│   └── codebase/                # Generated planning documents (this directory)
├── src/
│   └── main.jsx                 # React entry point (imports App from './App')
├── index.html                   # HTML entry point; loads src/main.jsx
├── pilgrims-predestined-path.jsx # Main App component (monolithic)
├── vite.config.js               # Vite build configuration
├── package.json                 # Project metadata and dependencies
├── LICENSE                      # MIT License
└── .gitignore                   # Git ignore rules (not shown)
```

## Directory Purposes

**`.github/workflows/`:**

- Purpose: CI/CD configuration for automated deployment
- Contains: GitHub Actions workflow files
- Key files: `deploy.yml` — triggers on push to main, publishes dist/ to GitHub Pages

**`src/`:**

- Purpose: React source code
- Contains: React entry point
- Key files: `main.jsx` — React bootstrap and root component render
- **Issue**: Expected to contain `App.jsx` but it doesn't (only `main.jsx` is present)

**`.planning/codebase/`:**

- Purpose: Auto-generated planning documents and architecture analysis
- Contains: ARCHITECTURE.md, STRUCTURE.md, and other analysis files
- Generated: Yes (by `/gsd-map-codebase` tool)
- Committed: Yes (part of repository)

**`<root>`:**

- Purpose: Configuration and entry points
- Contains: Vite config, package.json, main component, HTML entry
- Key files:
  - `index.html` — HTML shell; mounts React to #root
  - `pilgrims-predestined-path.jsx` — Main game component
  - `vite.config.js` — Build configuration
  - `package.json` — Dependencies (React, Vite, gh-pages)

## Key File Locations

**Entry Points:**

- `index.html` (line 11): Loads React app from `src/main.jsx`
- `src/main.jsx` (lines 1–5): React bootstrap; renders App component to #root

**Configuration:**

- `vite.config.js`: Build tool settings (base path, routing)
- `package.json`: Dependencies, build scripts, project metadata
- `.github/workflows/deploy.yml`: Deployment pipeline (GitHub Pages)

**Core Logic:**

- `pilgrims-predestined-path.jsx` (lines 1–482): Entire game implementation
  - Lines 3–40: Constants (colors, character indices, special spaces, waypoints)
  - Lines 42–75: Path geometry and helpers (interpolation, angle calculation)
  - Lines 78–88: Card deck building and lookup utilities
  - Lines 91–278: SVGBoard component (board visualization)
  - Lines 281–302: CardView component (card display)
  - Lines 308–481: App component (game state and logic)

**Testing:**

- None. No test files present.

## Naming Conventions

**Files:**

- Kebab-case for configuration: `vite.config.js`, `deploy.yml`
- PascalCase for React components: `pilgrims-predestined-path.jsx` (follows component naming, though unusual to include hyphens)
- Lowercase for directories: `src/`, `.github/`, `.planning/`

**Directories:**

- Dot-prefix for meta-directories: `.github/`, `.planning/`, `.git/`
- Lowercase semantic names: `workflows/`, `codebase/`

**JavaScript Variables:**

- UPPERCASE for constants: `COLORS`, `WAYPOINTS`, `SPACES`, `NAMED_IDX`, `PC` (player colors)
- camelCase for functions: `buildSpaces()`, `interpPath()`, `getAngle()`, `findNext()`
- camelCase for state variables: `phase`, `numP`, `players`, `deck`, `cur`, `card`
- Single-letter for loop variables: `i`, `j`, `n`, `r`

**CSS/Styling:**

- camelCase in inline style objects (React convention)
- Hex colors stored in objects: `CHX` (hex colors), `CDK` (dark colors)
- Gradient/shadow values hardcoded in style objects

## Where to Add New Code

**New Feature (e.g., new card type):**

- Card deck builder: `pilgrims-predestined-path.jsx` lines 78–85 (`buildDeck()`)
- Card logic handler: `pilgrims-predestined-path.jsx` lines 332–379 (`draw()` function)
- Card display: `pilgrims-predestined-path.jsx` lines 281–302 (`CardView` component)

**New Game Phase (e.g., pause, rules dialog):**

- Phase state: Add case to `phase` useState (line 310)
- Phase rendering: Add conditional block in App component lines 389–481
- Phase transition: Update `setPhase()` calls in event handlers

**New Board Space Type:**

- Space definitions: Add to `NAMED_IDX`, `DOT_IDX`, `SHORTCUT_IDX`, or `LANDMARK_IDX` (lines 8–27)
- Space builder: Update `buildSpaces()` logic lines 29–39
- Space rendering: Add conditional block in SVGBoard lines 201–272

**New Player Action or Event:**

- Event handler: Define new `useCallback()` (pattern: lines 332, 381)
- UI button: Add to Controls section lines 451–477
- State update: Dispatch to existing state or add new `useState()` hook

**Utilities or Helpers:**

- Geometric helpers: `pilgrims-predestined-path.jsx` lines 52–75 (path interpolation, angles)
- Card helpers: `pilgrims-predestined-path.jsx` lines 78–88 (findNext, cardLabel)
- Game logic: Add to App or extract to separate functions before callback handlers

**Testing:**

- Create `src/__tests__/` directory
- Follow pattern: `*.test.jsx` or `*.spec.jsx`
- No testing framework currently configured; recommend Vitest + React Testing Library

**Styling:**

- Extract inline styles from `pilgrims-predestined-path.jsx` to CSS module: `pilgrims-predestined-path.module.css`
- Or use CSS-in-JS: styled-components, emotion
- Import and apply to components

## Special Directories

**`.github/workflows/`:**

- Purpose: GitHub Actions automation
- Generated: No (user-configured)
- Committed: Yes
- Use: Define CI/CD steps for testing, building, deploying

**`.planning/codebase/`:**

- Purpose: Architecture and structure documentation
- Generated: Yes (by `/gsd-map-codebase` orchestrator)
- Committed: Yes (part of git repository)
- Use: Reference when planning features or understanding codebase patterns

**`.git/`:**

- Purpose: Version control metadata
- Generated: Yes (git init)
- Committed: N/A (meta-directory)

## Component Hierarchy

```
<App> (pilgrims-predestined-path.jsx:308)
├── Setup UI (phase === "setup")
│   ├── Title & description
│   ├── Player count selector
│   └── Start button
├── Game Board (phase === "play" || "end")
│   ├── <SVGBoard> (line 91)
│   │   ├── Background (gradient, stars, mountains, trees)
│   │   ├── Path (waypoint interpolation)
│   │   ├── Spaces (circles with labels for each board position)
│   │   └── Player tokens (colored circles with player number)
│   ├── Player status bar (current player highlight, stuck status)
│   ├── <CardView> (line 281) — Card display or draw button
│   ├── Control buttons ("Next Pilgrim" when ts === "next")
│   ├── Message panel (narrative/status text)
│   └── Game log (scrollable history)
└── Victory screen (phase === "end")
    ├── Victory message
    └── Play Again button
```

## Code Organization Patterns

**Constants at top:**

- `COLORS`, `CHX`, `CDK` — color palette
- `NAMED_IDX`, `DOT_IDX`, `SHORTCUT_IDX`, `LANDMARK_IDX` — board special spaces (lines 8–27)
- `WAYPOINTS` — path control points (lines 43–50)
- `PC` (player colors), `PN` (player names) — game UI (line 305–306)

**Utility functions before component:**

- `buildSpaces()` — construct board state (lines 29–40)
- `interpPath()` — smooth curve interpolation (lines 52–70)
- `getAngle()` — calculate direction for player tokens (lines 72–75)
- `buildDeck()` — shuffle and create card deck (lines 78–85)
- `cardLabel()` — format card name for display (line 86)
- `findNext()` — locate next space of given color (line 88)

**Component functions:**

- `SVGBoard()` — render game board (lines 91–278)
- `CardView()` — display card or draw button (lines 281–302)
- `App()` — main game logic and orchestration (lines 308–481)

**Inline styling:**

- All styles defined as objects spread into `style={}` prop
- No CSS files
- Theme colors referenced from `CHX`, `CDK` constants or hardcoded hex values

## Import Paths

**Currently used:**

- `react` — Named imports: `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`
- `react-dom` — `ReactDOM.render()` (in `src/main.jsx`)

**Example from codebase:**

```jsx
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// pilgrims-predestined-path.jsx:1
```

---

*Structure analysis: 2026-09-29*
