import { ArrowRight } from "@untitledui/icons";
import type { Locale } from "@/i18n/config";
import { courseIllustration, courseTint } from "@/lib/content";
import type { CourseType } from "@/lib/types";
import { cx } from "@/utils/cx";
import { T } from "./localized";

export const CourseIllustration = ({ type, className, tilt }: { type: CourseType["id"]; className?: string; tilt?: string }) => (
    <span
        aria-hidden="true"
        style={{ "--tile": courseTint[type] } as React.CSSProperties}
        className={cx("course-tile flex aspect-square items-center justify-center rounded-xl p-3 ring-1 ring-[#02204f]/15", tilt, className)}
    >
        {/* eslint-disable-next-line @next/next/no-img-element -- static line art, no resizing needed */}
        <img src={courseIllustration[type]} alt="" width={160} height={160} className="aspect-square size-full object-contain" />
    </span>
);

export const CourseTile = ({ type, href, count, locale }: { type: CourseType; href: string; count: string; locale: Locale }) => (
    <a
        href={href}
        className="group flex h-full flex-col gap-3 rounded-xl bg-primary p-3 shadow-xs ring-1 ring-secondary outline-focus-ring transition duration-150 ease-in-out ring-inset hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
    >
        <CourseIllustration type={type.id} />
        <span className="flex items-center justify-between gap-2 px-1 pb-1">
            <span>
                <T value={type.label} locale={locale} className="block text-md font-semibold text-primary" />
                <span className="text-sm text-tertiary">{count}</span>
            </span>
            <ArrowRight
                aria-hidden="true"
                className="size-5 shrink-0 text-fg-quaternary transition duration-100 ease-linear group-hover:translate-x-0.5 group-hover:text-fg-brand-primary"
            />
        </span>
    </a>
);
