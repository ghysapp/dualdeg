import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Linking, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';

const PALETTES = {
  light: { bg: '#f4f6fa', surface: '#ffffff', border: '#e3e7ee', text: '#1c2433', subtext: '#6b7280', accent: '#2f7ad6' },
  dark: { bg: '#0e1422', surface: '#172033', border: '#26324a', text: '#eef2f9', subtext: '#94a1b8', accent: '#5fa3ec' },
} as const;

interface Credit {
  title: string;
  subtitle: string;
  url: string;
}

const WEATHER_SOURCES: Credit[] = [
  {
    title: 'MET Norway (yr.no)',
    subtitle:
      'Weather data from MET Norway — Norway & much of Europe · Licensed under NLOD / CC BY 4.0',
    url: 'https://www.met.no/en',
  },
  {
    title: 'NOAA · U.S. National Weather Service',
    subtitle: 'United States · Public domain',
    url: 'https://www.weather.gov/',
  },
  {
    title: 'Météo-France',
    subtitle: 'France',
    url: 'https://meteofrance.com/',
  },
  {
    title: 'Deutscher Wetterdienst (DWD) · Bright Sky',
    subtitle: 'Germany · dwd.de open data, served via brightsky.dev',
    url: 'https://brightsky.dev/',
  },
  {
    title: 'WeatherAPI.com',
    subtitle: 'Other regions & city search',
    url: 'https://www.weatherapi.com/',
  },
];

const OPEN_SOURCE: Credit[] = [
  {
    title: 'Natural Earth',
    subtitle: 'Country outlines · Public domain',
    url: 'https://www.naturalearthdata.com/',
  },
  {
    title: 'SunCalc',
    subtitle: 'Sunrise/sunset & moon phase calculations',
    url: 'https://github.com/mourner/suncalc',
  },
  {
    title: 'Inter & Inter Tight',
    subtitle: 'Typefaces · SIL Open Font License',
    url: 'https://rsms.me/inter/',
  },
];

export default function AttributionScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = PALETTES[scheme === 'dark' ? 'dark' : 'light'];
  const { strings } = useSettings();

  const renderCard = (items: Credit[]) => (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
      {items.map((item, i) => (
        <Pressable
          key={item.title}
          onPress={() => Linking.openURL(item.url)}
          style={[
            styles.row,
            i < items.length - 1 && {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: c.border,
            },
          ]}
        >
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: c.text }]}>{item.title}</Text>
            <Text style={[styles.rowSub, { color: c.subtext }]}>{item.subtitle}</Text>
          </View>
          <FontAwesome name="external-link" size={13} color={c.subtext} style={styles.linkIcon} />
        </Pressable>
      ))}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.text }]}>{strings.attribution}</Text>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Text style={[styles.done, { color: c.accent }]}>{strings.done}</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionLabel, { color: c.subtext }]}>
            {strings.attributionIntro.toUpperCase()}
          </Text>
          {renderCard(WEATHER_SOURCES)}

          <Text style={[styles.sectionLabel, { color: c.subtext, marginTop: 28 }]}>
            OPEN SOURCE & ASSETS
          </Text>
          {renderCard(OPEN_SOURCE)}
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
  card: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowText: { flex: 1, paddingRight: 12 },
  rowTitle: { fontFamily: Font.semibold, fontSize: 15 },
  rowSub: { fontFamily: Font.regular, fontSize: 12.5, lineHeight: 17, marginTop: 3 },
  linkIcon: { opacity: 0.8 },
});
