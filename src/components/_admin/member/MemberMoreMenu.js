import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import PropTypes from 'prop-types';
// material-tailwind
import '@material-tailwind/react/tailwind.css';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

// ----------------------------------------------------------------------
MemberMoreMenu.propTypes = {
  id: PropTypes.number,
  cardImg: PropTypes.string,
  bookBankImg: PropTypes.string
};
export default function MemberMoreMenu(props) {
  const dispatch = useDispatch();
  const { id, cardImg, bookBankImg } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const deleteProduct = (id) => {
    const dataDeleteImage = [];
    dataDeleteImage.push(cardImg);
    dataDeleteImage.push(bookBankImg);
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการลบผู้ใช้หรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/memberId/${id}`);
        dataDeleteImage.map(async (value) => {
          await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${value}`);
        });

        Swal.fire({
          icon: 'success',
          title: 'คุณได้ลบผู้ใช้เรียบร้อยเเล้ว',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          dispatch({ type: 'TURNOFF' });
        }, 1500);
      }
    });
  };
  const setDataEditMember = async () => {
    const Member = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getMemberByid/${id}`);
    const MemberlistID = Member.data.data;
    const tokenKey = {
      tokenKey: process.env.REACT_APP_TOKEN_KEY
    };
    const getApi = await axios.post(`${process.env.REACT_APP_WEB_GEO}/provinces`, tokenKey);
    const getApiAmphure = await axios.post(`${process.env.REACT_APP_WEB_GEO}/amphures`, tokenKey);
    const getApitombon = await axios.post(`${process.env.REACT_APP_WEB_GEO}/districts`, tokenKey);
    console.log(getApitombon.data);
    const filterProvince = await getApi.data.data.filter(
      (e) => e.province_name === MemberlistID.province
      // e.province_name === MemberlistID.province
    );
    const filterDistrict = await getApiAmphure.data.data.filter(
      (e) => e.amphur_name === MemberlistID.district
    );

    const filterSubdistrict = await getApitombon.data.data.filter(
      (e) => e.district_name === MemberlistID.subdistrict
    );

    localStorage.setItem('id', MemberlistID.id);
    localStorage.setItem('password', MemberlistID.password);
    localStorage.setItem('email', MemberlistID.email);
    localStorage.setItem('firstname', MemberlistID.firstname);
    localStorage.setItem('lastname', MemberlistID.lastname);
    localStorage.setItem('tel', MemberlistID.tel);
    localStorage.setItem('bookname', MemberlistID.bookname);
    localStorage.setItem('booknumber', MemberlistID.booknumber);
    localStorage.setItem('role', MemberlistID.role);
    localStorage.setItem('address', MemberlistID.address);
    localStorage.setItem('subdistrict', filterSubdistrict[0].district_id);
    localStorage.setItem('district', filterDistrict[0].amphur_id);
    localStorage.setItem('province', filterProvince[0].province_id);
    localStorage.setItem('EditMemberId', MemberlistID.id);
    localStorage.setItem('map', MemberlistID.map);
    localStorage.setItem('userId', MemberlistID.userId);
    localStorage.setItem('status', MemberlistID.status);
    localStorage.setItem('bookBankImg', MemberlistID.bookBankImg);
    localStorage.setItem('cardImg', MemberlistID.cardImg);
    localStorage.setItem('level', MemberlistID.level);
    localStorage.setItem('subdistrict-name', filterSubdistrict[0].district_name);
    localStorage.setItem('district-name', filterDistrict[0].amphur_name);
    localStorage.setItem('province-name', filterProvince[0].province_name);
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
              onClick={() => deleteProduct(id)}
            />
          </MenuItem>

          <MenuItem
            // eslint-disable-next-line no-return-await
            onClick={async () => await setDataEditMember()}
            component={RouterLink}
            to="/admin/AdminMemberApp/AdminEditMemberApp"
            sx={{ color: 'text.secondary' }}
          >
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>

            <ListItemText
              primary="Edit"
              primaryTypographyProps={{ variant: 'body2' }}
              // onClick={async () => await setDataEditMember()}
            />
          </MenuItem>
        </Menu>
      </>
    </>
  );
}
