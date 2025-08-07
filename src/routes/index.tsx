import NotFound from '@/pages/notFound';
import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
const Lottery = lazy(() => import('@/pages/lottery'));

// ----------------------------------------------------------------------

export default function AppRouter() {
  const publicRoutes = [
    {
      path: '/lottery',
      element: <Lottery />
    },
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...publicRoutes]);

  return routes;
}
