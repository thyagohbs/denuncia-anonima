import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import authService from '../services/auth.service';
import { User } from '../types';

interface AuthContextProps {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
    register: (email: string, password: string) => Promise<any>;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const user = authService.getCurrentUser();
            if (user && authService.isAuthenticated()) {
                setCurrentUser(user);
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const data = await authService.login(email, password);
            setCurrentUser(authService.getCurrentUser());
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    const register = async (email: string, password: string) => {
        return authService.register(email, password);
    };

    const value = {
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        logout,
        register,
        hasRole: (role: string) => authService.hasRole(role),
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};