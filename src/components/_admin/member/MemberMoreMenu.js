import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
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
  const { id, cardImg, bookBankImg } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const deleteProduct = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการลบผู้ใช้หรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/memberId/${id}`);
        await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${cardImg}`);
        await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${bookBankImg}`);
        Swal.fire('Success!', 'คุณได้ลบผู้ใช้เรียบร้อยเเล้ว.', 'success');
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
    });
  };
  const setDataEditMember = async () => {
    const Member = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getMemberByid/${id}`);
    const MemberlistID = Member.data.data;
    const getApi = await axios.get(
      'https://codebee.co.th/labs/examples/autoprovince/json/provinces.json'
    );
    const getApiAmphure = await axios.get(
      'https://codebee.co.th/labs/examples/autoprovince/json/amphures.json'
    );
    const getApitombon = await axios.get(
      'https://codebee.co.th/labs/examples/autoprovince/json/districts.json'
    );

    const filterProvince = getApi.data.filter((e) => e.province_name === MemberlistID.province);
    const filterDistrict = getApiAmphure.data.filter(
      async (e) => (await e.amphur_name) === (await MemberlistID.district)
    );
    const filterSubdistrict = getApitombon.data.filter(
      async (e) => (await e.district_name) === (await MemberlistID.subdistrict)
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
    console.log(Member.data.data);
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
