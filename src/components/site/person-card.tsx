import { Award01 } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import type { Locale } from "@/i18n/config";
import type { LocalizedText } from "@/lib/types";
import { T } from "./localized";

const initials = (latin: string, name: string) => {
    const parts = latin.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 1);
};

type Props = {
    locale: Locale;
    name: string;
    nameLatin: string;
    photo: string | null;
    role?: LocalizedText;
    bio?: LocalizedText;
    award?: string;
};

/** Teacher or committee member. Without a photo (no consent yet) it shows initials. */
export const PersonCard = ({ locale, name, nameLatin, photo, role, bio, award }: Props) => (
    <article className="flex h-full flex-col gap-4 rounded-xl bg-primary p-5 ring-1 ring-secondary ring-inset">
        <div className="flex items-center gap-4">
            <Avatar size="xl" src={photo} alt={photo ? name : undefined} initials={initials(nameLatin, name)} />
            <div className="min-w-0">
                <h3 className="text-lg font-semibold text-primary">
                    {name}
                    {nameLatin && <span className="ml-2 text-md font-normal text-tertiary">{nameLatin}</span>}
                </h3>
                {role && <T as="p" value={role} locale={locale} className="text-md font-medium text-brand-secondary" />}
            </div>
        </div>
        {award && (
            <p className="flex w-fit items-center gap-1.5 rounded-full bg-utility-brand-50 px-2.5 py-0.5 text-sm font-medium text-utility-brand-700 ring-1 ring-utility-brand-200 ring-inset">
                <Award01 aria-hidden="true" className="size-3.5" />
                {award}
            </p>
        )}
        {bio && <T as="p" value={bio} locale={locale} className="text-md text-tertiary" />}
    </article>
);
