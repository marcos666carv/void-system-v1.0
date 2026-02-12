
"use client";

import React from "react";
import type { DialogProps as AriaDialogProps, ModalOverlayProps as AriaModalOverlayProps } from "react-aria-components";
import { Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { cn } from "@/lib/utils/cn";

export const DialogTrigger = AriaDialogTrigger;

export const ModalOverlay = (props: AriaModalOverlayProps) => {
    return (
        <AriaModalOverlay
            {...props}
            className={(state) =>
                cn(
                    "fixed inset-0 z-50 flex min-h-dvh w-full items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm",
                    state.isEntering && "duration-300 ease-out animate-in fade-in",
                    state.isExiting && "duration-200 ease-in animate-out fade-out",
                    typeof props.className === "function" ? props.className(state) : props.className,
                )
            }
        />
    );
};

export const Modal = (props: AriaModalOverlayProps) => (
    <AriaModal
        {...props}
        className={(state) =>
            cn(
                "max-h-full w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl align-middle outline-hidden",
                state.isEntering && "duration-300 ease-out animate-in zoom-in-95 slide-in-from-bottom-2",
                state.isExiting && "duration-200 ease-in animate-out zoom-out-95 slide-out-to-bottom-2",
                typeof props.className === "function" ? props.className(state) : props.className,
            )
        }
    />
);

export const Dialog = (props: AriaDialogProps) => (
    <AriaDialog {...props} className={cn("flex w-full flex-col outline-hidden", props.className)} />
);
