import React, { useState, useEffect } from 'react';
import { useIncidents } from '../contexts/IncidentContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapComponent } from './MapComponent';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { IncidentFormData } from '../types/incident';

export const IncidentForm: React.FC = () => {
    const { addIncident } = useIncidents();
    const { user } = useAuth();
    const [formData, setFormData] = useState<IncidentFormData>({
        title: '',
        description: '',
        severity: 'low',
        location: { lat: 0, lng: 0 },
    });
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                    setFormData(prev => ({
                        ...prev,
                        location: { lat: latitude, lng: longitude }
                    }));
                    setSelectedLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.warn('Could not get location:', error);
                    // Set a default location if geolocation fails
                    const defaultLocation = { lat: 20, lng: 0 };
                    setCurrentLocation(defaultLocation);
                    setFormData(prev => ({
                        ...prev,
                        location: defaultLocation
                    }));
                }
            );
        } else {
            // Set a default location if geolocation is not supported
            const defaultLocation = { lat: 20, lng: 0 };
            setCurrentLocation(defaultLocation);
            setFormData(prev => ({
                ...prev,
                location: defaultLocation
            }));
        }
    }, []);

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng });
        setFormData(prev => ({
            ...prev,
            location: { lat, lng }
        }));
    };

    const handleUseCurrentLocation = () => {
        if (currentLocation) {
            setSelectedLocation(currentLocation);
            setFormData(prev => ({
                ...prev,
                location: currentLocation
            }));
        }
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
                    location: currentLocation || { lat: 0, lng: 0 },
                });
                setSelectedLocation(null);
                setShowSuccessDialog(true);
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

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Report New Incident</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
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
                                    <Label>Location Selection</Label>
                                    <div className="space-y-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleUseCurrentLocation}
                                            disabled={!currentLocation}
                                            className="w-full"
                                        >
                                            Use Current Location
                                        </Button>
                                        <p className="text-sm text-muted-foreground">
                                            Click on the map to select incident location
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Map - Click to select location</Label>
                                <div className="border rounded-md overflow-hidden">
                                    <MapComponent
                                        incidents={[]}
                                        onLocationSelect={handleLocationSelect}
                                        selectedLocation={selectedLocation}
                                        height="300px"
                                        interactive={true}
                                    />
                                </div>
                                {selectedLocation && (
                                    <div className="text-sm text-muted-foreground">
                                        Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setFormData({
                                        title: '',
                                        description: '',
                                        severity: 'low',
                                        location: currentLocation || { lat: 0, lng: 0 },
                                    });
                                    setSelectedLocation(null);
                                }}
                            >
                                Clear Form
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !selectedLocation}
                            >
                                {isSubmitting ? 'Reporting...' : 'Report Incident'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Incident Reported Successfully!</DialogTitle>
                        <DialogDescription>
                            Your incident has been reported and will appear on the dashboard. You can view all incidents from the dashboard page.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowSuccessDialog(false)}>
                            Continue
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

