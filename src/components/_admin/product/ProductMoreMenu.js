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

import Button from '@material-tailwind/react/Button';
// ----------------------------------------------------------------------
ProductMoreMenu.propTypes = {
  id: PropTypes.number
};
export default function ProductMoreMenu(props) {
  // eslint-disable-next-line camelcase
  const {
    id,
    productid,
    productName,
    productPrice,
    productCost,
    productImg,
    productStetus,
    unitkg,
    currency,
    nameproducttype
  } = props;

  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const deleteProduct = (productid) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการลบสินค้าชิ้นนี้หรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/product/${productid}`);
        await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${productImg}`);
        Swal.fire('Success!', 'คุณได้ลบสินค้าเรียบร้อยเเล้ว.', 'success');
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
    });
  };
  const setDataEditProduct = async () => {
    localStorage.setItem('id', id);
    localStorage.setItem('productid', productid);
    localStorage.setItem('productName', productName);
    localStorage.setItem('productPrice', productPrice);
    localStorage.setItem('productCost', productCost);
    localStorage.setItem('productImg', productImg);
    localStorage.setItem('productStetus', productStetus);
    localStorage.setItem('unitkg', unitkg);
    localStorage.setItem('currency', currency);
    localStorage.setItem('nameproducttype', nameproducttype);
  };
  // const handleOk = async () => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'คุณยืนยันที่จะเเก้ไขหรือไม่!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes !'
  //   }).then(async (result) => {
  //     const data = {
  //       company_id: id,
  //       company_name: onChangeCompanyName,
  //       company_tel: onChangeTel,
  //       book_name: onChangeBookName,
  //       book_number: onChangeBookNumber,
  //       company_address: onChangeAddress
  //     };
  //     if (result.isConfirmed) {
  //       Swal.fire('ยืนยันการเเก้ไข!', 'คุณได้ทำการเเก้ไขสำเร็จ', 'success');
  //       await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putCompany`, data);
  //       setShowModalCode(false);
  //       setTimeout(() => {
  //         window.location.reload(false);
  //       }, 2000);
  //     }
  //   });
  // };

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
              onClick={() => deleteProduct(productid)}
            />
          </MenuItem>

          <MenuItem
            component={RouterLink}
            to="/admin/AdminProductApp/AdminEditProductApp"
            sx={{ color: 'text.secondary' }}
          >
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>

            <ListItemText
              primary="Edit"
              primaryTypographyProps={{ variant: 'body2' }}
              onClick={() => setDataEditProduct()}
            />
          </MenuItem>
        </Menu>
      </>
    </>
  );
}
