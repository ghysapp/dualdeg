/**
 * Daily briefing: a short, human summary of the day ahead ("dry until 2 pm,
 * then showers — take an umbrella"), built on-device from the forecast the app
 * already has. Rules decide what's worth saying; per-language phrase banks
 * decide how. No model, no network call.
 */

import type { LanguageCode } from '@/i18n/translations';

import { ar } from './locales/ar';
import { da } from './locales/da';
import { de } from './locales/de';
import { el } from './locales/el';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { hi } from './locales/hi';
import { it } from './locales/it';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { nl } from './locales/nl';
import { no } from './locales/no';
import { pl } from './locales/pl';
import { pt } from './locales/pt';
import { ru } from './locales/ru';
import { sv } from './locales/sv';
import { uk } from './locales/uk';
import { zh } from './locales/zh';
import type { PhraseBank } from './types';

const BANKS: Record<LanguageCode, PhraseBank> = {
  en, es, zh, ja, de, fr, pt, ko, ar, hi, it, nl, sv, no, da, el, pl, ru, uk,
};

export function phraseBankFor(language: LanguageCode): PhraseBank {
  return BANKS[language] ?? en;
}

export { composeBriefing } from './compose';
export type { Briefing, BriefingPage } from './types';
