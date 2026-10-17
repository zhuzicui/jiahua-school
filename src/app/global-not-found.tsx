import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { JiahuaLogo } from "@/components/brand/jiahua-logo";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import "@/styles/globals.css";
import { cx } from "@/utils/cx";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = { title: "404 · 蒙特利尔佳华学校 Jia Hua School" };

/** Unmatched URLs have no language, so this page speaks all three. */
export default function GlobalNotFound() {
    return (
        <html lang="zh-Hans">
            <body className={cx(inter.variable, "bg-primary antialiased")}>
                <main className="mx-auto max-w-container px-4 py-16 md:px-8 md:py-24">
                    <a href="/zh" className="block h-11 w-fit">
                        <JiahuaLogo className="h-full" />
                    </a>
                    <p className="mt-12 text-md font-semibold text-brand-secondary">404</p>
                    <ul className="mt-4 flex flex-col gap-8">
                        {locales.map((locale) => {
                            const t = getDictionary(locale).notFound;
                            return (
                                <li key={locale} lang={locale === "zh" ? "zh-Hans" : locale}>
                                    <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">{t.title}</h1>
                                    <p className="mt-2 text-lg text-tertiary">{t.body}</p>
                                    <a href={`/${locale}`} className="link mt-3 inline-block">
                                        {t.home}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </main>
            </body>
        </html>
    );
}
