'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ClientProps } from '@/domain/entities/Client';
import { useRouter } from 'next/navigation';

type AuthUser = Pick<ClientProps, 'id' | 'email' | 'fullName' | 'role'>;

interface AuthContextType {
    user: AuthUser | null;
    login: (email: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem('void_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string) => {
        if (email.includes('admin')) {
            const adminUser: AuthUser = {
                id: 'usr_admin_01', email, fullName: 'Admin', role: 'admin',
            };
            setUser(adminUser);
            localStorage.setItem('void_user', JSON.stringify(adminUser));
            router.push('/admin/dashboard');
        } else {
            const clientUser: AuthUser = {
                id: 'usr_cli_01', email, fullName: 'Client', role: 'client',
            };
            setUser(clientUser);
            localStorage.setItem('void_user', JSON.stringify(clientUser));
            router.push('/');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('void_user');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
