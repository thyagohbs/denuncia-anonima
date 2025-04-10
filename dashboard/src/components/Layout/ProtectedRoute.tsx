import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
    const { isAuthenticated, hasRole } = useAuth();
    const location = useLocation();

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