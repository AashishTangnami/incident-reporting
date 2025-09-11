import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export const Navigation: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/report', label: 'Report Incident' },
    ];

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-xl font-bold text-gray-900">
                            Incident Reporting
                        </Link>
                        <div className="flex space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Welcome, {user.username}</span>
                        <Button onClick={logout} variant="outline" size="sm">
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

