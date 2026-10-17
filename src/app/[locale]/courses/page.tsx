import { Suspense } from "react";
import type { Metadata } from "next";
import { Button } from "@/components/base/buttons/button";
import { CourseExplorer } from "@/components/site/course-explorer";
import { PageHeader, PageSection } from "@/components/site/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getCourseTypes, getCourses, getSettings } from "@/lib/content";
import { href } from "@/lib/navigation";

export async function generateMetadata({ params }: PageProps<"/[locale]/courses">): Promise<Metadata> {
    return { title: getDictionary((await params).locale as Locale).courses.title };
}

export default async function CoursesPage({ params }: PageProps<"/[locale]/courses">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const registerHref = href(locale, "/registration");

    return (
        <PageSection>
            <PageHeader
                locale={locale}
                eyebrow={`${t.nav.courses} · ${getSettings().schoolYear}`}
                title={t.courses.title}
                intro={t.courses.intro}
                actions={
                    <Button href={registerHref} size="lg">
                        {t.common.register}
                    </Button>
                }
            />
            <div className="mt-10">
                <Suspense>
                    <CourseExplorer locale={locale} courses={getCourses()} courseTypes={getCourseTypes()} registerHref={registerHref} />
                </Suspense>
            </div>
        </PageSection>
    );
}
