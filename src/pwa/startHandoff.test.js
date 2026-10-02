import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { saveStartHandoff, clearStartHandoff, consumeStartHandoff } from './startHandoff.js';

const KEY = 'ppp:start-after-update';

const memoryStorage = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => {
      m.set(k, String(v));
    },
    removeItem: (k) => {
      m.delete(k);
    },
    raw: m,
  };
};

const throwingStorage = () => ({
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('blocked');
  },
  removeItem: () => {
    throw new Error('blocked');
  },
});

describe('start handoff', () => {
  it('returns the saved pilgrim count once and nothing the second time', () => {
    const s = memoryStorage();
    saveStartHandoff({ numP: 3 }, s, () => 1000);
    expect(consumeStartHandoff(s, () => 61000)).toEqual({ numP: 3 });
    expect(consumeStartHandoff(s, () => 61000)).toBeNull();
  });

  it('stores under the ppp: key and removes it on read', () => {
    const s = memoryStorage();
    saveStartHandoff({ numP: 2 }, s, () => 1000);
    expect(s.raw.has(KEY)).toBe(true);
    consumeStartHandoff(s, () => 2000);
    expect(s.raw.has(KEY)).toBe(false);
  });

  it('removes the key even when the value is rejected', () => {
    const s = memoryStorage();
    s.setItem(KEY, 'not json');
    expect(consumeStartHandoff(s, () => 2000)).toBeNull();
    expect(s.raw.has(KEY)).toBe(false);
  });

  it('ignores an entry older than 2 minutes', () => {
    const s = memoryStorage();
    saveStartHandoff({ numP: 4 }, s, () => 0);
    expect(consumeStartHandoff(s, () => 2 * 60 * 1000 + 1)).toBeNull();
  });

  it('accepts an entry exactly 2 minutes old', () => {
    const s = memoryStorage();
    saveStartHandoff({ numP: 4 }, s, () => 0);
    expect(consumeStartHandoff(s, () => 2 * 60 * 1000)).toEqual({ numP: 4 });
  });

  it('ignores unparseable JSON', () => {
    const s = memoryStorage();
    s.setItem(KEY, '{oops');
    expect(consumeStartHandoff(s, () => 1000)).toBeNull();
  });

  it('ignores an entry with a missing or non-number at', () => {
    const s = memoryStorage();
    s.setItem(KEY, JSON.stringify({ settings: { numP: 3 } }));
    expect(consumeStartHandoff(s, () => 1000)).toBeNull();
    s.setItem(KEY, JSON.stringify({ at: '1000', settings: { numP: 3 } }));
    expect(consumeStartHandoff(s, () => 1000)).toBeNull();
  });

  it.each([[1], [5], ['3'], [undefined], [null]])('ignores numP %s', (numP) => {
    const s = memoryStorage();
    saveStartHandoff({ numP }, s, () => 1000);
    expect(consumeStartHandoff(s, () => 1000)).toBeNull();
  });

  it('ignores an entry with no settings object', () => {
    const s = memoryStorage();
    s.setItem(KEY, JSON.stringify({ at: 1000 }));
    expect(consumeStartHandoff(s, () => 1000)).toBeNull();
  });

  it('clearStartHandoff removes a saved entry', () => {
    const s = memoryStorage();
    saveStartHandoff({ numP: 3 }, s, () => 1000);
    clearStartHandoff(s);
    expect(s.raw.has(KEY)).toBe(false);
  });

  it('never throws when storage is unavailable (private mode)', () => {
    const s = throwingStorage();
    expect(() => saveStartHandoff({ numP: 3 }, s, () => 1000)).not.toThrow();
    expect(() => clearStartHandoff(s)).not.toThrow();
    expect(consumeStartHandoff(s, () => 1000)).toBeNull();
  });
});

describe('start handoff with the default storage', () => {
  let original;

  beforeEach(() => {
    original = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  });

  afterEach(() => {
    if (original) Object.defineProperty(globalThis, 'sessionStorage', original);
    else delete globalThis.sessionStorage;
  });

  const stubSessionStorage = (get) => {
    Object.defineProperty(globalThis, 'sessionStorage', { get, configurable: true });
  };

  it('never throws when reading sessionStorage itself throws (storage blocked)', () => {
    stubSessionStorage(() => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    });
    expect(() => saveStartHandoff({ numP: 3 })).not.toThrow();
    expect(() => clearStartHandoff()).not.toThrow();
    expect(() => consumeStartHandoff()).not.toThrow();
    expect(consumeStartHandoff()).toBeNull();
  });

  it('defaults to globalThis.sessionStorage when it can be read', () => {
    const s = memoryStorage();
    stubSessionStorage(() => s);
    saveStartHandoff({ numP: 3 });
    expect(consumeStartHandoff()).toEqual({ numP: 3 });
    saveStartHandoff({ numP: 4 });
    clearStartHandoff();
    expect(consumeStartHandoff()).toBeNull();
  });

  it('returns null and never throws when there is no sessionStorage', () => {
    stubSessionStorage(() => undefined);
    expect(() => saveStartHandoff({ numP: 3 })).not.toThrow();
    expect(() => clearStartHandoff()).not.toThrow();
    expect(() => consumeStartHandoff()).not.toThrow();
    expect(consumeStartHandoff()).toBeNull();
  });
});
