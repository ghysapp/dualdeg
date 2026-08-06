const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Adds AdMob mediation adapter dependencies to the Android app-level
 * build.gradle. (expo-build-properties can't inject arbitrary Gradle
 * dependencies, and these are native, so a config plugin is required.)
 *
 * iOS adapters are added via expo-build-properties `ios.extraPods` in app.json.
 *
 * Versions: keep these in sync with the "network details" table shown in the
 * AdMob console (Mediation → each network) and the adapter changelogs at
 * https://developers.google.com/admob/android/mediation. Gradle resolves the
 * Google Mobile Ads SDK to the highest version any adapter requests, so all
 * adapters here must target the same major SDK version as the one bundled by
 * react-native-google-mobile-ads (currently 25.x).
 */
const ADAPTERS = [
  'com.google.ads.mediation:applovin:13.6.3.0',
  'com.google.ads.mediation:mintegral:17.1.61.1',
  // Deferred until the user has a registered business (individual sign-up fails
  // their company-qualification checks). Re-add here + the matching iOS pod (and
  // Bytedance Maven repo for Pangle):
  //   Meta Audience Network — 'com.google.ads.mediation:facebook:6.21.0.4'
  //   Pangle               — 'com.google.ads.mediation:pangle:8.1.0.4.0'
];

const MARKER = '// admob-mediation-adapters';

module.exports = function withMediationAdapters(config) {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = addAdapters(config.modResults.contents);
    return config;
  });
};

function addAdapters(buildGradle) {
  if (buildGradle.includes(MARKER)) return buildGradle; // idempotent across prebuilds
  const lines = ADAPTERS.map((a) => `    implementation '${a}' ${MARKER}`).join('\n');
  // Insert at the top of the app-level `dependencies { }` block.
  return buildGradle.replace(/(\ndependencies\s*\{)/, `$1\n${lines}`);
}
