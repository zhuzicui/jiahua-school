import type { Metadata } from "next";
import { RichText, T } from "@/components/site/localized";
import { PageHeader, PageSection } from "@/components/site/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getPage, getTimeline } from "@/lib/content";
import { tx } from "@/lib/text";

const timelineTitle = { zh: "佳华大事记", fr: "Chronologie", en: "Our history" };

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
    const locale = (await params).locale as Locale;
    return { title: tx(getPage("about").title, locale) };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
    const locale = (await params).locale as Locale;
    const page = getPage("about");
    const t = getDictionary(locale);

    return (
        <>
            <PageSection className="pb-0 md:pb-0">
                <PageHeader locale={locale} eyebrow={t.nav.about} title={page.title} intro={page.intro} />
            </PageSection>
            <PageSection>
                <RichText value={page.body} locale={locale} className="max-w-3xl" />
            </PageSection>

            <PageSection className="border-t border-secondary">
                <h2 id="timeline" className="text-display-xs font-semibold text-primary md:text-display-sm">
                    {timelineTitle[locale]}
                </h2>
                {/* Vertical timeline: reads top to bottom on a phone, newest year first. */}
                <ol className="mt-10 max-w-3xl">
                    {getTimeline().map((year) => (
                        <li key={year.year} className="relative grid grid-cols-[4.5rem_1fr] gap-4 pb-10 last:pb-0 md:grid-cols-[6rem_1fr] md:gap-8">
                            <span className="text-xl font-semibold text-brand-tertiary tabular-nums md:text-display-xs">{year.year}</span>
                            <div className="relative border-l-2 border-secondary pl-6">
                                <span
                                    aria-hidden="true"
                                    className="absolute top-2 -left-[7px] size-3 rounded-full bg-fg-brand-primary ring-4 ring-bg-primary"
                                />
                                <ul className="flex flex-col gap-3">
                                    {year.events.map((event, i) => (
                                        <T key={i} as="li" value={event} locale={locale} className="text-md text-tertiary" />
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ol>
            </PageSection>
        </>
    );
}
