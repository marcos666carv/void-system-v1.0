'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Avatar } from '@/components/ui/avatar';

interface SidebarItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

interface SidebarGroup {
    label?: string;
    items: SidebarItem[];
}

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navigation: SidebarGroup[] = [
        {
            items: [
                { icon: '🏠', label: 'Home', href: '/admin' },
                { icon: '📅', label: 'Schedule', href: '/admin/calendar' },
            ],
        },
        {
            label: 'Management',
            items: [
                { icon: '👥', label: 'Clients', href: '/admin/customers' },
                { icon: '💰', label: 'Sales', href: '/admin/sales' },
            ],
        },
        {
            label: 'System',
            items: [
                { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
                { icon: '🗺️', label: 'System Map', href: '/admin/system-map' },
            ],
        }
    ];

    return (
        <aside
            className={cn(
                "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
                isCollapsed ? "w-20" : "w-72",
                className
            )}
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
                    V
                </div>
                {!isCollapsed && (
                    <span className="ml-3 font-display font-semibold text-lg text-gray-900">
                        Void System
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                {navigation.map((group, idx) => (
                    <div key={idx}>
                        {!isCollapsed && group.label && (
                            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                {group.label}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                                            isActive
                                                ? "bg-gray-50 text-brand-700"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                                            isCollapsed && "justify-center px-0"
                                        )}
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        <span className={cn("text-lg", isActive ? "text-brand-600" : "text-gray-400 group-hover:text-gray-500")}>
                                            {item.icon}
                                        </span>
                                        {!isCollapsed && (
                                            <span className="ml-3">{item.label}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User User Profile (Bottom) */}
            <div className="p-4 border-t border-gray-200">
                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                    <Avatar size="sm" fallback="AD" />
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">Admin User</span>
                            <span className="text-xs text-gray-500">admin@void.com</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
