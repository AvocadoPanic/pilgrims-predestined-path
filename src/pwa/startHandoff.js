const KEY = 'ppp:start-after-update';
const MAX_AGE_MS = 2 * 60 * 1000;

const defaultStorage = () => {
  try {
    return globalThis.sessionStorage;
  } catch {
    // reading sessionStorage throws SecurityError when the browser blocks site data
    return null;
  }
};

export function saveStartHandoff(settings, storage = defaultStorage(), now = Date.now) {
  try {
    if (!storage) return;
    storage.setItem(KEY, JSON.stringify({ at: now(), settings }));
  } catch {
    // private mode: the update still applies, the game just starts from setup
  }
}

export function clearStartHandoff(storage = defaultStorage()) {
  try {
    if (!storage) return;
    storage.removeItem(KEY);
  } catch {
    // ignore
  }
}

// The origin is shared with other projects, so storage is untrusted: validate everything.
export function consumeStartHandoff(storage = defaultStorage(), now = Date.now) {
  try {
    if (!storage) return null;
    const raw = storage.getItem(KEY);
    storage.removeItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (!v || typeof v.at !== 'number' || now() - v.at > MAX_AGE_MS) return null;
    const n = v.settings?.numP;
    if (n !== 2 && n !== 3 && n !== 4) return null;
    return { numP: n };
  } catch {
    return null;
  }
}
