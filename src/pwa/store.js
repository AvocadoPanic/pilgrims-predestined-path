import { createUpdateController } from './updates.js';

export const updates = createUpdateController({
  reload: () => window.location.reload(),
  doc: typeof document !== 'undefined' ? document : undefined,
});
