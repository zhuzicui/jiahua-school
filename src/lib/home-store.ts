/**
 * Checking and saving the home page content edited at /admin/home. Server only.
 *
 * Where a save goes:
 * - GITHUB_TOKEN set: a commit to src/content/home.json on GITHUB_BRANCH (default "main") of
 *   GITHUB_REPO (default "zhuzicui/jiahua-school"). The host rebuilds the site from that commit.
 * - No token, running `npm run dev`: the file on this computer.
 * - Otherwise saving is off and the editor says so.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { HomeContent, LocalizedText } from "./types";

const FILE = "src/content/home.json";
const MAX_TEXT = 600;

export type SaveMode = "github" | "local" | "off";

export const saveMode = (): SaveMode => {
    if (process.env.GITHUB_TOKEN) return "github";
    if (process.env.NODE_ENV === "development") return "local";
    return "off";
};

export type SaveResult = { ok: true; commitUrl?: string } | { ok: false; error: string };

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

/** A three-language text: Chinese required, French and English optional. Throws on anything else. */
const text = (value: unknown, field: string, required = true): LocalizedText => {
    if (!isRecord(value)) throw new Error(`${field}: not a text`);
    const out: LocalizedText = { zh: "" };
    for (const lang of ["zh", "fr", "en"] as const) {
        const v = value[lang];
        if (v === undefined || v === null) continue;
        if (typeof v !== "string") throw new Error(`${field}.${lang}: not a string`);
        if (v.length > MAX_TEXT) throw new Error(`${field}.${lang}: longer than ${MAX_TEXT} characters`);
        out[lang] = v.trim();
    }
    if (required && !out.zh) throw new Error(`${field}: Chinese is empty`);
    return out;
};

/** Photos must be files on this site (for example /hero/classroom.jpg). */
const imagePath = (value: unknown, field: string) => {
    if (typeof value !== "string" || !/^\/[\w\-./]+\.(jpe?g|png|webp|avif)$/i.test(value) || value.includes("..")) {
        throw new Error(`${field}: not a photo on this site`);
    }
    return value;
};

/** Returns a clean copy of the content, or throws with the first problem found. */
export const parseHomeContent = (input: unknown): HomeContent => {
    if (!isRecord(input) || !isRecord(input.hero) || !isRecord(input.categories) || !isRecord(input.layout)) throw new Error("Wrong shape");
    const { hero, categories, layout } = input;
    if (!Array.isArray(hero.slides) || hero.slides.length < 1 || hero.slides.length > 3) throw new Error("hero.slides: one to three slides");

    return {
        hero: {
            tagline: text(hero.tagline, "hero.tagline", false),
            slides: hero.slides.map((slide: unknown, i) => {
                if (!isRecord(slide)) throw new Error(`hero.slides.${i}: wrong shape`);
                return {
                    title: text(slide.title, `hero.slides.${i}.title`),
                    intro: text(slide.intro, `hero.slides.${i}.intro`, false),
                    image: imagePath(slide.image, `hero.slides.${i}.image`),
                    alt: text(slide.alt, `hero.slides.${i}.alt`, false),
                };
            }),
        },
        categories: {
            title: text(categories.title, "categories.title"),
            intro: text(categories.intro, "categories.intro", false),
        },
        layout: {
            photoSide: layout.photoSide === "left" ? "left" : "right",
            heroBackground: layout.heroBackground === "white" ? "white" : "grey",
            showCategories: layout.showCategories !== false,
            categoryColumns: layout.categoryColumns === 4 ? 4 : 6,
        },
    };
};

const githubRequest = async (url: string, init?: RequestInit) =>
    fetch(url, {
        ...init,
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28",
            ...init?.headers,
        },
        cache: "no-store",
    });

const saveToGithub = async (json: string): Promise<SaveResult> => {
    const repo = process.env.GITHUB_REPO || "zhuzicui/jiahua-school";
    const branch = process.env.GITHUB_BRANCH || "main";
    const url = `https://api.github.com/repos/${repo}/contents/${FILE}`;

    // The current file's id is needed to replace it.
    const current = await githubRequest(`${url}?ref=${encodeURIComponent(branch)}`);
    if (!current.ok) return { ok: false, error: `GitHub ${current.status} reading ${FILE}` };
    const { sha } = (await current.json()) as { sha: string };

    const put = await githubRequest(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "Edit home page from /admin/home",
            content: Buffer.from(json, "utf8").toString("base64"),
            sha,
            branch,
        }),
    });
    if (!put.ok) return { ok: false, error: `GitHub ${put.status} saving ${FILE}` };
    const result = (await put.json()) as { commit?: { html_url?: string } };
    return { ok: true, commitUrl: result.commit?.html_url };
};

export const saveHomeContent = async (content: HomeContent): Promise<SaveResult> => {
    const json = `${JSON.stringify(content, null, 2)}\n`;
    const mode = saveMode();
    if (mode === "github") return saveToGithub(json);
    if (mode === "local") {
        await writeFile(path.join(process.cwd(), FILE), json, "utf8");
        return { ok: true };
    }
    return { ok: false, error: "Saving is not connected" };
};
