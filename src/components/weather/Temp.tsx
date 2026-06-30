/**
 * Temperature display helpers that render the °C/°F unit as a superscript,
 * matching the hero's treatment. Used everywhere a temperature is shown.
 */

import { StyleSheet, Text, View } from 'react-native';

import type { TempOrder } from '@/state/settings';
import { Font } from '@/theme/fonts';
import { orderTemp } from '@/utils/temperature';

interface Base {
  size: number;
  color: string;
  weight?: string;
  opacity?: number;
}

function supSize(size: number): number {
  return Math.max(8, Math.round(size * 0.5));
}
function supOffset(size: number): number {
  return Math.max(1, Math.round(size * 0.13));
}

/** A single temperature, e.g. 21° with a superscript C/F. */
export function Temp({
  value,
  unit,
  size,
  color,
  weight = Font.tightSemibold,
  opacity = 1,
}: Base & { value: number; unit: 'C' | 'F' }) {
  return (
    <View style={styles.row}>
      <Text style={{ fontFamily: weight, fontSize: size, color, opacity, includeFontPadding: false }}>
        {value}°
      </Text>
      <Text
        style={{
          fontFamily: weight,
          fontSize: supSize(size),
          color,
          opacity,
          includeFontPadding: false,
          marginLeft: 1,
          marginTop: supOffset(size),
        }}
      >
        {unit}
      </Text>
    </View>
  );
}

/** A °C/°F pair (same reading in both units), e.g. 21°C / 70°F. */
export function TempDual({
  c,
  f,
  order,
  size,
  color,
  weight = Font.tightSemibold,
  opacity = 1,
}: Base & { c: number; f: number; order: TempOrder }) {
  const t = orderTemp(c, f, order);
  return (
    <View style={styles.rowCenter}>
      <Temp value={t.primaryValue} unit={t.primaryUnit} size={size} color={color} weight={weight} opacity={opacity} />
      <Text
        style={{ fontFamily: weight, fontSize: size, color, opacity, includeFontPadding: false, marginHorizontal: 3 }}
      >
        /
      </Text>
      <Temp value={t.secondaryValue} unit={t.secondaryUnit} size={size} color={color} weight={weight} opacity={opacity} />
    </View>
  );
}

/** A high/low range in a single unit, e.g. 22°/13° with a superscript C. */
export function TempRange({
  hi,
  lo,
  unit,
  size,
  color,
  weight = Font.tightSemibold,
  opacity = 1,
}: Base & { hi: number; lo: number; unit: 'C' | 'F' }) {
  return (
    <View style={styles.row}>
      <Text style={{ fontFamily: weight, fontSize: size, color, opacity, includeFontPadding: false }}>
        {hi}°/{lo}°
      </Text>
      <Text
        style={{
          fontFamily: weight,
          fontSize: supSize(size),
          color,
          opacity,
          includeFontPadding: false,
          marginLeft: 1,
          marginTop: supOffset(size),
        }}
      >
        {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
});
