import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

import { MoonDisc, SunArc } from '@/components/weather/SunMoon';
import { format, localizedMoonPhase } from '@/i18n/translations';
import type { WeatherData } from '@/services/weatherApi';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import type { SkyTheme } from '@/theme/sky';
import { timeToMinutes, to24h } from '@/utils/time';

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export function SunMoonSection({ data, sky }: { data: WeatherData; sky: SkyTheme }) {
  const { today, location } = data;
  const { strings } = useSettings();
  const [arcWidth, setArcWidth] = useState(0);

  const sunriseMin = timeToMinutes(today.sunrise);
  const sunsetMin = timeToMinutes(today.sunset);
  const nowMin = timeToMinutes(location.localtime.slice(11));

  const waning = /waning|last quarter/i.test(today.moonPhase);
  const onLayout = (e: LayoutChangeEvent) => setArcWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.section}>
      <Text style={[styles.heading, { color: sky.textSecondary }]}>
        {strings.sunMoon.toUpperCase()}
      </Text>

      {/* Sun arc card */}
      <View
        style={[styles.card, { backgroundColor: sky.cardBg, borderColor: sky.cardBorder }]}
        onLayout={onLayout}
      >
        <View style={styles.arcWrap}>
          {arcWidth > 0 && (
            <SunArc
              width={arcWidth}
              sky={sky}
              sunriseMin={sunriseMin}
              sunsetMin={sunsetMin}
              nowMin={nowMin}
            />
          )}
        </View>
        <View style={styles.endsRow}>
          <View>
            <Text style={[styles.timeVal, { color: sky.textPrimary }]}>
              {to24h(today.sunrise)}
            </Text>
            <Text style={[styles.timeLabel, { color: sky.textSecondary }]}>{strings.sunrise}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.timeVal, { color: sky.textPrimary }]}>
              {to24h(today.sunset)}
            </Text>
            <Text style={[styles.timeLabel, { color: sky.textSecondary }]}>{strings.sunset}</Text>
          </View>
        </View>
      </View>

      {/* Moon card */}
      <View style={[styles.moonCard, { backgroundColor: sky.cardBg, borderColor: sky.cardBorder }]}>
        <MoonDisc size={64} illumination={today.moonIllumination} waning={waning} />
        <View style={styles.moonText}>
          <Text style={[styles.moonPhase, { color: sky.textPrimary }]} numberOfLines={1}>
            {localizedMoonPhase(strings, today.moonPhase)}
          </Text>
          <Text style={[styles.moonSub, { color: sky.textSecondary }]}>
            {format(strings.illuminated, { n: Math.round(Number(today.moonIllumination) || 0) })}
          </Text>
        </View>
      </View>
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
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    marginBottom: 8,
  },
  arcWrap: {
    height: 96,
  },
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
  moonText: {
    flex: 1,
  },
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
