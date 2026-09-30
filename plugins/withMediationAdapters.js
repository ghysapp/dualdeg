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
 *
 * They must also stop at **play-services-ads 25.0.0**, which is the newest
 * release Expo SDK 56 can compile against: 25.1.0+ is built with Kotlin 2.3.0
 * metadata, while Expo 56 pins the Kotlin compiler at 2.1.20 and cannot read
 * it. The symptom is not a version error — the compiler crashes while trying to
 * report the incompatibility, so the build fails with a bare "Internal compiler
 * error" on MainActivity.kt. Check an adapter's POM before bumping it:
 *   https://dl.google.com/dl/android/maven2/com/google/ads/mediation/
 *     <name>/<version>/<name>-<version>.pom
 * and confirm its play-services-ads dependency is still 25.0.0. Forcing the SDK
 * down underneath a newer adapter is not an option — Mintegral 17.1.61.1, for
 * one, calls AgeRestrictedTreatment, which doesn't exist in 25.0.0.
 *
 * Revisit when Expo ships an SDK on Kotlin 2.3+; the newest adapters should
 * then just work.
 */
const ADAPTERS = [
  // Newest versions still targeting play-services-ads 25.0.0 — see above.
  'com.google.ads.mediation:applovin:13.6.1.0',
  'com.google.ads.mediation:mintegral:17.1.11.0',
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
