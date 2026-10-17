import { ArrowLeft, ArrowUpRight } from "@untitledui/icons";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { RichText, T } from "@/components/site/localized";
import { PageSection } from "@/components/site/page-header";
import { type Locale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { formatDate } from "@/lib/calendar";
import { getNews, getNewsPost } from "@/lib/content";
import { href } from "@/lib/navigation";
import { pick, tx } from "@/lib/text";

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) => getNews().map((post) => ({ locale, id: post.id })));

export async function generateMetadata({ params }: PageProps<"/[locale]/news/[id]">): Promise<Metadata> {
    const { locale, id } = await params;
    const post = getNewsPost(id);
    return post ? { title: tx(post.title, locale as Locale), description: tx(post.summary, locale as Locale) || undefined } : {};
}

export default async function NewsPostPage({ params }: PageProps<"/[locale]/news/[id]">) {
    const { locale: raw, id } = await params;
    const locale = raw as Locale;
    const post = getNewsPost(id);
    if (!post) notFound();
    const t = getDictionary(locale);
    const hasBody = Boolean(pick(post.body, locale).text);

    return (
        <PageSection className="max-w-3xl">
            <Button href={href(locale, "/news")} color="link-gray" size="md" iconLeading={<ArrowLeft data-icon="leading" />}>
                {t.news.title}
            </Button>
            <article className="mt-8">
                {post.date && (
                    <time dateTime={post.date} className="text-md font-semibold text-brand-secondary">
                        {formatDate(post.date, locale)}
                    </time>
                )}
                <T as="h1" value={post.title} locale={locale} className="mt-3 text-display-xs font-semibold text-primary md:text-display-sm" />
                <div className="mt-8">
                    {hasBody ? (
                        <RichText value={post.body} locale={locale} />
                    ) : (
                        <p className="rounded-lg bg-secondary px-4 py-3 text-md text-tertiary">{t.news.moving}</p>
                    )}
                </div>
                {post.link && (
                    <div className="mt-8">
                        <Button href={post.link} target="_blank" rel="noopener noreferrer" size="lg" iconTrailing={<ArrowUpRight data-icon="trailing" />}>
                            {t.news.link}
                        </Button>
                    </div>
                )}
            </article>
        </PageSection>
    );
}
