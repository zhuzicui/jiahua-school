import type { MetadataRoute } from "next";

/**
 * Search engines stay away until the site is the school's real site.
 * Set ALLOW_INDEXING=true on the host when it goes live.
 */
export default function robots(): MetadataRoute.Robots {
    if (process.env.ALLOW_INDEXING === "true") {
        return { rules: { userAgent: "*", allow: "/", disallow: "/admin" } };
    }
    return { rules: { userAgent: "*", disallow: "/" } };
}
