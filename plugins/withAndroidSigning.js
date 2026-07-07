const { withAppBuildGradle, withGradleProperties } = require('@expo/config-plugins');

module.exports = function withAndroidSigning(config) {
  config = withAppBuildGradle(config, (config) => {
    config.modResults.contents = applySigningConfig(config.modResults.contents);
    return config;
  });

  config = withGradleProperties(config, (config) => {
    const props = config.modResults;

    const set = (key, value) => {
      const existing = props.find((p) => p.type === 'property' && p.key === key);
      if (existing) existing.value = value;
      else props.push({ type: 'property', key, value });
    };

    // R8 shrinking so the release build produces a mapping.txt — upload it
    // in Play Console (Release > App bundle explorer > this version >
    // "Upload deobfuscation file") to de-obfuscate crash stack traces.
    set('android.enableMinifyInReleaseBuilds', 'true');
    set('android.enableShrinkResourcesInReleaseBuilds', 'true');

    return config;
  });

  return config;
};

function applySigningConfig(buildGradle) {
  if (buildGradle.includes('DUALDEG_UPLOAD_STORE_FILE')) {
    return buildGradle;
  }

  const releaseSigningBlock = `
        release {
            def keystoreProps = new Properties()
            def keystoreFile = rootProject.file('../keystore.properties')
            if (keystoreFile.exists()) { keystoreProps.load(new FileInputStream(keystoreFile)) }
            storeFile file(keystoreProps['DUALDEG_UPLOAD_STORE_FILE'] ?: '../../dualdeg-release.keystore')
            storePassword keystoreProps['DUALDEG_UPLOAD_STORE_PASSWORD'] ?: ''
            keyAlias keystoreProps['DUALDEG_UPLOAD_KEY_ALIAS'] ?: 'dualdeg-upload'
            keyPassword keystoreProps['DUALDEG_UPLOAD_KEY_PASSWORD'] ?: ''
        }`;

  buildGradle = buildGradle.replace(
    /(signingConfigs\s*\{)([\s\S]*?debug\s*\{[\s\S]*?\})/,
    (match, opening, debugBlock) => `${opening}${debugBlock}\n${releaseSigningBlock}`
  );

  buildGradle = buildGradle.replace(
    /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig signingConfigs\.debug/,
    '$1signingConfig signingConfigs.release'
  );

  return buildGradle;
}
