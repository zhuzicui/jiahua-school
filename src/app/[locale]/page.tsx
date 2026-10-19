import { ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { CourseIllustration, CourseTile } from "@/components/site/course-tile";
import { T } from "@/components/site/localized";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getCourseTypes, getCourses, getPage, getSettings } from "@/lib/content";
import { href } from "@/lib/navigation";

const heroTiles = [
    { type: "chinese", tilt: "-rotate-3" },
    { type: "math", tilt: "rotate-2 translate-y-4" },
    { type: "art", tilt: "rotate-1" },
    { type: "music", tilt: "-rotate-2 translate-y-4" },
] as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const courses = getCourses();
    const settings = getSettings();
    const home = getPage("home");

    return (
        <>
            {/* Hero */}
            <section className="mx-auto grid max-w-container items-center gap-12 overflow-x-clip px-4 pt-12 pb-16 md:px-8 md:pt-20 md:pb-24 lg:grid-cols-[1.15fr_1fr]">
                <div>
                    <T as="p" value={settings.tagline} locale={locale} className="mb-4 text-sm font-semibold text-brand-secondary md:text-md" />
                    <T
                        as="h1"
                        value={settings.siteName}
                        locale={locale}
                        className="text-display-md font-semibold text-primary md:text-display-lg lg:text-display-xl"
                    />
                    <T as="p" value={home.intro} locale={locale} className="mt-5 max-w-xl text-lg text-tertiary md:text-xl" />
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button href={href(locale, "/courses")} size="xl" iconTrailing={<ArrowRight data-icon="trailing" />}>
                            {t.home.findCourse}
                        </Button>
                        <Button href={href(locale, "/registration")} size="xl" color="secondary">
                            {t.common.register}
                        </Button>
                    </div>
                </div>
                <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4 pb-6 lg:mr-0">
                    <span aria-hidden="true" className="absolute -right-6 -bottom-4 size-44 rounded-full bg-[#a9bfe6]/70" />
                    {heroTiles.map(({ type, tilt }) => (
                        <CourseIllustration key={type} type={type} tilt={tilt} className="relative p-4 ring-[1.5px] ring-[#02204f]" />
                    ))}
                </div>
            </section>

            {/* Course categories */}
            <section className="mx-auto max-w-container px-4 pb-16 md:px-8 md:pb-24">
                <div className="rounded-3xl bg-secondary px-4 py-10 md:px-10 md:py-14">
                    <h2 className="text-display-xs font-semibold text-primary md:text-display-sm">{t.home.categories}</h2>
                    <p className="mt-3 max-w-2xl text-lg text-tertiary">{t.home.categoriesIntro}</p>
                    <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                        {getCourseTypes().map((type) => (
                            <li key={type.id}>
                                <CourseTile
                                    type={type}
                                    locale={locale}
                                    href={href(locale, `/courses?category=${type.id}`)}
                                    count={t.common.results(courses.filter((c) => c.category === type.id).length)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
}
