import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RemoveAdsCard } from '@/components/settings/RemoveAdsCard';
import { LANGUAGES } from '@/i18n/translations';
import { useLocations } from '@/state/locations';
import { useSettings, type TempOrder } from '@/state/settings';
import { Font } from '@/theme/fonts';
import { useSettingsPalette, type SettingsPalette } from '@/theme/settingsTheme';

const TEMP_OPTIONS: { value: TempOrder; label: string }[] = [
  { value: 'CF', label: '°C / °F' },
  { value: 'FC', label: '°F / °C' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = useSettingsPalette();
  const { tempOrder, language, setTempOrder, strings } = useSettings();
  const { tabs } = useLocations();

  const cityCount = tabs.filter((t) => t.ref.kind === 'city').length;
  const languageName = LANGUAGES.find((l) => l.code === language)?.name ?? language;

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.text }]}>{strings.settings}</Text>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Text style={[styles.done, { color: c.accent }]}>{strings.done}</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Remove ads (in-app purchase) */}
          <RemoveAdsCard />

          {/* Temperature order */}
          <Text style={[styles.sectionLabel, { color: c.subtext }]}>
            {strings.temperature.toUpperCase()}
          </Text>
          <View style={[styles.segment, { backgroundColor: c.surface, borderColor: c.border }]}>
            {TEMP_OPTIONS.map((opt) => {
              const active = tempOrder === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setTempOrder(opt.value)}
                  style={[styles.segmentItem, active && { backgroundColor: c.accent }]}
                >
                  <Text style={[styles.segmentText, { color: active ? '#ffffff' : c.text }]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Cities + Language navigation */}
          <View
            style={[styles.card, { backgroundColor: c.surface, borderColor: c.border, marginTop: 28 }]}
          >
            <NavRow
              icon="th-large"
              label={strings.cities}
              value={String(cityCount)}
              colors={c}
              onPress={() => router.push('/manage-cities')}
            />
            <View style={[styles.divider, { backgroundColor: c.border }]} />
            <NavRow
              icon="language"
              label={strings.language}
              value={languageName}
              colors={c}
              onPress={() => router.push('/language')}
            />
          </View>

          {/* Attribution */}
          <View
            style={[styles.card, { backgroundColor: c.surface, borderColor: c.border, marginTop: 28 }]}
          >
            <NavRow
              icon="info-circle"
              label={strings.attribution}
              colors={c}
              onPress={() => router.push('/attribution')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function NavRow({
  icon,
  label,
  value,
  colors,
  onPress,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value?: string;
  colors: SettingsPalette;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.navRow, pressed && { backgroundColor: colors.selectedBg }]}
    >
      <FontAwesome name={icon} size={16} color={colors.accent} style={styles.navIcon} />
      <Text style={[styles.navLabel, { color: colors.text }]}>{label}</Text>
      {value != null && (
        <Text style={[styles.navValue, { color: colors.subtext }]} numberOfLines={1}>
          {value}
        </Text>
      )}
      <FontAwesome name="chevron-right" size={13} color={colors.subtext} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: { fontFamily: Font.tightBold, fontSize: 22 },
  done: { fontFamily: Font.semibold, fontSize: 15 },
  content: { padding: 20, paddingTop: 8 },
  sectionLabel: {
    fontFamily: Font.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 4,
  },
  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 10,
  },
  segmentText: { fontFamily: Font.tightSemibold, fontSize: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 48,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 12,
  },
  navIcon: {
    width: 20,
    textAlign: 'center',
  },
  navLabel: {
    flex: 1,
    fontFamily: Font.medium,
    fontSize: 16,
  },
  navValue: {
    fontFamily: Font.regular,
    fontSize: 15,
    maxWidth: 160,
  },
});
