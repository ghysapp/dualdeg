import { StyleSheet, Text, View } from 'react-native';

import type { Strings } from '@/i18n/translations';
import type { AirQuality, WeatherData } from '@/services/weatherApi';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import type { SkyTheme } from '@/theme/sky';

/**
 * Air quality and UV, side by side in the row below the 2×2 metric grid.
 *
 * They share a row rather than each claiming a grid tile: five tiles would
 * leave a half-empty row, whereas these two are both "how exposed am I right
 * now" readings and pair naturally. Either one alone stretches to the full
 * width, so the row never looks half-finished — which matters, because
 * coverage genuinely differs (Germany has air quality but no UV; most MET
 * Norway countries have UV but no air quality).
 */
export function AirAndUvRow({ data, sky }: { data: WeatherData; sky: SkyTheme }) {
  const { strings } = useSettings();
  const aq = data.airQuality;
  const uv = data.today.uv;
  // A zero peak means the sun is done for the day (or already down when the
  // provider only forecasts forward, as met.no does) — "UV 0 · Low" is noise,
  // so the card steps aside and air quality takes the width.
  const showUv = uv != null && uv > 0;
  if (!aq && !showUv) return null;

  return (
    <View style={styles.row}>
      {!!aq && <AirQualityCard aq={aq} sky={sky} strings={strings} />}
      {showUv && (
        <UvCard uv={uv} clearSky={!!data.today.uvClearSky} sky={sky} strings={strings} />
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Air quality
// ---------------------------------------------------------------------------

/**
 * Colours for the six severity bands, loosely following the European AQI ramp
 * (which the French ATMO index this app reads already uses). Tuned to stay
 * legible against both the bright and the night sky gradients.
 */
const AQ_COLORS = ['#4FD8C4', '#7BC96F', '#F2C14E', '#F2765C', '#D6455D', '#8E4585'];

/**
 * The severity label leads because it's the part that means the same thing
 * everywhere; the native AQI number is a supporting detail (only the US
 * publishes one users read directly). The source is always shown: these
 * readings come from different national authorities measuring in different
 * ways, and they shouldn't look like the app's own number.
 */
function AirQualityCard({
  aq,
  sky,
  strings,
}: {
  aq: AirQuality;
  sky: SkyTheme;
  strings: Strings;
}) {
  const level = Math.min(6, Math.max(1, Math.round(aq.band)));
  const detail = [aq.source, aq.area, aq.pollutant].filter(Boolean).join(' · ');

  return (
    <Card sky={sky}>
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: sky.textSecondary }]}>
          {strings.airQuality.toUpperCase()}
        </Text>
        {aq.index != null && (
          <Text style={[styles.label, { color: sky.textSecondary }]}>
            AQI {Math.round(aq.index)}
          </Text>
        )}
      </View>

      <View style={styles.valueRow}>
        <View style={[styles.dot, { backgroundColor: AQ_COLORS[level - 1] }]} />
        <Text style={[styles.value, { color: sky.textPrimary }]} numberOfLines={1}>
          {strings.aqBands[level - 1] ?? ''}
        </Text>
      </View>

      <Scale colors={AQ_COLORS} active={level - 1} />

      {!!detail && (
        <Text style={[styles.detail, { color: sky.textSecondary }]} numberOfLines={1}>
          {detail}
        </Text>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// UV
// ---------------------------------------------------------------------------

const UV_COLORS = ['#7BC96F', '#F2C14E', '#F2894E', '#D6455D', '#8E4585'];

/** WHO exposure levels: 0–2 low, 3–5 moderate, 6–7 high, 8–10 very high, 11+ extreme. */
function uvLevel(uv: number): number {
  if (uv <= 2) return 0;
  if (uv <= 5) return 1;
  if (uv <= 7) return 2;
  if (uv <= 10) return 3;
  return 4;
}

/**
 * Here the number leads — unlike air quality indices, the UV index is a single
 * scale people already read directly — with the exposure level as the caption.
 */
function UvCard({
  uv,
  clearSky,
  sky,
  strings,
}: {
  uv: number;
  clearSky: boolean;
  sky: SkyTheme;
  strings: Strings;
}) {
  const level = uvLevel(uv);
  const detail = [strings.uvBands[level], clearSky ? strings.uvClearSky : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card sky={sky}>
      <View style={styles.topRow}>
        <Text style={[styles.label, { color: sky.textSecondary }]}>UV</Text>
      </View>

      <View style={styles.valueRow}>
        <View style={[styles.dot, { backgroundColor: UV_COLORS[level] }]} />
        <Text style={[styles.value, { color: sky.textPrimary }]} numberOfLines={1}>
          {Math.round(uv)}
        </Text>
      </View>

      <Scale colors={UV_COLORS} active={level} />

      <Text style={[styles.detail, { color: sky.textSecondary }]} numberOfLines={1}>
        {detail}
      </Text>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function Card({ sky, children }: { sky: SkyTheme; children: React.ReactNode }) {
  return (
    <View style={[styles.card, { backgroundColor: sky.cardBg, borderColor: sky.cardBorder }]}>
      {children}
    </View>
  );
}

/** Where the reading sits on its scale — one segment per level. */
function Scale({ colors, active }: { colors: string[]; active: number }) {
  return (
    <View style={styles.scale}>
      {colors.map((c, i) => (
        <View
          key={c}
          style={[
            styles.segment,
            { backgroundColor: c, opacity: i === active ? 1 : 0.22, height: i === active ? 6 : 4 },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 11,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: Font.semibold,
    fontSize: 10,
    letterSpacing: 0.4,
    opacity: 0.78,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 3,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  value: {
    fontFamily: Font.tightSemibold,
    fontSize: 17,
    flexShrink: 1,
  },
  scale: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 8,
  },
  segment: {
    flex: 1,
    borderRadius: 3,
  },
  detail: {
    fontFamily: Font.medium,
    fontSize: 10,
    opacity: 0.75,
    marginTop: 7,
  },
});
