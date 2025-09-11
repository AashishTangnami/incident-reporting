import React, { useState } from 'react';
import { useIncidents } from '../contexts/IncidentContext';
import { useAuth } from '../contexts/AuthContext';
import { MapComponent } from './MapComponent';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { X, Plus, MapPin } from 'lucide-react';
import { IncidentFormData } from '../types/incident';

export const SimpleMapPage: React.FC = () => {
    const { incidents, addIncident, loading: incidentsLoading } = useIncidents();
    const { user, logout, loading: authLoading } = useAuth();
    const [showSidebar, setShowSidebar] = useState(false);
    const [formData, setFormData] = useState<IncidentFormData>({
        title: '',
        description: '',
        severity: 'low',
        location: { lat: 0, lng: 0 },
    });
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng });
        setFormData(prev => ({
            ...prev,
            location: { lat, lng }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !formData.location.lat || !formData.location.lng) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Get address from coordinates (reverse geocoding)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${formData.location.lat}&lon=${formData.location.lng}`
            );
            const data = await response.json();

            const incidentData = {
                title: formData.title,
                description: formData.description,
                severity: formData.severity,
                latitude: formData.location.lat,
                longitude: formData.location.lng,
                address: data.display_name || 'Unknown location'
            };

            const result = await addIncident(incidentData);

            if (result.success) {
                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    severity: 'low',
                    location: { lat: 0, lng: 0 },
                });
                setSelectedLocation(null);
                setShowSidebar(false);
            } else {
                setError(result.error || 'Error reporting incident. Please try again.');
            }

        } catch (error) {
            console.error('Error reporting incident:', error);
            setError('Error reporting incident. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const severityCounts = incidents.reduce((acc, incident) => {
        acc[incident.severity] = (acc[incident.severity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (authLoading || incidentsLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    <h1 className="text-xl font-bold text-gray-900">Incident Reporting</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {Object.entries(severityCounts).map(([severity, count]) => (
                            <Badge
                                key={severity}
                                variant="outline"
                                className="text-white border-0"
                                style={{
                                    backgroundColor: severity === 'critical' ? '#dc2626' :
                                        severity === 'high' ? '#ea580c' :
                                            severity === 'medium' ? '#d97706' : '#16a34a'
                                }}
                            >
                                {severity.toUpperCase()}: {count}
                            </Badge>
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                    <Button onClick={logout} variant="outline" size="sm">
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex relative">
                {/* Map */}
                <div className="flex-1">
                    <MapComponent
                        incidents={incidents}
                        onLocationSelect={handleLocationSelect}
                        selectedLocation={selectedLocation}
                        height="100%"
                        interactive={true}
                        showCurrentLocation={true}
                    />
                </div>

                {/* Sidebar */}
                <div className={`w-80 bg-white shadow-lg border-l flex flex-col transition-all duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Report Incident</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSidebar(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-auto p-4">
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Incident Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Brief description of the incident"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="severity">Severity Level</Label>
                                <Select
                                    value={formData.severity}
                                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, severity: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low (Green)</SelectItem>
                                        <SelectItem value="medium">Medium (Yellow)</SelectItem>
                                        <SelectItem value="high">High (Orange)</SelectItem>
                                        <SelectItem value="critical">Critical (Red)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Detailed description of the incident"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Location</Label>
                                <p className="text-sm text-gray-600">
                                    Click on the map to select incident location
                                </p>
                                {selectedLocation && (
                                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                                        Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowSidebar(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !selectedLocation}
                                    className="flex-1"
                                >
                                    {isSubmitting ? 'Reporting...' : 'Report Incident'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Small Floating Action Button */}
                <Button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="absolute top-4 right-4 shadow-lg z-10 rounded-full w-12 h-12 p-0 hover:scale-105 transition-transform duration-200"
                    size="icon"
                    variant={showSidebar ? "destructive" : "default"}
                    title={showSidebar ? "Close sidebar" : "Report incident"}
                >
                    {showSidebar ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Plus className="h-5 w-5" />
                    )}
                </Button>
            </div>
        </div>
    );
};