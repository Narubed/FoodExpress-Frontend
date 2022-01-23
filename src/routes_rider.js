import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import RiderLayout from './layouts/rider';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import RiderApp from './pages/Rider/RiderApp';
import NotFound from './pages/Page404';
import RiderTakesOrderApp from './pages/Rider/RiderTakeOrder/RiderTakesOrderApp';
import RiderCreatBarCodeApp from './pages/Rider/RiderTakeOrder/RiderCreatBarCodeApp';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/rider',
      element: <RiderLayout />,
      children: [
        { element: <Navigate to="/rider/app" replace /> },
        { path: 'app', element: <RiderApp /> },
        { path: 'RiderTakesOrderApp', element: <RiderTakesOrderApp /> },
        { path: 'RiderTakesOrderApp/RiderCreatBarCodeApp', element: <RiderCreatBarCodeApp /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/rider " /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
