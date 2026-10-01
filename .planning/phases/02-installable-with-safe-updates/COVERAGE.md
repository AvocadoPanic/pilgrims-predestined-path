# API Coverage - Phase 2: Installable, With Safe Updates

No external API integration: the phase adds a build-time plugin (vite-plugin-pwa generateSW), browser-native PWA APIs (service worker registration, beforeinstallprompt, appinstalled, display-mode, sessionStorage) and a one-time local icon generator; the game makes no runtime calls to any remote service, and `gh`, `curl` and Chromium DevTools Protocol calls are operator and test tooling only.
