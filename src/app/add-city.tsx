import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MAX_SAVED_CITIES } from '@/config';
import { format } from '@/i18n/translations';
import { searchCities, WeatherApiError, type CitySearchResult } from '@/services/weatherApi';
import { useLocations, type TabInfo } from '@/state/locations';
import { useSettings } from '@/state/settings';
import { Font } from '@/theme/fonts';

// Standalone neutral palette for the modal (follows OS light/dark).
const PALETTES = {
  light: {
    bg: '#f4f6fa',
    surface: '#ffffff',
    border: '#e3e7ee',
    text: '#1c2433',
    subtext: '#6b7280',
    accent: '#2f7ad6',
    danger: '#d14343',
    inputBg: '#ffffff',
  },
  dark: {
    bg: '#0e1422',
    surface: '#172033',
    border: '#26324a',
    text: '#eef2f9',
    subtext: '#94a1b8',
    accent: '#5fa3ec',
    danger: '#e2706f',
    inputBg: '#11192a',
  },
} as const;

type Palette = (typeof PALETTES)['light'] | (typeof PALETTES)['dark'];

export default function AddCityScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const c = PALETTES[scheme === 'dark' ? 'dark' : 'light'];

  const { tabs, addCity, removeCity, isSaved, canAddMore } = useLocations();
  const { strings } = useSettings();
  const savedCities = tabs.filter((t) => !t.isCurrent);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reqId = useRef(0);

  // Debounced search — synchronizes UI state with the WeatherAPI search service.
  /* eslint-disable react-hooks/set-state-in-effect -- debounced external search */
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      setError(null);
      return;
    }
    const id = ++reqId.current;
    setSearching(true);
    const handle = setTimeout(async () => {
      try {
        const res = await searchCities(q);
        if (reqId.current === id) {
          setResults(res);
          setError(null);
        }
      } catch (err) {
        if (reqId.current === id) {
          setError(err instanceof WeatherApiError ? err.message : strings.searchFailed);
          setResults([]);
        }
      } finally {
        if (reqId.current === id) setSearching(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [query, strings]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const onAdd = async (city: CitySearchResult) => {
    const ok = await addCity(city);
    if (!ok) return; // at capacity
  };

  return (
    <View style={[styles.root, { backgroundColor: c.bg }]}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.text }]}>{strings.addCity}</Text>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Text style={[styles.done, { color: c.accent }]}>{strings.done}</Text>
          </Pressable>
        </View>

        <View style={[styles.searchBox, { backgroundColor: c.inputBg, borderColor: c.border }]}>
          <Text style={{ color: c.subtext }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={strings.searchCity}
            placeholderTextColor={c.subtext}
            autoFocus
            autoCorrect={false}
            returnKeyType="search"
            style={[styles.input, { color: c.text }]}
          />
          {searching && <ActivityIndicator size="small" color={c.subtext} />}
        </View>

        {!canAddMore && (
          <Text style={[styles.capacity, { color: c.subtext }]}>
            {format(strings.capacity, { n: MAX_SAVED_CITIES })}
          </Text>
        )}
        {error && <Text style={[styles.capacity, { color: c.danger }]}>{error}</Text>}

        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            savedCities.length > 0 && query.trim().length < 2 ? (
              <Text style={[styles.sectionLabel, { color: c.subtext }]}>
                {strings.savedSection.toUpperCase()}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            query.trim().length < 2 ? (
              <SavedList
                cities={savedCities}
                colors={c}
                onRemove={removeCity}
              />
            ) : !searching ? (
              <Text style={[styles.empty, { color: c.subtext }]}>{strings.noMatches}</Text>
            ) : null
          }
          renderItem={({ item }) => {
            const saved = isSaved(item.id);
            const disabled = saved || !canAddMore;
            return (
              <Pressable
                onPress={() => onAdd(item)}
                disabled={disabled}
                style={[
                  styles.row,
                  { backgroundColor: c.surface, borderColor: c.border, opacity: disabled && !saved ? 0.5 : 1 },
                ]}
              >
                <View style={styles.rowText}>
                  <Text style={[styles.cityName, { color: c.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.citySub, { color: c.subtext }]} numberOfLines={1}>
                    {[item.region, item.country].filter(Boolean).join(', ')}
                  </Text>
                </View>
                <Text style={[styles.action, { color: saved ? c.subtext : c.accent }]}>
                  {saved ? `✓ ${strings.added}` : '＋'}
                </Text>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
}

function SavedList({
  cities,
  colors,
  onRemove,
}: {
  cities: TabInfo[];
  colors: Palette;
  onRemove: (id: number) => void;
}) {
  const { strings } = useSettings();
  if (cities.length === 0) {
    return (
      <Text style={[styles.empty, { color: colors.subtext }]}>{strings.searchPrompt}</Text>
    );
  }
  return (
    <View style={{ gap: 8 }}>
      {cities.map((t) => {
        if (t.ref.kind !== 'city') return null;
        const city = t.ref.city;
        return (
          <View
            key={t.key}
            style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.rowText}>
              <Text style={[styles.cityName, { color: colors.text }]} numberOfLines={1}>
                {t.label}
              </Text>
              <Text style={[styles.citySub, { color: colors.subtext }]} numberOfLines={1}>
                {[city.region, city.country].filter(Boolean).join(', ')}
              </Text>
            </View>
            <Pressable onPress={() => onRemove(city.id)} hitSlop={10}>
              <Text style={[styles.action, { color: colors.danger }]}>{strings.remove}</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontFamily: Font.tightBold,
    fontSize: 22,
  },
  done: {
    fontFamily: Font.semibold,
    fontSize: 15,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontFamily: Font.medium,
    fontSize: 15,
    padding: 0,
  },
  capacity: {
    fontFamily: Font.medium,
    fontSize: 12,
    marginHorizontal: 20,
    marginTop: 10,
    lineHeight: 18,
  },
  list: {
    padding: 20,
    gap: 8,
  },
  sectionLabel: {
    fontFamily: Font.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowText: {
    flex: 1,
  },
  cityName: {
    fontFamily: Font.semibold,
    fontSize: 15,
  },
  citySub: {
    fontFamily: Font.regular,
    fontSize: 12,
    marginTop: 2,
  },
  action: {
    fontFamily: Font.semibold,
    fontSize: 15,
  },
  empty: {
    fontFamily: Font.medium,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
  },
});
