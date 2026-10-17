import { useCallback } from 'react';
import type { Country } from '@/api/types';
import { useLocaleStore } from '@/state/localeStore';
import { STRINGS, type Locale, type StringKey } from './strings';

export type TranslateVars = Record<string, string | number>;
export type Translate = (key: StringKey, vars?: TranslateVars) => string;

export function translate(locale: Locale, key: StringKey, vars?: TranslateVars): string {
  const template = STRINGS[locale][key];
  if (vars === undefined) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = vars[name];
    return value === undefined ? match : String(value);
  });
}

export function useLocale(): Locale {
  return useLocaleStore((state) => state.locale);
}

/** Returns a stable `t` function that changes identity only when the language changes. */
export function useT(): Translate {
  const locale = useLocale();
  return useCallback<Translate>((key, vars) => translate(locale, key, vars), [locale]);
}

const COUNTRY_KEYS: Record<Country, StringKey> = {
  UAE: 'countryUAE',
  'Saudi Arabia': 'countrySaudi',
  Qatar: 'countryQatar',
};

export function countryLabel(t: Translate, country: Country): string {
  return t(COUNTRY_KEYS[country]);
}

/** 2800 -> "2,800". Hand-rolled: Intl support differs across Hermes builds on low-end Android. */
export function formatNumber(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
