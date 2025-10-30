'use client';

import { useEffect, useState } from 'react';

type Flags = {
  engineV2: boolean;
  mbtiDirect: boolean;
  retiDirect: boolean;
  inner9Nonlinear: boolean;
  confidenceBadge: boolean;
  verboseLog: boolean;
};

export default function FeatureFlagRibbon() {
  const [flags, setFlags] = useState<Flags | null>(null);
  const isProd = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (isProd) return; // dev-only
    fetch('/api/flags')
      .then((r) => r.ok ? r.json() : null)
      .then((j) => setFlags(j?.flags ?? null))
      .catch(() => void 0);
  }, [isProd]);

  if (isProd || !flags) return null;

  const active = Object.entries(flags).filter(([, v]) => !!v).map(([k]) => k);

  if (active.length === 0) return null;

  return (
    <div
      style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}
      className="rounded-md bg-black/60 backdrop-blur px-3 py-2 text-xs text-white shadow"
    >
      <span className="font-semibold">Flags:</span> {active.join(', ')}
    </div>
  );
}


