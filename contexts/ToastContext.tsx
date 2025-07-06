import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Toast, ToastType } from '../types';

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
    toasts: Toast[];
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = `toast-${Date.now()}`;
        const newToast: Toast = { id, message, type };
        setToasts(currentToasts => [newToast, ...currentToasts]);

        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);
    
    const value = { toasts, showToast, removeToast };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
