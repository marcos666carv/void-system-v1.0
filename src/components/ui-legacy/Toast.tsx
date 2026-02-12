'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import s from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
}

interface ToastContextProps {
    showToast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, title: string, message?: string) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => removeToast(id), 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={s.toastContainer}>
                {toasts.map(toast => (
                    <div key={toast.id} className={`${s.toast} ${s[toast.type]}`}>
                        <div className={s.icon}>
                            {toast.type === 'success' && <CheckCircle size={20} color="var(--void-success)" />}
                            {toast.type === 'error' && <AlertCircle size={20} color="var(--void-error)" />}
                            {toast.type === 'info' && <Info size={20} color="var(--void-vibrant-blue)" />}
                        </div>
                        <div className={s.content}>
                            <h4 className={s.title}>{toast.title}</h4>
                            {toast.message && <p className={s.message}>{toast.message}</p>}
                        </div>
                        <button className={s.closeButton} onClick={() => removeToast(toast.id)}>
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
