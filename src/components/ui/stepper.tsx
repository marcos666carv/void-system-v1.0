import * as React from "react"
import { cn } from "@/lib/utils/cn"
import { Check } from "lucide-react"

interface StepperProps {
    steps: string[]
    currentStep: number
    onStepClick?: (step: number) => void
    className?: string
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
    return (
        <div className={cn("flex items-center w-full", className)}>
            {steps.map((step, index) => {
                const stepNumber = index + 1
                const isCompleted = stepNumber < currentStep
                const isCurrent = stepNumber === currentStep
                const isClickable = onStepClick && stepNumber < currentStep

                return (
                    <React.Fragment key={step}>
                        <div
                            className={cn("flex items-center gap-2", isClickable ? "cursor-pointer" : "cursor-default")}
                            onClick={() => isClickable && onStepClick(stepNumber)}
                        >
                            <div
                                className={cn(
                                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                                    isCompleted || isCurrent
                                        ? "bg-brand-600 text-white"
                                        : "bg-gray-100 text-gray-500 border border-gray-200"
                                )}
                            >
                                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                            </div>
                            <span
                                className={cn(
                                    "text-sm font-medium transition-colors",
                                    isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"
                                )}
                            >
                                {step}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "mx-4 h-[1px] flex-1 transition-colors",
                                    stepNumber < currentStep ? "bg-brand-600" : "bg-gray-200"
                                )}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}
