import { Suspense } from "react";
import type { Metadata } from "next";
import { FallbackNotice } from "@/components/site/localized";
import { PageHeader, PageSection } from "@/components/site/page-header";
import { TeacherDirectory } from "@/components/site/teacher-directory";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getCourseTypes, getTeachers } from "@/lib/content";

const intro = {
    zh: "各科教师均受过高等教育并有教学经验。全校有40多位教师获中国侨办授予“海外优秀华文教师”等称号。",
    en: "All of our teachers hold university degrees and have classroom experience. More than 40 have received awards for overseas Chinese teaching.",
    fr: "Tous nos enseignants ont une formation universitaire et de l'expérience en classe. Plus de 40 ont été primés pour l'enseignement du chinois à l'étranger.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/about/teachers">): Promise<Metadata> {
    return { title: getDictionary((await params).locale as Locale).nav.teachers };
}

export default async function TeachersPage({ params }: PageProps<"/[locale]/about/teachers">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const teachers = getTeachers();
    const bioMissing = locale !== "zh" && teachers.some((teacher) => !teacher.bio[locale]);

    return (
        <PageSection>
            <PageHeader locale={locale} eyebrow={t.nav.about} title={t.nav.teachers} intro={intro} />
            {bioMissing && <FallbackNotice locale={locale} className="mt-8 max-w-3xl" />}
            <div className="mt-8">
                <Suspense>
                    <TeacherDirectory locale={locale} teachers={teachers} courseTypes={getCourseTypes()} />
                </Suspense>
            </div>
        </PageSection>
    );
}
