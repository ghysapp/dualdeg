import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useLocations } from '@/state/locations';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import type { SkyTheme } from '@/theme/sky';

/**
 * Shown on the current tab when weather is based on an approximate (IP-derived)
 * location because GPS permission wasn't granted. Tapping it re-requests
 * permission (or opens Settings if it was denied).
 */
export function ApproxLocationBanner({ sky }: { sky: SkyTheme }) {
  const { approximate, enableLocation } = useLocations();
  const { strings } = useSettings();

  if (!approximate) return null;

  return (
    <Pressable
      onPress={enableLocation}
      style={[styles.bar, { backgroundColor: sky.cardBg, borderColor: sky.cardBorder }]}
    >
      <FontAwesome name="map-marker" size={13} color={sky.textSecondary} style={styles.icon} />
      <Text style={[styles.text, { color: sky.textPrimary }]} numberOfLines={1}>
        {strings.locApprox}
      </Text>
      <Text style={[styles.action, { color: sky.textPrimary }]}>{strings.locEnable}</Text>
      <FontAwesome name="chevron-right" size={10} color={sky.textPrimary} style={styles.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
    opacity: 0.9,
  },
  text: {
    flex: 1,
    fontFamily: Font.medium,
    fontSize: 12,
    opacity: 0.9,
  },
  action: {
    fontFamily: Font.semibold,
    fontSize: 12.5,
    marginLeft: 8,
  },
  chevron: {
    marginLeft: 4,
    opacity: 0.8,
  },
});
