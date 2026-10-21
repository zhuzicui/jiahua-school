import { ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { CourseTile } from "@/components/site/course-tile";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { T } from "@/components/site/localized";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getCourseTypes, getCourses, getPage, getSettings } from "@/lib/content";
import { href } from "@/lib/navigation";
import { pick } from "@/lib/text";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const courses = getCourses();
    const settings = getSettings();
    const home = getPage("home");

    return (
        <>
            {/* Hero: up to three slides, text on the left and a photo on the right */}
            <section className="mx-auto max-w-container overflow-x-clip px-4 pt-8 pb-16 md:px-8 md:pb-24 lg:pt-10">
                <HeroCarousel
                    slideLabel={t.home.slide}
                    slides={settings.heroSlides.slice(0, 3).map((slide, index) => (
                        <div key={slide.image} className="grid items-center gap-8 lg:h-[520px] lg:grid-cols-[1fr_1.1fr] lg:gap-12">
                            <div>
                                {index === 0 && (
                                    <T as="p" value={settings.tagline} locale={locale} className="mb-4 text-sm font-semibold text-brand-secondary md:text-md" />
                                )}
                                <T
                                    as={index === 0 ? "h1" : "h2"}
                                    value={slide.title ?? settings.siteName}
                                    locale={locale}
                                    className="text-display-md font-semibold text-primary md:text-display-lg lg:text-display-xl"
                                />
                                <T as="p" value={slide.intro ?? home.intro} locale={locale} className="mt-5 max-w-xl text-lg text-tertiary md:text-xl" />
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <Button href={href(locale, "/courses")} size="xl" iconTrailing={<ArrowRight data-icon="trailing" />}>
                                        {t.home.findCourse}
                                    </Button>
                                    <Button href={href(locale, "/registration")} size="xl" color="secondary">
                                        {t.common.register}
                                    </Button>
                                </div>
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element -- one fixed-size photo, already compressed */}
                            <img
                                src={slide.image}
                                alt={pick(slide.alt, locale).text}
                                width={1600}
                                height={1068}
                                fetchPriority={index === 0 ? "high" : undefined}
                                className="aspect-[4/3] w-full rounded-2xl object-cover lg:aspect-auto lg:h-full"
                            />
                        </div>
                    ))}
                />
            </section>

            {/* Course categories */}
            <section className="mx-auto max-w-container px-4 pb-16 md:px-8 md:pb-24">
                <div className="rounded-3xl bg-secondary px-4 py-10 md:px-10 md:py-14">
                    <h2 className="text-display-xs font-semibold text-primary md:text-display-sm">{t.home.categories}</h2>
                    <p className="mt-3 max-w-2xl text-lg text-tertiary">{t.home.categoriesIntro}</p>
                    <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
