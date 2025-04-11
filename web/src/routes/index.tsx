import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/home/HomePage';
import ReportFormPage from '../pages/report/ReportFormPage';
import ReportLocationPage from '../pages/report/ReportLocationPage';
import ReportDetailsPage from '../pages/report/ReportDetailsPage';
import ReportConfirmationPage from '../pages/report/ReportConfirmationPage';
import TrackReportPage from '../pages/track/TrackReportPage';
import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            // Página inicial
            {
                index: true,
                element: <HomePage />
            },
            // Fluxo de denúncia (rotas aninhadas)
            {
                path: 'report',
                children: [
                    {
                        index: true,
                        element: <ReportFormPage /> // Página inicial do formulário
                    },
                    {
                        path: 'location',
                        element: <ReportLocationPage /> // Página para selecionar localização
                    },
                    {
                        path: 'details',
                        element: <ReportDetailsPage /> // Página para detalhes adicionais
                    },
                    {
                        path: 'confirmation',
                        element: <ReportConfirmationPage /> // Confirmação final
                    }
                ]
            },
            // Consultar denúncia pelo protocolo
            {
                path: 'track',
                element: <TrackReportPage />
            },

            // Página não encontrada
            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    },
    // Rotas do painel administrativo (redirecionará para o dashboard)
    {
        path: 'admin/*',
        element: <Navigate to="/admin" replace />
    }
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};