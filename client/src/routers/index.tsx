import { Navigate, Outlet, RouteObject, useLocation, useRoutes } from 'react-router-dom';

import HomePage from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { getUserState } from '@/store/user';
import DrivePage from '@/pages/drive';
import ResourcePoolPage from '@/pages/drive_resource_pool';
import StreamingVideoDemoPage from '@/pages/streaming_video';

const RequireAuth = () => {
  const location = useLocation();
  const user = getUserState();
  if (!user.isLogin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
};

const LoginRedirect = () => {
  const user = getUserState();
  return <Navigate to={user.isLogin ? '/home/drive' : '/login'} replace />;
};

const ROUTE_MAP: RouteObject[] = [
  { path: '/', element: <LoginRedirect /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/home',
        element: <HomePage />,
        children: [
          { path: '', element: <Navigate to="drive" replace /> },
          { path: 'drive', element: <DrivePage /> },
          { path: 'drive/*', element: <DrivePage /> },
          { path: 'driveResourcePool', element: <ResourcePoolPage /> },
          { path: 'streamingVideo', element: <StreamingVideoDemoPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];

export const ReactRoutes = () => useRoutes(ROUTE_MAP);
