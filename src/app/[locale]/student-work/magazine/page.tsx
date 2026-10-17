import { BookOpen01 } from "@untitledui/icons";
import type { Metadata } from "next";
import { SimpleEmptyState } from "@/components/site/empty-state";
import { T } from "@/components/site/localized";
import { PageHeader, PageSection } from "@/components/site/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { formatDate } from "@/lib/calendar";
import { getMagazine } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/student-work/magazine">): Promise<Metadata> {
    return { title: getDictionary((await params).locale as Locale).nav.magazine };
}

export default async function MagazinePage({ params }: PageProps<"/[locale]/student-work/magazine">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const issues = getMagazine();

    return (
        <PageSection>
            <PageHeader
                locale={locale}
                eyebrow={t.nav.studentWork}
                title={locale === "zh" ? "《百花园》校刊" : `${t.nav.magazine} 《百花园》`}
                intro={t.work.magazineIntro}
            />
            <div className="mt-10">
                {issues.length === 0 ? (
                    <SimpleEmptyState icon={<BookOpen01 className="size-6" />} title={t.work.emptyMagazine} />
                ) : (
                    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                        {issues.map((issue) => (
                            <li key={issue.id}>
                                <a href={issue.pdf} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-3">
                                    <span className="block aspect-[3/4] overflow-hidden rounded-lg bg-secondary ring-1 ring-secondary">
                                        {issue.cover && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={issue.cover} alt="" className="size-full object-cover transition duration-150 group-hover:scale-105" />
                                        )}
                                    </span>
                                    <T value={issue.title} locale={locale} className="text-md font-semibold text-primary" />
                                    <time dateTime={issue.issueDate} className="text-sm text-tertiary">
                                        {formatDate(issue.issueDate, locale, { year: "numeric", month: "long" })}
                                    </time>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </PageSection>
    );
}
