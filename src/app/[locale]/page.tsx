import { ArrowRight, CalendarDate } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { CourseIllustration, CourseTile } from "@/components/site/course-tile";
import { T } from "@/components/site/localized";
import { NewsCard } from "@/components/site/news-card";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { formatDate, nextClassDay, todayInMontreal } from "@/lib/calendar";
import { getCalendar, getCourseTypes, getCourses, getNews, getPage, getPromotedNews, getSettings, getTeachers } from "@/lib/content";
import { href } from "@/lib/navigation";

// "Next class day" and promoted notices depend on today's date: refresh hourly.
export const revalidate = 3600;

const heroTiles = [
    { type: "chinese", tilt: "-rotate-3" },
    { type: "math", tilt: "rotate-2 translate-y-4" },
    { type: "art", tilt: "rotate-1" },
    { type: "music", tilt: "-rotate-2 translate-y-4" },
] as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const today = todayInMontreal();
    const next = nextClassDay(getCalendar(), today);
    const promoted = getPromotedNews(today);
    const latest = getNews()
        .filter((post) => post.date && !promoted.includes(post))
        .slice(0, 3);
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

            {/* Next class day */}
            <section className="mx-auto max-w-container px-4 md:px-8">
                <a
                    href={href(locale, "/calendar")}
                    className="group flex items-center gap-4 rounded-2xl bg-secondary p-5 ring-1 ring-secondary outline-focus-ring transition duration-100 ease-linear ring-inset hover:bg-secondary_hover focus-visible:outline-2 md:p-6"
                >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-fg-brand-primary">
                        <CalendarDate aria-hidden="true" className="size-6" />
                    </span>
                    <span className="flex-1">
                        <span className="block text-sm font-semibold text-tertiary">{t.home.nextClass}</span>
                        <span className="block text-lg font-semibold text-primary md:text-xl">
                            {next ? formatDate(next, locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : t.home.noClassComing}
                        </span>
                    </span>
                    <ArrowRight
                        aria-hidden="true"
                        className="size-5 shrink-0 text-fg-quaternary transition duration-100 ease-linear group-hover:translate-x-0.5"
                    />
                </a>
            </section>

            {/* Promoted notices */}
            {promoted.length > 0 && (
                <section className="mx-auto max-w-container px-4 pt-12 md:px-8 md:pt-16">
                    <h2 className="text-display-xs font-semibold text-primary">{t.home.promoted}</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {promoted.map((post) => (
                            <NewsCard key={post.id} post={post} locale={locale} featured />
                        ))}
                    </div>
                </section>
            )}

            {/* Course categories */}
            <section className="mx-auto max-w-container px-4 pt-16 md:px-8 md:pt-24">
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

            {/* Latest news */}
            {latest.length > 0 && (
                <section className="mx-auto max-w-container px-4 pt-16 md:px-8 md:pt-24">
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="text-display-xs font-semibold text-primary md:text-display-sm">{t.home.latestNews}</h2>
                        <Button href={href(locale, "/news")} color="link-color" size="lg" iconTrailing={<ArrowRight data-icon="trailing" />}>
                            {t.common.viewAll}
                        </Button>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {latest.map((post) => (
                            <NewsCard key={post.id} post={post} locale={locale} />
                        ))}
                    </div>
                </section>
            )}

            {/* Facts */}
            <section className="mx-auto max-w-container px-4 py-16 md:px-8 md:py-24">
                <dl className="grid grid-cols-3 gap-4 border-t border-secondary pt-10 text-center md:gap-8">
                    {[
                        { value: "1994", label: t.home.factsFounded },
                        { value: String(courses.length), label: t.home.factsCourses },
                        { value: String(getTeachers().length), label: t.home.factsTeachers },
                    ].map((fact) => (
                        <div key={fact.label} className="flex flex-col-reverse gap-2">
                            <dt className="text-md font-medium text-tertiary">{fact.label}</dt>
                            <dd className="text-display-sm font-semibold text-brand-tertiary tabular-nums md:text-display-lg">{fact.value}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </>
    );
}
