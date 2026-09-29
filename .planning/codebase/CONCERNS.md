---
last_mapped_commit: 55f4cd08ff3960f4504472e8288e1698605bc2d0
last_mapped_at: 2026-09-29
---
# Codebase Concerns

**Analysis Date:** 2026-09-29

## Tech Debt

**React 18 API incompatibility in entry point:**

- Issue: `src/main.jsx` uses `ReactDOM.render()` (React 17 API), but `package.json` specifies `react@^18.0.0`. React 18 requires `createRoot()` instead.
- Files: `src/main.jsx`
- Impact: React 18 still supports `ReactDOM.render`, but logs a deprecation warning and runs the app in legacy (React 17) mode, so concurrent features are disabled. Not a crash on its own.
- Fix approach: Update `src/main.jsx` to use `createRoot()` and `root.render()` pattern required by React 18+.

**Missing Vite React plugin:**

- Issue: `vite.config.js` does not include `@vitejs/plugin-react`. Without it, Vite's built-in esbuild transform compiles JSX to classic `React.createElement(...)` calls, which need `React` in scope.
- Files: `vite.config.js`, `pilgrims-predestined-path.jsx:1` (imports only hooks, not the `React` default export)
- Impact: Likely `ReferenceError: React is not defined` at runtime in `pilgrims-predestined-path.jsx` (inferred from Vite 3 defaults; not yet run). Fast Refresh also unavailable.
- Fix approach: Add `@vitejs/plugin-react` (automatic JSX runtime) to devDependencies and vite config, or import `React` in each JSX file.

**Monolithic component architecture:**

- Issue: `pilgrims-predestined-path.jsx` is 481 lines of tightly coupled logic handling UI rendering, game state, card logic, board rendering, and player management all in one file.
- Files: `pilgrims-predestined-path.jsx`
- Impact: Difficult to test individual features, high cyclomatic complexity, difficult to reuse components, makes debugging harder, increases cognitive load for maintenance.
- Fix approach: Decompose into smaller components: `GameBoard`, `CardView`, `PlayerStatus`, `GameLog`, `GameSetup`, etc. Extract game logic into separate hooks or service modules.

**Missing entry point configuration:**

- Issue: `src/main.jsx` imports `App` from `'./App'`, but no `src/App.jsx` file exists. The actual App component is in `pilgrims-predestined-path.jsx` at the repository root.
- Files: `src/main.jsx`, `pilgrims-predestined-path.jsx`
- Impact: Application will fail to start with "Cannot find module" error. The import path is incorrect.
- Fix approach: Move `pilgrims-predestined-path.jsx` to `src/App.jsx` and correct the import path in `src/main.jsx`.

## Known Bugs

**GitHub Actions workflow syntax error:**

- Symptoms: Deploy workflow will fail to parse. The YAML contains literal `\n` escape sequences instead of actual newlines.
- Files: `.github/workflows/deploy.yml`
- Trigger: Running the GitHub Actions workflow will immediately fail with YAML parsing error before any jobs run.
- Workaround: Cannot run deployments until workflow is fixed.

**Build output directory mismatch in deployment:**

- Symptoms: GitHub Pages deployment fails or deploys empty site. The workflow publishes from `./docs` directory, but Vite (the build tool) builds output to `./dist` by default.
- Files: `.github/workflows/deploy.yml`, `vite.config.js`
- Trigger: Running `npm run build` creates `./dist`, but the deploy action looks for files in `./docs`.
- Workaround: Manually copy files from dist to docs, or fix workflow and vite config to use consistent directory.

## Security Considerations

**No .gitignore file:**

- Risk: Dependencies (`node_modules/`), build output (`dist/`), and potentially sensitive environment files could be accidentally committed to version control.
- Files: (Missing file)
- Current mitigation: Relies on Git's built-in defaults and manual care.
- Recommendations: Create `.gitignore` file excluding: `node_modules/`, `dist/`, `.env`, `.env.local`, `.DS_Store`, `*.log`.

**No dependency lock file:**

- Risk: `package-lock.json` or `yarn.lock` is not committed. Different environments (local, CI/CD, production) may install different versions of dependencies, leading to inconsistent behavior ("works on my machine" problem).
- Files: (Missing lock file)
- Current mitigation: None.
- Recommendations: Run `npm install` to generate `package-lock.json` and commit it to version control.

## Performance Bottlenecks

**SVG board rendering efficiency:**

- Problem: The `SVGBoard` component re-renders the entire SVG (40+ star circles, 6 mountains, 30 trees, 134 game spaces, and all player tokens) on every state change. No memoization of static elements.
- Files: `pilgrims-predestined-path.jsx:91-278`
- Cause: Mountains and trees are memoized, but the entire board is not. Game state updates (card draws, player moves) trigger full re-render of all SVG paths and circles.
- Improvement path: Extract static decorative elements into separate memoized components. Use `React.memo()` on SVGBoard or subdivide into `SVGDecoratives`, `SVGSpaces`, `SVGPlayers` sub-components.

**Inline style recalculation:**

- Problem: Every element uses inline `style` objects created fresh on each render, causing object re-creation and potential layout thrashing.
- Files: `pilgrims-predestined-path.jsx` (throughout, especially lines 283-301, 390-422, 446-478)
- Cause: No stylesheet or CSS-in-JS library; all styles are inline objects re-created per render.
- Improvement path: Extract common style objects outside components or use a CSS file / CSS-in-JS library.

## Fragile Areas

**Game state and turn logic:**

- Files: `pilgrims-predestined-path.jsx:325-386`
- Why fragile: Complex state mutations in `draw()` and `next()` with multiple branching paths. No validation that state transitions are legal. Magic numbers (133, 134, 2) are hardcoded. Deck reshuffling happens based on `di >= deck.length - 2`, which could allow out-of-bounds access.
- Safe modification: Add JSDoc comments explaining each state branch. Add input validation for player positions and deck indices. Extract magic numbers to named constants (`FINAL_SPACE = 133`, `TOTAL_SPACES = 134`, etc.).
- Test coverage: Zero test coverage. No unit tests for draw logic, position calculation, or deck management.

**Card drawing and position calculation:**

- Files: `pilgrims-predestined-path.jsx:88, 345-378`
- Why fragile: `findNext()` iterates from position+1 to 134 and skips based on `skip` parameter. If skip is >= number of matching spaces remaining, it silently returns 133 (final space). `interpPath()` interpolates waypoints but uses hardcoded 134. Changes to space count would require updating multiple locations.
- Safe modification: Add bounds checking and explicit handling of "no matching space found" case. Extract space count to constant.
- Test coverage: No tests for edge cases (last player near end, skip > available spaces).

**Landing logic with multiple special types:**

- Files: `pilgrims-predestined-path.jsx:362-378`
- Why fragile: Sequence of `if` statements checking space type. If space type is added or priorities change, all landing logic must be revisited. No clear precedence rules documented.
- Safe modification: Define a space type precedence system. Use switch statement or a dispatch map instead of if-else chain.
- Test coverage: No tests verifying correct behavior for shortcuts, dots, named locations, and landmarks.

## Scaling Limits

**Deck size and reshuffling:**

- Current capacity: 72 cards in initial deck (60 single + 12 double), reshuffles when 2 cards remain.
- Limit: With 4 players, the game could theoretically continue indefinitely if no one reaches space 133. Memory usage of the game log (`log` state) grows unbounded with each turn.
- Scaling path: Implement log truncation or virtual scrolling for the log. Set a game turn limit. Test performance with extended play sessions (100+ turns).

**Player count:**

- Current capacity: Hardcoded to 2-4 players (see lines 417-420).
- Limit: UI may overflow or become crowded with 5+ players (player status bar, card layout assumes 4 colors).
- Scaling path: Support variable player count. Refactor color assignment to use dynamic palette. Test layout responsiveness.

## Dependencies at Risk

**React 18 with React 17 API:**

- Risk: Major breaking change between versions. Current code won't run with the declared dependency.
- Impact: Build will fail or runtime errors occur.
- Migration plan: Update to React 18 entry point pattern (`createRoot`) as described in React 18 migration guide.

**Vite 3.0 without React plugin:**

- Risk: See "Missing Vite React plugin" above; Vite's default JSX handling uses the classic runtime.
- Impact: Build succeeds but runtime likely fails with `React is not defined` unless `React` is imported.
- Migration plan: Add `@vitejs/plugin-react` to dependencies and vite config.

**gh-pages ^4.0.0:**

- Risk: Deployment depends on gh-pages package. If workflow is broken (YAML syntax issue), deployment won't work even with correct publish directory.
- Impact: Continuous deployment to GitHub Pages is currently non-functional.
- Migration plan: Fix workflow YAML, verify deployment works locally with `npm run deploy`, then verify in CI/CD.

## Missing Critical Features

**No error boundaries:**

- Problem: No React error boundary components defined. A runtime error in any child component will crash the entire app with a white screen.
- Blocks: Graceful error handling, ability to recover from unexpected states.

**No testing infrastructure:**

- Problem: Zero test files. No test runner configured (Jest, Vitest, etc.).
- Blocks: Refactoring, ensuring game logic correctness, regression detection, confident deployments.

**No input validation:**

- Problem: Game logic assumes valid state but never validates player moves or state transitions.
- Blocks: Detecting corrupted game state, preventing cheating, debugging issues.

**No accessibility (a11y):**

- Problem: No ARIA labels, alt text, or semantic HTML. SVG interactive elements have no keyboard support or screen reader announcements.
- Blocks: Users with visual or motor impairments cannot use the application.

## Test Coverage Gaps

**Game logic entirely untested:**

- What's not tested: Card drawing, position calculation (findNext), space landing rules, shortcut triggers, trap escape, deck reshuffling, game ending condition, player turn rotation.
- Files: `pilgrims-predestined-path.jsx:29-88, 325-386`
- Risk: Any refactoring of `draw()`, `findNext()`, or space type handling could silently break game mechanics. Bugs in position calculation or card logic won't be caught.
- Priority: High — core game logic must be tested.

**UI component rendering untested:**

- What's not tested: CardView appearance for different card types, player token positioning, board scrolling, space highlighting.
- Files: `pilgrims-predestined-path.jsx:91-301`
- Risk: UI changes may introduce visual bugs or accessibility issues undetected until manual testing.
- Priority: Medium — catch regressions early.

**Integration/end-to-end untested:**

- What's not tested: Setup flow, full game play (multiple turns, special spaces, game ending), deck reshuffling, player rotation.
- Files: `pilgrims-predestined-path.jsx:389-481`
- Risk: Complex interactions between components and state may have subtle bugs (e.g., off-by-one errors, race conditions).
- Priority: Medium — validate complete workflows.

---

*Concerns audit: 2026-09-29*
