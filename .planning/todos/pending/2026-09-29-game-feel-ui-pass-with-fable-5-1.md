---
created: 2026-09-29T23:42:51.481Z
title: Game-feel UI pass with Fable 5.1
area: ui
severity: cosmetic
files:
  - src/App.jsx:91-302 (SVGBoard, CardView; moved from pilgrims-predestined-path.jsx in Phase 1)
  - src/App.jsx:389-479 (setup, play and end screens)
---

## Problem

The game works but looks like a functional prototype: inline styles, flat colors, and no motion or sound. The user wants a dedicated visual pass run on the most capable model available (Fable 5.1, `claude-fable-5-1`, or its successor) so the app looks as good as it can.

User's words: "this is a game, the ui should be engaging, exciting using design principles, color advanced techniques and perhaps feature sound effects, etc."

Severity is cosmetic (no bug), but the ambition is high: it should feel like a game, not a form.

2026-09-30, after Phase 1 went live: the user checked https://avocadopanic.github.io/pilgrims-predestined-path/ on desktop. User's words: "It looks ok. Very small and difficult to read on desktop. Maybe save this for the future UI review." The board and text need to scale up to use a desktop viewport (related: LAY-03 Large text, LAY-02 projector). Code review IN-04 (01-REVIEW.md) also notes the default 8px body margin under a `min-height:100vh` root gives a permanent scrollbar and a white gutter.

## Solution

TBD. Direction from the user:
- Run the pass with Fable 5.1 (set the model explicitly for the UI agents, e.g. `/gsd-ui-phase` researcher and executor, or a dedicated quick task).
- Apply design principles and advanced color: gradients, lighting and depth on the board, a consistent palette built from the existing gold `#daa520` on `#0a0608`, card-draw and token-movement animation, and celebratory moments (shortcuts, Glorification).
- Maybe add sound effects (card draw, move, trap, shortcut, victory). Sound is a new capability, so scope it when the pass is planned.

Timing: best after Phase 6 (Phone and Projector Play), once every gameplay screen exists (question card, quiz, layout). It could also fold into Phase 6's `/gsd-ui-phase` UI-SPEC. Doing it earlier means restyling screens that Phases 4 to 6 still change.

Constraints the pass must keep:
- WCAG AA contrast (LAY-04), Large text (LAY-03), readability on phone and projector (LAY-01, LAY-02).
- `prefers-reduced-motion`. Sound off by default or with an obvious mute, remembered under the game's namespaced storage key (BIB-05 pattern).
- Audience includes children and church classes.
- Any sound or image assets must be precached for offline play (PWA-03) and stay small.
- Must not change card movement or board colors that affect reachability.
