import { Mail01, MarkerPin02, Phone } from "@untitledui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getSettings } from "@/lib/content";
import { href } from "@/lib/navigation";
import { tx } from "@/lib/text";
import { JiahuaLogo } from "../brand/jiahua-logo";
import { T } from "./localized";

export const SiteFooter = ({ locale }: { locale: Locale }) => {
    const t = getDictionary(locale);
    const { contact, registrationUrl, siteName } = getSettings();
    const links = [
        { label: t.nav.contact, href: href(locale, "/contact") },
        { label: t.nav.faq, href: href(locale, "/faq") },
        { label: t.nav.registration, href: href(locale, "/registration") },
        { label: t.common.registerOnline, href: registrationUrl, external: true },
        { label: "Dawson College", href: "https://www.dawsoncollege.qc.ca/", external: true },
    ];

    return (
        <footer className="border-t border-secondary bg-secondary_alt">
            <div className="mx-auto grid max-w-container gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-8 md:py-16">
                <div className="flex flex-col gap-5">
                    <JiahuaLogo className="h-11 w-fit" />
                    <T as="p" value={getSettings().tagline} locale={locale} className="max-w-sm text-md text-tertiary" />
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-quaternary">{t.nav.contact}</h2>
                    <ul className="mt-4 flex flex-col gap-3 text-md text-tertiary">
                        <li className="flex gap-2">
                            <MarkerPin02 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-fg-quaternary" />
                            <span>
                                {contact.place}
                                <br />
                                {contact.address}
                            </span>
                        </li>
                        <li className="flex gap-2">
                            <Mail01 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-fg-quaternary" />
                            <a href={`mailto:${contact.email}`} className="link">
                                {contact.email}
                            </a>
                        </li>
                        <li className="flex gap-2">
                            <Phone aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-fg-quaternary" />
                            <span className="tabular-nums">{contact.phones.join(" · ")}</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-quaternary">{t.footer.links}</h2>
                    <ul className="mt-4 flex flex-col gap-3">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                    className="text-md font-semibold text-tertiary transition duration-100 ease-linear hover:text-tertiary_hover"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mx-auto flex max-w-container flex-col gap-3 border-t border-secondary px-4 py-6 text-sm text-quaternary md:flex-row md:items-center md:justify-between md:px-8">
                <p>
                    {t.footer.takedown}{" "}
                    <a href={`mailto:${contact.email}`} className="link">
                        {contact.email}
                    </a>
                </p>
                <p className="flex gap-4">
                    <span>
                        © {new Date().getFullYear()} {tx(siteName, locale)}
                    </span>
                    <a href="/admin" className="font-medium text-quaternary underline-offset-2 hover:underline">
                        {t.footer.staff}
                    </a>
                </p>
            </div>
        </footer>
    );
};
