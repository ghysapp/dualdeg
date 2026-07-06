import { StyleSheet, Text, View } from 'react-native';

import { TempDual } from '@/components/weather/Temp';
import type { WeatherData } from '@/services/weatherApi';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import { weatherEmoji } from '@/theme/icons';
import type { SkyTheme } from '@/theme/sky';
import { orderTemp } from '@/utils/temperature';

export function WeatherHero({ data, sky }: { data: WeatherData; sky: SkyTheme }) {
  const { current, today, location } = data;
  const { tempOrder } = useSettings();
  const emoji = weatherEmoji(current.conditionCode, current.isDay);
  const t = orderTemp(current.tempC, current.tempF, tempOrder);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.glyph]}>{emoji}</Text>

      <View style={styles.center}>
        <Text style={[styles.place, { color: sky.textPrimary }]} numberOfLines={1}>
          {location.name ? `${location.name} · ` : ''}
          {current.conditionText}
        </Text>

        {/* Primary number with its unit as a superscript (aligned to the top of
            the degree); the secondary temperature sits below, same treatment. */}
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
            c={today.maxTempC}
            f={today.maxTempF}
            order={tempOrder}
            size={13}
            color={sky.textPrimary}
            weight={Font.medium}
            opacity={0.8}
          />
          <Text style={[styles.hiloLabel, { color: sky.textPrimary, marginLeft: 18 }]}>L</Text>
          <TempDual
            c={today.minTempC}
            f={today.minTempF}
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

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 14,
    paddingBottom: 6,
    paddingHorizontal: 20,
  },
  center: {
    alignItems: 'center',
  },
  place: {
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
    // Small nudge so the primary unit lines up with the top of the ° (which
    // sits high in the glyph box).
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
  glyph: {
    position: 'absolute',
    top: 14,
    right: 20,
    fontSize: 58,
  },
});
