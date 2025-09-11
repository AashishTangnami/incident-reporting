import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { IncidentProvider } from './contexts/IncidentContext';
import { LoginForm } from './components/LoginForm';
import { SimpleMapPage } from './components/SimpleMapPage';
import { SupabaseError } from './components/SupabaseError';
import './index.css';

// Supabase is configured with hardcoded values

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />}
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <SimpleMapPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/report"
                element={
                    <ProtectedRoute>
                        <SimpleMapPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/"
                element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
            />
        </Routes>
    );
};

export function App() {
    return (
        <AuthProvider>
            <IncidentProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </IncidentProvider>
        </AuthProvider>
    );
}

export default App;

