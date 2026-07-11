import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReorderableCities } from '@/components/settings/ReorderableCities';
import { MAX_SAVED_CITIES } from '@/config';
import { format } from '@/i18n/translations';
import { useLocations } from '@/state/locations';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import { useSettingsPalette } from '@/theme/settingsTheme';

export default function ManageCitiesScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = useSettingsPalette();
  const { tabs, removeCity, reorderCities, canAddMore } = useLocations();
  const { strings } = useSettings();

  const cities = tabs.flatMap((t) => (t.ref.kind === 'city' ? [t.ref.city] : []));

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
            <FontAwesome name="chevron-left" size={16} color={c.accent} />
          </Pressable>
          <Text style={[styles.title, { color: c.text }]}>{strings.cities}</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          {cities.length > 0 && (
            <Text style={[styles.hint, { color: c.subtext }]}>{strings.reorderHint}</Text>
          )}

          {/* The current-location tab is always first and can't be moved. */}
          <View style={[styles.currentRow, { backgroundColor: c.surface, borderColor: c.border }]}>
            <FontAwesome name="location-arrow" size={15} color={c.accent} />
            <Text style={[styles.currentName, { color: c.text }]}>{strings.current}</Text>
            <FontAwesome name="thumb-tack" size={12} color={c.subtext} />
          </View>

          <View style={styles.listWrap}>
            <ReorderableCities
              cities={cities}
              colors={c}
              onReorder={reorderCities}
              onRemove={removeCity}
            />
          </View>

          {canAddMore ? (
            <Pressable
              onPress={() => router.push('/add-city')}
              style={({ pressed }) => [
                styles.addBtn,
                { borderColor: c.accent, opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <FontAwesome name="plus" size={13} color={c.accent} />
              <Text style={[styles.addText, { color: c.accent }]}>{strings.addCity}</Text>
            </Pressable>
          ) : (
            <Text style={[styles.capacity, { color: c.subtext }]}>
              {format(strings.capacity, { n: MAX_SAVED_CITIES })}
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: Font.tightBold, fontSize: 22 },
  content: { paddingHorizontal: 20, paddingTop: 4 },
  hint: {
    fontFamily: Font.medium,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
    marginLeft: 2,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    opacity: 0.9,
  },
  currentName: {
    flex: 1,
    fontFamily: Font.semibold,
    fontSize: 15,
  },
  listWrap: {
    marginBottom: 4,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 12,
  },
  addText: {
    fontFamily: Font.semibold,
    fontSize: 15,
  },
  capacity: {
    fontFamily: Font.medium,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});
