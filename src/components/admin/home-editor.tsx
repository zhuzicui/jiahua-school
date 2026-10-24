"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Monitor01, Phone01, Plus, Trash01 } from "@untitledui/icons";
import { signOut } from "@/app/admin/actions";
import { saveHome } from "@/app/admin/actions";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { NativeSelect } from "@/components/base/select/select-native";
import { TextArea } from "@/components/base/textarea/textarea";
import { Toggle } from "@/components/base/toggle/toggle";
import { JiahuaLogo } from "@/components/brand/jiahua-logo";
import { type Locale, localeLabel, localeShort, locales } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import type { SaveMode } from "@/lib/home-store";
import type { HeroSlide, HomeContent, LocalizedText } from "@/lib/types";
import { cx } from "@/utils/cx";
import type { PreviewMessage } from "./home-preview";

type T = Dictionary["admin"];
type Status = { kind: "saved"; commitUrl?: string } | { kind: "error"; message: string } | null;

const DESKTOP_WIDTH = 1280;
const PHONE_WIDTH = 390;

/** A choice between a few options, as a row of joined buttons. */
const Choice = <V extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: V;
    options: { id: V; label: string }[];
    onChange: (value: V) => void;
}) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-secondary">{label}</span>
        <ButtonGroup
            size="sm"
            aria-label={label}
            disallowEmptySelection
            selectedKeys={[value]}
            onSelectionChange={(keys) => {
                const next = [...keys][0];
                if (next !== undefined) onChange(String(next) as V);
            }}
        >
            {options.map((option) => (
                <ButtonGroupItem key={option.id} id={option.id}>
                    {option.label}
                </ButtonGroupItem>
            ))}
        </ButtonGroup>
    </div>
);

/** One text in Chinese, French and English, stacked. Chinese is required. */
const LocalizedField = ({
    label,
    value,
    onChange,
    multiline,
    required,
    t,
}: {
    label: string;
    value: LocalizedText;
    onChange: (value: LocalizedText) => void;
    multiline?: boolean;
    required?: boolean;
    t: T;
}) => {
    const missing = required && !value.zh.trim();
    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="mb-1.5 text-sm font-medium text-secondary">{label}</legend>
            {locales.map((lang) => {
                const props = {
                    "aria-label": `${label} · ${localeLabel[lang]}`,
                    value: value[lang] ?? "",
                    onChange: (text: string) => onChange({ ...value, [lang]: text }),
                    isInvalid: lang === "zh" && missing,
                };
                return (
                    <div key={lang} className="flex items-start gap-2">
                        <span className="w-9 shrink-0 pt-2.5 text-xs font-semibold text-quaternary">{localeShort[lang]}</span>
                        {multiline ? (
                            <TextArea {...props} rows={3} className="flex-1" textAreaClassName="text-sm" />
                        ) : (
                            <Input {...props} size="sm" className="flex-1" />
                        )}
                    </div>
                );
            })}
            {missing && <p className="pl-11 text-sm text-error-primary">{t.missingChinese}</p>}
        </fieldset>
    );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="flex flex-col gap-6 border-b border-secondary px-5 py-6 last:border-b-0">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
        {children}
    </section>
);

/** Scales the 1280px-wide desktop preview down to fit the space beside the form. */
const useFitScale = (width: number) => {
    const ref = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, (entry.contentRect.width - 32) / width)));
        observer.observe(element);
        return () => observer.disconnect();
    }, [width]);
    return { ref, scale };
};

export const HomeEditor = ({
    initial,
    photos,
    saveMode,
    canSignOut,
    locale,
    t,
}: {
    initial: HomeContent;
    photos: string[];
    saveMode: SaveMode;
    canSignOut: boolean;
    locale: Locale;
    t: T;
}) => {
    const [saved, setSaved] = useState(initial);
    const [draft, setDraft] = useState(initial);
    const [previewLocale, setPreviewLocale] = useState<Locale>(locale);
    const [device, setDevice] = useState<"desktop" | "phone">("desktop");
    const [status, setStatus] = useState<Status>(null);
    const [saving, startSaving] = useTransition();
    const frame = useRef<HTMLIFrameElement>(null);

    const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
    const hasErrors = draft.hero.slides.some((slide) => !slide.title.zh.trim()) || !draft.categories.title.zh.trim();
    const frameWidth = device === "desktop" ? DESKTOP_WIDTH : PHONE_WIDTH;
    const { ref: stageRef, scale } = useFitScale(frameWidth);

    // Send the draft to the preview frame whenever it changes.
    const sendDraft = useCallback(() => {
        const message: PreviewMessage = { type: "jiahua-home-preview", content: draft, locale: previewLocale };
        frame.current?.contentWindow?.postMessage(message, window.location.origin);
    }, [draft, previewLocale]);
    useEffect(sendDraft, [sendDraft]);
    useEffect(() => {
        const onReady = (event: MessageEvent) => {
            if (event.origin === window.location.origin && event.data?.type === "jiahua-home-preview-ready") sendDraft();
        };
        window.addEventListener("message", onReady);
        return () => window.removeEventListener("message", onReady);
    }, [sendDraft]);

    // Warn before leaving with unsaved changes.
    useEffect(() => {
        if (!dirty) return;
        const warn = (event: BeforeUnloadEvent) => event.preventDefault();
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);

    const update = (change: (content: HomeContent) => HomeContent) => {
        setDraft((current) => change(structuredClone(current)));
        setStatus(null);
    };
    const updateSlide = (index: number, change: Partial<HeroSlide>) =>
        update((c) => {
            c.hero.slides[index] = { ...c.hero.slides[index], ...change };
            return c;
        });
    const moveSlide = (index: number, by: -1 | 1) =>
        update((c) => {
            const [slide] = c.hero.slides.splice(index, 1);
            c.hero.slides.splice(index + by, 0, slide);
            return c;
        });

    const save = () =>
        startSaving(async () => {
            const result = await saveHome(draft);
            if (result.ok) {
                setSaved(draft);
                setStatus({ kind: "saved", commitUrl: result.commitUrl });
            } else {
                setStatus({ kind: "error", message: result.error === "signedOut" ? t.notSignedIn : `${t.saveFailed}${result.error}` });
            }
        });

    const photoOptions = (current: string) =>
        [...new Set([current, ...photos])].filter(Boolean).map((photo) => ({ value: photo, label: photo.replace(/^\/hero\//, "") }));

    return (
        <div className="flex h-dvh flex-col">
            {/* Top bar */}
            <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-secondary bg-primary px-4 py-3 md:px-5">
                <JiahuaLogo className="h-8 w-fit" />
                <h1 className="text-md font-semibold text-primary">{t.editHome}</h1>
                <span className={cx("text-sm", dirty ? "text-warning-primary" : "text-tertiary")} aria-live="polite">
                    {dirty ? t.unsaved : t.allSaved}
                </span>
                <div className="ml-auto flex items-center gap-2">
                    {canSignOut && (
                        <form action={signOut}>
                            <Button type="submit" size="sm" color="tertiary">
                                {t.signOut}
                            </Button>
                        </form>
                    )}
                    <Button size="sm" color="secondary" isDisabled={!dirty || saving} onClick={() => update(() => structuredClone(saved))}>
                        {t.discard}
                    </Button>
                    <Button size="sm" isDisabled={!dirty || hasErrors || saveMode === "off"} isLoading={saving} showTextWhileLoading onClick={save}>
                        {saving ? t.saving : t.save}
                    </Button>
                </div>
            </header>

            {(status || saveMode === "off") && (
                <div
                    role="status"
                    className={cx(
                        "border-b px-4 py-2.5 text-sm md:px-5",
                        status?.kind === "error" || saveMode === "off"
                            ? "border-error_subtle bg-error-primary text-error-primary"
                            : "border-secondary bg-success-primary text-success-primary",
                    )}
                >
                    {status?.kind === "saved" && (
                        <>
                            {saveMode === "github" ? t.savedGithub : t.savedLocal}{" "}
                            {status.commitUrl && (
                                <a href={status.commitUrl} target="_blank" rel="noreferrer" className="link">
                                    {t.viewChange}
                                </a>
                            )}
                        </>
                    )}
                    {status?.kind === "error" && status.message}
                    {!status && saveMode === "off" && t.savingOff}
                </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                {/* Form */}
                <div className="w-full shrink-0 overflow-y-auto border-secondary bg-primary lg:w-[440px] lg:border-r">
                    <Section title={t.sectionHero}>
                        <LocalizedField label={t.tagline} value={draft.hero.tagline} onChange={(v) => update((c) => ((c.hero.tagline = v), c))} t={t} />

                        {draft.hero.slides.map((slide, index) => (
                            <div key={index} className="flex flex-col gap-4 rounded-xl bg-secondary p-4 ring-1 ring-secondary">
                                <div className="flex items-center gap-1">
                                    <h3 className="mr-auto text-md font-semibold text-primary">
                                        {t.slide} {index + 1}
                                    </h3>
                                    <Button
                                        size="sm"
                                        color="tertiary"
                                        iconLeading={ArrowUp}
                                        aria-label={t.moveUp}
                                        isDisabled={index === 0}
                                        onClick={() => moveSlide(index, -1)}
                                    />
                                    <Button
                                        size="sm"
                                        color="tertiary"
                                        iconLeading={ArrowDown}
                                        aria-label={t.moveDown}
                                        isDisabled={index === draft.hero.slides.length - 1}
                                        onClick={() => moveSlide(index, 1)}
                                    />
                                    <Button
                                        size="sm"
                                        color="tertiary-destructive"
                                        iconLeading={Trash01}
                                        aria-label={t.removeSlide}
                                        isDisabled={draft.hero.slides.length === 1}
                                        onClick={() => update((c) => (c.hero.slides.splice(index, 1), c))}
                                    />
                                </div>
                                <LocalizedField label={t.slideTitle} value={slide.title} required onChange={(v) => updateSlide(index, { title: v })} t={t} />
                                <LocalizedField label={t.slideIntro} value={slide.intro} multiline onChange={(v) => updateSlide(index, { intro: v })} t={t} />
                                <NativeSelect
                                    label={t.image}
                                    size="sm"
                                    value={slide.image}
                                    options={photoOptions(slide.image)}
                                    onChange={(event) => updateSlide(index, { image: event.target.value })}
                                />
                                <LocalizedField label={t.imageAlt} value={slide.alt} onChange={(v) => updateSlide(index, { alt: v })} t={t} />
                            </div>
                        ))}

                        <div className="flex flex-col items-start gap-1.5">
                            <Button
                                size="sm"
                                color="secondary"
                                iconLeading={Plus}
                                isDisabled={draft.hero.slides.length >= 3}
                                onClick={() =>
                                    update((c) => {
                                        const last = c.hero.slides[c.hero.slides.length - 1];
                                        c.hero.slides.push({ title: { zh: "" }, intro: { zh: "" }, image: last.image, alt: { zh: "" } });
                                        return c;
                                    })
                                }
                            >
                                {t.addSlide}
                            </Button>
                            {draft.hero.slides.length >= 3 && <p className="text-sm text-tertiary">{t.maxSlides}</p>}
                        </div>
                    </Section>

                    <Section title={t.sectionCategories}>
                        <Toggle
                            label={t.showCategories}
                            isSelected={draft.layout.showCategories}
                            onChange={(on) => update((c) => ((c.layout.showCategories = on), c))}
                        />
                        <LocalizedField
                            label={t.categoriesTitle}
                            value={draft.categories.title}
                            required
                            onChange={(v) => update((c) => ((c.categories.title = v), c))}
                            t={t}
                        />
                        <LocalizedField
                            label={t.categoriesIntro}
                            value={draft.categories.intro}
                            multiline
                            onChange={(v) => update((c) => ((c.categories.intro = v), c))}
                            t={t}
                        />
                    </Section>

                    <Section title={t.sectionLayout}>
                        <Choice
                            label={t.photoSide}
                            value={draft.layout.photoSide}
                            options={[
                                { id: "left", label: t.left },
                                { id: "right", label: t.right },
                            ]}
                            onChange={(v) => update((c) => ((c.layout.photoSide = v), c))}
                        />
                        <Choice
                            label={t.heroBackground}
                            value={draft.layout.heroBackground}
                            options={[
                                { id: "grey", label: t.grey },
                                { id: "white", label: t.white },
                            ]}
                            onChange={(v) => update((c) => ((c.layout.heroBackground = v), c))}
                        />
                        <Choice
                            label={t.categoryColumns}
                            value={String(draft.layout.categoryColumns) as "4" | "6"}
                            options={[
                                { id: "4", label: "4" },
                                { id: "6", label: "6" },
                            ]}
                            onChange={(v) => update((c) => ((c.layout.categoryColumns = v === "4" ? 4 : 6), c))}
                        />
                        <p className="text-sm text-tertiary">{t.chineseRequired}</p>
                    </Section>
                </div>

                {/* Live preview */}
                <div className="flex min-h-[70dvh] min-w-0 flex-1 flex-col bg-tertiary lg:min-h-0">
                    <div className="flex flex-wrap items-end gap-3 px-4 py-3">
                        <Choice
                            label={t.previewLanguage}
                            value={previewLocale}
                            options={locales.map((lang) => ({ id: lang, label: localeShort[lang] }))}
                            onChange={setPreviewLocale}
                        />
                        <ButtonGroup
                            size="sm"
                            aria-label={`${t.phone} / ${t.desktop}`}
                            disallowEmptySelection
                            selectedKeys={[device]}
                            onSelectionChange={(keys) => {
                                const next = [...keys][0];
                                if (next === "phone" || next === "desktop") setDevice(next);
                            }}
                        >
                            <ButtonGroupItem id="phone" iconLeading={Phone01}>
                                {t.phone}
                            </ButtonGroupItem>
                            <ButtonGroupItem id="desktop" iconLeading={Monitor01}>
                                {t.desktop}
                            </ButtonGroupItem>
                        </ButtonGroup>
                    </div>
                    <div ref={stageRef} className="relative min-h-0 flex-1 overflow-hidden px-4 pb-4">
                        <div
                            className="absolute top-0 left-1/2 origin-top overflow-hidden rounded-xl bg-primary shadow-lg ring-1 ring-secondary"
                            style={{
                                width: frameWidth,
                                height: `calc((100% - 16px) / ${scale})`,
                                transform: `translateX(-50%) scale(${scale})`,
                            }}
                        >
                            <iframe ref={frame} title={t.editHome} src="/admin/home/preview" onLoad={sendDraft} className="size-full border-0" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
