import type { ReactNode } from "react";

export const SimpleEmptyState = ({ icon, title }: { icon: ReactNode; title: string }) => (
    <div className="flex flex-col items-center gap-4 rounded-2xl px-6 py-16 text-center ring-1 ring-secondary ring-inset">
        <span className="flex size-12 items-center justify-center rounded-lg text-fg-secondary shadow-xs ring-1 ring-primary ring-inset">{icon}</span>
        <p className="max-w-sm text-md text-tertiary">{title}</p>
    </div>
);
