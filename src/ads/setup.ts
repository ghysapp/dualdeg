/**
 * One-time ad SDK bootstrap: gather GDPR/UMP consent, request iOS App Tracking
 * Transparency, apply request config, then initialize the Mobile Ads SDK (which
 * also brings up any mediation adapters configured in the AdMob console).
 *
 * The native lib is lazy-`require`d and the whole thing no-ops when
 * `adsAvailable` is false (Expo Go), so importing this file is always safe.
 */

import { Platform } from 'react-native';

import { adsAvailable, testDeviceIds } from './config';

let started = false;

export async function initializeAds(): Promise<void> {
  if (!adsAvailable || started) return;
  started = true;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { default: mobileAds, AdsConsent, MaxAdContentRating } = require('react-native-google-mobile-ads');

  // 1. Consent (GDPR/UMP). Shows a form only when legally required; safe to
  //    proceed on failure (the SDK can still serve non-personalized ads).
  try {
    await AdsConsent.gatherConsent();
  } catch {
    // ignore — continue with limited ads
  }

  // 2. iOS App Tracking Transparency prompt (enables personalized ads / IDFA).
  if (Platform.OS === 'ios') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { requestTrackingPermissionsAsync } = require('expo-tracking-transparency');
      await requestTrackingPermissionsAsync();
    } catch {
      // ignore
    }
  }

  // 3. Global request configuration. Listing test device ids makes real ad
  //    units serve test ads on those devices (safe verification).
  try {
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      ...(testDeviceIds.length ? { testDeviceIdentifiers: testDeviceIds } : {}),
    });
  } catch {
    // ignore
  }

  // 4. Initialize the SDK (+ mediation adapters).
  try {
    await mobileAds().initialize();
  } catch {
    // ignore — banners will simply not fill
  }
}
