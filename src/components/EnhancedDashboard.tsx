import React, { useState } from 'react';
import { useIncidents } from '../contexts/IncidentContext';
import { useAuth } from '../contexts/AuthContext';
import { MapComponent } from './MapComponent';
import { IncidentDataTable } from './IncidentDataTable';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
} from './ui/sidebar';
import {
    Home,
    MapPin,
    FileText,
    Settings,
    BarChart3,
    AlertTriangle,
    Users,
    Calendar
} from 'lucide-react';
import { Incident, SEVERITY_COLORS, SEVERITY_LABELS } from '../types/incident';

const AppSidebar = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
        },
        {
            title: "Incidents",
            url: "/dashboard",
            icon: FileText,
        },
        {
            title: "Map View",
            url: "/dashboard",
            icon: MapPin,
        },
        {
            title: "Analytics",
            url: "/dashboard",
            icon: BarChart3,
        },
        {
            title: "Settings",
            url: "/dashboard",
            icon: Settings,
        },
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-2">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-lg">Incident Reporting</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>{user?.username}</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export const EnhancedDashboard: React.FC = () => {
    const { incidents, updateIncident, deleteIncident } = useIncidents();
    const { user, logout } = useAuth();
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredIncidents = incidents.filter(incident => {
        const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
        const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
        return matchesSeverity && matchesStatus;
    });

    const severityCounts = incidents.reduce((acc, incident) => {
        acc[incident.severity] = (acc[incident.severity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const statusCounts = incidents.reduce((acc, incident) => {
        acc[incident.status] = (acc[incident.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <SidebarProvider>
            <div className="flex h-screen">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                    <header className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <h1 className="text-2xl font-bold">Incident Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Welcome, {user?.username}</span>
                            <button
                                onClick={logout}
                                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 overflow-auto p-6">
                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="incidents">Incidents</TabsTrigger>
                                <TabsTrigger value="map">Map View</TabsTrigger>
                                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                {/* Statistics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Critical</CardTitle>
                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-red-600">
                                                {severityCounts.critical || 0}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                High priority incidents
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">High</CardTitle>
                                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-orange-600">
                                                {severityCounts.high || 0}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Important incidents
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Medium</CardTitle>
                                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {severityCounts.medium || 0}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Moderate incidents
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Low</CardTitle>
                                            <AlertTriangle className="h-4 w-4 text-green-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-green-600">
                                                {severityCounts.low || 0}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Low priority incidents
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Incidents */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Incidents</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {incidents.length === 0 ? (
                                            <Alert>
                                                <AlertDescription>
                                                    No incidents have been reported yet. Click 'Report Incident' to create the first one.
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <div className="space-y-4">
                                                {incidents.slice(0, 5).map((incident) => (
                                                    <div
                                                        key={incident.id}
                                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-white border-0"
                                                                style={{ backgroundColor: SEVERITY_COLORS[incident.severity] }}
                                                            >
                                                                {SEVERITY_LABELS[incident.severity]}
                                                            </Badge>
                                                            <div>
                                                                <h3 className="font-medium">{incident.title}</h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {incident.reportedBy} • {incident.reportedAt.toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                incident.status === 'open'
                                                                    ? 'destructive'
                                                                    : incident.status === 'in-progress'
                                                                        ? 'secondary'
                                                                        : 'default'
                                                            }
                                                        >
                                                            {incident.status.replace('-', ' ').toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="incidents">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>All Incidents</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <IncidentDataTable
                                            incidents={filteredIncidents}
                                            onUpdateIncident={updateIncident}
                                            onDeleteIncident={deleteIncident}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="map">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Incident Map</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-96">
                                            <MapComponent
                                                incidents={incidents}
                                                height="100%"
                                                interactive={true}
                                                showCurrentLocation={true}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="analytics">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Severity Distribution</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {Object.entries(severityCounts).map(([severity, count]) => (
                                                    <div key={severity} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] }}
                                                            />
                                                            <span className="capitalize">{severity}</span>
                                                        </div>
                                                        <span className="font-medium">{count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Status Distribution</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {Object.entries(statusCounts).map(([status, count]) => (
                                                    <div key={status} className="flex items-center justify-between">
                                                        <span className="capitalize">{status.replace('-', ' ')}</span>
                                                        <span className="font-medium">{count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};
