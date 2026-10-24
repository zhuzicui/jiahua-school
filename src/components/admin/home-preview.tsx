"use client";

import { useEffect, useState } from "react";
import { HomeView } from "@/components/site/home-view";
import { type Locale, htmlLang, isLocale } from "@/i18n/config";
import type { CourseType, CourseTypeId, HomeContent } from "@/lib/types";

/** Message the editor posts to its preview frame. */
export type PreviewMessage = { type: "jiahua-home-preview"; content: HomeContent; locale: Locale };

export const HomePreview = ({
    initial,
    courseTypes,
    counts,
}: {
    initial: HomeContent;
    courseTypes: CourseType[];
    counts: Partial<Record<CourseTypeId, number>>;
}) => {
    const [content, setContent] = useState(initial);
    const [locale, setLocale] = useState<Locale>("zh");

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            // Only the editor on this same site may drive the preview.
            if (event.origin !== window.location.origin) return;
            const data = event.data as Partial<PreviewMessage> | null;
            if (data?.type !== "jiahua-home-preview" || !data.content || !data.locale || !isLocale(data.locale)) return;
            setContent(data.content);
            setLocale(data.locale);
            document.documentElement.lang = htmlLang[data.locale];
        };
        window.addEventListener("message", onMessage);
        // Tell the editor the preview is ready for its first draft.
        window.parent.postMessage({ type: "jiahua-home-preview-ready" }, window.location.origin);
        return () => window.removeEventListener("message", onMessage);
    }, []);

    return (
        <main
            className="min-h-dvh bg-primary"
            // Links in the preview stay put, so staff don't wander off the draft.
            onClickCapture={(event) => {
                if ((event.target as HTMLElement).closest("a")) event.preventDefault();
            }}
        >
            <HomeView content={content} locale={locale} courseTypes={courseTypes} counts={counts} />
        </main>
    );
};
