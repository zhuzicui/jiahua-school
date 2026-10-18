import type { ElementType } from "react";
import { InfoCircle } from "@untitledui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { renderMarkdown } from "@/lib/markdown";
import { pick } from "@/lib/text";
import type { LocalizedText } from "@/lib/types";
import { cx } from "@/utils/cx";

/** Short text. When the translation is missing it shows the Chinese with a small "中文" tag. */
export const T = ({
    value,
    locale,
    as: As = "span",
    className,
}: {
    value: LocalizedText | null | undefined;
    locale: Locale;
    as?: ElementType;
    className?: string;
}) => {
    const { text, isFallback } = pick(value, locale);
    if (!text) return null;
    return (
        <As className={className}>
            <span lang={isFallback ? "zh-Hans" : undefined}>{text}</span>
            {isFallback && (
                <span
                    title={getDictionary(locale).common.onlyInChinese}
                    className="ml-1.5 inline-flex translate-y-[-1px] items-center rounded-sm px-1 align-middle text-[11px] leading-4 font-medium text-utility-neutral-700 ring-1 ring-utility-neutral-200 ring-inset"
                >
                    {getDictionary(locale).common.chineseBadge}
                </span>
            )}
        </As>
    );
};

/** Notice shown above long content that is only available in Chinese. */
export const FallbackNotice = ({ locale, className }: { locale: Locale; className?: string }) => (
    <p className={cx("flex items-start gap-2 rounded-lg bg-secondary px-3.5 py-2.5 text-sm text-tertiary ring-1 ring-secondary ring-inset", className)}>
        <InfoCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fg-quaternary" />
        {getDictionary(locale).common.onlyInChinese}
    </p>
);

/** Rich text (Markdown) in the requested language, falling back to Chinese with a notice. */
export const RichText = ({ value, locale, className }: { value: LocalizedText | null | undefined; locale: Locale; className?: string }) => {
    const { text, isFallback } = pick(value, locale);
    if (!text) return null;
    const { html } = renderMarkdown(text);
    return (
        <div className={className}>
            {isFallback && <FallbackNotice locale={locale} className="mb-6" />}
            <div lang={isFallback ? "zh-Hans" : undefined} className="prose max-w-none md:prose-lg" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
};
