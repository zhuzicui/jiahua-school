import { Image01 } from "@untitledui/icons";
import type { Metadata } from "next";
import { ArtGallery } from "@/components/site/art-gallery";
import { SimpleEmptyState } from "@/components/site/empty-state";
import { PageHeader, PageSection } from "@/components/site/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getArt } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[locale]/student-work/art">): Promise<Metadata> {
    return { title: getDictionary((await params).locale as Locale).nav.art };
}

export default async function ArtPage({ params }: PageProps<"/[locale]/student-work/art">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const works = getArt();

    return (
        <PageSection>
            <PageHeader locale={locale} eyebrow={t.nav.studentWork} title={t.nav.art} intro={t.work.artIntro} />
            <div className="mt-10">
                {works.length === 0 ? (
                    <SimpleEmptyState icon={<Image01 className="size-6" />} title={t.work.emptyArt} />
                ) : (
                    <ArtGallery locale={locale} works={works} />
                )}
            </div>
        </PageSection>
    );
}
