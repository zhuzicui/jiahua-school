import type { Locale } from "@/i18n/config";

/** A text field in three languages. Chinese is required; a missing translation falls back to Chinese. */
export type LocalizedText = { zh: string } & Partial<Record<Exclude<Locale, "zh">, string>>;

export type CourseTypeId = "chinese" | "math" | "english" | "french" | "art" | "music" | "dance" | "robotics" | "chess" | "martial" | "pingpong" | "fitness";

export type CourseType = { id: CourseTypeId; label: LocalizedText };

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type Course = {
    id: string;
    code: string;
    name: LocalizedText;
    category: CourseTypeId;
    day: Weekday;
    /** "9:30–11:20" */
    time: string;
    ageMin: number;
    /** null means no upper limit */
    ageMax: number | null;
    level: LocalizedText | null;
    teacher: string | null;
    room: string | null;
    /** Yearly fee in CAD; null when not published yet */
    fee: number | null;
    description: LocalizedText | null;
};

export type Teacher = {
    id: string;
    name: string;
    nameLatin: string;
    photo: string | null;
    bio: LocalizedText;
    courseTypes: CourseTypeId[];
    award: boolean;
};

export type CommitteeMember = {
    id: string;
    name: string;
    nameLatin: string;
    photo: string | null;
    title: LocalizedText;
    bio: LocalizedText;
};

export type TimelineYear = { year: number; events: LocalizedText[] };

export type CalendarEventType = "no-class" | "holiday" | "event" | "exam";

export type CalendarEvent = {
    id: string;
    /** ISO date, YYYY-MM-DD */
    date: string;
    endDate?: string;
    type: CalendarEventType;
    label: LocalizedText;
    note?: LocalizedText;
};

export type CalendarTerm = {
    id: string;
    /** 6 = Saturday; null = weekday courses (Monday to Friday) */
    weekday: number | null;
    start: string;
    end: string;
};

export type SchoolCalendar = { schoolYear: string; terms: CalendarTerm[]; events: CalendarEvent[] };

export type FaqTopic = "registration" | "classes" | "payment" | "school" | "visit";
export type FaqItem = { id: string; topic: FaqTopic; q: LocalizedText; a: LocalizedText };

export type NewsPost = {
    id: string;
    date: string | null;
    title: LocalizedText;
    summary: LocalizedText;
    body: LocalizedText;
    cover: string | null;
    category: string | null;
    link: string | null;
    /** Shown on the home page until promoteUntil (inclusive); always stays in the News list */
    promote: boolean;
    promoteUntil: string | null;
};

export type Essay = {
    id: string;
    title: LocalizedText;
    /** Already reduced to first name + last initial unless consent is recorded */
    student: string;
    class: string | null;
    schoolYear: string;
    file: string;
};

export type ArtWork = {
    id: string;
    image: string;
    student: string;
    class: string;
    teacher: string | null;
    schoolYear: string;
    caption: LocalizedText | null;
};

export type MagazineIssue = { id: string; title: LocalizedText; issueDate: string; cover: string | null; pdf: string };

export type RichPage = { title: LocalizedText; intro: LocalizedText; body: LocalizedText };

export type SiteSettings = {
    siteName: LocalizedText;
    tagline: LocalizedText;
    schoolYear: string;
    registrationUrl: string;
    contact: {
        address: string;
        email: string;
        metro: LocalizedText;
        phones: string[];
        place: string;
        room: LocalizedText;
        wechat: string;
    };
    courseTypes: CourseType[];
};
