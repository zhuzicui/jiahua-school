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
            <section className="relative overflow-x-clip bg-secondary">
                <div className="mx-auto max-w-container px-4 pt-8 pb-8 md:px-8 lg:pt-6 lg:pb-0">
                    <HeroCarousel
                        slideLabel={t.home.slide}
                        slides={settings.heroSlides.slice(0, 3).map((slide, index) => (
                            <div key={slide.image} className="grid items-center gap-8 lg:h-[400px] lg:grid-cols-[1fr_1fr] lg:gap-12">
                                <div>
                                    {index === 0 && (
                                        <T
                                            as="p"
                                            value={settings.tagline}
                                            locale={locale}
                                            className="mb-4 text-sm font-semibold text-brand-secondary md:text-md"
                                        />
                                    )}
                                    <T
                                        as={index === 0 ? "h1" : "h2"}
                                        value={slide.title ?? settings.siteName}
                                        locale={locale}
                                        className="text-display-md font-semibold text-primary md:text-display-lg xl:text-display-xl"
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
                                <div className="relative mx-auto aspect-square w-full max-w-md lg:mr-0 lg:max-w-[400px]">
                                    <span
                                        aria-hidden="true"
                                        style={{ "--morph": "12s", "--drift": "9s", "--delay": "-3s" } as React.CSSProperties}
                                        className="hero-blob absolute top-3 right-3 size-1/3 bg-utility-blue-100"
                                    />
                                    <span
                                        aria-hidden="true"
                                        style={{ "--morph": "16s", "--drift": "13s", "--delay": "-7s" } as React.CSSProperties}
                                        className="hero-blob absolute bottom-3 left-3 size-2/5 bg-brand-secondary"
                                    />
                                    <div
                                        style={{ "--morph": "18s", "--drift": "15s", "--delay": "-5s" } as React.CSSProperties}
                                        className="hero-blob absolute inset-[8%] overflow-hidden"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element -- one fixed-size photo, already compressed */}
                                        <img
                                            src={slide.image}
                                            alt={pick(slide.alt, locale).text}
                                            width={1600}
                                            height={1068}
                                            fetchPriority={index === 0 ? "high" : undefined}
                                            className="size-full object-cover object-[60%_center]"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    />
                </div>
                {/* Curvy line between the hero and the course categories */}
                <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-12 w-full fill-[var(--color-bg-primary)] md:h-16">
                    <path d="M0 72 C 120 8, 300 8, 420 60 S 700 116, 840 64 S 1100 4, 1240 48 S 1400 96, 1440 80 V120 H0 Z" />
                </svg>
            </section>

            {/* Course categories */}
            <section className="-mt-px bg-primary">
                <div className="mx-auto max-w-container px-4 pt-4 pb-16 md:px-8 md:pb-24">
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
