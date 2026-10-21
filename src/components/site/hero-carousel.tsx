"use client";

import type { ReactNode } from "react";
import { Carousel } from "@/components/application/carousel/carousel-base";
import { cx } from "@/utils/cx";

/** Home page hero. Shows dots to switch slides only when there is more than one. */
export const HeroCarousel = ({ slides, slideLabel }: { slides: ReactNode[]; slideLabel: string }) => (
    <Carousel.Root opts={{ loop: true }} aria-roledescription="carousel" className="relative">
        <Carousel.Content>
            {slides.map((slide, index) => (
                <Carousel.Item key={index}>{slide}</Carousel.Item>
            ))}
        </Carousel.Content>
        {slides.length > 1 && (
            <Carousel.IndicatorGroup className="mt-6 flex justify-center gap-2 lg:mt-4">
                {({ index }) => (
                    <Carousel.Indicator key={index} index={index} asChild>
                        {({ isSelected, onClick }) => (
                            <button
                                type="button"
                                aria-label={`${slideLabel} ${index + 1}`}
                                aria-current={isSelected ? "true" : undefined}
                                onClick={onClick}
                                className={cx(
                                    "size-2.5 rounded-full outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2",
                                    isSelected ? "bg-brand-solid" : "bg-quaternary hover:bg-fg-quaternary",
                                )}
                            />
                        )}
                    </Carousel.Indicator>
                )}
            </Carousel.IndicatorGroup>
        )}
    </Carousel.Root>
);
