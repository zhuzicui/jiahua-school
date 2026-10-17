"use client";

import { cx } from "@/utils/cx";

type Option = { value: string; label: string; count?: number };

/** Single-choice chips that scroll sideways on a phone. */
export const FilterChips = ({ label, options, value, onChange }: { label: string; options: Option[]; value: string; onChange: (value: string) => void }) => (
    <div role="radiogroup" aria-label={label} className="-mx-4 scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {options.map((option) => {
            const selected = option.value === value;
            return (
                <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onChange(option.value)}
                    className={cx(
                        "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold ring-1 outline-focus-ring transition duration-100 ease-linear ring-inset focus-visible:outline-2 focus-visible:outline-offset-2",
                        selected
                            ? "bg-brand-solid text-white ring-transparent"
                            : "bg-primary text-secondary ring-primary hover:bg-primary_hover hover:text-secondary_hover",
                    )}
                >
                    {option.label}
                    {option.count !== undefined && (
                        <span className={cx("text-xs tabular-nums", selected ? "text-white/80" : "text-quaternary")}>{option.count}</span>
                    )}
                </button>
            );
        })}
    </div>
);
