import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import UnAuthorized from './components/auth/UnAuthorized';
import { Outlet } from '@mui/icons-material';

// Layout para páginas autenticadas com Navbar
const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ pt: 2 }}>
        <Outlet />
      </Box>
    </>
  );
};

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} fallbackElement={<LoadingFallback />} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;