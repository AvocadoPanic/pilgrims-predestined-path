import { createUpdateController } from './updates.js';
import { createInstallStore } from './install.js';

export const updates = createUpdateController({
  reload: () => window.location.reload(),
  doc: typeof document !== 'undefined' ? document : undefined,
});

// Created at module scope so beforeinstallprompt is captured even if it fires before React mounts.
export const installs = createInstallStore({
  target: typeof window !== 'undefined' ? window : undefined,
  matchMedia: typeof window !== 'undefined' && window.matchMedia ? (q) => window.matchMedia(q) : undefined,
  nav: typeof navigator !== 'undefined' ? navigator : undefined,
});
