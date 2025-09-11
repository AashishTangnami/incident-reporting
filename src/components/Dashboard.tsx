import React, { useState, useEffect } from 'react';
import { useIncidents } from '../contexts/IncidentContext';
import { useAuth } from '../contexts/AuthContext';
import { MapComponent } from './MapComponent';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Incident, SEVERITY_COLORS, SEVERITY_LABELS } from '../types/incident';

export const Dashboard: React.FC = () => {
    const { incidents, updateIncident, deleteIncident } = useIncidents();
    const { user, logout } = useAuth();
    const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>(incidents);
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        let filtered = incidents;

        if (severityFilter !== 'all') {
            filtered = filtered.filter(incident => incident.severity === severityFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(incident => incident.status === statusFilter);
        }

        setFilteredIncidents(filtered);
    }, [incidents, severityFilter, statusFilter]);

    const getSeverityStats = () => {
        const stats = {
            critical: incidents.filter(i => i.severity === 'critical').length,
            high: incidents.filter(i => i.severity === 'high').length,
            medium: incidents.filter(i => i.severity === 'medium').length,
            low: incidents.filter(i => i.severity === 'low').length,
        };
        return stats;
    };

    const getStatusStats = () => {
        const stats = {
            open: incidents.filter(i => i.status === 'open').length,
            'in-progress': incidents.filter(i => i.status === 'in-progress').length,
            resolved: incidents.filter(i => i.status === 'resolved').length,
        };
        return stats;
    };

    const handleStatusChange = (incidentId: string, newStatus: Incident['status']) => {
        updateIncident(incidentId, { status: newStatus });
    };

    const handleDeleteIncident = (incidentId: string) => {
        if (confirm('Are you sure you want to delete this incident?')) {
            deleteIncident(incidentId);
        }
    };

    const severityStats = getSeverityStats();
    const statusStats = getStatusStats();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Incident Dashboard</h1>
                            <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
                        </div>
                        <Button onClick={logout} variant="outline">
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Critical</p>
                                    <p className="text-2xl font-bold text-red-600">{severityStats.critical}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">High</p>
                                    <p className="text-2xl font-bold text-orange-600">{severityStats.high}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Medium</p>
                                    <p className="text-2xl font-bold text-yellow-600">{severityStats.medium}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Low</p>
                                    <p className="text-2xl font-bold text-green-600">{severityStats.low}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Severity:</label>
                        <Select value={severityFilter} onValueChange={setSeverityFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Status:</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Map */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Incident Map</CardTitle>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                                <span className="text-sm text-gray-600">Your Location</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                                <span className="text-sm text-gray-600">Critical</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm"></div>
                                <span className="text-sm text-gray-600">High</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></div>
                                <span className="text-sm text-gray-600">Medium</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                                <span className="text-sm text-gray-600">Low</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <MapComponent
                            incidents={filteredIncidents}
                            height="500px"
                            interactive={false}
                            showCurrentLocation={true}
                        />
                    </CardContent>
                </Card>

                {/* Incident List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Incident List ({filteredIncidents.length} incidents)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredIncidents.length === 0 ? (
                                <Alert>
                                    <AlertDescription className="text-center py-8">
                                        {incidents.length === 0
                                            ? "No incidents have been reported yet. Click 'Report Incident' to create the first one."
                                            : "No incidents match your current filters. Try adjusting the severity or status filters."
                                        }
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                filteredIncidents.map((incident) => (
                                    <div
                                        key={incident.id}
                                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold">{incident.title}</h3>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-white border-0"
                                                        style={{ backgroundColor: SEVERITY_COLORS[incident.severity] }}
                                                    >
                                                        {SEVERITY_LABELS[incident.severity]}
                                                    </Badge>
                                                    <Badge
                                                        variant={incident.status === 'open' ? 'destructive' :
                                                            incident.status === 'in-progress' ? 'secondary' : 'default'}
                                                    >
                                                        {incident.status.replace('-', ' ').toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                                                <div className="text-xs text-gray-500">
                                                    <p>Location: {incident.location.address || `${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}`}</p>
                                                    <p>Reported by: {incident.reportedBy} on {incident.reportedAt.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <Select
                                                    value={incident.status}
                                                    onValueChange={(value: Incident['status']) => handleStatusChange(incident.id, value)}
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="open">Open</SelectItem>
                                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                                        <SelectItem value="resolved">Resolved</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteIncident(incident.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

