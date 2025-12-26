import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import AppLayout from '@/layouts/app-layout';
import EmptyLayout from '@/layouts/empty-layout';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const DashboardPage = lazy(() => import('@/pages/dashboard'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
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
  return <RouterProvider router={router} />;
}