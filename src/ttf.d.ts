// Allow deep-importing individual font files (keeps only the weights we use in
// the bundle, instead of every weight the @expo-google-fonts index re-exports).
declare module '*.ttf' {
  const asset: number;
  export default asset;
}
