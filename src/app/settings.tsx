import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RemoveAdsCard } from '@/components/settings/RemoveAdsCard';
import { LANGUAGES, type LanguageCode } from '@/i18n/translations';
import { useSettings, type TempOrder } from '@/state/settings';
import { Font } from '@/theme/fonts';

const PALETTES = {
  light: {
    bg: '#f4f6fa', surface: '#ffffff', border: '#e3e7ee', text: '#1c2433',
    subtext: '#6b7280', accent: '#2f7ad6', selectedBg: '#e9f1fc',
  },
  dark: {
    bg: '#0e1422', surface: '#172033', border: '#26324a', text: '#eef2f9',
    subtext: '#94a1b8', accent: '#5fa3ec', selectedBg: '#1b2a44',
  },
} as const;

type Palette = (typeof PALETTES)[keyof typeof PALETTES];

const TEMP_OPTIONS: { value: TempOrder; label: string }[] = [
  { value: 'CF', label: '°C / °F' },
  { value: 'FC', label: '°F / °C' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = PALETTES[scheme === 'dark' ? 'dark' : 'light'];
  const { tempOrder, language, setTempOrder, setLanguage, strings } = useSettings();

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
                  <Text
                    style={[
                      styles.segmentText,
                      { color: active ? '#ffffff' : c.text },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Language */}
          <Text style={[styles.sectionLabel, { color: c.subtext, marginTop: 28 }]}>
            {strings.language.toUpperCase()}
          </Text>
          <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
            {LANGUAGES.map((lang, i) => (
              <LanguageRow
                key={lang.code}
                code={lang.code}
                name={lang.name}
                selected={language === lang.code}
                colors={c}
                last={i === LANGUAGES.length - 1}
                onPress={() => setLanguage(lang.code)}
              />
            ))}
          </View>

          {/* Attribution */}
          <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border, marginTop: 28 }]}>
            <Pressable style={styles.linkRow} onPress={() => router.push('/attribution')}>
              <Text style={[styles.langName, { color: c.text }]}>{strings.attribution}</Text>
              <FontAwesome name="chevron-right" size={13} color={c.subtext} />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function LanguageRow({
  name,
  selected,
  colors,
  last,
  onPress,
}: {
  code: LanguageCode;
  name: string;
  selected: boolean;
  colors: Palette;
  last: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.langRow,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
        selected && { backgroundColor: colors.selectedBg },
      ]}
    >
      <Text style={[styles.langName, { color: colors.text }]}>{name}</Text>
      {selected && <FontAwesome name="check" size={15} color={colors.accent} />}
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
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  langName: { fontFamily: Font.medium, fontSize: 16 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
