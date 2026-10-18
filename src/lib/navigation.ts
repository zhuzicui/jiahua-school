import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";

export type NavLink = { label: string; href: string };
export type NavSection = { id: string; label: string; href?: string; items?: NavLink[] };

/** Localized path: href("zh", "/courses") -> "/zh/courses" */
export const href = (locale: Locale, path = "") => `/${locale}${path === "/" ? "" : path}`;

/**
 * The menu from the PRD's recommended sitemap. Summer Camps and Contest Results
 * stay hidden until their content is defined; Registration opens from the
 * "Register" button on Courses rather than the menu.
 */
export const getNavigation = (locale: Locale): NavSection[] => {
    const t = getDictionary(locale).nav;
    const l = (path: string) => href(locale, path);
    return [
        {
            id: "about",
            label: t.about,
            items: [
                { label: t.aboutJiahua, href: l("/about") },
                { label: t.committee, href: l("/about/committee") },
                { label: t.teachers, href: l("/about/teachers") },
                { label: t.insights, href: l("/about/insights") },
            ],
        },
        {
            id: "courses",
            label: t.courses,
            items: [
                { label: t.courseList, href: l("/courses") },
                { label: t.calendar, href: l("/calendar") },
                { label: t.faq, href: l("/faq") },
            ],
        },
        {
            id: "student-work",
            label: t.studentWork,
            items: [
                { label: t.essays, href: l("/student-work/essays") },
                { label: t.art, href: l("/student-work/art") },
                { label: t.magazine, href: l("/student-work/magazine") },
            ],
        },
        { id: "news", label: t.news, href: l("/news") },
        { id: "contact", label: t.contact, href: l("/contact") },
    ];
};
