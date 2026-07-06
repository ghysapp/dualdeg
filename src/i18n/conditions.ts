/**
 * Condition mapping + localized condition text.
 *
 * NWS describes conditions only via an icon token (e.g. "tsra_hi") and an
 * English phrase. We map the token to:
 *   - a WeatherAPI condition `code` (so the existing emoji + sky-theme logic
 *     works unchanged), and
 *   - a `ConditionKey` whose text we localize ourselves across all languages
 *     (WeatherAPI localizes server-side; NWS does not).
 */

import type { LanguageCode } from '@/i18n/translations';

export type ConditionKey =
  | 'sunny'
  | 'clear'
  | 'partlyCloudy'
  | 'mostlyCloudy'
  | 'cloudy'
  | 'fog'
  | 'windy'
  | 'showers'
  | 'rain'
  | 'thunderstorm'
  | 'snow'
  | 'sleet'
  | 'hot'
  | 'cold';

// NWS icon token → { base key, WeatherAPI condition code }. 'clear' becomes
// 'sunny' during the day (handled in conditionFromIcon).
const TOKEN_MAP: Record<string, { key: ConditionKey; code: number }> = {
  skc: { key: 'clear', code: 1000 },
  few: { key: 'clear', code: 1000 },
  sct: { key: 'partlyCloudy', code: 1003 },
  bkn: { key: 'mostlyCloudy', code: 1006 },
  ovc: { key: 'cloudy', code: 1009 },
  wind_skc: { key: 'windy', code: 1000 },
  wind_few: { key: 'windy', code: 1000 },
  wind_sct: { key: 'windy', code: 1003 },
  wind_bkn: { key: 'windy', code: 1006 },
  wind_ovc: { key: 'windy', code: 1009 },
  fog: { key: 'fog', code: 1135 },
  haze: { key: 'fog', code: 1135 },
  smoke: { key: 'fog', code: 1135 },
  dust: { key: 'fog', code: 1135 },
  rain: { key: 'rain', code: 1189 },
  rain_showers: { key: 'showers', code: 1063 },
  rain_showers_hi: { key: 'showers', code: 1063 },
  tsra: { key: 'thunderstorm', code: 1087 },
  tsra_sct: { key: 'thunderstorm', code: 1087 },
  tsra_hi: { key: 'thunderstorm', code: 1087 },
  tornado: { key: 'thunderstorm', code: 1087 },
  hurricane: { key: 'thunderstorm', code: 1087 },
  tropical_storm: { key: 'thunderstorm', code: 1087 },
  snow: { key: 'snow', code: 1219 },
  blizzard: { key: 'snow', code: 1225 },
  rain_snow: { key: 'sleet', code: 1069 },
  rain_sleet: { key: 'sleet', code: 1069 },
  snow_sleet: { key: 'sleet', code: 1069 },
  sleet: { key: 'sleet', code: 1069 },
  fzra: { key: 'sleet', code: 1069 },
  rain_fzra: { key: 'sleet', code: 1069 },
  snow_fzra: { key: 'sleet', code: 1069 },
  hot: { key: 'hot', code: 1000 },
  cold: { key: 'cold', code: 1000 },
};

const FALLBACK = { key: 'partlyCloudy' as ConditionKey, code: 1003 };

/** Extract the condition token from an NWS icon URL (".../day/tsra_hi,20"). */
export function parseNwsIconToken(icon: string | null | undefined): string | null {
  if (!icon) return null;
  const path = icon.split('?')[0];
  const parts = path.split('/');
  const i = parts.findIndex((p) => p === 'day' || p === 'night');
  if (i < 0 || i + 1 >= parts.length) return null;
  return parts[i + 1].split(',')[0] || null;
}

export interface ResolvedCondition {
  code: number;
  key: ConditionKey;
}

export function conditionFromIcon(
  icon: string | null | undefined,
  isDay: boolean,
): ResolvedCondition {
  const token = parseNwsIconToken(icon);
  const base = (token && TOKEN_MAP[token]) || FALLBACK;
  const key: ConditionKey = base.key === 'clear' && isDay ? 'sunny' : base.key;
  return { code: base.code, key };
}

export function conditionText(key: ConditionKey, language: LanguageCode): string {
  return (CONDITION_STRINGS[language] ?? CONDITION_STRINGS.en)[key];
}

// --- MET Norway (yr.no) mapping --------------------------------------------
// Symbol codes like "partlycloudy_night", "lightrainshowers_day",
// "heavyrainandthunder". Strip the _day/_night suffix, then keyword-match.
export function conditionFromMetNo(
  symbolCode: string | null | undefined,
  isDay: boolean,
): ResolvedCondition {
  const s = (symbolCode ?? '').toLowerCase().replace(/_(day|night|polartwilight)$/, '');
  let key: ConditionKey;
  if (!s) key = FALLBACK.key;
  else if (s.includes('thunder')) key = 'thunderstorm';
  else if (s.includes('sleet')) key = 'sleet';
  else if (s.includes('snow')) key = 'snow';
  else if (s.includes('shower')) key = 'showers';
  else if (s.includes('rain')) key = s.includes('light') ? 'showers' : 'rain';
  else if (s.includes('fog')) key = 'fog';
  else if (s === 'cloudy') key = 'cloudy';
  else if (s === 'partlycloudy') key = 'partlyCloudy';
  else if (s === 'fair' || s === 'clearsky') key = 'clear';
  else key = FALLBACK.key;
  if (key === 'clear' && isDay) key = 'sunny';
  return { code: KEY_TO_CODE[key], key };
}

// --- Météo-France mapping ---------------------------------------------------
// Representative WeatherAPI code per key (for emoji + sky theme).
const KEY_TO_CODE: Record<ConditionKey, number> = {
  sunny: 1000,
  clear: 1000,
  partlyCloudy: 1003,
  mostlyCloudy: 1006,
  cloudy: 1009,
  fog: 1135,
  windy: 1000,
  showers: 1063,
  rain: 1189,
  thunderstorm: 1087,
  snow: 1219,
  sleet: 1069,
  hot: 1000,
  cold: 1000,
};

// Météo-France icon base (suffix j/n and "bis" stripped) → condition key.
const MF_ICON_MAP: Record<string, ConditionKey> = {
  p1: 'clear',
  p2: 'partlyCloudy',
  p3: 'partlyCloudy',
  p4: 'mostlyCloudy',
  p5: 'cloudy',
  p6: 'fog',
  p7: 'fog',
  p8: 'fog',
  p9: 'showers',
  p10: 'rain',
  p11: 'rain',
  p12: 'showers',
  p13: 'showers',
  p14: 'rain',
  p15: 'showers',
  p16: 'thunderstorm',
  p17: 'thunderstorm',
  p18: 'thunderstorm',
  p19: 'thunderstorm',
  p20: 'snow',
  p21: 'snow',
  p22: 'snow',
  p23: 'sleet',
  p24: 'sleet',
  p25: 'sleet',
  p26: 'thunderstorm',
  p27: 'thunderstorm',
  p28: 'thunderstorm',
  p29: 'thunderstorm',
};

/** Fallback: map an EN/FR condition phrase to a key when the icon is unknown. */
function keyFromPhrase(desc: string): ConditionKey | null {
  const d = desc.toLowerCase();
  if (/orage|thunder/.test(d)) return 'thunderstorm';
  if (/verglas|sleet|freezing|pluie et neige|neige mê/.test(d)) return 'sleet';
  if (/neige|snow/.test(d)) return 'snow';
  if (/averse|shower/.test(d)) return 'showers';
  if (/pluie|rain|bruine|drizzle/.test(d)) return 'rain';
  if (/brouillard|brume|fog|mist/.test(d)) return 'fog';
  if (/couvert|overcast|très nuageux|very cloud/.test(d)) return 'cloudy';
  if (/nuageux|nuage|cloud/.test(d)) return /peu|partly|éclairc/.test(d) ? 'partlyCloudy' : 'mostlyCloudy';
  if (/clair|clear|soleil|sunny|ensoleill|dégag/.test(d)) return 'clear';
  return null;
}

// --- Bright Sky / DWD mapping ----------------------------------------------
// Bright Sky uses Dark-Sky-style icons (day/night encoded in the suffix).
const BRIGHTSKY_ICON_MAP: Record<string, ConditionKey> = {
  'clear-day': 'sunny',
  'clear-night': 'clear',
  'partly-cloudy-day': 'partlyCloudy',
  'partly-cloudy-night': 'partlyCloudy',
  cloudy: 'cloudy',
  fog: 'fog',
  wind: 'windy',
  rain: 'rain',
  sleet: 'sleet',
  snow: 'snow',
  hail: 'sleet',
  thunderstorm: 'thunderstorm',
};

export function conditionFromBrightSky(
  icon: string | null | undefined,
  desc: string | null | undefined,
): ResolvedCondition {
  let key: ConditionKey | null = icon ? (BRIGHTSKY_ICON_MAP[icon] ?? null) : null;
  if (!key) key = keyFromPhrase(desc ?? '');
  if (!key) key = FALLBACK.key;
  return { code: KEY_TO_CODE[key], key };
}

export function conditionFromMeteoFrance(
  icon: string | null | undefined,
  desc: string | null | undefined,
  isDay: boolean,
): ResolvedCondition {
  let key: ConditionKey | null = null;
  if (icon) {
    const base = icon.toLowerCase().replace('bis', '').replace(/[jn]$/, '');
    key = MF_ICON_MAP[base] ?? null;
  }
  if (!key) key = keyFromPhrase(desc ?? '');
  if (!key) key = FALLBACK.key;
  if (key === 'clear' && isDay) key = 'sunny';
  return { code: KEY_TO_CODE[key], key };
}

type ConditionTable = Record<ConditionKey, string>;

const CONDITION_STRINGS: Record<LanguageCode, ConditionTable> = {
  en: { sunny: 'Sunny', clear: 'Clear', partlyCloudy: 'Partly cloudy', mostlyCloudy: 'Mostly cloudy', cloudy: 'Cloudy', fog: 'Fog', windy: 'Windy', showers: 'Showers', rain: 'Rain', thunderstorm: 'Thunderstorms', snow: 'Snow', sleet: 'Sleet', hot: 'Hot', cold: 'Cold' },
  es: { sunny: 'Soleado', clear: 'Despejado', partlyCloudy: 'Parcialmente nublado', mostlyCloudy: 'Mayormente nublado', cloudy: 'Nublado', fog: 'Niebla', windy: 'Ventoso', showers: 'Chubascos', rain: 'Lluvia', thunderstorm: 'Tormentas', snow: 'Nieve', sleet: 'Aguanieve', hot: 'Caluroso', cold: 'Frío' },
  zh: { sunny: '晴', clear: '晴朗', partlyCloudy: '局部多云', mostlyCloudy: '大部多云', cloudy: '多云', fog: '雾', windy: '大风', showers: '阵雨', rain: '雨', thunderstorm: '雷暴', snow: '雪', sleet: '雨夹雪', hot: '炎热', cold: '寒冷' },
  ja: { sunny: '晴れ', clear: '快晴', partlyCloudy: '晴れ時々曇り', mostlyCloudy: 'おおむね曇り', cloudy: '曇り', fog: '霧', windy: '強風', showers: 'にわか雨', rain: '雨', thunderstorm: '雷雨', snow: '雪', sleet: 'みぞれ', hot: '高温', cold: '低温' },
  de: { sunny: 'Sonnig', clear: 'Klar', partlyCloudy: 'Teils bewölkt', mostlyCloudy: 'Überwiegend bewölkt', cloudy: 'Bewölkt', fog: 'Nebel', windy: 'Windig', showers: 'Schauer', rain: 'Regen', thunderstorm: 'Gewitter', snow: 'Schnee', sleet: 'Schneeregen', hot: 'Heiß', cold: 'Kalt' },
  fr: { sunny: 'Ensoleillé', clear: 'Dégagé', partlyCloudy: 'Partiellement nuageux', mostlyCloudy: 'Plutôt nuageux', cloudy: 'Nuageux', fog: 'Brouillard', windy: 'Venteux', showers: 'Averses', rain: 'Pluie', thunderstorm: 'Orages', snow: 'Neige', sleet: 'Neige fondue', hot: 'Chaud', cold: 'Froid' },
  pt: { sunny: 'Ensolarado', clear: 'Limpo', partlyCloudy: 'Parcialmente nublado', mostlyCloudy: 'Predominantemente nublado', cloudy: 'Nublado', fog: 'Nevoeiro', windy: 'Ventoso', showers: 'Pancadas de chuva', rain: 'Chuva', thunderstorm: 'Trovoadas', snow: 'Neve', sleet: 'Aguaneve', hot: 'Quente', cold: 'Frio' },
  ko: { sunny: '맑음', clear: '갬', partlyCloudy: '부분적으로 흐림', mostlyCloudy: '대체로 흐림', cloudy: '흐림', fog: '안개', windy: '바람', showers: '소나기', rain: '비', thunderstorm: '뇌우', snow: '눈', sleet: '진눈깨비', hot: '더움', cold: '추움' },
  ar: { sunny: 'مشمس', clear: 'صافٍ', partlyCloudy: 'غائم جزئيًا', mostlyCloudy: 'غائم غالبًا', cloudy: 'غائم', fog: 'ضباب', windy: 'عاصف', showers: 'زخات مطر', rain: 'مطر', thunderstorm: 'عواصف رعدية', snow: 'ثلج', sleet: 'مطر ثلجي', hot: 'حار', cold: 'بارد' },
  hi: { sunny: 'धूप', clear: 'साफ़', partlyCloudy: 'आंशिक रूप से बादल', mostlyCloudy: 'अधिकतर बादल', cloudy: 'बादल', fog: 'कोहरा', windy: 'हवादार', showers: 'बौछारें', rain: 'बारिश', thunderstorm: 'गरज के साथ बौछार', snow: 'बर्फ़', sleet: 'ओले-बारिश', hot: 'गर्म', cold: 'ठंडा' },
  it: { sunny: 'Soleggiato', clear: 'Sereno', partlyCloudy: 'Parzialmente nuvoloso', mostlyCloudy: 'Prevalentemente nuvoloso', cloudy: 'Nuvoloso', fog: 'Nebbia', windy: 'Ventoso', showers: 'Rovesci', rain: 'Pioggia', thunderstorm: 'Temporali', snow: 'Neve', sleet: 'Nevischio', hot: 'Caldo', cold: 'Freddo' },
  nl: { sunny: 'Zonnig', clear: 'Helder', partlyCloudy: 'Gedeeltelijk bewolkt', mostlyCloudy: 'Overwegend bewolkt', cloudy: 'Bewolkt', fog: 'Mist', windy: 'Winderig', showers: 'Buien', rain: 'Regen', thunderstorm: 'Onweer', snow: 'Sneeuw', sleet: 'Natte sneeuw', hot: 'Heet', cold: 'Koud' },
  sv: { sunny: 'Soligt', clear: 'Klart', partlyCloudy: 'Delvis molnigt', mostlyCloudy: 'Mestadels molnigt', cloudy: 'Molnigt', fog: 'Dimma', windy: 'Blåsigt', showers: 'Skurar', rain: 'Regn', thunderstorm: 'Åska', snow: 'Snö', sleet: 'Snöblandat regn', hot: 'Hett', cold: 'Kallt' },
  no: { sunny: 'Sol', clear: 'Klart', partlyCloudy: 'Delvis skyet', mostlyCloudy: 'Stort sett skyet', cloudy: 'Skyet', fog: 'Tåke', windy: 'Vind', showers: 'Byger', rain: 'Regn', thunderstorm: 'Torden', snow: 'Snø', sleet: 'Sludd', hot: 'Varmt', cold: 'Kaldt' },
  da: { sunny: 'Solrigt', clear: 'Klart', partlyCloudy: 'Delvist skyet', mostlyCloudy: 'Overvejende skyet', cloudy: 'Skyet', fog: 'Tåge', windy: 'Blæsende', showers: 'Byger', rain: 'Regn', thunderstorm: 'Tordenvejr', snow: 'Sne', sleet: 'Slud', hot: 'Varmt', cold: 'Koldt' },
  el: { sunny: 'Ηλιοφάνεια', clear: 'Αίθριος', partlyCloudy: 'Μερική συννεφιά', mostlyCloudy: 'Κυρίως συννεφιά', cloudy: 'Συννεφιά', fog: 'Ομίχλη', windy: 'Άνεμοι', showers: 'Μπόρες', rain: 'Βροχή', thunderstorm: 'Καταιγίδες', snow: 'Χιόνι', sleet: 'Χιονόνερο', hot: 'Ζέστη', cold: 'Κρύο' },
  pl: { sunny: 'Słonecznie', clear: 'Bezchmurnie', partlyCloudy: 'Częściowe zachmurzenie', mostlyCloudy: 'Przeważnie pochmurno', cloudy: 'Pochmurno', fog: 'Mgła', windy: 'Wietrznie', showers: 'Przelotne opady', rain: 'Deszcz', thunderstorm: 'Burze', snow: 'Śnieg', sleet: 'Deszcz ze śniegiem', hot: 'Gorąco', cold: 'Zimno' },
  ru: { sunny: 'Солнечно', clear: 'Ясно', partlyCloudy: 'Переменная облачность', mostlyCloudy: 'Преимущественно облачно', cloudy: 'Облачно', fog: 'Туман', windy: 'Ветрено', showers: 'Ливни', rain: 'Дождь', thunderstorm: 'Грозы', snow: 'Снег', sleet: 'Мокрый снег', hot: 'Жарко', cold: 'Холодно' },
  uk: { sunny: 'Сонячно', clear: 'Ясно', partlyCloudy: 'Мінлива хмарність', mostlyCloudy: 'Переважно хмарно', cloudy: 'Хмарно', fog: 'Туман', windy: 'Вітряно', showers: 'Зливи', rain: 'Дощ', thunderstorm: 'Грози', snow: 'Сніг', sleet: 'Мокрий сніг', hot: 'Спекотно', cold: 'Холодно' },
};
