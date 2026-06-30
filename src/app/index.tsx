import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DailyOutlook } from '@/components/weather/DailyOutlook';
import { HourlyStrip } from '@/components/weather/HourlyStrip';
import { MetricGrid } from '@/components/weather/MetricGrid';
import { BannerAdBar } from '@/components/ads/BannerAdBar';
import { ApproxLocationBanner } from '@/components/weather/ApproxLocationBanner';
import { LocationPrimingModal } from '@/components/weather/LocationPrimingModal';
import { SkyBackground } from '@/components/weather/SkyBackground';
import { SunMoonSection } from '@/components/weather/SunMoonSection';
import { TabStrip } from '@/components/weather/TabStrip';
import { WeatherHero } from '@/components/weather/WeatherHero';
import { HAS_API_KEY } from '@/config';
import { useLocations } from '@/state/locations';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import { LOADING_SKY, resolveSky, type SkyTheme } from '@/theme/sky';

export default function HomeScreen() {
  const router = useRouter();
  const { tabs, selectedIndex, entryFor, refresh } = useLocations();
  const { strings } = useSettings();

  const activeTab = tabs[selectedIndex] ?? tabs[0];
  const entry = entryFor(activeTab.ref);
  const sky: SkyTheme = entry.data ? resolveSky(entry.data) : LOADING_SKY;

  const onRefresh = () => refresh(activeTab.ref, true);

  return (
    <SkyBackground sky={sky}>
      <StatusBar style={sky.statusBar === 'light' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <View style={styles.stripWrap}>
            <TabStrip sky={sky} onAddPress={() => router.push('/add-city')} />
          </View>
          <Pressable
            onPress={() => router.push('/settings')}
            hitSlop={8}
            style={[styles.gear, { backgroundColor: sky.tabInactiveBg }]}
          >
            <FontAwesome name="cog" size={17} color={sky.tabInactiveFg} />
          </Pressable>
        </View>

        {activeTab?.isCurrent && <ApproxLocationBanner sky={sky} />}

        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={entry.refreshing}
              onRefresh={onRefresh}
              tintColor={sky.textSecondary}
              colors={[sky.textSecondary]}
            />
          }
        >
          {!HAS_API_KEY ? (
            <SetupNotice sky={sky} />
          ) : entry.status === 'loading' && !entry.data ? (
            <Centered>
              <ActivityIndicator color={sky.textPrimary} size="large" />
            </Centered>
          ) : entry.status === 'error' && !entry.data ? (
            <Centered>
              <Text style={[styles.message, { color: sky.textPrimary }]}>{entry.error}</Text>
              <Pressable
                onPress={onRefresh}
                style={[
                  styles.retry,
                  { borderColor: sky.cardBorder, backgroundColor: sky.cardBg },
                ]}
              >
                <Text style={[styles.retryText, { color: sky.textPrimary }]}>{strings.tryAgain}</Text>
              </Pressable>
            </Centered>
          ) : entry.data ? (
            <>
              <WeatherHero data={entry.data} sky={sky} />
              <MetricGrid data={entry.data} sky={sky} />
              <HourlyStrip hours={entry.data.hours} sky={sky} />
              <DailyOutlook days={entry.data.days} sky={sky} />
              <SunMoonSection data={entry.data} sky={sky} />
              <View style={{ height: 24 }} />
            </>
          ) : null}
        </ScrollView>

        <BannerAdBar sky={sky} />
      </SafeAreaView>

      <LocationPrimingModal />
    </SkyBackground>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}

function SetupNotice({ sky }: { sky: SkyTheme }) {
  return (
    <View style={styles.centered}>
      <View
        style={[styles.notice, { backgroundColor: sky.cardBg, borderColor: sky.cardBorder }]}
      >
        <Text style={[styles.noticeTitle, { color: sky.textPrimary }]}>Add your API key</Text>
        <Text style={[styles.noticeBody, { color: sky.textSecondary }]}>
          Create a free key at weatherapi.com, then put it in the project&apos;s{' '}
          <Text style={{ fontFamily: Font.semibold }}>.env</Text> file as{'\n'}
          <Text style={{ fontFamily: Font.semibold }}>EXPO_PUBLIC_WEATHERAPI_KEY</Text> and
          restart Expo.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
  },
  stripWrap: { flex: 1 },
  gear: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: { flex: 1 },
  scroll: { flexGrow: 1 },
  centered: {
    flex: 1,
    minHeight: 480,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  message: {
    fontFamily: Font.medium,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retry: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryText: {
    fontFamily: Font.semibold,
    fontSize: 13,
  },
  notice: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    maxWidth: 340,
  },
  noticeTitle: {
    fontFamily: Font.tightBold,
    fontSize: 18,
    marginBottom: 8,
  },
  noticeBody: {
    fontFamily: Font.regular,
    fontSize: 13,
    lineHeight: 20,
  },
});
