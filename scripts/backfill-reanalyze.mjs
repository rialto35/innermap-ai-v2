#!/usr/bin/env node
// Backfill Reanalysis (stub)
// - No DB writes. Prints plan + SENTINEL JSON for CI.

const DRY = process.argv.includes('--dry') || true; // always dry in stub

const plan = {
  mode: 'dry-run',
  engineV2: process.env.IM_ENGINE_V2_ENABLED === 'true',
  inner9Nonlinear: process.env.IM_INNER9_NONLINEAR_ENABLED === 'true',
  big5Overrides: process.env.IM_BIG5_CONFIG_ENABLED === 'true',
  sample: {
    assessmentsToScan: 100,
    batchSize: 20,
    save: false,
  },
};

console.log('[backfill-reanalyze] Stub start');
console.log('[backfill-reanalyze] Plan:', plan);

// CI sentinel
const summary = { ok: true, dry: DRY, planned: true, scanned: 0, updated: 0 };
console.log('<<<CURSOR_SENTINEL>>> ' + JSON.stringify(summary));

process.exit(0);


