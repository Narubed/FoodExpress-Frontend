/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
// material
import { visuallyHidden } from '@mui/utils';
import {
  TableRow,
  TableCell,
  TableHead,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Button
} from '@mui/material';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';

// import Button from '@material-tailwind/react/Button';
// ----------------------------------------------------------------------
CheckRemaining.propTypes = {
  props: PropTypes.array,
  id_order_rider_id: PropTypes.string
};

export default function CheckRemaining({ props }) {
  const dispatch = useDispatch();
  const onClickCheckStatusOrder = () => {
    const data = {
      id_order_rider_id: props.id_order_rider_id,
      order_rider_status: 'ไรเดอร์จัดส่งของสำเร็จ'
    };
    Swal.fire({
      title: 'คุณต้องการเปลี่ยนสถานะหรือไม่ ?',
      text: 'หากยืนยันการส่งเเล้ว จะไม่สามารถเปลี่ยนกลับได้อีก!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire('ยืนยันการเเก้ไข!', 'คุณได้เปลี่ยนสถานะของออเดอร์นี้เเล้ว.', 'success');
        dispatch({ type: 'OPEN' });
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putStatusOrderRider`, data);
        // putStatusOrderRider
        setTimeout(() => {
          dispatch({ type: 'TURNOFF' });
        }, 1500);
      }
    });
  };
  return (
    <>
      <Button onClick={() => onClickCheckStatusOrder()} ripple="dark">
        <Icon icon="emojione:ballot-box-with-check" width={24} height={24} />
      </Button>
    </>
  );
}
