import { type Locale, intlLocale, schoolTimeZone } from "@/i18n/config";
import type { CalendarEvent, SchoolCalendar } from "./types";

/** Today's date in Montreal as YYYY-MM-DD. */
export const todayInMontreal = (now = new Date()) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: schoolTimeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);

const parse = (iso: string) => new Date(`${iso}T12:00:00Z`);
const iso = (date: Date) => date.toISOString().slice(0, 10);

const isDayOff = (date: string, events: CalendarEvent[]) =>
    events.some((event) => (event.type === "holiday" || event.type === "no-class") && date >= event.date && date <= (event.endDate ?? event.date));

/** Every Saturday class day of the year, holidays removed. */
export const saturdayClassDays = (calendar: SchoolCalendar) => {
    const days: string[] = [];
    for (const term of calendar.terms.filter((t) => t.weekday === 6)) {
        for (let d = parse(term.start); iso(d) <= term.end; d.setUTCDate(d.getUTCDate() + 7)) {
            if (!isDayOff(iso(d), calendar.events)) days.push(iso(d));
        }
    }
    return days.sort();
};

/** The next Saturday class day on or after today, or null when the year is over. */
export const nextClassDay = (calendar: SchoolCalendar, today: string) => saturdayClassDays(calendar).find((day) => day >= today) ?? null;

export const formatDate = (date: string, locale: Locale, options: Intl.DateTimeFormatOptions = { dateStyle: "long" }) =>
    new Intl.DateTimeFormat(intlLocale[locale], { timeZone: "UTC", ...options }).format(parse(date));

export const formatMonth = (yearMonth: string, locale: Locale) =>
    new Intl.DateTimeFormat(intlLocale[locale], { timeZone: "UTC", year: "numeric", month: "long" }).format(parse(`${yearMonth}-01`));

/** Events grouped by month (YYYY-MM), in date order. */
export const eventsByMonth = (events: CalendarEvent[]) => {
    const groups = new Map<string, CalendarEvent[]>();
    for (const event of events.toSorted((a, b) => a.date.localeCompare(b.date))) {
        const key = event.date.slice(0, 7);
        groups.set(key, [...(groups.get(key) ?? []), event]);
    }
    return [...groups.entries()].map(([month, items]) => ({ month, items }));
};
