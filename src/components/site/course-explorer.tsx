"use client";

import { useState } from "react";
import { Check, Clock, Copy01, Users01 } from "@untitledui/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { NativeSelect } from "@/components/base/select/select-native";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { courseIllustration, courseTint } from "@/lib/course-look";
import { pick } from "@/lib/text";
import type { Course, CourseType, Weekday } from "@/lib/types";
import { cx } from "@/utils/cx";

const dayOrder: Weekday[] = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];
const ADULT = 18;

/** "My child's age": a course fits when the age is inside its min/max. Adult shows adult courses only. */
const fitsAge = (course: Course, age: number) =>
    age >= ADULT ? course.ageMin >= ADULT : course.ageMin <= age && (course.ageMax === null || age <= course.ageMax);

const startMinutes = (time: string) => {
    const [h, m] = time.split(/[–-]/)[0].split(":").map(Number);
    return h * 60 + (m || 0);
};

const Text = ({ value, locale, className }: { value: Course["name"] | null; locale: Locale; className?: string }) => {
    const { text, isFallback } = pick(value, locale);
    if (!text) return null;
    return (
        <span lang={isFallback ? "zh-Hans" : undefined} className={className}>
            {text}
        </span>
    );
};

const CourseRow = ({ course, locale, showCategory, categoryLabel }: { course: Course; locale: Locale; showCategory?: boolean; categoryLabel?: string }) => {
    const t = getDictionary(locale);
    return (
        <li className="flex flex-col gap-2 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset md:flex-row md:items-center md:gap-6 md:px-5">
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <Text value={course.name} locale={locale} className="text-md font-semibold text-primary" />
                    <Badge type="color" size="sm" color="gray">
                        {course.code}
                    </Badge>
                    {showCategory && categoryLabel && (
                        <Badge type="pill-color" size="sm" color="brand">
                            {categoryLabel}
                        </Badge>
                    )}
                </div>
                {course.level && <Text value={course.level} locale={locale} className="mt-1 block text-sm text-tertiary" />}
            </div>
            <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-secondary md:w-80 md:shrink-0">
                <div className="flex items-center gap-1.5">
                    <dt>
                        <Clock aria-label={t.courses.time} className="size-4 text-fg-quaternary" />
                    </dt>
                    <dd className="tabular-nums">
                        {t.days[course.day]} {course.time}
                    </dd>
                </div>
                <div className="flex items-center gap-1.5">
                    <dt>
                        <Users01 aria-label={t.courses.ages} className="size-4 text-fg-quaternary" />
                    </dt>
                    <dd>{t.courses.ageRange(course.ageMin, course.ageMax)}</dd>
                </div>
                {course.fee !== null && (
                    <div className="flex items-center gap-1.5">
                        <dt className="text-tertiary">{t.courses.fee}</dt>
                        <dd className="tabular-nums">${course.fee}</dd>
                    </div>
                )}
            </dl>
        </li>
    );
};

export const CourseExplorer = ({
    locale,
    courses,
    courseTypes,
    registerHref,
}: {
    locale: Locale;
    courses: Course[];
    courseTypes: CourseType[];
    registerHref: string;
}) => {
    const t = getDictionary(locale);
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [copied, setCopied] = useState(false);

    const category = params.get("category") ?? "";
    const day = params.get("day") ?? "";
    const age = params.get("age") ?? "";
    const view = params.get("view") === "day" ? "day" : "list";

    const update = (key: string, value: string) => {
        const next = new URLSearchParams(params.toString());
        if (value) next.set(key, value);
        else next.delete(key);
        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    const label = (id: string) => pick(courseTypes.find((type) => type.id === id)?.label, locale).text;
    const filtered = courses.filter(
        (course) => (!category || course.category === category) && (!day || course.day === day) && (!age || fitsAge(course, Number(age))),
    );
    const days = dayOrder.filter((d) => courses.some((course) => course.day === d));
    const hasFilters = Boolean(category || day || age);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard can be blocked; the address bar still has the shareable URL.
        }
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Filters */}
            <div className="grid gap-4 rounded-2xl bg-secondary p-4 ring-1 ring-secondary ring-inset md:grid-cols-3 md:p-5">
                <NativeSelect
                    label={t.courses.age}
                    value={age}
                    onChange={(e) => update("age", e.target.value)}
                    options={[
                        { label: t.courses.anyAge, value: "" },
                        ...Array.from({ length: 15 }, (_, i) => ({ label: t.courses.ageYears(i + 3), value: String(i + 3) })),
                        { label: t.courses.adult, value: String(ADULT) },
                    ]}
                />
                <NativeSelect
                    label={t.courses.category}
                    value={category}
                    onChange={(e) => update("category", e.target.value)}
                    options={[
                        { label: t.courses.anyCategory, value: "" },
                        ...courseTypes.map((type) => ({ label: pick(type.label, locale).text, value: type.id })),
                    ]}
                />
                <NativeSelect
                    label={t.courses.day}
                    value={day}
                    onChange={(e) => update("day", e.target.value)}
                    options={[{ label: t.courses.anyDay, value: "" }, ...days.map((d) => ({ label: t.days[d], value: d }))]}
                />
            </div>

            {/* Result bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <p className="text-md font-semibold text-primary" aria-live="polite">
                        {t.common.results(filtered.length)}
                    </p>
                    {hasFilters && (
                        <Button
                            color="link-gray"
                            size="sm"
                            onClick={() => router.replace(view === "day" ? `${pathname}?view=day` : pathname, { scroll: false })}
                        >
                            {t.courses.clear}
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div role="radiogroup" aria-label={t.courses.viewList} className="inline-flex rounded-lg shadow-xs ring-1 ring-primary ring-inset">
                        {(["list", "day"] as const).map((v) => (
                            <button
                                key={v}
                                type="button"
                                role="radio"
                                aria-checked={view === v}
                                onClick={() => update("view", v === "day" ? "day" : "")}
                                className={cx(
                                    "cursor-pointer px-3.5 py-2 text-sm font-semibold outline-focus-ring transition duration-100 ease-linear first:rounded-l-lg last:rounded-r-lg focus-visible:outline-2 focus-visible:outline-offset-2",
                                    view === v ? "bg-secondary text-primary" : "text-secondary hover:bg-primary_hover",
                                    v === "day" && "border-l border-primary",
                                )}
                            >
                                {v === "list" ? t.courses.viewList : t.courses.viewByDay}
                            </button>
                        ))}
                    </div>
                    <Button color="secondary" size="sm" iconLeading={copied ? Check : Copy01} onClick={copyLink}>
                        {copied ? t.courses.copied : t.courses.share}
                    </Button>
                </div>
            </div>

            {filtered.length === 0 && (
                <div className="rounded-xl p-8 text-center ring-1 ring-secondary ring-inset">
                    <p className="text-md text-tertiary">{t.courses.none}</p>
                </div>
            )}

            {/* By category */}
            {view === "list" &&
                courseTypes
                    .filter((type) => filtered.some((course) => course.category === type.id))
                    .map((type) => {
                        const items = filtered
                            .filter((course) => course.category === type.id)
                            .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || startMinutes(a.time) - startMinutes(b.time));
                        return (
                            <section key={type.id} aria-labelledby={`cat-${type.id}`}>
                                <div className="mb-4 flex items-center gap-3">
                                    <span
                                        aria-hidden="true"
                                        style={{ "--tile": courseTint[type.id] } as React.CSSProperties}
                                        className="course-tile block w-14 rounded-lg p-1"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={courseIllustration[type.id]}
                                            alt=""
                                            width={160}
                                            height={160}
                                            className="aspect-square h-auto w-full object-contain"
                                        />
                                    </span>
                                    <h2 id={`cat-${type.id}`} className="text-xl font-semibold text-primary">
                                        {label(type.id)}
                                        <span className="ml-2 text-md font-normal text-tertiary">{items.length}</span>
                                    </h2>
                                </div>
                                <ul className="flex flex-col gap-2">
                                    {items.map((course) => (
                                        <CourseRow key={course.id} course={course} locale={locale} />
                                    ))}
                                </ul>
                            </section>
                        );
                    })}

            {/* By day: the weekly timetable */}
            {view === "day" &&
                days
                    .filter((d) => filtered.some((course) => course.day === d))
                    .map((d) => {
                        const items = filtered
                            .filter((course) => course.day === d)
                            .sort((a, b) => startMinutes(a.time) - startMinutes(b.time) || a.code.localeCompare(b.code));
                        const times = [...new Set(items.map((course) => course.time))];
                        return (
                            <section key={d} aria-labelledby={`day-${d}`}>
                                <h2 id={`day-${d}`} className="mb-4 text-xl font-semibold text-primary">
                                    {t.days[d]}
                                    <span className="ml-2 text-md font-normal text-tertiary">{items.length}</span>
                                </h2>
                                <div className="flex flex-col gap-6">
                                    {times.map((time) => (
                                        <div key={time}>
                                            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-tertiary tabular-nums">
                                                <Clock aria-hidden="true" className="size-4 text-fg-quaternary" />
                                                {time}
                                            </h3>
                                            <ul className="flex flex-col gap-2">
                                                {items
                                                    .filter((course) => course.time === time)
                                                    .map((course) => (
                                                        <CourseRow
                                                            key={course.id}
                                                            course={course}
                                                            locale={locale}
                                                            showCategory
                                                            categoryLabel={label(course.category)}
                                                        />
                                                    ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}

            {/* Register */}
            <div className="flex flex-col items-start gap-4 rounded-2xl bg-brand-section p-6 md:flex-row md:items-center md:justify-between md:p-8">
                <p className="text-xl font-semibold text-primary_on-brand">{t.courses.registerHint}</p>
                <Button href={registerHref} size="xl" color="secondary">
                    {t.common.register}
                </Button>
            </div>
        </div>
    );
};
