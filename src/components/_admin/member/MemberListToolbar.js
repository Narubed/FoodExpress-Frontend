import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

MemberListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selected_id: PropTypes.array,
  Memberlist: PropTypes.array
};

export default function MemberListToolbar({
  numSelected,
  filterName,
  onFilterName,
  // eslint-disable-next-line camelcase
  selected_id,
  Memberlist
}) {
  const dispatch = useDispatch();
  const deleteMember = async () => {
    const filteredsMember = [];
    await selected_id.forEach((element) => {
      const filteredsMembers = Memberlist.filter((value) => value.id === element);
      filteredsMember.push(filteredsMembers[0]);
    });
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการลบผู้ใช้ทั้งหมดนี้หรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        filteredsMember.map(
          async (value) =>
            // eslint-disable-next-line no-return-await
            await axios.delete(
              `${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${value.bookBankImg}`
            )
        );
        filteredsMember.map(
          async (value) =>
            // eslint-disable-next-line no-return-await
            await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${value.cardImg}`)
        );
        filteredsMember.map(
          async (value) =>
            // eslint-disable-next-line no-return-await
            await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/memberId/${value.id}`)
        );
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
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search Member..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Icon icon={trash2Fill} onClick={() => deleteMember()} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Icon icon={roundFilterList} />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
