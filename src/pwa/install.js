// RED-phase stub: no behavior yet, so the tests fail on assertions rather than on a missing module.
export function installRowMode() {
  return null;
}

export function isIosDevice() {
  return false;
}

export function createInstallStore() {
  return {
    subscribe: () => () => {},
    getSnapshot: () => null,
    getServerSnapshot: () => null,
    promptInstall: () => {},
  };
}
