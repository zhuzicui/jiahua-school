import type { Metadata } from "next";
import { ContactDetails } from "@/components/site/contact-details";
import { RichText } from "@/components/site/localized";
import { PageHeader, PageSection } from "@/components/site/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getPage } from "@/lib/content";
import { tx } from "@/lib/text";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
    return { title: tx(getPage("contact").title, (await params).locale as Locale) };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
    const locale = (await params).locale as Locale;
    const page = getPage("contact");

    return (
        <PageSection>
            <PageHeader locale={locale} title={page.title} intro={page.intro} />
            <div className="mt-12 grid gap-12 lg:grid-cols-2">
                <ContactDetails locale={locale} />
                <RichText value={page.body} locale={locale} className="max-w-xl" />
            </div>
        </PageSection>
    );
}
