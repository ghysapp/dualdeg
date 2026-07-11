import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HourlyStrip } from '@/components/weather/HourlyStrip';
import { SkyBackground } from '@/components/weather/SkyBackground';
import { MoonDisc, SunArc } from '@/components/weather/SunMoon';
import { TempDual } from '@/components/weather/Temp';
import { format, localizedMoonPhase, type Strings } from '@/i18n/translations';
import type { DayForecast, WeatherData } from '@/services/weatherApi';
import { useLocations } from '@/state/locations';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import { weatherEmoji } from '@/theme/icons';
import { skyForDay, type SkyTheme } from '@/theme/sky';
import { orderTemp, orderWind } from '@/utils/temperature';
import { timeToMinutes, to24h } from '@/utils/time';

export default function DayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string; epoch?: string }>();
  const { tabs, entryFor } = useLocations();
  const { strings, language } = useSettings();

  const tab = tabs.find((t) => t.key === params.tab) ?? tabs[0];
  const data: WeatherData | undefined = tab ? entryFor(tab.ref).data : undefined;
  const epoch = Number(params.epoch);
  const day = data?.days.find((d) => d.dateEpoch === epoch);

  const sky: SkyTheme = day ? skyForDay(day.conditionCode) : skyForDay(1000);

  const title = day
    ? day.isTomorrow
      ? strings.tomorrow
      : strings.weekdays[day.weekdayIndex]
    : '';
  const dateLabel = day ? formatDate(day.dateEpoch, language) : '';
  const place = data?.location.name ?? '';

  return (
    <SkyBackground sky={sky}>
      <StatusBar style={sky.statusBar === 'light' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={[styles.back, { backgroundColor: sky.tabInactiveBg }]}
          >
            <FontAwesome name="chevron-left" size={15} color={sky.tabInactiveFg} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: sky.textPrimary }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.headerSub, { color: sky.textSecondary }]} numberOfLines={1}>
              {[place, dateLabel].filter(Boolean).join(' · ')}
            </Text>
          </View>
        </View>

        {!day ? (
          <View style={styles.centered}>
            <Text style={[styles.missing, { color: sky.textPrimary }]}>—</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            <DayHero day={day} sky={sky} />
            <DayMetrics day={day} sky={sky} strings={strings} />
            {day.hours && day.hours.length > 0 && <HourlyStrip hours={day.hours} sky={sky} />}
            <DaySunMoon day={day} sky={sky} strings={strings} />
            <View style={{ height: 24 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </SkyBackground>
  );
}

// ---------------------------------------------------------------------------
// Hero — the day's headline: big high, condition, and the H/L range.
// ---------------------------------------------------------------------------

function DayHero({ day, sky }: { day: DayForecast; sky: SkyTheme }) {
  const { tempOrder } = useSettings();
  const emoji = weatherEmoji(day.conditionCode, true);
  const t = orderTemp(day.maxTempC, day.maxTempF, tempOrder);

  return (
    <View style={styles.hero}>
      <Text style={styles.heroGlyph}>{emoji}</Text>

      <View style={styles.heroCenter}>
        {!!day.conditionText && (
          <Text style={[styles.heroCond, { color: sky.textPrimary }]} numberOfLines={1}>
            {day.conditionText}
          </Text>
        )}

        <View style={styles.tempRow}>
          <Text style={[styles.bigNum, { color: sky.textPrimary }]} numberOfLines={1}>
            {t.primaryValue}°
          </Text>
          <View style={styles.unitCol}>
            <Text style={[styles.primaryUnit, { color: sky.textPrimary }]}>{t.primaryUnit}</Text>
            <View style={styles.secondaryRow}>
              <Text style={[styles.secondaryNum, { color: sky.textPrimary }]} numberOfLines={1}>
                {t.secondaryValue}°
              </Text>
              <Text style={[styles.secondarySup, { color: sky.textPrimary }]}>
                {t.secondaryUnit}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.hiloRow}>
          <Text style={[styles.hiloLabel, { color: sky.textPrimary }]}>H</Text>
          <TempDual
            c={day.maxTempC}
            f={day.maxTempF}
            order={tempOrder}
            size={13}
            color={sky.textPrimary}
            weight={Font.medium}
            opacity={0.8}
          />
          <Text style={[styles.hiloLabel, { color: sky.textPrimary, marginLeft: 18 }]}>L</Text>
          <TempDual
            c={day.minTempC}
            f={day.minTempF}
            order={tempOrder}
            size={13}
            color={sky.textPrimary}
            weight={Font.medium}
            opacity={0.8}
          />
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Metrics — feels-like, humidity, wind, precip, UV. Only what the provider gave.
// ---------------------------------------------------------------------------

const GAP = 8;
const PADDING_H = 16;

function DayMetrics({ day, sky, strings }: { day: DayForecast; sky: SkyTheme; strings: Strings }) {
  const { tempOrder } = useSettings();
  const [rowWidth, setRowWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setRowWidth(e.nativeEvent.layout.width);
  const cardWidth = rowWidth > 0 ? (rowWidth - PADDING_H * 2 - GAP) / 2 : undefined;

  type Card = { label: string; val?: string; temp?: { c: number; f: number }; sub: string };
  const cards: Card[] = [];

  if (day.feelsLikeC != null && day.feelsLikeF != null) {
    const delta = day.feelsLikeC - day.maxTempC;
    const sub =
      delta <= -2 ? strings.subCooler : delta >= 2 ? strings.subWarmer : strings.subSimilar;
    cards.push({ label: strings.feelsLike, temp: { c: day.feelsLikeC, f: day.feelsLikeF }, sub });
  }
  if (day.avgHumidity != null) {
    const sub =
      day.avgHumidity < 40
        ? strings.subDry
        : day.avgHumidity < 70
          ? strings.subComfortable
          : strings.subHumid;
    cards.push({ label: strings.humidity, val: `${day.avgHumidity}%`, sub });
  }
  if (day.maxWindKph != null) {
    const wind = orderWind(day.maxWindKph, tempOrder);
    cards.push({
      label: strings.wind,
      val: `${wind.primaryValue} ${wind.primaryUnit}`,
      sub: `${wind.secondaryValue} ${wind.secondaryUnit}${day.windDir ? ` · ${day.windDir}` : ''}`,
    });
  }
  cards.push({
    label: strings.precip,
    val: `${day.chanceOfRain}%`,
    sub: day.totalPrecipMm != null ? `${day.totalPrecipMm.toFixed(1)} mm` : '',
  });
  if (day.uv != null) {
    cards.push({ label: 'UV', val: `${day.uv}`, sub: 'of 11' });
  }

  return (
    <View style={styles.grid} onLayout={onLayout}>
      {cards.map((m) => (
        <View
          key={m.label}
          style={[
            styles.metricCard,
            { width: cardWidth, backgroundColor: sky.cardBg, borderColor: sky.cardBorder },
          ]}
        >
          <Text style={[styles.metricLabel, { color: sky.textSecondary }]}>
            {m.label.toUpperCase()}
          </Text>
          {m.temp ? (
            <View style={styles.metricTemp}>
              <TempDual c={m.temp.c} f={m.temp.f} order={tempOrder} size={16} color={sky.textPrimary} />
            </View>
          ) : (
            <Text style={[styles.metricVal, { color: sky.textPrimary }]} numberOfLines={1}>
              {m.val}
            </Text>
          )}
          {!!m.sub && (
            <Text style={[styles.metricSub, { color: sky.textSecondary }]} numberOfLines={1}>
              {m.sub}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Sun & Moon — the day's daylight arc (static) plus its moon phase.
// ---------------------------------------------------------------------------

function DaySunMoon({ day, sky, strings }: { day: DayForecast; sky: SkyTheme; strings: Strings }) {
  const [arcWidth, setArcWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setArcWidth(e.nativeEvent.layout.width);

  const hasSun = !!day.sunrise && !!day.sunset;
  const hasMoon = day.moonPhase != null && day.moonIllumination != null;
  if (!hasSun && !hasMoon) return null;

  const waning = /waning|last quarter/i.test(day.moonPhase ?? '');

  return (
    <View style={styles.sunMoon}>
      <Text style={[styles.sectionHeading, { color: sky.textSecondary }]}>
        {strings.sunMoon.toUpperCase()}
      </Text>

      {hasSun && (
        <View
          style={[styles.card, { backgroundColor: sky.cardBg, borderColor: sky.cardBorder }]}
          onLayout={onLayout}
        >
          <View style={styles.arcWrap}>
            {arcWidth > 0 && (
              <SunArc
                width={arcWidth}
                sky={sky}
                sunriseMin={timeToMinutes(day.sunrise!)}
                sunsetMin={timeToMinutes(day.sunset!)}
                nowMin={null}
              />
            )}
          </View>
          <View style={styles.endsRow}>
            <View>
              <Text style={[styles.timeVal, { color: sky.textPrimary }]}>{to24h(day.sunrise!)}</Text>
              <Text style={[styles.timeLabel, { color: sky.textSecondary }]}>{strings.sunrise}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.timeVal, { color: sky.textPrimary }]}>{to24h(day.sunset!)}</Text>
              <Text style={[styles.timeLabel, { color: sky.textSecondary }]}>{strings.sunset}</Text>
            </View>
          </View>
        </View>
      )}

      {hasMoon && (
        <View style={[styles.moonCard, { backgroundColor: sky.cardBg, borderColor: sky.cardBorder }]}>
          <MoonDisc size={64} illumination={day.moonIllumination!} waning={waning} />
          <View style={styles.moonText}>
            <Text style={[styles.moonPhase, { color: sky.textPrimary }]} numberOfLines={1}>
              {localizedMoonPhase(strings, day.moonPhase!)}
            </Text>
            <Text style={[styles.moonSub, { color: sky.textSecondary }]}>
              {format(strings.illuminated, { n: Math.round(Number(day.moonIllumination) || 0) })}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

/** Localized "12 July"-style date from a day epoch (seconds). */
function formatDate(dateEpoch: number, language: string): string {
  const d = new Date(dateEpoch * 1000);
  try {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : language, {
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(d);
  } catch {
    return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(d);
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 8,
  },
  back: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontFamily: Font.tightBold,
    fontSize: 20,
  },
  headerSub: {
    fontFamily: Font.medium,
    fontSize: 12,
    opacity: 0.85,
    marginTop: 1,
  },
  scrollArea: { flex: 1 },
  scroll: { flexGrow: 1 },
  centered: {
    flex: 1,
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missing: {
    fontFamily: Font.tightLight,
    fontSize: 48,
    opacity: 0.6,
  },

  // Hero
  hero: {
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 20,
  },
  heroGlyph: {
    position: 'absolute',
    top: 8,
    right: 20,
    fontSize: 58,
  },
  heroCenter: { alignItems: 'center' },
  heroCond: {
    fontFamily: Font.medium,
    fontSize: 14,
    opacity: 0.85,
    letterSpacing: 0.2,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  bigNum: {
    fontFamily: Font.tightLight,
    fontSize: 86,
    lineHeight: 86,
    letterSpacing: -2,
    includeFontPadding: false,
  },
  unitCol: {
    marginLeft: 2,
    marginTop: 2,
    alignItems: 'flex-start',
  },
  primaryUnit: {
    fontFamily: Font.tightSemibold,
    fontSize: 24,
    opacity: 0.55,
    includeFontPadding: false,
    marginTop: 4,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  secondaryNum: {
    fontFamily: Font.tightMedium,
    fontSize: 30,
    opacity: 0.55,
    includeFontPadding: false,
  },
  secondarySup: {
    fontFamily: Font.tightMedium,
    fontSize: 16,
    opacity: 0.55,
    includeFontPadding: false,
    marginLeft: 2,
    marginTop: 4,
  },
  hiloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  hiloLabel: {
    fontFamily: Font.medium,
    fontSize: 13,
    opacity: 0.8,
    letterSpacing: 0.3,
    marginRight: 5,
  },

  // Metric grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    paddingHorizontal: PADDING_H,
    paddingVertical: 10,
  },
  metricCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  metricLabel: {
    fontFamily: Font.semibold,
    fontSize: 10,
    letterSpacing: 0.4,
    opacity: 0.78,
  },
  metricTemp: {
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  metricVal: {
    fontFamily: Font.tightSemibold,
    fontSize: 16,
    marginTop: 2,
  },
  metricSub: {
    fontFamily: Font.medium,
    fontSize: 10,
    opacity: 0.75,
  },

  // Sun & Moon
  sunMoon: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionHeading: {
    fontFamily: Font.semibold,
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 7,
    marginLeft: 2,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    marginBottom: 8,
  },
  arcWrap: { height: 96 },
  endsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  timeVal: {
    fontFamily: Font.tightSemibold,
    fontSize: 16,
  },
  timeLabel: {
    fontFamily: Font.medium,
    fontSize: 11,
    opacity: 0.8,
    marginTop: 1,
  },
  moonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  moonText: { flex: 1 },
  moonPhase: {
    fontFamily: Font.tightSemibold,
    fontSize: 17,
  },
  moonSub: {
    fontFamily: Font.medium,
    fontSize: 12,
    opacity: 0.85,
    marginTop: 2,
  },
});
