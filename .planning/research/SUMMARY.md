# Research Synthesis: Pilgrim's Predestined Path

**Date:** 2026-09-29  
**Scope:** Static React + Vite board game on GitHub Pages; theological Q&A on board spaces, installable PWA

## Executive Summary

The Pilgrim's Predestined Path is a satirical-but-theologically-accurate Reformed theology board game for a mixed audience. The technical foundation is sound: React 19 + Vite 8 + Vitest + vite-plugin-pwa. The game's core value hinges on a content pipeline that verifies every quotation against primary sources and respects Scripture licensing.

The research surfaced one critical blocker: the setup screen quotes Calvin's Institutes III.21.5, but the text does not appear in any published edition of Calvin. This must be replaced before shipping. All other major decisions are documented (quiz as optional, pool-based question draws, density via simulation), and the build order is clear. Confidence is high on tech stack and architecture; moderate on licensing (requires Crossway email verification); high on pitfalls research.

The roadmap should structure phases tightly around dependencies: deploy fix gates everything; copy rewrite is cheap and high-credibility; content validation is the longest phase but runs in parallel. PWA is deferred to Step 9 so the service worker caches only final, verified content.

## Key Findings

### From STACK.md

- Node.js 24.x, Vite 8.3.1, React 19.3.0, @vitejs/plugin-react 6.1.1, Vitest 5.0.2, Zod 4.6.5
- GitHub Actions workflow with Pages source = "GitHub Actions"
- vite-plugin-pwa 1.3.0 (generateSW mode) compatible with Vite 8
- Bible text: Bundle, never fetch at runtime
- BSB: public domain (simplest)
- KJV: public domain outside UK
- ESV: 500 verses max, <25% of work, full notice required. Ask Crossway about commentary clause
- NET: Adopt ESV limits as policy. Label must hyperlink to netbible.org
- Self-host fonts (currently from Google Fonts)
- PWA: prompt mode with auto-apply on setup screen

### From FEATURES.md

**Table stakes:**
1. Question card (quip → answer → Go deeper) on fixed and pool spaces
2. 18 fixed questions on special spaces
3. 25-30+ pool questions, no repeats within game
4. **BLOCKER: Calvin quote must be replaced** (not in III.21.5)
5. Bible translation selector with attribution notices
6. Optional quiz: multiple choice, no penalty, +2 bonus for correct
7. Rewrite rules/TULIP to stop implying fatalism
8. PWA: installable, offline, updates between games

**Key risks:**
- Verse differences across translations
- Jokes must mock behavior, not doctrine
- Mixed audience needs warm handling of despair

### From ARCHITECTURE.md

**3-layer structure:**
- game/ (pure JS)
- content/ (data + helpers)
- components/ (React)

**Turn state machine:**
- phase = draw | quiz | next | done
- Landing precedence: stuck gate → movement → victory → shortcut → trap → question → bonus

**Pool mechanics:**
- Shuffle poolIds once; draw order[next++] per landing
- Pool size >= 30
- Exhaustion fallback: plain space

**Build order (9 steps):**
0. Deploy fix → 1. Test harness → 2. UI carve-out → 3. Content schema → 4. Question state → 5. Quiz → 6. Translations → 7. Layout → 8. Accuracy gate → 9. PWA

**Simulation (20k+ games):**
- Landing frequency: 0.19-0.67 (not uniform)
- Pool exhaust <0.3% (30-pool acceptable)
- Endgame overshoot: 76% of 4-player games

### From PITFALLS.md

**21 critical pitfalls. Top 5:**

1. ESV breach: bundle <=500 verses, ask Crossway about commentary
2. **Calvin quote fabricated: Step 8 BLOCKER**
3. **Fatalism language: Step 2/8 HIGH-IMPACT** (rewrite 14 strings)
4. TULIP glosses misstate points (rewrite all 5)
5. Verse parity fails (test all refs in all 4 files)

**Fatalism strings requiring rewrite:**
- Line 328: "The outcome is fixed"
- Line 404: "There are no decisions"
- Line 385: "the decree awaits"
- Line 466: "never going to arrive"
- Line 467: "as if you had a choice"

**Child-safety (PITFALL 17):**
- No hell imagery in layers 1-2
- Reprobation only in "Go deeper"
- Skip button, end screen "Everyone counts"

## Implications for Roadmap

**9-phase structure with dependencies:**

Step 0 (Deploy fix) gates all others
→ Steps 1 + 3 parallel (test + content schema)
→ Step 2 (copy extraction for Step 8 rewrite)
→ Step 4 (question state)
→ Steps 5 + 6 parallel (quiz + translations)
→ Step 7 (layout, needs real devices)
→ Step 8 (accuracy: Calvin quote, fatalism)
→ Step 9 (PWA, after content final)

**Critical path:**
- Step 0: Deploy to GitHub Pages (1-2 days)
- Step 1: Test harness + engine extraction (3-5 days)
- Step 2: UI carve-out + copy.js (2-3 days, enables fatalism rewrite)
- Step 3: Content model + validators (3-4 days, parallel with 1-2)
- Step 4: Question state + panel (4-6 days)
- Step 5-6: Quiz + translations (parallel, 2-4 days each)
- Step 7: Layout/projector (3-5 days, real devices required)
- Step 8: Accuracy gate + rewrites (4-6 days, BLOCKER on Calvin)
- Step 9: PWA (2-3 days after Step 8)

## Confidence Assessment

| Area | Level | Notes |
|------|-------|-------|
| Stack | HIGH | Trial build verified; npm registry, GitHub Actions official docs |
| Features | MEDIUM-HIGH | Solid; audience fit needs playtest |
| Architecture | HIGH | Code audit + 20k+ game simulation |
| Pitfalls | HIGH | License terms from publishers; Calvin fabrication confirmed |
| **Overall** | MEDIUM-HIGH | One BLOCKER (Calvin); tech solid; content is long tail |

## Uncertainty Remaining

1. **ESV commentary clause** - Crossway unclear; email licensing@crossway.org before Step 6
2. **iOS PWA eviction** - Secondary sources say 7 days; untested on hardware (real device test Step 7)
3. **Layout exact sizes** - Theoretical; prototype needed (Step 7)
4. **Pool size final** - Start 30; tune after Step 7
5. **Density target** - True 1/3 needs 45 spaces; even spacing 0.25/draw (finalize Step 4)

## Decisions Needed from User

- **Density target:** Measured-rate definition (0.27-0.36/draw) vs "1 turn in 3"
- **Bonus cap:** 132 (recommended, keeps win card-driven)
- **Pool size:** >= 30 (recommended)
- **Fixed-space repeats:** "Already asked" + "Show again" button (recommended)
- **Calvin quote:** Beveridge III.24.5 "Christ, then, is the mirror..." (recommended)
- **Heavy-topic filter:** Defer to v2 (recommended)

## Gaps for Later

1. Verse parity across all 4 translations (only KJV checked)
2. Lutheran and Arminian primary sources
3. Second Council of Orange (529)
4. Playtest schedule after Step 7
5. ESV Crossway email response (Step 6 can wait on this)

---

**Synthesis complete.** Four research files synthesized; critical findings flagged; 9-phase roadmap with dependencies documented; user decisions requested; confidence assessed.
