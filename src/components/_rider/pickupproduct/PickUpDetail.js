/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// material
import {
  Grid,
  Card,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Icon } from '@iconify/react';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import ButtonT from '@material-tailwind/react/Button';
// ----------------------------------------------------------------------
import { alpha, styled } from '@mui/material/styles';

PickUpDetail.propTypes = {
  props: PropTypes.array,
  order_rider_product_name: PropTypes.string
};
const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: 'theme.palette.warning.darker',
  backgroundColor: '#F0FFFF',
  '&:hover': {
    background: '#F0F8FF',
    boxShadow: '10px 10px 4px #F0FFFF'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  }
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function PickUpDetail({ props, OrderRiders }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rider = sessionStorage.getItem('user');
  const filterRider_id = OrderRiders.filter(
    (f) => parseInt(f.order_rider_id, 10) === parseInt(rider, 10)
  );
  const filterStatusOrder = filterRider_id.filter(
    (f) => f.order_rider_status === 'ไรเดอร์รับมอบหมายงานแล้ว'
  );
  const filterNote = filterStatusOrder.filter(
    (value) => value.order_rider_dealer_note === props.order_rider_dealer_note
  );
  console.log(filterNote);
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <ButtonT
              color="lightBlue"
              buttonType="link"
              size="regular"
              rounded
              block={false}
              iconOnly
              ripple="dark"
              onClick={() => setShowModal(true)}
            >
              <Icon icon="flat-color-icons:todo-list" width={30} height={30} />
            </ButtonT>
          </TableCell>
        </TableRow>
      </TableHead>

      <Dialog
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle> ชื่อสินค้า:{props.order_rider_product_name}</DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 350 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อสินค้า</TableCell>
                    <TableCell align="right">จำนวน</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterNote.map((row) => (
                    <TableRow
                      key={row.id_order_rider_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.order_rider_product_name}
                      </TableCell>
                      <TableCell align="right">{row.order_rider_amount}</TableCell>
                      <TableCell align="right">{row.order_rider_currency}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonT
            color="red"
            buttonType="link"
            onClick={(e) => setShowModal(false)}
            ripple="dark"
            danger
          >
            ยกเลิก
          </ButtonT>
        </DialogActions>
      </Dialog>
    </>
  );
}
