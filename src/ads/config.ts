/**
 * Ad configuration.
 *
 * Uses Google's test ad units by default (and always in development) so we
 * never accidentally serve — or click — live ads while building. Set the
 * EXPO_PUBLIC_ADMOB_BANNER_* env vars to your real unit IDs for production.
 *
 * NOTE: Google Mobile Ads ships native code, so ads only work in a development
 * build / production build — never in Expo Go. `adsAvailable` gates everything
 * (and we lazy-`require` the native lib elsewhere) so the app keeps running in
 * Expo Go.
 */

import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

/** False in Expo Go (no native ad module); true in dev/prod builds. */
export const adsAvailable =
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

// Google's official sample banner units (identical to TestIds.BANNER). Hard-coded
// so this module doesn't import the native lib (which would throw in Expo Go).
const TEST_BANNER =
  Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
  }) ?? 'ca-app-pub-3940256099942544/6300978111';

const realBanner = Platform.select({
  ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS,
  android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID,
});

/** Banner unit id — test id in dev or when no real id is configured. */
export const bannerUnitId = __DEV__ || !realBanner ? TEST_BANNER : realBanner;

/**
 * Devices that should always receive test ads even from real ad-unit IDs.
 * Comma-separated AdMob test device IDs (printed in the device log the first
 * time an ad loads, e.g. "Use RequestConfiguration.Builder...addTestDeviceIds(
 * Arrays.asList("33BE2250B43518CCDA7DE426D04EE231"))"). Lets you verify live
 * units without risking a policy strike.
 */
export const testDeviceIds = (process.env.EXPO_PUBLIC_ADMOB_TEST_DEVICE_IDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
