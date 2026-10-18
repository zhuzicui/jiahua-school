import { MinusCircle, PlusCircle } from "@untitledui/icons";
import type { Metadata } from "next";
import { Button } from "@/components/base/buttons/button";
import { FallbackNotice, T } from "@/components/site/localized";
import { PageHeader, PageSection } from "@/components/site/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getFaq } from "@/lib/content";
import { href } from "@/lib/navigation";
import type { FaqTopic } from "@/lib/types";

const topicOrder: FaqTopic[] = ["registration", "payment", "classes", "school", "visit"];
const intro = { zh: "家长最常问的问题。", en: "The questions parents ask most often.", fr: "Les questions que les parents posent le plus souvent." };

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">): Promise<Metadata> {
    return { title: getDictionary((await params).locale as Locale).nav.faq };
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const faq = getFaq();
    const missing = locale !== "zh" && faq.some((item) => !item.a[locale]);

    return (
        <PageSection>
            <PageHeader locale={locale} eyebrow={t.nav.courses} title={t.nav.faq} intro={intro} />
            {missing && <FallbackNotice locale={locale} className="mt-8 max-w-3xl" />}
            <div className="mt-10 flex max-w-3xl flex-col gap-10">
                {topicOrder
                    .filter((topic) => faq.some((item) => item.topic === topic))
                    .map((topic) => (
                        <section key={topic} aria-labelledby={`topic-${topic}`}>
                            <h2 id={`topic-${topic}`} className="text-xl font-semibold text-primary">
                                {t.faq.topics[topic]}
                            </h2>
                            <div className="mt-3 divide-y divide-secondary border-y border-secondary">
                                {faq
                                    .filter((item) => item.topic === topic)
                                    .map((item) => (
                                        <details key={item.id} className="group py-5">
                                            <summary className="flex cursor-pointer items-start justify-between gap-4">
                                                <T value={item.q} locale={locale} className="text-lg font-medium text-primary" />
                                                <PlusCircle aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-fg-quaternary group-open:hidden" />
                                                <MinusCircle aria-hidden="true" className="mt-0.5 hidden size-6 shrink-0 text-fg-quaternary group-open:block" />
                                            </summary>
                                            <T as="p" value={item.a} locale={locale} className="mt-3 pr-10 text-md text-tertiary" />
                                        </details>
                                    ))}
                            </div>
                        </section>
                    ))}

                <div className="flex flex-col items-start gap-4 rounded-2xl bg-secondary p-6 md:flex-row md:items-center md:justify-between">
                    <p className="text-lg font-semibold text-primary">{t.faq.stillQuestions}</p>
                    <Button href={href(locale, "/contact")} color="secondary" size="lg">
                        {t.faq.contactUs}
                    </Button>
                </div>
            </div>
        </PageSection>
    );
}
