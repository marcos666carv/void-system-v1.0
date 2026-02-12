
"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps, FC, ReactNode } from "react";
import React, { isValidElement } from "react";
import type { ButtonProps as AriaButtonProps, LinkProps as AriaLinkProps } from "react-aria-components";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

// Simplified styles object mapping to our Tailwind config
const buttonStyles = {
    sizes: {
        sm: {
            root: "gap-1 rounded-lg px-3 py-2 text-sm font-semibold",
            linkRoot: "gap-1",
        },
        md: {
            root: "gap-1 rounded-lg px-3.5 py-2.5 text-sm font-semibold",
            linkRoot: "gap-1",
        },
        lg: {
            root: "gap-1.5 rounded-lg px-4 py-2.5 text-base font-semibold",
            linkRoot: "gap-1.5",
        },
        xl: {
            root: "gap-1.5 rounded-lg px-4.5 py-3 text-base font-semibold",
            linkRoot: "gap-1.5",
        },
    },
    colors: {
        primary: {
            root: "bg-primary text-white shadow-sm hover:bg-void-vibrant-blue/90 disabled:opacity-50 disabled:pointer-events-none",
        },
        secondary: {
            root: "bg-white text-void-slate border border-border shadow-sm hover:bg-void-ice hover:text-void-deep-blue disabled:opacity-50 disabled:pointer-events-none",
        },
        tertiary: {
            root: "text-void-slate hover:bg-void-ice hover:text-void-deep-blue disabled:opacity-50 disabled:pointer-events-none",
        },
        "primary-destructive": {
            root: "bg-void-error text-white shadow-sm hover:bg-void-error/90 disabled:opacity-50 disabled:pointer-events-none",
        },
    },
};

export interface CommonProps {
    isDisabled?: boolean;
    isLoading?: boolean;
    size?: keyof typeof buttonStyles.sizes;
    color?: keyof typeof buttonStyles.colors;
    iconLeading?: ReactNode;
    iconTrailing?: ReactNode;
    className?: string;
    children?: ReactNode;
}

export interface ButtonProps extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
    href?: never;
}

export interface LinkProps extends CommonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color"> {
    href: string;
}

export type Props = ButtonProps | LinkProps;

export const Button = ({
    size = "sm",
    color = "primary",
    children,
    className,
    iconLeading,
    iconTrailing,
    isDisabled,
    isLoading,
    ...props
}: Props) => {
    const isLink = "href" in props;
    const Component = isLink ? AriaLink : AriaButton;

    // cast to any to avoid complex union type issues with Aria components
    const componentProps: any = {
        ...props,
        isDisabled: isDisabled || isLoading,
        className: cn(
            "group relative inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            buttonStyles.sizes[size].root,
            buttonStyles.colors[color].root,
            (isDisabled || isLoading) && "opacity-50 cursor-not-allowed",
            className
        )
    };

    return (
        <Component {...componentProps}>
            {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {!isLoading && iconLeading && (
                <span className="mr-2">{iconLeading}</span>
            )}
            {children}
            {!isLoading && iconTrailing && (
                <span className="ml-2">{iconTrailing}</span>
            )}
        </Component>
    );
};
