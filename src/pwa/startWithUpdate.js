// How long Start waits for the update reload before beginning the game on the current build.
export const UPDATE_FALLBACK_MS = 4000;

export function createStartWithUpdate({
  updates,
  save,
  clear,
  timeoutMs = UPDATE_FALLBACK_MS,
  setTimeoutFn = (f, ms) => setTimeout(f, ms),
  clearTimeoutFn = (id) => clearTimeout(id),
  onApplyingChange = () => {},
}) {
  let applying = false;
  let timer = null;
  let begin = null;
  let getNumP = null;

  const fallback = () => {
    timer = null;
    // A reload has started: leave the handoff for the new page and let this one unload.
    if (updates.isReloading()) return;
    try {
      clear();
    } catch {
      // a failed clear must not stop the game from beginning
    }
    // Mark the page unsafe before begin so a late controlling event cannot reload the game about to start.
    updates.setSafeToReload(false);
    applying = false;
    onApplyingChange(false);
    begin(getNumP());
  };

  return {
    start(args) {
      if (applying) return;
      if (!args.waiting) {
        args.begin(args.getNumP());
        return;
      }
      applying = true;
      begin = args.begin;
      getNumP = args.getNumP;
      onApplyingChange(true);
      try {
        save({ numP: getNumP() });
      } catch {
        // a failed save must not wedge Start: the update still applies and the new page opens on setup
      }
      // Armed before apply, so an apply that throws can never skip the fallback.
      timer = setTimeoutFn(fallback, timeoutMs);
      try {
        const result = updates.apply();
        if (result && typeof result.catch === 'function') result.catch(() => {});
      } catch {
        // the fallback still begins the game
      }
    },
    cancel() {
      if (timer !== null) {
        clearTimeoutFn(timer);
        timer = null;
      }
      applying = false;
    },
    isApplying: () => applying,
  };
}
