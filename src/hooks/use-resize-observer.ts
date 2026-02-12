import { useEffect, useState, RefObject } from 'react';

interface UseResizeObserverOptions {
    ref: RefObject<HTMLElement | null>;
    box?: ResizeObserverBoxOptions;
    onResize?: (entry: ResizeObserverEntry) => void;
}

export function useResizeObserver({ ref, box, onResize }: UseResizeObserverOptions) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new ResizeObserver((entries) => {
            if (!entries.length) return;
            const entry = entries[0];
            const { width, height } = entry.contentRect;
            setDimensions({ width, height });

            if (onResize) {
                onResize(entry);
            }
        });

        observer.observe(element, { box });
        return () => observer.disconnect();
    }, [ref, box, onResize]);

    return dimensions;
}
