import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types';
import * as userService from '../services/userService';
import { useToast } from './ToastContext';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (name: string) => Promise<User>;
    logout: () => void;
    updateAvatar: (avatar: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();


    useEffect(() => {
        try {
            const userId = userService.getCurrentUserId();
            if (userId) {
                const currentUser = userService.getUserById(userId);
                setUser(currentUser || null);
            }
        } catch (error) {
            console.error("Failed to load user from storage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (name: string): Promise<User> => {
        let existingUser = userService.getUserByName(name);
        if (!existingUser) {
            if (userService.isUsernameTaken(name)) {
                throw new Error('اسم المستخدم محجوز بالفعل.');
            }
            existingUser = userService.registerUser(name);
        }
        userService.setCurrentUserId(existingUser.id);
        setUser(existingUser);
        return existingUser;
    };

    const logout = () => {
        userService.setCurrentUserId(null);
        setUser(null);
    };

    const updateAvatar = async (avatar: string) => {
        if (user) {
            try {
                const updatedUser = userService.updateUserAvatar(user.id, avatar);
                if (updatedUser) {
                    setUser(updatedUser);
                    showToast("تم تحديث الصورة الرمزية بنجاح!", "success");
                }
            } catch (error) {
                 showToast("فشل تحديث الصورة الرمزية.", "error");
            }
        }
    };
    
    const value = { user, loading, login, logout, updateAvatar };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};