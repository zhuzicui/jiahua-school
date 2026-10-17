import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { LocalizedText } from "@/lib/types";
import { cx } from "@/utils/cx";
import { T } from "./localized";

type Props = {
    locale: Locale;
    eyebrow?: string;
    title: LocalizedText | string;
    intro?: LocalizedText | string | null;
    actions?: ReactNode;
    className?: string;
};

const asText = (value: LocalizedText | string): LocalizedText => (typeof value === "string" ? { zh: value, fr: value, en: value } : value);

export const PageHeader = ({ locale, eyebrow, title, intro, actions, className }: Props) => (
    <div className={cx("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
        <div className="max-w-3xl">
            {eyebrow && <p className="mb-3 text-sm font-semibold text-brand-secondary md:text-md">{eyebrow}</p>}
            <T as="h1" value={asText(title)} locale={locale} className="text-display-sm font-semibold text-primary md:text-display-md" />
            {intro && <T as="p" value={asText(intro)} locale={locale} className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl" />}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
);

/** Page body wrapper: container width, vertical rhythm. */
export const PageSection = ({ children, className }: { children: ReactNode; className?: string }) => (
    <section className={cx("mx-auto max-w-container px-4 py-12 md:px-8 md:py-16", className)}>{children}</section>
);
