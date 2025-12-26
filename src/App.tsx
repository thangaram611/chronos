import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AppLayout from '@/layouts/app-layout';
import EmptyLayout from '@/layouts/empty-layout';
import { ErrorBoundary } from '@/components/error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import PWABadge from '@/PWABadge';

const TimelinePage = lazy(() => import('@/pages/timeline'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/timeline" replace />,
      },
      {
        path: 'timeline',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <TimelinePage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <EmptyLayout />,
    children: [
      // Add auth routes here later
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <PWABadge />
    </>
  );
}