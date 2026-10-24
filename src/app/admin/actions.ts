"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, isCorrectPassword, isSignedIn, sessionToken } from "@/lib/admin-auth";
import { type SaveResult, parseHomeContent, saveHomeContent } from "@/lib/home-store";

export type SignInState = { error?: "wrong" } | undefined;

export async function signIn(_state: SignInState, formData: FormData): Promise<SignInState> {
    const password = formData.get("password");
    if (typeof password !== "string" || !isCorrectPassword(password)) return { error: "wrong" };
    (await cookies()).set(ADMIN_COOKIE, sessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/admin",
        maxAge: ADMIN_SESSION_SECONDS,
    });
    redirect("/admin/home");
}

export async function signOut() {
    (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
    redirect("/admin");
}

export type SaveHomeResult = SaveResult | { ok: false; error: "signedOut" };

export async function saveHome(content: unknown): Promise<SaveHomeResult> {
    if (!(await isSignedIn())) return { ok: false, error: "signedOut" };
    let clean;
    try {
        clean = parseHomeContent(content);
    } catch (error) {
        return { ok: false, error: (error as Error).message };
    }
    try {
        return await saveHomeContent(clean);
    } catch (error) {
        return { ok: false, error: (error as Error).message };
    }
}
