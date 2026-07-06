/**
 * Locations + weather state.
 *
 * Owns:
 *   - the current location: GPS when permission is granted, otherwise an
 *     approximate location derived from the caller's IP (GeoIP). The OS
 *     permission prompt is never shown on launch directly — a custom priming
 *     dialog precedes it (see `primingVisible` / `primingNext`).
 *   - the user's saved cities (persisted, max {@link MAX_SAVED_CITIES})
 *   - a per-location weather cache with TTL-driven refresh:
 *       current → {@link CACHE_TTL.current} (60 min)
 *       saved   → {@link CACHE_TTL.saved}   (6 h)
 *
 * Fresh-enough cache is served instantly; stale entries refetch in the
 * background and fall back to the stale value if the network fails.
 */

import * as Location from 'expo-location';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState, Linking } from 'react-native';

import { CACHE_TTL, MAX_SAVED_CITIES } from '@/config';
import { type LanguageCode } from '@/i18n/translations';
import { loadJson, readCache, removeCache, saveJson, writeCache } from '@/services/cache';
import { getZipcodeFromIP } from '@/services/geoip';
import { fetchWeather } from '@/services/weather';
import {
  WeatherApiError,
  type CitySearchResult,
  type WeatherData,
} from '@/services/weatherApi';
import { useSettings } from '@/state/settings';

const CITIES_KEY = 'dualdeg:cities';

export interface SavedCity {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

export type LocationRef =
  | { kind: 'current' }
  | { kind: 'city'; city: SavedCity };

export type EntryStatus = 'idle' | 'loading' | 'success' | 'error';

/** Mirrors expo-location's PermissionStatus, plus an initial 'unknown'. */
export type LocationPermission = 'granted' | 'denied' | 'undetermined' | 'unknown';

export interface WeatherEntry {
  status: EntryStatus;
  data?: WeatherData;
  error?: string;
  fetchedAt?: number;
  /** True while a background refresh runs over already-shown data. */
  refreshing: boolean;
}

export interface TabInfo {
  key: string;
  label: string;
  ref: LocationRef;
  isCurrent: boolean;
}

interface LocationsContextValue {
  tabs: TabInfo[];
  selectedIndex: number;
  selectTab: (index: number) => void;
  entryFor: (ref: LocationRef) => WeatherEntry;
  refresh: (ref: LocationRef, force?: boolean) => void;
  addCity: (city: CitySearchResult) => Promise<boolean>;
  removeCity: (id: number) => void;
  isSaved: (id: number) => boolean;
  canAddMore: boolean;
  /** Foreground location permission status. */
  permission: LocationPermission;
  /** True when the current tab is using an IP-derived approximate location. */
  approximate: boolean;
  /** Whether the custom pre-permission dialog is showing. */
  primingVisible: boolean;
  /** Dialog "Next" → proceeds to the OS prompt, then GPS or approximate. */
  primingNext: () => void;
  /** Dialog dismiss (Android only) → falls back to approximate location. */
  primingDismiss: () => void;
  /** Banner / re-request: opens Settings if denied, else re-shows the dialog. */
  enableLocation: () => void;
}

const LocationsContext = createContext<LocationsContextValue | null>(null);

const IDLE: WeatherEntry = { status: 'idle', refreshing: false };

// Bump when the cached WeatherData shape changes, to invalidate old entries.
const CACHE_VERSION = 'v3';

// Pull-to-refresh is ignored if the location was fetched within this window.
const MANUAL_REFRESH_COOLDOWN = 5 * 60 * 1000;

// Cache is scoped by language, since condition text is localized server-side.
function cacheKey(ref: LocationRef, lang: LanguageCode): string {
  const base = ref.kind === 'current' ? 'current' : `city:${ref.city.id}`;
  return `wx:${CACHE_VERSION}:${lang}:${base}`;
}

function ttlFor(ref: LocationRef): number {
  return ref.kind === 'current' ? CACHE_TTL.current : CACHE_TTL.saved;
}

export function LocationsProvider({ children }: { children: ReactNode }) {
  const { language, strings } = useSettings();
  const [cities, setCities] = useState<SavedCity[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [entries, setEntries] = useState<Record<string, WeatherEntry>>({});

  // The current-tab query: "lat,lon" (GPS) or a postal code (GeoIP), or null.
  const [currentQuery, setCurrentQuery] = useState<string | null>(null);
  const [approximate, setApproximate] = useState(false);
  const [permission, setPermission] = useState<LocationPermission>('unknown');
  const [primingVisible, setPrimingVisible] = useState(false);

  // De-dupes concurrent fetches per location. Read only inside callbacks.
  const inFlight = useRef<Set<string>>(new Set());

  const setEntry = useCallback((key: string, patch: Partial<WeatherEntry>) => {
    setEntries((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? IDLE), ...patch },
    }));
  }, []);

  // --- Persisted cities --------------------------------------------------
  useEffect(() => {
    loadJson<SavedCity[]>(CITIES_KEY, []).then(setCities);
  }, []);

  const persistCities = useCallback((next: SavedCity[]) => {
    setCities(next);
    saveJson(CITIES_KEY, next);
  }, []);

  // --- Fetch / cache orchestration ---------------------------------------
  const ensureFresh = useCallback(
    async (ref: LocationRef, force = false, currentQueryOverride?: string | null) => {
      const key = cacheKey(ref, language);
      if (inFlight.current.has(key)) return;

      const query =
        ref.kind === 'city'
          ? `id:${ref.city.id}`
          : currentQueryOverride !== undefined
            ? currentQueryOverride
            : currentQuery;
      // No query yet (current location still resolving, or unavailable). The
      // error state for an unavailable location is set explicitly by the
      // caller (acquireApproximate) so we don't flash it during resolution.
      if (!query) return;

      // Serve fresh cache without hitting the network.
      if (!force) {
        const cached = await readCache<WeatherData>(key);
        if (cached && cached.age < ttlFor(ref)) {
          setEntry(key, {
            status: 'success',
            data: cached.value,
            fetchedAt: cached.fetchedAt,
            error: undefined,
            refreshing: false,
          });
          return;
        }
        if (cached) {
          // Stale cache: show it immediately, refresh underneath.
          setEntry(key, {
            status: 'success',
            data: cached.value,
            fetchedAt: cached.fetchedAt,
            refreshing: true,
          });
        }
      }

      setEntries((prev) => {
        const ex = prev[key];
        return {
          ...prev,
          [key]: ex?.data
            ? { ...ex, refreshing: true }
            : { status: 'loading', refreshing: false },
        };
      });

      // Route to NWS (US) or WeatherAPI: cities carry a country; the current
      // tab passes its "lat,lon" so US coords can be detected offline.
      let coords: { lat: number; lon: number } | null = null;
      let country: string | null = null;
      let place: string | null = null;
      if (ref.kind === 'city') {
        coords = { lat: ref.city.lat, lon: ref.city.lon };
        country = ref.city.country;
        place = ref.city.name;
      } else {
        const m = /^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/.exec(query.trim());
        if (m) coords = { lat: Number(m[1]), lon: Number(m[2]) };
      }

      inFlight.current.add(key);
      try {
        const data = await fetchWeather({ query, coords, country, place, language });
        if (__DEV__ && ref.kind === 'current') {
          console.log(
            `[loc] query="${query}" -> "${data.location.name}" ` +
              `(${data.location.lat},${data.location.lon})`,
          );
        }
        await writeCache(key, data);
        setEntry(key, {
          status: 'success',
          data,
          fetchedAt: Date.now(),
          error: undefined,
          refreshing: false,
        });
      } catch (err) {
        const message = err instanceof WeatherApiError ? err.message : strings.loadError;
        setEntries((prev) => {
          const ex = prev[key];
          return {
            ...prev,
            [key]: {
              ...(ex ?? IDLE),
              status: ex?.data ? 'success' : 'error',
              error: message,
              refreshing: false,
            },
          };
        });
      } finally {
        inFlight.current.delete(key);
      }
    },
    [language, strings, setEntry, currentQuery],
  );

  // --- Location sources --------------------------------------------------
  /** Approximate location from IP. Used when GPS isn't available/granted. */
  const acquireApproximate = useCallback(async () => {
    const zip = await getZipcodeFromIP();
    if (zip) {
      setApproximate(true);
      setCurrentQuery(zip);
      ensureFresh({ kind: 'current' }, true, zip);
    } else {
      setApproximate(false);
      setCurrentQuery(null);
      setEntry(cacheKey({ kind: 'current' }, language), {
        status: 'error',
        error: strings.locationError,
        refreshing: false,
      });
    }
  }, [ensureFresh, setEntry, language, strings]);

  /** Precise location from device GPS (permission must already be granted). */
  const acquireGps = useCallback(async () => {
    const apply = (lat: number, lon: number) => {
      const q = `${lat},${lon}`;
      setApproximate(false);
      setCurrentQuery(q);
      ensureFresh({ kind: 'current' }, true, q);
    };

    let got = false;

    // 1. Instant last-known fix — usually accurate and avoids the indoor case
    //    where a fresh GPS fix can't be obtained (and would otherwise drop us to
    //    the inaccurate IP location).
    try {
      const last = await Location.getLastKnownPositionAsync({ maxAge: 10 * 60 * 1000 });
      if (last) {
        if (__DEV__) {
          console.log(
            `[loc] lastKnown lat=${last.coords.latitude} lon=${last.coords.longitude} acc=${last.coords.accuracy}m`,
          );
        }
        apply(last.coords.latitude, last.coords.longitude);
        got = true;
      }
    } catch {
      // ignore
    }

    // 2. Fresh fix to refine, bounded so an indoor "no fix" can't hang forever.
    try {
      const pos = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
      ]);
      if (__DEV__) {
        console.log(
          `[loc] gpsFix lat=${pos.coords.latitude} lon=${pos.coords.longitude} acc=${pos.coords.accuracy}m`,
        );
      }
      apply(pos.coords.latitude, pos.coords.longitude);
      got = true;
    } catch {
      // ignore — fall through to the approximate fallback only if nothing worked
    }

    // 3. Only use the IP-based approximate location if we got no device fix at all.
    if (!got) await acquireApproximate();
  }, [ensureFresh, acquireApproximate]);

  // --- Permission flow ---------------------------------------------------
  // Resolve the current location once on mount. We check status WITHOUT
  // prompting; the OS prompt only appears after the user taps "Next" in the
  // custom priming dialog (Apple 5.1.1 / Google Play prominent disclosure).
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    (async () => {
      setEntry(cacheKey({ kind: 'current' }, language), { status: 'loading', refreshing: false });
      const perm = await Location.getForegroundPermissionsAsync();
      setPermission(perm.status as LocationPermission);
      if (perm.status === 'granted') {
        await acquireGps();
      } else if (perm.status === 'undetermined') {
        setPrimingVisible(true);
      } else {
        await acquireApproximate();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const primingNext = useCallback(async () => {
    setPrimingVisible(false);
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermission(status as LocationPermission);
    if (status === 'granted') await acquireGps();
    else await acquireApproximate();
  }, [acquireGps, acquireApproximate]);

  const primingDismiss = useCallback(() => {
    setPrimingVisible(false);
    acquireApproximate();
  }, [acquireApproximate]);

  const enableLocation = useCallback(() => {
    // iOS won't re-prompt once denied — only Settings can flip it. When the
    // status is still undetermined, re-show the priming dialog instead.
    if (permission === 'denied') Linking.openSettings();
    else setPrimingVisible(true);
  }, [permission]);

  // If the user grants permission in Settings and returns, upgrade to GPS.
  const recheckPermission = useCallback(async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted' && permission !== 'granted') {
      setPermission('granted');
      await acquireGps();
    }
  }, [permission, acquireGps]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') recheckPermission();
    });
    return () => sub.remove();
  }, [recheckPermission]);

  // --- Tabs --------------------------------------------------------------
  const tabs = useMemo<TabInfo[]>(() => {
    const cityTabs: TabInfo[] = cities.map((city) => ({
      key: `city:${city.id}`,
      label: city.name,
      ref: { kind: 'city', city },
      isCurrent: false,
    }));
    return [
      { key: 'current', label: 'Current', ref: { kind: 'current' }, isCurrent: true },
      ...cityTabs,
    ];
  }, [cities]);

  // Selection is clamped on read, so removing a city never needs a setState fix-up.
  const clampedIndex = Math.min(selectedIndex, tabs.length - 1);
  const activeTab = tabs[clampedIndex];

  // Load the active tab whenever it (or the current query / language) changes.
  useEffect(() => {
    if (!activeTab) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch, not a sync setState
    ensureFresh(activeTab.ref, false);
  }, [activeTab, ensureFresh]);

  // --- Public actions ----------------------------------------------------
  const selectTab = useCallback((index: number) => setSelectedIndex(index), []);

  const entryFor = useCallback(
    (ref: LocationRef) => entries[cacheKey(ref, language)] ?? IDLE,
    [entries, language],
  );

  const refresh = useCallback(
    (ref: LocationRef, force = true) => {
      // Per-location cooldown: ignore a manual refresh if this tab/city was
      // fetched within the last few minutes.
      const key = cacheKey(ref, language);
      const last = entries[key]?.fetchedAt;
      if (last && Date.now() - last < MANUAL_REFRESH_COOLDOWN) {
        if (__DEV__) {
          const secs = Math.round((MANUAL_REFRESH_COOLDOWN - (Date.now() - last)) / 1000);
          console.log(`[wx] refresh blocked for "${key}" — cooldown, ~${secs}s left`);
        }
        return;
      }

      // Pull-to-refresh on the current tab re-acquires the device location
      // (a fresh GPS fix), not just a re-fetch of the last query.
      if (ref.kind === 'current') {
        if (permission === 'granted') acquireGps();
        else acquireApproximate();
        return;
      }
      ensureFresh(ref, force);
    },
    [entries, language, ensureFresh, permission, acquireGps, acquireApproximate],
  );

  const addCity = useCallback(
    async (city: CitySearchResult): Promise<boolean> => {
      if (cities.some((c) => c.id === city.id)) return true;
      if (cities.length >= MAX_SAVED_CITIES) return false;
      const saved: SavedCity = {
        id: city.id,
        name: city.name,
        region: city.region,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
      };
      persistCities([...cities, saved]);
      return true;
    },
    [cities, persistCities],
  );

  const removeCity = useCallback(
    (id: number) => {
      persistCities(cities.filter((c) => c.id !== id));
      const key = cacheKey({ kind: 'city', city: { id } as SavedCity }, language);
      removeCache(key);
      setEntries((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [cities, persistCities, language],
  );

  const isSaved = useCallback((id: number) => cities.some((c) => c.id === id), [cities]);

  const value: LocationsContextValue = {
    tabs,
    selectedIndex: clampedIndex,
    selectTab,
    entryFor,
    refresh,
    addCity,
    removeCity,
    isSaved,
    canAddMore: cities.length < MAX_SAVED_CITIES,
    permission,
    approximate,
    primingVisible,
    primingNext,
    primingDismiss,
    enableLocation,
  };

  return <LocationsContext.Provider value={value}>{children}</LocationsContext.Provider>;
}

export function useLocations(): LocationsContextValue {
  const ctx = useContext(LocationsContext);
  if (!ctx) throw new Error('useLocations must be used within a LocationsProvider');
  return ctx;
}
