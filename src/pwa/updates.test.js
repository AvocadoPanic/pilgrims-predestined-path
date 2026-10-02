import { describe, it, expect, vi } from 'vitest';
import { createUpdateController } from './updates.js';

const MIN = 60 * 1000;

const setup = (opts = {}) => {
  const clock = { t: 0 };
  const reload = vi.fn();
  const doc = Object.assign(new EventTarget(), { visibilityState: 'visible' });
  const updateSW = vi.fn(() => Promise.resolve());
  let captured = null;
  const registerSW = vi.fn((o) => {
    captured = o;
    return updateSW;
  });
  const c = createUpdateController({ reload, doc, now: () => clock.t, ...opts });
  return { c, clock, reload, doc, updateSW, registerSW, cb: () => captured };
};

const tick = () => new Promise((r) => setTimeout(r, 0));

describe('update controller: waiting state', () => {
  it('onNeedRefresh makes the snapshot true and notifies subscribers', () => {
    const { c, registerSW, cb } = setup();
    c.start(registerSW);
    const l = vi.fn();
    c.subscribe(l);
    expect(c.getSnapshot()).toBe(false);
    cb().onNeedRefresh();
    expect(c.getSnapshot()).toBe(true);
    expect(l).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe stops notifications', () => {
    const { c, registerSW, cb } = setup();
    c.start(registerSW);
    const l = vi.fn();
    const off = c.subscribe(l);
    off();
    cb().onNeedRefresh();
    expect(l).not.toHaveBeenCalled();
  });

  it('server snapshot is always false', () => {
    const { c, registerSW, cb } = setup();
    c.start(registerSW);
    cb().onNeedRefresh();
    expect(c.getServerSnapshot()).toBe(false);
  });
});

describe('update controller: never reloads a game in progress', () => {
  it('onNeedReload with safe-to-reload false does not reload and marks a pending reload', () => {
    const { c, registerSW, cb, reload } = setup();
    c.start(registerSW);
    c.setSafeToReload(false);
    cb().onNeedReload();
    expect(reload).not.toHaveBeenCalled();
    expect(c.getSnapshot()).toBe(true);
    expect(c.isReloading()).toBe(false);
  });

  it('a later apply() reloads once after a pending reload', () => {
    const { c, registerSW, cb, reload, updateSW } = setup();
    c.start(registerSW);
    c.setSafeToReload(false);
    cb().onNeedReload();
    c.apply();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(updateSW).not.toHaveBeenCalled();
    expect(c.isReloading()).toBe(true);
  });

  it('onNeedReload with safe-to-reload true reloads once', () => {
    const { c, registerSW, cb, reload } = setup();
    c.start(registerSW);
    c.setSafeToReload(true);
    cb().onNeedReload();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(c.isReloading()).toBe(true);
  });

  it('isReloading is false until a reload is requested', () => {
    const { c, registerSW, cb } = setup();
    c.start(registerSW);
    cb().onNeedRefresh();
    expect(c.isReloading()).toBe(false);
  });
});

describe('update controller: apply', () => {
  it('with only a waiting worker, calls the function registerSW returned once', () => {
    const { c, registerSW, cb, updateSW, reload } = setup();
    c.start(registerSW);
    cb().onNeedRefresh();
    c.apply();
    expect(updateSW).toHaveBeenCalledTimes(1);
    expect(reload).not.toHaveBeenCalled();
  });

  it('before start() resolves without throwing', async () => {
    const { c } = setup();
    await expect(c.apply()).resolves.toBeUndefined();
  });
});

describe('update controller: visibility check (D-05)', () => {
  const withRegistration = (update) => {
    const s = setup();
    s.c.start(s.registerSW);
    s.cb().onRegisteredSW('/sw.js', { update });
    return s;
  };
  const show = (s, minutes) => {
    s.clock.t = minutes * MIN;
    s.doc.visibilityState = 'visible';
    s.doc.dispatchEvent(new Event('visibilitychange'));
  };

  it('checks at most once per 30 minutes', () => {
    const update = vi.fn(() => Promise.resolve());
    const s = withRegistration(update);
    show(s, 10);
    expect(update).toHaveBeenCalledTimes(0);
    show(s, 31);
    expect(update).toHaveBeenCalledTimes(1);
    show(s, 40);
    expect(update).toHaveBeenCalledTimes(1);
    show(s, 62);
    expect(update).toHaveBeenCalledTimes(2);
  });

  it('never checks while the page is hidden', () => {
    const update = vi.fn(() => Promise.resolve());
    const s = withRegistration(update);
    s.clock.t = 90 * MIN;
    s.doc.visibilityState = 'hidden';
    s.doc.dispatchEvent(new Event('visibilitychange'));
    expect(update).not.toHaveBeenCalled();
  });

  it('does nothing before a registration is known', () => {
    const s = setup();
    s.c.start(s.registerSW);
    expect(() => show(s, 90)).not.toThrow();
  });

  it('swallows a rejecting update() (offline)', async () => {
    const update = vi.fn(() => Promise.reject(new Error('offline')));
    const s = withRegistration(update);
    show(s, 31);
    await tick();
    expect(update).toHaveBeenCalledTimes(1);
  });
});
