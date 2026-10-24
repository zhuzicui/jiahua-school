/**
 * Content access. For the first milestone the content is seeded JSON in src/content
 * (exported from the CMS prototype). The CMS milestone swaps these functions for
 * database reads; pages only talk to this module.
 */
import artData from "@/content/art.json";
import calendarData from "@/content/calendar.json";
import committeeData from "@/content/committee.json";
import coursesData from "@/content/courses.json";
import essaysData from "@/content/essays.json";
import faqData from "@/content/faq.json";
import homeData from "@/content/home.json";
import magazineData from "@/content/magazine.json";
import newsData from "@/content/news.json";
import pagesData from "@/content/pages.json";
import settingsData from "@/content/settings.json";
import teachersData from "@/content/teachers.json";
import timelineData from "@/content/timeline.json";
import type {
    ArtWork,
    CommitteeMember,
    Course,
    CourseTypeId,
    Essay,
    FaqItem,
    HomeContent,
    MagazineIssue,
    NewsPost,
    RichPage,
    SchoolCalendar,
    SiteSettings,
    Teacher,
    TimelineYear,
} from "./types";

export type PageKey = "about" | "insights" | "registration" | "contact" | "home";

export const getSettings = () => settingsData as SiteSettings;
export const getHome = () => homeData as HomeContent;
export const getCourseTypes = () => getSettings().courseTypes;
export const getCourses = () => coursesData as Course[];
/** Number of courses per course type, for the home page tiles. */
export const getCourseCounts = () => {
    const counts: Partial<Record<CourseTypeId, number>> = {};
    for (const course of getCourses()) counts[course.category] = (counts[course.category] ?? 0) + 1;
    return counts;
};
export const getTeachers = () => teachersData as Teacher[];
export const getCommittee = () => committeeData as CommitteeMember[];
export const getTimeline = () => timelineData as TimelineYear[];
export const getCalendar = () => calendarData as SchoolCalendar;
export const getFaq = () => faqData as FaqItem[];
export const getEssays = () => essaysData as Essay[];
export const getArt = () => artData as ArtWork[];
export const getMagazine = () => (magazineData as MagazineIssue[]).toSorted((a, b) => b.issueDate.localeCompare(a.issueDate));
export const getPage = (key: PageKey) => (pagesData as Record<PageKey, RichPage>)[key];

/** Newest first; undated posts go last. */
export const getNews = () => (newsData as NewsPost[]).toSorted((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
export const getNewsPost = (id: string) => getNews().find((post) => post.id === id);

/** Posts marked "Promote on home" whose end date has not passed. */
export const getPromotedNews = (today: string) => getNews().filter((post) => post.promote && (!post.promoteUntil || post.promoteUntil >= today));

export { courseIllustration, courseTint } from "./course-look";
