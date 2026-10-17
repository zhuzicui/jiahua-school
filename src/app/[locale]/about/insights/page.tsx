import type { Metadata } from "next";
import { FallbackNotice } from "@/components/site/localized";
import { PageHeader, PageSection } from "@/components/site/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getPage } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { pick, tx } from "@/lib/text";

export async function generateMetadata({ params }: PageProps<"/[locale]/about/insights">): Promise<Metadata> {
    return { title: tx(getPage("insights").title, (await params).locale as Locale) };
}

export default async function InsightsPage({ params }: PageProps<"/[locale]/about/insights">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const page = getPage("insights");
    const body = pick(page.body, locale);
    const { html, headings } = renderMarkdown(body.text);

    return (
        <PageSection>
            <PageHeader locale={locale} eyebrow={t.nav.about} title={page.title} intro={page.intro} />
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_16rem] lg:gap-16">
                <div className="min-w-0">
                    {body.isFallback && <FallbackNotice locale={locale} className="mb-6" />}
                    <div lang={body.isFallback ? "zh-Hans" : undefined} className="prose max-w-3xl md:prose-lg" dangerouslySetInnerHTML={{ __html: html }} />
                </div>
                {headings.length > 1 && (
                    <nav aria-label={t.common.pageOutline} className="order-first lg:order-last">
                        <div className="rounded-xl p-4 ring-1 ring-secondary ring-inset lg:sticky lg:top-24">
                            <h2 className="text-sm font-semibold text-quaternary">{t.common.pageOutline}</h2>
                            <ul className="mt-3 flex flex-col gap-2">
                                {headings.map((heading) => (
                                    <li key={heading.id}>
                                        <a href={`#${heading.id}`} className="text-md font-semibold text-tertiary hover:text-tertiary_hover">
                                            {heading.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                )}
            </div>
        </PageSection>
    );
}
