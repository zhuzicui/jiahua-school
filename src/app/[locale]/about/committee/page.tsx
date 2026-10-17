import type { Metadata } from "next";
import { PageHeader, PageSection } from "@/components/site/page-header";
import { PersonCard } from "@/components/site/person-card";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getCommittee } from "@/lib/content";

const intro = {
    zh: "佳华校委会负责学校日常管理。学校还设有语文、数学、英语和艺术等教研小组，以及一批负责学生管理、安全、卫生、档案、注册和排班的志愿人员。",
    en: "The school committee runs the school day to day, supported by subject teaching groups and many volunteers.",
    fr: "Le comité de l'école gère l'école au quotidien, avec des groupes pédagogiques par matière et de nombreux bénévoles.",
};

export async function generateMetadata({ params }: PageProps<"/[locale]/about/committee">): Promise<Metadata> {
    return { title: getDictionary((await params).locale as Locale).nav.committee };
}

export default async function CommitteePage({ params }: PageProps<"/[locale]/about/committee">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);

    return (
        <PageSection>
            <PageHeader locale={locale} eyebrow={t.nav.about} title={t.nav.committee} intro={intro} />
            <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getCommittee().map((person) => (
                    <li key={person.id}>
                        <PersonCard locale={locale} name={person.name} nameLatin={person.nameLatin} photo={person.photo} role={person.title} bio={person.bio} />
                    </li>
                ))}
            </ul>
        </PageSection>
    );
}
