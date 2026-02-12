
"use client";

import { cn } from "@/lib/utils/cn";
import * as React from "react";
import { type TooltipProps, Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger, OverlayArrow } from "react-aria-components";

export const TooltipTrigger = AriaTooltipTrigger;

interface MyTooltipProps extends Omit<TooltipProps, 'children'> {
    children: React.ReactNode;
    title: React.ReactNode;
}

export function Tooltip({ children, title, className, ...props }: MyTooltipProps) {
    return (
        <AriaTooltipTrigger>
            {children}
            <AriaTooltip
                {...props}
                className={({ isEntering, isExiting }) => cn(
                    "group px-2 py-1 bg-[#0f172a] text-white text-xs rounded shadow-lg ring-1 ring-white/10 forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] max-w-xs z-50",
                    isEntering && "animate-in fade-in zoom-in-95 duration-200",
                    isExiting && "animate-out fade-out zoom-out-95 duration-200",
                    typeof className === 'string' ? className : undefined
                )}
            >
                <OverlayArrow>
                    <svg width={8} height={8} viewBox="0 0 8 8" className="fill-[#0f172a] group-placement-bottom:rotate-180 group-placement-left:-rotate-90 group-placement-right:rotate-90 forced-colors:fill-[Canvas] stroke-white/10">
                        <path d="M0 0 L4 4 L8 0" />
                    </svg>
                </OverlayArrow>
                {title}
            </AriaTooltip>
        </AriaTooltipTrigger>
    );
}
