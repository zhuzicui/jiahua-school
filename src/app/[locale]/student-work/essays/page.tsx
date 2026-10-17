import { File06, LinkExternal01 } from "@untitledui/icons";
import type { Metadata } from "next";
import { SimpleEmptyState } from "@/components/site/empty-state";
import { T } from "@/components/site/localized";
import { PageHeader, PageSection } from "@/components/site/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getEssays } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/student-work/essays">): Promise<Metadata> {
    return { title: getDictionary((await params).locale as Locale).nav.essays };
}

export default async function EssaysPage({ params }: PageProps<"/[locale]/student-work/essays">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const essays = getEssays();
    const years = [...new Set(essays.map((e) => e.schoolYear))].sort().reverse();

    return (
        <PageSection>
            <PageHeader locale={locale} eyebrow={t.nav.studentWork} title={t.nav.essays} intro={t.work.essaysIntro} />
            <p className="mt-4 text-sm text-quaternary">{t.work.privacy}</p>
            <div className="mt-10 flex max-w-3xl flex-col gap-10">
                {essays.length === 0 && <SimpleEmptyState icon={<File06 className="size-6" />} title={t.common.comingSoon} />}
                {years.map((year) => (
                    <section key={year} aria-labelledby={`y-${year}`}>
                        <h2 id={`y-${year}`} className="text-xl font-semibold text-primary">
                            {t.work.schoolYear(year)}
                        </h2>
                        <ul className="mt-3 divide-y divide-secondary border-y border-secondary">
                            {essays
                                .filter((e) => e.schoolYear === year)
                                .map((essay) => (
                                    <li key={essay.id}>
                                        {/* Opens the PDF in the browser's viewer, not a forced download. */}
                                        <a
                                            href={essay.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-4 py-4 outline-focus-ring focus-visible:outline-2"
                                        >
                                            <File06 aria-hidden="true" className="size-5 shrink-0 text-fg-quaternary" />
                                            <span className="flex-1">
                                                <T
                                                    value={essay.title}
                                                    locale={locale}
                                                    className="block text-md font-semibold text-primary group-hover:underline"
                                                />
                                                {(essay.student || essay.class) && (
                                                    <span className="text-sm text-tertiary">{[essay.student, essay.class].filter(Boolean).join(" · ")}</span>
                                                )}
                                            </span>
                                            <LinkExternal01 aria-hidden="true" className="size-4 shrink-0 text-fg-quaternary" />
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    </section>
                ))}
            </div>
        </PageSection>
    );
}
