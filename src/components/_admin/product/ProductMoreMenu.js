import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
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
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

import Button from '@material-tailwind/react/Button';
// ----------------------------------------------------------------------
ProductMoreMenu.propTypes = {
  id: PropTypes.number,
  productid: PropTypes.string,
  productName: PropTypes.string,
  productPrice: PropTypes.number,
  productCost: PropTypes.number,
  productImg: PropTypes.string,
  productStetus: PropTypes.string,
  unitkg: PropTypes.number,
  currency: PropTypes.string,
  nameproducttype: PropTypes.string
};
export default function ProductMoreMenu(props) {
  const dispatch = useDispatch();
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
        dispatch({ type: 'OPEN' });
        await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/product/${productid}`);
        await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${productImg}`);
        Swal.fire({
          icon: 'success',
          title: 'คุณได้ลบสินค้าเรียบร้อยเเล้ว',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          dispatch({ type: 'TURNOFF' });
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
