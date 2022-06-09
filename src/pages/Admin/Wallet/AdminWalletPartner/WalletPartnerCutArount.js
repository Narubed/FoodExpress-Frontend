/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Image from '@material-tailwind/react/Image';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@mui/material';

WalletCutArount.propTypes = {
  wallet_id: PropTypes.string
};
// {
//   numeral(wallet_member_total).format('0,0.000');
// }
// {
//   numeral((row.row.wallet_member_total * 3) / 103).format('0,0.000');
// }
// {
//   numeral(wallet_member_total - (wallet_member_total * 3) / 103).format('0,0.000');
// }

// eslint-disable-next-line camelcase
export default function WalletCutArount(row) {
  const dispatch = useDispatch();
  const cutArountCommission = async () => {
    const dataPutWallet = {
      wallet_partner_total: 0
    };
    const dataPostReport = {
      wpr_partner_id: row.row._id,
      wpr_partner_total: row.row.wallet_partner_total
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการตัดรอบค่าคอมมิชชั่นนี้หรือไหม !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง!',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        await axios.put(
          `${process.env.REACT_APP_PARTNER_API}/wallet_partner/${row.row.wallet_id}`,
          dataPutWallet
        );
        await axios.post(
          `${process.env.REACT_APP_PARTNER_API}/wallet_partner/wallet_partner_report`,
          dataPostReport
        );
        dispatch({ type: 'TURNOFF' });

        Swal.fire({
          icon: 'success',
          title: 'ยืนยันการตัดรอบ',
          text: 'คุณได้ทำการตัดรอบค่าคอมมิชชั่นเเล้ว',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  };
  return (
    <div>
      <Tooltip title="ตัดรอบการจ่ายเงินรอบนี้">
        <Button
          onClick={() => cutArountCommission()}
          color="lightBlue"
          buttonType="link"
          size="regular"
          rounded
          block={false}
          iconOnly
          ripple="dark"
        >
          <Icon icon="twemoji:ballot-box-with-ballot" width={22} height={22} />
        </Button>
      </Tooltip>
    </div>
  );
}
