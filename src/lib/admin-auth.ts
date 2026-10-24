/**
 * Staff sign-in for /admin. One shared password, set as the ADMIN_PASSWORD environment variable.
 * Signing in stores a cookie holding a signature of that password, so changing the password
 * signs everyone out. Server only.
 */
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "jiahua_admin";
/** How long a sign-in lasts: 8 hours. */
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

const adminPassword = () => process.env.ADMIN_PASSWORD ?? "";

export const isPasswordConfigured = () => adminPassword().length > 0;

const sameText = (a: string, b: string) => {
    // Compare fixed-length digests so the time taken doesn't reveal the password's length.
    const digest = (value: string) => createHmac("sha256", "jiahua-compare").update(value).digest();
    return timingSafeEqual(digest(a), digest(b));
};

export const sessionToken = () => createHmac("sha256", adminPassword()).update("jiahua-admin-session-v1").digest("hex");

export const isCorrectPassword = (input: string) => isPasswordConfigured() && sameText(input, adminPassword());

/**
 * True when the visitor may edit. Without ADMIN_PASSWORD the editor is open only on a developer's
 * own computer (`npm run dev`), never on the live site.
 */
export const isSignedIn = async () => {
    // Read the cookie first: this keeps every admin page rendered per request, never cached at build.
    const value = (await cookies()).get(ADMIN_COOKIE)?.value;
    if (!isPasswordConfigured()) return process.env.NODE_ENV === "development";
    return Boolean(value) && sameText(value!, sessionToken());
};
