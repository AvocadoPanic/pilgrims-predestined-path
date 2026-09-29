---
last_mapped_commit: 55f4cd08ff3960f4504472e8288e1698605bc2d0
last_mapped_at: 2026-09-29
---
# Technology Stack

**Analysis Date:** 2026-09-29

## Languages

**Primary:**

- JavaScript (JSX) - UI components and business logic
- React 18.0.0 - UI framework for component-based architecture

**Configuration:**

- JavaScript - Build and development configuration

## Runtime

**Environment:**

- Node.js - Required for build and development

**Package Manager:**

- npm - Package management
- Lockfile: missing (dependencies not yet installed)

## Frameworks

**Core:**

- React `^18.0.0` - UI framework for building interactive single-page application

**Rendering:**

- React-DOM `^18.0.0` - Renders React components to the browser DOM

**Build & Dev:**

- Vite `^3.0.0` - Build tool, dev server, and production bundler with instant hot module replacement
- gh-pages `^4.0.0` - Deployment automation to GitHub Pages

## Key Dependencies

**Critical:**

- `react@^18.0.0` - Core UI library with hooks API (useState, useEffect, useRef, useCallback, useMemo)
- `react-dom@^18.0.0` - DOM rendering layer for React

**Deployment:**

- `gh-pages@^4.0.0` - Pushes build artifacts to GitHub Pages gh-pages branch

## Configuration

**Environment:**

- No environment variables currently used
- Single configuration file: `vite.config.js`

**Build:**

- `vite.config.js` - Configures base path for GitHub Pages deployment at `/pilgrims-predestined-path/`
- Entry point: `index.html` references `/src/main.jsx`
- Output directory: `dist/` (standard Vite output)

## Platform Requirements

**Development:**

- Node.js (version not specified in lockfile or .nvmrc)
- npm 

**Production:**

- GitHub Pages hosting
- No server-side runtime required - static site deployment

## Build & Dev Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
npm run deploy   # Deploy built artifacts to GitHub Pages
```

## Source Structure

- `index.html` - Entry point HTML file
- `src/main.jsx` - React app entry point mounting to #root
- `pilgrims-predestined-path.jsx` - Main application component (not currently imported by main.jsx - appears to be unused or mislabeled)
- `vite.config.js` - Vite configuration

## Notes

- No linting, formatting, or testing tools configured
- No TypeScript configuration
- No CSS framework or CSS preprocessing tools
- Font loading via Google Fonts API for EB Garamond typeface
- No backend dependencies or database libraries
- Minimal dependency footprint - pure client-side React application

---

*Stack analysis: 2026-09-29*
