export interface Incident {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    latitude: number;
    longitude: number;
    address?: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

export interface IncidentFormData {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: {
        lat: number;
        lng: number;
        address?: string;
    };
}

export const SEVERITY_COLORS = {
    low: '#10B981', // Green
    medium: '#F59E0B', // Yellow
    high: '#F97316', // Orange
    critical: '#EF4444', // Red
} as const;

export const SEVERITY_LABELS = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
} as const;

