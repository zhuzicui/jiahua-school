import { ArrowUpRight } from "@untitledui/icons";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/calendar";
import { href } from "@/lib/navigation";
import { pick } from "@/lib/text";
import type { NewsPost } from "@/lib/types";
import { cx } from "@/utils/cx";
import { T } from "./localized";

export const NewsCard = ({ post, locale, featured }: { post: NewsPost; locale: Locale; featured?: boolean }) => {
    const summary = pick(post.summary, locale).text;
    return (
        <a
            href={href(locale, `/news/${post.id}`)}
            className={cx(
                "group flex h-full flex-col gap-3 rounded-xl p-5 ring-1 outline-focus-ring transition duration-100 ease-linear ring-inset focus-visible:outline-2 focus-visible:outline-offset-2",
                featured ? "bg-brand-primary_alt ring-brand hover:bg-brand-secondary/40" : "bg-primary ring-secondary hover:bg-primary_hover",
            )}
        >
            {post.date && (
                <time dateTime={post.date} className="text-sm font-semibold text-brand-secondary">
                    {formatDate(post.date, locale)}
                </time>
            )}
            <span className="flex items-start justify-between gap-4">
                <T value={post.title} locale={locale} className="text-lg font-semibold text-primary" />
                <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 text-fg-quaternary transition duration-100 ease-linear group-hover:text-fg-brand-primary"
                />
            </span>
            {summary && <span className="line-clamp-3 text-md text-tertiary">{summary}</span>}
        </a>
    );
};
