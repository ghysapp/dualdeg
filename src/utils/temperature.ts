/** Temperature ordering helpers driven by the user's unit-order preference. */

import type { TempOrder } from '@/state/settings';

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
