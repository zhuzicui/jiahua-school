"use client";

import { Award01 } from "@untitledui/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar } from "@/components/base/avatar/avatar";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pick } from "@/lib/text";
import type { CourseType, Teacher } from "@/lib/types";
import { FilterChips } from "./filter-chips";

const initials = (teacher: Teacher) => {
    const parts = teacher.nameLatin.trim().split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : teacher.name.slice(0, 1);
};

/** 74 teachers: always filtered by course type (first type selected by default), never one long scroll. */
export const TeacherDirectory = ({ locale, teachers, courseTypes }: { locale: Locale; teachers: Teacher[]; courseTypes: CourseType[] }) => {
    const t = getDictionary(locale);
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const types = courseTypes.filter((type) => teachers.some((teacher) => teacher.courseTypes.includes(type.id)));
    const selected = types.find((type) => type.id === params.get("type"))?.id ?? types[0]?.id;
    const shown = teachers.filter((teacher) => teacher.courseTypes.includes(selected));

    return (
        <div className="flex flex-col gap-6">
            <FilterChips
                label={t.teachers.filter}
                value={selected}
                onChange={(value) => router.replace(`${pathname}?type=${value}`, { scroll: false })}
                options={types.map((type) => ({
                    value: type.id,
                    label: pick(type.label, locale).text,
                    count: teachers.filter((teacher) => teacher.courseTypes.includes(type.id)).length,
                }))}
            />
            <p className="text-sm text-tertiary" aria-live="polite">
                {t.teachers.count(shown.length)}
            </p>
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((teacher) => {
                    const bio = pick(teacher.bio, locale);
                    return (
                        <li key={teacher.id}>
                            <article className="flex h-full flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary ring-inset">
                                <div className="flex items-center gap-4">
                                    <Avatar size="xl" src={teacher.photo} alt={teacher.photo ? teacher.name : undefined} initials={initials(teacher)} />
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold text-primary">{teacher.name}</h3>
                                        <p className="text-md text-tertiary">{teacher.nameLatin}</p>
                                    </div>
                                </div>
                                {teacher.award && (
                                    <p className="flex w-fit items-center gap-1.5 rounded-full bg-utility-brand-50 px-2.5 py-0.5 text-sm font-medium text-utility-brand-700 ring-1 ring-utility-brand-200 ring-inset">
                                        <Award01 aria-hidden="true" className="size-3.5" />
                                        {t.teachers.award}
                                    </p>
                                )}
                                {bio.text && (
                                    <p lang={bio.isFallback ? "zh-Hans" : undefined} className="text-md text-tertiary">
                                        {bio.text}
                                    </p>
                                )}
                            </article>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
