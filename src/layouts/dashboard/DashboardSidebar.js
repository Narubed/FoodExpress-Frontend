import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
import ButtonT from '@material-tailwind/react/Button';
// components
import { purple } from '@mui/material/colors';

import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
import { Refresh } from '../Refresh';
//
import sidebarConfig from './SidebarConfig';
import account from '../../_mocks_/account';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: purple[50]
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};
const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700]
  }
}));
export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const [count, setCount] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3, mx: 'auto' }}>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
          <Refresh onClick={() => setCount(count + 1)} />
          <div className="example-container">
            <motion.div
              animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 720, 720, 0],
                borderRadius: ['40%', '40%', '100%', '100%', '40%']
              }}
              transition={{
                duration: 4,
                ease: 'easeInOut',
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <Logo />
            </motion.div>
          </div>
        </Box>
      </Box>
      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            {/* <Avatar src={account.photoURL} alt="photoURL" /> */}
            <Box sx={{ ml: 2, boxShadow: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                <div>
                  {`${sessionStorage.getItem('firstname')}  ${sessionStorage.getItem('lastname')}`}
                </div>
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>
      <NavSection navConfig={sidebarConfig} />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{
            p: 2.5,
            pt: 5,
            borderRadius: 2,
            position: 'relative',
            bgcolor: purple[100]
          }}
        >
          <Box
            component="img"
            src="/static/illustrations/icon 01-04.png"
            sx={{ width: 250, position: 'absolute', top: -60 }}
          />
          <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
            <ColorButton
              fullWidth
              href="https://nbadigitalworlds.com/2021/"
              target="_blank"
              variant="contained"
            >
              <div>ติดต่อได้ที่ NBA Digital</div>
            </ColorButton>
          </motion.button>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
