---
last_mapped_commit: 55f4cd08ff3960f4504472e8288e1698605bc2d0
last_mapped_at: 2026-09-29
---
# Testing Patterns

**Analysis Date:** 2026-09-29

## Test Framework

**Status:** No testing framework currently configured

**Current State:**

- No Jest, Vitest, or other test runner installed
- No test files (`.test.js`, `.spec.js`) in codebase
- No test configuration files (`jest.config.js`, `vitest.config.js`)
- No testing libraries in `package.json` (no `@testing-library/react`, `jest`, `vitest`)
- No test script in `package.json`

**Recommended Setup (if testing is added):**

- **Framework:** Vitest (aligns well with Vite build tool already in use)
- **React Testing:** React Testing Library or Vitest with `jsdom` environment
- **Assertion Library:** Vitest's built-in `expect()` or Chai

## Test File Organization

**Current:** Not applicable (no tests exist)

**Recommended Pattern (if added):**

- **Location:** Co-located with source
  - `pilgrims-predestined-path.jsx` → `pilgrims-predestined-path.test.jsx`
  - `src/main.jsx` → `src/main.test.jsx`
  
**Naming:**

- `.test.jsx` suffix for test files
- File name matches source file name

**Structure:**

```
src/
├── main.jsx
├── main.test.jsx
pilgrims-predestined-path.jsx
pilgrims-predestined-path.test.jsx
```

## Test Structure

**Recommended Pattern (for this codebase):**

The monolithic component structure (`pilgrims-predestined-path.jsx` with all logic in one file) makes testing challenging. Recommended approach if tests are added:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import App from './pilgrims-predestined-path';
import { describe, it, expect, beforeEach } from 'vitest';

describe('App - Game Setup', () => {
  beforeEach(() => {
    // Reset any module state
  });

  it('renders setup screen initially', () => {
    render(<App />);
    expect(screen.getByText(/The Pilgrim's Predestined Path/i)).toBeInTheDocument();
  });

  it('starts game with selected player count', () => {
    render(<App />);
    const playButton = screen.getByText(/Submit to Providence/i);
    fireEvent.click(playButton);
    // Assert game phase changed
  });
});

describe('Game Mechanics', () => {
  it('draws card and advances player', () => {
    // Test deck draw and player position update
  });

  it('traps player on dot space', () => {
    // Test stuck state logic
  });

  it('recognizes winner at position 133', () => {
    // Test victory condition
  });
});
```

## Mocking

**Current:** Not applicable (no mocking in use)

**Framework:** Would use Vitest's built-in mocking (`vi.mock()`) or `@testing-library/react`

**What to Mock (if tests are added):**

- Random shuffle in `buildDeck()` (line 83-84): Seed randomness for predictable test outcomes
- `Math.random()` calls in tree generation and deck shuffle
- Array.from with seeded values for consistent test data

**What NOT to Mock:**

- Game state hooks (useState, useEffect) - let React Testing Library handle them
- Core game logic functions (buildSpaces, findNext) - test these directly
- SVG rendering - can test through component integration tests

## Fixtures and Factories

**Test Data (not yet implemented):**

Recommended pattern for creating test players and cards:

```javascript
function createTestPlayer(overrides = {}) {
  return {
    id: 0,
    position: 0,
    color: '#c0392b',
    name: 'The Elect',
    ...overrides
  };
}

function createTestCard(overrides = {}) {
  return {
    type: 'single',
    color: 'red',
    ...overrides
  };
}

function createTestGameState(overrides = {}) {
  return {
    phase: 'play',
    players: [createTestPlayer()],
    deck: [createTestCard()],
    cur: 0,
    card: null,
    stuck: {},
    ...overrides
  };
}
```

**Location:** Would place in `src/test/factories.js` or `__fixtures__/game.js` if implemented

## Coverage

**Requirements:** None currently enforced

**Recommended (if testing added):**

- Minimum 60% statement coverage for game logic
- 80% for critical paths (player movement, card drawing, victory detection)
- 100% for boundary conditions and state transitions

**View Coverage (hypothetical):**

```bash
npm run test:coverage  # Would show coverage report
```

## Test Types

**Unit Tests (if implemented):**

- **Scope:** Individual utility functions
- **Approach:** Test in isolation with mocked inputs
- **Examples:**
  - `buildSpaces()` returns 134 spaces with correct colors and types
  - `interpPath(waypoints, 134)` generates interpolated points
  - `findNext(position, color, skip)` returns correct next space
  - `getAngle(points, index)` calculates correct rotation
  - `cardLabel(card)` returns correct label for all card types

**Integration Tests (if implemented):**

- **Scope:** Component behavior and state transitions
- **Approach:** Render component and test user interactions
- **Examples:**
  - Setup phase: player count selection → start game
  - Draw phase: click draw → card appears → advances player
  - Trap logic: landing on dot space → trap state set → needs color
  - Victory: player reaches position 133 → game ends
  - Deck reshuffle: deck runs out → reshuffled automatically

**E2E Tests:**

- Not currently used
- Could implement with Playwright/Cypress if needed for full game flow testing

## Common Patterns

**Async Testing (if used):**

```javascript
it('loads game state asynchronously', async () => {
  render(<App />);
  // Use waitFor for async operations if they exist
  await waitFor(() => {
    expect(screen.getByText(/Board/)).toBeInTheDocument();
  });
});
```

**Error Testing (if used):**

```javascript
it('handles edge case at position 133', () => {
  const player = createTestPlayer({ position: 133 });
  // Assert game recognizes win condition
});

it('bounds check prevents negative positions', () => {
  const position = Math.max(0, Math.min(133, -1));
  expect(position).toBe(0);
});
```

## Gaps & Recommendations

**Current Test Coverage:** 0% (no tests)

**Untested Areas:**

- `buildSpaces()` - Space creation and type assignment
- `interpPath()` - Waypoint interpolation for board layout
- `getAngle()` - Angle calculation for player token rotation
- `buildDeck()` - Deck assembly and shuffling
- `findNext()` - Next space calculation for each color
- `draw()` callback - Card draw logic, player advancement, state updates
- `next()` callback - Turn transitions and deck reshuffle
- `SVGBoard` component - Board rendering and player token display
- `CardView` component - Card rendering (drawn vs undrawn states)
- `App` component - Game flow (setup → play → end), state management

**Risk:** High-impact areas are untested. Changes to core game logic (`draw`, `findNext`, space building) could introduce bugs unnoticed.

**Priority for Testing (if implementing):**

1. **High:** `findNext()`, `draw()`, game state transitions (movement, trapping, victory)
2. **Medium:** `buildSpaces()`, `interpPath()` (geometry), component rendering
3. **Low:** UI interactions (animation, styling)

---

*Testing analysis: 2026-09-29*
