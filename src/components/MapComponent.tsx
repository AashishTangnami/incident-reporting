import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Incident, SEVERITY_COLORS } from '../types/incident';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
    incidents?: Incident[];
    onLocationSelect?: (lat: number, lng: number) => void;
    selectedLocation?: { lat: number; lng: number } | null;
    height?: string;
    interactive?: boolean;
    showCurrentLocation?: boolean;
}

const LocationMarker: React.FC<{
    onLocationSelect: (lat: number, lng: number) => void;
    selectedLocation: { lat: number; lng: number } | null;
}> = ({ onLocationSelect, selectedLocation }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onLocationSelect(lat, lng);
        },
    });

    return selectedLocation ? (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
    ) : null;
};

const CurrentLocationMarker: React.FC<{ currentLocation: { lat: number; lng: number } }> = ({ currentLocation }) => {
    const currentLocationIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
      background-color: #3B82F6;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });

    return (
        <Marker position={[currentLocation.lat, currentLocation.lng]} icon={currentLocationIcon}>
            <Popup>
                <div className="p-2">
                    <h3 className="font-semibold text-sm text-blue-600">Your Current Location</h3>
                    <p className="text-xs text-gray-600 mt-1">
                        {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                    </p>
                </div>
            </Popup>
        </Marker>
    );
};

export const MapComponent: React.FC<MapComponentProps> = ({
    incidents = [],
    onLocationSelect,
    selectedLocation,
    height = '400px',
    interactive = true,
    showCurrentLocation = false,
}) => {
    const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
    const [isLocationLoaded, setIsLocationLoaded] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapCenter([latitude, longitude]);
                    setCurrentLocation({ lat: latitude, lng: longitude });
                    setIsLocationLoaded(true);
                },
                (error) => {
                    console.warn('Could not get location:', error);
                    // Fallback to a more central location if geolocation fails
                    setMapCenter([20, 0]);
                    setIsLocationLoaded(true);
                }
            );
        } else {
            // Fallback if geolocation is not supported
            setMapCenter([20, 0]);
            setIsLocationLoaded(true);
        }
    }, []);

    const createCustomIcon = (severity: Incident['severity']) => {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="
        background-color: ${SEVERITY_COLORS[severity]};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });
    };

    if (!isLocationLoaded) {
        return (
            <div style={{ height, width: '100%' }} className="flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height, width: '100%' }}>
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={interactive}
                zoomControl={interactive}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {interactive && onLocationSelect && (
                    <LocationMarker
                        onLocationSelect={onLocationSelect}
                        selectedLocation={selectedLocation}
                    />
                )}

                {showCurrentLocation && currentLocation && (
                    <CurrentLocationMarker currentLocation={currentLocation} />
                )}

                {incidents
                    .filter(incident => incident.latitude && incident.longitude)
                    .map((incident) => (
                        <Marker
                            key={incident.id}
                            position={[incident.latitude, incident.longitude]}
                            icon={createCustomIcon(incident.severity)}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-semibold text-sm">{incident.title}</h3>
                                    <p className="text-xs text-gray-600 mt-1">{incident.description}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span
                                            className="inline-block w-3 h-3 rounded-full"
                                            style={{ backgroundColor: SEVERITY_COLORS[incident.severity] }}
                                        ></span>
                                        <span className="text-xs font-medium capitalize">{incident.severity}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Reported: {new Date(incident.created_at).toLocaleDateString()}
                                    </p>
                                    {incident.address && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {incident.address}
                                        </p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>
        </div>
    );
};

