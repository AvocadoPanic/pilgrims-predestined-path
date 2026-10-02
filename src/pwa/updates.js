const THROTTLE_MS = 30 * 60 * 1000;

export function createUpdateController({ reload, doc, now = () => Date.now() }) {
  let waiting = false;
  let pendingReload = false;
  let safeToReload = false;
  let registration = null;
  let lastCheck = now();
  let updateSW = null;
  const listeners = new Set();
  const emit = () => listeners.forEach((l) => l());

  if (doc) {
    doc.addEventListener('visibilitychange', () => {
      if (doc.visibilityState !== 'visible' || !registration) return;
      if (now() - lastCheck < THROTTLE_MS) return;
      lastCheck = now();
      registration.update().catch(() => {});
    });
  }

  return {
    start(registerSW) {
      updateSW = registerSW({
        onNeedRefresh() {
          waiting = true;
          emit();
        },
        onNeedReload() {
          if (safeToReload) {
            reload();
          } else {
            pendingReload = true;
            emit();
          }
        },
        onRegisteredSW(_url, reg) {
          registration = reg ?? null;
        },
      });
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => waiting || pendingReload,
    getServerSnapshot: () => false,
    setSafeToReload(v) {
      safeToReload = v;
    },
    apply() {
      if (pendingReload) {
        reload();
        return Promise.resolve();
      }
      return updateSW ? updateSW() : Promise.resolve();
    },
  };
}
