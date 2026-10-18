import type { Locale } from "@/i18n/config";
import type { LocalizedText } from "./types";

export type Picked = { text: string; isFallback: boolean };

/** Returns the text in the requested language, or the Chinese source with isFallback = true. */
export const pick = (value: LocalizedText | null | undefined, locale: Locale): Picked => {
    if (!value) return { text: "", isFallback: false };
    const translated = locale === "zh" ? value.zh : value[locale];
    if (translated && translated.trim()) return { text: translated, isFallback: false };
    return { text: value.zh ?? "", isFallback: locale !== "zh" && Boolean(value.zh) };
};

/** Plain string, for attributes and metadata. */
export const tx = (value: LocalizedText | null | undefined, locale: Locale) => pick(value, locale).text;
