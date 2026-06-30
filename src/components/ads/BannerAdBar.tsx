import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { adsAvailable, bannerUnitId } from '@/ads/config';
import { usePurchases } from '@/state/purchases';
import type { SkyTheme } from '@/theme/sky';

/**
 * Anchored adaptive banner pinned to the bottom of the screen.
 *
 * Renders nothing in Expo Go (no native ad module). The native lib is
 * lazy-`require`d so merely importing this component never crashes Expo Go.
 */
export function BannerAdBar({ sky }: { sky: SkyTheme }) {
  const { removeAds } = usePurchases();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ads = useMemo(() => (adsAvailable ? require('react-native-google-mobile-ads') : null), []);
  if (removeAds || !ads) return null;

  const { BannerAd, BannerAdSize } = ads;

  return (
    <View
      style={[styles.bar, { borderTopColor: sky.divider, backgroundColor: sky.cardBg }]}
    >
      <BannerAd
        unitId={bannerUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 2,
  },
});
