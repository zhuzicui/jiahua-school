import { ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { CourseTile } from "@/components/site/course-tile";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { T } from "@/components/site/localized";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { href } from "@/lib/navigation";
import { pick } from "@/lib/text";
import type { CourseType, CourseTypeId, HomeContent } from "@/lib/types";
import { cx } from "@/utils/cx";

type HomeViewProps = {
    content: HomeContent;
    locale: Locale;
    courseTypes: CourseType[];
    /** Number of courses per course type. */
    counts: Partial<Record<CourseTypeId, number>>;
};

/**
 * The home page body. The public page and the editor preview at /admin/home both render it,
 * so what staff see while editing is exactly what parents will see.
 */
export const HomeView = ({ content, locale, courseTypes, counts }: HomeViewProps) => {
    const t = getDictionary(locale);
    const { hero, categories, layout } = content;
    const photoLeft = layout.photoSide === "left";

    return (
        <>
            {/* Hero: up to three slides, text on one side and a photo on the other */}
            <section className={cx("relative overflow-x-clip", layout.heroBackground === "white" ? "bg-primary" : "bg-secondary")}>
                <div className="mx-auto max-w-container px-4 pt-8 pb-8 md:px-8 md:pt-6 md:pb-0">
                    <HeroCarousel
                        slideLabel={t.home.slide}
                        slides={hero.slides.slice(0, 3).map((slide, index) => (
                            <div
                                key={index}
                                className={cx(
                                    "grid items-center gap-2 md:h-[400px] md:gap-8 lg:gap-12",
                                    photoLeft ? "md:grid-cols-[1fr_2fr]" : "md:grid-cols-[2fr_1fr]",
                                )}
                            >
                                <div className={cx(photoLeft && "md:order-2")}>
                                    {index === 0 && (
                                        <T as="p" value={hero.tagline} locale={locale} className="mb-3 text-sm font-semibold text-brand-secondary md:text-md" />
                                    )}
                                    <T
                                        as={index === 0 ? "h1" : "h2"}
                                        value={slide.title}
                                        locale={locale}
                                        className="text-display-md font-semibold text-primary lg:text-display-lg"
                                    />
                                    <T as="p" value={slide.intro} locale={locale} className="mt-4 max-w-xl text-md text-tertiary md:text-lg" />
                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                        <Button
                                            href={href(locale, "/courses")}
                                            size="xl"
                                            className="md:gap-1 md:px-3.5 md:py-2.5 md:text-sm"
                                            iconTrailing={<ArrowRight data-icon="trailing" />}
                                        >
                                            {t.home.findCourse}
                                        </Button>
                                        <Button
                                            href={href(locale, "/registration")}
                                            size="xl"
                                            color="secondary"
                                            className="md:gap-1 md:px-3.5 md:py-2.5 md:text-sm"
                                        >
                                            {t.common.register}
                                        </Button>
                                    </div>
                                </div>
                                <div
                                    className={cx(
                                        "relative mx-auto mb-8 aspect-square w-4/5 max-w-sm md:mb-0 md:w-[85%] md:max-w-[340px]",
                                        photoLeft ? "md:order-1 md:ml-[12%]" : "md:mr-[12%]",
                                    )}
                                >
                                    <div aria-hidden="true" style={{ "--orbit": "38s" } as React.CSSProperties} className="hero-orbit absolute inset-0">
                                        <span
                                            style={{ "--morph": "6s", "--drift": "8.5s", "--delay": "-2s" } as React.CSSProperties}
                                            className="hero-blob absolute top-[4%] left-[64%] size-[32%] bg-utility-blue-100"
                                        />
                                    </div>
                                    <div
                                        aria-hidden="true"
                                        style={{ "--orbit": "47s", "--orbit-direction": "reverse" } as React.CSSProperties}
                                        className="hero-orbit absolute inset-0"
                                    >
                                        <span
                                            style={{ "--morph": "7.5s", "--drift": "10.5s", "--delay": "-4s" } as React.CSSProperties}
                                            className="hero-blob absolute top-[60%] left-[4%] size-[36%] bg-brand-secondary"
                                        />
                                    </div>
                                    <div
                                        style={{ "--morph": "8s", "--drift": "11s", "--delay": "-1s" } as React.CSSProperties}
                                        className="hero-blob absolute inset-[6%] overflow-hidden bg-tertiary"
                                    >
                                        {slide.image && (
                                            /* eslint-disable-next-line @next/next/no-img-element -- one fixed-size photo, already compressed */
                                            <img
                                                src={slide.image}
                                                alt={pick(slide.alt, locale).text}
                                                width={1600}
                                                height={1068}
                                                fetchPriority={index === 0 ? "high" : undefined}
                                                className="size-full object-cover object-[60%_center]"
                                            />
                                        )}
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
            {layout.showCategories && (
                <section className="-mt-px bg-primary">
                    <div className="mx-auto max-w-container px-4 pt-4 pb-16 md:px-8 md:pb-24">
                        <T as="h2" value={categories.title} locale={locale} className="text-display-xs font-semibold text-primary md:text-display-sm" />
                        <T as="p" value={categories.intro} locale={locale} className="mt-3 max-w-2xl text-lg text-tertiary" />
                        <ul
                            className={cx(
                                "mt-8 grid grid-cols-1 gap-3 min-[500px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
                                layout.categoryColumns === 6 && "lg:grid-cols-6",
                            )}
                        >
                            {courseTypes.map((type) => (
                                <li key={type.id}>
                                    <CourseTile
                                        type={type}
                                        locale={locale}
                                        href={href(locale, `/courses?category=${type.id}`)}
                                        count={t.common.results(counts[type.id] ?? 0)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </>
    );
};
