import { cn } from "@/lib/utils/cn";
import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export function Card({ className, padding = "md", ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-bg-primary border border-border-secondary rounded-xl shadow-sm",
                // Padding
                padding === "none" && "p-0",
                padding === "sm" && "p-4",
                padding === "md" && "p-6",
                padding === "lg" && "p-8",
                padding === "xl" && "p-10",
                className
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className={cn("text-sm text-fg-tertiary", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
