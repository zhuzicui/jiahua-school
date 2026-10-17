import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { notFound } from "next/navigation";
import { JiahuaLogo } from "@/components/brand/jiahua-logo";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { htmlLang, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getSettings } from "@/lib/content";
import { getNavigation, href } from "@/lib/navigation";
import { tx } from "@/lib/text";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import "@/styles/globals.css";
import { cx } from "@/utils/cx";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
// Chinese glyphs are large, so the font is not preloaded; the browser fetches only the subsets a page uses.
const notoSC = Noto_Sans_SC({ weight: ["400", "500", "600", "700"], display: "swap", preload: false, variable: "--font-noto-sc" });

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export const viewport: Viewport = { themeColor: "#e84a5f", colorScheme: "light dark" };

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const { siteName, tagline } = getSettings();
    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jiahuaschool.ca"),
        title: { default: tx(siteName, locale), template: `%s · ${tx(siteName, locale)}` },
        description: tx(tagline, locale),
        icons: { icon: "/icon.svg" },
        alternates: { languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`])) },
    };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = getDictionary(locale);

    return (
        <html lang={htmlLang[locale]} suppressHydrationWarning>
            <body className={cx(inter.variable, notoSC.variable, "bg-primary antialiased")}>
                <RouteProvider>
                    <Theme>
                        <a
                            href="#main"
                            className="sr-only z-50 rounded-lg bg-primary px-4 py-2 font-semibold text-primary shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
                        >
                            {t.common.skipToContent}
                        </a>
                        <SiteHeader
                            locale={locale}
                            logo={<JiahuaLogo className="h-full" />}
                            homeHref={href(locale)}
                            sections={getNavigation(locale)}
                            registerHref={href(locale, "/registration")}
                            labels={{ register: t.common.register, menu: t.nav.menu, language: t.nav.language }}
                        />
                        <main id="main" className="min-h-[60vh]">
                            {children}
                        </main>
                        <SiteFooter locale={locale} />
                    </Theme>
                </RouteProvider>
            </body>
        </html>
    );
}
