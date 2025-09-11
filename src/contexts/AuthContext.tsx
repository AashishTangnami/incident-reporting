import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface User extends Profile {
    isAuthenticated: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const createUserFromAuth = (authUser: any, username?: string): User => {
        return {
            id: authUser.id,
            username: username || authUser.email?.split('@')[0] || 'User',
            email: authUser.email || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isAuthenticated: true,
        };
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(createUserFromAuth(session.user));
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT' || !session?.user) {
                setUser(null);
            } else if (event === 'SIGNED_IN' && session?.user) {
                // Only set user if not already set (avoid overriding login method)
                if (!user) {
                    setUser(createUserFromAuth(session.user));
                }
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                // Set user immediately for instant UI update
                setUser(createUserFromAuth(data.user));
                setLoading(false);
                return { success: true };
            }

            return { success: false, error: 'Login failed' };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const signup = async (email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                // Set user immediately with provided username
                setUser(createUserFromAuth(data.user, username));
                setLoading(false);
                return { success: true };
            }

            return { success: false, error: 'Signup failed' };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const logout = async (): Promise<void> => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

