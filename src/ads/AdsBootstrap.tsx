import { useEffect, useRef } from 'react';

import { initializeAds } from '@/ads/setup';
import { usePurchases } from '@/state/purchases';

/**
 * Initializes the Mobile Ads SDK once the entitlement is known — and skips it
 * entirely for users who bought "Remove ads", so no ad SDK runs for them.
 */
export function AdsBootstrap() {
  const { ready, removeAds } = usePurchases();
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !ready) return;
    started.current = true;
    if (!removeAds) initializeAds();
  }, [ready, removeAds]);

  return null;
}
