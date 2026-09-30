---
last_mapped_commit: 55f4cd08ff3960f4504472e8288e1698605bc2d0
last_mapped_at: 2026-09-29
---
# Technology Stack

**Analysis Date:** 2026-09-29

## Languages

**Primary:**

- JavaScript (JSX) - UI components and business logic
- React 19 (`^19.3.0`) - UI framework for component-based architecture

**Configuration:**

- JavaScript - Build and development configuration

## Runtime

**Environment:**

- Node.js `>=22.12.0` (package.json engines); CI pinned to Node 24

**Package Manager:**

- npm - Package management
- Lockfile: `package-lock.json` committed; CI installs with `npm ci`

## Frameworks

**Core:**

- React `^19.3.0` - UI framework for building interactive single-page application

**Rendering:**

- React-DOM `^19.3.0` - Renders React components to the browser DOM

**Build & Dev:**

- Vite `^8.3.1` with `@vitejs/plugin-react` `^6.1.1` - Build tool, dev server, and production bundler with instant hot module replacement
- Vitest `^5.0.2` - Test runner behind `npm test`
- GitHub Actions (`.github/workflows/deploy.yml`, official configure-pages, upload-pages-artifact and deploy-pages actions pinned to commit SHAs) - tests, builds and deploys `dist/` to GitHub Pages on every push to `main`

## Key Dependencies

**Critical:**

- `react@^19.3.0` - Core UI library with hooks API (useState, useEffect, useRef, useCallback, useMemo)
- `react-dom@^19.3.0` - DOM rendering layer for React

**Fonts:**

- `@fontsource/eb-garamond@^5.3.0` - self-hosted EB Garamond woff2 files

## Configuration

**Environment:**

- No environment variables currently used
- Single configuration file: `vite.config.js`

**Build:**

- `vite.config.js` - Configures base path for GitHub Pages deployment at `/pilgrims-predestined-path/`; also sets `plugins: [react()]` and `test.include: ['src/**/*.test.{js,jsx}']`
- Entry point: `index.html` references `/src/main.jsx`
- Output directory: `dist/` (standard Vite output)

## Platform Requirements

**Development:**

- Node.js `>=22.12.0` (package.json engines); CI uses Node 24
- npm 

**Production:**

- GitHub Pages hosting
- No server-side runtime required - static site deployment

## Build & Dev Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
npm test         # Run Vitest (deploys happen through GitHub Actions on push to main)
```

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

---

*Stack analysis: 2026-09-29*
