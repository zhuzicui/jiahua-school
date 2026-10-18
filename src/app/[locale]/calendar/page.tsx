import { CalendarDate, ChevronDown } from "@untitledui/icons";
import type { Metadata } from "next";
import { Badge } from "@/components/base/badges/badges";
import { T } from "@/components/site/localized";
import { PageHeader, PageSection } from "@/components/site/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { eventsByMonth, formatDate, formatMonth, nextClassDay, todayInMontreal } from "@/lib/calendar";
import { getCalendar } from "@/lib/content";
import type { CalendarEvent } from "@/lib/types";
import { cx } from "@/utils/cx";

// "Next class day" and which months are past depend on today's date.
export const revalidate = 3600;

const badgeColor = { "no-class": "warning", holiday: "warning", event: "gray", exam: "blue" } as const;

const EventRow = ({ event, locale }: { event: CalendarEvent; locale: Locale }) => {
    const t = getDictionary(locale);
    const day = (date: string) => formatDate(date, locale, { month: "short", day: "numeric", weekday: "short" });
    return (
        <li className="grid grid-cols-[7.5rem_1fr] gap-4 py-4 md:grid-cols-[11rem_1fr]">
            <time dateTime={event.date} className="text-md font-semibold text-primary tabular-nums">
                {day(event.date)}
                {event.endDate && (
                    <span className="block font-normal text-tertiary">
                        {t.calendar.through} {day(event.endDate)}
                    </span>
                )}
            </time>
            <div className="flex flex-col items-start gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                    <T value={event.label} locale={locale} className="text-md font-medium text-primary" />
                    <Badge type="pill-color" size="sm" color={badgeColor[event.type]}>
                        {t.calendar.types[event.type]}
                    </Badge>
                </div>
                {event.note && <T as="p" value={event.note} locale={locale} className="text-sm text-tertiary" />}
            </div>
        </li>
    );
};

export async function generateMetadata({ params }: PageProps<"/[locale]/calendar">): Promise<Metadata> {
    return { title: getDictionary((await params).locale as Locale).calendar.title };
}

export default async function CalendarPage({ params }: PageProps<"/[locale]/calendar">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const calendar = getCalendar();
    const today = todayInMontreal();
    const next = nextClassDay(calendar, today);
    const months = eventsByMonth(calendar.events);
    const thisMonth = today.slice(0, 7);
    // A month is past when every event in it has ended.
    const past = months.filter((m) => m.month < thisMonth && m.items.every((e) => (e.endDate ?? e.date) < today));
    const current = months.filter((m) => !past.includes(m));

    return (
        <PageSection>
            <PageHeader locale={locale} eyebrow={`${t.nav.courses} · ${calendar.schoolYear}`} title={t.calendar.title} intro={t.calendar.saturdayNote} />

            <div className="mt-10 flex max-w-3xl items-center gap-4 rounded-2xl bg-brand-primary_alt p-5 ring-1 ring-brand ring-inset md:p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-fg-brand-primary">
                    <CalendarDate aria-hidden="true" className="size-6" />
                </span>
                <div>
                    <p className="text-sm font-semibold text-tertiary">{t.calendar.nextClass}</p>
                    <p className="text-lg font-semibold text-primary md:text-xl">
                        {next ? formatDate(next, locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : t.home.noClassComing}
                    </p>
                </div>
            </div>

            <div className="mt-12 max-w-3xl">
                {current.map(({ month, items }) => (
                    <section key={month} aria-labelledby={`m-${month}`} className="mb-8">
                        <h2 id={`m-${month}`} className="border-b border-secondary pb-2 text-lg font-semibold text-primary">
                            {formatMonth(month, locale)}
                        </h2>
                        <ul className="divide-y divide-secondary">
                            {items.map((event) => (
                                <EventRow key={event.id} event={event} locale={locale} />
                            ))}
                        </ul>
                    </section>
                ))}

                {past.length > 0 && (
                    <details className="group mt-4 rounded-xl ring-1 ring-secondary ring-inset">
                        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-md font-semibold text-secondary">
                            {t.calendar.past}
                            <ChevronDown
                                aria-hidden="true"
                                className={cx("size-5 text-fg-quaternary transition duration-100 ease-linear group-open:-rotate-180")}
                            />
                        </summary>
                        <div className="px-4 pb-2">
                            {past.map(({ month, items }) => (
                                <section key={month} className="mt-2">
                                    <h3 className="text-md font-semibold text-tertiary">{formatMonth(month, locale)}</h3>
                                    <ul className="divide-y divide-secondary">
                                        {items.map((event) => (
                                            <EventRow key={event.id} event={event} locale={locale} />
                                        ))}
                                    </ul>
                                </section>
                            ))}
                        </div>
                    </details>
                )}
            </div>
        </PageSection>
    );
}
