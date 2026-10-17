"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";

export default function NotFound() {
    const params = useParams<{ locale?: string }>();
    const locale = params?.locale && isLocale(params.locale) ? params.locale : defaultLocale;
    const t = getDictionary(locale).notFound;

    return (
        <section className="mx-auto max-w-container px-4 py-24 md:px-8">
            <p className="text-md font-semibold text-brand-secondary">404</p>
            <h1 className="mt-3 text-display-md font-semibold text-primary">{t.title}</h1>
            <p className="mt-4 text-lg text-tertiary">{t.body}</p>
            <Button href={`/${locale}`} size="xl" className="mt-8">
                {t.home}
            </Button>
        </section>
    );
}
