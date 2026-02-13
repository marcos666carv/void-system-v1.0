'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

export function Topbar() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
            {/* Search Area */}
            <div className="w-96">
                <Input
                    placeholder="Search for clients, sales, or bookings..."
                    leftIcon={<span>🔍</span>}
                />
            </div>

            {/* Actions Area */}
            <div className="flex items-center gap-4">
                <Button intent="tertiary" size="sm" className="hidden sm:flex">
                    Documentation
                </Button>
                <div className="h-6 w-px bg-gray-200 mx-2" />
                <Button intent="tertiary" size="sm">
                    🔔
                </Button>
            </div>
        </header>
    );
}
