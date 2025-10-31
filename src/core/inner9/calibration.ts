/**
 * Inner9 calibration stubs
 * - Identity by default (safe)
 * - Interface allows future isotonic/platt-like smoothing
 */

import type { InnerNine } from './types';

export type CalibMethod = 'identity' | 'isotonic' | 'platt';

export type CalibOptions = {
  method?: CalibMethod;
  strength?: number; // 0..1
};

export function calibrateInner9(scores: InnerNine, opts: CalibOptions = {}): InnerNine {
  const method = opts.method || 'identity';
  switch (method) {
    case 'identity':
    default:
      return { ...scores };
  }
}


