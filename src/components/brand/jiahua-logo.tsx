import { cx } from "@/utils/cx";
import { logoMarkup } from "./logo-markup";

export const JiahuaLogo = ({ className }: { className?: string }) => (
    <span className={cx("block text-primary", className)} dangerouslySetInnerHTML={{ __html: logoMarkup }} />
);
