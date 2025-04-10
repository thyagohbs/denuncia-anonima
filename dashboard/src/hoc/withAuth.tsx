import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface WithAuthOptions {
    requiredRole?: string;
}

export const withAuth = <P extends object>(
    Component: React.ComponentType<P>,
    options: WithAuthOptions = {}
) => {
    const WithAuthComponent: React.FC<P> = (props) => {
        const { isAuthenticated, hasRole, isLoading } = useAuth();
        const location = useLocation();

        if (isLoading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (!isAuthenticated) {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }

        if (options.requiredRole && !hasRole(options.requiredRole)) {
            return <Navigate to="/unauthorized" replace />;
        }

        return <Component {...props} />;
    };

    return WithAuthComponent;
};

export default withAuth;