# Weather — App Description

> Two parts: **(A)** store-ready marketing copy for App Store Connect / Google
> Play, and **(B)** a technical overview of how the app is built.
> Everything here reflects what's actually implemented (no aspirational claims).

---

## A. Store listing (marketing)

### App name
**Weather** — *(generic; consider a more distinctive store name, e.g. "Weather — Sky" or a brand of your choice, to stand out and rank better)*

### Subtitle (Apple, ≤ 30 chars)
`Hourly & daily · °C and °F`

### Short description (Google Play, ≤ 80 chars)
`Beautiful local weather with hourly & daily forecasts — in °C and °F together.`

### Promotional text (Apple, ≤ 170 chars)
`A gorgeous local forecast with a sky that shifts with the time of day. Hourly + 2‑day outlook, sun & moon, 19 languages — °C and °F side by side.`

### Full description

**Weather, beautifully simple — and bilingual in units.**

Weather gives you a clean, gorgeous forecast for exactly where you are, plus the
cities you care about. Every temperature is shown in **both °C and °F at once**,
so you never have to convert in your head or dig through settings.

The whole screen is alive: the background **sky changes with the time of day and
the conditions** — bright blue daylight, warm golden hour at sunrise and sunset,
a starry night, and a muted grey when it's cloudy or rainy. It doubles as a
light/dark theme that always feels right.

**What you get**
- 🌡️ **Current conditions** with a big, elegant temperature in **°C and °F**
- ⏱️ **Hourly forecast** — temperature, feels‑like, and humidity for the hours ahead
- 📅 **2‑day outlook** with highs, lows, and rain chance
- 📊 **At‑a‑glance details** — feels‑like, humidity, wind, and precipitation
- ☀️🌙 **Sun & Moon** — a sunrise‑to‑sunset arc showing where the sun is right now, plus an accurate **moon phase** with illumination
- 📍 **Your location**, automatically — or add up to **4 cities** and switch between them with a tap
- 🎨 **Adaptive sky theme** that follows each location's local time and weather
- 🌍 **19 languages**, including localized weather descriptions

**Private by design**
Your location is used only to show your local weather. There's **no account**,
and your saved cities and preferences stay **on your device**. If you don't grant
location access, the app falls back to an approximate area so you still get a
forecast.

**Make it yours**
Choose whether **°C or °F comes first**, pick your **language**, and — if you
like — **remove the ad banner** with a one‑time purchase. Restore it anytime,
on any of your devices.

Clean. Fast. Delightful. Just the weather, done well.

### Apple keywords (≤ 100 chars, comma‑separated)
`weather,forecast,hourly,temperature,celsius,fahrenheit,rain,sun,moon,humidity,wind,local,daily`

### Languages supported (for the listing)
English, Spanish, Simplified Chinese, Japanese, German, French, Brazilian
Portuguese, Korean, Arabic, Hindi, Italian, Dutch, Swedish, Norwegian, Danish,
Greek, Polish, Russian, Ukrainian.

### Privacy / data‑safety notes (for the questionnaires)
- **Location** (approximate + precise): used at runtime to fetch local weather;
  **not** stored remotely, **not** linked to an identity, **not** sold.
- **No account / no sign‑in.** Saved cities + settings are stored locally
  (device backup only).
- **IP‑based approximate location** is used only as a fallback when precise
  location isn't granted.
- **Advertising:** AdMob (with consent/ATT) unless the user buys "Remove ads".
- A **privacy policy URL** is required by both stores before submission.

---

## B. Technical overview

### Stack
- **Expo SDK 56** (React Native 0.85, React 19), **TypeScript**, **expo-router**
  (file‑based routing under `src/app`).
- **New Architecture** + React Compiler enabled.
- Fonts: **Inter** (body) and **Inter Tight** (numerals/display), deep‑imported
  so only used weights ship.
- Icons: `@expo/vector-icons` (FontAwesome). Graphics: `react-native-svg`
  (sun arc, moon) via `react-native-svg-transformer` for the moon SVG asset.

### Data sources (dual provider)
- **US locations → NWS** (`api.weather.gov`, free, no key) to spare the WeatherAPI
  quota. **Everywhere else → WeatherAPI.com**. The provider is chosen offline by a
  bundled US outline (point‑in‑polygon); NWS failures fall back to WeatherAPI.
- **WeatherAPI.com** (`/forecast.json`, `/search.json` for city autocomplete). Key
  via `EXPO_PUBLIC_WEATHERAPI_KEY`; condition text localized server‑side via `lang`.
- **NWS** provides forecast/hourly/daily; astronomy (sun/moon) is computed locally
  with `suncalc`, feels‑like via NOAA formulas, and condition text is localized in‑app
  (NWS is English‑only). See `src/services/{weather,nwsApi,usGeo,astronomy}.ts`.

### App structure
```
src/
  app/            expo-router screens
    _layout.tsx   providers (Settings → Purchases → Locations) + Stack
    index.tsx     main weather screen
    add-city.tsx  city search/add/remove (modal)
    settings.tsx  units, language, Remove ads (modal)
  components/
    weather/      SkyBackground, TabStrip, WeatherHero, MetricGrid,
                  HourlyStrip, DailyOutlook, SunMoonSection, Temp,
                  ApproxLocationBanner, LocationPrimingModal
    ads/          BannerAdBar, AdsBootstrap
    settings/     RemoveAdsCard
  services/       weatherApi, cache, geoip
  state/          settings, purchases, locations  (React Context providers)
  theme/          sky (palettes), icons (emoji map), fonts
  i18n/           translations (19 languages, + permission/IAP strings)
  utils/          temperature (unit ordering), time
```

### State & data flow
- **SettingsProvider** — temperature order (`CF`/`FC`) and UI language; persisted
  to AsyncStorage (`dualdeg:settings`); exposes the merged `strings` for the
  current language.
- **PurchasesProvider** — "Remove ads" entitlement; store‑as‑truth (no backend),
  cached in `dualdeg:removeAds`, reconciled on launch + Restore.
- **LocationsProvider** — current location + up to 4 saved cities, and a
  per‑location weather cache.

### Caching
- AsyncStorage with a tiny TTL wrapper (`services/cache.ts`).
- Keys are **language‑scoped and versioned**: `wx:v3:<lang>:current` /
  `wx:v3:<lang>:city:<id>`.
- **TTL:** current location **60 min**, saved cities **6 h**.
- **Stale‑while‑revalidate:** fresh cache serves instantly; stale data shows
  immediately while a background refresh runs; failed refresh keeps the last
  good data. Pull‑to‑refresh forces a fetch.

### Location & permission flow
- The OS prompt is **never shown on launch directly**. A custom **priming
  dialog** explains why, with a **"Next"** button that always leads to the system
  prompt (Apple 5.1.1(iv)); a "Not now" option appears only on Android (Google
  Play prominent disclosure).
- Status handling differs per platform: `undetermined` → dialog → OS prompt;
  `denied` → Settings (iOS won't re‑prompt); `granted` → GPS.
- **Fallback:** if not granted, an IP‑based **approximate** zipcode
  (`EXPO_PUBLIC_GEOIP_API_URL`) drives the forecast, with a tappable banner to
  enable precise location. Returning from Settings auto‑upgrades to GPS.

### Adaptive theme
- `theme/sky.ts` resolves one of five palettes from each location's local time,
  sunrise/sunset and condition: **day, overcast, golden, overcastDusk, night**.
  Every component is themed from the resolved palette.

### Internationalization
- 19 languages in `i18n/translations.ts` (UI strings, weekday names, moon‑phase
  names, plus permission and IAP string sets). Weather descriptions come
  localized from WeatherAPI; hourly time format switches to 24‑hour for
  non‑English locales.

### Monetization
- **Ads:** Google AdMob **anchored adaptive banner**
  (`react-native-google-mobile-ads`), with UMP consent + iOS ATT; mediation‑ready.
  Initialized only after the entitlement check, and **skipped entirely** for
  ad‑free users.
- **Remove ads:** a **non‑consumable IAP** (`react-native-iap`, product id
  `remove_ads`). Store is the source of truth; entitlement restores on reinstall.

### Persistence & backup
- All user data is **local** (AsyncStorage): saved cities, settings, ad‑free
  flag, and the weather cache.
- Covered by **iCloud Backup** (iOS) and **Android Auto Backup** (`allowBackup`),
  so cities + settings return on reinstall / new device. No cross‑device live
  sync (by design — no backend).

### Build / verification
- Native modules (location, ads, IAP, SVG transformer) require a **dev/EAS
  build** — not Expo Go.
- Verified with `npx tsc --noEmit`, `npx expo lint`, and `npx expo export`.
