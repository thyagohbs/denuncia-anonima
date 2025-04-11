import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    isLoading?: boolean;
    redirectPath?: string;
}

const ProtectedRoute = ({
    isAuthenticated,
    isLoading = false,
    redirectPath = '/login'
}: ProtectedRouteProps) => {
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;