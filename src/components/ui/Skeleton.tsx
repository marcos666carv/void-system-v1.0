
import { cn } from "@/lib/utils/cn";

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-gray-200/50 dark:bg-gray-800/50", className)}
            {...props}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="flex flex-col space-y-3 p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-950">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}
