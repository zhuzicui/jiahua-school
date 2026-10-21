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
export const getCourseTypes = () => getSettings().courseTypes;
export const getCourses = () => coursesData as Course[];
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

/** Illustration file per course type (public/illustrations). */
export const courseIllustration: Record<CourseTypeId, string> = {
    chinese: "/illustrations/hand-chinese.png",
    math: "/illustrations/hand-math.png",
    english: "/illustrations/hand-english.png",
    french: "/illustrations/hand-french.png",
    art: "/illustrations/hand-art.png",
    music: "/illustrations/hand-music.png",
    dance: "/illustrations/hand-dance.png",
    robotics: "/illustrations/hand-robotics.png",
    chess: "/illustrations/hand-chess.png",
    martial: "/illustrations/hand-taichi.png",
    pingpong: "/illustrations/hand-pingpong.png",
    fitness: "/illustrations/hand-fitness.png",
};

/** Tile background per course type, from the illustration palette. */
export const courseTint: Record<CourseTypeId, string> = {
    chinese: "#ffd1dc",
    english: "#aec6cf",
    french: "#b2ebb2",
    math: "#e6e6fa",
    art: "#fffacd",
    music: "#ffdab9",
    dance: "#ffb7b2",
    robotics: "#b2c5b2",
    chess: "#ccccff",
    martial: "#c8a2c8",
    pingpong: "#f7d0b1",
    fitness: "#c3d3b7",
};
