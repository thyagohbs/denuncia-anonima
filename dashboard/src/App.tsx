import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import { Box, Typography } from '@mui/material';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import UnAuthorized from './components/auth/UnAuthorized';

// Layout para páginas autenticadas
const AuthenticatedLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <ProtectedRoute />
      </main>
    </>
  );
};

// Configuração do roteador
const router = createBrowserRouter([
  // Rota inicial redirecionada para login
  {
    path: '/',
    element: <Login />,
  },
  // Rota de login explícita
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  // Rotas protegidas
  {
    path: '/',
    element: <AuthenticatedLayout />,
    children: [
      {
        path: '/admin',
        element: <Dashboard />,
      },
      // Adicione outras rotas protegidas conforme necessário
    ],
  },
  {
    path: '/unauthorized',
    element: <UnAuthorized />,
  },
  // Rota de fallback para página não encontrada
  {
    path: '*',
    element: (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4">Página não encontrada</Typography>
      </Box>
    ),
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;