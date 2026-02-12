
import type { SVGProps } from "react";
import { cx } from "@/lib/utils/cx";

interface DotIconProps extends SVGProps<SVGSVGElement> {
    size?: "sm" | "md" | "lg";
}

export const Dot = ({ size = "md", className, ...props }: DotIconProps) => {
    const sizeClasses = {
        sm: "size-1.5",
        md: "size-2",
        lg: "size-2.5",
    };

    return (
        <svg
            viewBox="0 0 6 6"
            fill="currentColor"
            className={cx("fill-current", sizeClasses[size], className)}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="3" cy="3" r="3" />
        </svg>
    );
};
