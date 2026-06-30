/**
 * Font families used across the app. `Inter` for body/labels, `Inter Tight`
 * for numerals and display text (matches the design).
 *
 * We deep-import individual `.ttf` files rather than named exports from the
 * package index, so only these nine weights are bundled (the index re-exports
 * ~36 weights, all of which would otherwise ship).
 *
 * The map is passed to `useFonts` in the root layout; the named constants are
 * used as `fontFamily` values in styles.
 */

import Inter_400Regular from '@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf';
import Inter_500Medium from '@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf';
import Inter_600SemiBold from '@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf';
import Inter_700Bold from '@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf';
import InterTight_200ExtraLight from '@expo-google-fonts/inter-tight/200ExtraLight/InterTight_200ExtraLight.ttf';
import InterTight_500Medium from '@expo-google-fonts/inter-tight/500Medium/InterTight_500Medium.ttf';
import InterTight_600SemiBold from '@expo-google-fonts/inter-tight/600SemiBold/InterTight_600SemiBold.ttf';
import InterTight_700Bold from '@expo-google-fonts/inter-tight/700Bold/InterTight_700Bold.ttf';
import InterTight_800ExtraBold from '@expo-google-fonts/inter-tight/800ExtraBold/InterTight_800ExtraBold.ttf';

export const fontMap = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  InterTight_200ExtraLight,
  InterTight_500Medium,
  InterTight_600SemiBold,
  InterTight_700Bold,
  InterTight_800ExtraBold,
} as const;

export const Font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  // Inter Tight (display / numerals)
  tightLight: 'InterTight_200ExtraLight',
  tightMedium: 'InterTight_500Medium',
  tightSemibold: 'InterTight_600SemiBold',
  tightBold: 'InterTight_700Bold',
  tightExtraBold: 'InterTight_800ExtraBold',
} as const;
