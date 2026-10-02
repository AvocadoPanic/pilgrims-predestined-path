import { describe, it, expect, vi } from 'vitest';
import { installRowMode, isIosDevice, createInstallStore } from './install.js';

const UA = {
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  ipad: 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  criOS: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.6312.52 Mobile/15E148 Safari/604.1',
  edgiOS: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 EdgiOS/123.0.2420.52 Mobile/15E148 Safari/605.1.15',
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  winEdge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
  android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36',
  firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
};

describe('installRowMode', () => {
  const base = { standalone: false, installed: false, hasPrompt: false, isIos: false };

  it('is null when the game runs as an installed app', () => {
    expect(installRowMode({ ...base, standalone: true, hasPrompt: true, isIos: true })).toBeNull();
  });

  it('is null after the app was installed', () => {
    expect(installRowMode({ ...base, installed: true, hasPrompt: true })).toBeNull();
  });

  it('is "prompt" when the browser offered installation, even on iOS', () => {
    expect(installRowMode({ ...base, hasPrompt: true })).toBe('prompt');
    expect(installRowMode({ ...base, hasPrompt: true, isIos: true })).toBe('prompt');
  });

  it('is "ios" on an iOS device with no prompt', () => {
    expect(installRowMode({ ...base, isIos: true })).toBe('ios');
  });

  it('is null elsewhere, such as desktop Firefox or desktop Safari', () => {
    expect(installRowMode(base)).toBeNull();
  });
});

describe('isIosDevice', () => {
  it('is true for iPhone, iPad, Chrome on iOS and Edge on iOS', () => {
    expect(isIosDevice(UA.iphone, 5)).toBe(true);
    expect(isIosDevice(UA.ipad, 5)).toBe(true);
    expect(isIosDevice(UA.criOS, 5)).toBe(true);
    expect(isIosDevice(UA.edgiOS, 5)).toBe(true);
  });

  it('is true for iPadOS that reports a Mac user agent with touch support', () => {
    expect(isIosDevice(UA.mac, 5)).toBe(true);
  });

  it('is false for a Mac without touch, Windows Edge, Android Chrome and desktop Firefox', () => {
    expect(isIosDevice(UA.mac, 0)).toBe(false);
    expect(isIosDevice(UA.winEdge, 0)).toBe(false);
    expect(isIosDevice(UA.android, 5)).toBe(false);
    expect(isIosDevice(UA.firefox, 0)).toBe(false);
  });

  it('is false when the user agent is missing', () => {
    expect(isIosDevice(undefined, undefined)).toBe(false);
  });
});

const tick = () => new Promise((r) => setTimeout(r, 0));

const promptEvent = (prompt = vi.fn(() => Promise.resolve())) => {
  const e = new Event('beforeinstallprompt', { cancelable: true });
  e.prompt = prompt;
  return e;
};

const setup = ({ standalone = false, navStandalone, ua = UA.winEdge, touch = 0 } = {}) => {
  const target = new EventTarget();
  const matchMedia = (q) => ({ matches: standalone && q === '(display-mode: standalone)' });
  const nav = { userAgent: ua, maxTouchPoints: touch, standalone: navStandalone };
  const store = createInstallStore({ target, matchMedia, nav });
  return { store, target };
};

describe('install store: beforeinstallprompt', () => {
  it('holds a cancelable event, prevents its default and notifies subscribers', () => {
    const { store, target } = setup();
    const l = vi.fn();
    store.subscribe(l);
    expect(store.getSnapshot()).toBeNull();
    const e = promptEvent();
    target.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    expect(store.getSnapshot()).toBe('prompt');
    expect(l).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe stops notifications', () => {
    const { store, target } = setup();
    const l = vi.fn();
    const off = store.subscribe(l);
    off();
    target.dispatchEvent(promptEvent());
    expect(l).not.toHaveBeenCalled();
  });

  it('never calls prompt() on its own', () => {
    const { target } = setup();
    const prompt = vi.fn(() => Promise.resolve());
    target.dispatchEvent(promptEvent(prompt));
    expect(prompt).not.toHaveBeenCalled();
  });
});

describe('install store: promptInstall', () => {
  it('calls the held prompt exactly once, then hides the row', () => {
    const { store, target } = setup();
    const prompt = vi.fn(() => Promise.resolve());
    target.dispatchEvent(promptEvent(prompt));
    const { promptInstall } = store;
    promptInstall();
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toBeNull();
    promptInstall();
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it('notifies subscribers when the event is dropped', () => {
    const { store, target } = setup();
    target.dispatchEvent(promptEvent());
    const l = vi.fn();
    store.subscribe(l);
    store.promptInstall();
    expect(l).toHaveBeenCalledTimes(1);
  });

  it('shows the row again when the browser offers a fresh prompt', () => {
    const { store, target } = setup();
    target.dispatchEvent(promptEvent());
    store.promptInstall();
    expect(store.getSnapshot()).toBeNull();
    target.dispatchEvent(promptEvent());
    expect(store.getSnapshot()).toBe('prompt');
  });

  it('falls back to the iOS line, not the button, once the prompt is used on an iOS device', () => {
    const { store, target } = setup({ ua: UA.iphone, touch: 5 });
    target.dispatchEvent(promptEvent());
    expect(store.getSnapshot()).toBe('prompt');
    store.promptInstall();
    expect(store.getSnapshot()).toBe('ios');
  });

  it('does nothing when no prompt is held', () => {
    const { store } = setup();
    expect(() => store.promptInstall()).not.toThrow();
    expect(store.getSnapshot()).toBeNull();
  });

  it('swallows a rejected prompt() and a throwing prompt()', async () => {
    const seen = vi.fn();
    process.on('unhandledRejection', seen);
    const { store, target } = setup();
    target.dispatchEvent(promptEvent(vi.fn(() => Promise.reject(new Error('dismissed')))));
    expect(() => store.promptInstall()).not.toThrow();
    target.dispatchEvent(promptEvent(vi.fn(() => { throw new Error('boom'); })));
    expect(() => store.promptInstall()).not.toThrow();
    await tick();
    await tick();
    process.off('unhandledRejection', seen);
    expect(seen).not.toHaveBeenCalled();
  });
});

describe('install store: appinstalled and standalone', () => {
  it('appinstalled hides the row and a later prompt keeps it hidden', () => {
    const { store, target } = setup();
    target.dispatchEvent(promptEvent());
    const l = vi.fn();
    store.subscribe(l);
    target.dispatchEvent(new Event('appinstalled'));
    expect(store.getSnapshot()).toBeNull();
    expect(l).toHaveBeenCalledTimes(1);
    target.dispatchEvent(promptEvent());
    expect(store.getSnapshot()).toBeNull();
  });

  it('display-mode standalone hides the row even while a prompt is held', () => {
    const { store, target } = setup({ standalone: true });
    target.dispatchEvent(promptEvent());
    expect(store.getSnapshot()).toBeNull();
  });

  it('navigator.standalone hides the row on iOS', () => {
    const { store } = setup({ ua: UA.iphone, touch: 5, navStandalone: true });
    expect(store.getSnapshot()).toBeNull();
  });

  it('shows the iOS line on an iPhone in a browser tab', () => {
    const { store } = setup({ ua: UA.iphone, touch: 5, navStandalone: false });
    expect(store.getSnapshot()).toBe('ios');
  });
});

describe('install store: Node safety', () => {
  it('getServerSnapshot is always null', () => {
    const { store, target } = setup({ ua: UA.iphone, touch: 5 });
    target.dispatchEvent(promptEvent());
    expect(store.getServerSnapshot()).toBeNull();
  });

  it('createInstallStore({}) with no target, matchMedia or nav does not throw', () => {
    const store = createInstallStore({});
    expect(store.getSnapshot()).toBeNull();
    expect(store.getServerSnapshot()).toBeNull();
    expect(() => store.promptInstall()).not.toThrow();
    const off = store.subscribe(() => {});
    expect(() => off()).not.toThrow();
  });
});
