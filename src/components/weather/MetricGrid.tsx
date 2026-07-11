import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { TempDual } from '@/components/weather/Temp';
import type { Strings } from '@/i18n/translations';
import type { WeatherData } from '@/services/weatherApi';
import { useSettings, type TempOrder } from '@/state/settings';
import { Font } from '@/theme/fonts';
import type { SkyTheme } from '@/theme/sky';
import { orderWind } from '@/utils/temperature';

const GAP = 8;
const PADDING_H = 16;

interface Metric {
  label: string;
  val?: string;
  /** When set, the value is a temperature pair rendered with °C/°F units. */
  temp?: { c: number; f: number };
  sub: string;
}

function buildMetrics(data: WeatherData, strings: Strings, tempOrder: TempOrder): Metric[] {
  const { current, today } = data;
  const wind = orderWind(current.windKph, tempOrder);

  const feelsDelta = current.feelsLikeC - current.tempC;
  const feelsSub =
    feelsDelta <= -2 ? strings.subCooler : feelsDelta >= 2 ? strings.subWarmer : strings.subSimilar;

  const humSub =
    current.humidity < 40
      ? strings.subDry
      : current.humidity < 70
        ? strings.subComfortable
        : strings.subHumid;

  return [
    {
      label: strings.feelsLike,
      temp: { c: current.feelsLikeC, f: current.feelsLikeF },
      sub: feelsSub,
    },
    { label: strings.humidity, val: `${current.humidity}%`, sub: humSub },
    {
      label: strings.wind,
      val: `${wind.primaryValue} ${wind.primaryUnit}`,
      sub: `${wind.secondaryValue} ${wind.secondaryUnit}${current.windDir ? ` · ${current.windDir}` : ''}`,
    },
    {
      label: strings.precip,
      val: `${today.chanceOfRain}%`,
      sub: `${today.precipMm.toFixed(1)} mm`,
    },
  ];
}

export function MetricGrid({ data, sky }: { data: WeatherData; sky: SkyTheme }) {
  const { strings, tempOrder } = useSettings();
  const metrics = buildMetrics(data, strings, tempOrder);
  const [rowWidth, setRowWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setRowWidth(e.nativeEvent.layout.width);

  // Exact 2-column width in px so we always get a 2×2 grid (percentage
  // flex-basis doesn't resolve reliably across platforms here). rowWidth
  // includes the grid's horizontal padding, so subtract it before halving.
  const cardWidth = rowWidth > 0 ? (rowWidth - PADDING_H * 2 - GAP) / 2 : undefined;

  return (
    <View style={styles.grid} onLayout={onLayout}>
      {metrics.map((m) => (
        <View
          key={m.label}
          style={[
            styles.card,
            { width: cardWidth, backgroundColor: sky.cardBg, borderColor: sky.cardBorder },
          ]}
        >
          <Text style={[styles.label, { color: sky.textSecondary }]}>{m.label.toUpperCase()}</Text>
          {m.temp ? (
            <View style={styles.valTemp}>
              <TempDual c={m.temp.c} f={m.temp.f} order={tempOrder} size={16} color={sky.textPrimary} />
            </View>
          ) : (
            <Text style={[styles.val, { color: sky.textPrimary }]} numberOfLines={1}>
              {m.val}
            </Text>
          )}
          <Text style={[styles.sub, { color: sky.textSecondary }]} numberOfLines={1}>
            {m.sub}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    paddingHorizontal: PADDING_H,
    paddingVertical: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  label: {
    fontFamily: Font.semibold,
    fontSize: 10,
    letterSpacing: 0.4,
    opacity: 0.78,
  },
  valTemp: {
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  val: {
    fontFamily: Font.tightSemibold,
    fontSize: 16,
    marginTop: 2,
  },
  sub: {
    fontFamily: Font.medium,
    fontSize: 10,
    opacity: 0.75,
  },
});
