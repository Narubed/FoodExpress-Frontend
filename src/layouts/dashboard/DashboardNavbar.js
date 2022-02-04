/* eslint-disable no-useless-concat */
/* eslint-disable jsx-a11y/no-distracting-elements */
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import Marquee from 'react-fast-marquee';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
// components
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MHidden } from '../../components/@material-extend';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import PopUpAdvert from './PopUpAdvert';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const [Announce, setAnnounce] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getAnnounceSlide = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getAnnounceSlide`
    );
    setAnnounce(getAnnounceSlide.data.data[0].announce_slide_data);
  }, []);
  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>
        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />
        <Marquee
          delay={0}
          gradientColor={[240, 240, 240]}
          style={{ color: 'red', fontSize: '1em' }}
        >
          <Icon icon="emojione-v1:bull-horn-with-sound-waves" width="30" height="30" />{' '}
          <Icon icon="emojione-v1:bull-horn-with-sound-waves" width="30" height="30" />
          ..{Announce}..
          <Icon icon="emojione-v1:bull-horn-with-sound-waves" width="30" height="30" />{' '}
          <Icon icon="emojione-v1:bull-horn-with-sound-waves" width="30" height="30" />
        </Marquee>
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover />
          <PopUpAdvert />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
