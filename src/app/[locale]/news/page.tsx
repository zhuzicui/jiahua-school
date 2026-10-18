import type { Metadata } from "next";
import { NewsCard } from "@/components/site/news-card";
import { PageHeader, PageSection } from "@/components/site/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getNews } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/news">): Promise<Metadata> {
    return { title: getDictionary((await params).locale as Locale).news.title };
}

export default async function NewsPage({ params }: PageProps<"/[locale]/news">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const news = getNews();
    const dated = news.filter((post) => post.date);
    const undated = news.filter((post) => !post.date);

    return (
        <PageSection>
            <PageHeader locale={locale} title={t.news.title} intro={t.news.intro} />
            <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dated.map((post) => (
                    <li key={post.id}>
                        <NewsCard post={post} locale={locale} />
                    </li>
                ))}
            </ul>
            {undated.length > 0 && (
                <>
                    <h2 className="mt-14 text-xl font-semibold text-primary">{t.news.undated}</h2>
                    <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {undated.map((post) => (
                            <li key={post.id}>
                                <NewsCard post={post} locale={locale} />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </PageSection>
    );
}
