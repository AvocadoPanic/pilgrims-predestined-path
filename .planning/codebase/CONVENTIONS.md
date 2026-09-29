---
last_mapped_commit: 55f4cd08ff3960f4504472e8288e1698605bc2d0
last_mapped_at: 2026-09-29
---
# Coding Conventions

**Analysis Date:** 2026-09-29

## Naming Patterns

**Files:**

- `.jsx` extension for React components
- `.js` extension for configuration and utilities
- PascalCase for React component files (though most code lives in single `pilgrims-predestined-path.jsx`)

**Functions:**

- camelCase for all functions: `buildSpaces()`, `interpPath()`, `getAngle()`, `findNext()`, `cardLabel()`
- Abbreviated function names commonly used: `draw()`, `start()`, `next()`

**Variables:**

- camelCase for all variable names: `numP`, `cur`, `card`, `players`, `deck`, `pts`
- Single or double letter abbreviations are common: `p` (player), `c` (card), `i` (index), `n` (number), `s` (space), `t` (tree), `m` (mountain), `d` (distance), `dx`/`dy` (delta x/y), `sp` (space), `np` (new position), `sc` (stuck color), `di` (deck index), `lr` (log ref), `wi` (word index), `li` (line index)
- Short variable names in loops and mathematical calculations

**Constants:**

- UPPER_SNAKE_CASE for all module-level constants: `COLORS`, `CHX`, `CDK`, `NAMED_IDX`, `DOT_IDX`, `SHORTCUT_IDX`, `LANDMARK_IDX`, `SPACES`, `WAYPOINTS`, `FLAVORS`, `PC`, `PN`
- Constants are defined at module scope and never reassigned

**React Components:**

- PascalCase: `App`, `SVGBoard`, `CardView`
- State variables use camelCase: `phase`, `numP`, `players`, `deck`, `cur`, `card`, `ts` (turn state), `msg`, `stuck`, `log`, `winner`

## Code Style

**Formatting:**

- No external formatter configured (no Prettier)
- Inline styles used throughout instead of CSS files
- Component JSX intermixed with business logic
- Extensive use of ternary operators for conditional rendering
- Line lengths vary widely; some lines exceed 100 characters

**Linting:**

- No linting configuration detected (no .eslintrc)
- Relies on manual code review

**Indentation:**

- 2-space indentation observed in JSX (line 390-481 in `pilgrims-predestined-path.jsx`)
- Consistent with Vite defaults

## Import Organization

**Order:**

1. React library imports (`import React from 'react'`, `import ReactDOM from 'react-dom'`)
2. Hook imports (`import { useState, useEffect, useRef, useCallback, useMemo } from "react"`)
3. Local component/file imports (`import App from './App'`)

**Path Aliases:**

- No path aliases configured
- Relative imports used throughout (`./App`, `./main.jsx`)

## Error Handling

**Patterns:**

- Guard clauses with early returns: `if(!svgRef.current||!cp)return;` at `pilgrims-predestined-path.jsx:96`
- Conditional checks before operations: `if(ts!=="draw"||di>=deck.length)return;` at line 333
- Boundary checks: `if(np>=133)` at line 356, `np=Math.max(0,Math.min(133,np))` at line 354
- Array bounds checking with conditional access: `SPACES[i]?.color`, `landed.special?.name?.replace()`
- No try-catch blocks; errors assumed not to occur in game logic

## Logging

**Framework:** Console not explicitly used; logging handled via game state (`log` array in App component)

**Patterns:**

- Game events logged to `log` state array: `setLog(v=>[...v,{text:...,type:...,color:...}])`
- Log entries have `text`, `type` (e.g., "system", "stuck", "advance", "setback", "shortcut", "victory"), and optional `color`
- Displayed in "Book of Life" section at line 471-476
- Types determine visual styling in log display

## Comments

**When to Comment:**

- Section dividers used for major logical sections: `/* ═══════════════════ SECTION ═══════════════════ */`
- Inline comments for complex calculations or non-obvious logic
- Few comments overall; code relies on clarity and naming conventions

**JSDoc/TSDoc:**

- Not used in this codebase
- No type annotations beyond React prop usage

**Examples:**

```javascript
/* ═══════════════════ CONSTANTS ═══════════════════ */
/* ─── SETUP ─── */
/* ─── PLAY/END ─── */
/* background trees */
/* Path shadow */
```

## Function Design

**Size:** 

- Most functions are concise (10-50 lines)
- Longest functions: `App()` component (500+ lines), `SVGBoard()` (200+ lines), `draw()` callback (60 lines)
- Small utility functions preferred: `getAngle()` is 3 lines, `cardLabel()` is 1 line

**Parameters:**

- Functions take required params only; no options objects
- Destructuring used in React component props: `{spaces, players, cur, pts}` at line 91
- Callbacks passed via onClick handlers

**Return Values:**

- JSX returns for React components
- Computed values (arrays, objects, strings) for utilities
- `undefined` implicitly returned from procedures that mutate state

## Module Design

**Exports:**

- Single default export: `export default function App()` at line 308
- All other code at module scope (not exported)

**Barrel Files:**

- Not used; single monolithic component file contains all logic

**Structure:**

- Constants defined at top (`COLORS`, color mappings, index objects)
- Utility functions next (`buildSpaces()`, `interpPath()`, `getAngle()`, etc.)
- Component definitions (`SVGBoard`, `CardView`, `App`)
- All in single file `pilgrims-predestined-path.jsx`

## Patterns & Style Notes

**Shorthand operators:**

- Ternary operators used extensively for inline conditionals and JSX rendering
- Logical operators for conditional rendering: `{stuckColor&&<span>...</span>}`
- Arrow functions for all callbacks: `const draw=useCallback(()=>{...},[...])`

**Object/Array mutations:**

- State updates via setState immutably: `setPlayers(v=>{const u=[...v];u[cur]={...u[cur],position:np};return u;})`
- Spread operator used for cloning: `[...v]`, `{...p}`, `[...wps[0]]`

**Styling approach:**

- Inline styles with `style={}` objects
- No CSS files or classes
- Colors defined in constants: `CHX` (hex colors), `CDK` (dark colors)
- Gradient and filter definitions in SVG `<defs>` within component

---

*Convention analysis: 2026-09-29*
