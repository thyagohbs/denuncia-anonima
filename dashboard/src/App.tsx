import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import AdminLayout from './components/Layout/AdminLayout';
import UnAuthorized from './components/auth/UnAuthorized';
import ReportDetailView from './components/dashboard/ReportDetailView';

// Loading Fallback
const LoadingFallback = () => (
  <Container>
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  </Container>
);

// Cria o cliente de Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      staleTime: 30000,
    },
  },
});

// Configuração do roteador
const router = createBrowserRouter([
  // Rota inicial redirecionada para admin se autenticado, senão para login
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
  },
  // Rotas públicas
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/unauthorized',
    element: <UnAuthorized />,
  },
  // Rotas protegidas
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AdminLayout />,
        children: [
          {
            path: '/admin',
            element: <Dashboard />,
          },
          // Adicione aqui outras rotas protegidas
          {
            path: '/admin/reports',
            element: <Dashboard />, // Substitua por um componente específico se existir
          },
          {
            path: '/admin/users',
            element: <ProtectedRoute requiredRole="admin" />,
            children: [
              {
                path: '',
                element: <Dashboard /> // Substitua por um componente específico se existir
              }
            ]
          },
          {
            path: '/admin/settings',
            element: <ProtectedRoute requiredRole="admin" />,
            children: [
              {
                path: '',
                element: <Dashboard /> // Substitua por um componente específico de configurações
              }
            ]
          },
          {
            path: '/admin/reports/:id',
            element: (
              <React.Suspense fallback={<LoadingFallback />}>
                <ReportDetailView />
              </React.Suspense>
            ),
          },
        ],
      }
    ],
  },
  // Rota de fallback para página não encontrada
  {
    path: '*',
    element: (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4">Página não encontrada</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          A página que você está procurando não existe.
        </Typography>
      </Box>
    ),
  },
]);

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <RouterProvider router={router} fallbackElement={<LoadingFallback />} />
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;