import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/Member/WalletMember/DashboardApp';
import Products from './pages/Member/Products/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import CheckOrderMemberApp from './pages/Member/CheckOrderMember/CheckOrderMemberApp';
import UnderMemberApp from './pages/Member/UnderMember/UnderMemberApp';
import CheckOrderDetailUnderMemberApp from './pages/Member/CheckOrderDetailUnderMember/CheckOrderDetailUnderMemberApp';
import TakeOrdersMemberApp from './pages/Member/TakeOrdersMember/TakeOrdersMemberApp';
import BlogReportOrderApp from './pages/Member/BlogReportOrder/BlogsReportOrderApp';
import StockProductApp from './pages/Member/StockProduct/StockProductApp';
import CheckOrderUnderMemberApp from './pages/Member/CheckOrderUnderMember/CheckOrderUnderMemberApp';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/products" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'CheckOrderMemberApp', element: <CheckOrderMemberApp /> },
        { path: 'UnderMemberApp', element: <UnderMemberApp /> },
        { path: 'CheckOrderDetailUnderMemberApp', element: <CheckOrderDetailUnderMemberApp /> },
        { path: 'TakeOrdersMemberApp', element: <TakeOrdersMemberApp /> },
        { path: 'BlogsReportOrderApp', element: <BlogReportOrderApp /> },
        { path: 'StockProductApp', element: <StockProductApp /> },
        { path: 'CheckOrderUnderMemberApp', element: <CheckOrderUnderMemberApp /> },

        { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
