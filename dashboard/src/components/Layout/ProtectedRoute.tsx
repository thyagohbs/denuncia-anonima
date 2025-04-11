import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
    const { isAuthenticated, hasRole, isLoading } = useAuth();
    const location = useLocation();

    // Mostra um indicador de carregamento enquanto verifica a autenticação
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Verifica se o usuário está autenticado
    if (!isAuthenticated) {
        // Redireciona para o login preservando a URL de destino original
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Verifica se o usuário tem a role necessária (se especificada)
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Se estiver autenticado e tiver as permissões, renderiza as rotas filhas
    return <Outlet />;
};

export default ProtectedRoute;