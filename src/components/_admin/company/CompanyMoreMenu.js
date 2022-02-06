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
RiderMoreMenu.propTypes = {
  id: PropTypes.number
};
export default function RiderMoreMenu(props) {
  // eslint-disable-next-line camelcase
  const { id, company_name, company_tel, book_name, book_number, company_address } = props;
  const [onChangeCompanyName, setonChangeCompanyName] = useState('');
  const [onChangeTel, setonChangeTel] = useState();
  const [onChangeBookName, setonChangeBookName] = useState();
  const [onChangeBookNumber, setonChangeBookNumber] = useState();
  const [onChangeAddress, setonChangeAddress] = useState();
  const [showModal, setShowModalCode] = useState(false);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const deleteRider = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการลบบริษัทหรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/deleteCompany/${id}`);
        Swal.fire('Success!', 'คุณได้ลบบริษัทเรียบร้อยเเล้ว.', 'success');
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
    });
  };
  const setDataEditCompany = async () => {
    setonChangeCompanyName(company_name);
    setonChangeTel(company_tel);
    setonChangeBookName(book_name);
    setonChangeBookNumber(book_number);
    setonChangeAddress(company_address);
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
        company_id: id,
        company_name: onChangeCompanyName,
        company_tel: onChangeTel,
        book_name: onChangeBookName,
        book_number: onChangeBookNumber,
        company_address: onChangeAddress
      };
      if (result.isConfirmed) {
        Swal.fire('ยืนยันการเเก้ไข!', 'คุณได้ทำการเเก้ไขสำเร็จ', 'success');
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putCompany`, data);
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
              onClick={() => setDataEditCompany()}
            />
          </MenuItem>
        </Menu>
        <Modal size="lg" active={showModal} toggler={() => setShowModalCode(false)}>
          <ModalHeader toggler={() => setShowModalCode(false)}>{onChangeCompanyName}</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              color="lightBlue"
              size="regular"
              outline
              placeholder="ชื่อบริษัท"
              defaultValue={onChangeCompanyName}
              onChange={(e) => setonChangeCompanyName(e.target.value)}
            />
            <br />
            <div>
              <Input
                type="text"
                color="lightBlue"
                size="regular"
                outline
                placeholder="เบอร์โทรศัพท์"
                defaultValue={onChangeTel}
                onChange={(e) => setonChangeTel(e.target.value)}
              />
            </div>

            <br />
            <Input
              type="text"
              color="lightBlue"
              size="regular"
              outline
              placeholder="ชื่อธนาคาร"
              defaultValue={onChangeBookName}
              onChange={(e) => setonChangeBookName(e.target.value)}
            />
            <br />
            <Input
              type="text"
              color="lightBlue"
              size="regular"
              outline
              placeholder="เลขบัญญชีธนาคาร"
              defaultValue={onChangeBookNumber}
              onChange={(e) => setonChangeBookNumber(e.target.value)}
            />
            <br />
            <Input
              type="text"
              color="lightBlue"
              size="regular"
              outline
              placeholder="ที่อยู่บริษัท"
              defaultValue={onChangeAddress}
              onChange={(e) => setonChangeAddress(e.target.value)}
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
