import { redirect } from "next/navigation";
import { JiahuaLogo } from "@/components/brand/jiahua-logo";
import { getDictionary } from "@/i18n/dictionary";
import { isSignedIn } from "@/lib/admin-auth";
import { AdminLanguageLinks, adminLocale } from "./admin-language";
import { SignInForm } from "./sign-in-form";

/** Staff sign-in. Signed-in staff, and everyone while no password is set, go straight to the editor. */
export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
    const locale = adminLocale((await searchParams).lang);
    if (await isSignedIn()) redirect(locale === "zh" ? "/admin/home" : `/admin/home?lang=${locale}`);
    const t = getDictionary(locale).admin;

    return (
        <main className="flex min-h-dvh items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-primary p-8 shadow-lg ring-1 ring-secondary">
                <div className="flex items-start justify-between gap-4">
                    <JiahuaLogo className="h-11 w-fit" />
                    <AdminLanguageLinks current={locale} path="/admin" label={t.uiLanguage} />
                </div>
                <h1 className="mt-8 text-display-xs font-semibold text-primary">{t.title}</h1>
                <p className="mt-3 text-md text-tertiary">{t.signInIntro}</p>
                <SignInForm labels={{ password: t.password, signIn: t.signIn, wrongPassword: t.wrongPassword }} />
                <a href={`/${locale}`} className="link mt-6 inline-block text-sm">
                    {t.backHome}
                </a>
            </div>
        </main>
    );
}
