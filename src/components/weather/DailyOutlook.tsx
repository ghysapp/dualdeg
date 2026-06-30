import { StyleSheet, Text, View } from 'react-native';

import { TempRange } from '@/components/weather/Temp';
import { format } from '@/i18n/translations';
import type { DayForecast } from '@/services/weatherApi';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import { weatherEmoji } from '@/theme/icons';
import type { SkyTheme } from '@/theme/sky';
import { orderTemp } from '@/utils/temperature';

export function DailyOutlook({ days, sky }: { days: DayForecast[]; sky: SkyTheme }) {
  const { strings, tempOrder } = useSettings();
  if (days.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={[styles.heading, { color: sky.textSecondary }]}>
        {format(strings.nextDays, { n: days.length }).toUpperCase()}
      </Text>
      {days.map((d) => {
        const hi = orderTemp(d.maxTempC, d.maxTempF, tempOrder);
        const lo = orderTemp(d.minTempC, d.minTempF, tempOrder);
        return (
          <View
            key={d.dateEpoch}
            style={[styles.row, { backgroundColor: sky.cardBg, borderColor: sky.cardBorder }]}
          >
            <Text style={[styles.name, { color: sky.textPrimary }]} numberOfLines={1}>
              {d.isTomorrow ? strings.tomorrow : strings.weekdays[d.weekdayIndex]}
            </Text>
            <Text style={styles.icon}>{weatherEmoji(d.conditionCode, true)}</Text>
            <Text style={[styles.precip, { color: sky.textPrimary }]}>💧{d.chanceOfRain}%</Text>
            <View style={styles.temps}>
              <TempRange
                hi={hi.primaryValue}
                lo={lo.primaryValue}
                unit={hi.primaryUnit}
                size={14}
                color={sky.textPrimary}
                weight={Font.tightBold}
              />
              <TempRange
                hi={hi.secondaryValue}
                lo={lo.secondaryValue}
                unit={hi.secondaryUnit}
                size={10}
                color={sky.textPrimary}
                weight={Font.tightSemibold}
                opacity={0.7}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heading: {
    fontFamily: Font.semibold,
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 7,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 8,
  },
  name: {
    fontFamily: Font.semibold,
    fontSize: 13,
    width: 74,
  },
  icon: {
    fontSize: 24,
  },
  precip: {
    fontFamily: Font.medium,
    fontSize: 11,
    opacity: 0.8,
    flex: 1,
  },
  temps: {
    alignItems: 'flex-end',
    gap: 1,
  },
});
