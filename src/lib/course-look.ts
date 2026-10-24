/**
 * How each course type looks: its illustration and tile colour. Kept apart from content.ts so
 * client components (the home page editor preview) can use it without loading all the content.
 */
import type { CourseTypeId } from "./types";

/** Illustration file per course type (public/illustrations). */
export const courseIllustration: Record<CourseTypeId, string> = {
    chinese: "/illustrations/hand-chinese.png",
    math: "/illustrations/hand-math.png",
    english: "/illustrations/hand-english.png",
    french: "/illustrations/hand-french.png",
    art: "/illustrations/hand-art.png",
    music: "/illustrations/hand-music.png",
    dance: "/illustrations/hand-dance.png",
    robotics: "/illustrations/hand-robotics.png",
    chess: "/illustrations/hand-chess.png",
    martial: "/illustrations/hand-taichi.png",
    pingpong: "/illustrations/hand-pingpong.png",
    fitness: "/illustrations/hand-fitness.png",
};

/** Tile background per course type, from the illustration palette. */
export const courseTint: Record<CourseTypeId, string> = {
    chinese: "#ffdfdb",
    english: "#f7e8ca",
    french: "#cef3e8",
    math: "#dceaff",
    art: "#ebe5ff",
    music: "#ffe3d0",
    dance: "#fbe0f7",
    robotics: "#caf2f7",
    chess: "#d9f2d9",
    martial: "#ece7de",
    pingpong: "#e8edce",
    fitness: "#d0efff",
};
