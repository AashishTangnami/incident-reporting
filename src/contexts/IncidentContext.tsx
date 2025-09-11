import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Incident, IncidentInsert, IncidentUpdate } from '../lib/supabase';
import { IncidentFormData } from '../types/incident';
import { useAuth } from './AuthContext';

interface IncidentContextType {
    incidents: Incident[];
    addIncident: (incident: IncidentFormData) => Promise<{ success: boolean; error?: string }>;
    updateIncident: (id: string, updates: Partial<Incident>) => Promise<{ success: boolean; error?: string }>;
    deleteIncident: (id: string) => Promise<{ success: boolean; error?: string }>;
    loading: boolean;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const useIncidents = () => {
    const context = useContext(IncidentContext);
    if (context === undefined) {
        throw new Error('useIncidents must be used within an IncidentProvider');
    }
    return context;
};

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchIncidents();
        } else {
            setIncidents([]);
            setLoading(false);
        }
    }, [user]);

    const fetchIncidents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('incidents')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching incidents:', error);
                return;
            }

            setIncidents(data || []);
        } catch (error) {
            console.error('Error fetching incidents:', error);
        } finally {
            setLoading(false);
        }
    };

    const addIncident = async (incidentData: IncidentFormData): Promise<{ success: boolean; error?: string }> => {
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        try {
            const incidentInsert: IncidentInsert = {
                title: incidentData.title,
                description: incidentData.description,
                severity: incidentData.severity,
                status: 'open',
                latitude: incidentData.latitude,
                longitude: incidentData.longitude,
                address: incidentData.address,
                user_id: user.id,
            };

            const { data, error } = await supabase
                .from('incidents')
                .insert(incidentInsert)
                .select()
                .single();

            if (error) {
                return { success: false, error: error.message };
            }

            setIncidents(prev => [data, ...prev]);
            return { success: true };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const updateIncident = async (id: string, updates: Partial<Incident>): Promise<{ success: boolean; error?: string }> => {
        try {
            const updateData: IncidentUpdate = {
                ...updates,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('incidents')
                .update(updateData)
                .eq('id', id);

            if (error) {
                return { success: false, error: error.message };
            }

            setIncidents(prev =>
                prev.map(incident =>
                    incident.id === id ? { ...incident, ...updates } : incident
                )
            );

            return { success: true };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const deleteIncident = async (id: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error } = await supabase
                .from('incidents')
                .delete()
                .eq('id', id);

            if (error) {
                return { success: false, error: error.message };
            }

            setIncidents(prev => prev.filter(incident => incident.id !== id));
            return { success: true };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const value = {
        incidents,
        addIncident,
        updateIncident,
        deleteIncident,
        loading,
    };

    return <IncidentContext.Provider value={value}>{children}</IncidentContext.Provider>;
};

