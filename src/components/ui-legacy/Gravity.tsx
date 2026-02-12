'use client';

import React, { useRef, useState, useEffect } from 'react';

interface GravityProps {
    children: React.ReactNode;
    strength?: number; // How strong the pull is (0-1 recommended)
    radius?: number; // Distance in pixels to trigger the effect
    className?: string;
}

export const Gravity: React.FC<GravityProps> = ({
    children,
    strength = 0.5,
    radius = 200,
    className
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

            if (dist < radius) {
                // Calculate pull
                const pull = (radius - dist) / radius; // 0 to 1
                const moveX = (e.clientX - centerX) * pull * strength;
                const moveY = (e.clientY - centerY) * pull * strength;

                setPosition({ x: moveX, y: moveY });
            } else {
                // Reset if out of radius
                setPosition((prev) => {
                    if (prev.x === 0 && prev.y === 0) return prev;
                    return { x: 0, y: 0 };
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [radius, strength]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: 'transform 0.1s ease-out', // Smooth catch-up
                willChange: 'transform'
            }}
        >
            {children}
        </div>
    );
};
