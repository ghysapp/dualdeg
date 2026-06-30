/**
 * User settings: temperature unit order and UI language. Persisted to
 * AsyncStorage and exposed app-wide via {@link useSettings}.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { loadJson, saveJson } from '@/services/cache';
import {
  IAP_STRINGS,
  PERMISSION_STRINGS,
  RTL_LANGUAGES,
  TRANSLATIONS,
  type FullStrings,
  type LanguageCode,
} from '@/i18n/translations';

/** Which unit is shown first / as primary. */
export type TempOrder = 'CF' | 'FC';

const STORAGE_KEY = 'dualdeg:settings';

interface PersistedSettings {
  tempOrder: TempOrder;
  language: LanguageCode;
}

const DEFAULTS: PersistedSettings = { tempOrder: 'CF', language: 'en' };

interface SettingsContextValue {
  tempOrder: TempOrder;
  language: LanguageCode;
  setTempOrder: (order: TempOrder) => void;
  setLanguage: (lang: LanguageCode) => void;
  /** Resolved strings for the current language (UI + permission strings). */
  strings: FullStrings;
  isRTL: boolean;
  /** True once persisted settings have been read (avoids a flash of defaults). */
  ready: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PersistedSettings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadJson<PersistedSettings>(STORAGE_KEY, DEFAULTS).then((s) => {
      setSettings({ ...DEFAULTS, ...s });
      setReady(true);
    });
  }, []);

  const update = useCallback((patch: Partial<PersistedSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveJson(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const setTempOrder = useCallback((tempOrder: TempOrder) => update({ tempOrder }), [update]);
  const setLanguage = useCallback((language: LanguageCode) => update({ language }), [update]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      tempOrder: settings.tempOrder,
      language: settings.language,
      setTempOrder,
      setLanguage,
      strings: {
        ...(TRANSLATIONS[settings.language] ?? TRANSLATIONS.en),
        ...(PERMISSION_STRINGS[settings.language] ?? PERMISSION_STRINGS.en),
        ...(IAP_STRINGS[settings.language] ?? IAP_STRINGS.en),
      },
      isRTL: RTL_LANGUAGES.includes(settings.language),
      ready,
    }),
    [settings, setTempOrder, setLanguage, ready],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
