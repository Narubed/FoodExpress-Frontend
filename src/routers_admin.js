import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import AdminLayout from './layouts/admin';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/Page404';
import AdminApp from './pages/Admin/AdminApp';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { element: <Navigate to="/admin/app" replace /> },
        { path: 'app', element: <AdminApp /> }
        // { path: 'user', element: <User /> },
        // { path: 'products', element: <Products /> },
        // { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/admin" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
