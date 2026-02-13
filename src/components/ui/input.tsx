import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-gray-700 block"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        id={inputId}
                        ref={ref}
                        disabled={disabled}
                        className={cn(
                            "flex w-full rounded-lg border bg-white px-3 py-2.5 text-sm transition-all shadow-sm placeholder:text-gray-500",
                            "border-gray-300 focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none",
                            "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
                            error && "border-error-300 focus:border-error-300 focus:ring-error-100 text-error-900",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            className
                        )}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-error-600 animate-in slide-in-from-top-1 fade-in duration-200">
                        {error}
                    </p>
                )}

                {!error && helperText && (
                    <p className="text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
