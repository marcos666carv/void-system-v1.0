import { forwardRef, InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils/cn"

export interface RadioCardProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    description?: string
    children?: React.ReactNode
}

export const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>(
    ({ className, label, description, checked, children, ...props }, ref) => {
        return (
            <label
                className={cn(
                    "relative flex cursor-pointer flex-col rounded-xl border p-4 transition-all hover:bg-gray-50",
                    checked
                        ? "border-brand-600 bg-brand-50/30 ring-1 ring-brand-600"
                        : "border-gray-200 bg-white",
                    props.disabled && "cursor-not-allowed opacity-50",
                    className
                )}
            >
                <input
                    type="radio"
                    className="sr-only"
                    ref={ref}
                    checked={checked}
                    {...props}
                />
                <div className="flex items-start gap-3">
                    <div
                        className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                            checked
                                ? "border-brand-600 bg-brand-600"
                                : "border-gray-300 bg-white"
                        )}
                    >
                        {checked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1 space-y-1">
                        {label && (
                            <span className={cn("block text-sm font-medium", checked ? "text-brand-900" : "text-gray-900")}>
                                {label}
                            </span>
                        )}
                        {description && (
                            <span className={cn("block text-xs", checked ? "text-brand-700" : "text-gray-500")}>
                                {description}
                            </span>
                        )}
                        {children}
                    </div>
                </div>
            </label>
        )
    }
)

RadioCard.displayName = "RadioCard"
