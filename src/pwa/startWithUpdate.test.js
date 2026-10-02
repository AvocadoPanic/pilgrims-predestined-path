import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createStartWithUpdate, UPDATE_FALLBACK_MS } from './startWithUpdate.js';
import { saveStartHandoff, clearStartHandoff } from './startHandoff.js';

const setup = (opts = {}) => {
  const updates = {
    apply: vi.fn(() => Promise.resolve()),
    isReloading: vi.fn(() => false),
    setSafeToReload: vi.fn(),
  };
  const save = vi.fn();
  const clear = vi.fn();
  const begin = vi.fn();
  const onApplyingChange = vi.fn();
  const flow = createStartWithUpdate({ updates, save, clear, onApplyingChange, ...opts });
  return { updates, save, clear, begin, onApplyingChange, flow };
};

describe('start with update', () => {
  let original;

  beforeEach(() => {
    vi.useFakeTimers();
    original = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  });

  afterEach(() => {
    vi.useRealTimers();
    if (original) Object.defineProperty(globalThis, 'sessionStorage', original);
    else delete globalThis.sessionStorage;
  });

  it('begins at once with the current count when no update is waiting', () => {
    const { flow, updates, save, begin, onApplyingChange } = setup();
    flow.start({ waiting: false, getNumP: () => 3, begin });
    expect(begin).toHaveBeenCalledTimes(1);
    expect(begin).toHaveBeenCalledWith(3);
    expect(save).not.toHaveBeenCalled();
    expect(updates.apply).not.toHaveBeenCalled();
    expect(onApplyingChange).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('saves the count, applies once and leaves the page to reload when a reload has started', () => {
    const { flow, updates, save, clear, begin, onApplyingChange } = setup();
    updates.isReloading.mockReturnValue(true);
    flow.start({ waiting: true, getNumP: () => 3, begin });
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith({ numP: 3 });
    expect(updates.apply).toHaveBeenCalledTimes(1);
    expect(onApplyingChange).toHaveBeenCalledTimes(1);
    expect(onApplyingChange).toHaveBeenCalledWith(true);
    expect(flow.isApplying()).toBe(true);
    vi.advanceTimersByTime(UPDATE_FALLBACK_MS);
    expect(begin).not.toHaveBeenCalled();
    expect(clear).not.toHaveBeenCalled();
    expect(updates.setSafeToReload).not.toHaveBeenCalled();
    expect(flow.isApplying()).toBe(true);
  });

  it('falls back to beginning the game when no reload has started, marking the page unsafe first', () => {
    const { flow, updates, clear, begin, onApplyingChange } = setup();
    flow.start({ waiting: true, getNumP: () => 3, begin });
    vi.advanceTimersByTime(UPDATE_FALLBACK_MS - 1);
    expect(clear).not.toHaveBeenCalled();
    expect(updates.setSafeToReload).not.toHaveBeenCalled();
    expect(begin).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(clear).toHaveBeenCalledTimes(1);
    expect(updates.setSafeToReload).toHaveBeenCalledTimes(1);
    expect(updates.setSafeToReload).toHaveBeenCalledWith(false);
    expect(begin).toHaveBeenCalledTimes(1);
    expect(begin).toHaveBeenCalledWith(3);
    expect(updates.setSafeToReload.mock.invocationCallOrder[0]).toBeLessThan(begin.mock.invocationCallOrder[0]);
    expect(flow.isApplying()).toBe(false);
    expect(onApplyingChange).toHaveBeenLastCalledWith(false);
  });

  it('saves the count at the press but begins with the count current at fallback time', () => {
    const { flow, save, begin } = setup();
    let n = 2;
    flow.start({ waiting: true, getNumP: () => n, begin });
    n = 4;
    vi.advanceTimersByTime(UPDATE_FALLBACK_MS);
    expect(save).toHaveBeenCalledWith({ numP: 2 });
    expect(begin).toHaveBeenCalledWith(4);
  });

  it('ignores extra presses while an update is being applied (one save, one apply, one timer)', () => {
    const { flow, updates, save, begin } = setup();
    flow.start({ waiting: true, getNumP: () => 3, begin });
    flow.start({ waiting: true, getNumP: () => 3, begin });
    flow.start({ waiting: true, getNumP: () => 3, begin });
    expect(save).toHaveBeenCalledTimes(1);
    expect(updates.apply).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(UPDATE_FALLBACK_MS);
    expect(begin).toHaveBeenCalledTimes(1);
  });

  it('is not wedged: a start after the fallback began the game runs the flow again', () => {
    const { flow, updates, save, begin } = setup();
    flow.start({ waiting: true, getNumP: () => 3, begin });
    vi.advanceTimersByTime(UPDATE_FALLBACK_MS);
    expect(flow.isApplying()).toBe(false);
    flow.start({ waiting: true, getNumP: () => 3, begin });
    expect(save).toHaveBeenCalledTimes(2);
    expect(updates.apply).toHaveBeenCalledTimes(2);
  });

  it('does not throw and still begins after the fallback when saving the handoff throws', () => {
    const { flow, updates, save, begin } = setup();
    save.mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => flow.start({ waiting: true, getNumP: () => 3, begin })).not.toThrow();
    expect(updates.apply).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(UPDATE_FALLBACK_MS);
    expect(begin).toHaveBeenCalledTimes(1);
  });

  it('does not throw and still begins after the fallback when apply throws synchronously', () => {
    const { flow, updates, begin } = setup();
    updates.apply.mockImplementation(() => {
      throw new Error('apply failed');
    });
    expect(() => flow.start({ waiting: true, getNumP: () => 3, begin })).not.toThrow();
    vi.advanceTimersByTime(UPDATE_FALLBACK_MS);
    expect(begin).toHaveBeenCalledTimes(1);
  });

  it('does not throw and still begins after the fallback when apply returns a non-promise', () => {
    const { flow, updates, begin } = setup();
    updates.apply.mockImplementation(() => undefined);
    expect(() => flow.start({ waiting: true, getNumP: () => 3, begin })).not.toThrow();
    vi.advanceTimersByTime(UPDATE_FALLBACK_MS);
    expect(begin).toHaveBeenCalledTimes(1);
  });

  it('does not throw, leaves no unhandled rejection and still begins when apply rejects', async () => {
    const { flow, updates, begin } = setup();
    updates.apply.mockImplementation(() => Promise.reject(new Error('apply rejected')));
    expect(() => flow.start({ waiting: true, getNumP: () => 3, begin })).not.toThrow();
    await vi.advanceTimersByTimeAsync(UPDATE_FALLBACK_MS);
    expect(begin).toHaveBeenCalledTimes(1);
  });

  it('cancel clears the pending timer so begin never runs after unmount', () => {
    const { flow, clear, begin, onApplyingChange } = setup();
    flow.start({ waiting: true, getNumP: () => 3, begin });
    expect(onApplyingChange).toHaveBeenCalledTimes(1);
    flow.cancel();
    expect(vi.getTimerCount()).toBe(0);
    vi.advanceTimersByTime(UPDATE_FALLBACK_MS);
    expect(begin).not.toHaveBeenCalled();
    expect(clear).not.toHaveBeenCalled();
    expect(flow.isApplying()).toBe(false);
    expect(onApplyingChange).toHaveBeenCalledTimes(1);
  });

  it('waits UPDATE_FALLBACK_MS (4000 ms) by default', () => {
    expect(UPDATE_FALLBACK_MS).toBe(4000);
    const { flow, begin } = setup();
    flow.start({ waiting: true, getNumP: () => 3, begin });
    vi.advanceTimersByTime(3999);
    expect(begin).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(begin).toHaveBeenCalledTimes(1);
  });

  it('still begins the game when sessionStorage access throws (storage blocked, real handoff)', () => {
    Object.defineProperty(globalThis, 'sessionStorage', {
      get: () => {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      },
      configurable: true,
    });
    const { flow, begin } = setup({ save: saveStartHandoff, clear: clearStartHandoff });
    expect(() => flow.start({ waiting: true, getNumP: () => 4, begin })).not.toThrow();
    vi.advanceTimersByTime(UPDATE_FALLBACK_MS);
    expect(begin).toHaveBeenCalledTimes(1);
    expect(begin).toHaveBeenCalledWith(4);
  });
});
