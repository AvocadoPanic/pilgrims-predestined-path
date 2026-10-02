// installRowMode: 'prompt' | 'ios' | null
export function installRowMode({ standalone, installed, hasPrompt, isIos }) {
  if (standalone || installed) return null;
  if (hasPrompt) return 'prompt';
  if (isIos) return 'ios';
  return null;
}

// iPadOS 13 and later report a Mac user agent, so touch support is the tell.
export function isIosDevice(userAgent, maxTouchPoints) {
  const ua = userAgent || '';
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && maxTouchPoints > 1);
}

// Closure variables only, so the methods can be passed around unbound (onClick={installs.promptInstall}).
export function createInstallStore({ target, matchMedia, nav } = {}) {
  let held = null;
  let installed = false;
  const listeners = new Set();
  const emit = () => listeners.forEach((l) => l());

  if (target) {
    target.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      held = e;
      emit();
    });
    target.addEventListener('appinstalled', () => {
      installed = true;
      held = null;
      emit();
    });
  }

  const isStandalone = () => {
    try {
      if (matchMedia && matchMedia('(display-mode: standalone)').matches) return true;
    } catch {}
    return nav?.standalone === true;
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () =>
      installRowMode({
        standalone: isStandalone(),
        installed,
        hasPrompt: held !== null,
        isIos: isIosDevice(nav?.userAgent, nav?.maxTouchPoints),
      }),
    getServerSnapshot: () => null,
    promptInstall() {
      const e = held;
      if (!e) return;
      held = null;
      emit();
      try {
        const r = e.prompt();
        if (r && typeof r.catch === 'function') r.catch(() => {});
      } catch {}
    },
  };
}
