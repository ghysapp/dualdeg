/**
 * Shared sun-arc + moon-disc primitives, used by both the main screen's
 * {@link SunMoonSection} (live: sun placed at "now" along the day's path) and
 * the day-detail screen (static: the full daylight arc with the sun at its
 * apex, since "now" isn't on a future day).
 */

import { View } from 'react-native';
import Svg, { Circle, G, Line, Path } from 'react-native-svg';

import Moon from '@/assets/moon.svg';
import type { SkyTheme } from '@/theme/sky';

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Moon-phase shadow: a soft, semi-transparent veil (so the globe's detail still
// reads through it) drawn slightly larger than the disc and clipped to the
// moon's circular edge, so the shadowed limb is covered cleanly to the rim.
const MOON_SHADOW_FILL = 'rgba(12,17,38,0.74)';
const MOON_SHADOW_SCALE = 0.94;

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

export function MoonDisc({
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

  // The shadow disc is drawn a touch larger than the moon; the container clips
  // it back to the circular rim, so it always meets the moon's edge cleanly.
  const shadowR = R * MOON_SHADOW_SCALE;
  const shadowCanvas = size * MOON_SHADOW_SCALE;
  const shadowInset = -(shadowCanvas - size) / 2;
  const shadow = litPath(shadowR, 1 - frac);

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
          style={{ position: 'absolute', left: shadowInset, top: shadowInset }}
          width={shadowCanvas}
          height={shadowCanvas}
          viewBox={`${-shadowR} ${-shadowR} ${shadowCanvas} ${shadowCanvas}`}
        >
          <G transform={!waning ? 'scale(-1,1)' : undefined}>
            <Path d={shadow} fill={MOON_SHADOW_FILL} />
          </G>
        </Svg>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Sun arc — sun positioned along the day's path between sunrise and sunset.
// ---------------------------------------------------------------------------

export function SunArc({
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
  /** Minutes since local midnight for "now"; null → static full-arc (a future day). */
  nowMin: number | null;
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

  const P0 = { x: x0, y: horizonY };
  const Pc = { x: cxX, y: ctrlY };
  const P1 = { x: x1, y: horizonY };
  const fullArc = `M ${P0.x} ${P0.y} Q ${Pc.x} ${Pc.y} ${P1.x} ${P1.y}`;

  // Static mode (future day): draw the whole daylight arc solid with the sun
  // resting at its apex — no elapsed/remaining split.
  if (nowMin == null) {
    const apex = { x: cxX, y: (P0.y + 2 * Pc.y + P1.y) / 4 }; // Bézier midpoint (t=0.5)
    return (
      <Svg width={width} height={H}>
        <Line
          x1={padX - 6}
          y1={horizonY}
          x2={width - padX + 6}
          y2={horizonY}
          stroke={sky.divider}
          strokeWidth={1.5}
        />
        <Path
          d={fullArc}
          fill="none"
          stroke={sky.textPrimary}
          strokeOpacity={0.7}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <Circle cx={apex.x} cy={apex.y} r={13} fill="#ffce5a" opacity={0.25} />
        <Circle cx={apex.x} cy={apex.y} r={7} fill="#ffce5a" />
      </Svg>
    );
  }

  const isDay = nowMin >= sunriseMin && nowMin <= sunsetMin;
  const p = clamp((nowMin - sunriseMin) / dayLen, 0, 1);

  // Split the quadratic Bézier at t=p (De Casteljau) for elapsed / remaining.
  const A = { x: lerp(P0.x, Pc.x, p), y: lerp(P0.y, Pc.y, p) };
  const B = { x: lerp(Pc.x, P1.x, p), y: lerp(Pc.y, P1.y, p) };
  const S = { x: lerp(A.x, B.x, p), y: lerp(A.y, B.y, p) };

  const elapsed = `M ${P0.x} ${P0.y} Q ${A.x} ${A.y} ${S.x} ${S.y}`;
  const remaining = `M ${S.x} ${S.y} Q ${B.x} ${B.y} ${P1.x} ${P1.y}`;

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
