import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoadingPage from '../components/common/LoadingPage';

// Lazy loading para melhor performance
const HomePage = lazy(() => import('../pages/home/HomePage'));
const ReportPage = lazy(() => import('../pages/report/ReportPage'));
const TrackReportPage = lazy(() => import('../pages/report/TrackReportPage'));
const PrivacyPage = lazy(() => import('../pages/privacy/PrivacyPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const routes = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <HomePage />
                    </Suspense>
                ),
            },
            {
                path: 'report',
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <ReportPage />
                    </Suspense>
                ),
            },
            {
                path: 'track',
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <TrackReportPage />
                    </Suspense>
                ),
            },
            {
                path: 'privacy',
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <PrivacyPage />
                    </Suspense>
                ),
            },
            {
                path: '*',
                element: (
                    <Suspense fallback={<LoadingPage />}>
                        <NotFoundPage />
                    </Suspense>
                ),
            },
        ],
    },
]);

export function AppRoutes() {
    return <RouterProvider router={routes} />;
}