import { JiahuaLogo } from "@/components/brand/jiahua-logo";
import { getDictionary } from "@/i18n/dictionary";

/** Placeholder until the CMS milestone adds email one-time-link and Google sign-in. */
export default function AdminPage() {
    const zh = getDictionary("zh").admin;
    const en = getDictionary("en").admin;
    return (
        <main className="flex min-h-dvh items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-primary p-8 shadow-lg ring-1 ring-secondary">
                <JiahuaLogo className="h-11 w-fit" />
                <h1 className="mt-8 text-display-xs font-semibold text-primary">{zh.title}</h1>
                <p className="mt-3 text-md text-tertiary">{zh.body}</p>
                <p className="mt-3 text-md text-tertiary">{en.body}</p>
                <a href="/zh" className="link mt-6 inline-block">
                    {zh.backHome}
                </a>
            </div>
        </main>
    );
}
