import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
    public: {
        Tables: {
            incidents: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    severity: 'low' | 'medium' | 'high' | 'critical';
                    status: 'open' | 'in_progress' | 'resolved' | 'closed';
                    latitude: number;
                    longitude: number;
                    address?: string;
                    created_at: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description: string;
                    severity: 'low' | 'medium' | 'high' | 'critical';
                    status?: 'open' | 'in_progress' | 'resolved' | 'closed';
                    latitude: number;
                    longitude: number;
                    address?: string;
                    created_at?: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string;
                    severity?: 'low' | 'medium' | 'high' | 'critical';
                    status?: 'open' | 'in_progress' | 'resolved' | 'closed';
                    latitude?: number;
                    longitude?: number;
                    address?: string;
                    created_at?: string;
                    updated_at?: string;
                    user_id?: string;
                };
            };
            profiles: {
                Row: {
                    id: string;
                    username: string;
                    email: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    username: string;
                    email: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    username?: string;
                    email?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}

export type Incident = Database['public']['Tables']['incidents']['Row'];
export type IncidentInsert = Database['public']['Tables']['incidents']['Insert'];
export type IncidentUpdate = Database['public']['Tables']['incidents']['Update'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
