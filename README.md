# Weather

A small Expo (SDK 56) weather app built around [WeatherAPI.com](https://www.weatherapi.com/).
The UI is a faithful implementation of a Claude Design mockup: a horizontal tab
strip (your current location + saved cities), a temperature hero, a 6-metric
grid, a horizontal hourly scroll and a multi-day outlook. The whole screen
recolors itself by **time of day + weather condition** — daylight (light),
golden hour (warm) and night (dark) — which doubles as the light/dark theme.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Add your WeatherAPI key**

   Get a free key at https://www.weatherapi.com/signup.aspx (the free plan
   covers current conditions, a 3-day forecast, astronomy and city search).

   Copy the example env file and paste your key in:

   ```bash
   cp .env.example .env
   # then edit .env and set EXPO_PUBLIC_WEATHERAPI_KEY=...
   ```

   > Env vars are inlined at bundle time, so **restart `expo start`** after
   > changing `.env`. Until a real key is set, the app shows a friendly
   > "Add your API key" notice.

3. **Run it**

   ```bash
   npx expo start
   ```

   Open in an iOS simulator, Android emulator, or Expo Go.

## How it works

### Data & caching

- `src/services/weatherApi.ts` — typed client for `/forecast.json` (current +
  hourly + multi-day + astronomy) and `/search.json` (city autocomplete). The
  raw response is normalized into a lean model the UI consumes.
- `src/services/cache.ts` — a small TTL cache over `AsyncStorage`.
- `src/state/locations.tsx` — owns the current location, the saved cities, and
  the per-location weather cache. Refresh policy:
  - **Current location** refreshes if its cache is older than **60 minutes**.
  - **Saved cities** refresh if older than **6 hours**.

  Fresh-enough data is served instantly with no network call. Stale data is
  shown immediately while a refresh runs underneath, and a failed refresh falls
  back to the last good data. Pull-to-refresh forces a fetch.

### Locations

- The first tab is always **Current** (uses `expo-location`; permission is
  requested on first launch).
- Up to **4 saved cities** can be added from the search modal (`+ Add` chip →
  `src/app/add-city.tsx`). They are persisted on device and editable
  (search / add / remove).

### Adaptive theme

`src/theme/sky.ts` resolves one of four palettes from each location's local
time, sunrise/sunset and current condition: `day`, `overcast`, `golden`,
`night`. Every component is themed from the resolved palette, so switching tabs
between e.g. a sunny city and one where it's night swaps the entire look.

## Project structure

```
src/
  app/                 # expo-router screens
    _layout.tsx        # fonts + providers + stack
    index.tsx          # main weather screen
    add-city.tsx       # search/add/remove cities (modal)
  components/weather/  # SkyBackground, TabStrip, WeatherHero,
                       # MetricGrid, HourlyStrip, DailyOutlook
  services/            # weatherApi.ts, cache.ts
  state/               # locations.tsx (context)
  theme/               # sky.ts, icons.ts, fonts.ts
  config.ts            # API key + TTL + limits
```

## Scripts

```bash
npm run start      # expo start
npm run ios        # expo start --ios
npm run android    # expo start --android
npm run web        # expo start --web
npm run lint       # expo lint
npx tsc --noEmit   # typecheck
```
