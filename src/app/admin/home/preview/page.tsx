import { redirect } from "next/navigation";
import { HomePreview } from "@/components/admin/home-preview";
import { isSignedIn } from "@/lib/admin-auth";
import { getCourseCounts, getCourseTypes, getHome } from "@/lib/content";

/** Shown inside the editor's preview frame. It draws whatever draft the editor sends it. */
export default async function AdminHomePreviewPage() {
    if (!(await isSignedIn())) redirect("/admin");
    return <HomePreview initial={getHome()} courseTypes={getCourseTypes()} counts={getCourseCounts()} />;
}
