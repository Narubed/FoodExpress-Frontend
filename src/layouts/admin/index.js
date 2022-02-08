import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import PageLoader from './PageLoader';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const counter = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <RootStyle>
      <AdminNavbar onOpenSidebar={() => setOpen(true)} />
      <AdminSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle>
        <button onClick={() => dispatch({ type: 'OPEN' })}>.</button>
        {counter.reducer === true ? <PageLoader /> : <Outlet />}
      </MainStyle>
    </RootStyle>
  );
}
