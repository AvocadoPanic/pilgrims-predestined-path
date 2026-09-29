---
last_mapped_commit: 55f4cd08ff3960f4504472e8288e1698605bc2d0
last_mapped_at: 2026-09-29
---
# External Integrations

**Analysis Date:** 2026-09-29

## APIs & External Services

**Font Services:**

- Google Fonts - Loads EB Garamond font family in multiple weights and styles
  - URL: `https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap`
  - Imported in: `pilgrims-predestined-path.jsx`
  - No SDK/Client package needed - direct stylesheet link

## Data Storage

**Databases:**

- Not used - No database integration

**File Storage:**

- None - Application is entirely client-side with no backend storage
- No cloud storage integration

**Local State:**

- Browser memory only - All state stored in React component state (useState hooks)
- No localStorage or sessionStorage usage detected

**Caching:**

- Browser cache - Handled by HTTP caching headers during deployment
- No application-level caching library

## Authentication & Identity

**Auth Provider:**

- None - No user authentication implemented
- Application is publicly accessible with no login or user sessions

## Monitoring & Observability

**Error Tracking:**

- None - No error tracking service integrated

**Logs:**

- Browser console only - No centralized logging service

## CI/CD & Deployment

**Hosting:**

- GitHub Pages - Static site hosting at `https://<username>.github.io/pilgrims-predestined-path/`
- Base path configured in `vite.config.js` as `/pilgrims-predestined-path/`

**CI Pipeline:**

- GitHub Actions - `.github/workflows/deploy.yml` automates deployment
- Trigger: Pushes to `main` branch
- Process:
  1. Checkout repository (`actions/checkout@v2`)
  2. Build project (placeholder step - currently only echoes "Building project...")
  3. Deploy to GitHub Pages (`peaceiris/actions-gh-pages@v3`)
- Deployment publishes from `./docs` directory (NOTE: This may be out of sync with Vite's `dist/` output directory)

## Environment Configuration

**Required env vars:**

- None currently used

**Secrets location:**

- GitHub Actions uses `${{ secrets.GITHUB_TOKEN }}` for GitHub Pages deployment auth
- No application-level environment configuration file (.env)

## Webhooks & Callbacks

**Incoming:**

- None

**Outgoing:**

- None - Application makes no outbound API calls

## Data Flow

The application is entirely client-side with no external data dependencies:

1. User loads SPA in browser
2. React renders interactive board game UI
3. All logic runs in browser memory
4. No network requests to backend services (except Google Fonts stylesheet load)

## Integration Summary

**External dependencies:**

- Google Fonts API (read-only stylesheet)
- GitHub Pages (hosting platform)

**No runtime integrations with:**

- Databases
- Backend APIs
- Authentication services
- Analytics/monitoring
- File storage
- Payment processors
- Third-party web services

---

*Integration audit: 2026-09-29*
