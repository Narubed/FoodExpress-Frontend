import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import PropTypes from 'prop-types';
// material-tailwind
import '@material-tailwind/react/tailwind.css';
import Input from '@material-tailwind/react/Input';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
// ----------------------------------------------------------------------
TakesOrderMoreMenu.propTypes = {
  id: PropTypes.number
};
export default function TakesOrderMoreMenu(props) {
  // eslint-disable-next-line camelcase
  const { id, rider_first_name, rider_last_name, rider_id_login, rider_pw_login, rider_tel } =
    props;
  const [onChangeFirstname, setonChangeFirstname] = useState('');
  const [onChangeLastName, setonChangeLastName] = useState();
  const [onChangeIDLogin, setonChangeIDLogin] = useState();
  const [onChangePWLogin, setonChangePWLogin] = useState();
  const [onChangeTel, setonChangeTel] = useState();
  const [showModal, setShowModalCode] = useState(false);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const deleteRider = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการลบไรเดอร์คนใหม่หรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/deleteRider/${id}`);
        Swal.fire('Success!', 'คุณได้ลบไรเดอร์เรียบร้อยเเล้ว.', 'success');
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
    });
  };
  const setDataEditRider = async () => {
    setonChangeFirstname(rider_first_name);
    setonChangeLastName(rider_last_name);
    setonChangeIDLogin(rider_id_login);
    setonChangePWLogin(rider_pw_login);
    setonChangeTel(rider_tel);
    setShowModalCode(true);
  };
  const handleOk = async () => {
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
        rider_id: id,
        rider_id_login: onChangeIDLogin,
        rider_pw_login: onChangePWLogin,
        rider_tel: onChangeTel,
        rider_first_name: onChangeFirstname,
        rider_last_name: onChangeLastName
      };
      if (result.isConfirmed) {
        Swal.fire('ยืนยันการเเก้ไข!', 'คุณได้ทำการเเก้ไขสำเร็จ', 'success');
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putRider`, data);
        setShowModalCode(false);
        setTimeout(() => {
          window.location.reload(false);
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
              onClick={() => deleteRider(id)}
            />
          </MenuItem>

          <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="Edit"
              primaryTypographyProps={{ variant: 'body2' }}
              onClick={() => setDataEditRider()}
            />
          </MenuItem>
        </Menu>
        <Modal size="sm" active={showModal} toggler={() => setShowModalCode(false)}>
          <ModalHeader toggler={() => setShowModalCode(false)}>{onChangeFirstname}</ModalHeader>
          <ModalBody>
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
              placeholder="เบอร์โทรศัพท์"
              defaultValue={onChangeTel}
              onChange={(e) => setonChangeTel(e.target.value)}
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
          </ModalBody>
          <ModalFooter>
            <Button
              color="red"
              buttonType="link"
              onClick={(e) => setShowModalCode(false)}
              ripple="dark"
            >
              Close
            </Button>

            <Button color="green" onClick={(e) => handleOk(e)} ripple="light">
              Save
            </Button>
          </ModalFooter>
        </Modal>
      </>
    </>
  );
}
