"use client";

import { ChevronDown, Globe02 } from "@untitledui/icons";
import { usePathname } from "next/navigation";
import { Button as AriaButton } from "react-aria-components";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { type Locale, localeLabel, localeShort, locales } from "@/i18n/config";
import { cx } from "@/utils/cx";

/** Same page in another language: swaps the first path segment. */
const switchLocale = (pathname: string, target: Locale) => {
    const parts = pathname.split("/");
    parts[1] = target;
    return parts.join("/") || `/${target}`;
};

export const LanguageSwitcher = ({ locale, label, className }: { locale: Locale; label: string; className?: string }) => {
    const pathname = usePathname() ?? `/${locale}`;

    return (
        <Dropdown.Root>
            <AriaButton
                aria-label={label}
                className={cx(
                    "flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-secondary ring-1 ring-primary outline-focus-ring transition duration-100 ease-linear ring-inset hover:bg-primary_hover hover:text-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
                    className,
                )}
            >
                <Globe02 aria-hidden="true" className="size-4 text-fg-quaternary" />
                <span>{localeShort[locale]}</span>
                <ChevronDown
                    aria-hidden="true"
                    className="size-4 stroke-[2.25px] text-fg-quaternary transition duration-100 ease-linear in-aria-expanded:-rotate-180"
                />
            </AriaButton>
            <Dropdown.Popover className="w-44">
                <Dropdown.Menu aria-label={label} selectionMode="single" selectedKeys={[locale]} disallowEmptySelection>
                    {locales.map((code) => (
                        <Dropdown.Item key={code} id={code} href={switchLocale(pathname, code)} lang={code === "zh" ? "zh-Hans" : code}>
                            {localeLabel[code]}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown.Root>
    );
};
