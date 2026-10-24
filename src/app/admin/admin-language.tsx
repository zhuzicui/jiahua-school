import { type Locale, isLocale, localeShort, locales } from "@/i18n/config";
import { cx } from "@/utils/cx";

/** The admin screens speak Chinese unless ?lang=fr or ?lang=en is in the address. */
export const adminLocale = (lang: string | string[] | undefined): Locale => (typeof lang === "string" && isLocale(lang) ? lang : "zh");

/** 中文 · FR · EN links that switch the admin interface language. */
export const AdminLanguageLinks = ({ current, path, label }: { current: Locale; path: string; label: string }) => (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
        {locales.map((locale) => (
            <a
                key={locale}
                href={locale === "zh" ? path : `${path}?lang=${locale}`}
                aria-current={locale === current ? "true" : undefined}
                className={cx(
                    "rounded-md px-2 py-1 font-medium outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2",
                    locale === current ? "bg-active text-secondary" : "text-tertiary hover:bg-primary_hover hover:text-secondary",
                )}
            >
                {localeShort[locale]}
            </a>
        ))}
    </nav>
);
