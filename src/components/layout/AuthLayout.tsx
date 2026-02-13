'use client';

import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Form Area */}
            <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-8">
                        <div className="h-10 w-10 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6">
                            V
                        </div>
                        <h2 className="text-3xl font-display font-semibold text-gray-900">{title}</h2>
                        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>

            {/* Right: Brand Area */}
            <div className="hidden lg:block relative bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900 to-gray-900 mix-blend-multiply" />
                <div className="relative h-full flex flex-col items-center justify-center text-center p-12 text-white">
                    <h1 className="text-4xl font-display font-bold mb-4">Void System</h1>
                    <p className="text-lg text-gray-300 max-w-lg">
                        Experience the ultimate floatation therapy management system.
                        Seamless bookings, client management, and real-time analytics.
                    </p>
                </div>
            </div>
        </div>
    );
}
