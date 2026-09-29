# Phase 1: Live on GitHub Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-09-29
**Phase:** 01-live-on-github-pages
**Areas discussed:** React 18 or 19, Tab icon now?

Areas offered but not selected: What CI tests, Go-live handoff.

---

## React 18 or 19

| Option | Description | Selected |
|--------|-------------|----------|
| React 19 now (Recommended) | Upgrade while nothing is installed; research test-built it clean; update React 18 notes in .claude/CLAUDE.md | ✓ |
| Stay on React 18 | Smallest change from current package.json; still needs createRoot; upgrade later as its own task | |

**User's choice:** React 19 now
**Notes:** Claude decided StrictMode without asking (both effects only scroll).

---

## Tab icon now?

| Option | Description | Selected |
|--------|-------------|----------|
| Gold ✠ SVG (Recommended) | Hand-made favicon.svg, gold cross on dark background; Phase 2 derives PNG icons from it | ✓ |
| Remove the link for now | Browser default icon until Phase 2 | |
| Something else | A different emblem | |

**User's choice:** Gold ✠ SVG

| Option | Description | Selected |
|--------|-------------|----------|
| Keep title as-is (Recommended) | Title unchanged; add theme-color meta only | ✓ |
| Also add a description | One-line meta description now, reviewed again in Phase 3 | |

**User's choice:** Keep title as-is

---

## Claude's Discretion

- CI test content (smoke test; optional build-output check for SC4)
- Go-live ordering, with stops before any push and before the Pages source flip
- Font self-hosting method
- Action pinning, Vitest config, .gitattributes

## Deferred Ideas

- Meta description: Phase 3
- Install icons, manifest, service worker: Phase 2
