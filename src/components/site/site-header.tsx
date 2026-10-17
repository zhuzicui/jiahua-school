"use client";

import { type ReactNode, useRef, useState } from "react";
import { ChevronDown } from "@untitledui/icons";
import { usePathname } from "next/navigation";
import { Button as AriaButton, Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import type { Locale } from "@/i18n/config";
import type { NavSection } from "@/lib/navigation";
import { cx } from "@/utils/cx";
import { LanguageSwitcher } from "./language-switcher";

type Props = {
    locale: Locale;
    logo: ReactNode;
    homeHref: string;
    sections: NavSection[];
    registerHref: string;
    labels: { register: string; menu: string; language: string };
};

const isActive = (pathname: string, section: NavSection) =>
    section.href ? pathname.startsWith(section.href) : (section.items ?? []).some((item) => pathname.startsWith(item.href));

const MobileSection = ({ section, pathname }: { section: NavSection; pathname: string }) => {
    const [isOpen, setIsOpen] = useState(isActive(pathname, section));

    if (section.href) {
        return (
            <li>
                <a
                    href={section.href}
                    aria-current={pathname.startsWith(section.href) ? "page" : undefined}
                    className="flex items-center px-4 py-3 text-md font-semibold text-primary hover:bg-primary_hover aria-[current=page]:text-brand-secondary"
                >
                    {section.label}
                </a>
            </li>
        );
    }

    return (
        <li>
            <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between px-4 py-3 text-md font-semibold text-primary hover:bg-primary_hover"
            >
                {section.label}
                <ChevronDown
                    aria-hidden="true"
                    className={cx("size-4 stroke-[2.625px] text-fg-quaternary transition duration-100 ease-linear", isOpen && "-rotate-180")}
                />
            </button>
            {isOpen && (
                <ul className="pb-2">
                    {section.items?.map((item) => (
                        <li key={item.href}>
                            <a
                                href={item.href}
                                aria-current={pathname === item.href ? "page" : undefined}
                                className="block py-2.5 pr-4 pl-8 text-md font-medium text-secondary hover:bg-primary_hover aria-[current=page]:font-semibold aria-[current=page]:text-brand-secondary"
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export const SiteHeader = ({ locale, logo, homeHref, sections, registerHref, labels }: Props) => {
    const headerRef = useRef<HTMLElement>(null);
    const pathname = usePathname() ?? "";

    return (
        <header ref={headerRef} className="sticky top-0 z-30 border-b border-secondary bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/85">
            <div className="mx-auto flex h-16 max-w-container items-center gap-4 px-4 md:h-18 md:px-8">
                <a
                    href={homeHref}
                    className="flex h-9 shrink-0 items-center rounded-md outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-4 md:h-11"
                >
                    {logo}
                </a>

                <nav aria-label={labels.menu} className="ml-4 hidden lg:block">
                    <ul className="flex items-center gap-0.5">
                        {sections.map((section) => (
                            <li key={section.id}>
                                {section.items ? (
                                    <AriaDialogTrigger>
                                        <AriaButton
                                            className={cx(
                                                "flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-md font-semibold text-secondary outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
                                                isActive(pathname, section) && "bg-secondary text-primary",
                                            )}
                                        >
                                            {section.label}
                                            <ChevronDown
                                                aria-hidden="true"
                                                className="size-4 stroke-[2.625px] text-fg-quaternary transition duration-100 ease-linear in-aria-expanded:-rotate-180"
                                            />
                                        </AriaButton>
                                        <AriaPopover
                                            offset={8}
                                            placement="bottom start"
                                            className={({ isEntering, isExiting }) =>
                                                cx(
                                                    "origin-top",
                                                    isEntering && "duration-150 ease-out animate-in fade-in slide-in-from-top-1",
                                                    isExiting && "duration-100 ease-in animate-out fade-out",
                                                )
                                            }
                                        >
                                            <AriaDialog aria-label={section.label} className="outline-hidden">
                                                <ul className="flex min-w-60 flex-col gap-0.5 rounded-xl bg-primary p-1.5 shadow-lg ring-1 ring-secondary_alt">
                                                    {section.items.map((item) => (
                                                        <li key={item.href}>
                                                            <a
                                                                href={item.href}
                                                                aria-current={pathname === item.href ? "page" : undefined}
                                                                className="block rounded-md px-3 py-2.5 text-sm font-semibold text-secondary outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-secondary_hover focus-visible:outline-2 aria-[current=page]:bg-secondary aria-[current=page]:text-primary"
                                                            >
                                                                {item.label}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AriaDialog>
                                        </AriaPopover>
                                    </AriaDialogTrigger>
                                ) : (
                                    <a
                                        href={section.href}
                                        aria-current={isActive(pathname, section) ? "page" : undefined}
                                        className="flex rounded-lg px-3 py-2 text-md font-semibold text-secondary outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2 aria-[current=page]:bg-secondary aria-[current=page]:text-primary"
                                    >
                                        {section.label}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="ml-auto flex items-center gap-2 md:gap-3">
                    <LanguageSwitcher locale={locale} label={labels.language} />
                    <Button href={registerHref} size="md" className="max-sm:hidden">
                        {labels.register}
                    </Button>

                    <AriaDialogTrigger>
                        <AriaButton
                            aria-label={labels.menu}
                            className={({ isFocusVisible, isHovered }) =>
                                cx(
                                    "group cursor-pointer rounded-lg p-2 lg:hidden",
                                    isHovered && "bg-primary_hover",
                                    isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
                                )
                            }
                        >
                            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path
                                    className="hidden text-secondary group-aria-expanded:block"
                                    d="M18 6L6 18M6 6L18 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <path
                                    className="text-secondary group-aria-expanded:hidden"
                                    d="M3 12H21M3 6H21M3 18H21"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </AriaButton>
                        <AriaPopover triggerRef={headerRef} offset={0} containerPadding={0} placement="bottom" className="w-full lg:hidden">
                            <AriaDialog aria-label={labels.menu} className="max-h-[calc(100dvh-4rem)] overflow-y-auto bg-primary shadow-lg outline-hidden">
                                <nav aria-label={labels.menu}>
                                    <ul className="flex flex-col py-3">
                                        {sections.map((section) => (
                                            <MobileSection key={section.id} section={section} pathname={pathname} />
                                        ))}
                                    </ul>
                                    <div className="border-t border-secondary p-4">
                                        <Button href={registerHref} size="lg" className="w-full">
                                            {labels.register}
                                        </Button>
                                    </div>
                                </nav>
                            </AriaDialog>
                        </AriaPopover>
                    </AriaDialogTrigger>
                </div>
            </div>
        </header>
    );
};
