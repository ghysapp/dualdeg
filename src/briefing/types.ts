/**
 * Daily briefing: shared types, and the phrase-bank contract every locale fills.
 *
 * The engine (detect.ts) decides WHAT is worth saying — rain windows, heat,
 * frost, a full moon — as language-free insights with numeric params. A phrase
 * bank decides HOW to say it. Every line is picked by key, so a bank is just
 * data plus a few formatting functions, and adding a language never touches the
 * engine.
 *
 * Placeholders are filled by the composer; each key documents the ones it gets.
 * A placeholder a key doesn't list comes out empty, so don't use it there.
 *
 *   {start} {end} {t}    hours, already formatted by the bank's `hour()`
 *   {sunrise} {sunset} {golden}   clock times, formatted by the bank's `time()`
 *   {high} {low} {feels} temperatures, e.g. "21°C / 70°F" (unit order follows settings)
 *   {diff}               temperature difference, e.g. "8°C / 14°F"
 *   {wind}               wind speed, e.g. "65 km/h / 40 mph"
 *   {uv}                 UV index number
 *   {daylight}           day length, formatted by the bank's `duration()`
 *   {name} {rate}        meteor shower name (from `meteorNames`) and hourly rate
 *   {day}                weekday name, from the app's own weekday strings
 *
 * Tone: lines for everyday weather should be witty; the ones marked SERIOUS
 * are for dangerous weather and must stay clear and calm — no jokes there. The
 * composer also drops the jokey greeting and extras when one of those shows.
 */

export type LineKey =
  // --- Rain patterns (day frames: today / tomorrow) ---
  /** Rain for (nearly) the whole period. */
  | 'rainAllDay'
  /** Dry, then rain from {start} until the end of the day. */
  | 'rainLater'
  /** Raining at the start, stops around {end}. */
  | 'rainStops'
  /** One rain spell from {start} to {end}, dry either side. */
  | 'rainWindow'
  /** A single short shower around {t}. */
  | 'rainBrief'
  /** Several separate showers through the day. */
  | 'rainOnOff'
  /** Rain is only a maybe (low probability) between {start} and {end}. */
  | 'showersPossible'
  /** Workday: rain around {start}, during the morning commute. */
  | 'rainCommuteAM'
  /** Workday: rain from around {start}, during the commute home. */
  | 'rainCommutePM'
  /** Only drizzle, {start} to {end}. */
  | 'drizzle'
  /** A heavy downpour around {t}. */
  | 'downpour'
  /** Thunderstorms possible {start} to {end}. */
  | 'thunder'
  /** Thundersnow (snow + lightning, rare) around {start}. */
  | 'thunderSnow'

  // --- Winter precipitation ---
  /** Light snow / flurries, {start} to {end}. */
  | 'snowLight'
  /** Snow, {start} to {end}. */
  | 'snow'
  /** SERIOUS. Heavy snow, {start} to {end}. */
  | 'snowHeavy'
  /** SERIOUS. Blizzard (snow + strong wind) from around {start}. */
  | 'blizzard'
  /** Wet snow turning to slush, from around {start}. */
  | 'slush'
  /** Sleet / ice pellets, {start} to {end}. */
  | 'sleet'
  /** SERIOUS. Freezing rain from around {start}. */
  | 'freezingRain'

  // --- Ice, frost, fog ---
  /** Black ice likely around {t}. */
  | 'blackIce'
  /** Frost, down to {low}. */
  | 'frost'
  /** Morning fog clearing around {end}. */
  | 'fogMorning'
  /** Fog forming around {start} (night). */
  | 'fogTonight'
  /** Freezing fog until around {end}. */
  | 'freezingFog'

  // --- Sky ---
  /** Sunny all day, up to {high}. */
  | 'sunnyAllDay'
  /** Overcast all day, dry. */
  | 'grayAllDay'
  /** Cloudy start, sun from around {t}. */
  | 'clearingLater'
  /** Sunny start, clouds from around {t}. */
  | 'cloudingLater'
  /** Dry, sunny, pleasant temperatures; {high}. */
  | 'perfectDay'

  // --- Temperature ---
  /** Big morning-to-afternoon swing: {low} → {high}. */
  | 'bigSwing'
  /** Warm, up to {high} (~30°C felt). */
  | 'warm'
  /** Hot: feels like {feels} between {start} and {end}. */
  | 'hot'
  /** SERIOUS. Extreme heat: feels like {feels}, worst {start}–{end}. */
  | 'extremeHeat'
  /** Night that stays at or above 20°C: {low}. */
  | 'tropicalNight'
  /** Stays below freezing all day: {high} at most. */
  | 'freezingDay'
  /** Bitter cold: feels like {feels}. */
  | 'bitterCold'
  /** SERIOUS. Dangerous cold: feels like {feels}. */
  | 'extremeCold'
  /** Wind makes it feel much colder: {feels}. */
  | 'windChill'
  /** Hot and humid, sticky air. */
  | 'muggy'
  /** Sudden drop (cold front) around {t}, about {diff} colder. */
  | 'tempDrop'
  /** Afternoon: cools off quickly, {low} by {t}. */
  | 'eveningChill'
  /** Unusually mild for the season: {high}. */
  | 'warmForSeason'
  /** Unusually cold for the season: {high}. */
  | 'coldForSeason'
  /** Sunny but cold: {high} at most. */
  | 'sunnyButCold'

  // --- Wind ---
  /** Breezy, up to {wind}. */
  | 'breezy'
  /** Windy, up to {wind}. */
  | 'windy'
  /** Gale, up to {wind}. */
  | 'gale'
  /** SERIOUS. Storm-force wind, up to {wind}. */
  | 'storm'
  /** SERIOUS. Hurricane-force wind, up to {wind}. */
  | 'hurricane'

  // --- Exposure ---
  /** High UV {uv}, peaking around {t}. */
  | 'uvHigh'
  /** Very high UV {uv}, {start}–{end}. */
  | 'uvVeryHigh'
  /** Extreme UV {uv}. */
  | 'uvExtreme'
  /** Poor air quality. */
  | 'airPoor'
  /** Very poor air quality. */
  | 'airVeryPoor'

  // --- Night frame ---
  /** Clear night, low {low}. */
  | 'clearNight'
  /** Nothing notable tonight, low {low}. */
  | 'calmNight'
  /** Rain all night. */
  | 'nightRainAll'
  /** Rain from {start} through the night. */
  | 'nightRainFrom'
  /** Raining now, stops around {end}. */
  | 'nightRainUntil'
  /** Rain {start} to {end}, dry otherwise. */
  | 'nightRainWindow'
  /** Snow overnight from around {start}. */
  | 'nightSnow'
  /** Thunderstorms {start} to {end} tonight. */
  | 'nightStorm'

  // --- Tomorrow vs today ---
  /** Tomorrow is about {diff} colder, high {high}. */
  | 'tomorrowColder'
  /** Tomorrow is about {diff} warmer, high {high}. */
  | 'tomorrowWarmer'

  // --- Nothing special (fallbacks) ---
  /** Uneventful sunny day, {low} to {high}. */
  | 'calmSunny'
  /** Uneventful cloudy, dry day, {low} to {high}. */
  | 'calmCloudy'
  /** Uneventful sun-and-cloud day, {low} to {high}. */
  | 'calmMixed'

  // --- Extras (only on calm days) ---
  /** Full moon, clear sky tonight. */
  | 'fullMoon'
  /** Full moon at perigee ("supermoon"), clear sky tonight. */
  | 'supermoon'
  /** New moon + clear sky: good stargazing. */
  | 'newMoonStars'
  /** Meteor shower {name} peaks tonight, up to {rate}/hour, clear sky. */
  | 'meteors'
  /** Clear sunset at {sunset}, golden hour from {golden}. */
  | 'goldenHour'
  /** Clear sunrise at {sunrise} (user is up before it). */
  | 'sunriseClear'
  /** The sun doesn't set today (polar day). */
  | 'midnightSun'
  /** The sun doesn't rise today (polar night). */
  | 'polarNight'
  /** Solstice, longest day: {daylight} of daylight. */
  | 'longestDay'
  /** Solstice, shortest day: {daylight} of daylight. */
  | 'shortestDay'
  /** Spring equinox. */
  | 'springEquinox'
  /** Autumn equinox. */
  | 'autumnEquinox'
  /** Winter: sunset already at {sunset}. */
  | 'earlySunset'
  /** Summer: sunset only at {sunset}. */
  | 'lateSunset'
  /** Snow on Christmas Eve / Day. */
  | 'whiteChristmas'
  /** Mild Christmas: {high}. */
  | 'greenChristmas'
  /** New Year's Eve, dry around midnight, {low}. */
  | 'nyeDry'
  /** New Year's Eve, rain/snow around midnight. */
  | 'nyeWet'
  /** Halloween evening with spooky weather (fog, wind or rain). */
  | 'halloween';

export type TipKey =
  /** Rain during waking hours. */
  | 'umbrella'
  /** Rain + strong wind: raincoat, not umbrella. */
  | 'raincoat'
  /** Snow on a workday: shoes with grip. */
  | 'snowBoots'
  /** Snow on a weekend: build a snowman. */
  | 'snowman'
  /** Big temperature swing: layers. */
  | 'layers'
  /** High UV: sunscreen. */
  | 'sunscreen'
  /** Frosty workday morning: scrape the windscreen. */
  | 'scrape'
  /** Heat: drink water, shade. */
  | 'hydrate'
  /** Cold: hat, gloves, scarf. */
  | 'bundleUp'
  /** Dry, sunny, breezy: laundry drying weather. */
  | 'laundry'
  /** Warm dry evening: eat outside. */
  | 'terrace'
  /** Warm humid summer evening: mosquitoes. */
  | 'mosquitoes'
  /** Dry now but rain tomorrow: don't wash the car. */
  | 'noCarWash'
  /** Storm / hurricane: stay indoors. SERIOUS. */
  | 'stayIn'
  /** Gale: secure loose objects. SERIOUS. */
  | 'secureObjects'
  /** Ice / heavy snow / freezing fog: allow extra travel time. SERIOUS. */
  | 'extraTime'
  /** Afternoon: it'll be cool this evening, bring a jacket. */
  | 'jacketEvening';

export type GreetingKey =
  /** 04:00–06:59 */
  | 'earlyBird'
  /** 07:00–11:59 */
  | 'morning'
  /** 12:00–13:59 */
  | 'midday'
  /** 14:00–17:59 */
  | 'afternoon'
  /** 18:00–21:59 */
  | 'evening'
  /** 22:00–23:59 */
  | 'late'
  /** 00:00–03:59 */
  | 'nightOwl'
  /** First workday of the week, morning (Monday; Sunday where the weekend is Fri–Sat). */
  | 'firstWorkday'
  /** Middle of the work week (Wednesday), daytime. */
  | 'midweek'
  /** Last workday, daytime (Friday; Thursday where the weekend is Fri–Sat). */
  | 'lastWorkday'
  /** Last workday, evening: the weekend starts. */
  | 'lastWorkdayEvening'
  /** A weekend day, daytime. May use {day}. */
  | 'weekend'
  /** Last weekend evening (Sunday evening): work tomorrow. */
  | 'weekendEnd'
  | 'newYear'
  | 'newYearsEve'
  | 'christmas'
  | 'halloween'
  | 'friday13'
  | 'aprilFools'
  | 'valentine'
  /** SERIOUS. Replaces every other greeting when the weather is dangerous. */
  | 'alert';

export type MeteorKey =
  | 'quadrantids'
  | 'lyrids'
  | 'etaAquariids'
  | 'perseids'
  | 'orionids'
  | 'leonids'
  | 'geminids';

export interface PhraseBank {
  /** Card title, e.g. "Your day in short". */
  title: string;
  /** Page tabs — keep them short, they sit side by side. */
  labels: {
    /** Page 1 from 4 am to 6 pm. */
    today: string;
    /** Page 1 from 6 pm to 4 am. */
    tonight: string;
    /** Page 2, except after midnight. */
    tomorrow: string;
    /** Page 2 after midnight: the day that starts when the user wakes up. */
    laterToday: string;
  };
  /** Each key: one or more variants; one is picked per day and place. */
  greetings: Record<GreetingKey, string[]>;
  lines: Record<LineKey, string[]>;
  tips: Record<TipKey, string[]>;
  meteorNames: Record<MeteorKey, string>;
  /** A whole hour as it reads mid-sentence: 14 → "2 pm" / "14 h" / "14 Uhr". */
  hour: (h: number) => string;
  /** A clock time: (19, 42) → "7:42 pm" / "19 h 42" / "19:42". */
  time: (h: number, m: number) => string;
  /** A duration: 972 → "16 h 12 min". */
  duration: (minutes: number) => string;
  /**
   * Weekend days (0 = Sunday … 6 = Saturday) for this language's audience.
   * Defaults to Saturday + Sunday.
   */
  weekend?: number[];
}

// ---------------------------------------------------------------------------
// Engine types
// ---------------------------------------------------------------------------

/** Which slice of time a section talks about. */
export type FrameKind = 'today' | 'restOfDay' | 'tonight' | 'tomorrow' | 'laterToday';

export type InsightFamily =
  | 'precip'
  | 'thunder'
  | 'downpour'
  | 'ice'
  | 'fog'
  | 'sky'
  | 'temp'
  | 'heat'
  | 'cold'
  | 'wind'
  | 'uv'
  | 'air'
  | 'trend'
  | 'extra'
  | 'calm';

/** Raw numeric params; the composer formats them for display. */
export interface InsightParams {
  start?: number;
  end?: number;
  t?: number;
  high?: { c: number; f: number };
  low?: { c: number; f: number };
  feels?: { c: number; f: number };
  /** Temperature difference, °C (the °F figure is derived). */
  diffC?: number;
  windKph?: number;
  uv?: number;
  sunrise?: { h: number; m: number };
  sunset?: { h: number; m: number };
  golden?: { h: number; m: number };
  daylightMin?: number;
  meteor?: MeteorKey;
  rate?: number;
}

export interface Insight {
  key: LineKey;
  family: InsightFamily;
  /** 0–100. ≥ 85 is dangerous: serious tone, no jokes around it. */
  severity: number;
  params: InsightParams;
}

export interface BriefingPage {
  /** Tab label: "Today", "Tonight", "Tomorrow", "When you wake up". */
  label: string;
  /** The greeting on the first page; the weekday on the second. */
  heading: string;
  /** 'alert' when something dangerous is in this page's forecast. */
  tone: 'normal' | 'alert';
  lines: string[];
  /** The practical tip, kept apart so the card can style it. */
  tip?: string;
}

export interface Briefing {
  title: string;
  /** Today (or tonight) first, then the next day. Never more than two. */
  pages: BriefingPage[];
}
