import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import AdminLayout from './layouts/admin';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/Page404';
import AdminApp from './pages/Admin/AdminApp';
import AdminRiderApp from './pages/Admin/Menagement/Rider/AdminRiderApp';
import AdminCreateRiderApp from './pages/Admin/Menagement/Rider/AdminCreateRiderApp';
import AdminCompanyApp from './pages/Admin/Menagement/Company/AdminCompanyApp';
import AdminProductApp from './pages/Admin/Menagement/Product/AdminProductApp';
import AdminCreateCompanyApp from './pages/Admin/Menagement/Company/AdminCreateCompanyApp';
import AdminCreateProductApp from './pages/Admin/Menagement/Product/AdminCreateProductApp';
import AdminEditProductApp from './pages/Admin/Menagement/Product/AdminEditProductApp';
import AdminMemberApp from './pages/Admin/Menagement/Member/AdminMemberApp';
import AdminCreateMemberApp from './pages/Admin/Menagement/Member/AdminCreateMemberApp';
import AdminEditMemberApp from './pages/Admin/Menagement/Member/AdminEditMemberApp';
import AdminPercentApp from './pages/Admin/Percent/AdminPercentApp';
import AdminCheckOrderApp from './pages/Admin/CheckOrder/AdminCheckOrderApp';
import AdminCheckOrderPartnerApp from './pages/Admin/CheckOrder/AdminCheckOrderPartner';

import AdminConfirmExpressApp from './pages/Admin/ConfirmExpress/AdminConfirmExpressApp';
import AdminWalletApp from './pages/Admin/Wallet/AdminWalletApp';
import AdminCutArountWalletPartner from './pages/Admin/Wallet/AdminCutArountWalletPartner';
import AdminWalletPartner from './pages/Admin/Wallet/AdminWalletPartner';
import AdminWalletPutSlip from './pages/Admin/Wallet/AdminCutArountWalletPartner/AdminWalletPutSlip';
import AdminPrintOrderPartner from './pages/Admin/CheckOrder/AdminCheckOrderPartner/AdminPrintOrderPartner';
import AdminConfirmPartnerExpressApp from './pages/Admin/ConfirmExpress/ConfirmPartnerExpress/ConfirmPartnerExpressApp';
import AdminCutArountPartnerApp from './pages/Admin/CutArount/AdminCutArountPartnerApp';
import AdminCutArountPartnerAllApp from './pages/Admin/CutArountAll/AdminCutArountPartnerAllApp';
import AdminCreateOrderRiderApp from './pages/Admin/TakesOrder/CreateOrderRiderApp';

import AdminCutArountApp from './pages/Admin/CutArount/AdminCutArountApp';
import AdminTakesOrderApp from './pages/Admin/TakesOrder/AdminTakesOrderApp';
import AdminTakesOrderDetail from './pages/Admin/TakesOrder/AdminTakesOrderDetail';
import AdminCreateOrderRiderAppOld from './pages/Admin/TakesOrder/AdminCreateOrderRiderApp';
import AnnounceSlide from './pages/Admin/Announce/AnnounceSlide';
import AnnounceAdvert from './pages/Admin/Announce/AnnounceAdvert';
import ChangeAdminApp from './pages/Admin/ChangeAdmin/ChangeAdminApp';
import CreateAdminApp from './pages/Admin/ChangeAdmin/CreateAdminApp';
import AdminCutArountAllApp from './pages/Admin/CutArountAll/AdminCutArountAllApp';
import NBACompanyPerfitApp from './pages/Admin/NBACompanyPerfit/NBACompanyPerfitApp';
import AdminPrintOrderApp from './pages/Admin/CheckOrder/AdminPrintOrderApp';
import AdminCutArountWalletApp from './pages/Admin/Wallet/AdminCutArountWalletApp';
import CheckRemainingOrders from './pages/Admin/TakesOrder/CheckRemainingOrders';
import ReportActionAdminApp from './pages/Admin/ReportActionAdmin/ReportActionAdminApp';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { element: <Navigate to="/admin/app" replace /> },
        { path: 'app', element: <AdminApp /> },
        { path: 'AdminRiderApp', element: <AdminRiderApp /> },
        { path: 'AdminRiderApp/AdminCreateRiderApp', element: <AdminCreateRiderApp /> },
        { path: 'AdminCompanyApp', element: <AdminCompanyApp /> },
        { path: 'AdminCompanyApp/AdminCreateCompanyApp', element: <AdminCreateCompanyApp /> },
        { path: 'AdminProductApp', element: <AdminProductApp /> },
        { path: 'AdminProductApp/AdminCreateProductApp', element: <AdminCreateProductApp /> },
        { path: 'AdminProductApp/AdminEditProductApp', element: <AdminEditProductApp /> },
        { path: 'AdminMemberApp', element: <AdminMemberApp /> },
        { path: 'AdminMemberApp/AdminCreateMemberApp', element: <AdminCreateMemberApp /> },
        { path: 'AdminMemberApp/AdminEditMemberApp', element: <AdminEditMemberApp /> },
        { path: 'AdminPercentApp', element: <AdminPercentApp /> },
        { path: 'AdminCheckOrderApp', element: <AdminCheckOrderApp /> },
        { path: 'AdminCheckOrderPartnerApp', element: <AdminCheckOrderPartnerApp /> },
        {
          path: 'AdminCheckOrderPartnerApp/AdminPrintOrderPartner',
          element: <AdminPrintOrderPartner />
        },
        { path: 'AdminConfirmExpressApp', element: <AdminConfirmExpressApp /> },
        { path: 'AdminWalletApp', element: <AdminWalletApp /> },
        { path: 'AdminWalletPartner', element: <AdminWalletPartner /> },
        { path: 'AdminWalletApp/AdminCutArountWalletApp', element: <AdminCutArountWalletApp /> },
        {
          path: 'AdminWalletPartner/AdminCutArountWalletPartner',
          element: <AdminCutArountWalletPartner />
        },
        {
          path: 'AdminWalletPartner/AdminCutArountWalletPartner/AdminWalletPutSlip',
          element: <AdminWalletPutSlip />
        },

        { path: 'AdminCutArountApp', element: <AdminCutArountApp /> },
        { path: 'AdminTakesOrderApp', element: <AdminTakesOrderApp /> },
        { path: 'AdminTakesOrderApp/AdminTakesOrderDetail', element: <AdminTakesOrderDetail /> },
        { path: 'AdminTakesOrderApp/CheckRemainingOrders', element: <CheckRemainingOrders /> },
        {
          path: 'AdminTakesOrderApp/AdminTakesOrderDetail/AdminCreateOrderRiderAppOld',
          element: <AdminCreateOrderRiderAppOld />
        },
        {
          path: 'AdminTakesOrderApp/AdminTakesOrderDetail/AdminCreateOrderRiderApp',
          element: <AdminCreateOrderRiderApp />
        },
        { path: 'AnnounceSlide', element: <AnnounceSlide /> },
        { path: 'AnnounceAdvert', element: <AnnounceAdvert /> },
        { path: 'ChangeAdminApp', element: <ChangeAdminApp /> },
        { path: 'ChangeAdminApp/CreateAdminApp', element: <CreateAdminApp /> },
        { path: 'AdminCutArountAllApp', element: <AdminCutArountAllApp /> },
        { path: 'NBACompanyPerfitApp', element: <NBACompanyPerfitApp /> },
        { path: 'AdminCheckOrderApp/AdminPrintOrderApp', element: <AdminPrintOrderApp /> },
        { path: 'ReportActionAdminApp', element: <ReportActionAdminApp /> },
        { path: 'AdminConfirmPartnerExpressApp', element: <AdminConfirmPartnerExpressApp /> },
        { path: 'AdminCutArountPartnerApp', element: <AdminCutArountPartnerApp /> },
        { path: 'AdminCutArountPartnerAllApp', element: <AdminCutArountPartnerAllApp /> }

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
