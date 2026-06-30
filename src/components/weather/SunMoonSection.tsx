import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';

import Moon from '@/assets/moon.svg';
import { format, localizedMoonPhase } from '@/i18n/translations';
import type { WeatherData } from '@/services/weatherApi';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';
import type { SkyTheme } from '@/theme/sky';
import { timeToMinutes, to24h } from '@/utils/time';

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------------------------------------------------------------------------
// Moon phase disc — an accurately-lit circle (terminator is a half-ellipse).
// ---------------------------------------------------------------------------

/** Path for the lit region, oriented lit-on-the-right (waxing). */
function litPath(R: number, illum: number): string {
  const t = R * (1 - 2 * illum); // signed semi-x of the terminator ellipse
  const rx = Math.max(Math.abs(t), 0.0001);
  const sweep = t > 0 ? 0 : 1;
  return `M 0 ${-R} A ${R} ${R} 0 0 1 0 ${R} A ${rx} ${R} 0 0 ${sweep} 0 ${-R} Z`;
}

function MoonDisc({
  size,
  illumination,
  waning,
}: {
  size: number;
  illumination: number; // 0..100
  waning: boolean;
}) {
  const R = size / 2;
  const frac = clamp(Number(illumination) / 100, 0, 1);
  // The shadowed region is the complement of the lit region: a slice of
  // "fraction" (1 - frac) on the opposite side. Darken it over the artwork to
  // render the current phase while keeping the moon's detail visible (earthshine).
  // Skip it when essentially full — a Full Moon should read as evenly lit.
  const showShadow = frac < 0.97;
  const shadow = litPath(R, 1 - frac);

  // The globe artwork is slightly larger than the clip circle so its shaded
  // outer limb is cropped (avoids a stray dark arc at the edge).
  const zoom = size * 1.14;
  const inset = -(zoom - size) / 2;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: R,
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      <Moon
        width={zoom}
        height={zoom}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', left: inset, top: inset }}
      />
      {showShadow && (
        <Svg
          style={StyleSheet.absoluteFill}
          width={size}
          height={size}
          viewBox={`${-R} ${-R} ${size} ${size}`}
        >
          <G transform={!waning ? 'scale(-1,1)' : undefined}>
            <Path d={shadow} fill="rgba(6,10,26,0.82)" />
          </G>
        </Svg>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Sun arc — sun positioned along the day's path between sunrise and sunset.
// ---------------------------------------------------------------------------

function SunArc({
  width,
  sky,
  sunriseMin,
  sunsetMin,
  nowMin,
}: {
  width: number;
  sky: SkyTheme;
  sunriseMin: number;
  sunsetMin: number;
  nowMin: number;
}) {
  const H = 96;
  const padX = 26;
  const horizonY = 70;
  const peakY = 16;

  const x0 = padX;
  const x1 = width - padX;
  const cxX = width / 2;
  const ctrlY = 2 * peakY - horizonY; // makes the curve peak at peakY

  const dayLen = Math.max(sunsetMin - sunriseMin, 1);
  const isDay = nowMin >= sunriseMin && nowMin <= sunsetMin;
  const p = clamp((nowMin - sunriseMin) / dayLen, 0, 1);

  // Split the quadratic Bézier at t=p (De Casteljau) for elapsed / remaining.
  const P0 = { x: x0, y: horizonY };
  const Pc = { x: cxX, y: ctrlY };
  const P1 = { x: x1, y: horizonY };
  const A = { x: lerp(P0.x, Pc.x, p), y: lerp(P0.y, Pc.y, p) };
  const B = { x: lerp(Pc.x, P1.x, p), y: lerp(Pc.y, P1.y, p) };
  const S = { x: lerp(A.x, B.x, p), y: lerp(A.y, B.y, p) };

  const elapsed = `M ${P0.x} ${P0.y} Q ${A.x} ${A.y} ${S.x} ${S.y}`;
  const remaining = `M ${S.x} ${S.y} Q ${B.x} ${B.y} ${P1.x} ${P1.y}`;
  const fullArc = `M ${P0.x} ${P0.y} Q ${Pc.x} ${Pc.y} ${P1.x} ${P1.y}`;

  const sunPos = isDay ? S : nowMin < sunriseMin ? P0 : P1;
  const sunColor = isDay ? '#ffce5a' : 'rgba(255,206,90,0.45)';

  return (
    <Svg width={width} height={H}>
      {/* horizon */}
      <Line
        x1={padX - 6}
        y1={horizonY}
        x2={width - padX + 6}
        y2={horizonY}
        stroke={sky.divider}
        strokeWidth={1.5}
      />
      {/* remaining path (dashed, faint) */}
      <Path
        d={isDay ? remaining : fullArc}
        fill="none"
        stroke={sky.textSecondary}
        strokeOpacity={0.5}
        strokeWidth={2}
        strokeDasharray="2 5"
        strokeLinecap="round"
      />
      {/* elapsed path (solid) */}
      {isDay && (
        <Path
          d={elapsed}
          fill="none"
          stroke={sky.textPrimary}
          strokeOpacity={0.8}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      )}
      {/* sun glow + body */}
      <Circle cx={sunPos.x} cy={sunPos.y} r={13} fill={sunColor} opacity={0.25} />
      <Circle cx={sunPos.x} cy={sunPos.y} r={7} fill={sunColor} />
    </Svg>
  );
}

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
