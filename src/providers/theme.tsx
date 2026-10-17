"use client";

import { ThemeProvider } from "next-themes";

// next-themes injects a small script that applies dark mode before the page paints.
// It only needs to run in the server-rendered HTML. When React renders the layout in the
// browser (for example after switching language), the script is marked as data so React
// doesn't warn that it won't run.
const scriptProps = typeof window === "undefined" ? undefined : ({ type: "application/json" } as const);

export function Theme({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" value={{ light: "light-mode", dark: "dark-mode" }} enableSystem scriptProps={scriptProps}>
            {children}
        </ThemeProvider>
    );
}
