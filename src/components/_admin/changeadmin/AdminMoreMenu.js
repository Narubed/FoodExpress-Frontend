/* eslint-disable camelcase */
import { Icon } from '@iconify/react';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import PropTypes from 'prop-types';
// material-tailwind
import '@material-tailwind/react/tailwind.css';
import Input from '@material-tailwind/react/Input';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

import Button from '@material-tailwind/react/Button';
// ----------------------------------------------------------------------
RiderMoreMenu.propTypes = {
  admin_auto_id: PropTypes.number,
  admin_id_login: PropTypes.string,
  admin_pw_login: PropTypes.string,
  admin_first_name: PropTypes.string,
  admin_last_name: PropTypes.string
};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function RiderMoreMenu(props) {
  const dispatch = useDispatch();
  // eslint-disable-next-line camelcase
  const { admin_auto_id, admin_id_login, admin_pw_login, admin_first_name, admin_last_name } =
    props;
  const [onChangeFirstname, setonChangeFirstname] = useState('');
  const [onChangeLastName, setonChangeLastName] = useState();
  const [onChangeIDLogin, setonChangeIDLogin] = useState();
  const [onChangePWLogin, setonChangePWLogin] = useState();
  const [showModal, setShowModalCode] = useState(false);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const deleteRider = (admin_auto_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการลบผู้ดูแลระบบหรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/deleteAdmin/${admin_auto_id}`);
        Swal.fire({
          icon: 'success',
          title: 'คุณได้ลบผู้ดูแลระบบเรียบร้อยเเล้ว',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          dispatch({ type: 'TURNOFF' });
        }, 1500);
      }
    });
  };
  const setDataEditAdmin = async () => {
    setonChangeFirstname(admin_first_name);
    setonChangeLastName(admin_last_name);
    setonChangeIDLogin(admin_id_login);
    setonChangePWLogin(admin_pw_login);
    setShowModalCode(true);
  };
  const handleOk = async () => {
    setShowModalCode(false);
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณยืนยันที่จะเเก้ไขหรือไม่!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      const data = {
        admin_auto_id,
        admin_id_login: onChangeIDLogin,
        admin_pw_login: onChangePWLogin,
        admin_first_name: onChangeFirstname,
        admin_last_name: onChangeLastName
      };
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putAdmin`, data);
        Swal.fire({
          icon: 'success',
          title: 'คุณได้ทำการเเก้ไขสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          dispatch({ type: 'TURNOFF' });
        }, 2000);
      }
    });
  };

  return (
    <>
      <>
        <IconButton ref={ref} onClick={() => setIsOpen(true)}>
          <Icon icon={moreVerticalFill} width={20} height={20} />
        </IconButton>

        <Menu
          open={isOpen}
          anchorEl={ref.current}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: { width: 200, maxWidth: '100%' }
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={trash2Outline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="Delete"
              primaryTypographyProps={{ variant: 'body2' }}
              onClick={() => deleteRider(admin_auto_id)}
            />
          </MenuItem>

          <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="Edit"
              primaryTypographyProps={{ variant: 'body2' }}
              onClick={() => setDataEditAdmin()}
            />
          </MenuItem>
        </Menu>

        <Dialog
          fullWidth="fullWidth"
          maxWidth="sm"
          open={showModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setShowModalCode(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{onChangeFirstname}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <br />
              <Input
                type="text"
                color="lightBlue"
                size="regular"
                outline
                placeholder="ID"
                defaultValue={onChangeIDLogin}
                onChange={(e) => setonChangeIDLogin(e.target.value)}
              />
              <br />
              <Input
                type="text"
                color="lightBlue"
                size="regular"
                outline
                placeholder="Password"
                defaultValue={onChangePWLogin}
                onChange={(e) => setonChangePWLogin(e.target.value)}
              />

              <br />
              <Input
                type="text"
                color="lightBlue"
                size="regular"
                outline
                placeholder="ชื่อ"
                defaultValue={onChangeFirstname}
                onChange={(e) => setonChangeFirstname(e.target.value)}
              />
              <br />
              <Input
                type="text"
                color="lightBlue"
                size="regular"
                outline
                placeholder="นามสกุล"
                defaultValue={onChangeLastName}
                onChange={(e) => setonChangeLastName(e.target.value)}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="red"
              buttonType="link"
              onClick={() => setShowModalCode(false)}
              ripple="dark"
            >
              ยกเลิก
            </Button>
            <Button color="green" onClick={(e) => handleOk(e)} ripple="light">
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
}
