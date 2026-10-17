export const locales = ["zh", "fr", "en"] as const;
export type Locale = (typeof locales)[number];

/** Chinese is the source language: every text field has a Chinese value, French and English are translations. */
export const defaultLocale: Locale = "zh";

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Value for <html lang> */
export const htmlLang: Record<Locale, string> = { zh: "zh-Hans", fr: "fr-CA", en: "en-CA" };

/** Locale used for Intl date and number formatting */
export const intlLocale: Record<Locale, string> = { zh: "zh-CN", fr: "fr-CA", en: "en-CA" };

/** Label in the language switcher, written in its own language */
export const localeLabel: Record<Locale, string> = { zh: "中文", fr: "Français", en: "English" };
export const localeShort: Record<Locale, string> = { zh: "中文", fr: "FR", en: "EN" };

/** The school is in Montreal; "today" and "next class day" are computed in this time zone. */
export const schoolTimeZone = "America/Montreal";
