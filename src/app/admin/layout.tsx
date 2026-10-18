import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cx } from "@/utils/cx";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = { title: "Staff sign-in · Jia Hua School", robots: { index: false } };

/** /admin has its own root layout: no public header, and it is where editors will sign in. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
    return (
        <html lang="zh-Hans">
            <body className={cx(inter.variable, "bg-secondary antialiased")}>{children}</body>
        </html>
    );
}
