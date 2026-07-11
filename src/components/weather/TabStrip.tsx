import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useLocations } from '@/state/locations';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import type { SkyTheme } from '@/theme/sky';

export function TabStrip({
  sky,
  onAddPress,
}: {
  sky: SkyTheme;
  onAddPress: () => void;
}) {
  const { tabs, selectedIndex, selectTab, canAddMore, entryFor } = useLocations();
  const { strings } = useSettings();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.strip}
      contentContainerStyle={styles.row}
    >
      {tabs.map((tab, i) => {
        const active = i === selectedIndex;
        // The current-location tab shows the detected place name once it loads,
        // falling back to the generic "Current" label while it resolves (or if
        // the serving provider doesn't return a name).
        const label = tab.isCurrent
          ? entryFor(tab.ref).data?.location.name || strings.current
          : tab.label;
        return (
          <Pressable
            key={tab.key}
            onPress={() => selectTab(i)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? sky.tabActiveBg : sky.tabInactiveBg,
              },
              active && {
                shadowColor: sky.tabShadow.color,
                shadowOpacity: sky.tabShadow.opacity,
                shadowRadius: sky.tabShadow.radius,
                shadowOffset: { width: 0, height: sky.tabShadow.offsetY },
                elevation: sky.tabShadow.elevation,
              },
            ]}
          >
            {tab.isCurrent && (
              <View style={styles.glyphBox}>
                <FontAwesome
                  name="map-marker"
                  size={14}
                  color={active ? sky.tabActiveFg : sky.tabInactiveFg}
                />
              </View>
            )}
            <Text
              numberOfLines={1}
              style={[styles.label, { color: active ? sky.tabActiveFg : sky.tabInactiveFg }]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}

      {canAddMore && (
        <Pressable
          onPress={onAddPress}
          style={[styles.chip, styles.addChip, { backgroundColor: sky.tabInactiveBg }]}
        >
          <View style={styles.glyphBox}>
            <View style={styles.plus}>
              <View style={[styles.plusBar, styles.plusH, { backgroundColor: sky.tabInactiveFg }]} />
              <View style={[styles.plusBar, styles.plusV, { backgroundColor: sky.tabInactiveFg }]} />
            </View>
          </View>
          <Text style={[styles.label, { color: sky.tabInactiveFg }]}>{strings.add}</Text>
        </Pressable>
      )}

      <View style={{ width: 8 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // A horizontal ScrollView in a flex column otherwise grows to fill the
  // vertical space; flexGrow:0 keeps it at its content height.
  strip: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    height: 32,
    borderRadius: 18,
  },
  addChip: {
    gap: 3,
  },
  glyphBox: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  plus: {
    width: 11,
    height: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBar: {
    position: 'absolute',
    borderRadius: 1,
  },
  plusH: {
    width: 11,
    height: 2,
  },
  plusV: {
    width: 2,
    height: 11,
  },
  label: {
    fontSize: 12.5,
    fontFamily: Font.semibold,
    includeFontPadding: false,
    textAlignVertical: 'center',
    // Inter's ascent > descent, so caps render ~1px high; nudge down to
    // optically match the geometrically-centered glyphs (⌖ / +).
    transform: [{ translateY: 1 }],
  },
});
