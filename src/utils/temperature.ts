/** Temperature ordering helpers driven by the user's unit-order preference. */

import type { TempOrder } from '@/state/settings';
import { kphToMph, mmToIn } from '@/utils/units';

export interface OrderedTemp {
  primaryValue: number;
  primaryUnit: 'C' | 'F';
  secondaryValue: number;
  secondaryUnit: 'C' | 'F';
}

/** Resolve a °C/°F pair into primary/secondary per the chosen order. */
export function orderTemp(c: number, f: number, order: TempOrder): OrderedTemp {
  return order === 'FC'
    ? { primaryValue: f, primaryUnit: 'F', secondaryValue: c, secondaryUnit: 'C' }
    : { primaryValue: c, primaryUnit: 'C', secondaryValue: f, secondaryUnit: 'F' };
}

/** "19°C · 66°F" (or reversed), with unit letters. */
export function dualInline(c: number, f: number, order: TempOrder): string {
  const t = orderTemp(c, f, order);
  return `${t.primaryValue}°${t.primaryUnit}  ·  ${t.secondaryValue}°${t.secondaryUnit}`;
}

/** "19°/66°" (or reversed), no unit letters — for compact pairs. */
export function dualSlash(c: number, f: number, order: TempOrder): string {
  const t = orderTemp(c, f, order);
  return `${t.primaryValue}°/${t.secondaryValue}°`;
}

export interface OrderedWind {
  primaryValue: number;
  primaryUnit: 'km/h' | 'mph';
  secondaryValue: number;
  secondaryUnit: 'km/h' | 'mph';
}

/**
 * Wind speed as a km/h + mph pair, ordered to follow the temperature unit
 * order: km/h first when °C leads (CF), mph first when °F leads (FC).
 */
export function orderWind(kph: number, order: TempOrder): OrderedWind {
  const km = { value: Math.round(kph), unit: 'km/h' as const };
  const mi = { value: Math.round(kphToMph(kph)), unit: 'mph' as const };
  return order === 'FC'
    ? { primaryValue: mi.value, primaryUnit: mi.unit, secondaryValue: km.value, secondaryUnit: km.unit }
    : { primaryValue: km.value, primaryUnit: km.unit, secondaryValue: mi.value, secondaryUnit: mi.unit };
}

/**
 * Precipitation as "4.3 mm · 0.17 in" (or reversed for FC), following the same
 * metric-first-when-°C-leads rule as wind.
 */
export function precipDual(mm: number, order: TempOrder): string {
  const metric = `${mm.toFixed(1)} mm`;
  const imperial = `${mmToIn(mm).toFixed(2)} in`;
  return order === 'FC' ? `${imperial} · ${metric}` : `${metric} · ${imperial}`;
}
