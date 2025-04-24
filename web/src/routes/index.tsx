import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import StartPage from '../pages/StartPage';
import HomePage from '../pages/home/HomePage';
import LocationPage from '../pages/location/LocationPage';
import SuccessPage from '../pages/success/SuccessPage';
import NotFoundPage from '../pages/NotFoundPage';
import TrackerPage from '../pages/tracker/TrackerPage';
import DescricaoPage from '../pages/descricao/DescricaoPage';

const router = createBrowserRouter([
    {
        path: '/',
        children: [
            {
                index: true,
                element: <Navigate to="/start" replace />
            },
            {
                path: 'start',
                element: <StartPage />
            },
            {
                path: 'home',
                element: <HomePage />
            },
            {
                path: 'local',
                element: <LocationPage />
            },
            {
                path: 'descricao',
                element: <DescricaoPage />
            },
            {
                path: 'success',
                element: <SuccessPage />
            },
            {
                path: 'track',
                element: <TrackerPage />
            },
            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    }
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};