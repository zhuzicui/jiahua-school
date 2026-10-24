import { redirect } from "next/navigation";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { HomeEditor } from "@/components/admin/home-editor";
import { getDictionary } from "@/i18n/dictionary";
import { isPasswordConfigured, isSignedIn } from "@/lib/admin-auth";
import { getHome } from "@/lib/content";
import { saveMode } from "@/lib/home-store";
import { adminLocale } from "../admin-language";

/** Photos staff can pick for the hero: the files in public/hero. */
const heroPhotos = async () => {
    try {
        const files = await readdir(path.join(process.cwd(), "public/hero"));
        return files.filter((file) => /\.(jpe?g|png|webp|avif)$/i.test(file)).map((file) => `/hero/${file}`);
    } catch {
        return [];
    }
};

export default async function AdminHomePage({ searchParams }: PageProps<"/admin/home">) {
    const locale = adminLocale((await searchParams).lang);
    if (!(await isSignedIn())) redirect(locale === "zh" ? "/admin" : `/admin?lang=${locale}`);

    return (
        <HomeEditor
            initial={getHome()}
            photos={await heroPhotos()}
            saveMode={saveMode()}
            canSignOut={isPasswordConfigured()}
            locale={locale}
            t={getDictionary(locale).admin}
        />
    );
}
