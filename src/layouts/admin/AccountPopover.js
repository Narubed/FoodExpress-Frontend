import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// components
import axios from 'axios';
import MenuPopover from '../../components/MenuPopover';
//

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const logout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    window.location.href = '/';
  };
  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Icon icon="si-glyph:customer-support" width={30} height={30} color="#8A2BE2" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            Admin
            {/* {User.firstname} */}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {/* {User.email} */}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          key={1}
          to="/"
          component={RouterLink}
          onClick={handleClose}
          sx={{ typography: 'body2', py: 1, px: 2.5 }}
        >
          <Box
            sx={{
              mr: 2,
              width: 24,
              height: 24
            }}
          >
            <Icon icon="flat-color-icons:home" width="24" height="24" />
          </Box>
          หน้าหลัก
        </MenuItem>
        {sessionStorage.getItem('level') === 'ManagerAdmin' ? (
          <MenuItem
            key={4}
            to="/admin/ChangeAdminApp"
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            >
              <Icon icon="noto:hotel" width="24" height="24" />
            </Box>
            จัดการผู้ดูแลระบบ
          </MenuItem>
        ) : null}
        <MenuItem
          key={5}
          to="/admin/AdminCutArountAllApp"
          component={RouterLink}
          onClick={handleClose}
          sx={{ typography: 'body2', py: 1, px: 2.5 }}
        >
          <Box
            sx={{
              mr: 2,
              width: 24,
              height: 24
            }}
          >
            <Icon icon="noto:card-file-box" width="24" height="24" />
          </Box>
          รายการที่ถูกตัดรอบไปเเล้ว
        </MenuItem>
        {sessionStorage.getItem('level') === 'ManagerAdmin' ? (
          <MenuItem
            key={6}
            to="/admin/NBACompanyPerfitApp"
            component={RouterLink}
            onClick={handleClose}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            >
              <Icon icon="noto-v1:money-bag" width="24" height="24" />
            </Box>
            กำไรทั้งหมดของบริษัท
          </MenuItem>
        ) : null}
        <MenuItem
          key={2}
          to="/admin/AnnounceSlide"
          component={RouterLink}
          onClick={handleClose}
          sx={{ typography: 'body2', py: 1, px: 2.5 }}
        >
          <Box
            sx={{
              mr: 2,
              width: 24,
              height: 24
            }}
          >
            <Icon icon="emojione-v1:bull-horn-with-sound-waves" width="24" height="24" />
          </Box>
          เปลี่ยนประกาศ
        </MenuItem>

        <MenuItem
          key={3}
          to="/admin/AnnounceAdvert"
          component={RouterLink}
          onClick={handleClose}
          sx={{ typography: 'body2', py: 1, px: 2.5 }}
        >
          <Box
            sx={{
              mr: 2,
              width: 24,
              height: 24
            }}
          >
            <Icon icon="flat-color-icons:edit-image" width="24" height="24" />
          </Box>
          เปลี่ยนโฆษณา
        </MenuItem>

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
