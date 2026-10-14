import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

// Route-level code splitting keeps the initial bundle small.
const HomePage = lazy(() => import('./pages/HomePage'));
const VenueDetailsPage = lazy(() => import('./pages/VenueDetailsPage'));
const PlayersPage = lazy(() => import('./pages/PlayersPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OwnerDashboardPage = lazy(() => import('./pages/OwnerDashboardPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/venue/:id', element: <VenueDetailsPage /> },
      { path: '/players', element: <PlayersPage /> },
      { path: '/bookings', element: <BookingsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/owner', element: <OwnerDashboardPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
