import { ScrollView, StyleSheet, Text, View } from 'react-native';

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

export function HourlyStrip({ hours, sky }: { hours: HourForecast[]; sky: SkyTheme }) {
  const { strings, tempOrder, language } = useSettings();

  return (
    <View style={styles.section}>
      <Text style={[styles.heading, { color: sky.textSecondary }]}>
        {strings.hourly.toUpperCase()}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {hours.map((h) => {
          const t = orderTemp(h.tempC, h.tempF, tempOrder);
          return (
            <View
              key={h.timeEpoch}
              style={[styles.card, { backgroundColor: sky.cardBg, borderColor: sky.cardBorder }]}
            >
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
            </View>
          );
        })}
        <View style={{ width: 8 }} />
      </ScrollView>
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
    flexDirection: 'row',
    gap: 9,
    paddingBottom: 4,
    paddingRight: 16,
  },
  card: {
    width: 82,
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
});
