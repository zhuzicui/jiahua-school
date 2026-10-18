import { ArrowUpRight, InfoCircle } from "@untitledui/icons";
import type { Metadata } from "next";
import { Button } from "@/components/base/buttons/button";
import { ContactDetails } from "@/components/site/contact-details";
import { RichText } from "@/components/site/localized";
import { PageHeader, PageSection } from "@/components/site/page-header";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getPage, getSettings } from "@/lib/content";
import { href } from "@/lib/navigation";
import { tx } from "@/lib/text";

export async function generateMetadata({ params }: PageProps<"/[locale]/registration">): Promise<Metadata> {
    return { title: tx(getPage("registration").title, (await params).locale as Locale) };
}

/** Opened from the "Register" button on Courses; not in the menu. Registration itself stays on registration.jiahuaschool.ca. */
export default async function RegistrationPage({ params }: PageProps<"/[locale]/registration">) {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    const page = getPage("registration");
    const { registrationUrl } = getSettings();

    return (
        <PageSection>
            <PageHeader
                locale={locale}
                eyebrow={t.nav.courses}
                title={page.title}
                intro={page.intro}
                actions={
                    <Button href={registrationUrl} target="_blank" rel="noopener noreferrer" size="xl" iconTrailing={<ArrowUpRight data-icon="trailing" />}>
                        {t.registration.cta}
                    </Button>
                }
            />
            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
                <div className="min-w-0">
                    <RichText value={page.body} locale={locale} />
                    <p className="mt-8 flex items-start gap-2 rounded-lg bg-secondary px-4 py-3 text-md text-tertiary">
                        <InfoCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-fg-quaternary" />
                        {t.registration.feesNote}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button href={registrationUrl} target="_blank" rel="noopener noreferrer" size="lg" iconTrailing={<ArrowUpRight data-icon="trailing" />}>
                            {t.registration.cta}
                        </Button>
                        <Button href={href(locale, "/courses")} size="lg" color="secondary">
                            {t.registration.coursesLink}
                        </Button>
                    </div>
                </div>
                <aside className="h-fit rounded-2xl bg-secondary p-6 ring-1 ring-secondary ring-inset">
                    <h2 className="mb-5 text-lg font-semibold text-primary">{t.registration.where}</h2>
                    <ContactDetails locale={locale} compact />
                </aside>
            </div>
        </PageSection>
    );
}
