/**
 * Neutral light/dark palette shared by the settings-family screens (Settings,
 * Cities, Language) so they read as one cohesive surface, distinct from the
 * weather screens' adaptive "sky" theme.
 */

import { useColorScheme } from 'react-native';

export interface SettingsPalette {
  bg: string;
  surface: string;
  border: string;
  text: string;
  subtext: string;
  accent: string;
  selectedBg: string;
  danger: string;
  /** Drag-handle glyph tint. */
  handle: string;
}

const PALETTES: Record<'light' | 'dark', SettingsPalette> = {
  light: {
    bg: '#f4f6fa', surface: '#ffffff', border: '#e3e7ee', text: '#1c2433',
    subtext: '#6b7280', accent: '#2f7ad6', selectedBg: '#e9f1fc',
    danger: '#d14343', handle: '#b6becb',
  },
  dark: {
    bg: '#0e1422', surface: '#172033', border: '#26324a', text: '#eef2f9',
    subtext: '#94a1b8', accent: '#5fa3ec', selectedBg: '#1b2a44',
    danger: '#e2706f', handle: '#5a6782',
  },
};

export function useSettingsPalette(): SettingsPalette {
  const scheme = useColorScheme();
  return PALETTES[scheme === 'dark' ? 'dark' : 'light'];
}
