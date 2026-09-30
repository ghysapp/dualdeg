import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Temp, TempDual } from '@/components/weather/Temp';
import type { LanguageCode } from '@/i18n/translations';
import type { HourForecast } from '@/services/weatherApi';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import { weatherEmoji } from '@/theme/icons';
import type { SkyTheme } from '@/theme/sky';
import { orderTemp } from '@/utils/temperature';

/** English uses 12-hour clock; other locales use 24-hour. */
function formatHour(hour24: number, language: LanguageCode): string {
  if (language === 'en') {
    const period = hour24 < 12 ? 'AM' : 'PM';
    const h12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${h12} ${period}`;
  }
  return `${String(hour24).padStart(2, '0')}:00`;
}

const CARD_W = 82;
const GAP = 9;

/**
 * 24 hour cards, of which about four fit on screen. A virtualized list mounts
 * the visible ones (plus a small buffer) instead of all ~500 views up front —
 * the plain ScrollView cost ~0.5 s of JS on first render on a 4 GB phone.
 */
export function HourlyStrip({ hours, sky }: { hours: HourForecast[]; sky: SkyTheme }) {
  const { strings, tempOrder, language } = useSettings();
  // Cards only stretch to the tallest *mounted* one, so when any hour shows
  // UV, every card keeps that line's space — the row can't grow mid-scroll.
  const anyUv = hours.some((h) => h.uv != null && h.uv > 0);

  return (
    <View style={styles.section}>
      <Text style={[styles.heading, { color: sky.textSecondary }]}>
        {strings.hourly.toUpperCase()}
      </Text>
      <FlatList
        horizontal
        data={hours}
        keyExtractor={(h) => String(h.timeEpoch)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        getItemLayout={(_, index) => ({ length: CARD_W + GAP, offset: (CARD_W + GAP) * index, index })}
        renderItem={({ item: h }) => {
          const t = orderTemp(h.tempC, h.tempF, tempOrder);
          return (
            <View style={[styles.card, { backgroundColor: sky.cardBg, borderColor: sky.cardBorder }]}>
              <Text style={[styles.time, { color: sky.textSecondary }]}>
                {h.isNow ? strings.now : formatHour(h.hour24, language)}
              </Text>
              <Text style={styles.icon}>{weatherEmoji(h.conditionCode, h.isDay)}</Text>
              <Temp
                value={t.primaryValue}
                unit={t.primaryUnit}
                size={15}
                color={sky.textPrimary}
                weight={Font.tightBold}
              />
              <Temp
                value={t.secondaryValue}
                unit={t.secondaryUnit}
                size={11}
                color={sky.textPrimary}
                weight={Font.tightSemibold}
                opacity={0.7}
              />
              <View style={[styles.divider, { backgroundColor: sky.divider }]} />
              <Text style={[styles.feelsLabel, { color: sky.textSecondary }]} numberOfLines={1}>
                {strings.feelsLike.toUpperCase()}
              </Text>
              <TempDual
                c={h.feelsLikeC}
                f={h.feelsLikeF}
                order={tempOrder}
                size={11}
                color={sky.textPrimary}
                weight={Font.tightMedium}
                opacity={0.85}
              />
              <Text style={[styles.meta, { color: sky.textPrimary }]}>💧 {h.humidity}%</Text>
              <Text style={[styles.metaRain, { color: sky.textPrimary }]}>☔ {h.chanceOfRain}%</Text>
              {/* Only where the provider gives UV, and only while the sun is
                  actually up — a column of "UV 0" through the night is noise. */}
              {anyUv && (
                <Text style={[styles.metaRain, { color: sky.textPrimary }]}>
                  {h.uv != null && h.uv > 0 ? `☀️ UV ${h.uv}` : ' '}
                </Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 6,
    paddingLeft: 16,
  },
  heading: {
    fontFamily: Font.semibold,
    fontSize: 12,
    opacity: 0.8,
    marginVertical: 6,
    marginLeft: 2,
  },
  row: {
    paddingBottom: 4,
    paddingRight: 16 - GAP,
  },
  card: {
    width: CARD_W,
    marginRight: GAP,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  time: {
    fontFamily: Font.semibold,
    fontSize: 12,
  },
  icon: {
    fontSize: 26,
    marginVertical: 5,
  },
  divider: {
    height: 1,
    alignSelf: 'stretch',
    marginVertical: 7,
  },
  feelsLabel: {
    fontFamily: Font.semibold,
    fontSize: 8,
    letterSpacing: 0.5,
    opacity: 0.7,
    marginBottom: 2,
  },
  meta: {
    fontFamily: Font.medium,
    fontSize: 10,
    opacity: 0.82,
    marginTop: 5,
  },
  metaRain: {
    fontFamily: Font.medium,
    fontSize: 10,
    opacity: 0.82,
    marginTop: 3,
  },
});
