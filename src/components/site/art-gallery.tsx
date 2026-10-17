"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, XClose } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pick } from "@/lib/text";
import type { ArtWork } from "@/lib/types";

/** Grouped by school year, then class (teacher shown on each group). Opens a modal with previous/next. */
export const ArtGallery = ({ locale, works }: { locale: Locale; works: ArtWork[] }) => {
    const t = getDictionary(locale);
    const [index, setIndex] = useState<number | null>(null);
    const years = [...new Set(works.map((w) => w.schoolYear))].sort().reverse();
    const ordered = years.flatMap((year) => {
        const inYear = works.filter((w) => w.schoolYear === year);
        return [...new Set(inYear.map((w) => w.class))].flatMap((cls) => inYear.filter((w) => w.class === cls));
    });
    const current = index === null ? null : ordered[index];
    const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + ordered.length) % ordered.length));

    return (
        <div className="flex flex-col gap-12">
            {years.map((year) => {
                const inYear = ordered.filter((w) => w.schoolYear === year);
                return (
                    <section key={year}>
                        <h2 className="text-xl font-semibold text-primary">{t.work.schoolYear(year)}</h2>
                        {[...new Set(inYear.map((w) => w.class))].map((cls) => {
                            const group = inYear.filter((w) => w.class === cls);
                            return (
                                <div key={cls} className="mt-5">
                                    <h3 className="text-md font-semibold text-secondary">
                                        {cls}
                                        {group[0].teacher && <span className="ml-2 font-normal text-tertiary">{group[0].teacher}</span>}
                                    </h3>
                                    <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                        {group.map((work) => (
                                            <li key={work.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => setIndex(ordered.indexOf(work))}
                                                    className="block w-full cursor-pointer overflow-hidden rounded-lg ring-1 ring-secondary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2"
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={work.image}
                                                        alt={work.student}
                                                        className="aspect-square w-full object-cover transition duration-150 hover:scale-105"
                                                    />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </section>
                );
            })}

            <ModalOverlay isDismissable isOpen={current !== null} onOpenChange={(open) => !open && setIndex(null)}>
                <Modal className="max-w-3xl">
                    <Dialog aria-label={current?.student ?? ""} className="p-4 md:p-6">
                        {current && (
                            <div onKeyDown={(e) => (e.key === "ArrowRight" ? step(1) : e.key === "ArrowLeft" ? step(-1) : null)}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={current.image} alt={current.student} className="max-h-[65vh] w-full rounded-lg object-contain" />
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="flex-1">
                                        <p className="text-md font-semibold text-primary">{current.student}</p>
                                        <p className="text-sm text-tertiary">
                                            {current.class}
                                            {current.caption && ` · ${pick(current.caption, locale).text}`}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="Previous"
                                        onClick={() => step(-1)}
                                        className="rounded-lg p-2 ring-1 ring-primary hover:bg-primary_hover"
                                    >
                                        <ChevronLeft className="size-5 text-fg-secondary" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next"
                                        onClick={() => step(1)}
                                        className="rounded-lg p-2 ring-1 ring-primary hover:bg-primary_hover"
                                    >
                                        <ChevronRight className="size-5 text-fg-secondary" />
                                    </button>
                                    <button type="button" aria-label="Close" onClick={() => setIndex(null)} className="rounded-lg p-2 hover:bg-primary_hover">
                                        <XClose className="size-5 text-fg-quaternary" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </div>
    );
};
