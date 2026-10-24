import { HomeView } from "@/components/site/home-view";
import type { Locale } from "@/i18n/config";
import { getCourseCounts, getCourseTypes, getHome } from "@/lib/content";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
    const locale = (await params).locale as Locale;
    return <HomeView content={getHome()} locale={locale} courseTypes={getCourseTypes()} counts={getCourseCounts()} />;
}
