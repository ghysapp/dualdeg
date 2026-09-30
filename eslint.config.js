// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // Dev scripts run under Node, not in the app.
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: { __dirname: "readonly", __filename: "readonly" },
    },
  },
]);
