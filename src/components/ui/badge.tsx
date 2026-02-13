import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ring-1 ring-inset',
    {
        variants: {
            intent: {
                gray: 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/10',
                brand: 'bg-brand-50 text-brand-700 border-brand-200 ring-brand-700/10',
                error: 'bg-error-50 text-error-700 border-error-200 ring-error-600/10',
                warning: 'bg-warning-50 text-warning-700 border-warning-200 ring-warning-600/20',
                success: 'bg-success-50 text-success-700 border-success-200 ring-success-600/10',
            },
            size: {
                sm: 'text-xs px-2 py-0.5',
                md: 'text-sm px-2.5 py-0.5',
            },
        },
        defaultVariants: {
            intent: 'gray',
            size: 'sm',
        },
    }
);

export interface BadgeProps
    extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
    intent?: 'gray' | 'brand' | 'error' | 'warning' | 'success';
    size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, intent, size, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(badgeVariants({ intent, size, className }))}
                {...props}
            />
        );
    }
);

Badge.displayName = 'Badge';
