'use client';

import { ImgHTMLAttributes, forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const avatarVariants = cva(
    'inline-flex shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium overflow-hidden border border-gray-200 object-cover',
    {
        variants: {
            size: {
                xs: 'h-6 w-6 text-[10px]',
                sm: 'h-8 w-8 text-xs',
                md: 'h-10 w-10 text-sm',
                lg: 'h-12 w-12 text-md',
                xl: 'h-14 w-14 text-lg',
                '2xl': 'h-16 w-16 text-xl',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    }
);

export interface AvatarProps
    extends ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof avatarVariants> {
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
    ({ className, size, src, alt, fallback = '?', ...props }, ref) => {
        const [hasError, setHasError] = useState(false);

        if (!src || hasError) {
            return (
                <div
                    className={cn(avatarVariants({ size, className }))}
                    title={alt}
                >
                    {fallback.substring(0, 2).toUpperCase()}
                </div>
            );
        }

        return (
            <img
                ref={ref}
                src={src}
                alt={alt}
                className={cn(avatarVariants({ size, className }))}
                onError={() => setHasError(true)}
                {...props}
            />
        );
    }
);

Avatar.displayName = 'Avatar';
