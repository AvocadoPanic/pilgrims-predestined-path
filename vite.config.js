import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'node:child_process';

// Kill switch: see docs/PWA.md. Must stay false on main (the build test fails otherwise).
const KILL_SWITCH = false;

function buildId(command) {
  if (command === 'serve') return 'dev';
  let sha = (process.env.GITHUB_SHA || '').slice(0, 7);
  if (!sha) {
    try {
      sha = execSync('git rev-parse --short=7 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch {
      sha = 'unknown';
    }
  }
  return `v ${sha} · ${new Date().toISOString().slice(0, 10)}`;
}

export default defineConfig(({ command }) => ({
  base: '/pilgrims-predestined-path/',
  define: { __BUILD_ID__: JSON.stringify(buildId(command)) },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      selfDestroying: KILL_SWITCH,
      manifest: {
        id: '/pilgrims-predestined-path/',
        name: "The Pilgrim's Predestined Path",
        short_name: "Pilgrim's Path",
        description: 'A board game of Reformed theology for 2 to 4 players on one screen',
        theme_color: '#0a0608',
        background_color: '#0a0608',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { cleanupOutdatedCaches: true },
    }),
  ],
  test: {
    include: ['src/**/*.test.{js,jsx}'],
  },
}));
